// ============================================================
// generate-og.ts — membuat gambar pratinjau (Open Graph) 1200×630 JPG
// untuk WhatsApp/Facebook. WhatsApp tidak menampilkan pratinjau WebP,
// jadi gambar ini dibuat sekali lalu disimpan di public/og/.
//
// Jalankan ulang bila produk/harga berubah:
//   npx tsx scripts/generate-og.ts
// (butuh Playwright + Chromium; tidak dijalankan saat build Cloudflare)
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { KATALOG_PRODUCTS } from "../src/data/katalogProducts";

const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { chromium } = require("playwright");

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const outDir = path.join(root, "public", "og");
fs.mkdirSync(outDir, { recursive: true });

const dataUri = (rel: string) => {
    const file = path.join(root, "public", rel);
    const ext = path.extname(file).slice(1).replace("jpg", "jpeg");
    return `data:image/${ext};base64,${fs.readFileSync(file).toString("base64")}`;
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

interface Card {
    file: string;
    tag: string;
    title: string;
    sub: string;
    image: string;
    imageFit?: "cover" | "contain";
    badge?: string;
}

const cards: Card[] = [
    {
        file: "default.jpg",
        tag: "Katalog Resmi Mitra",
        title: "British Propolis Asli",
        sub: "Konsultasi produk gratis & pesan langsung via WhatsApp bersama Mbak Tila, Malang",
        image: "/images/produk/bp.webp",
    },
    {
        file: "mitra.jpg",
        tag: "Bisnis dari Rumah",
        title: "Berpenghasilan dari Rumah, Tetap Dekat dengan Anak",
        sub: "Mulai jadi mitra British Propolis, dibimbing langsung oleh Mbak Tila",
        image: "/images/bisnis/tila akbar umroh.jpeg",
    },
    {
        file: "promo.jpg",
        tag: "Program Resmi",
        title: "Promo British Propolis Bulan Ini",
        sub: "Cek program yang sedang berlaku & ambil promonya via WhatsApp",
        image: "/images/produk/bpgreen.webp",
    },
    {
        file: "artikel.jpg",
        tag: "Catatan Tila",
        title: "Cerita & Tips dari Mbak Tila",
        sub: "Tulisan mingguan seputar hidup sehat keluarga & bisnis dari rumah",
        image: "/images/bisnis/tila akbar umroh.jpeg",
    },
    {
        file: "panduan-bisnis.jpg",
        tag: "Panduan Gratis",
        title: "7 Langkah Mulai Bisnis British Propolis dari Rumah",
        sub: "Panduan praktis untuk ibu rumah tangga, karyawan & pensiunan",
        image: "/images/bisnis/tila akbar umroh.jpeg",
    },
    ...KATALOG_PRODUCTS.filter((p) => p.image).map((p) => ({
        file: `produk-${p.id}.jpg`,
        tag: p.badgeText,
        title: p.name,
        sub: p.tagline.replace(/^✨\s*/, ""),
        image: p.image!,
        badge: p.price,
    })),
];

const html = (c: Card) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@500;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;font-family:'DM Sans',sans-serif;background:#FAFAF7;display:flex;overflow:hidden}
.l{flex:1.15;padding:64px 56px 56px 72px;display:flex;flex-direction:column;justify-content:center;gap:22px}
.tag{align-self:flex-start;color:#3A7D44;background:#EBF5EC;font-weight:700;font-size:22px;letter-spacing:2px;text-transform:uppercase;padding:8px 18px;border-radius:999px}
h1{font-family:'DM Serif Display',serif;font-weight:400;font-size:${c.title.length > 34 ? 56 : 74}px;line-height:1.08;color:#1C2B1E}
p{font-size:28px;line-height:1.4;color:#5A6B5C}
.foot{margin-top:auto;display:flex;align-items:center;gap:16px;font-weight:700;font-size:24px;color:#2A5C32}
.price{background:#2A5C32;color:#fff;padding:8px 18px;border-radius:12px}
.r{flex:0.85;position:relative;background:#EBF5EC}
.r img{position:absolute;inset:0;width:100%;height:100%;object-fit:${c.imageFit ?? "cover"}}
.bar{position:absolute;left:0;top:0;bottom:0;width:10px;background:#3A7D44}
</style></head><body>
<div class="l">
  <span class="tag">${esc(c.tag)}</span>
  <h1>${esc(c.title)}</h1>
  <p>${esc(c.sub)}</p>
  <div class="foot">${c.badge ? `<span class="price">${esc(c.badge)}</span>` : ""}<span>katalog.mitrabp.biz.id</span></div>
</div>
<div class="r"><img src="${dataUri(c.image)}"><div class="bar"></div></div>
</body></html>`;

// Opsional: buat ulang sebagian saja, mis. `npx tsx scripts/generate-og.ts belgie-luxury-perfume`
const only = process.argv[2];
const selected = only ? cards.filter((c) => c.file.includes(only)) : cards;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const c of selected) {
    await page.setContent(html(c), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: path.join(outDir, c.file), type: "jpeg", quality: 82 });
    console.log("og:", c.file);
}
await browser.close();
