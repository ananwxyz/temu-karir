#!/usr/bin/env node
/**
 * Weekly link-checker for ALL companies in Supabase.
 *
 * Fetches every non-PENDING company (paged) and checks each `career_url` with a
 * browser-like User-Agent. Marks clearly-dead rows (DNS_FAIL, HTTP_4xx/5xx,
 * timeout/refused) as FLAGGED so they disappear from the public directory and
 * the sitemap. 403/429 (bot-protected) are NOT treated as dead.
 *
 * Env:
 *   SUPABASE_URL        e.g. https://xyz.supabase.co
 *   SUPABASE_SERVICE_KEY (service role, server-only — NOT the anon key)
 *
 * Run: node scripts/weekly-link-check.mjs
 * This script WRITES to the database; run it in CI / cron only.
 */
import axios from "axios";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const headers = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  "Content-Type": "application/json",
};

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36";

const PAGE_SIZE = 1000;
const CONCURRENCY = 8;
const TIMEOUT_MS = 20_000;

async function fetchAllCompanies() {
  const all = [];
  let from = 0;
  for (;;) {
    const { data, error } = await axios
      .get(
        `${SUPABASE_URL}/rest/v1/companies?select=id,slug,name,career_url,status` +
          `&status=neq.PENDING&order=name.asc` +
          `&offset=${from}&limit=${PAGE_SIZE}`,
        { headers }
      )
      .then((r) => ({ data: r.data, error: null }))
      .catch((e) => ({ data: null, error: e }));
    if (error) throw error;
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }
  return all;
}

async function checkUrl(original) {
  let url = original.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    const res = await axios.get(url, {
      timeout: TIMEOUT_MS,
      maxRedirects: 5,
      validateStatus: () => true,
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,*/*" },
    });
    const s = res.status;
    if (s === 403 || s === 429) return "OK"; // bot-protected, not dead
    if (s >= 200 && s < 400) return "OK";
    return `FAIL_${s}`;
  } catch (err) {
    const code = err?.code;
    const map = {
      ENOTFOUND: "FAIL_DNS",
      ETIMEDOUT: "FAIL_TIMEOUT",
      ECONNREFUSED: "FAIL_REFUSED",
      ECONNRESET: "FAIL_RESET",
      ERR_CERT_AUTHORITY_INVALID: "FAIL_TLS",
    };
    return map[code] || "FAIL_UNKNOWN";
  }
}

async function main() {
  const companies = await fetchAllCompanies();
  console.log(`Loaded ${companies.length} companies.`);

  const toFlag = [];
  let index = 0;
  async function worker() {
    while (index < companies.length) {
      const i = index++;
      const c = companies[i];
      const status = await checkUrl(c.career_url);
      process.stdout.write(`[${i + 1}/${companies.length}] ${status.padEnd(12)} ${c.career_url}\n`);
      if (status.startsWith("FAIL")) toFlag.push({ id: c.id, status });
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  console.log(`\n${toFlag.length} links failed.`);
  if (toFlag.length === 0) return;

  // Flag dead links (do NOT delete data).
  for (const f of toFlag) {
    await axios
      .patch(
        `${SUPABASE_URL}/rest/v1/companies?id=eq.${f.id}`,
        { status: "FLAGGED", updated_at: new Date().toISOString() },
        { headers: { ...headers, Prefer: "return=minimal" } }
      )
      .catch((e) => console.error(`Failed to flag ${f.id}:`, e?.message));
    console.log(`Flagged ${f.id} (${f.status})`);
  }

  console.log("\nDone. Dead links flagged as FLAGGED — review in admin before any further action.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});