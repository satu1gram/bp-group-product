# SaaS Multi-Mitra Katalog BP — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengubah halaman katalog BP dari kode statis menjadi aplikasi multi-mitra yang datanya tersimpan di Supabase — satu codebase, tiap mitra BP punya data sendiri (produk, kisah mitra, branding, pemetaan keluhan) diidentifikasi lewat `slug`.

**Architecture:** Landing page saat ini hardcode semua konten BP di dalam kode (`katalogProducts.ts`, `BusinessTestimonials.tsx`, konstanta di `KatalogProdukPage.tsx`, prompt di `geminiRAG.ts`). Rencana: pindahkan semua konten itu ke 4 tabel Supabase baru (`katalog_settings`, `katalog_products`, `katalog_keluhan`, `katalog_business_stories`), lalu halaman fetch dari DB berdasarkan `slug` mitra. Kunci keamanan: **graceful fallback** — jika tabel kosong/error, halaman tetap menampilkan data hardcode saat ini, jadi migrasi tidak pernah memecahkan tampilan.

**Tech Stack:** React 18 + Vite 6 + TypeScript, Supabase JS v2 (Postgres + RLS), React Router v7, TanStack Query (kembali ditambahkan untuk data fetching), Zod (opsional, validasi).

---

## Arsitektur Data

Tiap baris dibedakan oleh kolom `slug` (contoh: `'bp'`, `'bp-bogor'`, `'bp-surabaya'`). Slug dipilih via query param `?slug=` atau default `'bp'`.

| Tabel | Isi | Sumber sekarang |
|---|---|---|
| `katalog_settings` | branding (nama brand, subtitle, logo, no WA, mentor, teks hero, warna tema) | `index.html`, `vite.config.ts`, `KatalogProdukPage.tsx` (hardcode string) |
| `katalog_products` | 11 produk + harga tier + deskripsi + gambar | `src/data/katalogProducts.ts` |
| `katalog_keluhan` | 13 tab keluhan → daftar ID produk | `KatalogProdukPage.tsx:19-49` |
| `katalog_business_stories` | 4 kisah mitra (video/foto/cerita) | `BusinessTestimonials.tsx:12-47` |

`telegram_messages` (testimoni) sudah di DB — tidak berubah.

## Struktur File Baru

- `supabase/migrations/20260830_multi_tenant_katalog.sql` — (SUDAH DIBUAT) DDL tabel + RLS
- `supabase/seed/katalog_seed.sql` — data seed BP pertama (dari kode yang ada)
- `src/types/katalog.ts` — tipe `KatalogSettings`, `KatalogProduct`, `KatalogKeluhan`, `KatalogBusinessStory`
- `src/hooks/useKatalog.ts` — hook fetch semua data katalog per slug + penalty fallback
- `src/hooks/useBusinessStories.ts` — hook kisah mitra
- `src/config/katalogFallback.ts` — data hardcode BP saat ini (dipindah dari komponen, jadi data tersentralisasi untuk seed & fallback)

## File yang Dimodifikasi

- `src/pages/KatalogProdukPage.tsx` — baca konstanta dari hook, bukan hardcode
- `src/components/BusinessTestimonials.tsx` — baca kisah dari hook
- `src/components/TestimonialWall.tsx` — daftar produk dari hook
- `src/lib/geminiRAG.ts` — prompt & FALLBACK_RULES dari konfig, konsultasi menggunakan produk per slug
- `src/integrations/supabase/types.ts` — regenerasi types (jalankan `npx supabase gen types`)
- `src/App.tsx` — tambah TanStack Query provider

---

## Task 1: Tabel + Seed Di Database

**Files:**
- Create: `supabase/migrations/20260830_multi_tenant_katalog.sql` ✅
- Create: `supabase/seed/katalog_seed.sql`

- [ ] **Step 1: Buat file seed** — salin seluruh data BP dari `src/data/katalogProducts.ts`, `BusinessTestimonials.tsx`, konstanta `KatalogProdukPage.tsx` (COMPLAINT_OPTIONS, KELUHAN_FILTER_TABS, KELUHAN_PRODUCTS, PRODUCT_NAME_TO_ID, data hero) ke dalam `INSERT` SQL untuk slug `'bp'`.
- [ ] **Step 2: Jalankan di Supabase SQL Editor** oleh user (urutan: migration dulu, lalu seed). Verifikasi dengan query: `select slug, count(*) from public.katalog_products group by slug;`

