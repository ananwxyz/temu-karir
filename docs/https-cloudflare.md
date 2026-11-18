# Redirect HTTP → HTTPS dan www (M-3)

Temu Karir di-deploy via OpenNext di Cloudflare Workers (lihat `wrangler.jsonc`).
Redirect `http://` → `https://` dan `www` → root tidak hidup di kode Next/OpenNext;
itu dikelola di dashboard Cloudflare (edge). Langkah berikut dilakukan di
**dashboard Cloudflare** untuk zona `temukarir.com`.

## 1) Slalu gunakan HTTPS + HSTS

1. Buka **Cloudflare Dashboard** → pilih domain `temukarir.com`.
2. Menu **SSL/TLS → Edge Certificates**.
3. Nyalakan **Always Use HTTPS** (toggle ON). Ini membuat `http://temukarir.com`
   ditekan 301 ke `https://temukarir.com` — menyelesaikan kemunculan status 200
   tanpa enkripsi.
4. Di halaman yang sama, aktifkan **HSTS (Strict Transport Security)** (Preload
   boleh diaktifkan setelah dipastikan semua subdomain sudah https).

Verifikasi:
```bash
curl -sI http://temukarir.com | grep -i location   # harus 301 ke https://temukarir.com/
```

## 2) DNS record `www` + redirect 301 www → root

1. Menu **DNS → Records**.
2. Tambahkan record:
   - **Type:** A (atau CNAME `www` → `temukarir.com` kalau pakai CNAME flattening)
   - **Name:** `www`
   - **Content:** IPv4 Cloudflare / `temukarir.com`
   - **Proxy status:** ✓ Proxied (awan oranye aktif; wajib agar HTTPS/Rules jalan)
3. Menu **Rules → Redirect Rules**, buat **Bulk Redirect/Rule 301**:
   - From: `www.temukarir.com/*`
   - To: `https://temukarir.com/${1}` (pertahankan path)
   - Status: **301**

Verifikasi:
```bash
curl -sI https://www.temukarir.com | grep -i location   # harus 301 ke https://temukarir.com/
```

## Konfigurasi di repo

Tidak ada perubahan wajib di kode: Next/OpenNext tidak menangani redirect
HTTP/HTTPS (itu edge Cloudflare). Hal yang sudah dipastikan benar:
- `metadataBase` dan semua canonical di `src/` memakai `https://temukarir.com`.
- `src/app/robots.ts` sitemap memakai `https://temukarir.com/sitemap.xml`.

Sebagai pengaman tambahan opsional (di kode), bisa ditambahkan middleware
redirect untuk `www`/http di sisi worker — tetapi praktik terbaik Cloudflare
adalah melakukan ini di edge, bukan di worker, jadi langkah di atas sudah cukup.