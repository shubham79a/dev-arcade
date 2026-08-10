import { db } from "@/config/db";
import { ExerciseTable, CourseChaptersTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

const COURSE_ID = 5; // The Python course ID you got from Step 1

export async function GET(req: NextRequest) {
    try {
        // 1. Fetch the chapters for this course dynamically
        const chapters = await db
            .select()
            .from(CourseChaptersTable)
            .where(eq(CourseChaptersTable.courseId, COURSE_ID))
            .orderBy(CourseChaptersTable.orderIndex);

        if (chapters.length < 5) {
            return NextResponse.json(
                { error: `Found only ${chapters.length} chapters for course ${COURSE_ID}. Did Step 1 finish successfully?` },
                { status: 400 }
            );
        }

        // Map the chapter IDs dynamically based on their orderIndex
        const CHAPTER_IDS = {
            helloPython: chapters.find(c => c.orderIndex === 1)?.id!,
            variablesTypes: chapters.find(c => c.orderIndex === 2)?.id!,
            controlFlow: chapters.find(c => c.orderIndex === 3)?.id!,
            functions: chapters.find(c => c.orderIndex === 4)?.id!,
            listsStrings: chapters.find(c => c.orderIndex === 5)?.id!,
        };

        const DATA = [
            // ═══════════════════════════════════════════
            // Chapter 1: Hello Python
            // ═══════════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CHAPTER_IDS.helloPython,
                slug: "your-first-print",
                name: "Your First Print",
                xp: 15,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Welcome to Python! The <code>print()</code> function is your first tool — it displays text on the screen.</p><p style='margin-bottom:8px;'>In Python, you don't need semicolons or brackets around the program. Just write your code and run it.</p><p style='margin-bottom:8px;'>Strings are text wrapped in quotes — either single quotes <code>'hello'</code> or double quotes <code>\"hello\"</code>. Both work the same way.</p><p style='margin-bottom:8px;'>The <code>print()</code> function takes whatever you give it inside the parentheses and outputs it to the console.</p><p style='margin-bottom:8px;'>You can print multiple things by separating them with commas: <code>print(\"Hello\", \"World\")</code> outputs <code>Hello World</code>.</p><p style='margin-bottom:8px;'>Every Python programmer's journey starts here — with a simple print statement. Master this and you're ready for variables.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use the <code>print()</code> function to display exactly: <strong>Hello, Python!</strong></p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>print(\"Hello, Python!\")</code> — make sure the text matches exactly, including the comma and exclamation mark.</p></body>",
                starterCode: {
                    "/main.py": { code: "# Your first Python program!\n# Use print() to display a message\n\n", active: true }
                },
                validationRegex: null,
                expectedOutput: "Hello, Python!\n",
                hintXpPenalty: 5,
            },
            {
                courseId: COURSE_ID,
                chapterId: CHAPTER_IDS.helloPython,
                slug: "comments-and-multiple-prints",
                name: "Comments & Multiple Prints",
                xp: 20,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Comments are notes for humans — Python ignores them completely. Use <code>#</code> for single-line comments.</p><p style='margin-bottom:8px;'>Comments help explain your thinking, mark TODOs, or temporarily disable code. Good developers comment their code.</p><p style='margin-bottom:8px;'>Each <code>print()</code> call outputs on a new line by default. Multiple prints create multiple lines of output.</p><p style='margin-bottom:8px;'>You can also print numbers directly: <code>print(42)</code> outputs <code>42</code>. No quotes needed for numbers.</p><p style='margin-bottom:8px;'>Mixing strings and numbers in one print? Use commas: <code>print(\"Score:\", 100)</code> outputs <code>Score: 100</code>.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Write a program that prints three lines:<br/><strong>Line 1:</strong> <code>I am learning Python</code><br/><strong>Line 2:</strong> <code>Python is fun</code><br/><strong>Line 3:</strong> <code>Let's code!</code><br/>Add a comment at the top of your code saying <code># My first multi-line program</code></p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use three separate <code>print()</code> statements, one for each line. Start your file with <code># My first multi-line program</code>.</p></body>",
                starterCode: {
                    "/main.py": { code: "# Write your code below\n\n", active: true }
                },
                validationRegex: null,
                expectedOutput: "I am learning Python\nPython is fun\nLet's code!\n",
                hintXpPenalty: 8,
            },

            // ═══════════════════════════════════════════
            // Chapter 2: Variables & Data Types
            // ═══════════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CHAPTER_IDS.variablesTypes,
                slug: "variables-basics",
                name: "Variable Basics",
                xp: 20,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Variables are containers that store data. In Python, you create a variable simply by assigning a value: <code>name = \"Alice\"</code>.</p><p style='margin-bottom:8px;'>No need to declare the type — Python figures it out automatically. This is called <strong>dynamic typing</strong>.</p><p style='margin-bottom:8px;'>Variable names must start with a letter or underscore, and can contain letters, numbers, and underscores. They are case-sensitive.</p><p style='margin-bottom:8px;'>Good variable names describe what they hold: <code>user_age</code> is better than <code>x</code>.</p><p style='margin-bottom:8px;'>You can reassign variables anytime: <code>score = 10</code> then <code>score = 20</code> — the old value is replaced.</p><p style='margin-bottom:8px;'>Print variables by passing them to <code>print()</code>: <code>print(name)</code> shows the value, not the word \"name\".</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create two variables:<br/><code>name</code> with value <code>\"Coder\"</code><br/><code>age</code> with value <code>20</code><br/>Then print: <strong>Name: Coder</strong> and <strong>Age: 20</strong> on two separate lines.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>print(\"Name:\", name)</code> and <code>print(\"Age:\", age)</code>. Python automatically adds a space when you use commas in print.</p></body>",
                starterCode: {
                    "/main.py": { code: "# Create your variables here\n\n\n# Print the results\n", active: true }
                },
                validationRegex: null,
                expectedOutput: "Name: Coder\nAge: 20\n",
                hintXpPenalty: 8,
            },
            {
                courseId: COURSE_ID,
                chapterId: CHAPTER_IDS.variablesTypes,
                slug: "data-types-and-type-checking",
                name: "Data Types & Type Checking",
                xp: 25,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Python has several built-in data types. The most common ones are:</p><p style='margin-bottom:8px;'><code>int</code> — whole numbers like <code>42</code>, <code>-7</code>, <code>0</code></p><p style='margin-bottom:8px;'><code>float</code> — decimal numbers like <code>3.14</code>, <code>-0.5</code></p><p style='margin-bottom:8px;'><code>str</code> — text strings like <code>\"hello\"</code>, <code>'world'</code></p><p style='margin-bottom:8px;'><code>bool</code> — True or False (note the capital letters)</p><p style='margin-bottom:8px;'>Use the <code>type()</code> function to check what type a value is: <code>type(42)</code> returns <code>&lt;class 'int'&gt;</code>.</p><p style='margin-bottom:8px;'>Knowing types matters because different types support different operations. You can't add a string to a number directly.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create four variables:<br/><code>x = 10</code> (int)<br/><code>y = 3.14</code> (float)<br/><code>z = \"Python\"</code> (str)<br/><code>w = True</code> (bool)<br/>Print the type of each variable, one per line, using <code>print(type(variable))</code>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>After creating the variables, use <code>print(type(x))</code>, <code>print(type(y))</code>, <code>print(type(z))</code>, <code>print(type(w))</code>.</p></body>",
                starterCode: {
                    "/main.py": { code: "# Create four variables of different types\n\n\n\n\n# Print the type of each\n", active: true }
                },
                validationRegex: null,
                expectedOutput: "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>\n",
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CHAPTER_IDS.variablesTypes,
                slug: "string-concatenation-and-fstrings",
                name: "String Concatenation & f-Strings",
                xp: 30,
                difficulty: "medium",
                orderIndex: 3,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Combining strings is called <strong>concatenation</strong>. The <code>+</code> operator joins strings: <code>\"Hello\" + \" \" + \"World\"</code> gives <code>\"Hello World\"</code>.</p><p style='margin-bottom:8px;'>But there's a better way — <strong>f-strings</strong> (formatted string literals). Prefix the string with <code>f</code> and put variables inside curly braces:</p><p style='margin-bottom:8px;'><code>name = \"Alice\"</code><br/><code>print(f\"Hello, {name}!\")</code> → <code>Hello, Alice!</code></p><p style='margin-bottom:8px;'>f-strings can do math too: <code>f\"2 + 3 = {2 + 3}\"</code> → <code>2 + 3 = 5</code>.</p><p style='margin-bottom:8px;'>f-strings are the modern Python way (3.6+). They're cleaner than <code>+</code> concatenation and faster than <code>.format()</code>.</p><p style='margin-bottom:8px;'>You can't concatenate a string and number with <code>+</code> directly — but f-strings handle it automatically.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create variables <code>language = \"Python\"</code> and <code>version = 3</code>.<br/>Using an <strong>f-string</strong>, print: <strong>I am learning Python 3</strong></p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>print(f\"I am learning {language} {version}\")</code>. The f before the quote enables variable insertion with curly braces.</p></body>",
                starterCode: {
                    "/main.py": { code: "# Create your variables\n\n\n# Use an f-string to print the message\n", active: true }
                },
                validationRegex: null,
                expectedOutput: "I am learning Python 3\n",
                hintXpPenalty: 12,
            },

            // ═══════════════════════════════════════════
            // Chapter 3: Control Flow
            // ═══════════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CHAPTER_IDS.controlFlow,
                slug: "if-else-decisions",
                name: "If-Else Decisions",
                xp: 25,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Programs need to make decisions. Python uses <code>if</code>, <code>elif</code>, and <code>else</code> to control which code runs.</p><p style='margin-bottom:8px;'>The basic structure:</p><pre style='background:#1a1a1a;padding:10px;border-radius:6px;'>if condition:\n    # runs if True\nelif another_condition:\n    # runs if first was False, this is True\nelse:\n    # runs if all above were False</pre><p style='margin-bottom:8px;'><strong>Indentation matters!</strong> Python uses 4 spaces (or 1 tab) to define code blocks — no curly braces like JavaScript or C++.</p><p style='margin-bottom:8px;'>Comparison operators: <code>==</code> (equal), <code>!=</code> (not equal), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>.</p><p style='margin-bottom:8px;'>Logical operators: <code>and</code>, <code>or</code>, <code>not</code> — combine conditions naturally.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a variable <code>score = 85</code>.<br/>Write an if-elif-else that prints:<br/>• <code>Excellent</code> if score >= 90<br/>• <code>Good</code> if score >= 70<br/>• <code>Needs Improvement</code> otherwise</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>With <code>score = 85</code>, the output should be <code>Good</code>. Use <code>if score >= 90:</code> then <code>elif score >= 70:</code> then <code>else:</code>.</p></body>",
                starterCode: {
                    "/main.py": { code: "score = 85\n\n# Write your if-elif-else below\n", active: true }
                },
                validationRegex: null,
                expectedOutput: "Good\n",
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CHAPTER_IDS.controlFlow,
                slug: "for-loop-basics",
                name: "For Loop Basics",
                xp: 25,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Loops let you repeat actions. The <code>for</code> loop iterates over a sequence (like a list or range).</p><p style='margin-bottom:8px;'><code>range(n)</code> generates numbers from 0 to n-1. <code>range(1, 6)</code> generates 1, 2, 3, 4, 5.</p><p style='margin-bottom:8px;'>Basic for loop:</p><pre style='background:#1a1a1a;padding:10px;border-radius:6px;'>for i in range(5):\n    print(i)  # prints 0, 1, 2, 3, 4</pre><p style='margin-bottom:8px;'>You can loop over strings too: <code>for char in \"hello\":</code> gives you each character one at a time.</p><p style='margin-bottom:8px;'>The loop variable (<code>i</code>) takes each value in the sequence, one per iteration.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use a <code>for</code> loop with <code>range()</code> to print the numbers <strong>1 through 5</strong>, each on a separate line.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>for i in range(1, 6):</code> then <code>print(i)</code> inside the loop. Remember, <code>range(1, 6)</code> gives 1, 2, 3, 4, 5.</p></body>",
                starterCode: {
                    "/main.py": { code: "# Use a for loop to print numbers 1 to 5\n\n", active: true }
                },
                validationRegex: null,
                expectedOutput: "1\n2\n3\n4\n5\n",
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CHAPTER_IDS.controlFlow,
                slug: "while-loop-countdown",
                name: "While Loop Countdown",
                xp: 30,
                difficulty: "medium",
                orderIndex: 3,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>The <code>while</code> loop repeats as long as a condition is True. Be careful — if the condition never becomes False, you get an infinite loop!</p><p style='margin-bottom:8px;'>Basic structure:</p><pre style='background:#1a1a1a;padding:10px;border-radius:6px;'>count = 5\nwhile count > 0:\n    print(count)\n    count -= 1  # decrease by 1 each time</pre><p style='margin-bottom:8px;'><code>-=</code> is shorthand for <code>count = count - 1</code>. Similarly, <code>+=</code> adds to a variable.</p><p style='margin-bottom:8px;'>While loops are great when you don't know how many iterations you need in advance.</p><p style='margin-bottom:8px;'>Always make sure the condition will eventually become False to avoid freezing your program.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a countdown from 5 to 1 using a <code>while</code> loop. Print each number on a new line. After the loop, print <strong>Go!</strong></p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Start with <code>count = 5</code>, loop <code>while count > 0:</code>, print count inside the loop, decrease with <code>count -= 1</code>, then print \"Go!\" after the loop.</p></body>",
                starterCode: {
                    "/main.py": { code: "# Create a countdown from 5 to 1, then print \"Go!\"\n\n", active: true }
                },
                validationRegex: null,
                expectedOutput: "5\n4\n3\n2\n1\nGo!\n",
                hintXpPenalty: 12,
            },

            // ═══════════════════════════════════════════
            // Chapter 4: Functions
            // ═══════════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CHAPTER_IDS.functions,
                slug: "define-and-call-a-function",
                name: "Define & Call a Function",
                xp: 25,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Functions are reusable blocks of code. Define them once, call them many times.</p><p style='margin-bottom:8px;'>Syntax:</p><pre style='background:#1a1a1a;padding:10px;border-radius:6px;'>def greet():\n    print(\"Hello!\")\n\ngreet()  # call the function</pre><p style='margin-bottom:8px;'>The <code>def</code> keyword starts a function definition. The name follows Python naming rules (lowercase, underscores).</p><p style='margin-bottom:8px;'>Parentheses <code>()</code> hold parameters (inputs). The colon <code>:</code> starts the function body.</p><p style='margin-bottom:8px;'>Everything indented under <code>def</code> is part of the function. It only runs when you <strong>call</strong> the function.</p><p style='margin-bottom:8px;'>Functions make code organized, readable, and DRY (Don't Repeat Yourself).</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Define a function called <code>greet</code> that takes a parameter <code>name</code> and prints <code>Hello, [name]!</code>.<br/>Call it twice: <code>greet(\"Alice\")</code> and <code>greet(\"Bob\")</code>.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>def greet(name):</code> then <code>print(f\"Hello, {name}!\")</code> inside. Call with <code>greet(\"Alice\")</code> and <code>greet(\"Bob\")</code>.</p></body>",
                starterCode: {
                    "/main.py": { code: "# Define your function here\n\n\n# Call the function twice\n", active: true }
                },
                validationRegex: null,
                expectedOutput: "Hello, Alice!\nHello, Bob!\n",
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CHAPTER_IDS.functions,
                slug: "return-values",
                name: "Return Values",
                xp: 30,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Functions can send back results using <code>return</code>. This is different from printing — return gives the value back to the caller.</p><pre style='background:#1a1a1a;padding:10px;border-radius:6px;'>def add(a, b):\n    return a + b\n\nresult = add(3, 4)\nprint(result)  # 7</pre><p style='margin-bottom:8px;'>Without <code>return</code>, a function returns <code>None</code> by default.</p><p style='margin-bottom:8px;'><code>return</code> immediately exits the function — any code after it won't run.</p><p style='margin-bottom:8px;'>You can use the returned value in expressions: <code>print(add(3, 4) * 2)</code> → <code>14</code>.</p><p style='margin-bottom:8px;'>Return vs Print: <code>print()</code> shows output on screen, <code>return</code> gives the value back to the code for further use.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Define a function <code>multiply(a, b)</code> that <strong>returns</strong> the product of <code>a</code> and <code>b</code>.<br/>Print the result of <code>multiply(4, 5)</code> and <code>multiply(3, 7)</code> on separate lines.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>def multiply(a, b): return a * b</code>. Then <code>print(multiply(4, 5))</code> and <code>print(multiply(3, 7))</code>.</p></body>",
                starterCode: {
                    "/main.py": { code: "# Define the multiply function\n\n\n# Print the results\n", active: true }
                },
                validationRegex: null,
                expectedOutput: "20\n21\n",
                hintXpPenalty: 12,
            },

            // ═══════════════════════════════════════════
            // Chapter 5: Lists & Strings
            // ═══════════════════════════════════════════
            {
                courseId: COURSE_ID,
                chapterId: CHAPTER_IDS.listsStrings,
                slug: "list-basics",
                name: "List Basics",
                xp: 25,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Lists are ordered collections that can hold multiple values: <code>fruits = [\"apple\", \"banana\", \"cherry\"]</code>.</p><p style='margin-bottom:8px;'>Access items by index (starting from 0): <code>fruits[0]</code> → <code>\"apple\"</code>, <code>fruits[1]</code> → <code>\"banana\"</code>.</p><p style='margin-bottom:8px;'>Use <code>len()</code> to get the list length: <code>len(fruits)</code> → <code>3</code>.</p><p style='margin-bottom:8px;'>Add items with <code>.append()</code>: <code>fruits.append(\"mango\")</code> adds to the end.</p><p style='margin-bottom:8px;'>Loop through a list with <code>for item in list:</code>.</p><p style='margin-bottom:8px;'>Lists are one of Python's most powerful features — you'll use them everywhere.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a list <code>colors = [\"red\", \"green\", \"blue\"]</code>.<br/>Print each color on a separate line using a <code>for</code> loop.<br/>Then print the total count: <strong>Total: 3</strong></p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>for color in colors:</code> then <code>print(color)</code>. After the loop, use <code>print(f\"Total: {len(colors)}\")</code>.</p></body>",
                starterCode: {
                    "/main.py": { code: "# Create your list\n\n\n# Loop and print each item\n\n\n# Print the total count\n", active: true }
                },
                validationRegex: null,
                expectedOutput: "red\ngreen\nblue\nTotal: 3\n",
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CHAPTER_IDS.listsStrings,
                slug: "sum-of-a-list",
                name: "Sum of a List",
                xp: 35,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Python has a built-in <code>sum()</code> function for numeric lists: <code>sum([1, 2, 3])</code> → <code>6</code>.</p><p style='margin-bottom:8px;'>But knowing how to sum manually teaches you loop accumulation — a fundamental pattern:</p><pre style='background:#1a1a1a;padding:10px;border-radius:6px;'>total = 0\nfor num in numbers:\n    total += num</pre><p style='margin-bottom:8px;'>The accumulator pattern: start with a variable (total = 0), update it in each iteration, use it after the loop.</p><p style='margin-bottom:8px;'>This pattern works for counting, averaging, finding max/min — it's everywhere in programming.</p><p style='margin-bottom:8px;'>You can also find the average: <code>average = total / len(numbers)</code>.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Given <code>numbers = [10, 20, 30, 40, 50]</code>, write a <code>for</code> loop to calculate the sum <strong>manually</strong> (don't use the built-in <code>sum()</code>). Print:<br/><strong>Sum: 150</strong><br/><strong>Average: 30.0</strong></p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Start with <code>total = 0</code>, loop with <code>for num in numbers: total += num</code>. Calculate average as <code>total / len(numbers)</code>. Print with f-strings.</p></body>",
                starterCode: {
                    "/main.py": { code: "numbers = [10, 20, 30, 40, 50]\n\n# Calculate the sum manually using a loop\n\n\n# Calculate the average\n\n\n# Print the results\n", active: true }
                },
                validationRegex: null,
                expectedOutput: "Sum: 150\nAverage: 30.0\n",
                hintXpPenalty: 15,
            },
        ];

        let successCount = 0;
        let errors = [];

        // Insert sequentially to avoid overlapping errors
        for (const item of DATA) {
            try {
                await db.insert(ExerciseTable).values(item);
                successCount++;
            } catch (err: any) {
                // Ignore unique constraint error if it's already there
                if (err.code === '23505') {
                    console.log(`Skipped duplicate slug: ${item.slug}`);
                } else {
                    errors.push(`Failed on ${item.slug}: ${err.message}`);
                }
            }
        }

        return NextResponse.json({
            message: "Python exercises seed finished",
            successCount,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
