import { db } from "@/config/db";
import { CompletedExerciseTable, EnrolledCourseTable, usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { point } from "drizzle-orm/pg-core";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { courseId, chapterId, exerciseId, xpEarned } = await req.json();

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await db.insert(CompletedExerciseTable).values({
        chapterId: chapterId,
        courseId: courseId,
        exerciseId: exerciseId,
        userId: email,
    }).returning();

    // update course xp earned
    // @ts-ignore
    await db.update(EnrolledCourseTable).set({
        xpEarned: sql`${EnrolledCourseTable.xpEarned} + ${xpEarned}`
    }).where(eq(EnrolledCourseTable.courseId, courseId))

    // update user earned points
    await db.update(usersTable).set({
        points: sql`${usersTable.points} + ${xpEarned}`
    }).where(eq(usersTable.email, email))

    return NextResponse.json(result);
}