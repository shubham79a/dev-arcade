import { db } from "@/config/db";
import { CompletedExerciseTable, CourseChaptersTable, CourseTable, EnrolledCourseTable, ExerciseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { and, asc, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {

    const { courseId, chapterId, exerciseId } = await req.json();
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courseIdNum = Number(courseId);
    const chapterIdNum = Number(chapterId);

    // Check if user is enrolled in the course
    const enrolledCourse = await db.select().from(EnrolledCourseTable).where(and(eq(EnrolledCourseTable.courseId, courseIdNum), eq(EnrolledCourseTable.userId, email)));

    if (enrolledCourse.length === 0) {
        return NextResponse.json({ error: "Please enroll in the course first", enrolled: false }, { status: 403 });
    }

    const courseInfo = await db.select().from(CourseTable).where(eq(CourseTable.id, courseIdNum))

    const courseResult = await db.select().from(CourseChaptersTable).where(and(eq(CourseChaptersTable.courseId, courseIdNum), eq(CourseChaptersTable.id, chapterIdNum)));

    // Query exercise by slug
    const exerciseResult = await db.select().from(ExerciseTable).where(and(eq(ExerciseTable.courseId, courseIdNum), eq(ExerciseTable.slug, exerciseId)));

    const completedExercise = await db.select().from(CompletedExerciseTable).where(and(eq(CompletedExerciseTable.courseId, courseIdNum), eq(CompletedExerciseTable.chapterId, chapterIdNum), eq(CompletedExerciseTable.userId, email)));

    // Fetch all exercises for this chapter (for navigation/sidebar)
    const chapterExercises = await db.select({
        id: ExerciseTable.id,
        name: ExerciseTable.name,
        slug: ExerciseTable.slug,
        xp: ExerciseTable.xp,
        difficulty: ExerciseTable.difficulty,
        orderIndex: ExerciseTable.orderIndex,
    }).from(ExerciseTable)
    .where(and(
        eq(ExerciseTable.courseId, courseIdNum),
        eq(ExerciseTable.chapterId, chapterIdNum)
    ))
    .orderBy(asc(ExerciseTable.orderIndex));

    return NextResponse.json({
        ...courseResult[0],
        exercises: chapterExercises,
        exerciseData: exerciseResult[0],
        completedExercise: completedExercise,
        editorType: courseInfo[0].editorType
    })

}