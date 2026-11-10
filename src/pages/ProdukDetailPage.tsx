import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { KATALOG_PRODUCTS } from "@/data/katalogProducts";
import { getProductFaqs } from "@/data/productFaq";
import { KEBUTUHAN } from "@/data/kebutuhan";
import { SiteLayout, Breadcrumbs } from "@/components/site/SiteLayout";
import { WaIcon } from "@/components/site/WaIcon";
import { ShareBar } from "@/components/site/ShareBar";
import { Seo } from "@/lib/seo";
import { getWaLink, SITE_URL } from "@/lib/site";
import { breadcrumbLd, faqLd, productLd } from "@/lib/structuredData";
import { productImg, productThumb } from "@/lib/img";
import NotFound from "./NotFound";

const CATEGORY_LABEL: Record<string, string> = {
    propolis: "Propolis",
    suplemen: "Suplemen",
    skincare: "Skincare",
    natural: "Natural",
    parfum: "Parfum",
};

export default function ProdukDetailPage() {
    const { slug = "" } = useParams();
    const product = KATALOG_PRODUCTS.find((p) => p.id === slug);
    const [showTier, setShowTier] = useState(false);

    const related = useMemo(
        () => (product ? KATALOG_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3) : []),
        [product]
    );

    if (!product) return <NotFound />;

    const path = `/produk/${product.id}`;
    const faqs = getProductFaqs(product);
    const orderMsg = `Halo Mbak Tila, saya mau pesan ${product.name}. Bisa dibantu?`;
    const askMsg = `Halo Mbak Tila, saya mau tanya-tanya dulu soal ${product.name}`;

    return (
        <SiteLayout waMessage={askMsg}>
            <Seo
                title={`${product.name} – Harga, Manfaat & Cara Pesan | Katalog British Propolis`}
                description={`${product.name}: ${product.description} Harga ${product.price}. Pesan via WhatsApp bersama Mbak Tila, Malang.`.slice(0, 300)}
                path={path}
                image={`/og/produk-${product.id}.jpg`}
                ogType="product"
                jsonLd={[
                    productLd(product, `${SITE_URL}${path}`),
                    breadcrumbLd([
                        { name: "Beranda", path: "/" },
                        { name: "Produk", path: "/#produk" },
                        { name: product.name, path },
                    ]),
                    faqLd(faqs),
                ]}
            />

            <div className="container site-container">
                <Breadcrumbs items={[{ label: "Beranda", href: "/" }, { label: "Produk", href: "/#produk" }, { label: product.name }]} />

                <article className="pd-hero">
                    <div className={`pd-img card-img-bg-wrap ${product.bgStyle}`}>
                        {product.image
                            ? <img {...productImg(product.image)} sizes="(max-width: 860px) 92vw, 520px" alt={product.name}
                                width={1200} height={805} decoding="async" {...{ fetchpriority: "high" }}
                                style={product.imagePosition ? { objectPosition: product.imagePosition } : undefined} />
                            : <span className="material-symbols-rounded" aria-hidden="true">{product.emoji}</span>}
                    </div>

                    <div className="pd-info">
                        <div className="pd-chips">
                            {product.isNew && <span className="new-badge new-badge-inline">BARU</span>}
                            <span className={`card-badge badge-${product.badgeColor}`}>{product.badgeText}</span>
                            <span className="pd-cat">{CATEGORY_LABEL[product.category] ?? product.category}</span>
                        </div>
                        <h1 className="pd-title">{product.name}</h1>
                        <p className="pd-tagline">{product.tagline}</p>
                        <p className="pd-desc">{product.description}</p>

                        <ul className="pd-benefits">
                            {product.benefits.map((b) => (
                                <li key={b}><span className="material-symbols-rounded" aria-hidden="true">check_circle</span>{b}</li>
                            ))}
                        </ul>

                        <div className="pd-specs">
                            {product.specs.map((s) => (
                                <span key={s.text} className="spec-tag">
                                    <span className="material-symbols-rounded" aria-hidden="true">{s.icon}</span>{s.text}
                                </span>
                            ))}
                        </div>

                        {product.nomorRegistrasi && (
                            <a className="pd-reg" href="https://cekbpom.pom.go.id/" target="_blank" rel="noopener noreferrer">
                                <span className="material-symbols-rounded" aria-hidden="true">verified_user</span>
                                No. Reg BPOM: <strong>{product.nomorRegistrasi}</strong>
                                <span className="pd-reg-cek">Cek di BPOM ↗</span>
                            </a>
                        )}

                        <div className="pd-price-box">
                            <div className="pd-price-row">
                                <span className="pd-price">{product.price}</span>
                                <span className="pd-price-note">{product.priceNote}</span>
                            </div>
                            {product.hargaTier && product.hargaTier.length > 0 && (
                                <>
                                    <button type="button" className="price-tier-toggle" aria-expanded={showTier}
                                        onClick={() => setShowTier((v) => !v)}>
                                        <span className="material-symbols-rounded" style={{ fontSize: '14px' }}>sell</span>
                                        Harga beli banyak / mitra
                                        <span className="material-symbols-rounded" style={{ fontSize: '14px', marginLeft: 'auto', transform: showTier ? 'rotate(180deg)' : 'none' }}>expand_more</span>
                                    </button>
                                    {showTier && (
                                        <div className="price-tier-table">
                                            {product.hargaTier.map((tier) => (
                                                <div key={tier.label} className="price-tier-row">
                                                    <span className="tier-label">{tier.label} <span className="tier-qty">({tier.minQty})</span></span>
                                                    <span className="tier-price">{tier.harga}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="pd-cta">
                                <a href={getWaLink(orderMsg)} target="_blank" rel="noopener noreferrer" className="site-btn-wa">
                                    <WaIcon size={18} /> Pesan via WhatsApp
                                </a>
                                <a href={getWaLink(askMsg)} target="_blank" rel="noopener noreferrer" className="site-btn-outline">
                                    Tanya dulu (gratis)
                                </a>
                            </div>
                        </div>
                        <ShareBar path={path} title={`${product.name} – ${product.tagline.replace(/^✨\s*/, "")}`} />
                    </div>
                </article>

                <section className="pd-section">
                    <h2 className="pd-h2">Pertanyaan yang Sering Ditanyakan</h2>
                    <div className="site-faq">
                        {faqs.map((f) => (
                            <details key={f.q}>
                                <summary>{f.q}</summary>
                                <p>{f.a}</p>
                            </details>
                        ))}
                    </div>
                </section>

                {KEBUTUHAN.some((k) => k.productIds.includes(product.id)) && (
                    <section className="pd-section">
                        <h2 className="pd-h2">Sering Dipilih untuk</h2>
                        <div className="need-chips">
                            {KEBUTUHAN.filter((k) => k.productIds.includes(product.id)).map((k) => (
                                <Link key={k.slug} to={`/kebutuhan/${k.slug}`} className="need-chip">
                                    <span className="material-symbols-rounded" aria-hidden="true">{k.icon}</span>{k.label}
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <section className="pd-section pd-consult">
                    <div>
                        <h2 className="pd-h2">Masih bingung produk mana yang cocok?</h2>
                        <p>Ceritakan keluhanmu, AI kami bantu rekomendasikan produk dalam hitungan detik. Gratis.</p>
                    </div>
                    <a href="/#advisor" className="site-btn-primary">Coba Konsultasi AI</a>
                </section>

                {related.length > 0 && (
                    <section className="pd-section">
                        <h2 className="pd-h2">Produk {CATEGORY_LABEL[product.category]} Lainnya</h2>
                        <div className="pd-related">
                            {related.map((r) => (
                                <Link key={r.id} to={`/produk/${r.id}`} className="pd-related-card">
                                    <div className={`pd-related-img card-img-bg-wrap ${r.bgStyle}`}>
                                        {r.image && <img src={productThumb(r.image)} alt={r.name} loading="lazy" width={64} height={64} />}
                                    </div>
                                    <div>
                                        <div className="pd-related-name">{r.name}</div>
                                        <div className="pd-related-price">{r.price}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <p className="health-disclaimer">
                    {product.category === "parfum" || product.category === "skincare"
                        ? "Hasil dan kesan pemakaian bisa berbeda pada setiap orang. Baca cara pakai dan peringatan di kemasan sebelum digunakan."
                        : "Informasi produk mengacu pada klaim yang diizinkan. Produk ini bukan pengganti obat atau saran dokter. Hasil pada setiap orang bisa berbeda. Baca aturan pakai dan peringatan di kemasan."}
                </p>
            </div>
        </SiteLayout>
    );
}
