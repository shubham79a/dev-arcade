import { db } from "@/config/db";
import { CourseChaptersTable } from "@/config/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq, lt } from "drizzle-orm";

// The first FREE_CHAPTERS chapters of each course are free; the rest need the Pro plan
export const FREE_CHAPTERS = 2;
export const PRO_PLAN = "unlimited";

// Server-side check matching the Pro gating shown in CourseChapters
export async function canAccessChapter(courseId: number, chapterId: number): Promise<boolean> {
    const { has } = await auth();
    if (has({ plan: PRO_PLAN })) return true;

    const chapter = await db.select({ orderIndex: CourseChaptersTable.orderIndex })
        .from(CourseChaptersTable)
        .where(and(eq(CourseChaptersTable.id, chapterId), eq(CourseChaptersTable.courseId, courseId)));

    if (chapter.length === 0) return false;

    // Position of this chapter within the course (chapters are shown sorted by orderIndex)
    const earlierChapters = await db.select({ id: CourseChaptersTable.id })
        .from(CourseChaptersTable)
        .where(and(eq(CourseChaptersTable.courseId, courseId), lt(CourseChaptersTable.orderIndex, chapter[0].orderIndex)));

    return earlierChapters.length < FREE_CHAPTERS;
}
