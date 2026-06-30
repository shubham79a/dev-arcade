import { db } from "@/config/db";
import { CompletedExerciseTable, EnrolledCourseTable, usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { courseId, chapterId, exerciseId, xpEarned } = await req.json();

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is enrolled in the course
    // @ts-ignore
    const enrolledCourse = await db.select().from(EnrolledCourseTable).where(and(eq(EnrolledCourseTable.courseId, courseId), eq(EnrolledCourseTable.userId, email)));

    if (enrolledCourse.length === 0) {
        return NextResponse.json({ error: "Please enroll in the course first", enrolled: false }, { status: 403 });
    }
    // Check if exercise is already completed by this user
    // @ts-ignore
    const alreadyCompleted = await db.select().from(CompletedExerciseTable).where(and(eq(CompletedExerciseTable.courseId, courseId), eq(CompletedExerciseTable.chapterId, chapterId), eq(CompletedExerciseTable.exerciseId, exerciseId), eq(CompletedExerciseTable.userId, email)));

    if (alreadyCompleted.length > 0) {
        return NextResponse.json({ error: "Exercise already completed" }, { status: 409 });
    }

    const result = await db.insert(CompletedExerciseTable).values({
        chapterId: chapterId,
        courseId: courseId,
        exerciseId: exerciseId,
        userId: email,
    }).returning();

    // update course xp earned (filter by both courseId and userId)
    // @ts-ignore
    await db.update(EnrolledCourseTable).set({
        xpEarned: sql`${EnrolledCourseTable.xpEarned} + ${xpEarned}`
    }).where(and(eq(EnrolledCourseTable.courseId, courseId), eq(EnrolledCourseTable.userId, email)))

    // update user earned points
    await db.update(usersTable).set({
        points: sql`${usersTable.points} + ${xpEarned}`
    }).where(eq(usersTable.email, email))

    return NextResponse.json(result);
}