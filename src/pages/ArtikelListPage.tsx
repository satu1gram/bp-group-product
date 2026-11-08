import { useState } from "react";
import { SiteLayout, Breadcrumbs } from "@/components/site/SiteLayout";
import { ArticleCard } from "@/components/site/ArticleCard";
import { useArticles } from "@/lib/initialData";
import { Seo } from "@/lib/seo";
import { breadcrumbLd } from "@/lib/structuredData";
import type { ArticleAudience } from "@/lib/content";

const FILTERS: { key: "all" | ArticleAudience; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "konsumen", label: "Hidup Sehat" },
    { key: "mitra", label: "Bisnis dari Rumah" },
];

export default function ArtikelListPage() {
    const { data: articles, loading } = useArticles();
    const [filter, setFilter] = useState<"all" | ArticleAudience>("all");
    const shown = filter === "all" ? articles : articles.filter((a) => a.audience === filter);

    return (
        <SiteLayout>
            <Seo
                title="Catatan Tila – Tips Hidup Sehat & Bisnis dari Rumah"
                description="Tulisan mingguan Mbak Tila, mantan dosen dan ibu 3 anak: tips hidup sehat keluarga, mengenal produk British Propolis, dan cerita membangun bisnis dari rumah."
                path="/artikel"
                image="/og/artikel.jpg"
                jsonLd={[
                    breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Catatan Tila", path: "/artikel" }]),
                    { "@type": "Blog", name: "Catatan Tila", inLanguage: "id-ID", author: { "@type": "Person", name: "Tila" } },
                ]}
            />
            <div className="container site-container">
                <Breadcrumbs items={[{ label: "Beranda", href: "/" }, { label: "Catatan Tila" }]} />

                <header className="site-page-head">
                    <span className="site-tag">Catatan Tila</span>
                    <h1>Cerita & Tips dari <em>Mbak Tila</em></h1>
                    <p>Mantan dosen, ibu 3 anak, dan mitra British Propolis dari Malang. Setiap minggu berbagi soal hidup sehat keluarga dan bisnis dari rumah.</p>
                </header>

                <div className="compact-filter-chips article-filters" role="tablist">
                    {FILTERS.map((f) => (
                        <button key={f.key} type="button" role="tab" aria-selected={filter === f.key}
                            className={`cfc-chip ${filter === f.key ? "active" : ""}`} onClick={() => setFilter(f.key)}>
                            {f.label}
                        </button>
                    ))}
                </div>

                {loading && articles.length === 0 ? (
                    <div className="article-grid" aria-busy="true">
                        {[0, 1, 2].map((i) => <div key={i} className="article-card promo-skeleton" />)}
                    </div>
                ) : shown.length > 0 ? (
                    <div className="article-grid">
                        {shown.map((a) => <ArticleCard key={a.id} article={a} />)}
                    </div>
                ) : (
                    <div className="site-empty">
                        <span className="material-symbols-rounded" aria-hidden="true">edit_note</span>
                        <h2>Tulisan pertama segera terbit</h2>
                        <p>Mbak Tila sedang menyiapkan Catatan Tila. Nantikan setiap minggu ya.</p>
                    </div>
                )}
            </div>
        </SiteLayout>
    );
}
