import { db } from "@/config/db";
import { ExerciseTable, CourseChaptersTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getCourseIdParam, requireAdmin } from "@/lib/admin";

// Override with ?courseId=<id returned by /api/admin/seed-react-course>
const DEFAULT_COURSE_ID = 1;

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
                { error: `Found only ${chapters.length} chapters. Run seed-react-course first.` },
                { status: 400 }
            );
        }

        const CH = {
            helloReact: chapters.find(c => c.orderIndex === 1)?.id!,
            components: chapters.find(c => c.orderIndex === 2)?.id!,
            styling: chapters.find(c => c.orderIndex === 3)?.id!,
            useState: chapters.find(c => c.orderIndex === 4)?.id!,
            events: chapters.find(c => c.orderIndex === 5)?.id!,
            conditional: chapters.find(c => c.orderIndex === 6)?.id!,
            lists: chapters.find(c => c.orderIndex === 7)?.id!,
            forms: chapters.find(c => c.orderIndex === 8)?.id!,
            useEffect: chapters.find(c => c.orderIndex === 9)?.id!,
            composition: chapters.find(c => c.orderIndex === 10)?.id!,
            context: chapters.find(c => c.orderIndex === 11)?.id!,
            capstone: chapters.find(c => c.orderIndex === 12)?.id!,
        };

        const DATA = [
            // Chapter 1: Hello React & JSX
            {
                courseId: COURSE_ID,
                chapterId: CH.helloReact,
                slug: "react-hello-world",
                name: "Hello World Component",
                xp: 15,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>React is a JavaScript library for building user interfaces. Everything in React is a <strong>component</strong>.</p><p style='margin-bottom:8px;'>A component is a function that returns <strong>JSX</strong> — a syntax that looks like HTML but is actually JavaScript.</p><p style='margin-bottom:8px;'><code>function App() { return &lt;h1&gt;Hello!&lt;/h1&gt;; }</code></p><p style='margin-bottom:8px;'>JSX must return a single parent element. Use <code>&lt;&gt;...&lt;/&gt;</code> (Fragment) to wrap multiple elements without adding extra DOM nodes.</p><p style='margin-bottom:8px;'>Embed JavaScript expressions inside JSX using curly braces: <code>{2 + 2}</code>, <code>{name}</code>, <code>{items.length}</code>.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Edit the <code>App</code> component to display an <code>&lt;h1&gt;</code> with text <strong>Hello, React!</strong> and a <code>&lt;p&gt;</code> below it with text <strong>I'm learning React on DevArcade.</strong></p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Return a fragment: <code>&lt;&gt;&lt;h1&gt;Hello, React!&lt;/h1&gt;&lt;p&gt;I'm learning React on DevArcade.&lt;/p&gt;&lt;/&gt;</code></p></body>",
                starterCode: {
                    "/App.js": {
                        code: "export default function App() {\n  // Return an h1 and a p element\n  return (\n    <div>\n      {/* Your JSX here */}\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)Hello,?\\s*React",
                expectedOutput: null,
                hintXpPenalty: 5,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.helloReact,
                slug: "react-jsx-expressions",
                name: "JSX Expressions",
                xp: 20,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Inside JSX, curly braces <code>{}</code> let you embed any JavaScript expression:</p><p style='margin-bottom:8px;'><code>{userName}</code> — variable values</p><p style='margin-bottom:8px;'><code>{2 + 2}</code> — arithmetic</p><p style='margin-bottom:8px;'><code>{new Date().getFullYear()}</code> — function calls</p><p style='margin-bottom:8px;'><code>{isLoggedIn ? 'Welcome!' : 'Please log in'}</code> — ternary expressions</p><p style='margin-bottom:8px;'>Note: You cannot use <code>if/else</code> statements directly in JSX — use ternaries or move the logic above the return.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create variables <code>name</code>, <code>language</code>, and <code>year</code> (current year). Display them using JSX expressions: <strong>Hi, I'm [name]!</strong>, <strong>I'm learning [language] in [year].</strong></p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Declare variables before the return, then use <code>{name}</code>, <code>{language}</code>, <code>{new Date().getFullYear()}</code> inside JSX.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "export default function App() {\n  // Declare your variables here\n  const name = \"\";\n  const language = \"\";\n\n  return (\n    <div style={{ fontFamily: 'Arial', padding: '20px' }}>\n      <h1>Hi, I'm {/* name */}!</h1>\n      <p>I'm learning {/* language */} in {/* year */}.</p>\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: null,
                expectedOutput: null,
                hintXpPenalty: 8,
            },

            // Chapter 2: Components & Props
            {
                courseId: COURSE_ID,
                chapterId: CH.components,
                slug: "react-first-component",
                name: "Your First Component",
                xp: 20,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Components are independent, reusable building blocks. Think of them as custom HTML elements.</p><p style='margin-bottom:8px;'>Function components start with a <strong>capital letter</strong>:</p><p style='margin-bottom:8px;'><code>function Greeting() { return &lt;h2&gt;Hello!&lt;/h2&gt;; }</code></p><p style='margin-bottom:8px;'>Use them like HTML: <code>&lt;Greeting /&gt;</code></p><p style='margin-bottom:8px;'>Props are like function arguments — they pass data from parent to child: <code>function Greeting({ name }) { return &lt;h2&gt;Hello, {name}!&lt;/h2&gt;; }</code></p><p style='margin-bottom:8px;'>Usage: <code>&lt;Greeting name=\"Alice\" /&gt;</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a <code>UserCard</code> component that accepts <code>name</code> and <code>role</code> props and displays them. Render it from App with at least 2 different users.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Define <code>function UserCard({ name, role })</code> in the same file, then use <code>&lt;UserCard name='Alice' role='Developer' /&gt;</code> inside App.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "// Create your UserCard component here\nfunction UserCard({ name, role }) {\n  return (\n    <div style={{\n      border: '2px solid #444',\n      borderRadius: '12px',\n      padding: '16px',\n      margin: '8px 0',\n      background: '#1a1a2e'\n    }}>\n      {/* Display name and role */}\n    </div>\n  );\n}\n\nexport default function App() {\n  return (\n    <div style={{ fontFamily: 'Arial', padding: '20px' }}>\n      <h1>Team Members</h1>\n      {/* Render UserCard components here */}\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)UserCard",
                expectedOutput: null,
                hintXpPenalty: 8,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.components,
                slug: "react-props-practice",
                name: "Props in Action",
                xp: 25,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Props can be any JavaScript value — strings, numbers, booleans, arrays, objects, even functions.</p><p style='margin-bottom:8px;'>Default props: <code>function Badge({ color = 'blue' })</code></p><p style='margin-bottom:8px;'>Spread props: <code>&lt;Component {...obj} /&gt;</code> passes all object keys as individual props.</p><p style='margin-bottom:8px;'>Props are <strong>read-only</strong>. A component must never modify its own props.</p><p style='margin-bottom:8px;'>Children prop: <code>&lt;Card&gt;Hello&lt;/Card&gt;</code> → <code>children</code> = \"Hello\".</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a <code>Badge</code> component that accepts <code>text</code> and <code>color</code> (default: '#00b4d8') props. It should render a styled span. Use it in App to display 3 skill badges.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>function Badge({ text, color = '#00b4d8' })</code> and apply <code>style={{ backgroundColor: color }}</code> on a span.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "function Badge({ text, color = '#00b4d8' }) {\n  return (\n    <span style={{\n      backgroundColor: color,\n      color: 'white',\n      padding: '4px 12px',\n      borderRadius: '999px',\n      margin: '4px',\n      display: 'inline-block',\n      fontSize: '14px'\n    }}>\n      {/* Display the text */}\n    </span>\n  );\n}\n\nexport default function App() {\n  return (\n    <div style={{ fontFamily: 'Arial', padding: '20px' }}>\n      <h1>My Skills</h1>\n      <div>\n        {/* Render 3 Badge components with different text and colors */}\n      </div>\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)Badge",
                expectedOutput: null,
                hintXpPenalty: 10,
            },

            // Chapter 3: Styling in React
            {
                courseId: COURSE_ID,
                chapterId: CH.styling,
                slug: "react-inline-styles",
                name: "Inline & Dynamic Styles",
                xp: 20,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>React uses <code>style</code> as a JavaScript object, not a string:</p><p style='margin-bottom:8px;'><code>&lt;div style={{ color: 'red', fontSize: '18px' }}&gt;</code></p><p style='margin-bottom:8px;'>CSS properties are camelCased: <code>background-color</code> → <code>backgroundColor</code>.</p><p style='margin-bottom:8px;'>Dynamic styles: <code>style={{ color: isActive ? 'green' : 'gray' }}</code></p><p style='margin-bottom:8px;'>For className: <code>&lt;div className=\"card\"&gt;</code> (not <code>class</code> — that's a reserved JS keyword).</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a <code>ColorBox</code> component that takes <code>color</code> and <code>label</code> props. It should render a 100×100px colored box with the label centered inside. Display 4 different colored boxes in a row.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use inline style <code>{{ width: 100, height: 100, backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}</code></p></body>",
                starterCode: {
                    "/App.js": {
                        code: "function ColorBox({ color, label }) {\n  return (\n    <div style={{\n      /* Add your styles here */\n      width: '100px',\n      height: '100px',\n      borderRadius: '12px',\n      display: 'flex',\n      alignItems: 'center',\n      justifyContent: 'center',\n      color: 'white',\n      fontWeight: 'bold',\n      fontSize: '14px'\n    }}>\n      {label}\n    </div>\n  );\n}\n\nexport default function App() {\n  return (\n    <div style={{ fontFamily: 'Arial', padding: '20px' }}>\n      <h1>Color Palette</h1>\n      <div style={{ display: 'flex', gap: '12px' }}>\n        {/* Render 4 ColorBox components */}\n      </div>\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)backgroundColor",
                expectedOutput: null,
                hintXpPenalty: 8,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.styling,
                slug: "react-css-classname",
                name: "CSS Files & className",
                xp: 25,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>In React, import CSS files directly: <code>import './styles.css';</code></p><p style='margin-bottom:8px;'>Use <code>className</code> instead of <code>class</code>:</p><p style='margin-bottom:8px;'><code>&lt;div className=\"card\"&gt;</code></p><p style='margin-bottom:8px;'>Dynamic classes: <code>className={`btn ${isActive ? 'active' : ''}`}</code></p><p style='margin-bottom:8px;'>Combine inline styles with CSS classes for the most flexibility.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a CSS file with classes <code>.card</code>, <code>.card-title</code>, and <code>.card-body</code>. Build a <code>ProfileCard</code> component using these classes. Style it with dark theme colors.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create <code>/styles.css</code> with <code>.card { background: #1a1a2e; border-radius: 12px; padding: 20px; }</code> and import it in App.js.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "import './styles.css';\n\nfunction ProfileCard({ name, bio }) {\n  return (\n    <div className=\"card\">\n      <h2 className=\"card-title\">{name}</h2>\n      <p className=\"card-body\">{bio}</p>\n    </div>\n  );\n}\n\nexport default function App() {\n  return (\n    <div style={{ padding: '20px', fontFamily: 'Arial' }}>\n      <h1>Profiles</h1>\n      {/* Render ProfileCard components */}\n    </div>\n  );\n}\n",
                        active: true,
                    },
                    "/styles.css": {
                        code: "/* Style the card, card-title, and card-body */\n.card {\n  /* Add your styles */\n}\n\n.card-title {\n  /* Add your styles */\n}\n\n.card-body {\n  /* Add your styles */\n}\n",
                        active: false,
                    },
                },
                validationRegex: "(?i)className",
                expectedOutput: null,
                hintXpPenalty: 10,
            },

            // Chapter 4: State with useState
            {
                courseId: COURSE_ID,
                chapterId: CH.useState,
                slug: "react-counter",
                name: "Build a Counter",
                xp: 25,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'><code>useState</code> is the most fundamental React hook. It lets you add state to function components.</p><p style='margin-bottom:8px;'><code>const [count, setCount] = useState(0);</code></p><p style='margin-bottom:8px;'><code>count</code> — current value. <code>setCount</code> — function to update it.</p><p style='margin-bottom:8px;'>When state changes, React <strong>re-renders</strong> the component with the new value.</p><p style='margin-bottom:8px;'>Never mutate state directly: <code>count++</code> ❌ → <code>setCount(count + 1)</code> ✅</p><p style='margin-bottom:8px;'>Functional update: <code>setCount(prev => prev + 1)</code> — safer when the new value depends on the old.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a counter with 3 buttons: <strong>+1</strong>, <strong>-1</strong>, and <strong>Reset</strong>. Display the current count. The count should never go below 0.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>const [count, setCount] = useState(0);</code>. For decrement: <code>setCount(prev => Math.max(0, prev - 1))</code>.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "import { useState } from 'react';\n\nexport default function App() {\n  // Declare state here\n\n  return (\n    <div style={{\n      fontFamily: 'Arial',\n      padding: '40px',\n      textAlign: 'center'\n    }}>\n      <h1>Counter</h1>\n      <h2 style={{ fontSize: '64px', margin: '20px 0' }}>\n        {/* Display count */}\n      </h2>\n      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>\n        {/* Add buttons for +1, -1, Reset */}\n      </div>\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)useState",
                expectedOutput: null,
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.useState,
                slug: "react-toggle-switch",
                name: "Toggle Switch",
                xp: 25,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Boolean state is perfect for toggles, modals, and visibility switches:</p><p style='margin-bottom:8px;'><code>const [isOn, setIsOn] = useState(false);</code></p><p style='margin-bottom:8px;'>Toggle: <code>setIsOn(prev => !prev)</code></p><p style='margin-bottom:8px;'>Use the boolean to conditionally style elements: <code>style={{ backgroundColor: isOn ? 'green' : 'gray' }}</code></p><p style='margin-bottom:8px;'>Multiple state variables are fine: each <code>useState</code> manages one piece of state independently.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a toggle switch that shows <strong>ON</strong> (green) or <strong>OFF</strong> (gray) and changes when clicked. Also add a dark/light mode toggle that switches the page background.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use two state variables: <code>const [isOn, setIsOn] = useState(false);</code> and <code>const [dark, setDark] = useState(true);</code>. Toggle with <code>prev => !prev</code>.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "import { useState } from 'react';\n\nexport default function App() {\n  // Declare state for toggle and theme\n\n  return (\n    <div style={{\n      fontFamily: 'Arial',\n      padding: '40px',\n      minHeight: '100vh',\n      textAlign: 'center',\n      /* Dynamic background based on theme */\n    }}>\n      <h1>Toggle Switch</h1>\n\n      {/* Power toggle */}\n      <div\n        style={{\n          width: '80px',\n          height: '40px',\n          borderRadius: '20px',\n          cursor: 'pointer',\n          display: 'flex',\n          alignItems: 'center',\n          padding: '4px',\n          margin: '20px auto',\n          /* Dynamic color */\n        }}\n      >\n        <div style={{\n          width: '32px',\n          height: '32px',\n          borderRadius: '50%',\n          background: 'white',\n          transition: 'transform 0.2s',\n          /* Slide left/right */\n        }} />\n      </div>\n      <p>{/* Show ON or OFF */}</p>\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)useState.*(?:true|false)",
                expectedOutput: null,
                hintXpPenalty: 10,
            },

            // Chapter 5: Event Handling
            {
                courseId: COURSE_ID,
                chapterId: CH.events,
                slug: "react-click-events",
                name: "Click Events",
                xp: 25,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>React events use camelCase: <code>onClick</code>, <code>onChange</code>, <code>onSubmit</code>.</p><p style='margin-bottom:8px;'>Pass a function reference, not a function call: <code>onClick={handleClick}</code> ✅ not <code>onClick={handleClick()}</code> ❌</p><p style='margin-bottom:8px;'>With arguments: <code>onClick={() => handleDelete(id)}</code></p><p style='margin-bottom:8px;'>The event object is passed automatically: <code>onClick={(e) => { e.target... }}</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a color picker: display 5 colored buttons. When clicked, change the background of a preview box to that color. Show the color code below.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>const [selectedColor, setSelectedColor] = useState('#0f0f0f');</code>. On each button: <code>onClick={() => setSelectedColor('#e94560')}</code>.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "import { useState } from 'react';\n\nconst COLORS = ['#e94560', '#00b4d8', '#a3e534', '#f97316', '#8b5cf6'];\n\nexport default function App() {\n  const [selectedColor, setSelectedColor] = useState('#333');\n\n  return (\n    <div style={{ fontFamily: 'Arial', padding: '20px', textAlign: 'center' }}>\n      <h1>Color Picker</h1>\n\n      {/* Preview box */}\n      <div style={{\n        width: '200px',\n        height: '200px',\n        borderRadius: '16px',\n        margin: '20px auto',\n        border: '3px solid #444',\n        /* Set background to selectedColor */\n      }} />\n\n      <p style={{ fontFamily: 'monospace', fontSize: '18px' }}>{selectedColor}</p>\n\n      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '16px' }}>\n        {/* Render color buttons */}\n      </div>\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)onClick",
                expectedOutput: null,
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.events,
                slug: "react-input-events",
                name: "Input Events",
                xp: 25,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Track input changes with <code>onChange</code>:</p><p style='margin-bottom:8px;'><code>&lt;input onChange={(e) => setText(e.target.value)} /&gt;</code></p><p style='margin-bottom:8px;'>This is called a <strong>controlled input</strong> — React controls its value via state.</p><p style='margin-bottom:8px;'>Always pair <code>value={state}</code> with <code>onChange</code> for controlled inputs.</p><p style='margin-bottom:8px;'>Other useful events: <code>onFocus</code>, <code>onBlur</code>, <code>onKeyDown</code>.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a live text previewer: an input field that updates a styled preview card in real-time as you type. Show the character count below.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>const [text, setText] = useState('');</code> with <code>&lt;input value={text} onChange={e => setText(e.target.value)} /&gt;</code>. Display <code>{text.length}</code>.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "import { useState } from 'react';\n\nexport default function App() {\n  const [text, setText] = useState('');\n\n  return (\n    <div style={{ fontFamily: 'Arial', padding: '20px', maxWidth: '500px', margin: '0 auto' }}>\n      <h1>Live Preview</h1>\n\n      <input\n        type=\"text\"\n        placeholder=\"Type something...\"\n        style={{\n          width: '100%',\n          padding: '12px',\n          fontSize: '16px',\n          borderRadius: '8px',\n          border: '2px solid #444',\n          background: '#1a1a2e',\n          color: 'white',\n          outline: 'none'\n        }}\n        /* Add value and onChange */\n      />\n\n      {/* Preview card */}\n      <div style={{\n        marginTop: '20px',\n        padding: '20px',\n        background: '#1a1a2e',\n        borderRadius: '12px',\n        minHeight: '60px',\n        borderLeft: '4px solid #00b4d8'\n      }}>\n        {text || 'Start typing to see preview...'}\n      </div>\n\n      <p style={{ color: '#888', marginTop: '8px' }}>\n        {/* Show character count */}\n      </p>\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)onChange",
                expectedOutput: null,
                hintXpPenalty: 10,
            },

            // Chapter 6: Conditional Rendering
            {
                courseId: COURSE_ID,
                chapterId: CH.conditional,
                slug: "react-conditional-display",
                name: "Show & Hide Elements",
                xp: 25,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>React renders based on state. Three patterns for conditional rendering:</p><p style='margin-bottom:8px;'><strong>1. Ternary:</strong> <code>{isLoggedIn ? &lt;Dashboard /&gt; : &lt;Login /&gt;}</code></p><p style='margin-bottom:8px;'><strong>2. && short-circuit:</strong> <code>{showBanner && &lt;Banner /&gt;}</code> — renders only if truthy.</p><p style='margin-bottom:8px;'><strong>3. Early return:</strong> <code>if (loading) return &lt;Spinner /&gt;;</code> — at the top of your component.</p><p style='margin-bottom:8px;'>Choose the pattern that makes your code most readable.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a login/logout UI: show a <strong>Welcome, User!</strong> message with a Logout button when logged in, and a <strong>Please log in</strong> message with a Login button when logged out. Add a notification badge that only shows when there are unread messages.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>const [loggedIn, setLoggedIn] = useState(false);</code>. In JSX: <code>{loggedIn ? &lt;div&gt;Welcome!&lt;/div&gt; : &lt;div&gt;Please log in&lt;/div&gt;}</code>.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "import { useState } from 'react';\n\nexport default function App() {\n  const [loggedIn, setLoggedIn] = useState(false);\n  const unreadCount = 3;\n\n  return (\n    <div style={{\n      fontFamily: 'Arial',\n      padding: '40px',\n      textAlign: 'center',\n      minHeight: '100vh'\n    }}>\n      <h1>My App</h1>\n\n      {/* Conditional rendering: logged in vs logged out */}\n\n      {/* Notification badge: only show if unreadCount > 0 */}\n\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)(loggedIn|isLoggedIn).*\\?",
                expectedOutput: null,
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.conditional,
                slug: "react-status-indicator",
                name: "Status Indicator",
                xp: 30,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Conditional rendering shines when displaying different states of data:</p><p style='margin-bottom:8px;'><strong>Loading:</strong> Show a spinner or skeleton</p><p style='margin-bottom:8px;'><strong>Error:</strong> Show an error message</p><p style='margin-bottom:8px;'><strong>Empty:</strong> Show an empty state illustration</p><p style='margin-bottom:8px;'><strong>Success:</strong> Show the actual content</p><p style='margin-bottom:8px;'>Map strings to UI: <code>const statusConfig = { online: { color: 'green', text: '🟢 Online' } }</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a status indicator component: 3 buttons (<strong>Online</strong>, <strong>Away</strong>, <strong>Offline</strong>) that change a status display with different colors and icons. Show different styled cards based on the selected status.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a config object mapping status to color/icon. Use <code>const [status, setStatus] = useState('offline');</code> and look up the config.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "import { useState } from 'react';\n\nconst STATUS_CONFIG = {\n  online: { color: '#22c55e', icon: '🟢', text: 'Online — Ready to go!' },\n  away: { color: '#f59e0b', icon: '🟡', text: 'Away — Be right back' },\n  offline: { color: '#ef4444', icon: '🔴', text: 'Offline — Gone for now' },\n};\n\nexport default function App() {\n  const [status, setStatus] = useState('offline');\n\n  // Get config for current status\n  const config = STATUS_CONFIG[status];\n\n  return (\n    <div style={{ fontFamily: 'Arial', padding: '40px', textAlign: 'center' }}>\n      <h1>Status</h1>\n\n      {/* Status display card */}\n      <div style={{\n        padding: '30px',\n        borderRadius: '16px',\n        margin: '20px auto',\n        maxWidth: '300px',\n        /* Use config.color for border or background */\n      }}>\n        <span style={{ fontSize: '48px' }}>{/* icon */}</span>\n        <p>{/* text */}</p>\n      </div>\n\n      {/* Status buttons */}\n      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>\n        {/* Add 3 buttons for each status */}\n      </div>\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)setStatus",
                expectedOutput: null,
                hintXpPenalty: 12,
            },

            // Chapter 7: Lists & Keys
            {
                courseId: COURSE_ID,
                chapterId: CH.lists,
                slug: "react-render-list",
                name: "Rendering Lists",
                xp: 25,
                difficulty: "easy",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Use <code>.map()</code> to transform arrays into JSX lists:</p><p style='margin-bottom:8px;'><code>{items.map(item => &lt;li key={item.id}&gt;{item.name}&lt;/li&gt;)}</code></p><p style='margin-bottom:8px;'>Every list item needs a unique <code>key</code> prop. React uses keys to efficiently update the DOM.</p><p style='margin-bottom:8px;'>Don't use array index as key if the list can be reordered or filtered. Use a stable unique id.</p><p style='margin-bottom:8px;'>You can map to any JSX — divs, components, table rows, etc.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Given an array of programming languages with name and year, render them as styled cards using <code>.map()</code>. Each card should show the name and year.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>{languages.map(lang => &lt;div key={lang.name}&gt;{lang.name} ({lang.year})&lt;/div&gt;)}</code>.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "const languages = [\n  { name: 'JavaScript', year: 1995, color: '#f7df1e' },\n  { name: 'Python', year: 1991, color: '#3776ab' },\n  { name: 'Rust', year: 2010, color: '#ce422b' },\n  { name: 'Go', year: 2009, color: '#00add8' },\n  { name: 'TypeScript', year: 2012, color: '#3178c6' },\n];\n\nexport default function App() {\n  return (\n    <div style={{ fontFamily: 'Arial', padding: '20px' }}>\n      <h1>Programming Languages</h1>\n      <div style={{ display: 'grid', gap: '12px', maxWidth: '400px' }}>\n        {/* Map over languages array and render cards */}\n      </div>\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)\\.map\\(",
                expectedOutput: null,
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.lists,
                slug: "react-filter-list",
                name: "Filtering Lists",
                xp: 30,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Chain <code>.filter()</code> before <code>.map()</code> to show a subset:</p><p style='margin-bottom:8px;'><code>{items.filter(i => i.active).map(i => &lt;Card key={i.id} /&gt;)}</code></p><p style='margin-bottom:8px;'>Combine with state to build interactive filters:</p><p style='margin-bottom:8px;'>1. Store the filter value in state<br/>2. Filter the data based on state<br/>3. Map the filtered data to JSX</p><p style='margin-bottom:8px;'>Search: <code>items.filter(i => i.name.toLowerCase().includes(searchTerm))</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a searchable list: display a list of items with a search input at the top. Filter the list in real-time as the user types. Show the count of matching items.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));</code> then map over <code>filtered</code>.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "import { useState } from 'react';\n\nconst ITEMS = [\n  { id: 1, name: 'React', category: 'Frontend' },\n  { id: 2, name: 'Node.js', category: 'Backend' },\n  { id: 3, name: 'PostgreSQL', category: 'Database' },\n  { id: 4, name: 'Next.js', category: 'Frontend' },\n  { id: 5, name: 'Express', category: 'Backend' },\n  { id: 6, name: 'MongoDB', category: 'Database' },\n  { id: 7, name: 'Vue', category: 'Frontend' },\n  { id: 8, name: 'Redis', category: 'Database' },\n];\n\nexport default function App() {\n  const [search, setSearch] = useState('');\n\n  // Filter items based on search\n  const filtered = ITEMS;\n\n  return (\n    <div style={{ fontFamily: 'Arial', padding: '20px', maxWidth: '500px', margin: '0 auto' }}>\n      <h1>Tech Stack</h1>\n\n      <input\n        type=\"text\"\n        placeholder=\"Search...\"\n        style={{\n          width: '100%',\n          padding: '12px',\n          borderRadius: '8px',\n          border: '2px solid #444',\n          background: '#1a1a2e',\n          color: 'white',\n          fontSize: '16px',\n          marginBottom: '16px'\n        }}\n        /* Add value and onChange */\n      />\n\n      <p style={{ color: '#888' }}>{filtered.length} results</p>\n\n      {/* Render filtered items */}\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)\\.filter\\(",
                expectedOutput: null,
                hintXpPenalty: 12,
            },

            // Chapter 8: Forms & Controlled Components
            {
                courseId: COURSE_ID,
                chapterId: CH.forms,
                slug: "react-controlled-form",
                name: "Controlled Form",
                xp: 30,
                difficulty: "medium",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>In React, forms are best managed with <strong>controlled components</strong>:</p><p style='margin-bottom:8px;'>1. Store each input's value in state</p><p style='margin-bottom:8px;'>2. Set <code>value={state}</code> on the input</p><p style='margin-bottom:8px;'>3. Update state on <code>onChange</code></p><p style='margin-bottom:8px;'>Handle submission: <code>&lt;form onSubmit={handleSubmit}&gt;</code></p><p style='margin-bottom:8px;'>Don't forget <code>e.preventDefault()</code> to stop the page from reloading!</p><p style='margin-bottom:8px;'>Use an object for multiple fields: <code>const [form, setForm] = useState({ name: '', email: '' });</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a contact form with <strong>Name</strong>, <strong>Email</strong>, and <strong>Message</strong> fields. On submit, display the submitted data below the form and clear the inputs.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>const [form, setForm] = useState({ name: '', email: '', message: '' });</code>. On submit, save the data to another state variable and reset the form.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "import { useState } from 'react';\n\nexport default function App() {\n  const [form, setForm] = useState({ name: '', email: '', message: '' });\n  const [submitted, setSubmitted] = useState(null);\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    // Save form data and reset\n  };\n\n  const handleChange = (e) => {\n    // Update the matching field in form state\n  };\n\n  const inputStyle = {\n    width: '100%',\n    padding: '10px',\n    borderRadius: '8px',\n    border: '2px solid #444',\n    background: '#1a1a2e',\n    color: 'white',\n    fontSize: '14px',\n    marginBottom: '12px'\n  };\n\n  return (\n    <div style={{ fontFamily: 'Arial', padding: '20px', maxWidth: '500px', margin: '0 auto' }}>\n      <h1>Contact Us</h1>\n\n      <form onSubmit={handleSubmit}>\n        <input name=\"name\" placeholder=\"Name\" style={inputStyle}\n          /* value and onChange */ />\n        <input name=\"email\" placeholder=\"Email\" type=\"email\" style={inputStyle}\n          /* value and onChange */ />\n        <textarea name=\"message\" placeholder=\"Message\" rows={4}\n          style={{ ...inputStyle, resize: 'vertical' }}\n          /* value and onChange */ />\n        <button type=\"submit\" style={{\n          padding: '10px 24px',\n          borderRadius: '8px',\n          border: 'none',\n          background: '#00b4d8',\n          color: 'white',\n          fontSize: '16px',\n          cursor: 'pointer'\n        }}>Send</button>\n      </form>\n\n      {/* Show submitted data */}\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)onSubmit",
                expectedOutput: null,
                hintXpPenalty: 12,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.forms,
                slug: "react-todo-list",
                name: "Todo List",
                xp: 35,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>A todo list combines forms, lists, and state management:</p><p style='margin-bottom:8px;'>1. <strong>Add:</strong> Form input + submit → add to state array</p><p style='margin-bottom:8px;'>2. <strong>Toggle:</strong> Map over items, update the clicked one</p><p style='margin-bottom:8px;'>3. <strong>Delete:</strong> Filter out the deleted item</p><p style='margin-bottom:8px;'>State update patterns:<br/><code>setItems([...items, newItem])</code> — add<br/><code>setItems(items.filter(i => i.id !== id))</code> — delete<br/><code>setItems(items.map(i => i.id === id ? {...i, done: !i.done} : i))</code> — toggle</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a todo list where you can: <strong>add</strong> new tasks, <strong>toggle</strong> them complete (with strikethrough), and <strong>delete</strong> them. Show the count of remaining tasks.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>const [todos, setTodos] = useState([]);</code> where each todo is <code>{ id: Date.now(), text, done: false }</code>. Use <code>.filter()</code> to delete and <code>.map()</code> to toggle.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "import { useState } from 'react';\n\nexport default function App() {\n  const [todos, setTodos] = useState([]);\n  const [input, setInput] = useState('');\n\n  const addTodo = (e) => {\n    e.preventDefault();\n    if (!input.trim()) return;\n    // Add new todo and clear input\n  };\n\n  const toggleTodo = (id) => {\n    // Toggle done status\n  };\n\n  const deleteTodo = (id) => {\n    // Remove todo\n  };\n\n  const remaining = todos.filter(t => !t.done).length;\n\n  return (\n    <div style={{ fontFamily: 'Arial', padding: '20px', maxWidth: '500px', margin: '0 auto' }}>\n      <h1>Todo List</h1>\n      <p style={{ color: '#888' }}>{remaining} task(s) remaining</p>\n\n      <form onSubmit={addTodo} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>\n        <input\n          value={input}\n          onChange={e => setInput(e.target.value)}\n          placeholder=\"Add a task...\"\n          style={{\n            flex: 1,\n            padding: '10px',\n            borderRadius: '8px',\n            border: '2px solid #444',\n            background: '#1a1a2e',\n            color: 'white'\n          }}\n        />\n        <button type=\"submit\" style={{\n          padding: '10px 20px',\n          borderRadius: '8px',\n          border: 'none',\n          background: '#00b4d8',\n          color: 'white',\n          cursor: 'pointer'\n        }}>Add</button>\n      </form>\n\n      {/* Render todos with toggle and delete */}\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)setTodos",
                expectedOutput: null,
                hintXpPenalty: 14,
            },

            // Chapter 9: useEffect & Side Effects
            {
                courseId: COURSE_ID,
                chapterId: CH.useEffect,
                slug: "react-useeffect-basics",
                name: "useEffect Basics",
                xp: 30,
                difficulty: "medium",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'><code>useEffect</code> runs side effects after render:</p><p style='margin-bottom:8px;'><code>useEffect(() => { ... }, [dependencies]);</code></p><p style='margin-bottom:8px;'><strong>No deps array:</strong> runs after every render</p><p style='margin-bottom:8px;'><strong>Empty array []:</strong> runs once on mount</p><p style='margin-bottom:8px;'><strong>[value]:</strong> runs when <code>value</code> changes</p><p style='margin-bottom:8px;'><strong>Cleanup:</strong> return a function to clean up: <code>return () => clearInterval(timer);</code></p><p style='margin-bottom:8px;'>Common uses: fetching data, setting up timers, subscribing to events, updating document title.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a stopwatch with <strong>Start</strong>, <strong>Stop</strong>, and <strong>Reset</strong> buttons. Use <code>useEffect</code> with <code>setInterval</code> to update the timer every 100ms. Don't forget the cleanup function!</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>useEffect</code> that starts/stops an interval based on <code>isRunning</code> state. Return <code>() => clearInterval(id)</code> for cleanup. Track time in milliseconds.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "import { useState, useEffect } from 'react';\n\nexport default function App() {\n  const [time, setTime] = useState(0);\n  const [isRunning, setIsRunning] = useState(false);\n\n  // useEffect for the timer\n  useEffect(() => {\n    // Start interval when running, clean up when not\n  }, [isRunning]);\n\n  const formatTime = (ms) => {\n    const seconds = Math.floor(ms / 1000);\n    const minutes = Math.floor(seconds / 60);\n    const displaySeconds = seconds % 60;\n    const displayMs = Math.floor((ms % 1000) / 100);\n    const pad = (n) => String(n).padStart(2, '0');\n    return pad(minutes) + ':' + pad(displaySeconds) + '.' + displayMs;\n  };\n\n  return (\n    <div style={{\n      fontFamily: 'monospace',\n      padding: '40px',\n      textAlign: 'center'\n    }}>\n      <h1 style={{ fontFamily: 'Arial' }}>Stopwatch</h1>\n      <h2 style={{ fontSize: '72px', margin: '30px 0' }}>\n        {formatTime(time)}\n      </h2>\n      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>\n        {/* Start/Stop and Reset buttons */}\n      </div>\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)useEffect",
                expectedOutput: null,
                hintXpPenalty: 12,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.useEffect,
                slug: "react-document-title",
                name: "Dynamic Document Title",
                xp: 20,
                difficulty: "easy",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>A simple but practical <code>useEffect</code> example is updating the document title:</p><p style='margin-bottom:8px;'><code>useEffect(() => { document.title = '(' + count + ') DevArcade'; }, [count]);</code></p><p style='margin-bottom:8px;'>The dependency array <code>[count]</code> ensures the effect only re-runs when <code>count</code> changes — not on every render.</p><p style='margin-bottom:8px;'>This is a great pattern for showing notification counts, current page names, or real-time updates in the browser tab.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a notification counter. When the count changes, update the browser tab title to <strong>(count) DevArcade</strong>. Add buttons to increment, decrement, and clear notifications.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use <code>useEffect(() => { document.title = count &gt; 0 ? '(' + count + ') DevArcade' : 'DevArcade'; }, [count]);</code></p></body>",
                starterCode: {
                    "/App.js": {
                        code: "import { useState, useEffect } from 'react';\n\nexport default function App() {\n  const [count, setCount] = useState(0);\n\n  // Update document title when count changes\n\n  return (\n    <div style={{\n      fontFamily: 'Arial',\n      padding: '40px',\n      textAlign: 'center'\n    }}>\n      <h1>Notifications</h1>\n      <div style={{\n        fontSize: '64px',\n        margin: '20px 0',\n        position: 'relative',\n        display: 'inline-block'\n      }}>\n        🔔\n        {count > 0 && (\n          <span style={{\n            position: 'absolute',\n            top: '-5px',\n            right: '-15px',\n            background: '#e94560',\n            color: 'white',\n            borderRadius: '50%',\n            width: '30px',\n            height: '30px',\n            display: 'flex',\n            alignItems: 'center',\n            justifyContent: 'center',\n            fontSize: '16px'\n          }}>{count}</span>\n        )}\n      </div>\n      <p>Check the browser tab title!</p>\n      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>\n        {/* Add increment, decrement, clear buttons */}\n      </div>\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)document\\.title",
                expectedOutput: null,
                hintXpPenalty: 8,
            },

            // Chapter 10: Component Composition
            {
                courseId: COURSE_ID,
                chapterId: CH.composition,
                slug: "react-children-prop",
                name: "Children Prop & Layout",
                xp: 25,
                difficulty: "medium",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>The <code>children</code> prop contains anything between a component's opening and closing tags:</p><p style='margin-bottom:8px;'><code>&lt;Card&gt;Hello World&lt;/Card&gt;</code> → <code>children</code> = \"Hello World\"</p><p style='margin-bottom:8px;'>This is powerful for building reusable <strong>layout components</strong>:</p><p style='margin-bottom:8px;'><code>function Card({ children, title }) { return &lt;div&gt;&lt;h2&gt;{title}&lt;/h2&gt;{children}&lt;/div&gt;; }</code></p><p style='margin-bottom:8px;'>Composition over inheritance: build complex UI by combining simple components rather than creating deep hierarchies.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create a reusable <code>Card</code> component that accepts <code>title</code> and renders <code>children</code> inside a styled container. Then create a <code>PageLayout</code> component with a sidebar and main area. Use them together.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Define <code>function Card({ title, children })</code> and <code>function PageLayout({ sidebar, children })</code>. Use named props for specific slots and children for the main content.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "function Card({ title, children }) {\n  return (\n    <div style={{\n      background: '#1a1a2e',\n      borderRadius: '12px',\n      padding: '20px',\n      marginBottom: '16px',\n      border: '1px solid #333'\n    }}>\n      {title && <h3 style={{ marginTop: 0, color: '#00b4d8' }}>{title}</h3>}\n      {/* Render children */}\n    </div>\n  );\n}\n\nfunction PageLayout({ sidebar, children }) {\n  return (\n    <div style={{ display: 'flex', gap: '20px' }}>\n      <aside style={{ width: '250px' }}>\n        {/* Render sidebar */}\n      </aside>\n      <main style={{ flex: 1 }}>\n        {/* Render children */}\n      </main>\n    </div>\n  );\n}\n\nexport default function App() {\n  return (\n    <div style={{ fontFamily: 'Arial', padding: '20px' }}>\n      <h1>Dashboard</h1>\n      <PageLayout\n        sidebar={\n          <Card title=\"Navigation\">\n            <ul style={{ listStyle: 'none', padding: 0 }}>\n              <li>🏠 Home</li>\n              <li>📊 Stats</li>\n              <li>⚙️ Settings</li>\n            </ul>\n          </Card>\n        }\n      >\n        {/* Main content using Card components */}\n        <Card title=\"Welcome\">\n          <p>Build your layout with composition!</p>\n        </Card>\n      </PageLayout>\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)children",
                expectedOutput: null,
                hintXpPenalty: 10,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.composition,
                slug: "react-reusable-components",
                name: "Reusable Button Component",
                xp: 25,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Great components are flexible and reusable. A good Button component might support:</p><p style='margin-bottom:8px;'><strong>Variants:</strong> primary, secondary, danger, ghost</p><p style='margin-bottom:8px;'><strong>Sizes:</strong> small, medium, large</p><p style='margin-bottom:8px;'><strong>States:</strong> disabled, loading</p><p style='margin-bottom:8px;'>Use a config object to map variant names to styles. Spread remaining props with <code>{...rest}</code> for flexibility.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a reusable <code>Button</code> component that supports <code>variant</code> (primary, danger, ghost), <code>size</code> (sm, md, lg), and <code>disabled</code> props. Show all combinations in a showcase.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create variant and size config objects. Merge styles: <code>style={{ ...baseStyle, ...variantStyles[variant], ...sizeStyles[size] }}</code>.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "function Button({ children, variant = 'primary', size = 'md', disabled = false, onClick }) {\n  const variants = {\n    primary: { background: '#00b4d8', color: 'white' },\n    danger: { background: '#e94560', color: 'white' },\n    ghost: { background: 'transparent', color: '#00b4d8', border: '2px solid #00b4d8' },\n  };\n\n  const sizes = {\n    sm: { padding: '6px 12px', fontSize: '12px' },\n    md: { padding: '10px 20px', fontSize: '14px' },\n    lg: { padding: '14px 28px', fontSize: '18px' },\n  };\n\n  return (\n    <button\n      onClick={onClick}\n      disabled={disabled}\n      style={{\n        border: 'none',\n        borderRadius: '8px',\n        cursor: disabled ? 'not-allowed' : 'pointer',\n        opacity: disabled ? 0.5 : 1,\n        fontWeight: 'bold',\n        /* Merge variant and size styles */\n      }}\n    >\n      {children}\n    </button>\n  );\n}\n\nexport default function App() {\n  return (\n    <div style={{ fontFamily: 'Arial', padding: '20px' }}>\n      <h1>Button Showcase</h1>\n\n      <h3>Variants</h3>\n      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>\n        {/* Show all 3 variants */}\n      </div>\n\n      <h3>Sizes</h3>\n      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>\n        {/* Show all 3 sizes */}\n      </div>\n\n      <h3>Disabled</h3>\n      <Button variant=\"primary\" disabled>Can't click me</Button>\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)variant.*primary",
                expectedOutput: null,
                hintXpPenalty: 10,
            },

            // Chapter 11: Context API
            {
                courseId: COURSE_ID,
                chapterId: CH.context,
                slug: "react-theme-context",
                name: "Theme Context",
                xp: 35,
                difficulty: "medium",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Context solves <strong>prop drilling</strong> — passing props through many levels.</p><p style='margin-bottom:8px;'>Three steps:</p><p style='margin-bottom:8px;'>1. <code>const ThemeContext = createContext();</code></p><p style='margin-bottom:8px;'>2. <code>&lt;ThemeContext.Provider value={theme}&gt;</code> — wraps your app</p><p style='margin-bottom:8px;'>3. <code>const theme = useContext(ThemeContext);</code> — access anywhere</p><p style='margin-bottom:8px;'>Best practice: create a custom hook: <code>function useTheme() { return useContext(ThemeContext); }</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a theme switcher using Context: create a <code>ThemeContext</code> with dark/light themes. Add a toggle button. All child components should read from context (not props) to style themselves.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create context with <code>createContext()</code>. In the provider, store <code>{ theme, toggleTheme }</code>. Children use <code>useContext(ThemeContext)</code> to read the theme.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "import { createContext, useContext, useState } from 'react';\n\nconst ThemeContext = createContext();\n\nconst themes = {\n  dark: { bg: '#0f0f0f', card: '#1a1a2e', text: '#d6deeb', accent: '#00b4d8' },\n  light: { bg: '#f5f5f5', card: '#ffffff', text: '#1a1a2e', accent: '#0077b6' },\n};\n\nfunction ThemeProvider({ children }) {\n  const [mode, setMode] = useState('dark');\n  const toggleTheme = () => setMode(prev => prev === 'dark' ? 'light' : 'dark');\n\n  return (\n    <ThemeContext.Provider value={{ theme: themes[mode], mode, toggleTheme }}>\n      {children}\n    </ThemeContext.Provider>\n  );\n}\n\nfunction ThemedCard({ title, children }) {\n  const { theme } = useContext(ThemeContext);\n  return (\n    <div style={{\n      background: theme.card,\n      color: theme.text,\n      padding: '20px',\n      borderRadius: '12px',\n      marginBottom: '12px'\n    }}>\n      <h3 style={{ color: theme.accent }}>{title}</h3>\n      {children}\n    </div>\n  );\n}\n\nfunction Header() {\n  const { mode, toggleTheme, theme } = useContext(ThemeContext);\n  return (\n    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>\n      <h1 style={{ color: theme.text }}>Themed App</h1>\n      <button onClick={toggleTheme} style={{\n        padding: '8px 16px',\n        borderRadius: '8px',\n        border: 'none',\n        background: theme.accent,\n        color: 'white',\n        cursor: 'pointer'\n      }}>\n        {mode === 'dark' ? '☀️ Light' : '🌙 Dark'}\n      </button>\n    </header>\n  );\n}\n\nfunction Content() {\n  return (\n    <div>\n      {/* Add ThemedCard components here */}\n      <ThemedCard title=\"Welcome\">\n        <p>This card reads its theme from Context — no prop drilling!</p>\n      </ThemedCard>\n    </div>\n  );\n}\n\nexport default function App() {\n  return (\n    <ThemeProvider>\n      <AppContent />\n    </ThemeProvider>\n  );\n}\n\nfunction AppContent() {\n  const { theme } = useContext(ThemeContext);\n  return (\n    <div style={{\n      fontFamily: 'Arial',\n      padding: '20px',\n      minHeight: '100vh',\n      background: theme.bg,\n      transition: 'background 0.3s'\n    }}>\n      <Header />\n      <Content />\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)useContext",
                expectedOutput: null,
                hintXpPenalty: 14,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.context,
                slug: "react-user-context",
                name: "User Auth Context",
                xp: 35,
                difficulty: "medium",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Context is commonly used for authentication state — share user info across the entire app:</p><p style='margin-bottom:8px;'><code>const UserContext = createContext({ user: null, login: () => {}, logout: () => {} });</code></p><p style='margin-bottom:8px;'>The provider manages state and exposes login/logout actions. Any component can check if a user is logged in.</p><p style='margin-bottom:8px;'>Combine with conditional rendering: <code>{user ? &lt;Dashboard /&gt; : &lt;LoginPage /&gt;}</code></p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a mock auth system using Context: create a <code>UserContext</code> with login/logout functions. Show a login form when logged out and a dashboard when logged in. The navbar should show the user's name.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Create <code>UserContext</code> with <code>{ user, login, logout }</code>. <code>login</code> sets the user object, <code>logout</code> sets it to null. Conditionally render based on <code>user</code>.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "import { createContext, useContext, useState } from 'react';\n\nconst UserContext = createContext();\n\nfunction UserProvider({ children }) {\n  const [user, setUser] = useState(null);\n\n  const login = (name) => setUser({ name, joinedAt: new Date().toLocaleDateString() });\n  const logout = () => setUser(null);\n\n  return (\n    <UserContext.Provider value={{ user, login, logout }}>\n      {children}\n    </UserContext.Provider>\n  );\n}\n\nfunction Navbar() {\n  const { user, logout } = useContext(UserContext);\n  return (\n    <nav style={{\n      display: 'flex',\n      justifyContent: 'space-between',\n      alignItems: 'center',\n      padding: '12px 20px',\n      background: '#1a1a2e',\n      borderRadius: '12px',\n      marginBottom: '20px'\n    }}>\n      <span style={{ fontSize: '20px', fontWeight: 'bold' }}>🎮 DevArcade</span>\n      {/* Show user name and logout button if logged in */}\n    </nav>\n  );\n}\n\nfunction LoginPage() {\n  const { login } = useContext(UserContext);\n  const [name, setName] = useState('');\n\n  return (\n    <div style={{ textAlign: 'center', padding: '40px' }}>\n      <h2>Login</h2>\n      <input\n        value={name}\n        onChange={e => setName(e.target.value)}\n        placeholder=\"Enter your name\"\n        style={{\n          padding: '10px',\n          borderRadius: '8px',\n          border: '2px solid #444',\n          background: '#1a1a2e',\n          color: 'white',\n          marginRight: '8px'\n        }}\n      />\n      <button\n        onClick={() => name.trim() && login(name.trim())}\n        style={{\n          padding: '10px 20px',\n          borderRadius: '8px',\n          border: 'none',\n          background: '#00b4d8',\n          color: 'white',\n          cursor: 'pointer'\n        }}\n      >Login</button>\n    </div>\n  );\n}\n\nfunction Dashboard() {\n  const { user } = useContext(UserContext);\n  return (\n    <div>\n      <h2>Welcome, {user?.name}! 👋</h2>\n      <p>Member since: {user?.joinedAt}</p>\n      {/* Add some dashboard content */}\n    </div>\n  );\n}\n\nexport default function App() {\n  return (\n    <UserProvider>\n      <div style={{ fontFamily: 'Arial', padding: '20px', minHeight: '100vh' }}>\n        <Navbar />\n        {/* Conditionally render LoginPage or Dashboard */}\n        <AppContent />\n      </div>\n    </UserProvider>\n  );\n}\n\nfunction AppContent() {\n  const { user } = useContext(UserContext);\n  return user ? <Dashboard /> : <LoginPage />;\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)UserContext|UserProvider",
                expectedOutput: null,
                hintXpPenalty: 14,
            },

            // Chapter 12: Capstone
            {
                courseId: COURSE_ID,
                chapterId: CH.capstone,
                slug: "react-expense-tracker",
                name: "Expense Tracker",
                xp: 40,
                difficulty: "hard",
                orderIndex: 1,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>Time to put everything together! This capstone exercise combines:</p><p style='margin-bottom:8px;'>✅ Components & Props</p><p style='margin-bottom:8px;'>✅ useState for tracking expenses</p><p style='margin-bottom:8px;'>✅ Forms for adding new entries</p><p style='margin-bottom:8px;'>✅ Lists with .map() and keys</p><p style='margin-bottom:8px;'>✅ Conditional rendering</p><p style='margin-bottom:8px;'>✅ Computed values (total, filtered lists)</p><p style='margin-bottom:8px;'>Build an expense tracker that lets you add expenses with a name and amount, see a list, and view the total.</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a complete expense tracker: add expenses with name, amount, and category. Display them in a list with delete functionality. Show the total at the top. Bonus: add category filter.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use state for the expense list, form inputs, and filter. Compute total with <code>expenses.reduce((sum, e) => sum + e.amount, 0)</code>. Filter with <code>.filter()</code> before <code>.map()</code>.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "import { useState } from 'react';\n\nconst CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Bills', 'Other'];\n\nexport default function App() {\n  const [expenses, setExpenses] = useState([]);\n  const [name, setName] = useState('');\n  const [amount, setAmount] = useState('');\n  const [category, setCategory] = useState(CATEGORIES[0]);\n  const [filter, setFilter] = useState('All');\n\n  const addExpense = (e) => {\n    e.preventDefault();\n    if (!name.trim() || !amount) return;\n    // Add expense to list\n  };\n\n  const deleteExpense = (id) => {\n    // Remove expense\n  };\n\n  // Calculate total\n  const total = 0;\n\n  // Filter expenses\n  const filtered = expenses;\n\n  const inputStyle = {\n    padding: '10px',\n    borderRadius: '8px',\n    border: '2px solid #444',\n    background: '#1a1a2e',\n    color: 'white',\n    fontSize: '14px'\n  };\n\n  return (\n    <div style={{ fontFamily: 'Arial', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>\n      <h1>💰 Expense Tracker</h1>\n\n      {/* Total display */}\n      <div style={{\n        background: '#1a1a2e',\n        padding: '20px',\n        borderRadius: '12px',\n        textAlign: 'center',\n        marginBottom: '20px'\n      }}>\n        <p style={{ color: '#888', margin: 0 }}>Total Spent</p>\n        <h2 style={{ color: '#e94560', fontSize: '36px', margin: '8px 0' }}>\n          ${/* format total */}\n        </h2>\n      </div>\n\n      {/* Add expense form */}\n      <form onSubmit={addExpense} style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>\n        <input placeholder=\"Expense name\" style={{ ...inputStyle, flex: 2 }}\n          /* value and onChange */ />\n        <input placeholder=\"Amount\" type=\"number\" style={{ ...inputStyle, flex: 1 }}\n          /* value and onChange */ />\n        <select style={inputStyle}\n          /* value and onChange */>\n          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}\n        </select>\n        <button type=\"submit\" style={{\n          padding: '10px 20px',\n          borderRadius: '8px',\n          border: 'none',\n          background: '#00b4d8',\n          color: 'white',\n          cursor: 'pointer'\n        }}>Add</button>\n      </form>\n\n      {/* Category filter */}\n      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>\n        {['All', ...CATEGORIES].map(c => (\n          <button key={c}\n            onClick={() => setFilter(c)}\n            style={{\n              padding: '6px 14px',\n              borderRadius: '20px',\n              border: 'none',\n              background: filter === c ? '#00b4d8' : '#333',\n              color: 'white',\n              cursor: 'pointer'\n            }}\n          >{c}</button>\n        ))}\n      </div>\n\n      {/* Expense list */}\n      {filtered.length === 0 && (\n        <p style={{ textAlign: 'center', color: '#888' }}>No expenses yet. Start tracking!</p>\n      )}\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)setExpenses",
                expectedOutput: null,
                hintXpPenalty: 16,
            },
            {
                courseId: COURSE_ID,
                chapterId: CH.capstone,
                slug: "react-quiz-app",
                name: "Quiz App",
                xp: 45,
                difficulty: "hard",
                orderIndex: 2,
                content: "<body style='font-family:Arial,sans-serif;line-height:1.6;background-color:#0f0f0f;padding:20px;'><p style='margin-bottom:8px;'>The final challenge! Build a quiz app that uses:</p><p style='margin-bottom:8px;'>✅ State for current question index, score, and answers</p><p style='margin-bottom:8px;'>✅ Conditional rendering for questions vs results screen</p><p style='margin-bottom:8px;'>✅ Event handling for answer selection</p><p style='margin-bottom:8px;'>✅ useEffect for an optional countdown timer</p><p style='margin-bottom:8px;'>✅ Dynamic styling for correct/wrong answers</p><p style='margin-bottom:8px;'>This is your graduation project — show off everything you've learned!</p></body>",
                task: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Build a quiz app with at least 5 questions. Show one question at a time with multiple choice answers. Highlight correct/wrong after selection. Show a results screen with the final score at the end. Add a progress bar.</p></body>",
                hint: "<body style='font-family:Arial,sans-serif;padding:10px;'><p>Use state for <code>currentQ</code>, <code>score</code>, <code>selectedAnswer</code>, <code>showResult</code>. When an answer is selected, check if it matches the correct answer, update score, and move to next after a delay.</p></body>",
                starterCode: {
                    "/App.js": {
                        code: "import { useState } from 'react';\n\nconst QUESTIONS = [\n  {\n    question: 'What hook is used to add state to a React component?',\n    options: ['useEffect', 'useState', 'useContext', 'useRef'],\n    correct: 1,\n  },\n  {\n    question: 'What does JSX stand for?',\n    options: ['JavaScript XML', 'JavaScript Extension', 'Java Syntax Extension', 'JSON XML'],\n    correct: 0,\n  },\n  {\n    question: 'How do you pass data from parent to child in React?',\n    options: ['State', 'Context', 'Props', 'Refs'],\n    correct: 2,\n  },\n  {\n    question: 'Which method is used to render a list in React?',\n    options: ['.forEach()', '.map()', '.filter()', '.reduce()'],\n    correct: 1,\n  },\n  {\n    question: 'What is the correct way to update state in React?',\n    options: ['state = newValue', 'this.state = newValue', 'setState(newValue)', 'state.push(newValue)'],\n    correct: 2,\n  },\n];\n\nexport default function App() {\n  const [currentQ, setCurrentQ] = useState(0);\n  const [score, setScore] = useState(0);\n  const [selected, setSelected] = useState(null);\n  const [finished, setFinished] = useState(false);\n\n  const handleAnswer = (index) => {\n    if (selected !== null) return; // Already answered\n    setSelected(index);\n    if (index === QUESTIONS[currentQ].correct) {\n      setScore(s => s + 1);\n    }\n    // Move to next question after 1.5s\n    setTimeout(() => {\n      if (currentQ + 1 < QUESTIONS.length) {\n        setCurrentQ(q => q + 1);\n        setSelected(null);\n      } else {\n        setFinished(true);\n      }\n    }, 1500);\n  };\n\n  const restart = () => {\n    setCurrentQ(0);\n    setScore(0);\n    setSelected(null);\n    setFinished(false);\n  };\n\n  // Results screen\n  if (finished) {\n    return (\n      <div style={{ fontFamily: 'Arial', padding: '40px', textAlign: 'center' }}>\n        <h1>Quiz Complete! 🎉</h1>\n        <p style={{ fontSize: '48px', margin: '20px 0' }}>\n          {score}/{QUESTIONS.length}\n        </p>\n        <p>{score === QUESTIONS.length ? 'Perfect score!' : score >= 3 ? 'Great job!' : 'Keep practicing!'}</p>\n        <button onClick={restart} style={{\n          padding: '12px 24px', borderRadius: '8px', border: 'none',\n          background: '#00b4d8', color: 'white', fontSize: '16px', cursor: 'pointer', marginTop: '20px'\n        }}>Try Again</button>\n      </div>\n    );\n  }\n\n  const q = QUESTIONS[currentQ];\n  const progress = ((currentQ) / QUESTIONS.length) * 100;\n\n  return (\n    <div style={{ fontFamily: 'Arial', padding: '20px', maxWidth: '600px', margin: '0 auto' }}>\n      {/* Progress bar */}\n      <div style={{ background: '#333', borderRadius: '10px', height: '8px', marginBottom: '20px' }}>\n        <div style={{\n          background: '#00b4d8', height: '100%', borderRadius: '10px',\n          width: progress + '%', transition: 'width 0.3s'\n        }} />\n      </div>\n\n      <p style={{ color: '#888' }}>Question {currentQ + 1} of {QUESTIONS.length}</p>\n      <h2 style={{ marginBottom: '24px' }}>{q.question}</h2>\n\n      <div style={{ display: 'grid', gap: '12px' }}>\n        {q.options.map((option, i) => {\n          let bg = '#1a1a2e';\n          if (selected !== null) {\n            if (i === q.correct) bg = '#22c55e';\n            else if (i === selected) bg = '#e94560';\n          }\n          return (\n            <button\n              key={i}\n              onClick={() => handleAnswer(i)}\n              style={{\n                padding: '14px 20px',\n                borderRadius: '10px',\n                border: '2px solid #333',\n                background: bg,\n                color: 'white',\n                fontSize: '16px',\n                textAlign: 'left',\n                cursor: selected !== null ? 'default' : 'pointer',\n                transition: 'background 0.3s'\n              }}\n            >{option}</button>\n          );\n        })}\n      </div>\n    </div>\n  );\n}\n",
                        active: true,
                    },
                },
                validationRegex: "(?i)QUESTIONS|handleAnswer",
                expectedOutput: null,
                hintXpPenalty: 18,
            },
        ];

        let inserted = 0;
        for (const item of DATA) {
            await db.insert(ExerciseTable).values({
                courseId: item.courseId,
                chapterId: item.chapterId,
                slug: item.slug,
                name: item.name,
                xp: item.xp,
                difficulty: item.difficulty,
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
                    courseId: item.courseId,
                    chapterId: item.chapterId,
                    name: item.name,
                    xp: item.xp,
                    difficulty: item.difficulty,
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
            inserted++;
        }

        return NextResponse.json({
            message: `React exercises seeded: ${inserted} processed`,
            courseId: COURSE_ID,
        });
    } catch (error: any) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
