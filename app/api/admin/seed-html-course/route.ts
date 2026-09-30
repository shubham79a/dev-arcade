import { db } from "@/config/db";
import { CourseTable, CourseChaptersTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";

const COURSE = {
    title: "HTML Beginner",
    desc: "Discover the foundation of every webpage and learn how HTML shapes the digital world.",
    bannerImage: "https://ik.imagekit.io/shubham79/html-banner.png",
    level: "Beginner",
    tags: "HTML,Web Development,Frontend",
    editorType: "static"
};

const CHAPTERS = [
    {
        "id": 1,
        "name": "Introduction to HTML",
        "desc": "Discover the foundation of every webpage and learn how HTML shapes the digital world.",
    },
    {
        "id": 2,
        "name": "HTML Boilerplate",
        "desc": "Understand the core structure that every HTML document begins with.",
    },
    {
        "id": 3,
        "name": "Head & Body Tags",
        "desc": "Learn the difference between behind-the-scenes metadata and visible page content.",
    },
    {
        "id": 4,
        "name": "Text Formatting",
        "desc": "Format your content with headings, paragraphs, bold, italic, and more.",
    },
    {
        "id": 5,
        "name": "Links & Navigation",
        "desc": "Create portals between pages and build simple navigation.",
    },
    {
        "id": 6,
        "name": "Images",
        "desc": "Display images, control sizing, and optimize accessibility.",
    },
    {
        "id": 7,
        "name": "Lists",
        "desc": "Structure grouped information using ordered, unordered, and description lists.",
    },
    {
        "id": 8,
        "name": "Tables",
        "desc": "Represent information in structured grid format.",
    },
    {
        "id": 9,
        "name": "Forms Basics",
        "desc": "Collect user input using form controls like input, labels, and buttons.",
    },
    {
        "id": 10,
        "name": "Semantic HTML",
        "desc": "Use meaningful HTML elements to improve page structure and accessibility.",
    },
    {
        "id": 11,
        "name": "Audio & Video",
        "desc": "Add multimedia components for richer experiences.",
    },
    {
        "id": 12,
        "name": "HTML Best Practices",
        "desc": "Write clear, clean, and accessible HTML optimized for real-world use.",
    }
];

export async function GET(req: NextRequest) {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        // Re-running should not create a second copy of the course
        const existing = await db.select({ id: CourseTable.id }).from(CourseTable).where(eq(CourseTable.title, COURSE.title));
        if (existing.length > 0) {
            return NextResponse.json({
                message: "HTML course already exists — skipped",
                courseId: existing[0].id,
            });
        }

        // 1. Insert the HTML course
        const courseResult = await db.insert(CourseTable).values({
            title: COURSE.title,
            desc: COURSE.desc,
            bannerImage: COURSE.bannerImage,
            level: COURSE.level,
            tags: COURSE.tags,
            editorType: COURSE.editorType,
        }).returning();

        const courseId = courseResult[0].id;

        // 2. Insert chapters for this course
        for (const chapter of CHAPTERS) {
            await db.insert(CourseChaptersTable).values({
                courseId: courseId,
                orderIndex: chapter.id,
                name: chapter.name,
                desc: chapter.desc,
            });
        }

        return NextResponse.json({
            message: "HTML course and chapters seeded successfully",
            courseId: courseId,
            chaptersCount: CHAPTERS.length
        });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
