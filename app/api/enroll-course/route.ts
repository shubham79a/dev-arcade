import { db } from "@/config/db";
import { EnrolledCourseTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
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
    ).returning();

    return NextResponse.json(result);
}