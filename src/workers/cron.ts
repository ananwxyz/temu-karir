/**
 * Cron Job — Daily re-check of all active career discoveries
 *
 * - Fetches all active records
 * - Re-validates each URL
 * - Updates fail_count / is_active
 * - Processes in batches with concurrency control
 */

import { supabase } from "@/lib/supabase";
import { recheckDiscovery } from "./validator";
import { processConcurrently } from "./lib/rateLimiter";

export interface CronResult {
    total: number;
    checked: number;
    active: number;
    deactivated: number;
    errors: number;
    timestamp: string;
}

/**
 * Run the daily re-check cron job
 */
export async function runRecheck(
    concurrency = 2,
    limit = 5
): Promise<CronResult> {
    console.log(`[cron] Starting re-check (limit=${limit}, concurrency=${concurrency})...`);

    // Fetch records with a discovered URL, processing those checked least recently first
    const { data: records, error } = await supabase
        .from("career_discovery")
        .select("id, domain, discovered_url, fail_count")
        .not("discovered_url", "is", null)
        .order("last_checked", { ascending: true, nullsFirst: true })
        .limit(limit);

    if (error || !records) {
        console.error("[cron] Failed to fetch records:", error);
        return {
            total: 0,
            checked: 0,
            active: 0,
            deactivated: 0,
            errors: 1,
            timestamp: new Date().toISOString(),
        };
    }

    console.log(`[cron] Found ${records.length} records to re-check`);

    let active = 0;
    let deactivated = 0;
    let errors = 0;

    const results = await processConcurrently(
        records,
        async (record) => {
            try {
                const result = await recheckDiscovery(record);
                if (result.is_active) {
                    active++;
                } else {
                    deactivated++;
                }
                return result;
            } catch (err) {
                console.error(`[cron] Error re-checking ${record.domain}:`, err);
                errors++;
                return null;
            }
        },
        concurrency
    );

    const summary: CronResult = {
        total: records.length,
        checked: results.filter((r) => r !== null).length,
        active,
        deactivated,
        errors,
        timestamp: new Date().toISOString(),
    };

    console.log("[cron] Re-check complete:", summary);
    return summary;
}
