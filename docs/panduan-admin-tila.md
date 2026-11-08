# Panduan Catatan Tila & Promo (Tahap 1)

Website sekarang punya:

| Halaman | Isi |
|---|---|
| `/produk/<nama-produk>` | 12 halaman detail produk (harga, No. BPOM, FAQ, tombol WA) |
| `/mitra` | Halaman khusus calon mitra |
| `/promo` | Promo yang sedang berjalan (otomatis hilang setelah tanggal berakhir) |
| `/artikel` | Daftar "Catatan Tila" |
| `/artikel/<judul>` | Halaman artikel |
| `/admin` | Tempat Tila menulis artikel & mengelola promo (tidak diindeks Google) |

---

## A. Setup sekali saja (±15 menit)

### 1. Buat tabel di Supabase
1. Buka https://supabase.com/dashboard → pilih project → **SQL Editor** → **New query**.
2. Salin seluruh isi file `supabase/migrations/20261108_catatan_tila_promo.sql` → **Run**.
3. Harus muncul *Success. No rows returned*.

> Catatan: file `20260830_multi_tenant_katalog.sql` (rencana multi-mitra) **tidak perlu** dijalankan.

### 2. Buat akun admin untuk Tila
1. Supabase → **Authentication → Users → Add user → Create new user**.
2. Isi email & kata sandi Tila, centang **Auto Confirm User** → **Create user**.
3. Kembali ke **SQL Editor**, jalankan (ganti email):
   ```sql
   insert into public.admins (user_id)
     select id from auth.users where email = 'email-tila@contoh.com'
   on conflict do nothing;
   ```
4. Buka `https://katalog.mitrabp.biz.id/admin` → login dengan email & kata sandi tadi.

### 3. Website diperbarui otomatis setiap Tila menerbitkan (disarankan)
Artikel baru **langsung bisa dibuka** begitu diterbitkan. Supaya Google juga membaca versi
lengkapnya dan artikel masuk `sitemap.xml`, website perlu di-build ulang. Otomatiskan begini:

1. **Cloudflare** → Workers & Pages → project katalog → **Settings → Builds → Deploy hooks**
   → **Add deploy hook** → nama `supabase-konten`, branch `main` → **Save** → salin URL-nya.
2. **Supabase** → **Database → Webhooks** (atau *Integrations → Database Webhooks*) → **Create a new hook**:
   - Name: `rebuild-website`
   - Table: `articles`, Events: **Insert, Update, Delete**
   - Type: **HTTP Request**, Method: **POST**, URL: *(tempel URL deploy hook Cloudflare)*
   - **Create webhook**.
3. Ulangi langkah 2 untuk tabel `promos` (nama `rebuild-website-promo`).

Setelah itu, setiap simpan/terbit, Cloudflare membangun ulang website (±2–4 menit).
URL deploy hook bersifat rahasia — jangan dibagikan.

---

## B. Cara menulis artikel (untuk Tila)

1. Buka `/admin` → tab **Catatan Tila** → **+ Tulis artikel**.
2. Isi **Judul** yang memuat kata kunci yang dicari orang (lihat kalender di bawah).
   Alamat halaman terisi otomatis dari judul.
3. Pilih **Untuk pembaca**: *Konsumen* (ajakan ke WA/konsultasi) atau *Calon mitra* (ajakan ke halaman /mitra).
4. Tulis **Ringkasan** 1–2 kalimat (tampil di Google & kartu artikel).
5. Unggah **Gambar sampul** (opsional, 1200×675 px, maks 3 MB).
6. Tulis isi. Tombol bantu: *Subjudul, Tebal, Miring, Daftar, Kutipan, Link*. Klik **Pratinjau** untuk melihat hasilnya.
7. Perhatikan kotak kuning **⚠️ Cek pedoman BPOM** — ganti kata yang ditandai.
8. **Simpan draf** bila belum selesai, **Terbitkan** bila siap.

**Struktur yang disarankan (800–1.200 kata):**
1. Pembuka cerita pribadi (2–3 paragraf) — kenapa topik ini penting buat Tila.
2. 3–5 subjudul berisi edukasi/tips, sertakan sumber (Kemenkes, WHO, jurnal) untuk fakta kesehatan.
3. Penutup singkat + ajakan halus (tombol ajakan sudah otomatis di bawah artikel).

**Daftar cek sebelum terbit** ada di `docs/pedoman-klaim-bpom.md`.

### Kalender 12 minggu

