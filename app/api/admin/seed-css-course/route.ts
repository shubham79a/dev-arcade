import { db } from "@/config/db";
import { CourseTable, CourseChaptersTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";

const COURSE = {
    title: "CSS Beginner",
    desc: "Master styling web pages from scratch. Learn about colors, typography, box model, flexbox, grid, responsive design, and animations.",
    bannerImage: "https://ik.imagekit.io/shubham79/css-banner.png",
    level: "Beginner",
    tags: "CSS,Web Development,Frontend",
    editorType: "static"
};

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

    try {
        // 1. Get or Insert the CSS course
        let courseId;
        const existingCourse = await db.select({ id: CourseTable.id }).from(CourseTable).where(eq(CourseTable.title, COURSE.title));

        if (existingCourse.length > 0) {
            courseId = existingCourse[0].id;
        } else {
            const courseResult = await db.insert(CourseTable).values({
                title: COURSE.title,
                desc: COURSE.desc,
                bannerImage: COURSE.bannerImage,
                level: COURSE.level,
                tags: COURSE.tags,
                editorType: COURSE.editorType,
            }).returning();
            courseId = courseResult[0].id;
        }

        // 2. Insert or Update chapters for this course
        for (const chapter of CHAPTERS) {
            const existingChapter = await db.select({ id: CourseChaptersTable.id })
                .from(CourseChaptersTable)
                .where(and(
                    eq(CourseChaptersTable.courseId, courseId),
                    eq(CourseChaptersTable.orderIndex, chapter.id)
                ));

            if (existingChapter.length > 0) {
                await db.update(CourseChaptersTable)
                    .set({ name: chapter.name, desc: chapter.desc })
                    .where(eq(CourseChaptersTable.id, existingChapter[0].id));
            } else {
                await db.insert(CourseChaptersTable).values({
                    courseId: courseId,
                    orderIndex: chapter.id,
                    name: chapter.name,
                    desc: chapter.desc,
                });
            }
        }

        return NextResponse.json({
            message: "CSS course and chapters seeded successfully",
            courseId: courseId,
            chaptersCount: CHAPTERS.length
        });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
