import { Link, useParams } from "react-router";
import { SiteLayout, Breadcrumbs } from "@/components/site/SiteLayout";
import { ArticleCard } from "@/components/site/ArticleCard";
import { WaIcon } from "@/components/site/WaIcon";
import { ShareBar } from "@/components/site/ShareBar";
import { useArticle, useArticles } from "@/lib/initialData";
import { readingMinutes } from "@/lib/content";
import { plainText, renderMarkdown } from "@/lib/markdown";
import { Seo } from "@/lib/seo";
import { SITE_URL, absoluteUrl, formatTanggal, getWaLink } from "@/lib/site";
import { breadcrumbLd } from "@/lib/structuredData";
import NotFound from "./NotFound";

export default function ArtikelDetailPage() {
    const { slug = "" } = useParams();
    const { data: article, loading } = useArticle(slug);
    const { data: all } = useArticles();

    if (!article) {
        if (loading) {
            return (
                <SiteLayout>
                    <div className="container site-container"><div className="article-skeleton promo-skeleton" aria-busy="true" /></div>
                </SiteLayout>
            );
        }
        return <NotFound />;
    }

    const path = `/artikel/${article.slug}`;
    const description = article.excerpt || plainText(article.content, 155);
    const isMitra = article.audience === "mitra";
    const waText = isMitra
        ? `Halo Mbak Tila, saya habis baca "${article.title}". Saya mau ngobrol soal bisnis dari rumah.`
        : `Halo Mbak Tila, saya habis baca "${article.title}". Mau tanya produk yang cocok untuk saya.`;
    const others = all.filter((a) => a.slug !== article.slug && a.audience === article.audience).slice(0, 3);

    return (
        <SiteLayout waMessage={waText}>
            <Seo
                title={`${article.title} | Catatan Tila`}
                description={description}
                path={path}
                image={article.cover_url ?? "/og/artikel.jpg"}
                ogType="article"
                jsonLd={[
                    {
                        "@type": "BlogPosting",
                        headline: article.title,
                        description,
                        ...(article.cover_url ? { image: absoluteUrl(article.cover_url) } : {}),
                        datePublished: article.published_at,
                        dateModified: article.updated_at ?? article.published_at,
                        inLanguage: "id-ID",
                        mainEntityOfPage: `${SITE_URL}${path}`,
                        author: {
                            "@type": "Person",
                            name: "Tila",
                            description: "Mantan dosen, ibu 3 anak, mitra British Propolis di Malang",
                            url: `${SITE_URL}/mitra`,
                        },
                        publisher: { "@type": "Organization", name: "Katalog British Propolis", url: `${SITE_URL}/` },
                    },
                    breadcrumbLd([
                        { name: "Beranda", path: "/" },
                        { name: "Catatan Tila", path: "/artikel" },
                        { name: article.title, path },
                    ]),
                ]}
            />
            <div className="container site-container">
                <Breadcrumbs items={[{ label: "Beranda", href: "/" }, { label: "Catatan Tila", href: "/artikel" }, { label: article.title }]} />

                <article className="article-detail">
                    <header>
                        <span className={`article-chip article-chip-${article.audience}`}>
                            {isMitra ? "Bisnis dari Rumah" : "Hidup Sehat"}
                        </span>
                        <h1>{article.title}</h1>
                        <div className="article-byline">
                            <img src="/images/bisnis/tila akbar umroh.jpeg" alt="" aria-hidden="true" />
                            <div>
                                <strong>Mbak Tila</strong>
                                <span>{formatTanggal(article.published_at)} · {readingMinutes(article)} menit baca</span>
                            </div>
                        </div>
                    </header>

                    {article.cover_url && <img className="article-cover" src={article.cover_url} alt={article.title} />}

                    <div className="article-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }} />

                    <ShareBar path={path} title={article.title} label="Bermanfaat? Bagikan" />

                    <aside className="article-cta">
                        {isMitra ? (
                            <>
                                <h2>Tertarik memulai bisnis dari rumah?</h2>
                                <p>Mulai dari panduan gratis 7 langkah, atau lihat program mitra dan pilihan paketnya.</p>
                                <div className="site-btn-row">
                                    <Link to="/panduan-bisnis" className="site-btn-primary">Panduan Gratis</Link>
                                    <Link to="/mitra" className="site-btn-outline">Program Mitra</Link>
                                    <a href={getWaLink(waText)} target="_blank" rel="noopener noreferrer" className="site-btn-wa">
                                        <WaIcon size={18} /> Ngobrol dengan Tila
                                    </a>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2>Mau tahu produk yang cocok untukmu?</h2>
                                <p>Tanya langsung ke Mbak Tila, atau coba konsultasi AI gratis di katalog.</p>
                                <div className="site-btn-row">
                                    <a href={getWaLink(waText)} target="_blank" rel="noopener noreferrer" className="site-btn-wa">
                                        <WaIcon size={18} /> Tanya Mbak Tila
                                    </a>
                                    <a href="/#advisor" className="site-btn-outline">Konsultasi AI</a>
                                </div>
                            </>
                        )}
                    </aside>

                    {!isMitra && (
                        <p className="health-disclaimer">
                            Tulisan ini berbagi pengalaman dan informasi umum, bukan nasihat medis. Untuk keluhan kesehatan,
                            konsultasikan dengan dokter atau tenaga kesehatan.
                        </p>
                    )}
                </article>

                {others.length > 0 && (
                    <section className="pd-section">
                        <h2 className="pd-h2">Catatan Tila Lainnya</h2>
                        <div className="article-grid">
                            {others.map((a) => <ArticleCard key={a.id} article={a} />)}
                        </div>
                    </section>
                )}
            </div>
        </SiteLayout>
    );
}
