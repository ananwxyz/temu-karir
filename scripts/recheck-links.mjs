#!/usr/bin/env node
/**
 * Recheck dead/broken career links.
 *
 * Reads `broken-career-links.csv` (columns: temukarir_page, career_url, problem)
 * and re-checks every URL with a browser-like User-Agent, 20s timeout and
 * redirect following. Outputs a new CSV `recheck-<timestamp>.csv` with an extra
 * `recheck_status` column:
 *   - OK          -> reachable (2xx)
 *   - MOVED       -> redirect / 3xx
 *   - HTTP_4xx    -> 404/410 etc.
 *   - HTTP_5xx    -> 500 etc.
 *   - BOT_BLOCKED -> 403/429 (blocked by bot protection, NOT considered dead)
 *   - ERROR       -> network/DNS/timeout/connection refused
 *
 * Run:  node scripts/recheck-links.mjs [input.csv] [output.csv]
 *       (defaults shown below)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import axios from "axios";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INPUT =
  process.argv[2] || path.join(__dirname, "broken-career-links.csv");
const OUTPUT =
  process.argv[3] ||
  path.join(__dirname, `recheck-${new Date().toISOString().replace(/[:.]/g, "-")}.csv`);

const CONCURRENCY = 8;
const TIMEOUT_MS = 20_000;

// Parse CSV (simple RFC-4180-ish; no quoted commas expected in our data).
function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const header = lines[0].split(",").map((c) => c.trim());
  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    const row = {};
    header.forEach((h, i) => (row[h] = cols[i] ?? ""));
    return row;
  });
}

function toCsv(rows) {
  const header = Object.keys(rows[0] || {});
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  return [header.join(","), ...rows.map((r) => header.map((h) => esc(r[h])).join(","))].join("\n");
}

async function checkUrl(original) {
  // Normalise http -> https for a first try (many sites only serve https).
  let url = original.trim();
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  const candidates = [url];
  if (url.startsWith("http://")) {
    candidates.push(url.replace(/^http:\/\//i, "https://"));
  }

  for (const candidate of candidates) {
    try {
      const res = await axios.get(candidate, {
        timeout: TIMEOUT_MS,
        maxRedirects: 5,
        validateStatus: () => true, // capture any status
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
        },
      });
      const status = res.status;
      if (status >= 200 && status < 300) return { url: candidate, status: "OK" };
      if (status >= 300 && status < 400) return { url: candidate, status: "MOVED" };
      if (status === 403 || status === 429) return { url: candidate, status: "BOT_BLOCKED" };
      if (status >= 400 && status < 500) return { url: candidate, status: "HTTP_4xx" };
      if (status >= 500) return { url: candidate, status: "HTTP_5xx" };
      return { url: candidate, status: `HTTP_${status}` };
    } catch (err) {
      // Only try the https twin if this attempt failed and it was http.
      const failedCandidates = candidates.indexOf(candidate);
      const canRetry =
        candidate.startsWith("http://") &&
        candidates.length > 1 &&
        failedCandidates < candidates.length - 1;
      if (canRetry) continue;
      const code = err?.code || "ERROR";
      const statusMap = {
        ENOTFOUND: "DNS_FAIL",
        ETIMEDOUT: "TIMEOUT",
        ECONNREFUSED: "CONN_REFUSED",
        ECONNRESET: "CONN_RESET",
        ERR_CERT_AUTHORITY_INVALID: "TLS_ERROR",
      };
      return { url: candidate, status: statusMap[code] || "ERROR" };
    }
  }
  return { url: original, status: "ERROR" };
}

async function main() {
  const rows = parseCsv(fs.readFileSync(INPUT, "utf8"));
  console.log(`Rechecking ${rows.length} links...`);

  const enriched = [];
  let index = 0;
  async function worker() {
    while (index < rows.length) {
      const i = index++;
      const row = rows[i];
      const { status, url } = await checkUrl(row.career_url);
      process.stdout.write(`[${i + 1}/${rows.length}] ${status.padEnd(12)} ${row.career_url}\n`);
      enriched.push({ ...row, recheck_status: status, recheck_url: url });
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  fs.writeFileSync(OUTPUT, toCsv(enriched));
  console.log(`\nDone -> ${OUTPUT}`);

  const summary = {};
  for (const r of enriched) summary[r.recheck_status] = (summary[r.recheck_status] || 0) + 1;
  console.log("\nSummary:", JSON.stringify(summary, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});