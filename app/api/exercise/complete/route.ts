import { db } from "@/config/db";
import { getLanguageConfig } from "@/config/languages";
import { CompletedExerciseTable, CourseTable, EnrolledCourseTable, ExerciseTable, usersTable } from "@/config/schema";
import { JUDGE0_ACCEPTED, Judge0Error, runOnJudge0 } from "@/lib/judge0";
import { canAccessChapter } from "@/lib/premium";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Supports a leading inline flag group like "(?i)" (PCRE style), which JS RegExp rejects
const toRegExp = (pattern: string) => {
    const inlineFlags = pattern.match(/^\(\?([imsu]+)\)/);
    if (inlineFlags) {
        return new RegExp(pattern.slice(inlineFlags[0].length), inlineFlags[1]);
    }
    return new RegExp(pattern);
}

// Ignore line-ending differences and trailing whitespace when comparing program output
const normalizeOutput = (output: string) =>
    output.replace(/\r\n/g, "\n").split("\n").map(line => line.trimEnd()).join("\n").trimEnd();

export async function POST(req: NextRequest) {
    const { exerciseId, usedHint, files } = await req.json();

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!exerciseId || typeof files !== "object" || files === null) {
        return NextResponse.json({ error: "Missing required fields: exerciseId, files" }, { status: 400 });
    }

    // Course and chapter come from the exercise row, not the client
    const exerciseResult = await db.select({
        exercise: ExerciseTable,
        editorType: CourseTable.editorType,
    }).from(ExerciseTable)
        .innerJoin(CourseTable, eq(ExerciseTable.courseId, CourseTable.id))
        .where(eq(ExerciseTable.id, Number(exerciseId)));

    if (exerciseResult.length === 0) {
        return NextResponse.json({ error: "Exercise not found" }, { status: 404 });
    }

    const { exercise, editorType } = exerciseResult[0];

    // Check if user is enrolled in the course
    const enrolledCourse = await db.select().from(EnrolledCourseTable).where(and(eq(EnrolledCourseTable.courseId, exercise.courseId), eq(EnrolledCourseTable.userId, email)));

    if (enrolledCourse.length === 0) {
        return NextResponse.json({ error: "Please enroll in the course first", enrolled: false }, { status: 403 });
    }

    if (!(await canAccessChapter(exercise.courseId, exercise.chapterId))) {
        return NextResponse.json({ error: "Upgrade to Pro to unlock this chapter", premium: true }, { status: 402 });
    }

    const sources: Record<string, string> = {};
    for (const [path, code] of Object.entries(files)) {
        if (typeof code === "string") sources[path] = code;
    }

    // Validate the submission before awarding XP
    const langConfig = getLanguageConfig(editorType);

    if (exercise.validationRegex) {
        const allCode = Object.values(sources).join("\n");
        if (!toRegExp(exercise.validationRegex).test(allCode)) {
            return NextResponse.json({ error: "Your code doesn't meet the task requirements yet. Check the task and try again." }, { status: 422 });
        }
    } else if (exercise.expectedOutput && langConfig) {
        const sourcePath = Object.keys(sources).find(path =>
            langConfig.extensions.some(ext => path.endsWith("." + ext)));

        if (!sourcePath) {
            return NextResponse.json({ error: `No ${langConfig.displayName} file found in your submission` }, { status: 400 });
        }

        try {
            const run = await runOnJudge0(sources[sourcePath], langConfig.judge0Id);

            if (run.status?.id !== JUDGE0_ACCEPTED) {
                return NextResponse.json({ error: `Your code didn't run successfully (${run.status?.description}). Fix the errors and try again.` }, { status: 422 });
            }

            if (normalizeOutput(run.stdout) !== normalizeOutput(exercise.expectedOutput)) {
                return NextResponse.json({ error: "Output doesn't match the expected result. Run your code and compare it with the task." }, { status: 422 });
            }
        } catch (error) {
            if (error instanceof Judge0Error) {
                console.error("Judge0 API error:", error.status, error.details);
            } else {
                console.error("Judge0 execution error:", error);
            }
            return NextResponse.json({ error: "Could not check your code right now. Please try again." }, { status: 502 });
        }
    }

    const xpEarned = usedHint
        ? Math.max(0, exercise.xp - (exercise.hintXpPenalty || 0))
        : exercise.xp;

    // Unique (userId, exerciseId) index makes this safe against double submits
    const result = await db.insert(CompletedExerciseTable).values({
        chapterId: exercise.chapterId,
        courseId: exercise.courseId,
        exerciseId: exercise.id,
        userId: email,
        usedHint: usedHint || false,
        xpAwarded: xpEarned,
    }).onConflictDoNothing().returning();

    if (result.length === 0) {
        return NextResponse.json({ error: "Exercise already completed" }, { status: 409 });
    }

    // Update course xp and user points
    await db.update(EnrolledCourseTable).set({
        xpEarned: sql`${EnrolledCourseTable.xpEarned} + ${xpEarned}`
    }).where(and(eq(EnrolledCourseTable.courseId, exercise.courseId), eq(EnrolledCourseTable.userId, email)));

    await db.update(usersTable).set({
        points: sql`${usersTable.points} + ${xpEarned}`
    }).where(eq(usersTable.email, email));

    return NextResponse.json(result);
}
