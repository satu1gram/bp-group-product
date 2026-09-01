-- ============================================================
-- Katalog BP → SaaS Multi-Mitra
-- Migrasi: tabel baru untuk landing page multi-tenant
-- Efek samping: TIDAK menyentuh tabel dashboard yang ada
-- (customers, orders, products, store_settings, dll.)
-- ============================================================

-- ── 1. SETTINGS MITRA (branding & info bisnis) ──────────────
-- Satu baris per mitra. Diidentifikasi lewat 'slug' (mis. 'bp-jakarta').
create table public.katalog_settings (
  slug           text primary key,
  brand_name     text not null,   -- "Katalog BP"
  brand_subtitle text,            -- "Komunitas Bisnis Quantum Millionaire"
  logo_path      text,            -- "/images/qm-logo.webp"
  wa_number      text not null,   -- "6287782697973"
  mentor_name    text,            -- "Mas Ippho" (dibimbing oleh)
  welcome_message text,
  hero_badge     text,            -- label di paling atas
  hero_title     text,            -- judul hero
  hero_subtitle  text,
  nav_cta_text   text,            -- tombol di nav
  theme_color    text default '#0f766e',
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ── 2. PRODUK KATALOG per mitra ─────────────────────────────
create table public.katalog_products (
  id               text primary key,  -- 'british-propolis'
  slug             text not null references public.katalog_settings(slug) on delete cascade,
  category         text,
  badge_text       text,
  badge_color      text,
  name             text not null,
  tagline          text,
  description      text,
  benefits         jsonb,             -- ["...", "..."]
  specs            jsonb,             -- [{icon,text}, ...]
  price            text,              -- "Rp 250.000"
  price_note       text,
  old_price        text,
  nomor_registrasi text,
  harga_tier       jsonb,             -- [{label,minQty,harga}, ...]
  bg_style         text,
  emoji            text,
  image            text,
  sort_order       int default 0,
  is_active        boolean default true,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create index katalog_products_slug_idx on public.katalog_products (slug);

-- ── 3. PEMETAAN KELUHAN → PRODUK per mitra ──────────────────
create table public.katalog_keluhan (
  slug     text not null references public.katalog_settings(slug) on delete cascade,
  key      text not null,          -- 'tidur'
  label    text not null,          -- 'Susah Tidur'
  products jsonb,                  -- ["brassic-pro"]
  primary key (slug, key)
);

-- ── 4. KISAH SUKSES MITRA per tenant ────────────────────────
create table public.katalog_business_stories (
  slug            text not null references public.katalog_settings(slug) on delete cascade,
  id              text not null,   -- 'paktamim'
  nama            text not null,
  latar_belakang  text,
  pencapaian      text,
  cerita          text,
  video_url       text,
  thumbnail       text,
  sort_order      int default 0,
  primary key (slug, id)
);

-- ── 5. KEAMANAN (RLS) ───────────────────────────────────────
-- Landing page wajib bisa dibaca publik (tanpa login).
-- Tulis data HANYA via service role (dashboard/SQL internal), bukan dari browser.
alter table public.katalog_settings enable row level security;
alter table public.katalog_products enable row level security;
alter table public.katalog_keluhan enable row level security;
alter table public.katalog_business_stories enable row level security;

create policy "katalog_settings public read"
  on public.katalog_settings for select using (true);
create policy "katalog_products public read"
  on public.katalog_products for select using (true);
create policy "katalog_keluhan public read"
  on public.katalog_keluhan for select using (true);
create policy "katalog_business_stories public read"
  on public.katalog_business_stories for select using (true);