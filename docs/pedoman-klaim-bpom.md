# Pedoman Klaim BPOM — Website, Artikel & Konten Mbak Tila

> Ringkasan kerja, bukan nasihat hukum. Untuk pasal persis, rujuk teks resmi di JDIH BPOM.
> Paling aman: minta ke pusat (BP Group) **daftar kalimat klaim resmi per produk** sesuai label & izin edar, lalu pakai kalimat itu.

## Jenis produk di katalog & aturannya

| Produk | Jenis (dari No. Reg) | Aturan utama |
|---|---|---|
| British Propolis, Green, Blue, Brassic Pro, Brassic Eye, BP Norway | Obat tradisional (`TR…`) | PerBPOM 34/2022 (periklanan OT, obat kuasi, suplemen) |
| Belgie Facial Wash, Serum, Day/Night Cream, Hair Tonic | Kosmetik (notifikasi) | PerBPOM 18/2024 (penandaan, promosi & iklan kosmetik), PerBPOM 3/2022 (klaim kosmetika) |
| Steffi Pro | Pangan olahan (`MD…`) | PerBPOM 1/2022 (klaim label & iklan pangan olahan), PerBPOM 6/2021 |

## Kata & kalimat yang DIHINDARI

- "menyembuhkan", "mengobati", "mencegah [penyakit]", "sembuh total", "bebas dari [penyakit]"
- Nama penyakit sebagai sasaran produk: diabetes, asam urat, kolesterol, kista, stroke, kanker, dll.
- "aman", "tanpa efek samping", "100% aman"
- Superlatif: "terbaik", "nomor 1", "paling ampuh", "ampuh", "dijamin"
- Testimoni kesembuhan / testimoni tentang khasiat ("gula darah saya turun dari 180 ke 110")
- Dokter, bidan, apoteker atau tenaga kesehatan yang merekomendasikan produk
- Kosmetik: istilah medis ("menyembuhkan jerawat", "menumbuhkan rambut", "regenerasi sel")
- Pangan (Steffi Pro): "menurunkan/menstabilkan gula darah", "aman untuk diabetes"

## Kalimat yang AMAN dipakai (contoh)

- Obat tradisional: "membantu memelihara daya tahan tubuh", "membantu meredakan pegal-pegal", "membantu memelihara kesehatan mata" (sesuaikan dengan label tiap produk)
- Kosmetik: "membersihkan", "melembapkan", "membantu menyamarkan tampilan flek", "kulit tampak lebih kenyal"
- Pangan: "pemanis dari ekstrak stevia", "pilihan saat mengurangi gula pasir"
- Testimoni: cerita *pengalaman memakai* produk (rasa, kebiasaan, kepraktisan), bukan hasil kesembuhan.
- Selalu sertakan: "Hasil pada setiap orang bisa berbeda. Bukan pengganti obat atau saran dokter."

## Promo

- Pakai materi promo resmi dari pusat apa adanya. Jangan menambah hadiah atau klaim sendiri
  (pemberian hadiah dalam iklan OT termasuk temuan pelanggaran yang sering terjadi).

## Daftar cek sebelum artikel/konten terbit

- [ ] Tidak ada kata di daftar "dihindari"
- [ ] Klaim produk sesuai label resmi
- [ ] Tidak ada testimoni kesembuhan
- [ ] Angka penghasilan (konten mitra) ditulis sebagai "potensi" + "hasil tiap orang berbeda"
- [ ] Ada sumber untuk fakta kesehatan umum (Kemenkes, WHO, jurnal)

## Untuk prompt AI Advisor (Supabase Edge Function `ai-konsultasi`)

Prompt AI aktif disimpan di Supabase, bukan di repo ini. Tambahkan aturan berikut ke prompt tersebut:

```
ATURAN KLAIM (WAJIB, sesuai BPOM):
- Jangan pernah menulis bahwa produk menyembuhkan, mengobati, atau mencegah penyakit.
- Jangan menyebut produk "aman", "tanpa efek samping", "terbaik", "ampuh", atau "dijamin".
- Gunakan bahasa "membantu memelihara ..." / "membantu meredakan ..." sesuai klaim label.
- Untuk keluhan penyakit (diabetes, asam urat, hipertensi, dll): sarankan tetap berkonsultasi
  dengan dokter; produk hanya disebut sebagai pendamping gaya hidup sehat.
- Steffi Pro adalah pemanis (pangan), bukan obat gula darah.
- Jangan mengutip testimoni kesembuhan.
```

## Sumber

- PerBPOM No. 34 Tahun 2022 — https://standar-otskk.pom.go.id/storage/uploads/ef3696b7-adb9-474d-b16a-b4bf178578d4/PerBPOM-No.-34-tahun-2022.pdf
- Q&A konsultasi publik PerBPOM periklanan OT & SK — https://standar-otskk.pom.go.id/storage/uploads/abb981e2-6541-44e7-b351-e605b80e00d1/Q&A-Pengawasan-Periklanan-OTSK.pdf
- BPOM: aturan penandaan, promosi & iklan kosmetik — https://www.pom.go.id/siaran-pers/bpom-tegaskan-aturan-penandaan-promosi-dan-iklan-kosmetik-wajib-dilaksanakan-pelaku-usaha
- PerBPOM No. 1 Tahun 2022 (klaim pangan olahan) — https://peraturan.bpk.go.id/Download/218530/Peraturan%20BPOM%20Nomor%201%20Tahun%202022.pdf
