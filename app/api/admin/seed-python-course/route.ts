import { db } from "@/config/db";
import { CourseTable, CourseChaptersTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";

// Python course data
const COURSE = {
    title: "Python Fundamentals",
    desc: "Master the basics of Python programming — variables, data types, control flow, functions, and more through hands-on coding exercises.",
    bannerImage: "/python-banner.png",
    level: "Beginner",
    tags: "Python,Programming,Backend",
    editorType: "python"
};

const CHAPTERS = [
    {
        id: 1,
        name: "Hello Python",
        desc: "Your first steps into Python — printing, comments, and running your first script."
    },
    {
        id: 2,
        name: "Variables & Data Types",
        desc: "Store data, understand types, and learn how Python handles numbers, strings, and booleans."
    },
    {
        id: 3,
        name: "Control Flow",
        desc: "Make decisions with if/else and repeat actions with loops."
    },
    {
        id: 4,
        name: "Functions",
        desc: "Write reusable blocks of code with parameters, return values, and default arguments."
    },
    {
        id: 5,
        name: "Lists & Strings",
        desc: "Work with sequences — indexing, slicing, and common methods."
    },
];

export async function GET(req: NextRequest) {
    try {
        // 1. Insert the Python course
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
            message: "Python course and chapters seeded successfully",
            courseId: courseId,
            chaptersCount: CHAPTERS.length
        });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
