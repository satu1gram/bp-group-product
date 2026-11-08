-- ============================================================
-- Catatan Tila (artikel) + Promo bulanan + admin + penyimpanan gambar
-- Jalankan sekali di Supabase Dashboard → SQL Editor → Run.
-- Aman dijalankan ulang (idempotent).
-- ============================================================

-- ── Admin ───────────────────────────────────────────────────
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Pengguna hanya bisa melihat baris miliknya (untuk cek "apakah saya admin")
drop policy if exists "admins_select_self" on public.admins;
create policy "admins_select_self" on public.admins
  for select to authenticated using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- updated_at otomatis
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── Artikel ─────────────────────────────────────────────────
create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 160),
  excerpt text,
  content text not null default '',
  cover_url text,
  audience text not null default 'konsumen' check (audience in ('konsumen', 'mitra')),
  status text not null default 'draft' check (status in ('draft', 'published')),
  keyword text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists articles_published_idx on public.articles (status, published_at desc);

drop trigger if exists articles_updated_at on public.articles;
create trigger articles_updated_at before update on public.articles
  for each row execute function public.set_updated_at();

alter table public.articles enable row level security;

drop policy if exists "articles_public_read" on public.articles;
create policy "articles_public_read" on public.articles
  for select using (status = 'published' or public.is_admin());

drop policy if exists "articles_admin_insert" on public.articles;
create policy "articles_admin_insert" on public.articles
  for insert to authenticated with check (public.is_admin());

drop policy if exists "articles_admin_update" on public.articles;
create policy "articles_admin_update" on public.articles
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "articles_admin_delete" on public.articles;
create policy "articles_admin_delete" on public.articles
  for delete to authenticated using (public.is_admin());

-- ── Promo ───────────────────────────────────────────────────
create table if not exists public.promos (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 120),
  description text,
  terms text,
  image_url text,
  starts_at date,
  ends_at date,
  wa_message text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or starts_at is null or ends_at >= starts_at)
);

drop trigger if exists promos_updated_at on public.promos;
create trigger promos_updated_at before update on public.promos
  for each row execute function public.set_updated_at();

alter table public.promos enable row level security;

drop policy if exists "promos_public_read" on public.promos;
create policy "promos_public_read" on public.promos
  for select using (is_active or public.is_admin());

drop policy if exists "promos_admin_insert" on public.promos;
create policy "promos_admin_insert" on public.promos
  for insert to authenticated with check (public.is_admin());

drop policy if exists "promos_admin_update" on public.promos;
create policy "promos_admin_update" on public.promos
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "promos_admin_delete" on public.promos;
create policy "promos_admin_delete" on public.promos
  for delete to authenticated using (public.is_admin());

-- ── Penyimpanan gambar (bucket publik "konten") ─────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('konten', 'konten', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "konten_public_read" on storage.objects;
create policy "konten_public_read" on storage.objects
  for select using (bucket_id = 'konten');

drop policy if exists "konten_admin_insert" on storage.objects;
create policy "konten_admin_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'konten' and public.is_admin());

drop policy if exists "konten_admin_update" on storage.objects;
create policy "konten_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'konten' and public.is_admin());

drop policy if exists "konten_admin_delete" on storage.objects;
create policy "konten_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'konten' and public.is_admin());

-- ── Daftarkan akun Tila sebagai admin ───────────────────────
-- 1) Buat akun dulu: Authentication → Users → Add user → Create new user
--    (isi email & kata sandi Tila, centang "Auto Confirm User").
-- 2) Lalu jalankan baris ini (ganti email-nya):
-- insert into public.admins (user_id)
--   select id from auth.users where email = 'email-tila@contoh.com'
-- on conflict do nothing;
