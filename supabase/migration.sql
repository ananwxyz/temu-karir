-- ============================================
-- Temu Karir — Database Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  industry TEXT NOT NULL,
  city TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  logo_url TEXT DEFAULT '',
  career_url TEXT NOT NULL,
  hash_signature TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  whatsapp TEXT,
  maps_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'FLAGGED')),
  last_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for search
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies USING gin (to_tsvector('simple', name));
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies (slug);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies (industry);
CREATE INDEX IF NOT EXISTS idx_companies_city ON companies (city);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies (status);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can read)
CREATE POLICY "Public can read companies"
  ON companies FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users can insert/update/delete (admin)
CREATE POLICY "Authenticated users can insert companies"
  ON companies FOR INSERT
  TO authenticated
  WITH CHECK (true);

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

INSERT INTO companies (name, slug, industry, city, description, logo_url, career_url, email, phone, linkedin_url, whatsapp, maps_url, instagram_url, twitter_url, status, last_verified_at) VALUES
('Tokopedia', 'tokopedia', 'E-Commerce', 'Jakarta', 'Platform e-commerce terbesar di Indonesia yang menghubungkan jutaan penjual dan pembeli. Bagian dari GoTo Group.', 'https://logo.clearbit.com/tokopedia.com', 'https://www.tokopedia.com/careers', 'careers@tokopedia.com', NULL, 'https://www.linkedin.com/company/tokopedia', NULL, 'https://maps.app.goo.gl/tokopedia', 'https://www.instagram.com/tokopedia', 'https://twitter.com/tokopedia', 'ACTIVE', NOW() - INTERVAL '1 day'),

('Gojek', 'gojek', 'Technology', 'Jakarta', 'Super app on-demand terkemuka di Asia Tenggara. Menyediakan layanan transportasi, pembayaran, pengiriman makanan, dan logistik.', 'https://logo.clearbit.com/gojek.com', 'https://www.gojek.com/en-id/careers/', NULL, NULL, 'https://www.linkedin.com/company/gojek', NULL, NULL, 'https://www.instagram.com/gojekindonesia', 'https://twitter.com/goabordjek', 'ACTIVE', NOW() - INTERVAL '2 days'),

('Bank Central Asia (BCA)', 'bank-bca', 'Banking & Finance', 'Jakarta', 'Salah satu bank swasta terbesar di Indonesia. Menyediakan layanan perbankan, kartu kredit, dan berbagai produk finansial.', 'https://logo.clearbit.com/bca.co.id', 'https://karir.bca.co.id/', 'halo@bca.co.id', '1500888', 'https://www.linkedin.com/company/pt-bank-central-asia-tbk', NULL, NULL, 'https://www.instagram.com/goodlifebca', NULL, 'ACTIVE', NOW() - INTERVAL '1 day'),

('Shopee Indonesia', 'shopee-indonesia', 'E-Commerce', 'Jakarta', 'Platform e-commerce terkemuka di Asia Tenggara dan Taiwan. Menyediakan pengalaman belanja online yang mudah, aman, dan cepat.', 'https://logo.clearbit.com/shopee.co.id', 'https://careers.shopee.co.id/', NULL, NULL, 'https://www.linkedin.com/company/shopee', NULL, NULL, 'https://www.instagram.com/shopee_id', 'https://twitter.com/ShopeeID', 'ACTIVE', NOW() - INTERVAL '3 days'),

('Telkom Indonesia', 'telkom-indonesia', 'Telekomunikasi', 'Bandung', 'BUMN telekomunikasi terbesar di Indonesia. Menyediakan layanan jaringan, internet (IndiHome), dan solusi digital.', 'https://logo.clearbit.com/telkom.co.id', 'https://rekrutmen.telkom.co.id/', 'recruitment@telkom.co.id', '147', 'https://www.linkedin.com/company/telkom-indonesia', NULL, 'https://maps.app.goo.gl/telkom', 'https://www.instagram.com/telkom_id', NULL, 'ACTIVE', NOW() - INTERVAL '4 days'),

('Unilever Indonesia', 'unilever-indonesia', 'FMCG', 'Tangerang', 'Perusahaan multinasional FMCG terkemuka. Memproduksi produk rumah tangga, makanan, dan perawatan diri dengan merek ternama.', 'https://logo.clearbit.com/unilever.co.id', 'https://careers.unilever.com/location/indonesia/34583/1643084/', NULL, '0800-1558-000', 'https://www.linkedin.com/company/unilever', NULL, NULL, 'https://www.instagram.com/unileverid', NULL, 'ACTIVE', NOW() - INTERVAL '2 days'),

('Astra International', 'astra-international', 'Otomotif', 'Jakarta', 'Konglomerasi bisnis terbesar di Indonesia, bergerak di bidang otomotif, jasa keuangan, alat berat, agribisnis, IT, dan properti.', 'https://logo.clearbit.com/astra.co.id', 'https://career.astra.co.id/', 'recruitment@astra.co.id', NULL, 'https://www.linkedin.com/company/astra-international', NULL, NULL, 'https://www.instagram.com/astra_id', NULL, 'ACTIVE', NOW() - INTERVAL '3 days'),

