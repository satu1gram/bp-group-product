// Konstanta situs yang dipakai bersama (halaman, SEO, prerender).

export const SITE_URL = "https://katalog.mitrabp.biz.id";
export const SITE_NAME = "Katalog British Propolis";
export const SELLER_NAME = "Mbak Tila";
export const SELLER_CITY = "Malang";
export const WA_NUMBER = "6287782697973";

export const DEFAULT_WA_MESSAGE = "Halo Mbak Tila, saya mau konsultasi produk British Propolis";

export function getWaLink(text?: string): string {
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text || DEFAULT_WA_MESSAGE)}`;
}

export function absoluteUrl(path: string): string {
    if (/^https?:\/\//.test(path)) return path;
    return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** Format tanggal Indonesia, konsisten antara build (UTC) dan browser. */
export function formatTanggal(value: string | Date | null | undefined): string {
    if (!value) return "";
    const d = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
    }).format(d);
}

/** Tanggal hari ini (YYYY-MM-DD) zona Asia/Jakarta. */
export function todayJakarta(now: Date = new Date()): string {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(now);
}
