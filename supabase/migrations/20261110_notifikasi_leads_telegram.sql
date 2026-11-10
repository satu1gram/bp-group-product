-- ============================================================
-- Notifikasi Telegram setiap ada kontak baru dari /panduan-bisnis
-- Jalankan di Supabase → SQL Editor (setelah 20261109_leads.sql).
--
-- SEBELUM menjalankan, ganti 2 nilai di LANGKAH 1:
--   ISI_TOKEN_BOT  → token dari @BotFather, contoh 7123456789:AAH...
--   ISI_CHAT_ID    → chat id Telegram Tila, contoh 123456789
-- (cara mendapatkannya: docs/panduan-admin-tila.md bagian G)
-- ============================================================

-- Ekstensi untuk mengirim HTTP dari database (bawaan Supabase)
create extension if not exists pg_net;

-- LANGKAH 1: simpan token & chat id di Vault (terenkripsi, tidak tampil di kode)
-- Jalankan sekali. Untuk mengganti nilainya nanti, lihat bagian bawah file.
select vault.create_secret('ISI_TOKEN_BOT', 'telegram_bot_token', 'Token bot notifikasi kontak');
select vault.create_secret('ISI_CHAT_ID', 'telegram_chat_id', 'Chat id penerima notifikasi');

-- LANGKAH 2: fungsi pengirim notifikasi
create or replace function public.notify_new_lead()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token text;
  v_chat text;
  v_text text;
begin
  select decrypted_secret into v_token from vault.decrypted_secrets where name = 'telegram_bot_token';
  select decrypted_secret into v_chat from vault.decrypted_secrets where name = 'telegram_chat_id';
  if v_token is null or v_chat is null or v_token = 'ISI_TOKEN_BOT' then
    return new;
  end if;

  v_text := '🔔 Kontak baru dari Panduan Bisnis' || E'\n\n'
         || 'Nama: ' || new.name || E'\n'
         || 'WhatsApp: +' || new.whatsapp || E'\n'
         || 'Kota: ' || coalesce(nullif(new.city, ''), '-') || E'\n\n'
         || 'Chat sekarang: https://wa.me/' || new.whatsapp || E'\n'
         || 'Kelola: https://katalog.mitrabp.biz.id/admin';

  -- Dikirim di latar belakang; gagal kirim tidak membatalkan penyimpanan kontak
  perform net.http_post(
    url := 'https://api.telegram.org/bot' || v_token || '/sendMessage',
    body := jsonb_build_object('chat_id', v_chat, 'text', v_text, 'disable_web_page_preview', true),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  return new;
exception when others then
  return new;
end;
$$;

revoke all on function public.notify_new_lead() from public, anon, authenticated;

-- LANGKAH 3: jalankan fungsi setiap ada baris baru di tabel leads
drop trigger if exists leads_notify_telegram on public.leads;
create trigger leads_notify_telegram
  after insert on public.leads
  for each row execute function public.notify_new_lead();

-- ── Uji coba (opsional) ─────────────────────────────────────
-- insert into public.leads (name, whatsapp, city, consent) values ('Tes Notifikasi', '6281200000000', 'Malang', true);
-- delete from public.leads where name = 'Tes Notifikasi';

-- ── Mengganti token / chat id di kemudian hari ──────────────
-- select vault.update_secret((select id from vault.secrets where name = 'telegram_chat_id'), 'CHAT_ID_BARU');
-- select vault.update_secret((select id from vault.secrets where name = 'telegram_bot_token'), 'TOKEN_BARU');