('Pertamina', 'pertamina', 'Energi & Pertambangan', 'Jakarta', 'BUMN energi terbesar di Indonesia. Bergerak di bidang minyak & gas, energi baru terbarukan, dan petrokimia.', 'https://logo.clearbit.com/pertamina.com', 'https://recruitment.pertamina.com/', NULL, '135', 'https://www.linkedin.com/company/pertamina', NULL, NULL, 'https://www.instagram.com/pertamina', 'https://twitter.com/pertamina', 'ACTIVE', NOW() - INTERVAL '1 day'),

('Bukalapak', 'bukalapak', 'E-Commerce', 'Jakarta', 'Platform e-commerce dan mitra pelapak online Indonesia. Fokus pada pengembangan UMKM dan digitalisasi warung.', 'https://logo.clearbit.com/bukalapak.com', 'https://careers.bukalapak.com/', 'career@bukalapak.com', NULL, 'https://www.linkedin.com/company/bukalapak-com', NULL, NULL, 'https://www.instagram.com/bukalapak', 'https://twitter.com/bukalapak', 'ACTIVE', NOW() - INTERVAL '4 days'),

('Traveloka', 'traveloka', 'Technology', 'Jakarta', 'Platform lifestyle super app terkemuka di Asia Tenggara. Menyediakan layanan booking tiket, hotel, dan aktivitas.', 'https://logo.clearbit.com/traveloka.com', 'https://www.traveloka.com/en-id/careers', NULL, NULL, 'https://www.linkedin.com/company/traveloka', NULL, NULL, 'https://www.instagram.com/traveloka', 'https://twitter.com/Traveloka', 'ACTIVE', NOW() - INTERVAL '2 days'),

('Bank Mandiri', 'bank-mandiri', 'Banking & Finance', 'Jakarta', 'Bank BUMN terbesar di Indonesia berdasarkan aset. Menyediakan layanan perbankan korporasi, komersial, mikro, dan ritel.', 'https://logo.clearbit.com/bankmandiri.co.id', 'https://www.bankmandiri.co.id/mandiri-career', NULL, '14000', 'https://www.linkedin.com/company/bank-mandiri', NULL, NULL, 'https://www.instagram.com/bankmandiri', 'https://twitter.com/bankmandiri', 'ACTIVE', NOW() - INTERVAL '1 day'),

('XL Axiata', 'xl-axiata', 'Telekomunikasi', 'Jakarta', 'Operator telekomunikasi seluler terkemuka di Indonesia. Menyediakan layanan jaringan data, voice, dan solusi digital.', 'https://logo.clearbit.com/xl.co.id', 'https://careers.xl.co.id/', 'recruitment@xl.co.id', '817', 'https://www.linkedin.com/company/xl-axiata', NULL, NULL, 'https://www.instagram.com/myXL', NULL, 'ACTIVE', NOW() - INTERVAL '5 days'),

('Grab Indonesia', 'grab-indonesia', 'Technology', 'Jakarta', 'Super app terkemuka di Asia Tenggara, menawarkan layanan transportasi, pengiriman, dan keuangan digital.', 'https://logo.clearbit.com/grab.com', 'https://grab.careers/', NULL, NULL, 'https://www.linkedin.com/company/grabapp', NULL, NULL, 'https://www.instagram.com/grab_id', 'https://twitter.com/GrabID', 'ACTIVE', NOW() - INTERVAL '2 days'),

('Indofood', 'indofood', 'FMCG', 'Jakarta', 'Perusahaan makanan terbesar di Indonesia, memproduksi mie instan, bumbu, makanan ringan, dan minuman.', 'https://logo.clearbit.com/indofood.com', 'https://career.indofood.com/', 'recruitment@indofood.co.id', NULL, 'https://www.linkedin.com/company/indofood', NULL, NULL, NULL, NULL, 'ACTIVE', NOW() - INTERVAL '3 days'),

('Halodoc', 'halodoc', 'Kesehatan', 'Jakarta', 'Platform teknologi kesehatan terkemuka di Indonesia, menyediakan konsultasi dokter online, pembelian obat, dan lab test.', 'https://logo.clearbit.com/halodoc.com', 'https://www.halodoc.com/careers', 'careers@halodoc.com', NULL, 'https://www.linkedin.com/company/halodoc', NULL, NULL, 'https://www.instagram.com/halodoc', NULL, 'ACTIVE', NOW() - INTERVAL '1 day'),

('J&T Express', 'jnt-express', 'Logistik', 'Jakarta', 'Perusahaan logistik dan ekspedisi terkemuka di Indonesia, menyediakan layanan pengiriman cepat dan terpercaya.', 'https://logo.clearbit.com/jet.co.id', 'https://jet.co.id/career', 'hr@jet.co.id', NULL, 'https://www.linkedin.com/company/j&t-express-indonesia', NULL, NULL, 'https://www.instagram.com/jabordjekssindonesia', NULL, 'ACTIVE', NOW() - INTERVAL '4 days'),

