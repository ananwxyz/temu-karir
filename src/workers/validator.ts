/**
 * URL Validator & Re-check Logic
 *
 * - Validates discovered URLs
 * - Manages fail_count
 * - Deactivates after 3 consecutive failures
 */

import { httpGet } from "./lib/httpClient";
import { acquireRateLimit } from "./lib/rateLimiter";
import { supabase } from "@/lib/supabase";

export interface ValidationResult {
    domain: string;
    url: string;
    is_active: boolean;
    status_code: number;
    fail_count: number;
}

/**
 * Validate a single discovered URL
 */
export async function validateUrl(
    domain: string,
    url: string
): Promise<{ ok: boolean; status: number; finalUrl: string }> {
    await acquireRateLimit(domain);
    const response = await httpGet(url);

    return {
        ok: response.ok,
        status: response.status,
        finalUrl: response.url,
    };
}

/**
 * Re-check a discovery record.
 * Updates fail_count and is_active in the database.
 */
export async function recheckDiscovery(record: {
    id: string;
    domain: string;
    discovered_url: string;
    fail_count: number;
}): Promise<ValidationResult> {
    const result = await validateUrl(record.domain, record.discovered_url);

    if (result.ok) {
        // Success: reset fail_count, ensure active
        await supabase
            .from("career_discovery")
            .update({
                fail_count: 0,
                is_active: true,
                status_code: result.status,
                discovered_url: result.finalUrl, // update if redirected
                last_checked: new Date().toISOString(),
            })
            .eq("id", record.id);

        return {
            domain: record.domain,
            url: result.finalUrl,
            is_active: true,
            status_code: result.status,
            fail_count: 0,
        };
    } else {
        // Failure: increment fail_count
        const newFailCount = record.fail_count + 1;
        const isActive = newFailCount < 3;

        await supabase
            .from("career_discovery")
            .update({
                fail_count: newFailCount,
                is_active: isActive,
                status_code: result.status,
                last_checked: new Date().toISOString(),
            })
            .eq("id", record.id);

        console.log(
            `[validator] ${record.domain}: fail_count=${newFailCount}, is_active=${isActive}`
        );

        return {
            domain: record.domain,
            url: record.discovered_url,
            is_active: isActive,
            status_code: result.status,
            fail_count: newFailCount,
        };
    }
}
