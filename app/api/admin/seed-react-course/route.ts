import { db } from "@/config/db";
import { CourseTable, CourseChaptersTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";

const COURSE = {
    title: "React Beginner",
    desc: "Master React from the ground up — JSX, components, props, state, hooks, event handling, forms, and the Context API through hands-on interactive exercises.",
    bannerImage: "https://ik.imagekit.io/shubham79/react-banner.png",
    level: "Beginner",
    tags: "React,JavaScript,Frontend,Web Development",
    editorType: "react"
};

const CHAPTERS = [
    {
        id: 1,
        name: "Hello React & JSX",
        desc: "Your first React component — understand JSX syntax, embedding expressions, and how React renders to the DOM."
    },
    {
        id: 2,
        name: "Components & Props",
        desc: "Build reusable UI pieces with function components and pass data down with props."
    },
    {
        id: 3,
        name: "Styling in React",
        desc: "Style components with inline styles, CSS modules, className, and dynamic styling based on props."
    },
    {
        id: 4,
        name: "State with useState",
        desc: "Make components interactive with React's useState hook — counters, toggles, and input tracking."
    },
    {
        id: 5,
        name: "Event Handling",
        desc: "Respond to user actions — onClick, onChange, onSubmit, and passing event handlers between components."
    },
    {
        id: 6,
        name: "Conditional Rendering",
        desc: "Show and hide UI with ternary operators, && short-circuit, and conditional component rendering."
    },
    {
        id: 7,
        name: "Lists & Keys",
        desc: "Render dynamic lists with .map(), understand why keys matter, and build filterable lists."
    },
    {
        id: 8,
        name: "Forms & Controlled Components",
        desc: "Build forms the React way — controlled inputs, textareas, selects, and form submission."
    },
    {
        id: 9,
        name: "useEffect & Side Effects",
        desc: "Fetch data, set up timers, and manage side effects with the useEffect hook and cleanup functions."
    },
    {
        id: 10,
        name: "Component Composition",
        desc: "Build complex UIs from simple pieces — children prop, composition vs inheritance, and layout patterns."
    },
    {
        id: 11,
        name: "Context API",
        desc: "Share state across components without prop drilling using createContext, Provider, and useContext."
    },
    {
        id: 12,
        name: "Capstone: Mini App",
        desc: "Put it all together — build a complete mini application using everything you've learned."
    },
];

export async function GET(req: NextRequest) {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        // 1. Get or Insert the React course
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
            // Check if chapter already exists for this course and orderIndex
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
            message: "React course and chapters seeded successfully",
            courseId: courseId,
            chaptersCount: CHAPTERS.length
        });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
