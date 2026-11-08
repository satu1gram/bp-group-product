// Render Markdown artikel Tila → HTML.
// HTML mentah di dalam tulisan di-escape (tidak dieksekusi) demi keamanan.
import { Marked } from "marked";

function escapeHtml(s: string): string {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const md = new Marked({
    gfm: true,
    breaks: true,
    renderer: {
        html({ text }) {
            return escapeHtml(text);
        },
        link({ href, title, tokens }) {
            const text = this.parser.parseInline(tokens);
            const safeHref = /^(https?:|mailto:|tel:|\/|#)/i.test(href) ? href : "#";
            const external = /^https?:/i.test(safeHref) && !safeHref.includes("katalog.mitrabp.biz.id");
            const t = title ? ` title="${escapeHtml(title)}"` : "";
            const ext = external ? ' target="_blank" rel="noopener noreferrer"' : "";
            return `<a href="${escapeHtml(safeHref)}"${t}${ext}>${text}</a>`;
        },
        image({ href, title, text }) {
            const safeHref = /^(https?:|\/)/i.test(href) ? href : "";
            if (!safeHref) return "";
            const t = title ? ` title="${escapeHtml(title)}"` : "";
            return `<img src="${escapeHtml(safeHref)}" alt="${escapeHtml(text)}"${t} loading="lazy" />`;
        },
    },
});

export function renderMarkdown(source: string): string {
    return md.parse(source || "", { async: false }) as string;
}

/** Teks polos dari Markdown (untuk ringkasan & meta description). */
export function plainText(source: string, max = 160): string {
    const text = (source || "")
        .replace(/!\[[^\]]*]\([^)]*\)/g, "")
        .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
        .replace(/[#>*_`~-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    return text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : text;
}
