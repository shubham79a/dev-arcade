import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const JUDGE0_URL = process.env.JUDGE0_API_URL || "https://ce.judge0.com";
const JUDGE0_KEY = process.env.JUDGE0_API_KEY; // Optional — only needed for RapidAPI
const JUDGE0_HOST = process.env.JUDGE0_API_HOST; // Optional — only needed for RapidAPI

export async function POST(req: NextRequest) {
    // Auth check — only logged-in users can execute code
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    if (!email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, languageId, stdin } = await req.json();
 
    if (!code || !languageId) {
        return NextResponse.json(
            { error: "Missing required fields: code, languageId" },
            { status: 400 }
        );
    }

    try {
        // Build headers — add RapidAPI headers only if API key is configured
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (JUDGE0_KEY && JUDGE0_HOST) {
            headers["X-RapidAPI-Key"] = JUDGE0_KEY;
            headers["X-RapidAPI-Host"] = JUDGE0_HOST;
        }

        const response = await fetch(
            `${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`,
            {
                method: "POST",
                headers,
                body: JSON.stringify({
                    language_id: languageId,
                    source_code: Buffer.from(code).toString("base64"),
                    stdin: Buffer.from(stdin || "").toString("base64"),
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Judge0 API error:", response.status, errorText);
            return NextResponse.json(
                { error: "Code execution service error", details: errorText },
                { status: response.status }
            );
        }

        const result = await response.json();

        return NextResponse.json({
            stdout: result.stdout
                ? Buffer.from(result.stdout, "base64").toString()
                : "",
            stderr: result.stderr
                ? Buffer.from(result.stderr, "base64").toString()
                : "",
            compile_output: result.compile_output
                ? Buffer.from(result.compile_output, "base64").toString()
                : "",
            status: result.status,
            time: result.time,
            memory: result.memory,
        });
    } catch (error) {
        console.error("Judge0 execution error:", error);
        return NextResponse.json(
            { error: "Failed to execute code. Please try again." },
            { status: 500 }
        );
    }
}