('Kompas Gramedia', 'kompas-gramedia', 'Media & Hiburan', 'Jakarta', 'Grup media terbesar di Indonesia, bergerak di bidang penerbitan, media cetak & digital, perhotelan, dan pendidikan.', 'https://logo.clearbit.com/kompasgramedia.com', 'https://career.kompasgramedia.com/', 'recruitment@kompasgramedia.com', NULL, 'https://www.linkedin.com/company/kompas-gramedia', NULL, NULL, 'https://www.instagram.com/kompasgramedia', NULL, 'ACTIVE', NOW() - INTERVAL '5 days'),

('Ruangguru', 'ruangguru', 'Pendidikan', 'Jakarta', 'Platform edtech terbesar di Indonesia, menyediakan layanan bimbingan belajar online, kursus, dan solusi pendidikan digital.', 'https://logo.clearbit.com/ruangguru.com', 'https://career.ruangguru.com/', 'career@ruangguru.com', NULL, 'https://www.linkedin.com/company/ruangguru', NULL, NULL, 'https://www.instagram.com/ruangguru', 'https://twitter.com/ruangguru_', 'FLAGGED', NOW() - INTERVAL '9 days'),

('Sinar Mas Land', 'sinar-mas-land', 'Properti & Konstruksi', 'Tangerang', 'Pengembang properti terbesar di Indonesia, mengembangkan kawasan hunian, komersial, dan kawasan industri terpadu.', 'https://logo.clearbit.com/sinarmasland.com', 'https://career.sinarmasland.com/', 'recruitment@sinarmasland.com', NULL, 'https://www.linkedin.com/company/sinarmasland', NULL, NULL, 'https://www.instagram.com/sinarmas_land', NULL, 'ACTIVE', NOW() - INTERVAL '2 days'),

('Toyota Astra Motor', 'toyota-astra-motor', 'Otomotif', 'Jakarta', 'Distributor utama kendaraan Toyota di Indonesia, anak perusahaan Astra International dan Toyota Motor Corporation.', 'https://logo.clearbit.com/toyota.astra.co.id', 'https://www.toyota.astra.co.id/corporate-info/career', NULL, NULL, 'https://www.linkedin.com/company/toyota-astra-motor', NULL, NULL, 'https://www.instagram.com/toyotaid', NULL, 'ACTIVE', NOW() - INTERVAL '3 days'),

('Bank Rakyat Indonesia (BRI)', 'bank-bri', 'Banking & Finance', 'Jakarta', 'Bank BUMN terbesar di Indonesia berdasarkan jumlah nasabah. Fokus pada layanan perbankan mikro, kecil, dan menengah.', 'https://logo.clearbit.com/bri.co.id', 'https://e-recruitment.bri.co.id/', NULL, '14017', 'https://www.linkedin.com/company/bank-bri', NULL, NULL, 'https://www.instagram.com/bankbri_id', 'https://twitter.com/KONTAKBRI', 'ACTIVE', NOW() - INTERVAL '1 day'),

('Blibli', 'blibli', 'E-Commerce', 'Jakarta', 'Platform e-commerce omnichannel yang menyediakan produk orisinal dari berbagai kategori dengan jaminan 100% autentik.', 'https://logo.clearbit.com/blibli.com', 'https://careers.blibli.com/', 'career@blibli.com', NULL, 'https://www.linkedin.com/company/bliblidotcom', NULL, NULL, 'https://www.instagram.com/bliblidotcom', NULL, 'ACTIVE', NOW() - INTERVAL '3 days'),

('Tiket.com', 'tiketcom', 'Technology', 'Jakarta', 'Online Travel Agent (OTA) terkemuka di Indonesia, menyediakan pemesanan tiket pesawat, hotel, kereta, dan atraksi.', 'https://logo.clearbit.com/tiket.com', 'https://www.tiket.com/careers', 'careers@tiket.com', NULL, 'https://www.linkedin.com/company/tiketcom', NULL, NULL, 'https://www.instagram.com/tiketcom', NULL, 'FLAGGED', NOW() - INTERVAL '11 days'),

('Indosat Ooredoo Hutchison', 'indosat-ooredoo-hutchison', 'Telekomunikasi', 'Jakarta', 'Perusahaan telekomunikasi digital terkemuka di Indonesia hasil merger Indosat Ooredoo dan Tri Indonesia.', 'https://logo.clearbit.com/ioh.co.id', 'https://ioh.co.id/portal/id/career', NULL, '185', 'https://www.linkedin.com/company/indosat-ooredoo-hutchison/', NULL, NULL, 'https://www.instagram.com/indosatooredoohutchison', NULL, 'ACTIVE', NOW() - INTERVAL '2 days'),

('Kalbe Farma', 'kalbe-farma', 'Kesehatan', 'Jakarta', 'Perusahaan farmasi terbesar di Asia Tenggara, memproduksi obat resep, produk kesehatan, nutrisi, dan distribusi.', 'https://logo.clearbit.com/kalbe.co.id', 'https://career.kalbe.co.id/', 'recruitment@kalbe.co.id', NULL, 'https://www.linkedin.com/company/kalbe-farma', NULL, NULL, NULL, NULL, 'ACTIVE', NOW() - INTERVAL '4 days');
