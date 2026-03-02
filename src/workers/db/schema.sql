-- Career Discovery Table
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS career_discovery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL,
  discovered_url TEXT,
  method TEXT,
  status_code INT,
  is_active BOOLEAN DEFAULT true,
  fail_count INT DEFAULT 0,
  last_checked TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_career_discovery_domain ON career_discovery (domain);
CREATE INDEX IF NOT EXISTS idx_career_discovery_active ON career_discovery (is_active);

-- RLS
ALTER TABLE career_discovery ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public can read career_discovery"
  ON career_discovery FOR SELECT TO anon, authenticated USING (true);

-- Anon CRUD (for MVP)
CREATE POLICY "Anon can insert career_discovery"
  ON career_discovery FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anon can update career_discovery"
  ON career_discovery FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- Disable RLS for now (simpler for MVP)
ALTER TABLE career_discovery DISABLE ROW LEVEL SECURITY;
