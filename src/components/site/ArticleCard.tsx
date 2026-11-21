import { Link } from "react-router";
import type { Article } from "@/lib/content";
import { readingMinutes } from "@/lib/content";
import { plainText } from "@/lib/markdown";
import { formatTanggal } from "@/lib/site";

/**
 * Kartu artikel dengan ukuran seragam: gambar 16:9 (dipotong rapi), judul & ringkasan
 * dibatasi 3 baris, tautan "Baca selengkapnya" selalu di dasar kartu.
 */
export function ArticleCard({ article }: { article: Article }) {
    const excerpt = article.excerpt || plainText(article.content, 160);
    return (
        <Link to={`/artikel/${article.slug}`} className="article-card">
            <div className="article-card-img">
                {article.cover_url
                    ? <img src={article.cover_url} alt="" loading="lazy" decoding="async" width={640} height={360} />
                    : <span className="material-symbols-rounded" aria-hidden="true">{article.audience === 'mitra' ? 'handshake' : 'eco'}</span>}
            </div>
            <div className="article-card-body">
                <span className={`article-chip article-chip-${article.audience}`}>
                    {article.audience === 'mitra' ? 'Bisnis dari Rumah' : 'Hidup Sehat'}
                </span>
                <h3 className="article-card-title">{article.title}</h3>
                <p className="article-card-excerpt">{excerpt}</p>
                <div className="article-card-foot">
                    <span className="article-card-more">
                        Baca selengkapnya <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
                    </span>
                    <span className="article-card-meta">
                        {formatTanggal(article.published_at)} · {readingMinutes(article)} menit baca
                    </span>
                </div>
            </div>
        </Link>
    );
}
