import { createClient } from "@supabase/supabase-js";
import { Company } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Query Functions ──────────────────────────────────────

export async function getCompanies(): Promise<Company[]> {
    const { data, error } = await supabase
        .from("companies")
        .select("*")
        .order("name", { ascending: true });

    if (error) {
        console.error("Error fetching companies:", error);
        return [];
    }
    return data as Company[];
}

export async function getCompanyBySlug(
    slug: string
): Promise<Company | null> {
    const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        console.error("Error fetching company:", error);
        return null;
    }
    return data as Company;
}

export async function searchCompanies(
    query?: string,
    industry?: string,
    city?: string
): Promise<Company[]> {
    let q = supabase.from("companies").select("*");

    if (query) {
        q = q.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    }
    if (industry && industry !== "all") {
        q = q.eq("industry", industry);
    }
    if (city && city !== "all") {
        q = q.eq("city", city);
    }

    q = q.order("name", { ascending: true });

    const { data, error } = await q;

    if (error) {
        console.error("Error searching companies:", error);
        return [];
    }
    return data as Company[];
}

export async function getStats() {
    const { data, error } = await supabase.from("companies").select("status, industry, city");

    if (error) {
        console.error("Error fetching stats:", error);
        return { total: 0, active: 0, flagged: 0, industries: 0, cities: 0 };
    }

    const companies = data || [];
    return {
        total: companies.length,
        active: companies.filter((c) => c.status === "ACTIVE").length,
        flagged: companies.filter((c) => c.status === "FLAGGED").length,
        industries: [...new Set(companies.map((c) => c.industry))].length,
        cities: [...new Set(companies.map((c) => c.city))].length,
    };
}

// ─── Mutation Functions (Admin) ───────────────────────────

export async function createCompany(
    company: Omit<Company, "id" | "created_at" | "updated_at">
): Promise<Company | null> {
    // Clean data: remove undefined values, convert empty strings to null
    const cleanData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(company)) {
        if (value === undefined || value === "") {
            cleanData[key] = null;
        } else {
            cleanData[key] = value;
        }
    }
    // Ensure required fields are not null
    cleanData.name = company.name;
    cleanData.slug = company.slug;
    cleanData.industry = company.industry;
    cleanData.city = company.city;
    cleanData.career_url = company.career_url;
    cleanData.description = company.description || "";
    cleanData.status = company.status || "ACTIVE";

    const { data, error } = await supabase
        .from("companies")
        .insert(cleanData)
        .select()
        .single();

    if (error) {
        console.error("Error creating company:", error.message, error.code, error.details, error.hint);
        return null;
    }
    return data as Company;
}

export async function updateCompany(
    id: string,
    updates: Partial<Company>
): Promise<Company | null> {
    const { data, error } = await supabase
        .from("companies")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating company:", error);
        return null;
    }
    return data as Company;
}

export async function deleteCompany(id: string): Promise<boolean> {
    const { error } = await supabase.from("companies").delete().eq("id", id);

    if (error) {
        console.error("Error deleting company:", error);
        return false;
    }
    return true;
}

export async function validateCompany(
    id: string,
    hash: string
): Promise<boolean> {
    const { error } = await supabase
        .from("companies")
        .update({
            status: "ACTIVE",
            hash_signature: hash,
            last_verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        console.error("Error validating company:", error);
        return false;
    }
    return true;
}

export async function flagCompany(id: string): Promise<boolean> {
    const { error } = await supabase
        .from("companies")
        .update({
            status: "FLAGGED",
            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        console.error("Error flagging company:", error);
        return false;
    }
    return true;
}
