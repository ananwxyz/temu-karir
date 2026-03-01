export interface Company {
  id: string;
  name: string;
  slug: string;
  industry: Industry;
  city: string;
  description: string;
  career_url: string;
  hash_signature: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  whatsapp: string | null;
  maps_url: string | null;
  instagram_url: string | null;
  status: CompanyStatus;
  last_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export type CompanyStatus = "ACTIVE" | "FLAGGED";

export type Industry =
  | "Outsourcing"
  | "Technology"
  | "Banking & Finance"
  | "E-Commerce"
  | "Telekomunikasi"
  | "FMCG"
  | "Otomotif"
  | "Energi & Pertambangan"
  | "Kesehatan"
  | "Logistik"
  | "Media & Hiburan"
  | "Pendidikan"
  | "Properti & Konstruksi"
  | "Pemerintahan"
  | "Lainnya";

export const INDUSTRIES: Industry[] = [
  "Outsourcing",
  "Technology",
  "Banking & Finance",
  "E-Commerce",
  "Telekomunikasi",
  "FMCG",
  "Otomotif",
  "Energi & Pertambangan",
  "Kesehatan",
  "Logistik",
  "Media & Hiburan",
  "Pendidikan",
  "Properti & Konstruksi",
  "Pemerintahan",
  "Lainnya",
];

export const CITIES: string[] = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Medan",
  "Semarang",
  "Makassar",
  "Bali",
  "Tangerang",
  "Bekasi",
  "Bogor",
  "Malang",
];
