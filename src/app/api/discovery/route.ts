/**
 * POST /api/discovery
 *
 * Single: { domain: "company.com" }
 * Batch:  { domains: ["a.com", "b.com"] }
 */

import { NextRequest, NextResponse } from "next/server";
import { discoverCareerPage, DiscoveryResult } from "@/workers/discovery";
import { processConcurrently } from "@/workers/lib/rateLimiter";
import { runRecheck } from "@/workers/cron";
import { supabase } from "@/lib/supabase";

export const maxDuration = 300; // Allow up to 5 minutes for batch processing

async function saveResult(result: DiscoveryResult) {
    const { error } = await supabase.from("career_discovery").upsert(
        {
            domain: result.domain,
            discovered_url: result.discovered_url,
            method: result.method,
            status_code: result.status_code,
            is_active: result.is_active,
            fail_count: result.is_active ? 0 : 1,
            last_checked: new Date().toISOString(),
        },
        { onConflict: "domain" }
    );

    if (error) {
        console.error(`[api] Failed to save ${result.domain}:`, error.message);
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Re-check mode
        if (body.action === "recheck") {
            const concurrency = body.concurrency || 2;
            const limit = body.limit || 5;
            const result = await runRecheck(concurrency, limit);
            return NextResponse.json({ success: true, result });
        }

        // Single domain
        if (body.domain && typeof body.domain === "string") {
            const result = await discoverCareerPage(body.domain);
            await saveResult(result);

            return NextResponse.json({
                success: true,
                result,
            });
        }

        // Batch domains
        if (body.domains && Array.isArray(body.domains)) {
            const domains: string[] = body.domains.slice(0, 20); // Reduced to 20 for Free Plan
            const concurrency = body.concurrency || 2;

            const results = await processConcurrently(
                domains,
                async (domain: string) => {
                    try {
                        const result = await discoverCareerPage(domain);
                        await saveResult(result);
                        return result;
                    } catch (err) {
                        console.error(`[api] Error processing ${domain}:`, err);
                        return {
                            domain,
                            discovered_url: null,
                            method: null,
                            status_code: null,
                            is_active: false,
                            error: (err as Error).message,
                        } as DiscoveryResult;
                    }
                },
                concurrency
            );

            const summary = {
                total: results.length,
                found: results.filter((r) => r.discovered_url).length,
                not_found: results.filter((r) => !r.discovered_url).length,
            };

            return NextResponse.json({
                success: true,
                summary,
                results,
            });
        }

        return NextResponse.json(
            { success: false, error: "Provide 'domain' (string) or 'domains' (array)" },
            { status: 400 }
        );
    } catch (err) {
        console.error("[api/discovery] Error:", err);
        return NextResponse.json(
            { success: false, error: (err as Error).message },
            { status: 500 }
        );
    }
}

// GET — List all discoveries
export async function GET() {
    const { data, error } = await supabase
        .from("career_discovery")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }

    return NextResponse.json({
        success: true,
        count: data?.length || 0,
        data,
    });
}
