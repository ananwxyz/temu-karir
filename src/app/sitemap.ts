import type { MetadataRoute } from "next";
import { getAllCompaniesPaginated } from "@/lib/supabase";
import { companies as mockCompanies } from "@/lib/data";
import { Company } from "@/lib/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://temukarir.com";

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/submit`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/correction`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    // Dynamic company pages (all ACTIVE + FLAGGED, paginated to avoid 1000-row limit)
    let companies: Company[] = [];
    try {
        companies = await getAllCompaniesPaginated();
    } catch {
        companies = [];
    }
    if (companies.length === 0) {
        companies = mockCompanies.filter((c) => c.status !== "PENDING");
    }

    const companyPages: MetadataRoute.Sitemap = companies.map((company: Company) => ({
        url: `${baseUrl}/company/${company.slug}`,
        lastModified: company.updated_at
            ? new Date(company.updated_at)
            : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    return [...staticPages, ...companyPages];
}
