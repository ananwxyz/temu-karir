import { NextResponse } from "next/server";
import { companies, searchCompanies } from "@/lib/data";

// GET /api/companies — List and search companies
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const industry = searchParams.get("industry") || undefined;
    const city = searchParams.get("city") || undefined;

    const results = searchCompanies(query, industry, city);

    return NextResponse.json({
        data: results,
        total: results.length,
    });
}

// POST /api/companies — Add a company (Admin)
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // In production: insert into Supabase
        // const { data, error } = await supabase.from('companies').insert(body);

        return NextResponse.json(
            { message: "Company created successfully", data: body },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { error: "Failed to create company" },
            { status: 500 }
        );
    }
}
