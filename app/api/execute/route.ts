import { Judge0Error, runOnJudge0 } from "@/lib/judge0";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

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
        const result = await runOnJudge0(code, languageId, stdin || "");
        return NextResponse.json(result);
    } catch (error) {
        if (error instanceof Judge0Error) {
            console.error("Judge0 API error:", error.status, error.details);
            return NextResponse.json(
                { error: error.message, details: error.details },
                { status: error.status }
            );
        }
        console.error("Judge0 execution error:", error);
        return NextResponse.json(
            { error: "Failed to execute code. Please try again." },
            { status: 500 }
        );
    }
}
