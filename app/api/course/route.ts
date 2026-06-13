import { db } from "@/config/db";
import { CourseTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    // fetch all courses at once
    const result = (await db.select().from(CourseTable));

    return NextResponse.json({ result });
}
