import React, { useState } from 'react';
import { getInitials } from '@/types/testimoni';
import { useTestimonials } from '@/hooks/useTestimonials';

export function BusinessTestimonials() {
  const { data: testimonials, loading } = useTestimonials({
    category: 'Business',
    limit: 15
  });

  // ─── DATA KISAH INSPIRATIF MITRA ──────────────────
  const kisahMitra = [
    {
      id: 'paktamim',
      nama: "Pak Tamim & Bu Idah",
      latarBelakang: "Mitra Komunitas QM",
      pencapaian: "Beli Mobil Pertama Secara CASH",
      cerita: "Alhamdulillah wa Syukurillah, berkah buat Pak Tamim dan Bu Idah, hasil wasilah bisnis BP bisa membeli mobil pertama mereka secara cash. Keberhasilan adalah hasil dari ketekunan dalam mengejar impian. Jika kami bisa, Anda pun pasti bisa!",
      videoUrl: "/videos/pak tamim.mp4",
      thumbnail: "" // Menggunakan frame video sebagai cover
    },
    {
      id: 'mbaktila',
      nama: "Mbak Tila (Malang)",
      latarBelakang: "Mantan Dosen & Ibu 3 Anak",
      pencapaian: "Umroh sekeluarga & Sukses jadi Mompreneur",
      cerita: "Sebagai mantan Dosen, saya sempat mengalami perang batin saat harus menitipkan anak-anak demi mengajar. Akhirnya saya memilih resign agar bisa membersamai anak di rumah. Alhamdulillah lewat BP, passion mengajar saya tetap tersalurkan melalui pembinaan komunitas. Bonusnya, saya bisa bantu ekonomi keluarga, sedekah untuk Palestina, bahkan mengumrohkan orang tua—semuanya dari rumah.",
      thumbnail: "/images/bisnis/tila akbar umroh.jpeg"
    },
    {
      id: 'estuning',
      nama: "Ibu Estuning (79 Thn)",
      latarBelakang: "Sosok Senior Mandiri",
      pencapaian: "Mulai Bisnis di Usia 79 & Produktif!",
      cerita: "Usia bukan halangan! Di usia 79 tahun, beliau belajar WhatsApp pelan-pelan dan berhasil menjual 2 botol dalam 2 hari. Semangatnya luar biasa untuk hidup mandiri tanpa merepotkan anak dan ingin memperbanyak sedekah. Beliau adalah bukti nyata bahwa yang penting adalah kesungguhan.",
      thumbnail: "/images/bisnis/uti estuning.jpg"
    },
    {
      id: 'masadib',
      nama: "Mas Adib (Cirebon)",
      latarBelakang: "Mantan Karyawan P13",
      pencapaian: "Bebas dari Jeratan PHK & Jadi Distributor",
      cerita: "Dulu saya karyawan P13 yang rutinitasnya hanya rumah-pabrik dengan gaji pas-pasan. Beruntung saya merintis bisnis BP sejak usia 25, sehingga saat terkena PHK akibat pandemi, saya tidak panik karena sudah punya 'pegangan'. Sekarang omzet saya tembus ratusan juta, sudah 2x ke luar negeri, dan punya waktu fleksibel. Semua ini berkat bimbingan komunitas yang sangat positif.",
      videoUrl: "/videos/mas adib.mp4",
      thumbnail: "" // Menggunakan frame video sebagai cover
    }
  ];

  const featuredHighlights = [
    {
      id: 'h1',
      icon: 'verified_user',
      title: 'Garansi Modal Kembali',
      desc: 'Satu-satunya bisnis yang menjamin beli kembali stok Anda jika dalam 30 hari tidak laku. Tanpa risiko!',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'h2',
      icon: 'auto_graph',
      title: 'Profit & Repeat Order Tinggi',
      desc: 'Produk premium dengan margin keuntungan yang tebal dan konsumen yang terus melakukan pembelian ulang.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'h3',
      icon: 'psychology',
      title: 'Full Mentoring & Support',
      desc: 'Dibimbing langsung oleh Mas Ippho Santosa dan para trainer ahli. Kami sediakan ribuan konten siap posting.',
      color: 'from-amber-500 to-orange-600'
    }
  ];

  const getWaLink = (context?: string) => {
    const base = "https://wa.me/6287782697973"; // Nomor Mbak Tila
    let msg = "Halo Mbak Tila, saya melihat kisah sukses mitra BP di website. Saya tertarik bergabung. Bisa bantu saya cara mulainya?";

    if (context === 'mbaktila') msg = "Halo Mbak Tila, saya terinspirasi kisah Anda sebagai Mompreneur. Saya juga ingin bisa berpenghasilan dari rumah. Mohon bimbingannya.";
    if (context === 'masadib') msg = "Halo Mbak Tila, saya membaca kisah Mas Adib. Saya ingin rintis bisnis sebagai backup kerjaan saya. Bisa bantu saya?";
    if (context === 'estuning') msg = "Halo Mbak Tila, kisah Ibu Estuning sungguh menyentuh. Saya malu kalau tidak mulai sekarang. Bagaimana cara gabung jadi agen BP?";
    if (context === 'paktamim') msg = "Halo Mbak Tila, saya terinspirasi sukses Pak Tamim yang bisa beli mobil cash. Saya ingin mulai bisnis BP. Caranya bagaimana ya?";

    return `${base}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="bisnis-testimonies-wrapper py-10">
      <div className="bisnis-testimonies-header mb-12">
        <div className="bisnis-badge">
          <span className="material-symbols-rounded">rocket_launch</span>
          Success Story
        </div>
        <h3 className="bisnis-testimonies-title">
          Kisah Nyata <em>Perubahan Hidup</em>
        </h3>
        <p className="text-white/60 max-w-2xl mx-auto mt-4 text-sm">
          Bukan sekadar angka, tapi tentang impian yang menjadi nyata melalui ikhtiar yang tepat dan bimbingan yang tulus.
        </p>
      </div>

      {/* ── Highlight Paling Utama (Pak Tamim / Kisah Video) ── */}
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-10">
          <span className="h-[1px] flex-1 bg-white/10"></span>
          <span className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase">Featured Success Video</span>
          <span className="h-[1px] flex-1 bg-white/10"></span>
        </div>

        {kisahMitra.filter(m => m.id === 'paktamim').map(mitra => (
          <div key={mitra.id} className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-green-900/40 to-emerald-900/20 border border-white/10 p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-[9/16] md:aspect-video lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black group">
                {mitra.videoUrl ? (
                  <video
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                    poster={mitra.thumbnail}
                  >
                    <source src={mitra.videoUrl} type="video/mp4" />
                    Browser Anda tidak mendukung pemutaran video.
                  </video>
                ) : (
                  <img src={mitra.thumbnail} alt={mitra.nama} className="w-full h-full object-cover opacity-60" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
              </div>

              <div className="flex flex-col">
                <span className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-4">🏆 High Achievement</span>
                <h4 className="text-3xl md:text-4xl font-bold text-white mb-2">{mitra.nama}</h4>
                <p className="text-green-400 font-medium mb-8">{mitra.latarBelakang}</p>

                <div className="mb-10 p-6 rounded-2xl bg-white/5 border-l-4 border-green-500 backdrop-blur-sm">
                  <span className="text-[10px] text-green-500 font-bold uppercase block mb-2 tracking-widest">Pencapaian Dahsyat:</span>
                  <h5 className="text-2xl font-bold text-white leading-tight">{mitra.pencapaian}</h5>
                </div>

                <p className="text-white/70 text-lg italic leading-relaxed mb-10">
                  "{mitra.cerita}"
                </p>

                <div className="mt-auto">
                  <a
                    href={getWaLink(mitra.id)}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-green-900 font-bold rounded-2xl hover:bg-green-50 transition-all"
                  >
                    <span className="material-symbols-rounded">chat</span>
                    Tanya Cara Sukses Seperti Pak Tamim
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Kisah-kisah Lainnya (Mbak Tila, Mas Adib, Bu Estuning) ── */}
      <div className="mb-20">
        <div className="flex items-center gap-3 mb-10">
          <span className="h-[1px] flex-1 bg-white/10"></span>
          <span className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase">Inspirasi Mitra Berbagai Kalangan</span>
          <span className="h-[1px] flex-1 bg-white/10"></span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {kisahMitra.filter(m => m.id !== 'paktamim').map(mitra => (
            <div key={mitra.id} className="flex flex-col gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-green-500/30 transition-all group">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-black">
                {mitra.videoUrl ? (
                  <video
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                    preload="metadata"
                    poster={mitra.thumbnail}
                  >
                    <source src={mitra.videoUrl} type="video/mp4" />
                    Browser Anda tidak mendukung pemutaran video.
                  </video>
                ) : (
                  <img 
                    src={mitra.thumbnail} 
                    alt={mitra.nama} 
                    className="w-full h-full object-cover transition-all duration-700" 
                  />
                )}
              </div>
              <div className="flex flex-col flex-1">
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-white">{mitra.nama}</h4>
                  <span className="text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-400/10 uppercase tracking-widest">
                    {mitra.latarBelakang}
                  </span>
                </div>
                <div className="mb-4 p-3 rounded-xl bg-green-900/20 border border-green-500/20">
                  <span className="text-[10px] text-green-500 font-bold uppercase block mb-1">Pencapaian:</span>
                  <p className="text-green-100 font-bold text-sm leading-tight">{mitra.pencapaian}</p>
                </div>
                <p className="text-white/60 text-sm italic leading-relaxed mb-6">
                  "{mitra.cerita}"
                </p>
                <a
                  href={getWaLink(mitra.id)}
                  className="mt-auto text-green-400 text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Pelajari Caranya <span className="material-symbols-rounded text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pain Points & Value Props ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {featuredHighlights.map((h) => (
          <div key={h.id} className="relative group overflow-hidden rounded-3xl p-8 bg-white/5 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${h.color} opacity-10 blur-3xl group-hover:opacity-20 transition-all`}></div>
            <span className={`material-symbols-rounded text-4xl mb-6 bg-gradient-to-br ${h.color} bg-clip-text text-transparent`}>
              {h.icon}
            </span>
            <h4 className="text-xl font-bold text-white mb-3">{h.title}</h4>
            <p className="text-white/60 text-sm leading-relaxed">{h.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
