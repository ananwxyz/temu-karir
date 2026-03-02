-- ============================================
-- Temu Karir — Database Migration v2
-- Run this in Supabase SQL Editor
-- ============================================

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  industry TEXT NOT NULL,
  ownership TEXT NOT NULL DEFAULT 'Swasta' CHECK (ownership IN ('Swasta', 'BUMN/D')),
  career_url TEXT NOT NULL,
  hash_signature TEXT,
  email TEXT,
  linkedin_url TEXT,
  whatsapp TEXT,
  instagram_url TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'FLAGGED', 'PENDING')),
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies USING gin (to_tsvector('simple', name));
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies (slug);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies (industry);
CREATE INDEX IF NOT EXISTS idx_companies_ownership ON companies (ownership);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies (status);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can read)
CREATE POLICY "Public can read companies"
  ON companies FOR SELECT
  TO anon, authenticated
  USING (true);

-- Anyone can insert (for user submissions with PENDING status)
CREATE POLICY "Anyone can submit companies"
  ON companies FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated users can update/delete (admin)
CREATE POLICY "Authenticated users can update companies"
  ON companies FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete companies"
  ON companies FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- Seed Data — 25 Indonesian Companies
-- ============================================

INSERT INTO companies (name, slug, industry, ownership, career_url, email, linkedin_url, whatsapp, instagram_url, status, last_verified_at) VALUES
('Tokopedia', 'tokopedia', 'Retail & E-Commerce', 'Swasta', 'https://www.tokopedia.com/careers', 'careers@tokopedia.com', 'https://www.linkedin.com/company/tokopedia', NULL, 'https://www.instagram.com/tokopedia', 'ACTIVE', NOW() - INTERVAL '1 day'),
('Gojek', 'gojek', 'Technology & Digital', 'Swasta', 'https://www.gojek.com/en-id/careers/', NULL, 'https://www.linkedin.com/company/gojek', NULL, 'https://www.instagram.com/gojekindonesia', 'ACTIVE', NOW() - INTERVAL '2 days'),
('Bank Central Asia (BCA)', 'bank-bca', 'Financial Services', 'Swasta', 'https://karir.bca.co.id/', 'halo@bca.co.id', 'https://www.linkedin.com/company/pt-bank-central-asia-tbk', NULL, 'https://www.instagram.com/goodlifebca', 'ACTIVE', NOW() - INTERVAL '1 day'),
('Shopee Indonesia', 'shopee-indonesia', 'Retail & E-Commerce', 'Swasta', 'https://careers.shopee.co.id/', NULL, 'https://www.linkedin.com/company/shopee', NULL, 'https://www.instagram.com/shopee_id', 'ACTIVE', NOW() - INTERVAL '3 days'),
('Telkom Indonesia', 'telkom-indonesia', 'Telecommunications', 'BUMN/D', 'https://rekrutmen.telkom.co.id/', 'recruitment@telkom.co.id', 'https://www.linkedin.com/company/telkom-indonesia', NULL, 'https://www.instagram.com/telkom_id', 'ACTIVE', NOW() - INTERVAL '4 days'),
('Unilever Indonesia', 'unilever-indonesia', 'Consumer Goods (FMCG)', 'Swasta', 'https://careers.unilever.com/location/indonesia/34583/1643084/', NULL, 'https://www.linkedin.com/company/unilever', NULL, 'https://www.instagram.com/unileverid', 'ACTIVE', NOW() - INTERVAL '2 days'),
('Astra International', 'astra-international', 'Manufacturing & Industrial', 'Swasta', 'https://career.astra.co.id/', 'recruitment@astra.co.id', 'https://www.linkedin.com/company/astra-international', NULL, 'https://www.instagram.com/astra_id', 'ACTIVE', NOW() - INTERVAL '3 days'),
('Pertamina', 'pertamina', 'Energy & Natural Resources', 'BUMN/D', 'https://recruitment.pertamina.com/', NULL, 'https://www.linkedin.com/company/pertamina', NULL, 'https://www.instagram.com/pertamina', 'ACTIVE', NOW() - INTERVAL '1 day'),
('Bukalapak', 'bukalapak', 'Retail & E-Commerce', 'Swasta', 'https://careers.bukalapak.com/', 'career@bukalapak.com', 'https://www.linkedin.com/company/bukalapak-com', NULL, 'https://www.instagram.com/bukalapak', 'ACTIVE', NOW() - INTERVAL '4 days'),
('Traveloka', 'traveloka', 'Technology & Digital', 'Swasta', 'https://www.traveloka.com/en-id/careers', NULL, 'https://www.linkedin.com/company/traveloka', NULL, 'https://www.instagram.com/traveloka', 'ACTIVE', NOW() - INTERVAL '2 days'),
('Bank Mandiri', 'bank-mandiri', 'Financial Services', 'BUMN/D', 'https://www.bankmandiri.co.id/mandiri-career', NULL, 'https://www.linkedin.com/company/bank-mandiri', NULL, 'https://www.instagram.com/bankmandiri', 'ACTIVE', NOW() - INTERVAL '1 day'),
('XL Axiata', 'xl-axiata', 'Telecommunications', 'Swasta', 'https://careers.xl.co.id/', 'recruitment@xl.co.id', 'https://www.linkedin.com/company/xl-axiata', NULL, 'https://www.instagram.com/myXL', 'ACTIVE', NOW() - INTERVAL '5 days'),
('Grab Indonesia', 'grab-indonesia', 'Technology & Digital', 'Swasta', 'https://grab.careers/', NULL, 'https://www.linkedin.com/company/grabapp', NULL, 'https://www.instagram.com/grab_id', 'ACTIVE', NOW() - INTERVAL '2 days'),
('Indofood', 'indofood', 'Consumer Goods (FMCG)', 'Swasta', 'https://career.indofood.com/', 'recruitment@indofood.co.id', 'https://www.linkedin.com/company/indofood', NULL, NULL, 'ACTIVE', NOW() - INTERVAL '3 days'),
('Halodoc', 'halodoc', 'Healthcare & Pharmaceutical', 'Swasta', 'https://www.halodoc.com/careers', 'careers@halodoc.com', 'https://www.linkedin.com/company/halodoc', NULL, 'https://www.instagram.com/halodoc', 'ACTIVE', NOW() - INTERVAL '1 day'),
('J&T Express', 'jnt-express', 'Transportation & Logistics', 'Swasta', 'https://jet.co.id/career', 'hr@jet.co.id', 'https://www.linkedin.com/company/j&t-express-indonesia', NULL, 'https://www.instagram.com/jntexpressindonesia', 'ACTIVE', NOW() - INTERVAL '4 days'),
('Kompas Gramedia', 'kompas-gramedia', 'Media & Entertainment', 'Swasta', 'https://career.kompasgramedia.com/', 'recruitment@kompasgramedia.com', 'https://www.linkedin.com/company/kompas-gramedia', NULL, 'https://www.instagram.com/kompasgramedia', 'ACTIVE', NOW() - INTERVAL '5 days'),
('Ruangguru', 'ruangguru', 'Education', 'Swasta', 'https://career.ruangguru.com/', 'career@ruangguru.com', 'https://www.linkedin.com/company/ruangguru', NULL, 'https://www.instagram.com/ruangguru', 'FLAGGED', NOW() - INTERVAL '9 days'),
('Sinar Mas Land', 'sinar-mas-land', 'Property & Construction', 'Swasta', 'https://career.sinarmasland.com/', 'recruitment@sinarmasland.com', 'https://www.linkedin.com/company/sinarmasland', NULL, 'https://www.instagram.com/sinarmas_land', 'ACTIVE', NOW() - INTERVAL '2 days'),
('Toyota Astra Motor', 'toyota-astra-motor', 'Manufacturing & Industrial', 'Swasta', 'https://www.toyota.astra.co.id/corporate-info/career', NULL, 'https://www.linkedin.com/company/toyota-astra-motor', NULL, 'https://www.instagram.com/toyotaid', 'ACTIVE', NOW() - INTERVAL '3 days'),
('Bank Rakyat Indonesia (BRI)', 'bank-bri', 'Financial Services', 'BUMN/D', 'https://e-recruitment.bri.co.id/', NULL, 'https://www.linkedin.com/company/bank-bri', NULL, 'https://www.instagram.com/bankbri_id', 'ACTIVE', NOW() - INTERVAL '1 day'),
('Blibli', 'blibli', 'Retail & E-Commerce', 'Swasta', 'https://careers.blibli.com/', 'career@blibli.com', 'https://www.linkedin.com/company/bliblidotcom', NULL, 'https://www.instagram.com/bliblidotcom', 'ACTIVE', NOW() - INTERVAL '3 days'),
('Tiket.com', 'tiketcom', 'Technology & Digital', 'Swasta', 'https://www.tiket.com/careers', 'careers@tiket.com', 'https://www.linkedin.com/company/tiketcom', NULL, 'https://www.instagram.com/tiketcom', 'FLAGGED', NOW() - INTERVAL '11 days'),
('Indosat Ooredoo Hutchison', 'indosat-ooredoo-hutchison', 'Telecommunications', 'Swasta', 'https://ioh.co.id/portal/id/career', NULL, 'https://www.linkedin.com/company/indosat-ooredoo-hutchison/', NULL, 'https://www.instagram.com/indosatooredoohutchison', 'ACTIVE', NOW() - INTERVAL '2 days'),
('Kalbe Farma', 'kalbe-farma', 'Healthcare & Pharmaceutical', 'Swasta', 'https://career.kalbe.co.id/', 'recruitment@kalbe.co.id', 'https://www.linkedin.com/company/kalbe-farma', NULL, NULL, 'ACTIVE', NOW() - INTERVAL '4 days');
