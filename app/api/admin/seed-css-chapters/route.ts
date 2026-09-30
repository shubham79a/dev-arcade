import { db } from "@/config/db";
import { CourseChaptersTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getCourseIdParam, requireAdmin } from "@/lib/admin";

const DEFAULT_CSS_COURSE_ID = 3; // override with ?courseId=

const CHAPTERS = [
    { id: 1, name: "Introduction to CSS", desc: "Learn how CSS works — inline, internal, and external stylesheets. Your first taste of styling." },
    { id: 2, name: "Selectors & Specificity", desc: "Target HTML elements precisely with element, class, ID, and combinators." },
    { id: 3, name: "Colors & Backgrounds", desc: "Work with hex, RGB, HSL colors, gradients, and background images." },
    { id: 4, name: "Typography & Text", desc: "Style text with fonts, size, weight, spacing, alignment, and Google Fonts." },
    { id: 5, name: "The Box Model", desc: "Understand content, padding, border, and margin — the foundation of CSS layout." },
    { id: 6, name: "Margins, Padding & Borders", desc: "Master spacing, border styles, border-radius, and box-shadow." },
    { id: 7, name: "Display & Visibility", desc: "Control element rendering with block, inline, inline-block, none, and visibility." },
    { id: 8, name: "Positioning", desc: "Place elements precisely with static, relative, absolute, fixed, and sticky positioning." },
    { id: 9, name: "Flexbox Layout", desc: "Build flexible one-dimensional layouts with display: flex and its powerful properties." },
    { id: 10, name: "CSS Grid Layout", desc: "Create two-dimensional layouts with grid rows, columns, gaps, and areas." },
    { id: 11, name: "Responsive Design", desc: "Make websites adapt to any screen size with media queries, relative units, and mobile-first design." },
    { id: 12, name: "Transitions & Animations", desc: "Bring elements to life with smooth transitions, keyframe animations, and hover effects." },
];

export async function GET(req: NextRequest) {
    const denied = await requireAdmin();
    if (denied) return denied;

    const CSS_COURSE_ID = getCourseIdParam(req, DEFAULT_CSS_COURSE_ID);

    try {
        for (const chapter of CHAPTERS) {
            // Skip chapters that already exist so re-running doesn't create duplicates
            const existing = await db.select({ id: CourseChaptersTable.id }).from(CourseChaptersTable)
                .where(and(eq(CourseChaptersTable.courseId, CSS_COURSE_ID), eq(CourseChaptersTable.orderIndex, chapter.id)));
            if (existing.length > 0) continue;

            await db.insert(CourseChaptersTable).values({
                courseId: CSS_COURSE_ID,
                orderIndex: chapter.id,
                name: chapter.name,
                desc: chapter.desc,
            });
        }

        return NextResponse.json({
            message: "CSS chapters seeded successfully",
            courseId: CSS_COURSE_ID,
            chaptersCount: CHAPTERS.length
        });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
