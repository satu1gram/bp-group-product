import { Link, useParams } from "react-router";
import { SiteLayout, Breadcrumbs } from "@/components/site/SiteLayout";
import { WaIcon } from "@/components/site/WaIcon";
import { ShareBar } from "@/components/site/ShareBar";
import { KEBUTUHAN } from "@/data/kebutuhan";
import { KATALOG_PRODUCTS } from "@/data/katalogProducts";
import { Seo } from "@/lib/seo";
import { SITE_URL, getWaLink } from "@/lib/site";
import { breadcrumbLd, faqLd } from "@/lib/structuredData";
import NotFound from "./NotFound";

export default function KebutuhanPage() {
    const { slug = "" } = useParams();
    const k = KEBUTUHAN.find((x) => x.slug === slug);
    if (!k) return <NotFound />;

    const path = `/kebutuhan/${k.slug}`;
    const products = k.productIds
        .map((id) => KATALOG_PRODUCTS.find((p) => p.id === id))
        .filter((p): p is (typeof KATALOG_PRODUCTS)[number] => Boolean(p));
    const waText = `Halo Mbak Tila, saya mau konsultasi soal ${k.waTopic}. Produk mana yang cocok untuk saya?`;
    const others = KEBUTUHAN.filter((x) => x.slug !== k.slug);

    return (
        <SiteLayout waMessage={waText}>
            <Seo
                title={k.metaTitle}
                description={k.metaDescription}
                path={path}
                image={products[0] ? `/og/produk-${products[0].id}.jpg` : "/og/default.jpg"}
                jsonLd={[
                    breadcrumbLd([
                        { name: "Beranda", path: "/" },
                        { name: "Kebutuhan", path: "/kebutuhan" },
                        { name: k.label, path },
                    ]),
                    faqLd(k.faqs),
                    {
                        "@type": "ItemList",
                        name: `Produk pilihan: ${k.label}`,
                        itemListElement: products.map((p, i) => ({
                            "@type": "ListItem",
                            position: i + 1,
                            url: `${SITE_URL}/produk/${p.id}`,
                            name: p.name,
                        })),
                    },
                ]}
            />
            <div className="container site-container">
                <Breadcrumbs items={[{ label: "Beranda", href: "/" }, { label: "Kebutuhan", href: "/kebutuhan" }, { label: k.label }]} />

                <header className="need-head">
                    <span className="need-icon material-symbols-rounded" aria-hidden="true">{k.icon}</span>
                    <h1>{k.h1}</h1>
                    {k.intro.map((p) => <p key={p}>{p}</p>)}
                    <div className="site-btn-row">
                        <a href={getWaLink(waText)} target="_blank" rel="noopener noreferrer" className="site-btn-wa">
                            <WaIcon size={18} /> Tanya Mbak Tila (gratis)
                        </a>
                        <a href="/#advisor" className="site-btn-outline">Coba Konsultasi AI</a>
                    </div>
                </header>

                <section className="pd-section">
                    <h2 className="pd-h2">Kebiasaan Sederhana yang Membantu</h2>
                    <div className="need-tips">
                        {k.tips.map((t, i) => (
                            <div key={t.title} className="need-tip">
                                <span className="need-tip-num">{i + 1}</span>
                                <div>
                                    <h3>{t.title}</h3>
                                    <p>{t.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="pd-section">
                    <h2 className="pd-h2">Produk yang Sering Dipilih</h2>
                    <div className="need-products">
                        {products.map((p) => (
                            <article key={p.id} className="need-product">
                                <Link to={`/produk/${p.id}`} className={`need-product-img card-img-bg-wrap ${p.bgStyle}`}>
                                    {p.image && <img src={p.image} alt={p.name} loading="lazy" />}
                                </Link>
                                <div className="need-product-body">
                                    <Link to={`/produk/${p.id}`} className="need-product-name">{p.name}</Link>
                                    <p>{p.description}</p>
                                    <div className="need-product-foot">
                                        <strong>{p.price}</strong>
                                        <a href={getWaLink(`Halo Mbak Tila, saya mau pesan ${p.name}`)} target="_blank" rel="noopener noreferrer" className="share-btn share-wa">
                                            <WaIcon size={14} /> Pesan
                                        </a>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="pd-section">
                    <h2 className="pd-h2">Pertanyaan yang Sering Ditanyakan</h2>
                    <div className="site-faq">
                        {k.faqs.map((f) => (
                            <details key={f.q}>
                                <summary>{f.q}</summary>
                                <p>{f.a}</p>
                            </details>
                        ))}
                    </div>
                </section>

                <div className="site-center">
                    <ShareBar path={path} title={k.h1} label="Bermanfaat? Bagikan" />
                </div>

                <section className="pd-section">
                    <h2 className="pd-h2">Kebutuhan Lainnya</h2>
                    <div className="need-chips">
                        {others.map((o) => (
                            <Link key={o.slug} to={`/kebutuhan/${o.slug}`} className="need-chip">
                                <span className="material-symbols-rounded" aria-hidden="true">{o.icon}</span>{o.label}
                            </Link>
                        ))}
                    </div>
                </section>

                <p className="health-disclaimer">
                    Informasi di halaman ini bersifat umum dan bukan nasihat medis. Produk bukan pengganti obat atau saran dokter.
                    Hasil pada setiap orang bisa berbeda. Bila keluhan berlanjut, konsultasikan dengan tenaga kesehatan.
                </p>
            </div>
        </SiteLayout>
    );
}
