const JUDGE0_URL = process.env.JUDGE0_API_URL || "https://ce.judge0.com";
const JUDGE0_KEY = process.env.JUDGE0_API_KEY; // Optional — only needed for RapidAPI
const JUDGE0_HOST = process.env.JUDGE0_API_HOST; // Optional — only needed for RapidAPI

export type Judge0Result = {
    stdout: string;
    stderr: string;
    compile_output: string;
    status: { id: number; description: string };
    time: string | null;
    memory: number | null;
};

export class Judge0Error extends Error {
    constructor(public status: number, public details: string) {
        super("Code execution service error");
    }
}

const decode = (value?: string | null) =>
    value ? Buffer.from(value, "base64").toString() : "";

// Runs code synchronously on Judge0 (wait=true) and returns decoded output
export async function runOnJudge0(code: string, languageId: number, stdin = ""): Promise<Judge0Result> {
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
                stdin: Buffer.from(stdin).toString("base64"),
            }),
        }
    );

    if (!response.ok) {
        throw new Judge0Error(response.status, await response.text());
    }

    const result = await response.json();

    return {
        stdout: decode(result.stdout),
        stderr: decode(result.stderr),
        compile_output: decode(result.compile_output),
        status: result.status,
        time: result.time,
        memory: result.memory,
    };
}

// Judge0 status id 3 = Accepted (ran without error)
export const JUDGE0_ACCEPTED = 3;
