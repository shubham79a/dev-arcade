import { db } from "@/config/db";
import { CourseChaptersTable, CourseTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseid');

    if (courseId) {
        //@ts-ignore
        const result = await db.select().from(CourseTable).where(eq(CourseTable.courseId, courseId));

        //@ts-ignore
        const chapterResult = await db.select().from(CourseChaptersTable).where(eq(CourseChaptersTable.courseId, courseId))

        return NextResponse.json(
            {
                ...result[0],
                chapters: chapterResult
            }
        );
    }
    else {
        // fetch all courses at once
        const result = (await db.select().from(CourseTable));
        return NextResponse.json({ result });
    }
}

