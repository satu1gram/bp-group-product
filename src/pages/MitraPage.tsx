import { Link } from "react-router";
import { SiteLayout, Breadcrumbs } from "@/components/site/SiteLayout";
import { WaIcon } from "@/components/site/WaIcon";
import { ShareBar } from "@/components/site/ShareBar";
import { BusinessTestimonials } from "@/components/BusinessTestimonials";
import { KEUNTUNGAN_MITRA, LANGKAH_MITRA, PAKET_KEMITRAAN } from "@/data/kemitraan";
import { Seo } from "@/lib/seo";
import { getWaLink } from "@/lib/site";
import { breadcrumbLd, faqLd } from "@/lib/structuredData";

const WA_MITRA = "Halo Mbak Tila, saya lihat halaman mitra di website. Saya mau ngobrol dulu soal bisnis British Propolis dari rumah.";

const UNTUK_SIAPA = [
    { icon: "family_restroom", title: "Ibu rumah tangga", desc: "Ingin punya penghasilan sendiri tanpa harus meninggalkan anak di rumah." },
    { icon: "work", title: "Karyawan", desc: "Butuh penghasilan cadangan yang bisa dijalankan dari HP, di sela jam kerja." },
    { icon: "elderly", title: "Pensiunan", desc: "Ingin tetap produktif dan mandiri, seperti Ibu Estuning yang mulai di usia 79 tahun." },
];

const FAQ_MITRA = [
    {
        q: "Apakah harus punya pengalaman jualan?",
        a: "Tidak. Banyak mitra mulai dari nol. Kamu akan mendapat bimbingan, materi promosi siap pakai setiap hari, dan grup WhatsApp untuk bertanya kapan saja.",
    },
    {
        q: "Berapa modal minimal untuk mulai?",
        a: "Paket terkecil adalah Paket AP berisi 10 botol seharga Rp 2.100.000 (modal Rp 210.000 per botol). Isi paket bisa di-mix: British Propolis, Brassic, BP Norway, Belgie, atau Steffi.",
    },
    {
        q: "Bagaimana kalau stok tidak laku?",
        a: "Ada program garansi modal kembali: stok dibeli kembali bila dalam 30 hari tidak laku. Syarat dan ketentuannya bisa kamu tanyakan langsung ke Mbak Tila sebelum bergabung.",
    },
    {
        q: "Bisa dijalankan sambil kerja atau mengurus anak?",
        a: "Bisa. Sebagian besar aktivitas dilakukan lewat HP: membagikan konten, membalas chat pelanggan, dan mengatur pengiriman. Waktunya bisa kamu atur sendiri.",
    },
    {
        q: "Apa yang saya dapat setelah bergabung?",
        a: "Harga khusus mitra, pembinaan dari Mas Ippho Santosa, para leader, dan Mbak Tila, materi promosi harian, akses materi pendidikan bisnis, serta komunitas yang saling mendukung.",
    },
];

