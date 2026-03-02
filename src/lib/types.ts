export interface Company {
  id: string;
  name: string;
  slug: string;
  industry: Industry;
  ownership: OwnershipType;
  career_url: string;
  hash_signature: string | null;
  email: string | null;
  linkedin_url: string | null;
  whatsapp: string | null;
  instagram_url: string | null;
  status: CompanyStatus;
  last_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export type CompanyStatus = "ACTIVE" | "FLAGGED" | "PENDING";

export type OwnershipType = "Swasta" | "BUMN/D";

export const OWNERSHIP_TYPES: OwnershipType[] = ["Swasta", "BUMN/D"];

export type Industry =
  | "Technology & Digital"
  | "Financial Services"
  | "Insurance"
  | "Investment & Venture Capital"
  | "Legal & Professional Services"
  | "Telecommunications"
  | "Media & Entertainment"
  | "Consumer Goods (FMCG)"
  | "Retail & E-Commerce"
  | "Manufacturing & Industrial"
  | "Energy & Natural Resources"
  | "Agriculture & Agribusiness"
  | "Healthcare & Pharmaceutical"
  | "Transportation & Logistics"
  | "Property & Construction"
  | "Hospitality & Tourism"
  | "Education"
  | "Government & Public Sector"
  | "Non-Profit & International Organization"
  | "Outsourcing";

export const INDUSTRIES: Industry[] = [
  "Technology & Digital",
  "Financial Services",
  "Insurance",
  "Investment & Venture Capital",
  "Legal & Professional Services",
  "Telecommunications",
  "Media & Entertainment",
  "Consumer Goods (FMCG)",
  "Retail & E-Commerce",
  "Manufacturing & Industrial",
  "Energy & Natural Resources",
  "Agriculture & Agribusiness",
  "Healthcare & Pharmaceutical",
  "Transportation & Logistics",
  "Property & Construction",
  "Hospitality & Tourism",
  "Education",
  "Government & Public Sector",
  "Non-Profit & International Organization",
  "Outsourcing",
];
