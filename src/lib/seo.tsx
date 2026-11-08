// SEO per halaman.
// - Saat prerender (build): <Seo> menyimpan meta ke HeadContext, lalu
//   scripts/prerender.mjs menulisnya ke <head> HTML statis.
// - Di browser: <Seo> memperbarui judul & meta saat pindah halaman.
import { createContext, useContext, useEffect } from "react";
import { SITE_NAME, absoluteUrl } from "./site";

export interface PageMeta {
    title: string;
    description: string;
    path: string;
    image?: string;
    ogType?: "website" | "article" | "product";
    noindex?: boolean;
    jsonLd?: Record<string, unknown>[];
}

export interface HeadCollector {
    meta?: PageMeta;
}

export const HeadContext = createContext<HeadCollector | null>(null);

function escapeAttr(value: string): string {
    return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** HTML untuk <head>, dipakai prerender. */
export function buildHeadHtml(meta: PageMeta): string {
    const url = absoluteUrl(meta.path);
    const lines = [
        `<title>${escapeAttr(meta.title)}</title>`,
        `<meta name="description" content="${escapeAttr(meta.description)}" />`,
        `<link rel="canonical" href="${escapeAttr(url)}" />`,
        meta.noindex ? `<meta name="robots" content="noindex, nofollow" />` : "",
        `<meta property="og:type" content="${meta.ogType === "article" ? "article" : "website"}" />`,
        `<meta property="og:locale" content="id_ID" />`,
        `<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}" />`,
        `<meta property="og:url" content="${escapeAttr(url)}" />`,
        `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
        `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
        meta.image ? `<meta property="og:image" content="${escapeAttr(absoluteUrl(meta.image))}" />` : "",
        `<meta name="twitter:card" content="${meta.image ? "summary_large_image" : "summary"}" />`,
        ...(meta.jsonLd ?? []).map(
            (obj) =>
                `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", ...obj }).replace(/</g, "\\u003c")}</script>`
        ),
    ];
    return lines.filter(Boolean).join("\n  ");
}

function setMeta(selector: string, attr: "content" | "href", value: string | null) {
    let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
    if (value === null) {
        el?.remove();
        return;
    }
    if (!el) {
        const m = selector.match(/^(meta|link)\[(name|property|rel)="([^"]+)"\]$/);
        if (!m) return;
        el = document.createElement(m[1]) as HTMLMetaElement | HTMLLinkElement;
        el.setAttribute(m[2], m[3]);
        document.head.appendChild(el);
    }
    el.setAttribute(attr, value);
}

export function Seo(meta: PageMeta) {
    const collector = useContext(HeadContext);
    if (collector) collector.meta = meta; // hanya terisi saat prerender

    const { title, description, path, noindex, image } = meta;
    useEffect(() => {
        const url = absoluteUrl(path);
        document.title = title;
        setMeta('meta[name="description"]', "content", description);
        setMeta('link[rel="canonical"]', "href", url);
        setMeta('meta[name="robots"]', "content", noindex ? "noindex, nofollow" : null);
        setMeta('meta[property="og:url"]', "content", url);
        setMeta('meta[property="og:title"]', "content", title);
        setMeta('meta[property="og:description"]', "content", description);
        setMeta('meta[property="og:image"]', "content", image ? absoluteUrl(image) : null);
    }, [title, description, path, noindex, image]);

    return null;
}
