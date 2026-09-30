import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Comma-separated list of emails allowed to run admin routes, e.g. ADMIN_EMAILS=a@x.com,b@y.com
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);

// Returns an error response if the current user is not an admin, otherwise null
export async function requireAdmin(): Promise<NextResponse | null> {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();

    if (!email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!ADMIN_EMAILS.includes(email)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return null;
}

// Reads ?courseId= from the request, falling back to the given default
export function getCourseIdParam(req: Request, fallback: number): number {
    const value = new URL(req.url).searchParams.get("courseId");
    return value ? Number(value) : fallback;
}
