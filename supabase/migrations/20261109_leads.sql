-- ============================================================
-- Kontak calon mitra dari panduan gratis (/panduan-bisnis)
-- Jalankan di Supabase → SQL Editor setelah 20261108_catatan_tila_promo.sql.
-- Aman dijalankan ulang.
-- ============================================================

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  whatsapp text not null check (whatsapp ~ '^628[0-9]{7,12}$'),
  city text check (city is null or char_length(city) <= 60),
  interest text not null default 'mitra' check (interest in ('mitra', 'konsumen')),
  source text check (source is null or char_length(source) <= 120),
  note text check (note is null or char_length(note) <= 500),
  status text not null default 'baru' check (status in ('baru', 'dihubungi', 'jadi_mitra', 'tidak_lanjut')),
  consent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads (created_at desc);

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

alter table public.leads enable row level security;

-- Pengunjung boleh mengirim data (wajib setuju), tidak boleh membaca
drop policy if exists "leads_public_insert" on public.leads;
create policy "leads_public_insert" on public.leads
  for insert to anon, authenticated
  with check (consent = true and status = 'baru' and note is null);

drop policy if exists "leads_admin_select" on public.leads;
create policy "leads_admin_select" on public.leads
  for select to authenticated using (public.is_admin());

drop policy if exists "leads_admin_update" on public.leads;
create policy "leads_admin_update" on public.leads
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "leads_admin_delete" on public.leads;
create policy "leads_admin_delete" on public.leads
  for delete to authenticated using (public.is_admin());
