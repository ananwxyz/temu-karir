import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Server-side env vars (not exposed to browser)
        const adminEmail =
            process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        const adminPassword =
            process.env.ADMIN_PASSWORD ||
            process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.error(
                "Admin credentials not configured in environment variables"
            );
            return new Response(
                JSON.stringify({ success: false, message: "Server configuration error" }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (email === adminEmail && password === adminPassword) {
            return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
        } else {
            return new Response(
                JSON.stringify({ success: false, message: "Email atau password salah" }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }
    } catch (error) {
        console.error("Login Error Catch Block:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Invalid request", error: String(error) }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