| Minggu | Judul | Pembaca |
|---|---|---|
| 1 | Cara Cek British Propolis Asli dan Nomor BPOM-nya | Konsumen |
| 2 | Musim Hujan Datang: Kebiasaan Sederhana Menjaga Daya Tahan Tubuh Keluarga | Konsumen |
| 3 | Resign dari Dosen Jadi Ibu Rumah Tangga: Cerita Saya Tetap Berpenghasilan dari Rumah | Calon mitra |
| 4 | British Propolis, Green, dan Blue: Apa Bedanya dan Mana yang Cocok untuk Keluarga? | Konsumen |
| 5 | Propolis untuk Anak: Hal yang Perlu Ibu Tahu Sebelum Memberikan | Konsumen |
| 6 | Mitra, Agen, Reseller: Mana yang Cocok untuk Pemula? | Calon mitra |
| 7 | Mata Lelah karena Layar HP? Kebiasaan Kecil yang Membantu | Konsumen |
| 8 | Susah Tidur? 7 Kebiasaan Malam yang Perlu Diubah | Konsumen |
| 9 | Jualan via WhatsApp untuk Pemula: 5 Langkah yang Saya Ajarkan ke Tim | Calon mitra |
| 10 | Rutinitas Skincare 5 Menit untuk Ibu Sibuk | Konsumen |
| 11 | Apa Itu Propolis? Asal-usul dan Cara Minum yang Benar | Konsumen |
| 12 | Hitung-hitungan Jujur: Modal dan Potensi Untung Jadi Mitra BP | Calon mitra |

**Setiap artikel terbit, sebarkan ulang:** potong jadi carousel IG, status WA (pakai link
`https://katalog.mitrabp.biz.id/artikel/<judul>?utm_source=whatsapp&utm_medium=status`), dan broadcast Telegram.

---

## C. Cara memasang promo bulanan

1. `/admin` → tab **Promo** → **+ Promo baru**.
2. Salin materi resmi dari pusat: nama, isi program, syarat & ketentuan.
3. Isi tanggal **Mulai** dan **Berakhir** — promo tampil otomatis di `/promo` dan pita di beranda
   selama periode itu, lalu hilang sendiri setelah tanggal berakhir.
4. Unggah flyer resmi (opsional) → **Simpan promo**.
5. Bagikan link `https://katalog.mitrabp.biz.id/promo` di bio IG & status WA (link tetap sama tiap bulan).

---

## D. Panduan gratis & Kontak Masuk (Tahap 2)

Halaman `/panduan-bisnis` berisi "7 Langkah Mulai Bisnis British Propolis dari Rumah".
Judul dan ringkasan tiap langkah terbaca semua orang (dan Google); isi lengkapnya terbuka
setelah pengunjung mengisi nama + nomor WhatsApp + persetujuan dihubungi.

**Setup sekali:** jalankan `supabase/migrations/20261109_leads.sql` di Supabase → SQL Editor.
Tanpa langkah ini panduan tetap terbuka, tetapi kontak **tidak tersimpan**.

**Mohon ditinjau Tila:** isi panduan ada di `src/data/panduanBisnis.ts` (masih draf dari tim).
Ubah kalimat yang kurang pas dengan gaya Tila, lalu minta developer memperbaruinya.

**Follow-up:** `/admin` → tab **Kontak Masuk**
- Tombol **Chat** membuka WhatsApp ke nomor calon mitra dengan sapaan pembuka (status otomatis jadi *Sudah dihubungi*).
- Ubah status: *Baru → Sudah dihubungi → Jadi mitra / Tidak lanjut*.
- **Unduh CSV** untuk disimpan atau diolah di Excel/Google Sheets.
- Hubungi dalam 1×24 jam selagi masih hangat. Jangan kirim pesan massal/spam; hormati yang tidak berminat.

**Privasi:** data hanya bisa dibaca akun admin. Hapus kontak yang minta datanya dihapus
(Supabase → Table Editor → leads).

## E. Tombol bagikan & gambar pratinjau

- Halaman artikel, produk, promo, mitra & panduan punya tombol **Bagikan** (WhatsApp, Facebook, salin link).
  Link otomatis diberi penanda `utm_source`, jadi terlihat di GA4 berapa kunjungan dari hasil bagikan.
- Gambar pratinjau saat link dibagikan ada di `public/og/` (JPG 1200×630, aman untuk WhatsApp).
  Bila nama/harga produk berubah, buat ulang dengan: `npx tsx scripts/generate-og.ts`.
