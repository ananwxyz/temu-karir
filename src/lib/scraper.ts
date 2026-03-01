import crypto from "crypto";

interface ScrapeResult {
    success: boolean;
    hash: string | null;
    contacts: {
        emails: string[];
        phones: string[];
        linkedinUrls: string[];
        whatsappNumbers: string[];
    };
    error?: string;
}

/**
 * Scrape a career page: fetch HTML, extract contacts, generate hash.
 * In production, uses Axios + Cheerio. This is a mock for MVP.
 */
export async function scrapeCareerPage(url: string): Promise<ScrapeResult> {
    try {
        // In production:
        // const { data: html } = await axios.get(url, { timeout: 10000 });
        // const $ = cheerio.load(html);

        // Mock: simulate fetching + parsing
        await new Promise((r) => setTimeout(r, 500 + Math.random() * 1500));

        // Simulate occasional failures
        if (Math.random() < 0.1) {
            throw new Error("Connection timeout");
        }

        const mockHtml = `<html><body><h1>Careers at Company</h1></body></html>`;
        const hash = crypto.createHash("md5").update(mockHtml).digest("hex");

        // In production, extract contacts using regex:
        // const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        // const phoneRegex = /(?:\+62|0)[\d\s\-()]{8,15}/g;
        // const linkedinRegex = /https?:\/\/(?:www\.)?linkedin\.com\/company\/[\w-]+/g;
        // const emails = [...new Set(html.match(emailRegex) || [])];

        return {
            success: true,
            hash,
            contacts: {
                emails: [],
                phones: [],
                linkedinUrls: [],
                whatsappNumbers: [],
            },
        };
    } catch (error) {
        return {
            success: false,
            hash: null,
            contacts: { emails: [], phones: [], linkedinUrls: [], whatsappNumbers: [] },
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Compare hashes and determine if update is needed
 */
export function hasChanged(
    oldHash: string | null,
    newHash: string | null
): boolean {
    if (!oldHash || !newHash) return true;
    return oldHash !== newHash;
}
