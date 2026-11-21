// Konten dinamis dari Supabase: artikel "Catatan Tila" & promo bulanan.
import { supabase } from "@/integrations/supabase/client";
import { todayJakarta } from "./site";

export type ArticleAudience = "konsumen" | "mitra";
export type ArticleStatus = "draft" | "published";
export type ArticleCategory = "kisah" | "produk" | "sehat" | "bisnis" | "gaya-hidup";

/** Kategori (topik) artikel, urutan = urutan tampil di filter. */
export const ARTICLE_CATEGORIES: { key: ArticleCategory; label: string; icon: string; desc: string }[] = [
    { key: "kisah", label: "Kisah & Hikmah", icon: "auto_stories", desc: "Cerita pribadi, niat, dan nilai" },
    { key: "produk", label: "Mengenal Produk", icon: "inventory_2", desc: "Cek keaslian, beda varian, cara pakai" },
    { key: "sehat", label: "Hidup Sehat", icon: "favorite", desc: "Kebiasaan keluarga yang sehat" },
    { key: "bisnis", label: "Bisnis dari Rumah", icon: "handshake", desc: "Panduan praktis berjualan" },
    { key: "gaya-hidup", label: "Gaya Hidup & Rumah Tangga", icon: "home", desc: "Kebiasaan sehari-hari yang bermanfaat" },
];

export function categoryMeta(key: ArticleCategory) {
    return ARTICLE_CATEGORIES.find((c) => c.key === key) ?? ARTICLE_CATEGORIES[2];
}

/** Kategori artikel; bila belum diisi, diturunkan dari "untuk pembaca". */
export function resolveCategory(a: Pick<Article, "category" | "audience">): ArticleCategory {
    if (a.category && ARTICLE_CATEGORIES.some((c) => c.key === a.category)) return a.category;
    return a.audience === "mitra" ? "bisnis" : "sehat";
}

export interface Article {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string;
    cover_url: string | null;
    audience: ArticleAudience;
    /** Kosong sampai migrasi kategori dijalankan → lihat resolveCategory() */
    category?: ArticleCategory | null;
    status: ArticleStatus;
    keyword: string | null;
    published_at: string | null;
    created_at?: string;
    updated_at: string | null;
    /** Diisi saat prerender bila `content` dipangkas (halaman daftar) */
    reading_minutes?: number;
}

export interface Promo {
    id: string;
    title: string;
    description: string | null;
    terms: string | null;
    image_url: string | null;
    starts_at: string | null; // YYYY-MM-DD
    ends_at: string | null; // YYYY-MM-DD
    wa_message: string | null;
    is_active: boolean;
    sort_order: number;
    created_at?: string;
}

export const ARTICLE_COLUMNS_BASE =
    "id,slug,title,excerpt,content,cover_url,audience,status,keyword,published_at,updated_at";
export const ARTICLE_COLUMNS = `${ARTICLE_COLUMNS_BASE},category`;

/** True bila error Supabase berarti kolom `category` belum ada (migrasi belum dijalankan). */
export function isMissingCategoryColumn(err: { message?: string } | null | undefined): boolean {
    return Boolean(err?.message && /category/i.test(err.message));
}
export const PROMO_COLUMNS =
    "id,title,description,terms,image_url,starts_at,ends_at,wa_message,is_active,sort_order";

/** Promo aktif & masih dalam periode (zona Asia/Jakarta). */
export function isPromoRunning(p: Promo, today: string = todayJakarta()): boolean {
    if (!p.is_active) return false;
    if (p.starts_at && p.starts_at > today) return false;
    if (p.ends_at && p.ends_at < today) return false;
    return true;
}

export function sortPromos(list: Promo[]): Promo[] {
    return [...list].sort((a, b) => a.sort_order - b.sort_order || (a.ends_at ?? "").localeCompare(b.ends_at ?? ""));
}

export async function fetchPublishedArticles(): Promise<Article[]> {
    if (!supabase) return [];
    const run = (cols: string) =>
        supabase.from("articles").select(cols).eq("status", "published").order("published_at", { ascending: false });
    let { data, error } = await run(ARTICLE_COLUMNS);
    if (error && isMissingCategoryColumn(error)) ({ data, error } = await run(ARTICLE_COLUMNS_BASE));
    if (error) throw error;
    return (data ?? []) as unknown as Article[];
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
    if (!supabase) return null;
    const run = (cols: string) =>
        supabase.from("articles").select(cols).eq("slug", slug).eq("status", "published").maybeSingle();
    let { data, error } = await run(ARTICLE_COLUMNS);
    if (error && isMissingCategoryColumn(error)) ({ data, error } = await run(ARTICLE_COLUMNS_BASE));
    if (error) throw error;
    return (data as unknown as Article) ?? null;
}

export async function fetchActivePromos(): Promise<Promo[]> {
    if (!supabase) return [];
    const { data, error } = await supabase.from("promos").select(PROMO_COLUMNS).eq("is_active", true);
    if (error) throw error;
    return sortPromos(((data ?? []) as Promo[]).filter((p) => isPromoRunning(p)));
}

/** Perkiraan waktu baca (menit). */
export function readingMinutes(article: Pick<Article, "content" | "reading_minutes">): number {
    if (article.reading_minutes) return article.reading_minutes;
    const words = (article.content || "").trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
}

/** Versi ringan artikel untuk halaman daftar (isi dipangkas, waktu baca tetap benar). */
export function toListItem(article: Article): Article {
    return { ...article, reading_minutes: readingMinutes(article), content: article.content.slice(0, 600) };
}

/** Slug URL dari judul: "Cara Cek Propolis Asli" → "cara-cek-propolis-asli". */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/[\s-]+/g, "-")
        .slice(0, 80)
        .replace(/-+$/, "");
}
