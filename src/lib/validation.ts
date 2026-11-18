import { z } from "zod";
import { type Industry, INDUSTRIES, OWNERSHIP_TYPES } from "./types";

/**
 * Shared validation schemas for the `/submit` and `/koreksi` forms.
 * Used on the client (both pages) and server-side (create/insert helpers).
 * All error messages are in Indonesian.
 */

// Only allow http/https URLs (blocks javascript:, data:, ftp:, etc.).
function isHttpUrl(value: string): boolean {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
}

// Hostname must contain at least one dot (a real domain).
function hostnameHasDot(value: string): boolean {
    try {
        return new URL(value).hostname.includes(".");
    } catch {
        return false;
    }
}

// Hostname ends with the given domain suffix (after stripping www.).
function endsWithDomain(value: string, suffix: string): boolean {
    try {
        let host = new URL(value).hostname.toLowerCase();
        if (host.startsWith("www.")) host = host.slice(4);
        return host === suffix || host.endsWith(`.${suffix}`);
    } catch {
        return false;
    }
}

// Slug yang terlalu umum (mis. nama perusahaan hanya "PT" atau "Group")
// ditolak supaya tidak lahir URL generik seperti /perusahaan/pt.
const GENERIC_SLUGS = new Set([
    "pt",
    "cv",
    "tbk",
    "persero",
    "group",
    "grup",
    "holding",
    "company",
    "perusahaan",
    "indonesia",
    "corp",
    "ltd",
    "inc",
    "the",
]);

/** Slug dari nama perusahaan (huruf kecil, dipisah tanda hubung). */
export function slugifyName(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

/**
 * Slug layak dipakai sebagai alamat halaman: minimal 3 karakter dan bukan
 * nama generik. Nama pendek yang tetap khas (mis. "BCA") tetap diterima.
 */
export function isAcceptableSlug(slug: string): boolean {
    if (slug.length < 3) return false;
    return !GENERIC_SLUGS.has(slug);
}

const httpUrl = z
    .string()
    .trim()
    .max(500, "URL tidak boleh lebih dari 500 karakter")
    .refine(isHttpUrl, "URL harus menggunakan http:// atau https://")
    .refine(hostnameHasDot, "URL harus menggunakan nama domain yang valid");

export const companySubmissionSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Nama perusahaan minimal 2 karakter")
            .max(120, "Nama perusahaan maksimal 120 karakter"),
        industry: z.enum(INDUSTRIES as unknown as [string, ...string[]], {
            message: "Pilih industri yang valid",
        }),
        ownership: z.enum(OWNERSHIP_TYPES as unknown as [string, ...string[]], {
            message: "Pilih tipe kepemilikan yang valid",
        }),
        career_url: httpUrl,
        email: z
            .union([z.literal(""), z.string().trim().email("Email tidak valid")])
            .optional()
            .default(""),
        linkedin_url: z
            .union([
                z.literal(""),
                httpUrl.refine(
                    (v) => endsWithDomain(v, "linkedin.com"),
                    "LinkedIn URL harus dari linkedin.com"
                ),
            ])
            .optional()
            .default(""),
        instagram_url: z
            .union([
                z.literal(""),
                httpUrl.refine(
                    (v) =>
                        endsWithDomain(v, "instagram.com") ||
                        endsWithDomain(v, "ig.me"),
                    "Instagram URL harus dari instagram.com"
                ),
            ])
            .optional()
            .default(""),
        whatsapp: z
            .union([
                z.literal(""),
                z
                    .string()
                    .trim()
                    .regex(/^62\d{8,13}$/, "WhatsApp harus diawali 62 dan berisi 10–15 digit"),
            ])
            .optional()
            .default(""),
    })
    .refine((data) => isAcceptableSlug(slugifyName(data.name)), {
        message:
            'Nama perusahaan terlalu umum untuk dijadikan alamat halaman — tulis nama perusahaan selengkap mungkin (mis. "PT" atau "Group").',
        path: ["name"],
    });

export type CompanySubmissionInput = z.infer<typeof companySubmissionSchema>;

/** Parse a company submission; returns typed result or throws a readable error. */
export function parseCompanySubmission(input: unknown) {
    return companySubmissionSchema.safeParse(input);
}
