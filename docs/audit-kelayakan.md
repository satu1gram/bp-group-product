# Audit Kelayakan Katalog — 10 November 2026

## Hasil Lighthouse (simulasi HP, 4G lambat)

| Halaman | Kecepatan | Aksesibilitas | Best Practices | SEO | Tampil utama (LCP) | Berat |
|---|---|---|---|---|---|---|
| Beranda | 92 | 96 | 100 | 100 | 2,7 s | 544 KB |
| Produk | 83 | 96 | 100 | 100 | 4,4 s | 624 KB |
| Mitra | 81 | 96 | 100 | 100 | 4,1 s | 711 KB |
| Kebutuhan | 84 | 96 | 100 | 100 | 4,3 s | 606 KB |
| Panduan bisnis | 87 | 96 | 100 | 100 | 3,9 s | 521 KB |
| Promo | 87 | 96 | 100 | 100 | 3,3 s | 360 KB |
| Malang | 85 | 96 | 100 | 100 | 4,3 s | 621 KB |
| Beranda (desktop) | 99 | 96 | – | 100 | 0,8 s | – |

Sebelum optimasi: kecepatan HP 70–84, berat 1,1–1,6 MB, Best Practices 82.
Aksesibilitas 96 (bukan 100) karena tombol hijau WhatsApp (#25D366) dengan teks putih
sengaja dipertahankan agar dikenali sebagai tombol WhatsApp.

Uji regresi: 13 halaman × 4 perangkat (iPhone SE, Galaxy S9+, iPad Mini, desktop 1366px):
tanpa error, tanpa geser horizontal, tanpa gambar rusak.

## Checklist target

| Target | Status | Catatan |
|---|---|---|
| Ditemukan Google (SEO teknis) | ✅ | Prerender, judul/deskripsi per halaman, JSON-LD, sitemap (±30 URL) |
| Konsumen (70%) | ✅ | 13 halaman produk, 8 halaman kebutuhan, halaman Malang, konsultasi AI, tombol WA di semua halaman |
| Calon mitra (30%) | ✅ | /mitra, panduan gratis + formulir kontak, alih ke WA Tila, tab Kontak Masuk |
| Promo bulanan | ✅ | /promo + pita beranda, dikelola di admin, otomatis hilang setelah tanggal berakhir |
| Artikel mingguan Tila | ✅ | Admin + pengecek BPOM + tanggal terbit bisa diatur (backdate) |
| Kepatuhan klaim BPOM | ⚠️ | Copy website sudah dirapikan; **testimoni lama di database & prompt AI (edge function) belum ditinjau** |
| Terukur (GA4) | ❓ | Perlu dipastikan `VITE_GA4_ID` sudah diisi di Cloudflare |
| Search Console & sitemap | ❓ | Perlu dipastikan sudah diverifikasi & sitemap dikirim |
| Google Business Profile | ❓ | Perlu dipastikan sudah dibuat & diverifikasi |
| Rebuild otomatis saat artikel terbit | ❓ | Deploy hook Cloudflare + webhook Supabase (panduan admin A3) |
| Notifikasi Telegram kontak baru | ❓ | Opsional (panduan admin G) |
| Data produk lengkap | ⚠️ | Nomor notifikasi BPOM belum ada untuk Belgie (5 produk), BP Blue, dan Belgie Luxury Perfume |
