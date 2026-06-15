import { db } from "@/config/db";
import { CourseTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseid');

    if (courseId) {
        //@ts-ignore
        const result = await db.select().from(CourseTable).where(eq(CourseTable.courseId, courseId));
        return NextResponse.json(result[0]);
    }
    else {
        // fetch all courses at once
        const result = (await db.select().from(CourseTable));
        return NextResponse.json({ result });
    }
}