---

## Task 2: Tipe + Hook Data Katalog

**Files:**
- Create: `src/types/katalog.ts`
- Create: `src/hooks/useKatalog.ts`
- Create: `src/config/katalogFallback.ts`

- [ ] **Step 1: Definisikan tipe** `KatalogSettings`, `KatalogProduct`, `KatalogKeluhan`, `KatalogBusinessStory`.
- [ ] **Step 2: Pindahkan** `KATALOG_PRODUCTS` dari `katalogProducts.ts` ke `katalogFallback.ts` (ekspor ulang agar nama lama tetap tersedia → tidak memecahkan impor yang ada).
- [ ] **Step 3: Buat `useKatalog(slug)`** — fetch dari Supabase; jika error/empty → verr `katalogFallback`; expose `{ settings, products, keluhan, stories, loaded }`.
- [ ] **Step 4: Tes manual** — `npm run build`, pastikan tidak ada error tipe.

---

## Task 3: Hook Kisah Mitra + Refactor BusinessTestimonials

**Files:**
- Modify: `src/components/BusinessTestimonials.tsx`
- Create: `src/hooks/useBusinessStories.ts`

- [ ] **Step 1: Pindahkan array `kisahMitra`** (4 data) ke `katalogFallback.ts`.
- [ ] **Step 2: Buat hook** yang pakai `useKatalog()` → kembalikan `stories`.
- [ ] **Step 3: Refactor komponen** agar render `stories` dari hook (struktur tetap sama), hilangkan literals.
- [ ] **Step 4: Build & tes visual** (dev server).

---

## Task 4: Refactor KatalogProdukPage (keluhan, produk, branding, WA)

**Files:**
- Modify: `src/pages/KatalogProdukPage.tsx`

- [ ] **Step 1: Ganti konstanta** `COMPLAINT_OPTIONS`, `KELUHAN_FILTER_TABS`, `KELUHAN_PRODUCTS`, `PRODUCT_NAME_TO_ID` → data dari `useKatalog()`.
- [ ] **Step 2: Ganti hardcode branding** (`wa.me/6287782697973`, teks "Quantum Millionaire", slogan) → `settings`.
- [ ] **Step 3: Build & tes.**

---

## Task 5: Refactor AI Advisor (geminiRAG)

**Files:**
- Modify: `src/lib/geminiRAG.ts`

- [ ] **Step 1: Baca `FALLBACK_RULES` & `SYSTEM_PROMPT`** dari `useKatalog()`/fallback agar produk sesuai slug.
- [ ] **Step 2: Build & tes.**

---

## Task 6: (Opsional — diajukan ke user) Route per slug

**Files:**
- Modify: `src/App.tsx`, `KatalogProdukPage.tsx`

- [ ] **Step 1: Dukung URL** `/:slug` (`/bp-bogor`) atau tetap `?slug=` default.
- [ ] **Step 2: `index.html` title dinamis** (react-helmet atau dokument.title dari settings).

---

## Task 7: Verifikasi Akhir

- [ ] `npm run lint` → 0 error
- [ ] `npm run build` → sukses
- [ ] `npm run dev` → halaman tampil identik dengan sebelum refactor (fallback aktif)
- [ ] Jika seed sudah jalan: tampilan terbaca dari DB (ubah 1 produk di DB → tampilan ikut berubah)

---

## Catatan Risiko & Keamanan

- **Fallback wajib** sebelum seed berjalan: jangan pernah `throw` saat fetch gagal.
- **RLS**: `select` publik diaktifkan (landing tanpa login), `insert/update/delete` hanya lewat dashboard/service role. Tanpa RLS, slug mitra bisa mengubah data mitra lain.
- **`VITE_GEMINI_API_KEY`**: langkah berikutnya setelah multi-mitra stabil — pindahkan panggilan Gemini ke Supabase Edge Function agar key tidak terekspos (masih Open, di luar scope plan ini).