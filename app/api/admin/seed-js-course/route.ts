import { db } from "@/config/db";
import { CourseTable, CourseChaptersTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";

const COURSE = {
    title: "JavaScript Beginner",
    desc: "Learn JavaScript from scratch — variables, functions, DOM manipulation, arrays, objects, and modern ES6+ features through interactive browser-based exercises.",
    bannerImage: "https://ik.imagekit.io/shubham79/js-banner.png",
    level: "Beginner",
    tags: "JavaScript,Web Development,Frontend",
    editorType: "static"
};

const CHAPTERS = [
    {
        id: 1,
        name: "Hello JavaScript",
        desc: "Your first steps — writing scripts, using console.log, and understanding how JS runs in the browser."
    },
    {
        id: 2,
        name: "Variables & Constants",
        desc: "Store and manage data with let, const, and understand the difference from var."
    },
    {
        id: 3,
        name: "Data Types & Type Coercion",
        desc: "Explore JavaScript's primitive types, typeof operator, and how JS converts between types."
    },
    {
        id: 4,
        name: "Operators & Expressions",
        desc: "Master arithmetic, comparison, logical, and assignment operators."
    },
    {
        id: 5,
        name: "Conditionals",
        desc: "Make decisions with if-else, switch statements, and the ternary operator."
    },
    {
        id: 6,
        name: "Loops",
        desc: "Repeat actions with for, while, do-while loops, and control flow with break and continue."
    },
    {
        id: 7,
        name: "Functions",
        desc: "Write reusable code with function declarations, expressions, arrow functions, and default parameters."
    },
    {
        id: 8,
        name: "Arrays",
        desc: "Work with ordered collections — creating, accessing, and modifying arrays with built-in methods."
    },
    {
        id: 9,
        name: "Objects",
        desc: "Create structured data with key-value pairs, access properties, and use object methods."
    },
    {
        id: 10,
        name: "DOM Manipulation",
        desc: "Select HTML elements, change content and styles, and respond to user events with JavaScript."
    },
    {
        id: 11,
        name: "Array Higher-Order Methods",
        desc: "Transform and filter data with map, filter, reduce, and forEach — the functional programming toolkit."
    },
    {
        id: 12,
        name: "Error Handling & Debugging",
        desc: "Handle runtime errors gracefully with try-catch, throw custom errors, and debug like a pro."
    },
];

export async function GET(req: NextRequest) {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        // Re-running should not create a second copy of the course
        const existing = await db.select({ id: CourseTable.id }).from(CourseTable).where(eq(CourseTable.title, COURSE.title));
        if (existing.length > 0) {
            return NextResponse.json({
                message: "JavaScript course already exists — skipped",
                courseId: existing[0].id,
            });
        }

        // 1. Insert the JavaScript course
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
            message: "JavaScript course and chapters seeded successfully",
            courseId: courseId,
            chaptersCount: CHAPTERS.length
        });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
