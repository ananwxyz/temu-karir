import type { MetadataRoute } from "next";
import { getCompanies } from "@/lib/supabase";
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
    ];

    // Dynamic company pages
    let companies: Company[] = await getCompanies();
    if (companies.length === 0) {
        companies = mockCompanies;
    }

    const companyPages: MetadataRoute.Sitemap = companies
        .filter((c: Company) => c.status === "ACTIVE")
        .map((company: Company) => ({
            url: `${baseUrl}/companies/${company.slug}`,
            lastModified: company.updated_at
                ? new Date(company.updated_at)
                : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));

    return [...staticPages, ...companyPages];
}
