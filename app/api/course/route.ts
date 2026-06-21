import { db } from "@/config/db";
import { CompletedExerciseTable, CourseChaptersTable, CourseTable, EnrolledCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseid');
    const user = await currentUser();

    if (courseId) {
        //@ts-ignore
        const result = await db.select().from(CourseTable).where(eq(CourseTable.courseId, courseId));

        //@ts-ignore
        const chapterResult = await db.select().from(CourseChaptersTable).where(eq(CourseChaptersTable.courseId, courseId))
        //@ts-ignore
        const enrolledCourse = await db.select().from(EnrolledCourseTable).where(and(eq(EnrolledCourseTable.courseId, courseId), (eq(EnrolledCourseTable.userId, user?.primaryEmailAddress?.emailAddress)))
        )

        const isEnrolledCourse = enrolledCourse.length > 0 ? true : false;

        // @ts-ignore
        const completedExercises = await db.select().from(CompletedExerciseTable).where(and(eq(CompletedExerciseTable.courseId, courseId), eq(CompletedExerciseTable.userId, user?.primaryEmailAddress?.emailAddress).order))
            .orderBy(desc(CompletedExerciseTable.courseId), desc(CompletedExerciseTable.exerciseId));

        return NextResponse.json(
            {
                ...result[0],
                chapters: chapterResult,
                userEnrolled: isEnrolledCourse,
                courseEnrolledInfo: enrolledCourse,
                completedExercises: completedExercises
            }
        );
    }
    else {
        // fetch all courses at once
        const result = (await db.select().from(CourseTable));
        return NextResponse.json({ result });
    }
}

