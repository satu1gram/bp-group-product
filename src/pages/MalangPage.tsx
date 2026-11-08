import { Link } from "react-router";
import { SiteLayout, Breadcrumbs } from "@/components/site/SiteLayout";
import { WaIcon } from "@/components/site/WaIcon";
import { ShareBar } from "@/components/site/ShareBar";
import { KebutuhanGrid } from "@/components/site/KebutuhanGrid";
import { KATALOG_PRODUCTS } from "@/data/katalogProducts";
import { Seo } from "@/lib/seo";
import { getWaLink } from "@/lib/site";
import { breadcrumbLd, faqLd, storeLd } from "@/lib/structuredData";

const WA_MALANG = "Halo Mbak Tila, saya dari Malang, mau pesan British Propolis. Bisa dibantu?";
const POPULER = ["british-propolis", "british-propolis-green", "brassic-pro", "brassic-eye"];

const FAQ_MALANG = [
    {
        q: "Di mana beli British Propolis asli di Malang?",
        a: "Kamu bisa pesan langsung ke Mbak Tila, mitra British Propolis di Malang, lewat WhatsApp. Semua produk resmi dan nomor BPOM-nya bisa dicek di cekbpom.pom.go.id.",
    },
    {
        q: "Bagaimana cara pesan untuk area Malang Raya?",
        a: "Chat WhatsApp, sebutkan produk, jumlah, dan alamatmu di Kota Malang, Kabupaten Malang, atau Batu. Pilihan pengiriman dan ongkosnya akan diinformasikan saat chat.",
    },
    {
        q: "Bisa kirim ke luar Malang?",
        a: "Bisa. Pesanan dikirim dari Malang dengan jasa ekspedisi, ongkos kirim menyesuaikan alamat tujuan.",
    },
    {
        q: "Bagaimana memastikan produknya asli?",
        a: "Periksa nomor registrasi BPOM di kemasan dan cocokkan di cekbpom.pom.go.id. Nomor registrasi setiap produk juga tercantum di halaman produk katalog ini.",
    },
];

export default function MalangPage() {
    const populer = POPULER.map((id) => KATALOG_PRODUCTS.find((p) => p.id === id)).filter(
        (p): p is (typeof KATALOG_PRODUCTS)[number] => Boolean(p)
    );

    return (
        <SiteLayout waMessage={WA_MALANG}>
            <Seo
                title="Jual British Propolis Asli di Malang – Pesan via WhatsApp | Mbak Tila"
                description="Beli British Propolis, Brassic, BP Norway & Belgie asli di Malang langsung dari Mbak Tila, mitra resmi di Malang. Konsultasi gratis, pesan via WhatsApp, kirim ke Malang Raya & luar kota."
                path="/british-propolis-malang"
                image="/og/default.jpg"
                jsonLd={[
                    {
                        ...storeLd(),
                        areaServed: [
                            { "@type": "City", name: "Kota Malang" },
                            { "@type": "AdministrativeArea", name: "Kabupaten Malang" },
                            { "@type": "City", name: "Kota Batu" },
                        ],
                    },
                    breadcrumbLd([
                        { name: "Beranda", path: "/" },
                        { name: "British Propolis Malang", path: "/british-propolis-malang" },
                    ]),
                    faqLd(FAQ_MALANG),
                ]}
            />
            <div className="container site-container">
                <Breadcrumbs items={[{ label: "Beranda", href: "/" }, { label: "British Propolis Malang" }]} />

                <section className="mitra-hero">
                    <div className="mitra-hero-text">
                        <span className="site-tag">Malang Raya</span>
                        <h1>British Propolis Asli di <em>Malang</em></h1>
                        <p>
                            Belanja langsung dari Mbak Tila, mitra British Propolis yang tinggal di Malang. Konsultasi dulu
                            gratis, lalu pesan lewat WhatsApp. Melayani Kota Malang, Kabupaten Malang, Batu, dan pengiriman ke luar kota.
                        </p>
                        <div className="site-btn-row">
                            <a href={getWaLink(WA_MALANG)} target="_blank" rel="noopener noreferrer" className="site-btn-wa">
                                <WaIcon size={18} /> Pesan via WhatsApp
                            </a>
                            <a href="/#produk" className="site-btn-outline">Lihat semua produk</a>
                        </div>
                    </div>
                    <div className="mitra-hero-img">
                        <img src="/images/produk/bp.webp" alt="Produk British Propolis" />
                    </div>
                </section>

                <section className="pd-section">
                    <h2 className="pd-h2">Cara Pesan</h2>
                    <div className="need-tips">
                        {[
                            { t: "Chat WhatsApp", d: "Ceritakan kebutuhanmu atau langsung sebutkan produk yang ingin dibeli." },
                            { t: "Konfirmasi pesanan", d: "Mbak Tila mengonfirmasi produk, jumlah, total harga, dan pilihan pengiriman." },
                            { t: "Bayar & terima", d: "Setelah pembayaran, pesanan disiapkan dan dikirim ke alamatmu." },
                        ].map((s, i) => (
                            <div key={s.t} className="need-tip">
                                <span className="need-tip-num">{i + 1}</span>
                                <div><h3>{s.t}</h3><p>{s.d}</p></div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="pd-section">
                    <h2 className="pd-h2">Produk yang Paling Sering Dipesan</h2>
                    <div className="pd-related">
                        {populer.map((r) => (
                            <Link key={r.id} to={`/produk/${r.id}`} className="pd-related-card">
                                <div className={`pd-related-img card-img-bg-wrap ${r.bgStyle}`}>
                                    {r.image && <img src={r.image} alt={r.name} loading="lazy" />}
                                </div>
                                <div>
                                    <div className="pd-related-name">{r.name}</div>
                                    <div className="pd-related-price">{r.price}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="pd-section">
                    <h2 className="pd-h2">Cari Sesuai Kebutuhan</h2>
                    <KebutuhanGrid />
                </section>

                <section className="pd-section">
                    <h2 className="pd-h2">Pertanyaan Pembeli di Malang</h2>
                    <div className="site-faq">
                        {FAQ_MALANG.map((f) => (
                            <details key={f.q}>
                                <summary>{f.q}</summary>
                                <p>{f.a}</p>
                            </details>
                        ))}
                    </div>
                </section>

                <section className="pd-section guide-cta-box">
                    <div>
                        <h3>Tinggal di Malang & ingin punya penghasilan dari rumah?</h3>
                        <p>Mbak Tila juga membimbing mitra baru di Malang Raya.</p>
                    </div>
                    <Link to="/mitra" className="site-btn-primary">Info Jadi Mitra</Link>
                </section>

                <div className="site-center">
                    <ShareBar path="/british-propolis-malang" title="British Propolis asli di Malang, pesan via WhatsApp" />
                </div>
            </div>
        </SiteLayout>
    );
}
