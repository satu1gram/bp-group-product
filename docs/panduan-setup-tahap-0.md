# Panduan Setup Tahap 0 — Agar Website Terukur & Ditemukan Google

Semua layanan di bawah **gratis**.

## 1. Google Analytics 4 (mengukur pengunjung & klik WhatsApp)

1. Buka https://analytics.google.com → login akun Google → **Mulai mengukur**.
2. Nama akun: `Katalog British Propolis`. Zona waktu: Indonesia (Jakarta). Mata uang: IDR.
3. Pilih platform **Web** → URL `https://katalog.mitrabp.biz.id` → nama stream `Katalog`.
4. Salin **Measurement ID** (format `G-XXXXXXXXXX`).
5. Di Cloudflare: **Workers & Pages → (project katalog) → Settings → Variables and Secrets**
   → tambah variabel `VITE_GA4_ID` = `G-XXXXXXXXXX` (untuk Production) → **deploy ulang**.
   (Atau kirim ID-nya ke developer untuk dipasang.)
6. Setelah ada data (±24 jam): GA4 → **Admin → Events** → tandai `click_whatsapp`
   sebagai **Key event** (konversi).

Event yang tercatat otomatis:
- `click_whatsapp` — setiap klik tombol WA, lengkap dengan bagian halaman (`section`), teks tombol, dan awal pesan WA.
- `ai_consultation` — setiap pengunjung menekan tombol analisis keluhan.

Tips: tambahkan penanda sumber (UTM) di link yang dibagikan, misalnya
`https://katalog.mitrabp.biz.id/?utm_source=instagram&utm_medium=bio`
`https://katalog.mitrabp.biz.id/?utm_source=whatsapp&utm_medium=status`
supaya terlihat channel mana yang paling banyak mendatangkan chat.

## 2. Google Search Console (agar Google mengenal & mengindeks website)

1. Buka https://search.google.com/search-console → **Tambah properti** → pilih **Domain** → `mitrabp.biz.id`.
2. Google memberi record TXT. Karena domain di Cloudflare, biasanya ada tombol verifikasi otomatis;
   jika tidak: Cloudflare → **DNS → Add record** → Type `TXT`, Name `@`, Content = kode dari Google → Save → Verify.
3. Menu **Sitemaps** → masukkan `https://katalog.mitrabp.biz.id/sitemap.xml` → Submit.
4. Menu **URL Inspection** → masukkan `https://katalog.mitrabp.biz.id/` → **Request indexing**.

## 3. Google Business Profile (muncul di Google Maps & pencarian lokal)

1. Buka https://business.google.com → **Tambahkan bisnis**.
2. Nama: misalnya `British Propolis Malang – Mbak Tila`. Kategori: `Toko Suplemen` / `Toko Produk Kesehatan`.
3. Pilih **"Saya mengantar ke pelanggan"** jika tidak ingin alamat rumah tampil; area layanan: Malang & sekitarnya.
4. Isi nomor WA, website `https://katalog.mitrabp.biz.id`, jam operasional, foto produk.
5. Verifikasi (biasanya via video/SMS). Minta pelanggan puas memberi ulasan di sini.

## 4. (Opsional) Cloudflare Web Analytics

Cloudflare → project → **Metrics/Web Analytics → Enable**. Gratis, tanpa cookie,
melengkapi GA4 untuk melihat jumlah kunjungan dasar.

## Catatan build

- `npm run build` sekarang: build klien → build SSR → `scripts/prerender.mjs`
  (mengisi HTML statis, data terstruktur produk, dan `sitemap.xml`).
- Pastikan build command di Cloudflare tetap `npm run build` dan output directory `dist`.
- Variabel `VITE_SUPABASE_URL` & `VITE_SUPABASE_PUBLISHABLE_KEY` tetap diperlukan seperti sebelumnya.

## Tahap 1

Halaman produk, /mitra, /promo, /artikel dan /admin: lihat `docs/panduan-admin-tila.md`.
Setelah setup, kirim ulang sitemap di Search Console agar halaman baru cepat diindeks.
