import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { scrapeCareerPage, hasChanged } from "@/lib/scraper";
import { companies as mockCompanies } from "@/lib/data";
import { Company } from "@/lib/types";

// Vercel Cron: GET /api/cron
export async function GET(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (
        process.env.CRON_SECRET &&
        authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch companies from Supabase, fall back to mock
    let companies: Company[];
    try {
        const { data, error } = await supabase
            .from("companies")
            .select("*")
            .neq("status", "FLAGGED");

        companies = (error || !data || data.length === 0)
            ? mockCompanies.filter((c) => c.status !== "FLAGGED")
            : (data as Company[]);
    } catch {
        companies = mockCompanies.filter((c) => c.status !== "FLAGGED");
    }

    const results: {
        company: string;
        status: string;
        changed: boolean;
        error?: string;
    }[] = [];

    const BATCH_SIZE = 5;
    const DELAY_MS = 2000;

    for (let i = 0; i < companies.length; i += BATCH_SIZE) {
        const batch = companies.slice(i, i + BATCH_SIZE);

        const batchResults = await Promise.allSettled(
            batch.map(async (company) => {
                const result = await scrapeCareerPage(company.career_url);

                if (!result.success) {
                    // Flag the company
                    await supabase
                        .from("companies")
                        .update({ status: "FLAGGED", updated_at: new Date().toISOString() })
                        .eq("id", company.id);

                    return {
                        company: company.name,
                        status: "FLAGGED",
                        changed: false,
                        error: result.error,
                    };
                }

                const changed = hasChanged(company.hash_signature, result.hash);

                if (changed && result.hash) {
                    await supabase
                        .from("companies")
                        .update({
                            hash_signature: result.hash,
                            status: "ACTIVE",
                            last_verified_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        })
                        .eq("id", company.id);
                } else {
                    await supabase
                        .from("companies")
                        .update({
                            last_verified_at: new Date().toISOString(),
                        })
                        .eq("id", company.id);
                }

                return {
                    company: company.name,
                    status: changed ? "UPDATED" : "UNCHANGED",
                    changed,
                };
            })
        );

        results.push(
            ...batchResults.map((r) =>
                r.status === "fulfilled"
                    ? r.value
                    : { company: "unknown", status: "ERROR", changed: false }
            )
        );

        if (i + BATCH_SIZE < companies.length) {
            await new Promise((r) => setTimeout(r, DELAY_MS));
        }
    }

    const summary = {
        total: results.length,
        updated: results.filter((r) => r.status === "UPDATED").length,
        unchanged: results.filter((r) => r.status === "UNCHANGED").length,
        flagged: results.filter((r) => r.status === "FLAGGED").length,
        timestamp: new Date().toISOString(),
    };

    return NextResponse.json({ summary, results });
}
