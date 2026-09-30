import { db } from "@/config/db";
import { ExerciseTable, CourseChaptersTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getCourseIdParam, requireAdmin } from "@/lib/admin";

// Override with ?courseId=<id returned by /api/admin/seed-js-course>
const DEFAULT_COURSE_ID = 6;

export async function GET(req: NextRequest) {
    const denied = await requireAdmin();
    if (denied) return denied;

    const COURSE_ID = getCourseIdParam(req, DEFAULT_COURSE_ID);

    try {
        const chapters = await db
            .select()
            .from(CourseChaptersTable)
            .where(eq(CourseChaptersTable.courseId, COURSE_ID))
            .orderBy(CourseChaptersTable.orderIndex);

        if (chapters.length < 12) {
            return NextResponse.json(
                { error: `Found only ${chapters.length} chapters. Run seed-js-course first.` },
                { status: 400 }
            );
        }

        const CH = {
            helloJs: chapters.find(c => c.orderIndex === 1)?.id!,
            variables: chapters.find(c => c.orderIndex === 2)?.id!,
            dataTypes: chapters.find(c => c.orderIndex === 3)?.id!,
            operators: chapters.find(c => c.orderIndex === 4)?.id!,
            conditionals: chapters.find(c => c.orderIndex === 5)?.id!,
            loops: chapters.find(c => c.orderIndex === 6)?.id!,
            functions: chapters.find(c => c.orderIndex === 7)?.id!,
            arrays: chapters.find(c => c.orderIndex === 8)?.id!,
            objects: chapters.find(c => c.orderIndex === 9)?.id!,
            dom: chapters.find(c => c.orderIndex === 10)?.id!,
            arrayMethods: chapters.find(c => c.orderIndex === 11)?.id!,
            errorHandling: chapters.find(c => c.orderIndex === 12)?.id!,
        };

        // Helper to build starter HTML
        const html = (body: string, css = "") =>
            `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>JS Exercise</title>\n  <style>\n    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f0f; color: #d6deeb; padding: 20px; }\n    .output { background: #1a1a2e; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 3px solid #00b4d8; }\n    h2 { color: #e94560; }${css}\n  </style>\n</head>\n<body>\n${body}\n</body>\n</html>`;

        const DATA = [
            // ═══════════════════════════════════════
            // Chapter 1: Hello JavaScript
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.helloJs,
                slug: "js-your-first-script",
                name: "Your First Script",
                xp: 15,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>JavaScript makes web pages interactive. It runs directly in the browser.</p><p style='margin-bottom:8px;'>You add JavaScript with the <code>&lt;script&gt;</code> tag, usually before <code>&lt;/body&gt;</code>.</p><p style='margin-bottom:8px;'><code>document.write()</code> writes directly to the page — simple for learning, but not used in production.</p><p style='margin-bottom:8px;'>A more modern approach is <code>document.getElementById('id').textContent = 'text';</code> — this targets a specific element.</p><p style='margin-bottom:8px;'>Every statement ends with a semicolon <code>;</code> (optional but recommended).</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Write JavaScript inside the <code>&lt;script&gt;</code> tag to set the text of the <code>#output</code> element to <strong>Hello, JavaScript!</strong></p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>document.getElementById('output').textContent = 'Hello, JavaScript!';</code></p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>My First JavaScript</h2>\n  <div id="output" class="output">Waiting for JavaScript...</div>\n\n  <script>\n    // Write your JavaScript here\n    \n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 5,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.helloJs,
                slug: "js-multiple-outputs",
                name: "Multiple Outputs",
                xp: 20,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>You can target multiple elements and change their content.</p><p style='margin-bottom:8px;'><code>textContent</code> sets plain text. <code>innerHTML</code> lets you insert HTML tags.</p><p style='margin-bottom:8px;'>Comments in JavaScript: <code>// single line</code> or <code>/* multi-line */</code>.</p><p style='margin-bottom:8px;'><code>console.log()</code> prints to the browser console (press F12 to see it). Great for debugging.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Set <code>#greeting</code> text to <strong>Welcome to DevArcade!</strong> and <code>#info</code> innerHTML to <strong>Learning &lt;em&gt;JavaScript&lt;/em&gt; is fun!</strong></p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>.textContent</code> for the first and <code>.innerHTML</code> for the second (to render the &lt;em&gt; tag).</p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <div id="greeting" class="output">...</div>\n  <div id="info" class="output">...</div>\n\n  <script>\n    // Set the greeting text\n    \n    // Set the info with HTML formatting\n    \n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 8,
            },

            // ═══════════════════════════════════════
            // Chapter 2: Variables & Constants
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.variables,
                slug: "js-let-and-const",
                name: "Let & Const",
                xp: 20,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>JavaScript has three ways to declare variables:</p><p style='margin-bottom:8px;'><code>let</code> — can be reassigned. Block-scoped. Use for values that change.</p><p style='margin-bottom:8px;'><code>const</code> — cannot be reassigned. Block-scoped. Use by default!</p><p style='margin-bottom:8px;'><code>var</code> — the old way. Function-scoped. Avoid in modern code.</p><p style='margin-bottom:8px;'>Rule of thumb: Use <code>const</code> by default. Switch to <code>let</code> only if you need to reassign.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a <code>const</code> called <code>appName</code> with value <strong>DevArcade</strong> and a <code>let</code> called <code>score</code> starting at <strong>0</strong>. Increase score by 10. Display both in the output div.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>const appName = 'DevArcade';</code> and <code>let score = 0; score += 10;</code>. Then set the textContent.</p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Variables</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    // Declare your variables\n    \n    \n    // Increase score by 10\n    \n    \n    // Display result\n    document.getElementById("output").textContent = appName + " - Score: " + score;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 8,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.variables,
                slug: "js-template-literals",
                name: "Template Literals",
                xp: 25,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Template literals use backticks <code>`</code> instead of quotes. They allow:</p><p style='margin-bottom:8px;'><strong>Variable insertion:</strong> <code>`Hello, ${name}!`</code></p><p style='margin-bottom:8px;'><strong>Expressions:</strong> <code>`2 + 3 = ${2 + 3}`</code></p><p style='margin-bottom:8px;'><strong>Multi-line strings:</strong> No more <code>\\n</code> needed!</p><p style='margin-bottom:8px;'>Much cleaner than string concatenation with <code>+</code>.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create variables <code>name</code> and <code>language</code>. Use a template literal to display: <strong>Hi, I'm [name] and I'm learning [language]!</strong></p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use backticks: <code>`Hi, I'm ${name} and I'm learning ${language}!`</code></p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Template Literals</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    // Create your variables\n    \n    \n    // Use a template literal\n    const message = ``;\n    \n    document.getElementById("output").textContent = message;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },

            // ═══════════════════════════════════════
            // Chapter 3: Data Types & Type Coercion
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.dataTypes,
                slug: "js-typeof-operator",
                name: "typeof Operator",
                xp: 20,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>JavaScript primitive types: <code>string</code>, <code>number</code>, <code>boolean</code>, <code>undefined</code>, <code>null</code>, <code>bigint</code>, <code>symbol</code>.</p><p style='margin-bottom:8px;'>Use <code>typeof</code> to check: <code>typeof 42</code> → <code>\"number\"</code>.</p><p style='margin-bottom:8px;'>Quirk: <code>typeof null</code> → <code>\"object\"</code> (a famous JS bug!).</p><p style='margin-bottom:8px;'><code>NaN</code> means Not-a-Number: <code>typeof NaN</code> → <code>\"number\"</code> (another quirk!).</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create variables of 5 different types and display <code>typeof</code> each one in a list format inside the output div.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create: <code>const a = 42; const b = 'hello'; const c = true; let d; const e = null;</code>. Use <code>typeof</code> on each.</p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Data Types</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    // Create 5 variables of different types\n    \n    \n    // Display typeof each\n    document.getElementById("output").innerHTML = `\n      number: ${typeof 0}<br>\n      string: ${typeof ""}<br>\n      boolean: ${typeof false}<br>\n      undefined: ${typeof undefined}<br>\n      null: ${typeof null} (quirk!)\n    `;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 8,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.dataTypes,
                slug: "js-type-conversion",
                name: "Type Conversion",
                xp: 25,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>JavaScript converts types automatically (coercion) and you can do it manually:</p><p style='margin-bottom:8px;'><code>String(42)</code> → <code>\"42\"</code></p><p style='margin-bottom:8px;'><code>Number(\"42\")</code> → <code>42</code> | <code>Number(\"hello\")</code> → <code>NaN</code></p><p style='margin-bottom:8px;'><code>Boolean(0)</code> → <code>false</code> | <code>Boolean(\"hello\")</code> → <code>true</code></p><p style='margin-bottom:8px;'>Falsy values: <code>0</code>, <code>\"\"</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>, <code>false</code>. Everything else is truthy.</p><p style='margin-bottom:8px;'>Coercion trap: <code>\"5\" + 3</code> → <code>\"53\"</code> (string concat!) but <code>\"5\" - 3</code> → <code>2</code> (number math!).</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Show coercion in action: display the result and type of <code>'5' + 3</code>, <code>'5' - 3</code>, <code>Number('42')</code>, and <code>Boolean('')</code>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use template literals to show: <code>`'5' + 3 = ${'5' + 3} (${typeof('5' + 3)})`</code></p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Type Coercion</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    // Show coercion results\n    const results = `\n      "5" + 3 = ${/* your code */""}<br>\n      "5" - 3 = ${/* your code */""}<br>\n      Number("42") = ${/* your code */""}<br>\n      Boolean("") = ${/* your code */""}\n    `;\n    document.getElementById("output").innerHTML = results;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },

            // ═══════════════════════════════════════
            // Chapter 4: Operators & Expressions
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.operators,
                slug: "js-arithmetic-operators",
                name: "Arithmetic Operators",
                xp: 20,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Arithmetic: <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>%</code> (modulo/remainder), <code>**</code> (exponent).</p><p style='margin-bottom:8px;'><code>10 % 3</code> → <code>1</code> (remainder). Great for checking even/odd.</p><p style='margin-bottom:8px;'><code>2 ** 3</code> → <code>8</code> (2 to the power of 3).</p><p style='margin-bottom:8px;'>Increment/Decrement: <code>count++</code> (add 1), <code>count--</code> (subtract 1).</p><p style='margin-bottom:8px;'>Assignment: <code>+=</code>, <code>-=</code>, <code>*=</code>, <code>/=</code> — shorthand for updating variables.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a simple calculator: given <code>a = 15</code> and <code>b = 4</code>, display the result of all 6 arithmetic operations (+, -, *, /, %, **).</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Calculate each: <code>a + b</code>, <code>a - b</code>, <code>a * b</code>, <code>a / b</code>, <code>a % b</code>, <code>a ** b</code> and display them.</p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Calculator</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    const a = 15;\n    const b = 4;\n    \n    // Calculate and display all operations\n    document.getElementById("output").innerHTML = `\n      ${a} + ${b} = <br>\n      ${a} - ${b} = <br>\n      ${a} * ${b} = <br>\n      ${a} / ${b} = <br>\n      ${a} % ${b} = <br>\n      ${a} ** ${b} = \n    `;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 8,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.operators,
                slug: "js-comparison-logical",
                name: "Comparison & Logical",
                xp: 25,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Comparison operators return <code>true</code> or <code>false</code>:</p><p style='margin-bottom:8px;'><code>==</code> (loose equality — allows coercion) vs <code>===</code> (strict equality — same type AND value).</p><p style='margin-bottom:8px;'><code>\"5\" == 5</code> → <code>true</code> | <code>\"5\" === 5</code> → <code>false</code>. Always use <code>===</code>!</p><p style='margin-bottom:8px;'>Logical: <code>&&</code> (AND), <code>||</code> (OR), <code>!</code> (NOT).</p><p style='margin-bottom:8px;'><code>&&</code> — both must be true. <code>||</code> — at least one must be true.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Display the results of: <code>5 == '5'</code>, <code>5 === '5'</code>, <code>10 > 5 && 3 < 1</code>, <code>10 > 5 || 3 < 1</code>, and <code>!true</code>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Just insert the expressions directly in template literal: <code>${5 == '5'}</code> etc.</p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Comparisons</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    document.getElementById("output").innerHTML = `\n      5 == "5"  → <br>\n      5 === "5" → <br>\n      10 > 5 && 3 < 1 → <br>\n      10 > 5 || 3 < 1 → <br>\n      !true → \n    `;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },

            // ═══════════════════════════════════════
            // Chapter 5: Conditionals
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.conditionals,
                slug: "js-if-else",
                name: "If-Else Statements",
                xp: 25,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Control flow decides which code runs based on conditions:</p><p style='margin-bottom:8px;'><code>if (condition) { ... } else if (other) { ... } else { ... }</code></p><p style='margin-bottom:8px;'>The condition must be in parentheses. The code block uses curly braces.</p><p style='margin-bottom:8px;'>JavaScript evaluates conditions as truthy/falsy. Empty string, 0, null, undefined are all falsy.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Given <code>temperature = 32</code>, write if-else to display:<br/>• Above 35 → 🔥 Hot!<br/>• 20-35 → 😊 Pleasant<br/>• Below 20 → ❄️ Cold!</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>if (temperature > 35) { ... } else if (temperature >= 20) { ... } else { ... }</code></p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Weather Check</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    const temperature = 32;\n    let message = "";\n    \n    // Write your if-else here\n    \n    \n    document.getElementById("output").textContent = message;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.conditionals,
                slug: "js-ternary-operator",
                name: "Ternary Operator",
                xp: 20,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>The ternary operator is a shorthand if-else in one line:</p><p style='margin-bottom:8px;'><code>const result = condition ? valueIfTrue : valueIfFalse;</code></p><p style='margin-bottom:8px;'>Example: <code>const status = age >= 18 ? 'Adult' : 'Minor';</code></p><p style='margin-bottom:8px;'>Don't nest ternaries — it becomes unreadable. Use if-else for complex logic.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use the ternary operator to check if <code>score = 75</code> is a pass (>= 60) or fail. Display <strong>✅ Pass</strong> or <strong>❌ Fail</strong>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>const result = score >= 60 ? '✅ Pass' : '❌ Fail';</code></p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Pass or Fail?</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    const score = 75;\n    \n    // Use ternary operator\n    const result = "";\n    \n    document.getElementById("output").textContent = `Score: ${score} — ${result}`;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 8,
            },

            // ═══════════════════════════════════════
            // Chapter 6: Loops
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.loops,
                slug: "js-for-loop",
                name: "For Loop",
                xp: 25,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>The <code>for</code> loop has three parts: <code>for (init; condition; update)</code></p><p style='margin-bottom:8px;'><code>for (let i = 0; i < 5; i++) { ... }</code></p><p style='margin-bottom:8px;'>1. <code>let i = 0</code> — runs once at start.<br/>2. <code>i < 5</code> — checked before each iteration.<br/>3. <code>i++</code> — runs after each iteration.</p><p style='margin-bottom:8px;'>Use <code>for...of</code> for arrays: <code>for (const item of array) { ... }</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use a for loop to generate an HTML list of numbers 1 through 10. Display it inside the output div using innerHTML.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build an HTML string: <code>let html = '&lt;ul&gt;'; for (let i = 1; i <= 10; i++) { html += '&lt;li&gt;' + i + '&lt;/li&gt;'; } html += '&lt;/ul&gt;';</code></p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Number List</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    let listHtml = "<ul>";\n    \n    // Use a for loop to add items 1-10\n    \n    \n    listHtml += "</ul>";\n    document.getElementById("output").innerHTML = listHtml;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.loops,
                slug: "js-while-loop",
                name: "While Loop",
                xp: 25,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>The <code>while</code> loop runs as long as a condition is true:</p><p style='margin-bottom:8px;'><code>while (condition) { ... }</code></p><p style='margin-bottom:8px;'>Make sure the condition eventually becomes false — otherwise you get an infinite loop!</p><p style='margin-bottom:8px;'><code>do...while</code> runs at least once: <code>do { ... } while (condition);</code></p><p style='margin-bottom:8px;'><code>break</code> exits the loop immediately. <code>continue</code> skips to the next iteration.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use a while loop to create a countdown from 5 to 1, then display <strong>🚀 Launch!</strong> at the end. Build an HTML string and display in the output div.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Start with <code>let count = 5;</code>, loop <code>while (count > 0)</code>, add each number to the HTML string, decrease count.</p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Countdown</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    let count = 5;\n    let result = "";\n    \n    // While loop countdown\n    \n    \n    result += "🚀 Launch!";\n    document.getElementById("output").innerHTML = result;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },

            // ═══════════════════════════════════════
            // Chapter 7: Functions
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.functions,
                slug: "js-function-declaration",
                name: "Function Declaration",
                xp: 25,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Functions are reusable blocks of code:</p><p style='margin-bottom:8px;'><code>function greet(name) { return `Hello, ${name}!`; }</code></p><p style='margin-bottom:8px;'>Parameters are inputs. The <code>return</code> statement sends back a result.</p><p style='margin-bottom:8px;'>Without <code>return</code>, a function returns <code>undefined</code>.</p><p style='margin-bottom:8px;'>Function declarations are hoisted — you can call them before they're defined in the code.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a function <code>calculateArea(width, height)</code> that returns the area. Call it with (5, 3) and (10, 7). Display both results.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>function calculateArea(w, h) { return w * h; }</code> then call and display.</p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Area Calculator</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    // Define the function\n    \n    \n    // Call it and display results\n    const area1 = 0; // calculateArea(5, 3)\n    const area2 = 0; // calculateArea(10, 7)\n    \n    document.getElementById("output").innerHTML = `\n      5 × 3 = ${area1}<br>\n      10 × 7 = ${area2}\n    `;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.functions,
                slug: "js-arrow-functions",
                name: "Arrow Functions",
                xp: 30,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Arrow functions are a shorter syntax (ES6+):</p><p style='margin-bottom:8px;'><code>const greet = (name) => `Hello, ${name}!`;</code></p><p style='margin-bottom:8px;'>One parameter? Skip parens: <code>const double = n => n * 2;</code></p><p style='margin-bottom:8px;'>One-line body? Implicit return (no <code>return</code> keyword needed).</p><p style='margin-bottom:8px;'>Multi-line body? Use braces and explicit return:<br/><code>const add = (a, b) => { const sum = a + b; return sum; };</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Rewrite these as arrow functions:<br/>1. <code>double(n)</code> → returns n * 2<br/>2. <code>isEven(n)</code> → returns true if n is even<br/>3. <code>greet(name)</code> → returns 'Hello, [name]!'<br/>Display results for double(7), isEven(4), greet('Dev').</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>const double = n => n * 2;</code>, <code>const isEven = n => n % 2 === 0;</code>.</p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Arrow Functions</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    // Convert to arrow functions\n    const double = null; // n => ...\n    const isEven = null; // n => ...\n    const greet = null;  // name => ...\n    \n    document.getElementById("output").innerHTML = `\n      double(7) = ${double?.(7)}<br>\n      isEven(4) = ${isEven?.(4)}<br>\n      greet("Dev") = ${greet?.("Dev")}\n    `;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 12,
            },

            // ═══════════════════════════════════════
            // Chapter 8: Arrays
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.arrays,
                slug: "js-array-basics",
                name: "Array Basics",
                xp: 25,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Arrays are ordered lists: <code>const fruits = ['apple', 'banana', 'cherry'];</code></p><p style='margin-bottom:8px;'>Access by index (0-based): <code>fruits[0]</code> → <code>'apple'</code>.</p><p style='margin-bottom:8px;'><code>.length</code> — how many items. <code>.push()</code> — add to end. <code>.pop()</code> — remove from end.</p><p style='margin-bottom:8px;'><code>.includes()</code> — check if item exists. <code>.indexOf()</code> — find position.</p><p style='margin-bottom:8px;'>Loop: <code>for (const item of array)</code> or <code>array.forEach(item => ...)</code>.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create an array of 5 programming languages. Add one more with <code>.push()</code>. Display the total count and list all items in an HTML unordered list.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create array, push one more, loop with <code>for...of</code> to build <code>&lt;li&gt;</code> items.</p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Programming Languages</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    // Create array and add one more\n    const languages = [];\n    \n    \n    // Build HTML list\n    let html = `<p>Total: ${languages.length}</p><ul>`;\n    for (const lang of languages) {\n      html += `<li>${lang}</li>`;\n    }\n    html += "</ul>";\n    \n    document.getElementById("output").innerHTML = html;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.arrays,
                slug: "js-array-destructuring",
                name: "Array Destructuring",
                xp: 25,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Destructuring extracts values from arrays into variables:</p><p style='margin-bottom:8px;'><code>const [first, second, third] = ['a', 'b', 'c'];</code></p><p style='margin-bottom:8px;'>Skip items: <code>const [first, , third] = arr;</code></p><p style='margin-bottom:8px;'>Rest pattern: <code>const [head, ...rest] = [1, 2, 3, 4];</code> → head = 1, rest = [2, 3, 4].</p><p style='margin-bottom:8px;'>Swap variables: <code>[a, b] = [b, a];</code> — no temp variable needed!</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Given <code>const scores = [95, 87, 76, 92, 88]</code>:<br/>1. Destructure the first two into <code>highest</code> and <code>second</code>.<br/>2. Use rest to capture the remaining in <code>others</code>.<br/>Display all three.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>const [highest, second, ...others] = scores;</code></p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Destructuring</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    const scores = [95, 87, 76, 92, 88];\n    \n    // Destructure here\n    \n    \n    document.getElementById("output").innerHTML = `\n      Highest: <br>\n      Second: <br>\n      Others: \n    `;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },

            // ═══════════════════════════════════════
            // Chapter 9: Objects
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.objects,
                slug: "js-object-basics",
                name: "Object Basics",
                xp: 25,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Objects store key-value pairs: <code>const user = { name: 'Alice', age: 25 };</code></p><p style='margin-bottom:8px;'>Access: <code>user.name</code> (dot notation) or <code>user['name']</code> (bracket notation).</p><p style='margin-bottom:8px;'>Add properties: <code>user.email = 'alice@mail.com';</code></p><p style='margin-bottom:8px;'>Object destructuring: <code>const { name, age } = user;</code></p><p style='margin-bottom:8px;'>Methods — functions inside objects: <code>const obj = { greet() { return 'Hi!'; } };</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a <code>student</code> object with name, age, course, and a method <code>introduce()</code> that returns a formatted string. Display the introduction.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>const student = { name: '...', introduce() { return `I'm ${this.name}...`; } };</code></p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Student Profile</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    // Create the student object\n    const student = {\n      // Add properties and method\n    };\n    \n    document.getElementById("output").textContent = student.introduce?.() || "Define the object!";\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.objects,
                slug: "js-object-destructuring",
                name: "Object Destructuring",
                xp: 25,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Object destructuring extracts properties by name:</p><p style='margin-bottom:8px;'><code>const { name, age } = person;</code></p><p style='margin-bottom:8px;'>Rename: <code>const { name: fullName } = person;</code></p><p style='margin-bottom:8px;'>Defaults: <code>const { name, role = 'User' } = person;</code></p><p style='margin-bottom:8px;'>Nested: <code>const { address: { city } } = person;</code></p><p style='margin-bottom:8px;'>Spread operator: <code>const newObj = { ...oldObj, newProp: 'value' };</code> — copies and extends.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Given a <code>product</code> object, destructure its properties. Use renaming for <code>name</code> → <code>productName</code> and a default for <code>discount</code> (default 0). Display all values.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>const { name: productName, price, category, discount = 0 } = product;</code></p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Product Details</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    const product = {\n      name: "Mechanical Keyboard",\n      price: 79.99,\n      category: "Electronics"\n    };\n    \n    // Destructure with rename and default\n    \n    \n    document.getElementById("output").innerHTML = `\n      Product: <br>\n      Price: $<br>\n      Category: <br>\n      Discount: %\n    `;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },

            // ═══════════════════════════════════════
            // Chapter 10: DOM Manipulation
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.dom,
                slug: "js-selecting-elements",
                name: "Selecting & Changing Elements",
                xp: 30,
                difficulty: "medium",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>The DOM (Document Object Model) is JavaScript's view of the HTML page.</p><p style='margin-bottom:8px;'>Select elements:<br/><code>document.getElementById('id')</code><br/><code>document.querySelector('.class')</code> — first match<br/><code>document.querySelectorAll('p')</code> — all matches</p><p style='margin-bottom:8px;'>Change content: <code>.textContent</code>, <code>.innerHTML</code></p><p style='margin-bottom:8px;'>Change styles: <code>element.style.color = 'red';</code></p><p style='margin-bottom:8px;'>Change classes: <code>.classList.add('active')</code>, <code>.classList.remove()</code>, <code>.classList.toggle()</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use JavaScript to: change the heading color to #e94560, change the paragraph text, and add a 'highlight' class to the special div. Define the highlight class in the style.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>document.querySelector('h2').style.color = '#e94560';</code> and <code>.classList.add('highlight')</code>.</p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2 id="title">Original Title</h2>\n  <p id="desc">Original description.</p>\n  <div id="special" class="output">Make me highlighted!</div>\n\n  <script>\n    // 1. Change the heading color\n    \n    // 2. Change the paragraph text\n    \n    // 3. Add highlight class to the special div\n    \n  </script>', '\n    .highlight { background: #e94560 !important; color: white; padding: 15px; border-radius: 8px; }'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 12,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.dom,
                slug: "js-event-handling",
                name: "Event Handling",
                xp: 30,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Events let JavaScript respond to user actions:</p><p style='margin-bottom:8px;'><code>element.addEventListener('click', function() { ... });</code></p><p style='margin-bottom:8px;'>Common events: <code>click</code>, <code>mouseover</code>, <code>mouseout</code>, <code>keydown</code>, <code>input</code>, <code>submit</code>.</p><p style='margin-bottom:8px;'>The event object: <code>element.addEventListener('click', (e) => { ... });</code> — <code>e.target</code> is the clicked element.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Add a click event to the button that increments a counter and displays it. Add a mouseover event that changes the button color.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>btn.addEventListener('click', () => { count++; display.textContent = count; });</code></p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Click Counter</h2>\n  <div id="count" class="output" style="font-size:48px;text-align:center;">0</div>\n  <button id="btn" style="display:block;margin:20px auto;padding:12px 30px;font-size:18px;background:#0f3460;color:white;border:none;border-radius:8px;cursor:pointer;">Click Me!</button>\n\n  <script>\n    let count = 0;\n    const btn = document.getElementById("btn");\n    const display = document.getElementById("count");\n    \n    // Add click event\n    \n    \n    // Add mouseover event (change button background)\n    \n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 12,
            },

            // ═══════════════════════════════════════
            // Chapter 11: Array Higher-Order Methods
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.arrayMethods,
                slug: "js-map-filter",
                name: "Map & Filter",
                xp: 30,
                difficulty: "medium",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'><code>.map()</code> transforms each item and returns a new array:</p><p style='margin-bottom:8px;'><code>[1, 2, 3].map(n => n * 2)</code> → <code>[2, 4, 6]</code></p><p style='margin-bottom:8px;'><code>.filter()</code> keeps items that pass a test:</p><p style='margin-bottom:8px;'><code>[1, 2, 3, 4].filter(n => n > 2)</code> → <code>[3, 4]</code></p><p style='margin-bottom:8px;'>Both return NEW arrays — they don't modify the original.</p><p style='margin-bottom:8px;'>Chain them: <code>arr.filter(n => n > 2).map(n => n * 10)</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Given prices <code>[29, 15, 45, 8, 32, 12, 50]</code>: use <code>.filter()</code> to keep only prices above 20, then <code>.map()</code> to add a 10% tax. Display both the filtered and final prices.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Chain: <code>prices.filter(p => p > 20).map(p => (p * 1.1).toFixed(2))</code></p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Price Filter</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    const prices = [29, 15, 45, 8, 32, 12, 50];\n    \n    // Filter prices > 20\n    const filtered = prices;\n    \n    // Map to add 10% tax\n    const withTax = filtered;\n    \n    document.getElementById("output").innerHTML = `\n      Original: [${prices.join(", ")}]<br><br>\n      Filtered (> $20): [${filtered.join(", ")}]<br><br>\n      With 10% tax: [${withTax.join(", ")}]\n    `;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 12,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.arrayMethods,
                slug: "js-reduce",
                name: "Reduce",
                xp: 35,
                difficulty: "hard",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'><code>.reduce()</code> boils an array down to a single value:</p><p style='margin-bottom:8px;'><code>[1, 2, 3].reduce((acc, curr) => acc + curr, 0)</code> → <code>6</code></p><p style='margin-bottom:8px;'><code>acc</code> = accumulator (running total), <code>curr</code> = current item, <code>0</code> = initial value.</p><p style='margin-bottom:8px;'>Use cases: sum, average, counting occurrences, flattening arrays, building objects.</p><p style='margin-bottom:8px;'>Tip: Always provide an initial value (the second argument) to avoid bugs.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Given <code>scores = [85, 92, 78, 95, 88]</code>: use <code>.reduce()</code> to find the total and then calculate the average. Display both.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Sum: <code>scores.reduce((sum, s) => sum + s, 0)</code>. Average: <code>total / scores.length</code>.</p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Score Summary</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    const scores = [85, 92, 78, 95, 88];\n    \n    // Use reduce to get total\n    const total = 0;\n    \n    // Calculate average\n    const average = 0;\n    \n    document.getElementById("output").innerHTML = `\n      Scores: [${scores.join(", ")}]<br><br>\n      Total: ${total}<br>\n      Average: ${average}\n    `;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 15,
            },

            // ═══════════════════════════════════════
            // Chapter 12: Error Handling & Debugging
            // ═══════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CH.errorHandling,
                slug: "js-try-catch",
                name: "Try-Catch",
                xp: 25,
                difficulty: "medium",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'><code>try...catch</code> handles errors gracefully instead of crashing:</p><p style='margin-bottom:8px;'><code>try { riskyCode(); } catch (error) { handleError(error); }</code></p><p style='margin-bottom:8px;'><code>error.message</code> — the error description. <code>error.name</code> — the error type.</p><p style='margin-bottom:8px;'><code>finally { ... }</code> — runs whether or not an error occurred. Good for cleanup.</p><p style='margin-bottom:8px;'>Common errors: <code>ReferenceError</code>, <code>TypeError</code>, <code>SyntaxError</code>, <code>RangeError</code>.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Write a function <code>safeParse(jsonStr)</code> that uses try-catch to parse JSON. If valid, return the object. If invalid, return an error message. Test with valid and invalid JSON strings.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>try { return JSON.parse(str); } catch (e) { return 'Error: ' + e.message; }</code></p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Safe JSON Parser</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    // Define safeParse function\n    function safeParse(jsonStr) {\n      // Use try-catch\n    }\n    \n    const valid = \'{"name": "Alice", "age": 25}\';\n    const invalid = \'{name: broken}\';\n    \n    const r1 = safeParse(valid);\n    const r2 = safeParse(invalid);\n    \n    document.getElementById("output").innerHTML = `\n      Valid JSON result: ${JSON.stringify(r1)}<br><br>\n      Invalid JSON result: ${r2}\n    `;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.errorHandling,
                slug: "js-custom-errors",
                name: "Throwing Custom Errors",
                xp: 30,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>You can throw your own errors to enforce rules:</p><p style='margin-bottom:8px;'><code>throw new Error('Something went wrong!');</code></p><p style='margin-bottom:8px;'>Use this for input validation: if a function receives bad input, throw an error instead of silently failing.</p><p style='margin-bottom:8px;'>Combine with try-catch: the caller can catch your thrown errors.</p><p style='margin-bottom:8px;'>Pattern:<br/><code>function divide(a, b) {<br/>  if (b === 0) throw new Error('Cannot divide by zero!');<br/>  return a / b;<br/>}</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a <code>validateAge(age)</code> function that throws errors for invalid input (not a number, negative, or over 150). Use try-catch to test with valid and invalid ages.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Check: <code>if (typeof age !== 'number') throw new Error('...')</code>. Call inside try-catch.</p></body>",
                starterCode: {
                    "/index.html": {
                        code: html('  <h2>Age Validator</h2>\n  <div id="output" class="output">...</div>\n\n  <script>\n    function validateAge(age) {\n      // Throw errors for invalid input\n      \n      return `Valid age: ${age}`;\n    }\n    \n    let results = "";\n    \n    // Test with different values\n    const testValues = [25, -5, "hello", 200, 0];\n    \n    for (const val of testValues) {\n      try {\n        results += `✅ ${validateAge(val)}<br>`;\n      } catch (e) {\n        results += `❌ ${val}: ${e.message}<br>`;\n      }\n    }\n    \n    document.getElementById("output").innerHTML = results;\n  </script>'),
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 12,
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
            message: "JavaScript exercises seed finished",
            successCount,
            totalAttempted: DATA.length,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
