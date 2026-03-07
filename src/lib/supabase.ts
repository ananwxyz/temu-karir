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
        .neq("status", "PENDING")
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
    ownership?: string
): Promise<Company[]> {
    let q = supabase.from("companies").select("*").neq("status", "PENDING");

    if (query) {
        q = q.ilike("name", `%${query}%`);
    }
    if (industry && industry !== "all") {
        q = q.eq("industry", industry);
    }
    if (ownership && ownership !== "all") {
        q = q.eq("ownership", ownership);
    }

    q = q.order("name", { ascending: true });

    const { data, error } = await q;

    if (error) {
        console.error("Error searching companies:", error);
        return [];
    }
    return data as Company[];
}

export async function searchCompaniesPaginated(
    query?: string,
    industry?: string,
    ownership?: string,
    page: number = 1,
    pageSize: number = 100
): Promise<{ data: Company[]; count: number }> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Count query
    let countQ = supabase
        .from("companies")
        .select("*", { count: "exact", head: true })
        .neq("status", "PENDING");

    // Data query
    let dataQ = supabase
        .from("companies")
        .select("*")
        .neq("status", "PENDING");

    if (query) {
        countQ = countQ.ilike("name", `%${query}%`);
        dataQ = dataQ.ilike("name", `%${query}%`);
    }
    if (industry && industry !== "all") {
        countQ = countQ.eq("industry", industry);
        dataQ = dataQ.eq("industry", industry);
    }
    if (ownership && ownership !== "all") {
        countQ = countQ.eq("ownership", ownership);
        dataQ = dataQ.eq("ownership", ownership);
    }

    dataQ = dataQ.order("name", { ascending: true }).range(from, to);

    const [countResult, dataResult] = await Promise.all([countQ, dataQ]);

    if (countResult.error) {
        console.error("Error counting companies:", countResult.error);
    }
    if (dataResult.error) {
        console.error("Error fetching companies page:", dataResult.error);
        return { data: [], count: 0 };
    }

    return {
        data: dataResult.data as Company[],
        count: countResult.count ?? 0,
    };
}


export async function getStats() {
    const [totalRes, activeRes, flaggedRes, pendingRes, indRes] = await Promise.all([
        supabase.from("companies").select("*", { count: "exact", head: true }).neq("status", "PENDING"),
        supabase.from("companies").select("*", { count: "exact", head: true }).eq("status", "ACTIVE"),
        supabase.from("companies").select("*", { count: "exact", head: true }).eq("status", "FLAGGED"),
        supabase.from("companies").select("*", { count: "exact", head: true }).eq("status", "PENDING"),
        supabase.from("companies").select("industry") // This might still limit to 1000 distinct industries but it's fine for now as there aren't many
    ]);

    const industriesData = indRes.data || [];

    return {
        total: totalRes.count || 0,
        active: activeRes.count || 0,
        flagged: flaggedRes.count || 0,
        pending: pendingRes.count || 0,
        industries: [...new Set(industriesData.map((c) => c.industry))].length,
    };
}

// ─── Mutation Functions (Admin) ───────────────────────────

export async function createCompany(
    company: Omit<Company, "id" | "created_at" | "updated_at">
): Promise<Company | null> {
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
    cleanData.ownership = company.ownership;
    cleanData.career_url = company.career_url;
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

// ─── User Submission Functions ────────────────────────────

export async function createSubmission(
    company: Omit<Company, "id" | "created_at" | "updated_at" | "status" | "hash_signature" | "last_verified_at">
): Promise<Company | null> {
    const cleanData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(company)) {
        if (value === undefined || value === "") {
            cleanData[key] = null;
        } else {
            cleanData[key] = value;
        }
    }
    cleanData.name = company.name;
    cleanData.slug = company.slug;
    cleanData.industry = company.industry;
    cleanData.ownership = company.ownership;
    cleanData.career_url = company.career_url;
    cleanData.status = "PENDING";
    cleanData.hash_signature = null;
    cleanData.last_verified_at = null;

    const { data, error } = await supabase
        .from("companies")
        .insert(cleanData)
        .select()
        .single();

    if (error) {
        console.error("Error creating submission:", error.message);
        return null;
    }
    return data as Company;
}

export async function getPendingSubmissions(): Promise<Company[]> {
    const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("status", "PENDING")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching pending submissions:", error);
        return [];
    }
    return data as Company[];
}

export async function approveSubmission(id: string): Promise<boolean> {
    const { error } = await supabase
        .from("companies")
        .update({
            status: "ACTIVE",
            updated_at: new Date().toISOString(),
        })
        .eq("id", id);

    if (error) {
        console.error("Error approving submission:", error);
        return false;
    }
    return true;
}
