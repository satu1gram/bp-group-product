-- ============================================================
-- Admin katalog = admin Rekapan Mitra
-- Katalog & Rekapan Mitra memakai project Supabase yang sama. Akun yang di
-- Rekapan Mitra ber-role admin (public.profiles.role = 'admin') otomatis
-- bisa masuk /admin katalog dengan email & kata sandi yang sama.
-- Tabel public.admins tetap bisa dipakai untuk menambah admin khusus katalog.
-- Jalankan di Supabase → SQL Editor. Aman dijalankan ulang.
-- ============================================================

create or replace function public.is_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.admins where user_id = auth.uid()) then
    return true;
  end if;
  begin
    return exists (
      select 1 from public.profiles
      where user_id = auth.uid() and role::text = 'admin'
    );
  exception when undefined_table or undefined_column then
    return false;
  end;
end;
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- Catatan: Rekapan Mitra punya fungsi lain bernama sama, public.is_admin(user_uid uuid).
-- Keduanya tidak bentrok karena parameternya berbeda.
