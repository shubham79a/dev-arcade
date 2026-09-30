import { db } from "@/config/db";
import { ExerciseTable, CourseChaptersTable, CourseTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getCourseIdParam, requireAdmin } from "@/lib/admin";

const DEFAULT_COURSE_ID = 2; // HTML Beginner course fallback

export async function GET(req: NextRequest) {
    const denied = await requireAdmin();
    if (denied) return denied;

    try {
        // Look up the actual HTML Beginner course ID dynamically
        const existingCourse = await db
            .select({ id: CourseTable.id })
            .from(CourseTable)
            .where(eq(CourseTable.title, "HTML Beginner"));

        const COURSE_ID = existingCourse[0]?.id || getCourseIdParam(req, DEFAULT_COURSE_ID);

        const chapters = await db
            .select()
            .from(CourseChaptersTable)
            .where(eq(CourseChaptersTable.courseId, COURSE_ID))
            .orderBy(CourseChaptersTable.orderIndex);

        if (chapters.length < 12) {
            return NextResponse.json(
                { error: `Found only ${chapters.length} chapters for course "${COURSE_ID}". Run seed-html-course first.` },
                { status: 400 }
            );
        }

        const CH = {
            ch1: chapters.find(c => c.orderIndex === 1)?.id ?? chapters[0].id,
            ch2: chapters.find(c => c.orderIndex === 2)?.id ?? chapters[1].id,
            ch3: chapters.find(c => c.orderIndex === 3)?.id ?? chapters[2].id,
            ch4: chapters.find(c => c.orderIndex === 4)?.id ?? chapters[3].id,
            ch5: chapters.find(c => c.orderIndex === 5)?.id ?? chapters[4].id,
            ch6: chapters.find(c => c.orderIndex === 6)?.id ?? chapters[5].id,
            ch7: chapters.find(c => c.orderIndex === 7)?.id ?? chapters[6].id,
            ch8: chapters.find(c => c.orderIndex === 8)?.id ?? chapters[7].id,
            ch9: chapters.find(c => c.orderIndex === 9)?.id ?? chapters[8].id,
            ch10: chapters.find(c => c.orderIndex === 10)?.id ?? chapters[9].id,
            ch11: chapters.find(c => c.orderIndex === 11)?.id ?? chapters[10].id,
            ch12: chapters.find(c => c.orderIndex === 12)?.id ?? chapters[11].id,
        };

        const html = (body: string) => 
            `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>HTML Exercise</title>\n</head>\n<body>\n${body}\n</body>\n</html>`;

        const emptyHtml = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title></title>\n</head>\n<body>\n\n</body>\n</html>`;

        const DATA = [
            // Chapter 1: Introduction to HTML
            {
                courseId: COURSE_ID,
                chapterId: CH.ch1,
                slug: "build-your-base-camp",
                name: "Build Your Base Camp",
                xp: 20,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Every adventurer needs a base camp — a safe place to plan and rest. In HTML, your base camp is built with headings and paragraphs.</p><p style='margin-bottom:8px;'>A main heading (<code>&lt;h1&gt;</code>) acts like a flag planted at the camp's center, marking its purpose.</p><p style='margin-bottom:8px;'>Paragraphs (<code>&lt;p&gt;</code>) are the camp logs where you record instructions.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Inside the <code>&lt;body&gt;</code>, add a heading <code>&lt;h1&gt;</code> and a paragraph <code>&lt;p&gt;</code> with any text you want.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>&lt;h1&gt;Welcome to Base Camp&lt;/h1&gt;</code> and <code>&lt;p&gt;Prepare yourself for the HTML adventure!&lt;/p&gt;</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: emptyHtml, active: true }
                },
                validationRegex: "<h1>[^<]+</h1>[\\s\\S]*<p>[^<]+</p>",
                expectedOutput: "<h1>Welcome to Base Camp</h1><p>Prepare yourself for the HTML adventure!</p>",
                hintXpPenalty: 5
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.ch1,
                slug: "element-collector",
                name: "Element Collector",
                xp: 20,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Become the Element Collector — gather headings, paragraphs, and lists to build a rich page. Each element is an artifact that adds meaning and structure.</p><p style='margin-bottom:8px;'>This quest readies you for complex pages by mastering small, reusable parts.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Inside the <code>&lt;body&gt;</code>, add an <code>&lt;h2&gt;</code> and a paragraph <code>&lt;p&gt;</code> with any text.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>&lt;h2&gt;</code> and <code>&lt;p&gt;</code> tags.</p></body>",
                starterCode: {
                    "/index.html": { code: emptyHtml, active: true }
                },
                validationRegex: "<h2>[^<]+</h2>[\\s\\S]*<p>[^<]+</p>",
                expectedOutput: "<h2>Treasures</h2><p>I found a sword!</p>",
                hintXpPenalty: 5
            },
            
            // Chapter 2: HTML Boilerplate
            {
                courseId: COURSE_ID,
                chapterId: CH.ch2,
                slug: "explore-the-web-skeleton",
                name: "Explore the Web Skeleton",
                xp: 25,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Every web page is built on the foundation of HTML.</p><p style='margin-bottom:8px;'>The <code>&lt;!DOCTYPE html&gt;</code> declaration tells the browser what type of document it is.</p><p style='margin-bottom:8px;'>The outer wrapper <code>&lt;html&gt;</code> contains everything on the page.</p><p style='margin-bottom:8px;'>Inside, the <code>&lt;head&gt;</code> stores your metadata, and the <code>&lt;body&gt;</code> stores the visible content.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a complete HTML skeleton including <code>&lt;!DOCTYPE html&gt;</code>, <code>&lt;html lang=\"en\"&gt;</code>, <code>&lt;head&gt;</code>, and <code>&lt;body&gt;</code>. Leave the body empty.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Start with <code>&lt;!DOCTYPE html&gt;</code>. Then create <code>&lt;html lang=\"en\"&gt;</code>. Inside, add empty <code>&lt;head&gt;</code> and <code>&lt;body&gt;</code> tags.</p></body>",
                starterCode: {
                    "/index.html": { code: "", active: true }
                },
                validationRegex: "<!DOCTYPE html>\\s*<html[^>]*>\\s*<head>[\\s\\S]*</head>\\s*<body>[\\s\\S]*</body>\\s*</html>",
                expectedOutput: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n</head>\n<body>\n</body>\n</html>",
                hintXpPenalty: 8
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.ch2,
                slug: "name-your-world",
                name: "Name Your World",
                xp: 20,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Every world needs a name. In HTML, the world is named with the <code>&lt;title&gt;</code> tag inside the <code>&lt;head&gt;</code>.</p><p style='margin-bottom:8px;'>The title appears on the browser tab and in search results.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Set the HTML page <code>&lt;title&gt;</code> to any name you like inside the <code>&lt;head&gt;</code>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Open the <code>&lt;head&gt;</code> and add <code>&lt;title&gt;My Adventure World&lt;/title&gt;</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: emptyHtml, active: true }
                },
                validationRegex: "(?i)<title>[^<]+</title>",
                expectedOutput: "<title>My Adventure World</title>",
                hintXpPenalty: 5
            },

            // Chapter 3: Head & Body Tags
            {
                courseId: COURSE_ID,
                chapterId: CH.ch3,
                slug: "break-and-repair",
                name: "Break & Repair",
                xp: 25,
                difficulty: "medium",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Even the best fortresses can develop cracks. Broken or unclosed tags cause rendering issues.</p><p style='margin-bottom:8px;'>Every opening tag should have a matching closing tag unless it is self-closing.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Inspect and fix the broken HTML so all tags are properly opened and closed. Ensure the body has <code>&lt;h1&gt;Fortress Repaired&lt;/h1&gt;</code> and <code>&lt;p&gt;Your castle is strong again!&lt;/p&gt;</code>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Look for missing <code>&lt;/h1&gt;</code> or <code>&lt;/p&gt;</code>. Ensure tags are complete.</p></body>",
                starterCode: {
                    "/index.html": { code: html("  <!-- Fix the errors -->\n  <h1>Fortress Repaired\n  <p>Your castle is strong again!"), active: true }
                },
                validationRegex: "<h1>[^<]+</h1>[\\s\\S]*<p>[^<]+</p>",
                expectedOutput: "<h1>Fortress Repaired</h1><p>Your castle is strong again!</p>",
                hintXpPenalty: 8
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.ch3,
                slug: "html-detective",
                name: "HTML Detective",
                xp: 25,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Don your detective hat — it's time to hunt down HTML mistakes.</p><p style='margin-bottom:8px;'>Check that textual content sits inside the correct container, and there are no mistyped tags like <code>&lt;heder&gt;</code>.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Fix any missing or misaligned tags. The body must contain <code>&lt;h1&gt;Detective Mode&lt;/h1&gt;</code> and <code>&lt;p&gt;All errors are found!&lt;/p&gt;</code>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Add closing tags and make sure there are no typos in tag names.</p></body>",
                starterCode: {
                    "/index.html": { code: html("  <h1 Detective Mode /h1>\n  <p>All errors are found!"), active: true }
                },
                validationRegex: "<h1>[^<]+</h1>[\\s\\S]*<p>[^<]+</p>",
                expectedOutput: "<h1>Detective Mode</h1><p>All errors are found!</p>",
                hintXpPenalty: 8
            },

            // Chapter 4: Text Formatting
            {
                courseId: COURSE_ID,
                chapterId: CH.ch4,
                slug: "bold-and-italic",
                name: "Bold & Italic",
                xp: 20,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>To emphasize text, use the <code>&lt;strong&gt;</code> tag for bold and <code>&lt;em&gt;</code> for italic.</p><p style='margin-bottom:8px;'>These tags are semantic, meaning they convey importance to screen readers.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Inside a paragraph, make one word bold using <code>&lt;strong&gt;</code> and another word italic using <code>&lt;em&gt;</code>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>&lt;p&gt;&lt;strong&gt;Strong&lt;/strong&gt; and &lt;em&gt;Fast&lt;/em&gt;&lt;/p&gt;</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: html("  <p>Strong and Fast</p>"), active: true }
                },
                validationRegex: "<strong(>|\\s[^>]*>)[^<]+</strong>[\\s\\S]*<em(>|\\s[^>]*>)[^<]+</em>",
                expectedOutput: "<p><strong>Strong</strong> and <em>Fast</em></p>",
                hintXpPenalty: 5
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.ch4,
                slug: "headings-hierarchy",
                name: "Headings Hierarchy",
                xp: 20,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Headings range from <code>&lt;h1&gt;</code> (most important) to <code>&lt;h6&gt;</code> (least important).</p><p style='margin-bottom:8px;'>Never skip heading levels (e.g., jumping from h1 to h3). This ensures proper structure.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create an <code>&lt;h1&gt;</code>, an <code>&lt;h2&gt;</code>, and an <code>&lt;h3&gt;</code> sequentially.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Add h1, h2, and h3 sequentially.</p></body>",
                starterCode: {
                    "/index.html": { code: emptyHtml, active: true }
                },
                validationRegex: "<h1>[^<]+</h1>[\\s\\S]*<h2>[^<]+</h2>[\\s\\S]*<h3>[^<]+</h3>",
                expectedOutput: "<h1>Main Title</h1><h2>Subtitle</h2><h3>Section</h3>",
                hintXpPenalty: 5
            },

            // Chapter 5: Links & Navigation
            {
                courseId: COURSE_ID,
                chapterId: CH.ch5,
                slug: "create-a-link",
                name: "Create a Link",
                xp: 25,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>The anchor tag <code>&lt;a&gt;</code> creates hyperlinks.</p><p style='margin-bottom:8px;'>Use the <code>href</code> attribute to specify the destination URL: <code>&lt;a href=\"https://google.com\"&gt;Google&lt;/a&gt;</code>.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a link using the <code>&lt;a&gt;</code> tag with an <code>href</code> attribute to any website.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>&lt;a href=\"https://example.com\"&gt;Visit Example&lt;/a&gt;</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: emptyHtml, active: true }
                },
                validationRegex: "<a\\s+[^>]*href=[\"\'][^\"\']+[\"\'][^>]*>[^<]+</a>",
                expectedOutput: "<a href=\"https://example.com\">Visit Example</a>",
                hintXpPenalty: 8
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.ch5,
                slug: "open-new-tab",
                name: "Open in New Tab",
                xp: 25,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>To open a link in a new tab, add the attribute <code>target=\"_blank\"</code>.</p><p style='margin-bottom:8px;'>This is useful for external links so users don't lose your page.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Modify the link to open in a new tab by adding the <code>target</code> attribute.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Add <code>target=\"_blank\"</code> to the anchor tag.</p></body>",
                starterCode: {
                    "/index.html": { code: html("  <a href=\"https://google.com\">Search Engine</a>"), active: true }
                },
                validationRegex: "<a\\s+[^>]*target=[\"']_blank[\"'][^>]*>",
                expectedOutput: "<a href=\"https://google.com\" target=\"_blank\">Search Engine</a>",
                hintXpPenalty: 8
            },

            // Chapter 6: Images
            {
                courseId: COURSE_ID,
                chapterId: CH.ch6,
                slug: "add-an-image",
                name: "Add an Image",
                xp: 25,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Use the <code>&lt;img&gt;</code> tag to embed images. It is self-closing.</p><p style='margin-bottom:8px;'>You need <code>src</code> (image URL) and <code>alt</code> (alternative text for screen readers).</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Add an image with a <code>src</code> attribute and an <code>alt</code> attribute.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>&lt;img src=\"logo.png\" alt=\"Company Logo\" /&gt;</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: emptyHtml, active: true }
                },
                validationRegex: "<img\\s+[^>]*(src=[\"\'][^\"\']+[\"\'][^>]*alt=[\"\'][^\"\']*[\"\']|alt=[\"\'][^\"\']*[\"\'][^>]*src=[\"\'][^\"\']+[\"\'])[^>]*>",
                expectedOutput: "<img src=\"logo.png\" alt=\"Company Logo\" />",
                hintXpPenalty: 8
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.ch6,
                slug: "figure-figcaption",
                name: "Figure & Figcaption",
                xp: 25,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>To semantically link an image to a caption, wrap it in a <code>&lt;figure&gt;</code> and add a <code>&lt;figcaption&gt;</code>.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Wrap the image in a <code>&lt;figure&gt;</code> and add a <code>&lt;figcaption&gt;</code> containing any text.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p><code>&lt;figure&gt;&lt;img ...&gt;&lt;figcaption&gt;Caption&lt;/figcaption&gt;&lt;/figure&gt;</code></p></body>",
                starterCode: {
                    "/index.html": { code: html("  <img src=\"sunset.jpg\" alt=\"Sunset\">"), active: true }
                },
                validationRegex: "<figure>\\s*<img[^>]*>\\s*<figcaption>[^<]+</figcaption>\\s*</figure>",
                expectedOutput: "<figure>\n  <img src=\"sunset.jpg\" alt=\"Sunset\">\n  <figcaption>A beautiful sunset</figcaption>\n</figure>",
                hintXpPenalty: 8
            },

            // Chapter 7: Lists
            {
                courseId: COURSE_ID,
                chapterId: CH.ch7,
                slug: "ordered-list",
                name: "Ordered List",
                xp: 20,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Ordered lists use <code>&lt;ol&gt;</code> (with numbers). Unordered lists use <code>&lt;ul&gt;</code> (with bullets).</p><p style='margin-bottom:8px;'>Each item inside is an <code>&lt;li&gt;</code> (list item).</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create an ordered list (<code>&lt;ol&gt;</code>) with three <code>&lt;li&gt;</code> steps.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>&lt;ol&gt;</code> and three <code>&lt;li&gt;</code> tags.</p></body>",
                starterCode: {
                    "/index.html": { code: emptyHtml, active: true }
                },
                validationRegex: "<ol>[\\s\\S]*<li>[^<]+</li>[\\s\\S]*<li>[^<]+</li>[\\s\\S]*<li>[^<]+</li>[\\s\\S]*</ol>",
                expectedOutput: "<ol>\n  <li>Wake up</li>\n  <li>Code</li>\n  <li>Sleep</li>\n</ol>",
                hintXpPenalty: 5
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.ch7,
                slug: "description-list",
                name: "Description List",
                xp: 30,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Description lists <code>&lt;dl&gt;</code> pair terms <code>&lt;dt&gt;</code> with their descriptions <code>&lt;dd&gt;</code>.</p><p style='margin-bottom:8px;'>Great for glossaries or metadata.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a description list. Add a term <code>&lt;dt&gt;</code> and a description <code>&lt;dd&gt;</code>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p><code>&lt;dl&gt;&lt;dt&gt;HTML&lt;/dt&gt;&lt;dd&gt;Markup language&lt;/dd&gt;&lt;/dl&gt;</code></p></body>",
                starterCode: {
                    "/index.html": { code: emptyHtml, active: true }
                },
                validationRegex: "<dl>[\\s\\S]*<dt>[^<]+</dt>[\\s\\S]*<dd>[^<]+</dd>[\\s\\S]*</dl>",
                expectedOutput: "<dl>\n  <dt>HTML</dt>\n  <dd>Markup language</dd>\n</dl>",
                hintXpPenalty: 10
            },

            // Chapter 8: Tables
            {
                courseId: COURSE_ID,
                chapterId: CH.ch8,
                slug: "basic-table",
                name: "Basic Table",
                xp: 30,
                difficulty: "medium",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Tables use <code>&lt;table&gt;</code>.</p><p style='margin-bottom:8px;'>Rows use <code>&lt;tr&gt;</code> and data cells use <code>&lt;td&gt;</code>.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a table with one row containing two data cells.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p><code>&lt;table&gt;&lt;tr&gt;&lt;td&gt;Alice&lt;/td&gt;&lt;td&gt;25&lt;/td&gt;&lt;/tr&gt;&lt;/table&gt;</code></p></body>",
                starterCode: {
                    "/index.html": { code: emptyHtml, active: true }
                },
                validationRegex: "<table>[\\s\\S]*<tr>[\\s\\S]*<td>[^<]+</td>[\\s\\S]*<td>[^<]+</td>[\\s\\S]*</tr>[\\s\\S]*</table>",
                expectedOutput: "<table>\n  <tr>\n    <td>Alice</td>\n    <td>25</td>\n  </tr>\n</table>",
                hintXpPenalty: 10
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.ch8,
                slug: "table-headers",
                name: "Table Headers",
                xp: 30,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Header cells use <code>&lt;th&gt;</code> instead of td. Semantic tables use <code>&lt;thead&gt;</code> and <code>&lt;tbody&gt;</code>.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Add a <code>&lt;thead&gt;</code> with a row containing two headers. Put the existing row inside a <code>&lt;tbody&gt;</code>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Wrap the first row in thead using th, and the second row in tbody.</p></body>",
                starterCode: {
                    "/index.html": { code: html("  <table>\n    <tr>\n      <td>Name</td>\n      <td>Age</td>\n    </tr>\n    <tr>\n      <td>Alice</td>\n      <td>25</td>\n    </tr>\n  </table>"), active: true }
                },
                validationRegex: "<thead>[\\s\\S]*<tr>[\\s\\S]*<th>[^<]+</th>[\\s\\S]*<th>[^<]+</th>[\\s\\S]*</tr>[\\s\\S]*</thead>[\\s\\S]*<tbody>",
                expectedOutput: "<table>\n  <thead>\n    <tr>\n      <th>Name</th>\n      <th>Age</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Alice</td>\n      <td>25</td>\n    </tr>\n  </tbody>\n</table>",
                hintXpPenalty: 10
            },

            // Chapter 9: Forms Basics
            {
                courseId: COURSE_ID,
                chapterId: CH.ch9,
                slug: "text-input-label",
                name: "Text Input & Label",
                xp: 25,
                difficulty: "medium",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Forms use the <code>&lt;form&gt;</code> tag. Inputs use <code>&lt;input&gt;</code>.</p><p style='margin-bottom:8px;'>Always pair inputs with a <code>&lt;label&gt;</code> using the <code>for</code> and <code>id</code> attributes.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a form with a label <strong>Username</strong> for an input with id <code>user</code>, and a text input with id <code>user</code>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p><code>&lt;label for=\"user\"&gt;Username&lt;/label&gt; &lt;input type=\"text\" id=\"user\"&gt;</code></p></body>",
                starterCode: {
                    "/index.html": { code: emptyHtml, active: true }
                },
                validationRegex: "<form>\\s*<label\\s+for=[\"']user[\"']>\\s*Username\\s*</label>\\s*<input\\s+(?:type=[\"']text[\"']\\s+id=[\"']user[\"']|id=[\"']user[\"']\\s+type=[\"']text[\"'])[^>]*>\\s*</form>",
                expectedOutput: "<form>\n  <label for=\"user\">Username</label>\n  <input type=\"text\" id=\"user\">\n</form>",
                hintXpPenalty: 8
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.ch9,
                slug: "submit-button-radio",
                name: "Submit Button & Radio",
                xp: 30,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Radio buttons let users pick one option from many (same <code>name</code> attribute).</p><p style='margin-bottom:8px;'>Use <code>&lt;button type=\"submit\"&gt;</code> to submit the form.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Add two radio inputs with name <code>plan</code> (values \"Free\" and \"Pro\"). Add a submit button with text <strong>Join</strong>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p><code>&lt;input type=\"radio\" name=\"plan\" value=\"Free\"&gt;</code> and <code>&lt;button type=\"submit\"&gt;Join&lt;/button&gt;</code></p></body>",
                starterCode: {
                    "/index.html": { code: html("  <form>\n  </form>"), active: true }
                },
                validationRegex: "<input\\s+type=[\"']radio[\"']\\s+name=[\"']plan[\"'][^>]*>.*<button\\s+type=[\"']submit[\"']>\\s*Join\\s*</button>",
                expectedOutput: "<form>\n  <input type=\"radio\" name=\"plan\" value=\"Free\">\n  <input type=\"radio\" name=\"plan\" value=\"Pro\">\n  <button type=\"submit\">Join</button>\n</form>",
                hintXpPenalty: 10
            },

            // Chapter 10: Semantic HTML
            {
                courseId: COURSE_ID,
                chapterId: CH.ch10,
                slug: "semantic-header-footer",
                name: "Header & Footer",
                xp: 20,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Semantic tags give meaning to the structure. Use <code>&lt;header&gt;</code> for introductory content and <code>&lt;footer&gt;</code> for bottom content.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a <code>&lt;header&gt;</code> and a <code>&lt;footer&gt;</code> with any content.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use header and footer tags.</p></body>",
                starterCode: {
                    "/index.html": { code: emptyHtml, active: true }
                },
                validationRegex: "<header>[^<]+</header>[\\s\\S]*<footer>[^<]+</footer>",
                expectedOutput: "<header>My Site</header>\n<footer>Copyright 2026</footer>",
                hintXpPenalty: 5
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.ch10,
                slug: "article-and-section",
                name: "Article & Section",
                xp: 25,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'><code>&lt;article&gt;</code> is for independent, self-contained content (like a blog post).</p><p style='margin-bottom:8px;'><code>&lt;section&gt;</code> is for thematic groupings of content.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Wrap the blog post in an <code>&lt;article&gt;</code> and the related links in a <code>&lt;section&gt;</code>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>&lt;article&gt;</code> and <code>&lt;section&gt;</code> tags.</p></body>",
                starterCode: {
                    "/index.html": { code: html("  <div>\n    <h2>My Trip</h2>\n    <p>It was fun.</p>\n  </div>\n  <div>\n    <h3>More like this</h3>\n    <a href=\"#\">Another trip</a>\n  </div>"), active: true }
                },
                validationRegex: "<article>[\\s\\S]*<h2>\\s*My Trip\\s*</h2>[\\s\\S]*</article>[\\s\\S]*<section>[\\s\\S]*<h3>\\s*More like this\\s*</h3>[\\s\\S]*</section>",
                expectedOutput: "<article>\n  <h2>My Trip</h2>\n  <p>It was fun.</p>\n</article>\n<section>\n  <h3>More like this</h3>\n  <a href=\"#\">Another trip</a>\n</section>",
                hintXpPenalty: 8
            },

            // Chapter 11: Audio & Video
            {
                courseId: COURSE_ID,
                chapterId: CH.ch11,
                slug: "add-audio",
                name: "Add Audio",
                xp: 25,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Use the <code>&lt;audio&gt;</code> tag. Include the <code>controls</code> attribute so the user can play it.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Add an audio player with controls, using any <code>src</code>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p><code>&lt;audio controls src=\"music.mp3\"&gt;&lt;/audio&gt;</code></p></body>",
                starterCode: {
                    "/index.html": { code: emptyHtml, active: true }
                },
                validationRegex: "<audio\\s+[^>]*controls[^>]*src=[\"\'][^\"\']+[\"\']|src=[\"\'][^\"\']+[\"\'][^>]*controls",
                expectedOutput: "<audio controls src=\"music.mp3\"></audio>",
                hintXpPenalty: 8
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.ch11,
                slug: "add-video",
                name: "Add Video",
                xp: 25,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Use <code>&lt;video&gt;</code> for movies. Useful attributes: <code>controls</code>, <code>autoplay</code>, <code>loop</code>, <code>muted</code>.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Add a video using any <code>src</code>. It should have <strong>controls</strong>, <strong>loop</strong>, and <strong>muted</strong>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p><code>&lt;video src=\"movie.mp4\" controls loop muted&gt;&lt;/video&gt;</code></p></body>",
                starterCode: {
                    "/index.html": { code: emptyHtml, active: true }
                },
                validationRegex: "<video\\s+(?=[^>]*controls)(?=[^>]*loop)(?=[^>]*muted)(?=[^>]*src=[\"\'][^\"\']+[\"\'])[^>]*>",
                expectedOutput: "<video src=\"movie.mp4\" controls loop muted></video>",
                hintXpPenalty: 8
            },

            // Chapter 12: HTML Best Practices
            {
                courseId: COURSE_ID,
                chapterId: CH.ch12,
                slug: "accessible-image",
                name: "Accessible Image",
                xp: 20,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Alt text is crucial for visually impaired users. If an image is purely decorative, use an empty alt tag: <code>alt=\"\"</code>.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Add a meaningful alt text to the chart image (e.g. <code>alt=\"Sales chart\"</code>).</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Change the alt attribute to exactly \"Sales up 20 percent\".</p></body>",
                starterCode: {
                    "/index.html": { code: html("  <img src=\"chart.png\" alt=\"\">"), active: true }
                },
                validationRegex: "alt=[\"\'][^\"\']+[\"\']",
                expectedOutput: "<img src=\"chart.png\" alt=\"Sales up 20 percent\">",
                hintXpPenalty: 5
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.ch12,
                slug: "language-and-charset",
                name: "Language & Charset",
                xp: 25,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Always declare the language in the <code>&lt;html&gt;</code> tag and the character set in the <code>&lt;head&gt;</code>.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Add <code>lang=\"es\"</code> to the html tag and <code>&lt;meta charset=\"UTF-8\"&gt;</code> inside the head.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Modify <code>&lt;html&gt;</code> and add <code>&lt;meta charset=\"UTF-8\"&gt;</code> to the head.</p></body>",
                starterCode: {
                    "/index.html": { code: "<!DOCTYPE html>\n<html>\n<head>\n  <title>Mi Sitio</title>\n</head>\n<body>\n  <h1>Hola!</h1>\n</body>\n</html>", active: true }
                },
                validationRegex: "<html\\s+lang=[\"']es[\"']>[\\s\\S]*<meta\\s+charset=[\"']UTF-8[\"']\\s*/?>",
                expectedOutput: "<!DOCTYPE html>\n<html lang=\"es\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Mi Sitio</title>\n</head>\n<body>\n  <h1>Hola!</h1>\n</body>\n</html>",
                hintXpPenalty: 8
            }
        ];

        for (const item of DATA) {
            await db.insert(ExerciseTable).values({
                courseId: item.courseId,
                slug: item.slug,
                name: item.name,
                xp: item.xp,
                difficulty: item.difficulty as "easy" | "medium" | "hard",
                chapterId: item.chapterId,
                orderIndex: item.orderIndex,
                content: item.content,
                task: item.task,
                hint: item.hint,
                starterCode: item.starterCode,
                validationRegex: item.validationRegex,
                expectedOutput: item.expectedOutput,
                hintXpPenalty: item.hintXpPenalty,
            }).onConflictDoUpdate({
                target: ExerciseTable.slug,
                set: {
                    name: item.name,
                    xp: item.xp,
                    difficulty: item.difficulty as "easy" | "medium" | "hard",
                    chapterId: item.chapterId,
                    orderIndex: item.orderIndex,
                    content: item.content,
                    task: item.task,
                    hint: item.hint,
                    starterCode: item.starterCode,
                    validationRegex: item.validationRegex,
                    expectedOutput: item.expectedOutput,
                    hintXpPenalty: item.hintXpPenalty,
                }
            });
        }

        return NextResponse.json({
            message: "HTML exercises seeded successfully",
            courseId: COURSE_ID,
            exercisesCount: DATA.length
        });

    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}