export default function MitraPage() {
    return (
        <SiteLayout waMessage={WA_MITRA}>
            <Seo
                title="Bisnis dari Rumah untuk Ibu: Jadi Mitra British Propolis bersama Mbak Tila"
                description="Ingin berpenghasilan dari rumah dan tetap dekat dengan anak? Mulai jadi mitra British Propolis dari paket 10 botol, dibimbing langsung oleh Mbak Tila. Konsultasi gratis via WhatsApp."
                path="/mitra"
                image="/og/mitra.jpg"
                jsonLd={[
                    breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Jadi Mitra", path: "/mitra" }]),
                    faqLd(FAQ_MITRA),
                ]}
            />

            <div className="container site-container">
                <Breadcrumbs items={[{ label: "Beranda", href: "/" }, { label: "Jadi Mitra" }]} />

                <section className="mitra-hero">
                    <div className="mitra-hero-text">
                        <span className="site-tag">Bisnis dari Rumah</span>
                        <h1>Berpenghasilan dari Rumah, <em>Tetap Dekat dengan Anak</em></h1>
                        <p>
                            Saya Tila, mantan dosen dan ibu 3 anak. Sejak resign, saya membangun bisnis British Propolis
                            dari rumah. Sekarang saya membimbing ibu-ibu lain untuk memulainya, pelan-pelan dan tanpa
                            harus jago jualan.
                        </p>
                        <div className="site-btn-row">
                            <a href={getWaLink(WA_MITRA)} target="_blank" rel="noopener noreferrer" className="site-btn-wa">
                                <WaIcon size={18} /> Ngobrol Dulu dengan Tila
                            </a>
                            <a href="#paket" className="site-btn-outline">Lihat paket</a>
                        </div>
                        <p className="mitra-hero-note">Gratis dan tanpa kewajiban bergabung.</p>
                    </div>
                    <div className="mitra-hero-img">
                        <img src="/images/bisnis/tila akbar umroh.jpeg" alt="Mbak Tila bersama keluarga saat umroh" />
                    </div>
                </section>

                <section className="pd-section">
                    <div className="site-section-head">
                        <span className="site-tag">Untuk Siapa?</span>
                        <h2>Cocok untuk Kamu yang…</h2>
                    </div>
                    <div className="mitra-for-grid">
                        {UNTUK_SIAPA.map((u) => (
                            <div key={u.title} className="mitra-for-card">
                                <span className="material-symbols-rounded" aria-hidden="true">{u.icon}</span>
                                <h3>{u.title}</h3>
                                <p>{u.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="pd-section guide-cta-box">
                    <div>
                        <h3>Belum siap bergabung? Pelajari dulu.</h3>
                        <p>Baca panduan gratis 7 langkah mulai bisnis British Propolis dari rumah.</p>
                    </div>
                    <Link to="/panduan-bisnis" className="site-btn-primary">Buka Panduan Gratis</Link>
                </section>
            </div>

            <div className="world-bisnis mitra-band">
              <div className="container site-container">
                <section>
                    <div className="world-section-header">
                        <span className="tag">Mengapa Bergabung?</span>
                        <h3>Yang Kamu Dapatkan sebagai Mitra</h3>
                    </div>
                    <div className="bisnis-cards-grid">
                        {KEUNTUNGAN_MITRA.map((item) => (
                            <div key={item.title} className="bisnis-card">
                                <div className="bisnis-card-icon"><span className="material-symbols-rounded">{item.icon}</span></div>
                                <div className="bisnis-card-title">{item.title}</div>
                                <div className="bisnis-card-desc">{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <BusinessTestimonials />

                <section className="pd-section">
                    <div className="world-section-header">
                        <span className="tag">Cara Mulai</span>
                        <h3>3 Langkah Mudah</h3>
                    </div>
                    <div className="bisnis-steps-grid">
                        {LANGKAH_MITRA.map((item) => (
                            <div key={item.step} className="bisnis-step-card">
                                <div className="bisnis-step-num">{item.step}</div>
                                <div className="bisnis-step-icon"><span className="material-symbols-rounded">{item.icon}</span></div>
                                <div className="bisnis-step-title">{item.title}</div>
                                <div className="bisnis-step-desc">{item.desc}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="pd-section" id="paket">
                    <div className="world-section-header">
                        <span className="tag">Pilihan Paket</span>
                        <h3>Mulai dari 10 Botol</h3>
                        <p className="mitra-band-sub">Isi paket bisa di-mix (British Propolis, Brassic, BP Norway, Belgie, Steffi).</p>
                    </div>
                    <div className="bisnis-paket-grid">
                        {PAKET_KEMITRAAN.map((paket) => (
                            <div key={paket.nama} className={`bisnis-paket-card ${paket.highlight ? 'paket-highlight' : ''}`}>
                                {paket.highlight && <div className="paket-best-badge">Paling Untung</div>}
                                <div className="paket-header">
                                    <div className="paket-nama">{paket.nama}</div>
                                    <div className="paket-jumlah">{paket.jumlah}</div>
                                </div>
                                <div className="paket-harga-utama">{paket.hargaPaket}</div>
                                <div className="paket-detail-table">
                                    <div className="paket-row"><span>Modal per botol</span><strong>{paket.modal}</strong></div>
                                    <div className="paket-row"><span>Harga jual satuan</span><strong>{paket.jual}</strong></div>
                                    <div className="paket-row paket-row-untung"><span>Untung per botol</span><strong>{paket.untung}</strong></div>
                                    <div className="paket-row paket-row-potensi"><span>Potensi untung max</span><strong>{paket.potensi}</strong></div>
                                </div>
                                <a href={getWaLink(`Halo Mbak Tila, saya tertarik dengan ${paket.nama} (${paket.jumlah}) seharga ${paket.hargaPaket}. Bisa info lebih lanjut?`)}
                                    target="_blank" rel="noopener noreferrer" className="paket-cta-btn">
                                    <WaIcon size={16} /> Tanya {paket.nama}
                                </a>
                            </div>
                        ))}
                    </div>
                    <p className="health-disclaimer mitra-band-note">
                        Angka keuntungan adalah potensi berdasarkan selisih harga modal dan harga jual. Hasil setiap mitra
                        berbeda, tergantung konsistensi dan usaha masing-masing.
                    </p>
                </section>
              </div>
            </div>

            <div className="container site-container">
                <section>
                    <h2 className="pd-h2">Pertanyaan Calon Mitra</h2>
                    <div className="site-faq">
                        {FAQ_MITRA.map((f) => (
                            <details key={f.q}>
                                <summary>{f.q}</summary>
                                <p>{f.a}</p>
                            </details>
                        ))}
                    </div>
                </section>

                <section className="pd-section mitra-final-cta">
                    <h2>Belum yakin? Ngobrol dulu saja.</h2>
                    <p>Ceritakan kondisimu, Mbak Tila bantu lihat apakah bisnis ini cocok untukmu. Tanpa paksaan.</p>
                    <a href={getWaLink(WA_MITRA)} target="_blank" rel="noopener noreferrer" className="site-btn-wa">
                        <WaIcon size={18} /> Chat Mbak Tila via WhatsApp
                    </a>
                </section>

                <div className="site-center">
                    <ShareBar path="/mitra" title="Bisnis dari rumah untuk ibu, bareng Mbak Tila" label="Kenal yang sedang cari peluang? Bagikan" />
                </div>
            </div>
        </SiteLayout>
    );
}
