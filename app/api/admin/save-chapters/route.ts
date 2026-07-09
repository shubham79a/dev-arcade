import { db } from "@/config/db";
import { CourseChaptersTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";


const DATA = [
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
]



export async function GET(req: NextRequest) {
    DATA.forEach(async (item) => {
        await db.insert(CourseChaptersTable).values({
            courseId: 2, //Change Course ID depends on course info,
            orderIndex: item?.id,
            name: item?.name,
            desc: item?.desc,
        })
    })
    return NextResponse.json('Success')
}
