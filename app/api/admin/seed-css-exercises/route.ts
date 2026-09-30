import { db } from "@/config/db";
import { ExerciseTable, CourseChaptersTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getCourseIdParam, requireAdmin } from "@/lib/admin";

const DEFAULT_COURSE_ID = 3; // CSS Beginner course — override with ?courseId=

export async function GET(req: NextRequest) {
    // const denied = await requireAdmin();
    // if (denied) return denied;

    const COURSE_ID = getCourseIdParam(req, DEFAULT_COURSE_ID);

    try {
        const chapters = await db
            .select()
            .from(CourseChaptersTable)
            .where(eq(CourseChaptersTable.courseId, COURSE_ID))
            .orderBy(CourseChaptersTable.orderIndex);

        if (chapters.length < 12) {
            return NextResponse.json(
                { error: `Found only ${chapters.length} chapters. Run seed-css-chapters first.` },
                { status: 400 }
            );
        }

        const CH = {
            intro: chapters.find(c => c.orderIndex === 1)?.id!,
            selectors: chapters.find(c => c.orderIndex === 2)?.id!,
            colors: chapters.find(c => c.orderIndex === 3)?.id!,
            typography: chapters.find(c => c.orderIndex === 4)?.id!,
            boxModel: chapters.find(c => c.orderIndex === 5)?.id!,
            spacing: chapters.find(c => c.orderIndex === 6)?.id!,
            display: chapters.find(c => c.orderIndex === 7)?.id!,
            positioning: chapters.find(c => c.orderIndex === 8)?.id!,
            flexbox: chapters.find(c => c.orderIndex === 9)?.id!,
            grid: chapters.find(c => c.orderIndex === 10)?.id!,
            responsive: chapters.find(c => c.orderIndex === 11)?.id!,
            animations: chapters.find(c => c.orderIndex === 12)?.id!,
        };

        // ─── Helper to build starter HTML ───
        const html = (body: string, cssLink = true) =>
            `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>CSS Exercise</title>${cssLink ? '\n  <link rel="stylesheet" href="/styles.css">' : ''}\n</head>\n<body>\n${body}\n</body>\n</html>`;

        const DATA = [
            // ═══════════════════════════════════════
            // Chapter 1: Introduction to CSS
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.intro,
                slug: "css-your-first-style",
                name: "Your First Style",
                xp: 15,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>CSS (Cascading Style Sheets) controls how HTML elements look on screen. Without CSS, every website would be plain black text on a white background.</p><p style='margin-bottom:8px;'>There are three ways to add CSS:</p><p style='margin-bottom:8px;'><strong>1. Inline</strong> — directly on the element: <code>&lt;p style=\"color: red;\"&gt;</code></p><p style='margin-bottom:8px;'><strong>2. Internal</strong> — inside a <code>&lt;style&gt;</code> tag in the head.</p><p style='margin-bottom:8px;'><strong>3. External</strong> — in a separate <code>.css</code> file linked with <code>&lt;link&gt;</code>. This is the best practice.</p><p style='margin-bottom:8px;'>A CSS rule has a <strong>selector</strong> (what to style) and a <strong>declaration block</strong> (how to style it): <code>h1 { color: blue; }</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>In the <code>styles.css</code> file, change the <code>&lt;h1&gt;</code> text color to <strong>blue</strong> and the <code>&lt;p&gt;</code> text color to <strong>gray</strong>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>h1 { color: blue; }</code> and <code>p { color: gray; }</code> in your CSS file.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <h1>Welcome to CSS</h1>\n  <p>This is my first styled page.</p>'), active: false },
                    "/styles.css": { code: "/* Style the h1 and p elements below */\n\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 5,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.intro,
                slug: "css-multiple-properties",
                name: "Multiple Properties",
                xp: 20,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Each CSS rule can have multiple property-value pairs separated by semicolons.</p><p style='margin-bottom:8px;'>Common properties: <code>color</code>, <code>background-color</code>, <code>font-size</code>, <code>text-align</code>, <code>font-weight</code>.</p><p style='margin-bottom:8px;'>Example:<br/><code>h1 {<br/>  color: white;<br/>  background-color: #333;<br/>  font-size: 32px;<br/>  text-align: center;<br/>}</code></p><p style='margin-bottom:8px;'>Units: <code>px</code> (pixels), <code>em</code> (relative to parent font size), <code>rem</code> (relative to root font size), <code>%</code> (percentage).</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Style the <code>&lt;h1&gt;</code>: white text, dark background (#1a1a2e), centered, and 36px font size. Style the <code>&lt;p&gt;</code>: 18px font size, centered, and a light gray color (#cccccc).</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use multiple properties inside each selector: <code>h1 { color: white; background-color: #1a1a2e; text-align: center; font-size: 36px; }</code></p></body>",
                starterCode: {
                    "/index.html": { code: html('  <h1>Styled Heading</h1>\n  <p>Learning CSS is fun!</p>'), active: false },
                    "/styles.css": { code: "/* Add multiple CSS properties to h1 and p */\n\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 8,
            },

            // ═══════════════════════════════════════
            // Chapter 2: Selectors & Specificity
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.selectors,
                slug: "css-class-and-id-selectors",
                name: "Class & ID Selectors",
                xp: 20,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Element selectors target all elements of that type. But what if you want to style only <em>some</em> paragraphs?</p><p style='margin-bottom:8px;'><strong>Class selectors</strong> use a dot: <code>.highlight { color: yellow; }</code> — matches any element with <code>class=\"highlight\"</code>. One class can be used on many elements.</p><p style='margin-bottom:8px;'><strong>ID selectors</strong> use a hash: <code>#main-title { font-size: 40px; }</code> — matches the element with <code>id=\"main-title\"</code>. IDs must be unique per page.</p><p style='margin-bottom:8px;'>Specificity order (low to high): element → class → ID → inline styles. Higher specificity wins when rules conflict.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Style the <code>#title</code> with font-size 32px and color #e94560. Style all <code>.info</code> elements with color #16213e and background-color #f0f0f0. Style the <code>.highlight</code> class with a yellow background and bold font.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>#title { ... }</code> for the ID, <code>.info { ... }</code> and <code>.highlight { ... }</code> for the classes.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <h1 id="title">CSS Selectors</h1>\n  <p class="info">This paragraph has the info class.</p>\n  <p class="info highlight">This one is highlighted too!</p>\n  <p>This paragraph has no class.</p>'), active: false },
                    "/styles.css": { code: "/* Style using #id and .class selectors */\n\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 8,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.selectors,
                slug: "css-combinator-selectors",
                name: "Combinator Selectors",
                xp: 25,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Combinators let you target elements based on their relationship to other elements.</p><p style='margin-bottom:8px;'><strong>Descendant</strong> (space): <code>div p</code> — any <code>&lt;p&gt;</code> inside a <code>&lt;div&gt;</code>, at any depth.</p><p style='margin-bottom:8px;'><strong>Child</strong> (&gt;): <code>div > p</code> — only direct children.</p><p style='margin-bottom:8px;'><strong>Group</strong> (comma): <code>h1, h2, h3 { color: blue; }</code> — same style to multiple selectors.</p><p style='margin-bottom:8px;'><strong>Attribute</strong>: <code>a[target=\"_blank\"] { color: red; }</code> — elements with specific attributes.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Style all <code>&lt;li&gt;</code> elements inside <code>.nav-list</code> with <code>display: inline</code>, margin-right 15px, and color #00b4d8. Style <code>.card > h3</code> (direct child only) with color #e94560.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>.nav-list li { ... }</code> for descendant and <code>.card > h3 { ... }</code> for direct child.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <ul class="nav-list">\n    <li>Home</li>\n    <li>About</li>\n    <li>Contact</li>\n  </ul>\n  <div class="card">\n    <h3>Card Title</h3>\n    <p>Card content here.</p>\n  </div>'), active: false },
                    "/styles.css": { code: "/* Use combinator selectors */\n\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },

            // ═══════════════════════════════════════
            // Chapter 3: Colors & Backgrounds
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.colors,
                slug: "css-color-formats",
                name: "Color Formats",
                xp: 20,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>CSS supports multiple color formats:</p><p style='margin-bottom:8px;'><strong>Named:</strong> <code>red</code>, <code>blue</code>, <code>tomato</code>, <code>cornflowerblue</code> — about 140 named colors.</p><p style='margin-bottom:8px;'><strong>Hex:</strong> <code>#ff5733</code> — 6 hex digits (RRGGBB). Short form: <code>#f00</code> = <code>#ff0000</code>.</p><p style='margin-bottom:8px;'><strong>RGB:</strong> <code>rgb(255, 87, 51)</code> — values 0-255 for red, green, blue.</p><p style='margin-bottom:8px;'><strong>RGBA:</strong> <code>rgba(255, 87, 51, 0.5)</code> — adds alpha (opacity 0-1).</p><p style='margin-bottom:8px;'><strong>HSL:</strong> <code>hsl(14, 100%, 60%)</code> — hue (0-360), saturation (%), lightness (%).</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Style each <code>&lt;div&gt;</code> box with a different background color format:<br/>Box 1: hex <code>#e94560</code><br/>Box 2: rgb <code>rgb(0, 180, 216)</code><br/>Box 3: hsl <code>hsl(150, 70%, 50%)</code><br/>Set all text to white, padding 20px, and margin-bottom 10px.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>.box-hex { background-color: #e94560; }</code>, <code>.box-rgb { background-color: rgb(0, 180, 216); }</code>, etc. Add shared styles with a grouped selector.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <div class="box box-hex">Hex Color</div>\n  <div class="box box-rgb">RGB Color</div>\n  <div class="box box-hsl">HSL Color</div>'), active: false },
                    "/styles.css": { code: "/* Shared box styles */\n.box {\n  /* add common styles here */\n}\n\n/* Individual color formats */\n\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 8,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.colors,
                slug: "css-gradients-backgrounds",
                name: "Gradients & Backgrounds",
                xp: 30,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>CSS gradients create smooth transitions between colors — no image files needed!</p><p style='margin-bottom:8px;'><strong>Linear gradient:</strong> <code>background: linear-gradient(to right, #e94560, #0f3460);</code></p><p style='margin-bottom:8px;'>Direction options: <code>to right</code>, <code>to bottom</code>, <code>45deg</code>, <code>135deg</code>.</p><p style='margin-bottom:8px;'><strong>Radial gradient:</strong> <code>background: radial-gradient(circle, #e94560, #0f3460);</code></p><p style='margin-bottom:8px;'>You can use more than two colors: <code>linear-gradient(to right, red, yellow, green)</code>.</p><p style='margin-bottom:8px;'><code>background-size</code>, <code>background-repeat</code>, and <code>background-position</code> control background image behavior.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a hero banner: linear gradient from <code>#0f3460</code> to <code>#e94560</code> going to the right. Set height to 200px, white centered text, and 48px font size. Add a card below with a radial gradient from <code>#16213e</code> center to <code>#1a1a2e</code>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>background: linear-gradient(to right, #0f3460, #e94560);</code> on the hero and <code>background: radial-gradient(circle, #16213e, #1a1a2e);</code> on the card.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <div class="hero">\n    <h1>Gradient Hero</h1>\n  </div>\n  <div class="card">\n    <p>This card has a radial gradient.</p>\n  </div>'), active: false },
                    "/styles.css": { code: "/* Hero banner with linear gradient */\n.hero {\n\n}\n\n/* Card with radial gradient */\n.card {\n  padding: 30px;\n  margin: 20px;\n  color: white;\n}\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 12,
            },

            // ═══════════════════════════════════════
            // Chapter 4: Typography & Text
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.typography,
                slug: "css-font-properties",
                name: "Font Properties",
                xp: 20,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Typography makes or breaks a design. Key font properties:</p><p style='margin-bottom:8px;'><code>font-family</code> — the typeface. Use a stack: <code>font-family: 'Segoe UI', Arial, sans-serif;</code></p><p style='margin-bottom:8px;'><code>font-size</code> — size in px, em, rem, or %. <code>1rem = 16px</code> by default.</p><p style='margin-bottom:8px;'><code>font-weight</code> — boldness: <code>normal</code> (400), <code>bold</code> (700), or numeric 100-900.</p><p style='margin-bottom:8px;'><code>line-height</code> — vertical spacing between lines. <code>1.5</code> or <code>1.6</code> is very readable.</p><p style='margin-bottom:8px;'><code>letter-spacing</code> — space between characters. <code>2px</code> for headings looks polished.</p><p style='margin-bottom:8px;'><code>text-transform</code> — <code>uppercase</code>, <code>lowercase</code>, <code>capitalize</code>.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Style the heading: font-family Arial, 36px, bold (700), uppercase, letter-spacing 3px, color #e94560. Style the paragraph: font-size 16px, line-height 1.8, color #333, font-family Georgia serif.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>text-transform: uppercase;</code> and <code>letter-spacing: 3px;</code> for the heading. Use <code>font-family: Georgia, serif;</code> for the paragraph.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <h1 class="heading">Typography Matters</h1>\n  <p class="body-text">Good typography is the difference between a website that looks amateur and one that looks professional. Pay attention to font choices, spacing, and hierarchy.</p>'), active: false },
                    "/styles.css": { code: "/* Style the heading */\n.heading {\n\n}\n\n/* Style the body text */\n.body-text {\n\n}\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 8,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.typography,
                slug: "css-text-decoration-alignment",
                name: "Text Decoration & Alignment",
                xp: 20,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'><code>text-align</code> controls horizontal alignment: <code>left</code>, <code>center</code>, <code>right</code>, <code>justify</code>.</p><p style='margin-bottom:8px;'><code>text-decoration</code> adds or removes underlines, overlines, and line-throughs.</p><p style='margin-bottom:8px;'>Remove link underlines: <code>a { text-decoration: none; }</code></p><p style='margin-bottom:8px;'><code>text-shadow</code> creates text glow effects: <code>text-shadow: 2px 2px 4px rgba(0,0,0,0.3);</code> — horizontal, vertical, blur, color.</p><p style='margin-bottom:8px;'><code>text-indent</code> — indents the first line of a paragraph.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Center the heading and add a text shadow (2px 2px 5px rgba(0,0,0,0.3)). Remove underlines from the link and make it #00b4d8 color. Right-align the footer text. Add a line-through on the <code>.old-price</code> span.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>text-align: center;</code>, <code>text-shadow: 2px 2px 5px rgba(0,0,0,0.3);</code>, <code>text-decoration: none;</code>, and <code>text-decoration: line-through;</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <h1 class="title">Shadow Title</h1>\n  <a href="#" class="link">Click me (no underline)</a>\n  <p>Price: <span class="old-price">$99</span> $49</p>\n  <footer class="footer">Copyright 2026</footer>'), active: false },
                    "/styles.css": { code: "/* Center heading + text shadow */\n.title {\n\n}\n\n/* Remove link underline */\n.link {\n\n}\n\n/* Strikethrough old price */\n.old-price {\n\n}\n\n/* Right align footer */\n.footer {\n\n}\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 8,
            },

            // ═══════════════════════════════════════
            // Chapter 5: The Box Model
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.boxModel,
                slug: "css-box-model-basics",
                name: "Box Model Basics",
                xp: 25,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Every HTML element is a rectangular box with four layers:</p><p style='margin-bottom:8px;'><strong>Content</strong> — the text/image inside.</p><p style='margin-bottom:8px;'><strong>Padding</strong> — space between content and border (inside the box).</p><p style='margin-bottom:8px;'><strong>Border</strong> — the edge of the box.</p><p style='margin-bottom:8px;'><strong>Margin</strong> — space outside the border (between this box and others).</p><p style='margin-bottom:8px;'>By default, <code>width</code> only sets the content width. Padding and border are added on top. Use <code>box-sizing: border-box;</code> to include padding and border in the width — this is the modern standard.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a box: width 300px, padding 20px, border 3px solid #e94560, margin 20px auto (centered). Set <code>box-sizing: border-box</code>. Add a background color of #1a1a2e and white text.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>.box { box-sizing: border-box; width: 300px; padding: 20px; border: 3px solid #e94560; margin: 20px auto; }</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <div class="box">\n    <h3>Box Model</h3>\n    <p>Content + Padding + Border + Margin = Total Space</p>\n  </div>'), active: false },
                    "/styles.css": { code: "/* Apply box model properties */\n.box {\n\n}\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.boxModel,
                slug: "css-box-sizing-comparison",
                name: "Box Sizing Comparison",
                xp: 30,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>The <code>box-sizing</code> property changes how width is calculated.</p><p style='margin-bottom:8px;'><code>content-box</code> (default): width = content only. Total = width + padding + border.</p><p style='margin-bottom:8px;'><code>border-box</code>: width includes content + padding + border. Much more intuitive!</p><p style='margin-bottom:8px;'>If you set <code>width: 300px; padding: 20px; border: 5px solid;</code>:<br/>• content-box total = 300 + 40 + 10 = 350px<br/>• border-box total = 300px (padding/border eat into content)</p><p style='margin-bottom:8px;'>Best practice — add this at the top of every CSS file:<br/><code>*, *::before, *::after { box-sizing: border-box; }</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create two boxes side by side, both with width 200px, padding 20px, border 3px solid. The first uses <code>content-box</code> (default), the second uses <code>border-box</code>. Give them different background colors so you can see the size difference.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>.box-content { box-sizing: content-box; }</code> and <code>.box-border { box-sizing: border-box; }</code>. Both should have the same width, padding, border values.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <div class="wrapper">\n    <div class="box box-content">\n      <p>content-box (default)</p>\n      <p>Width: 200px</p>\n    </div>\n    <div class="box box-border">\n      <p>border-box</p>\n      <p>Width: 200px</p>\n    </div>\n  </div>'), active: false },
                    "/styles.css": { code: ".wrapper {\n  display: flex;\n  gap: 20px;\n  padding: 20px;\n}\n\n/* Shared box styles */\n.box {\n  width: 200px;\n  padding: 20px;\n  border: 3px solid #e94560;\n  color: white;\n}\n\n/* content-box */\n.box-content {\n\n}\n\n/* border-box */\n.box-border {\n\n}\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 12,
            },

            // ═══════════════════════════════════════
            // Chapter 6: Margins, Padding & Borders
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.spacing,
                slug: "css-spacing-shorthand",
                name: "Spacing Shorthand",
                xp: 20,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Margin and padding have shorthand syntax:</p><p style='margin-bottom:8px;'><code>margin: 10px;</code> — all 4 sides</p><p style='margin-bottom:8px;'><code>margin: 10px 20px;</code> — top/bottom, left/right</p><p style='margin-bottom:8px;'><code>margin: 10px 20px 30px 40px;</code> — top, right, bottom, left (clockwise)</p><p style='margin-bottom:8px;'>Same shorthand works for <code>padding</code>.</p><p style='margin-bottom:8px;'><code>margin: 0 auto;</code> centers a block element horizontally (must have a set width).</p><p style='margin-bottom:8px;'>Margin collapse: when two vertical margins meet, only the larger one applies.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Style the card: 400px width, centered with <code>margin: 0 auto</code>, padding 30px, background #1a1a2e, white text, 10px border-radius. Add a 20px margin-bottom between the two cards.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>.card { width: 400px; margin: 0 auto 20px auto; padding: 30px; border-radius: 10px; }</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <div class="card">\n    <h2>Card One</h2>\n    <p>A nicely spaced card with padding and rounded corners.</p>\n  </div>\n  <div class="card">\n    <h2>Card Two</h2>\n    <p>Another card below with margin between them.</p>\n  </div>'), active: false },
                    "/styles.css": { code: "body {\n  background-color: #0f0f0f;\n  font-family: Arial, sans-serif;\n}\n\n/* Style the cards */\n.card {\n\n}\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 8,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.spacing,
                slug: "css-border-styles",
                name: "Border Styles & Shadows",
                xp: 25,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Border shorthand: <code>border: width style color;</code></p><p style='margin-bottom:8px;'>Styles: <code>solid</code>, <code>dashed</code>, <code>dotted</code>, <code>double</code>, <code>groove</code>, <code>none</code>.</p><p style='margin-bottom:8px;'>You can set individual sides: <code>border-left: 4px solid #e94560;</code></p><p style='margin-bottom:8px;'><code>border-radius</code> rounds corners. Use <code>50%</code> to make a circle (on a square element).</p><p style='margin-bottom:8px;'><code>box-shadow</code>: <code>box-shadow: x y blur spread color;</code><br/>Example: <code>box-shadow: 0 4px 15px rgba(0,0,0,0.3);</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Style the profile card: 4px left border in #e94560, 12px border-radius, box-shadow <code>0 4px 20px rgba(0,0,0,0.4)</code>, padding 25px. Make the avatar a circle (border-radius 50%, width/height 80px).</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>border-left: 4px solid #e94560;</code> and <code>border-radius: 50%;</code> for the avatar circle.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <div class="profile-card">\n    <div class="avatar"></div>\n    <h3>Shubham Kumar</h3>\n    <p>Full Stack Developer</p>\n  </div>'), active: false },
                    "/styles.css": { code: "body {\n  background: #0f0f0f;\n  display: flex;\n  justify-content: center;\n  padding-top: 50px;\n  font-family: Arial, sans-serif;\n  color: white;\n}\n\n/* Profile card */\n.profile-card {\n  background: #1a1a2e;\n}\n\n/* Avatar circle */\n.avatar {\n  background: #e94560;\n}\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },

            // ═══════════════════════════════════════
            // Chapter 7: Display & Visibility
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.display,
                slug: "css-display-property",
                name: "Display Property",
                xp: 25,
                difficulty: "medium",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Every element has a default display value:</p><p style='margin-bottom:8px;'><strong>block</strong> — takes full width, starts on a new line. (div, h1-h6, p, section)</p><p style='margin-bottom:8px;'><strong>inline</strong> — takes only needed width, stays in line. Cannot set width/height. (span, a, strong)</p><p style='margin-bottom:8px;'><strong>inline-block</strong> — like inline but you CAN set width/height. Great for buttons.</p><p style='margin-bottom:8px;'><strong>none</strong> — completely removes the element from the page (no space reserved).</p><p style='margin-bottom:8px;'><code>visibility: hidden;</code> hides the element but keeps its space in the layout.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Make the navigation links display as <code>inline-block</code> with padding 10px 20px, background #16213e, color white, and margin-right 5px. Hide the <code>.secret</code> element completely with <code>display: none</code>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>.nav-link { display: inline-block; padding: 10px 20px; }</code> and <code>.secret { display: none; }</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <nav>\n    <a href="#" class="nav-link">Home</a>\n    <a href="#" class="nav-link">About</a>\n    <a href="#" class="nav-link">Portfolio</a>\n    <a href="#" class="nav-link">Contact</a>\n  </nav>\n  <p class="secret">You should not see this!</p>\n  <p>This text should be visible.</p>'), active: false },
                    "/styles.css": { code: "body { font-family: Arial, sans-serif; }\n\n/* Nav links as inline-block buttons */\n.nav-link {\n  text-decoration: none;\n}\n\n/* Hide the secret element */\n.secret {\n\n}\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.display,
                slug: "css-overflow-control",
                name: "Overflow Control",
                xp: 20,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>When content is bigger than its container, <code>overflow</code> controls what happens:</p><p style='margin-bottom:8px;'><code>overflow: visible;</code> — default, content spills out.</p><p style='margin-bottom:8px;'><code>overflow: hidden;</code> — content is clipped, no scrollbar.</p><p style='margin-bottom:8px;'><code>overflow: scroll;</code> — always shows scrollbars.</p><p style='margin-bottom:8px;'><code>overflow: auto;</code> — shows scrollbar only when needed. Best choice!</p><p style='margin-bottom:8px;'>You can control axes independently: <code>overflow-x</code> and <code>overflow-y</code>.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a scrollable text box: 200px height, <code>overflow: auto</code>, padding 15px, border 1px solid #333, background #1a1a2e. The text inside should be long enough to scroll.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>.scroll-box { height: 200px; overflow: auto; }</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <div class="scroll-box">\n    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>\n    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>\n    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>\n    <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos.</p>\n  </div>'), active: false },
                    "/styles.css": { code: "body { font-family: Arial, sans-serif; color: white; background: #0f0f0f; padding: 20px; }\n\n/* Scrollable container */\n.scroll-box {\n\n}\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 8,
            },

            // ═══════════════════════════════════════
            // Chapter 8: Positioning
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.positioning,
                slug: "css-relative-absolute",
                name: "Relative & Absolute",
                xp: 30,
                difficulty: "medium",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>CSS positioning lets you place elements precisely:</p><p style='margin-bottom:8px;'><code>static</code> — default, follows normal flow.</p><p style='margin-bottom:8px;'><code>relative</code> — moves from its normal position. Space is preserved. Use <code>top</code>, <code>left</code>, etc.</p><p style='margin-bottom:8px;'><code>absolute</code> — removed from flow, positioned relative to nearest positioned ancestor. If none, relative to <code>&lt;body&gt;</code>.</p><p style='margin-bottom:8px;'>The key pattern: set <code>position: relative;</code> on the parent, then <code>position: absolute;</code> on the child to position it within the parent.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Make the card <code>position: relative</code>. Place the badge (<code>.badge</code>) at the top-right corner using <code>position: absolute; top: -10px; right: -10px;</code>. Style the badge with background #e94560, white text, padding 5px 12px, and border-radius 20px.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Parent needs <code>position: relative;</code> and child needs <code>position: absolute; top: -10px; right: -10px;</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <div class="card">\n    <span class="badge">NEW</span>\n    <h3>Product Card</h3>\n    <p>A card with a positioned badge in the corner.</p>\n  </div>'), active: false },
                    "/styles.css": { code: "body {\n  background: #0f0f0f;\n  display: flex;\n  justify-content: center;\n  padding-top: 60px;\n  font-family: Arial, sans-serif;\n}\n\n/* Card — needs relative positioning */\n.card {\n  background: #1a1a2e;\n  color: white;\n  padding: 30px;\n  width: 300px;\n  border-radius: 12px;\n}\n\n/* Badge — absolute positioned */\n.badge {\n  font-size: 12px;\n  font-weight: bold;\n}\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 12,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.positioning,
                slug: "css-fixed-sticky",
                name: "Fixed & Sticky",
                xp: 25,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'><code>fixed</code> — stays in the same spot even when scrolling. Positioned relative to the viewport. Great for navbars and floating buttons.</p><p style='margin-bottom:8px;'>Example: <code>position: fixed; top: 0; left: 0; width: 100%;</code></p><p style='margin-bottom:8px;'><code>sticky</code> — acts like relative until you scroll past it, then it sticks. Best of both worlds!</p><p style='margin-bottom:8px;'>Sticky requires a <code>top</code> value: <code>position: sticky; top: 0;</code></p><p style='margin-bottom:8px;'>Fixed elements are removed from flow (other content goes behind). Add <code>z-index</code> to control layering.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Make the navbar <code>position: sticky; top: 0;</code> with background #0f3460, white text, padding 15px, and z-index 100. The page should scroll but the nav stays at the top.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>.navbar { position: sticky; top: 0; z-index: 100; }</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <nav class="navbar">DevArcade Navigation</nav>\n  <section class="content">\n    <h2>Section 1</h2>\n    <p>Scroll down to see the sticky navbar in action. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\n    <h2>Section 2</h2>\n    <p>The navbar should stay at the top as you scroll through this content.</p>\n    <h2>Section 3</h2>\n    <p>Sticky positioning is perfect for navigation bars and table headers.</p>\n    <h2>Section 4</h2>\n    <p>Keep scrolling! The navbar remains visible at all times.</p>\n  </section>'), active: false },
                    "/styles.css": { code: "body {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  background: #0f0f0f;\n  color: white;\n}\n\n/* Sticky navbar */\n.navbar {\n\n}\n\n.content {\n  padding: 30px;\n  min-height: 150vh;\n}\n\n.content h2 {\n  color: #e94560;\n  margin-top: 60px;\n}\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },

            // ═══════════════════════════════════════
            // Chapter 9: Flexbox Layout
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.flexbox,
                slug: "css-flexbox-basics",
                name: "Flexbox Basics",
                xp: 25,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Flexbox is a one-dimensional layout system. Set <code>display: flex;</code> on the parent (flex container).</p><p style='margin-bottom:8px;'>Key container properties:</p><p style='margin-bottom:8px;'><code>justify-content</code> — horizontal alignment: <code>flex-start</code>, <code>center</code>, <code>flex-end</code>, <code>space-between</code>, <code>space-around</code>, <code>space-evenly</code>.</p><p style='margin-bottom:8px;'><code>align-items</code> — vertical alignment: <code>flex-start</code>, <code>center</code>, <code>flex-end</code>, <code>stretch</code>.</p><p style='margin-bottom:8px;'><code>gap</code> — space between flex items.</p><p style='margin-bottom:8px;'><code>flex-direction</code> — <code>row</code> (default), <code>column</code>, <code>row-reverse</code>.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Make the container a flex layout. Center items both horizontally and vertically. Add a 20px gap. Each box should be 100px × 100px with a different background color.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>.container { display: flex; justify-content: center; align-items: center; gap: 20px; }</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <div class="container">\n    <div class="box box-1">1</div>\n    <div class="box box-2">2</div>\n    <div class="box box-3">3</div>\n  </div>'), active: false },
                    "/styles.css": { code: "body {\n  background: #0f0f0f;\n  font-family: Arial, sans-serif;\n  margin: 0;\n}\n\n/* Flex container */\n.container {\n  min-height: 100vh;\n}\n\n/* Shared box styles */\n.box {\n  width: 100px;\n  height: 100px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  color: white;\n  font-size: 24px;\n  font-weight: bold;\n  border-radius: 12px;\n}\n\n.box-1 { background: #e94560; }\n.box-2 { background: #0f3460; }\n.box-3 { background: #00b4d8; }\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.flexbox,
                slug: "css-flexbox-navbar",
                name: "Flexbox Navbar",
                xp: 30,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Flexbox is perfect for navbars — logo on the left, links on the right.</p><p style='margin-bottom:8px;'>The pattern: <code>display: flex; justify-content: space-between; align-items: center;</code></p><p style='margin-bottom:8px;'><code>flex-grow</code> — how much a flex item should grow relative to others. <code>flex-grow: 1;</code> fills remaining space.</p><p style='margin-bottom:8px;'><code>flex-wrap: wrap;</code> — items wrap to the next line if they don't fit.</p><p style='margin-bottom:8px;'>Use nested flex containers for complex layouts — the nav links group can itself be a flex container.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a navbar: logo on the left, nav links on the right using <code>space-between</code>. The nav links should also be a flex container with a 25px gap. Style the links with no underline, white color, and hover color #e94560.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>.navbar { display: flex; justify-content: space-between; align-items: center; }</code> and <code>.nav-links { display: flex; gap: 25px; }</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <nav class="navbar">\n    <div class="logo">DevArcade</div>\n    <div class="nav-links">\n      <a href="#">Home</a>\n      <a href="#">Courses</a>\n      <a href="#">About</a>\n      <a href="#">Contact</a>\n    </div>\n  </nav>'), active: false },
                    "/styles.css": { code: "body {\n  margin: 0;\n  font-family: Arial, sans-serif;\n  background: #0f0f0f;\n}\n\n/* Navbar flex container */\n.navbar {\n  background: #1a1a2e;\n  padding: 15px 30px;\n}\n\n/* Logo */\n.logo {\n  color: #e94560;\n  font-size: 22px;\n  font-weight: bold;\n}\n\n/* Nav links group */\n.nav-links {\n\n}\n\n/* Individual links */\n.nav-links a {\n\n}\n\n.nav-links a:hover {\n\n}\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 12,
            },

            // ═══════════════════════════════════════
            // Chapter 10: CSS Grid Layout
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.grid,
                slug: "css-grid-basics",
                name: "Grid Basics",
                xp: 30,
                difficulty: "medium",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>CSS Grid is a two-dimensional layout system — rows AND columns at the same time.</p><p style='margin-bottom:8px;'>Set <code>display: grid;</code> on the container, then define columns:</p><p style='margin-bottom:8px;'><code>grid-template-columns: 200px 200px 200px;</code> — three 200px columns.</p><p style='margin-bottom:8px;'><code>grid-template-columns: 1fr 1fr 1fr;</code> — three equal columns (<code>fr</code> = fraction of available space).</p><p style='margin-bottom:8px;'><code>grid-template-columns: repeat(3, 1fr);</code> — shorthand for the same thing.</p><p style='margin-bottom:8px;'><code>gap</code> — space between rows and columns. <code>row-gap</code> and <code>column-gap</code> for individual control.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a 3-column grid layout using <code>repeat(3, 1fr)</code> with a 20px gap. Each grid item should have padding 30px, background #1a1a2e, border-radius 10px, and centered text.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <div class="grid">\n    <div class="item">Item 1</div>\n    <div class="item">Item 2</div>\n    <div class="item">Item 3</div>\n    <div class="item">Item 4</div>\n    <div class="item">Item 5</div>\n    <div class="item">Item 6</div>\n  </div>'), active: false },
                    "/styles.css": { code: "body {\n  background: #0f0f0f;\n  font-family: Arial, sans-serif;\n  padding: 20px;\n  color: white;\n}\n\n/* Grid container */\n.grid {\n\n}\n\n/* Grid items */\n.item {\n\n}\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 12,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.grid,
                slug: "css-grid-spanning",
                name: "Grid Spanning & Areas",
                xp: 35,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Grid items can span multiple columns or rows:</p><p style='margin-bottom:8px;'><code>grid-column: 1 / 3;</code> — spans from column line 1 to 3 (2 columns wide).</p><p style='margin-bottom:8px;'><code>grid-column: span 2;</code> — shorthand for spanning 2 columns.</p><p style='margin-bottom:8px;'><code>grid-row: 1 / 3;</code> — spans 2 rows.</p><p style='margin-bottom:8px;'>Grid areas let you name regions: <code>grid-template-areas: \"header header\" \"sidebar main\" \"footer footer\";</code></p><p style='margin-bottom:8px;'>Then assign items: <code>.header { grid-area: header; }</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a dashboard layout: the header spans all 3 columns. The featured item spans 2 columns. Use <code>grid-column: span N</code> syntax.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>.header { grid-column: span 3; }</code> and <code>.featured { grid-column: span 2; }</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <div class="dashboard">\n    <div class="item header">Header (spans 3 columns)</div>\n    <div class="item featured">Featured (spans 2)</div>\n    <div class="item">Sidebar</div>\n    <div class="item">Card 1</div>\n    <div class="item">Card 2</div>\n    <div class="item">Card 3</div>\n  </div>'), active: false },
                    "/styles.css": { code: "body {\n  background: #0f0f0f;\n  font-family: Arial, sans-serif;\n  padding: 20px;\n  color: white;\n}\n\n.dashboard {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 15px;\n}\n\n.item {\n  background: #1a1a2e;\n  padding: 25px;\n  border-radius: 10px;\n  text-align: center;\n}\n\n/* Header spans full width */\n.header {\n\n}\n\n/* Featured spans 2 columns */\n.featured {\n\n}\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 15,
            },

            // ═══════════════════════════════════════
            // Chapter 11: Responsive Design
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.responsive,
                slug: "css-media-queries",
                name: "Media Queries",
                xp: 30,
                difficulty: "medium",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Media queries apply styles based on screen size. This is the core of responsive design.</p><p style='margin-bottom:8px;'>Syntax: <code>@media (max-width: 768px) { /* mobile styles */ }</code></p><p style='margin-bottom:8px;'>Common breakpoints:<br/>• Mobile: <code>max-width: 480px</code><br/>• Tablet: <code>max-width: 768px</code><br/>• Desktop: <code>min-width: 1024px</code></p><p style='margin-bottom:8px;'><strong>Mobile-first</strong> approach: write mobile styles as default, then use <code>min-width</code> queries to add desktop enhancements.</p><p style='margin-bottom:8px;'>Always include the viewport meta tag: <code>&lt;meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"&gt;</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a responsive grid: 3 columns on desktop (above 768px), 2 columns on tablet (481px-768px), and 1 column on mobile (480px and below). Use media queries to change <code>grid-template-columns</code>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Start with 1 column (mobile-first), then <code>@media (min-width: 481px) { .grid { grid-template-columns: repeat(2, 1fr); } }</code> and <code>@media (min-width: 769px) { ... repeat(3, 1fr) }</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <h1 class="title">Responsive Grid</h1>\n  <div class="grid">\n    <div class="card">Card 1</div>\n    <div class="card">Card 2</div>\n    <div class="card">Card 3</div>\n    <div class="card">Card 4</div>\n    <div class="card">Card 5</div>\n    <div class="card">Card 6</div>\n  </div>'), active: false },
                    "/styles.css": { code: "body {\n  background: #0f0f0f;\n  font-family: Arial, sans-serif;\n  color: white;\n  padding: 20px;\n}\n\n.title { text-align: center; color: #e94560; }\n\n/* Mobile-first: 1 column */\n.grid {\n  display: grid;\n  gap: 15px;\n}\n\n.card {\n  background: #1a1a2e;\n  padding: 30px;\n  border-radius: 10px;\n  text-align: center;\n}\n\n/* Tablet: 2 columns */\n\n\n/* Desktop: 3 columns */\n\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 12,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.responsive,
                slug: "css-relative-units",
                name: "Relative Units",
                xp: 25,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Fixed units (px) don't adapt. Relative units scale with context:</p><p style='margin-bottom:8px;'><code>%</code> — relative to parent: <code>width: 80%;</code></p><p style='margin-bottom:8px;'><code>em</code> — relative to parent font-size: <code>1.5em = 1.5× parent size</code></p><p style='margin-bottom:8px;'><code>rem</code> — relative to root (html) font-size: <code>1rem = 16px</code> by default. More predictable than em.</p><p style='margin-bottom:8px;'><code>vw/vh</code> — viewport width/height: <code>100vw = full screen width</code>, <code>50vh = half screen height</code></p><p style='margin-bottom:8px;'><code>max-width</code> — prevents elements from getting too wide: <code>max-width: 800px; width: 90%;</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a container with <code>max-width: 800px</code>, <code>width: 90%</code>, and <code>margin: 0 auto</code>. Use <code>rem</code> for all font sizes (h1: 2.5rem, p: 1.1rem). Set the hero section to <code>min-height: 50vh</code>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>.container { max-width: 800px; width: 90%; margin: 0 auto; }</code> and <code>.hero { min-height: 50vh; }</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <div class="container">\n    <div class="hero">\n      <h1>Responsive Units</h1>\n      <p>This layout uses rem, %, and vh units instead of fixed pixels.</p>\n    </div>\n    <p class="body-text">This container has a max-width so it never gets too wide on big screens, but shrinks on small screens.</p>\n  </div>'), active: false },
                    "/styles.css": { code: "html { font-size: 16px; }\n\nbody {\n  background: #0f0f0f;\n  font-family: Arial, sans-serif;\n  color: white;\n  margin: 0;\n  padding: 20px;\n}\n\n/* Responsive container */\n.container {\n\n}\n\n/* Hero with viewport units */\n.hero {\n  background: #1a1a2e;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  border-radius: 12px;\n  margin-bottom: 20px;\n}\n\n.hero h1 {\n\n}\n\n.body-text {\n\n}\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },

            // ═══════════════════════════════════════
            // Chapter 12: Transitions & Animations
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.animations,
                slug: "css-transitions",
                name: "Smooth Transitions",
                xp: 25,
                difficulty: "medium",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Transitions animate changes smoothly instead of snapping instantly.</p><p style='margin-bottom:8px;'>Shorthand: <code>transition: property duration timing-function delay;</code></p><p style='margin-bottom:8px;'>Example: <code>transition: background-color 0.3s ease;</code></p><p style='margin-bottom:8px;'><code>transition: all 0.3s ease;</code> — transitions every changed property.</p><p style='margin-bottom:8px;'>Timing functions: <code>ease</code> (default), <code>linear</code>, <code>ease-in</code>, <code>ease-out</code>, <code>ease-in-out</code>.</p><p style='margin-bottom:8px;'>Common uses: hover effects on buttons, color changes, size changes, opacity fades.</p><p style='margin-bottom:8px;'><code>transform: scale(1.05);</code> — scales up by 5%, great for hover card effects.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Add transitions to the button: on hover, change background to #e94560, scale up to 1.05, and add box-shadow. Use <code>transition: all 0.3s ease;</code>. Add a card that scales to 1.03 on hover with a shadow transition.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Set <code>transition: all 0.3s ease;</code> on the element itself (not on :hover). Then add <code>.btn:hover { transform: scale(1.05); }</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <div class="container">\n    <button class="btn">Hover Me</button>\n    <div class="card">\n      <h3>Hover Card</h3>\n      <p>Hover over this card for a smooth scale effect.</p>\n    </div>\n  </div>'), active: false },
                    "/styles.css": { code: "body {\n  background: #0f0f0f;\n  font-family: Arial, sans-serif;\n  color: white;\n  display: flex;\n  justify-content: center;\n  padding-top: 50px;\n}\n\n.container {\n  text-align: center;\n}\n\n/* Button with transition */\n.btn {\n  background: #0f3460;\n  color: white;\n  border: none;\n  padding: 14px 35px;\n  font-size: 16px;\n  border-radius: 8px;\n  cursor: pointer;\n  margin-bottom: 30px;\n}\n\n.btn:hover {\n\n}\n\n/* Card with hover effect */\n.card {\n  background: #1a1a2e;\n  padding: 30px;\n  border-radius: 12px;\n  width: 300px;\n  margin-top: 20px;\n}\n\n.card:hover {\n\n}\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.animations,
                slug: "css-keyframe-animations",
                name: "Keyframe Animations",
                xp: 35,
                difficulty: "hard",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Keyframe animations give you full control over multi-step animations.</p><p style='margin-bottom:8px;'>1. Define the animation with <code>@keyframes</code>:<br/><code>@keyframes fadeIn {<br/>  from { opacity: 0; }<br/>  to { opacity: 1; }<br/>}</code></p><p style='margin-bottom:8px;'>2. Apply it: <code>animation: fadeIn 1s ease forwards;</code></p><p style='margin-bottom:8px;'>Properties: <code>animation-name</code>, <code>animation-duration</code>, <code>animation-timing-function</code>, <code>animation-delay</code>, <code>animation-iteration-count</code> (use <code>infinite</code> for loops), <code>animation-fill-mode</code> (<code>forwards</code> keeps end state).</p><p style='margin-bottom:8px;'>Use percentages for multi-step: <code>0% { ... } 50% { ... } 100% { ... }</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a <code>@keyframes pulse</code> animation that scales a circle from 1 to 1.2 and back. Set it to run <code>infinite</code> with <code>ease-in-out</code>. Also create a <code>@keyframes slideIn</code> that moves the heading from <code>translateX(-100px)</code> with opacity 0 to its normal position with opacity 1.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }</code> and apply with <code>animation: pulse 2s ease-in-out infinite;</code>.</p></body>",
                starterCode: {
                    "/index.html": { code: html('  <h1 class="slide-in">Animations!</h1>\n  <div class="pulse-circle"></div>'), active: false },
                    "/styles.css": { code: "body {\n  background: #0f0f0f;\n  font-family: Arial, sans-serif;\n  color: white;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding-top: 60px;\n}\n\n/* Define the pulse animation */\n\n\n/* Define the slide-in animation */\n\n\n/* Pulsing circle */\n.pulse-circle {\n  width: 100px;\n  height: 100px;\n  background: #e94560;\n  border-radius: 50%;\n  margin-top: 40px;\n}\n\n/* Heading that slides in */\n.slide-in {\n  font-size: 2.5rem;\n  color: #00b4d8;\n}\n", active: true }
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 15,
            },
        ];

        let successCount = 0;
        let errors: string[] = [];

        for (const item of DATA) {
            try {
                await db.insert(ExerciseTable).values(item);
                successCount++;
            } catch (err: any) {
                if (err.code === '23505') {
                    console.log(`Skipped duplicate slug: ${item.slug}`);
                } else {
                    errors.push(`Failed on ${item.slug}: ${err.message}`);
                }
            }
        }

        return NextResponse.json({
            message: "CSS exercises seed finished",
            successCount,
            totalAttempted: DATA.length,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
