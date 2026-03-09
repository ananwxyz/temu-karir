import type { MetadataRoute } from "next";
import { getCompanies } from "@/lib/supabase";
import { companies as mockCompanies } from "@/lib/data";
import { Company } from "@/lib/types";
import { freelanceData as freelances } from "@/lib/freelance-data";
import { FreelancePlatform } from "@/lib/freelance-types";

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
            url: `${baseUrl}/perusahaan/${company.slug}`,
            lastModified: company.updated_at
                ? new Date(company.updated_at)
                : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        }));

    // Dynamic freelance pages
    const freelancePages: MetadataRoute.Sitemap = freelances
        .filter((f: FreelancePlatform) => f.status === "ACTIVE")
        .map((freelance: FreelancePlatform) => ({
            url: `${baseUrl}/freelance/${freelance.slug}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));

    return [...staticPages, ...companyPages, ...freelancePages];
}
