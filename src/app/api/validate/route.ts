import { NextResponse } from "next/server";
import { scrapeCareerPage } from "@/lib/scraper";

// POST /api/validate — Manually validate a company's career page
export async function POST(request: Request) {
    try {
        const { career_url, company_id } = await request.json();

        if (!career_url) {
            return NextResponse.json(
                { error: "career_url is required" },
                { status: 400 }
            );
        }

        const result = await scrapeCareerPage(career_url);

        if (result.success) {
            // In production: update Supabase record
            // await supabase.from('companies').update({
            //   hash_signature: result.hash,
            //   status: 'ACTIVE',
            //   last_verified_at: new Date().toISOString(),
            // }).eq('id', company_id);

            return NextResponse.json({
                success: true,
                hash: result.hash,
                contacts: result.contacts,
                message: "Validation successful",
            });
        } else {
            // In production: mark as flagged
            // await supabase.from('companies').update({
            //   status: 'FLAGGED',
            // }).eq('id', company_id);

            return NextResponse.json({
                success: false,
                error: result.error,
                message: "Validation failed — company flagged",
            });
        }
    } catch {
        return NextResponse.json(
            { error: "Validation request failed" },
            { status: 500 }
        );
    }
}
