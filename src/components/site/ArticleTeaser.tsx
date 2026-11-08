import { Link } from "react-router";
import { useArticles } from "@/lib/initialData";
import { ArticleCard } from "./ArticleCard";

/** 3 artikel terbaru "Catatan Tila" di beranda; tidak tampil bila belum ada artikel. */
export function ArticleTeaser() {
    const { data: articles } = useArticles();
    if (articles.length === 0) return null;
    return (
        <section className="world-section article-teaser" id="catatan-tila">
            <div className="container">
                <div className="site-section-head">
                    <span className="site-tag">Catatan Tila</span>
                    <h2>Cerita & Tips dari <em>Mbak Tila</em></h2>
                    <p>Tulisan mingguan seputar hidup sehat keluarga dan bisnis dari rumah.</p>
                </div>
                <div className="article-grid">
                    {articles.slice(0, 3).map(a => <ArticleCard key={a.id} article={a} />)}
                </div>
                <div className="site-center">
                    <Link to="/artikel" className="site-btn-outline">Baca semua Catatan Tila</Link>
                </div>
            </div>
        </section>
    );
}
