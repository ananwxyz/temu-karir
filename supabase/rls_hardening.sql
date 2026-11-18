-- ============================================
-- Temu Karir — RLS Hardening (Prompt 2 / M-7)
-- Run in Supabase SQL Editor. Review before applying.
-- ============================================

-- NOTE: This file DROPS the old (too permissive) policies and replaces them
-- with least-privilege ones. Running this requires an authenticated role
-- that owns the table (e.g. the `postgres` role in the SQL editor, NOT anon).

-- 0) Tear down the previous overly-permissive policies.
DROP POLICY IF EXISTS "Public can read companies"   ON companies;
DROP POLICY IF EXISTS "Anyone can submit companies" ON companies;
DROP POLICY IF EXISTS "Authenticated users can update companies" ON companies;
DROP POLICY IF EXISTS "Authenticated users can delete companies" ON companies;

-- 1) anon + authenticated (same role via anon key) may SELECT only rows that
--    are displayed publicly. PENDING submissions (may contain emails / WA)
--    are never readable by anon.
CREATE POLICY "Public can read public companies"
  ON companies FOR SELECT
  TO anon, authenticated
  USING (status IN ('ACTIVE', 'FLAGGED'));

-- 2) anon may INSERT a new company ONLY with status 'PENDING'.
--    This powers the /submit and /koreksi forms. No UPDATE/DELETE for anon.
CREATE POLICY "Anyone can submit PENDING companies"
  ON companies FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'PENDING');

-- 3) Only a privileged authenticated role (admin) may read / modify ALL rows,
--    including PENDING. Uses a dedicated admin role.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'temukarir_admin') THEN
    CREATE ROLE temukarir_admin;
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO temukarir_admin;
GRANT ALL ON companies TO temukarir_admin;

CREATE POLICY "Admin can download all companies"
  ON companies FOR SELECT
  TO temukarir_admin
  USING (true);

CREATE POLICY "Admin can update companies"
  ON companies FOR UPDATE
  TO temukarir_admin
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin can delete companies"
  ON companies FOR DELETE
  TO temukarir_admin
  USING (true);

-- ============================================
-- DATA CLEANUP / FLAG DEAD LINKS (Prompt 6, part 2)
-- Set the rows listed in broken-career-links.csv that are still dead to a
-- non-public status so they disappear from the public directory & sitemap.
-- Review before running. Adjust statuses/URLs as needed.
-- ============================================

-- Mark known-dead companies as FLAGGED (hidden from public directory).
-- EXAMPLE (domain does not exist):
UPDATE companies SET status = 'FLAGGED', updated_at = NOW()
WHERE slug IN (
  'agung-podomoro-land',
  'hrp-law',
  'bogasari',
  'chandra-asri',
  'infomedia-solusi-humanika-ish',
  'kds-indonesia',
  'kompas-gramedia',
  'mitra-garindo-perkasa',
  'sofyan-sofian-law-firm',
  'surveyor-indonesia',
  'telkom-infra',
  'xl-axiata'
);