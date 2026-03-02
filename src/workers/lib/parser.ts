/**
 * HTML parser for career link extraction
 * Uses cheerio to parse and extract career-related links
 */

import * as cheerio from "cheerio";

const CAREER_KEYWORDS = [
    "karir",
    "career",
    "careers",
    "jobs",
    "recruit",
    "recruitment",
    "hiring",
    "lowongan",
    "bergabung",
    "join",
    "talent",
    "work-with-us",
    "work_with_us",
];

export interface ExtractedLink {
    href: string;
    text: string;
}

/**
 * Extract career-related links from HTML
 */
export function extractCareerLinks(html: string, baseUrl: string): ExtractedLink[] {
    const $ = cheerio.load(html);
    const links: ExtractedLink[] = [];
    const seen = new Set<string>();

    $("a[href]").each((_, el) => {
        const href = $(el).attr("href");
        const text = $(el).text().trim().toLowerCase();

        if (!href) return;

        // Resolve relative URLs
        let fullUrl: string;
        try {
            fullUrl = new URL(href, baseUrl).href;
        } catch {
            return;
        }

        // Skip non-http links, anchors, mailto, tel, javascript
        if (
            !fullUrl.startsWith("http") ||
            fullUrl.includes("mailto:") ||
            fullUrl.includes("tel:") ||
            fullUrl.includes("javascript:")
        ) {
            return;
        }

        // Skip if already seen
        if (seen.has(fullUrl)) return;

        // Check if URL path or link text contains career keywords
        const urlLower = fullUrl.toLowerCase();
        const isCareerLink = CAREER_KEYWORDS.some(
            (keyword) => urlLower.includes(keyword) || text.includes(keyword)
        );

        if (isCareerLink) {
            seen.add(fullUrl);
            links.push({ href: fullUrl, text });
        }
    });

    return links;
}

/**
 * Normalize a domain string
 * - Remove protocol, www, trailing slash, path
 */
export function normalizeDomain(input: string): string {
    let domain = input.trim().toLowerCase();

    // Remove protocol
    domain = domain.replace(/^https?:\/\//, "");

    // Remove www
    domain = domain.replace(/^www\./, "");

    // Remove path and trailing slash
    domain = domain.split("/")[0];

    // Remove port
    domain = domain.split(":")[0];

    return domain;
}
