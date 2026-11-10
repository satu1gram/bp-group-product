// Gambar produk responsif: kotak kecil memakai versi 600px (±20 KB),
// layar lebar/retina boleh memakai versi 1200px. Versi -600.webp dibuat dengan
// `npx tsx scripts/generate-image-variants.ts`; bila belum ada, build memakai gambar asli.
export function productImg(src?: string): { src?: string; srcSet?: string } {
    if (!src || !src.startsWith("/images/produk/") || !src.endsWith(".webp")) return { src };
    const small = src.replace(/\.webp$/, "-600.webp");
    return { src: small, srcSet: `${small} 600w, ${src} 1200w` };
}

/** Versi kecil saja (thumbnail ≤ 300px). */
export function productThumb(src?: string): string | undefined {
    if (!src || !src.startsWith("/images/produk/") || !src.endsWith(".webp")) return src;
    return src.replace(/\.webp$/, "-600.webp");
}
