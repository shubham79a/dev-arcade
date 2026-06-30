import { db } from "@/config/db";
import { CompletedExerciseTable, CourseChaptersTable, EnrolledCourseTable, ExerciseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

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
    // @ts-ignore
    const enrolledCourse = await db.select().from(EnrolledCourseTable).where(and(eq(EnrolledCourseTable.courseId, courseIdNum), eq(EnrolledCourseTable.userId, email)));

    if (enrolledCourse.length === 0) {
        return NextResponse.json({ error: "Please enroll in the course first", enrolled: false }, { status: 403 });
    }

    // @ts-ignore
    const courseResult = await db.select().from(CourseChaptersTable).where(and(eq(CourseChaptersTable.courseId, courseIdNum), eq(CourseChaptersTable.chapterId, chapterIdNum)));

    // @ts-ignore
    const exerciseResult = await db.select().from(ExerciseTable).where(and(eq(ExerciseTable.courseId, courseIdNum), eq(ExerciseTable.exerciseId, exerciseId)));

    // @ts-ignore
    const completedExercise = await db.select().from(CompletedExerciseTable).where(and(eq(CompletedExerciseTable.courseId, courseIdNum), eq(CompletedExerciseTable.chapterId, chapterIdNum), eq(CompletedExerciseTable.userId, email)));

    return NextResponse.json({
        ...courseResult[0],
        exerciseData: exerciseResult[0],
        completedExercise: completedExercise,
    })

}