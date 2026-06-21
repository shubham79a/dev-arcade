import { db } from "@/config/db";
import { CourseChaptersTable, CourseTable, EnrolledCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
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

        return NextResponse.json(
            {
                ...result[0],
                chapters: chapterResult,
                userEnrolled: isEnrolledCourse,
                courseEnrolledInfo: enrolledCourse
            }
        );
    }
    else {
        // fetch all courses at once
        const result = (await db.select().from(CourseTable));
        return NextResponse.json({ result });
    }
}

