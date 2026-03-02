/**
 * Career Discovery Engine
 *
 * 3-step algorithm:
 * 1. Path Scan — try common career paths
 * 2. Subdomain Scan — try career subdomains
 * 3. Homepage Extraction — parse homepage for career links
 */

import { httpGet, checkDns } from "./lib/httpClient";
import { acquireRateLimit } from "./lib/rateLimiter";
import { extractCareerLinks, normalizeDomain } from "./lib/parser";

export interface DiscoveryResult {
    domain: string;
    discovered_url: string | null;
    method: string | null;
    status_code: number | null;
    is_active: boolean;
    error?: string;
}

// Common career page paths
const CAREER_PATHS = [
    "/karir",
    "/career",
    "/careers",
    "/jobs",
    "/recruitment",
    "/hiring",
    "/talent",
    "/lowongan",
    "/join-us",
    "/work-with-us",
    "/en/careers",
    "/en-id/careers",
    "/id/career",
    "/id/karir",
    "/corporate-info/career",
    "/about/career",
    "/about/careers",
    "/bergabung",
    "/mandiri-career",
];

// Common career subdomains
const CAREER_SUBDOMAINS = [
    "karir",
    "career",
    "careers",
    "jobs",
    "recruitment",
];

const MAX_RETRIES = 2;

/**
 * Discover career page for a single domain
 */
export async function discoverCareerPage(
    rawDomain: string
): Promise<DiscoveryResult> {
    const domain = normalizeDomain(rawDomain);
    const baseUrl = `https://${domain}`;

    console.log(`[discovery] Starting: ${domain}`);

    // Step 1: Path Scan
    const pathResult = await pathScan(domain, baseUrl);
    if (pathResult) {
        console.log(`[discovery] ✅ ${domain} → ${pathResult.url} (path_scan)`);
        return {
            domain,
            discovered_url: pathResult.url,
            method: "path_scan",
            status_code: pathResult.status,
            is_active: true,
        };
    }

    // Step 2: Subdomain Scan
    const subdomainResult = await subdomainScan(domain);
    if (subdomainResult) {
        console.log(
            `[discovery] ✅ ${domain} → ${subdomainResult.url} (subdomain_scan)`
        );
        return {
            domain,
            discovered_url: subdomainResult.url,
            method: "subdomain_scan",
            status_code: subdomainResult.status,
            is_active: true,
        };
    }

    // Step 3: Homepage Extraction
    const homepageResult = await homepageExtraction(domain, baseUrl);
    if (homepageResult) {
        console.log(
            `[discovery] ✅ ${domain} → ${homepageResult.url} (homepage_extraction)`
        );
        return {
            domain,
            discovered_url: homepageResult.url,
            method: "homepage_extraction",
            status_code: homepageResult.status,
            is_active: true,
        };
    }

    console.log(`[discovery] ❌ ${domain} → no career page found`);
    return {
        domain,
        discovered_url: null,
        method: null,
        status_code: null,
        is_active: false,
        error: "No career page found",
    };
}

// ─── Step 1: Path Scan ───────────────────────────────────────

async function pathScan(
    domain: string,
    baseUrl: string
): Promise<{ url: string; status: number } | null> {
    for (const path of CAREER_PATHS) {
        const url = `${baseUrl}${path}`;

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                await acquireRateLimit(domain);
                const response = await httpGet(url);

                if (response.ok) {
                    return { url: response.url, status: response.status };
                }
                break; // Don't retry if we got a response (4xx/5xx)
            } catch {
                if (attempt === MAX_RETRIES) break;
                await new Promise((r) => setTimeout(r, 1000));
            }
        }
    }
    return null;
}

// ─── Step 2: Subdomain Scan ──────────────────────────────────

async function subdomainScan(
    domain: string
): Promise<{ url: string; status: number } | null> {
    for (const sub of CAREER_SUBDOMAINS) {
        const hostname = `${sub}.${domain}`;

        try {
            await acquireRateLimit(domain);
            const dnsOk = await checkDns(hostname);
            if (!dnsOk) continue;

            const url = `https://${hostname}`;
            const response = await httpGet(url);

            if (response.ok) {
                return { url: response.url, status: response.status };
            }
        } catch {
            continue;
        }
    }
    return null;
}

// ─── Step 3: Homepage Extraction ─────────────────────────────

async function homepageExtraction(
    domain: string,
    baseUrl: string
): Promise<{ url: string; status: number } | null> {
    try {
        await acquireRateLimit(domain);
        const response = await httpGet(baseUrl);

        if (!response.ok || !response.html) return null;

        const links = extractCareerLinks(response.html, baseUrl);

        if (links.length === 0) return null;

        // Validate the first career link found
        const firstLink = links[0];
        await acquireRateLimit(domain);
        const validation = await httpGet(firstLink.href);

        if (validation.ok) {
            return { url: validation.url, status: validation.status };
        }

        // Try remaining links
        for (const link of links.slice(1, 3)) {
            await acquireRateLimit(domain);
            const check = await httpGet(link.href);
            if (check.ok) {
                return { url: check.url, status: check.status };
            }
        }
    } catch {
        return null;
    }
    return null;
}
