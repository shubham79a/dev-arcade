import { db } from "@/config/db";
import { EnrolledCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { courseId } = await req.json();
    const user = await currentUser();

    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const result = await db.insert(EnrolledCourseTable).values(
        {
            courseId: courseId,
            userId: email,
            xpEarned: 0
        }
    ).onConflictDoNothing().returning();

    // Already enrolled — return the existing enrollment instead of creating a duplicate
    if (result.length === 0) {
        const existing = await db.select().from(EnrolledCourseTable)
            .where(and(eq(EnrolledCourseTable.courseId, courseId), eq(EnrolledCourseTable.userId, email)));
        return NextResponse.json(existing);
    }

    return NextResponse.json(result);
}