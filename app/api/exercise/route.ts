import { db } from "@/config/db";
import { CompletedExerciseTable, CourseChaptersTable, ExerciseTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {

    const { courseId, chapterId, exerciseId } = await req.json();

    const courseIdNum = Number(courseId);
    const chapterIdNum = Number(chapterId);

    // @ts-ignore
    const courseResult = await db.select().from(CourseChaptersTable).where(and(eq(CourseChaptersTable.courseId, courseIdNum), eq(CourseChaptersTable.chapterId, chapterIdNum)));

    // @ts-ignore
    const exerciseResult = await db.select().from(ExerciseTable).where(and(eq(ExerciseTable.courseId, courseIdNum), eq(ExerciseTable.exerciseId, exerciseId)));

    // console.log(exerciseResult);

    const completedExercise = await db.select().from(CompletedExerciseTable).where(and(eq(CompletedExerciseTable.courseId, courseIdNum), eq(CompletedExerciseTable.chapterId, chapterIdNum)));

    return NextResponse.json({
        ...courseResult[0],
        exerciseData: exerciseResult[0],
        completedExercise: completedExercise,
    })

}