// ============================================================
// prerender.mjs — dijalankan setelah `vite build` (lihat package.json)
//
// 1. Ambil artikel terbit & promo dari Supabase (bila env tersedia).
// 2. Render setiap halaman ke HTML statis (beranda, produk, mitra, promo,
//    artikel) lengkap dengan <head> SEO & data terstruktur, supaya Google,
//    WhatsApp & Facebook bisa membacanya tanpa JavaScript.
// 3. Tulis dist/sitemap.xml.
//
// Artikel baru yang terbit setelah build tetap bisa dibuka (dirender di browser);
// agar ikut di-prerender & masuk sitemap, picu build ulang (deploy hook Cloudflare).
// ============================================================
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadEnv } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const env = loadEnv("production", root, "");
const SITE_URL = (env.SITE_URL || "https://katalog.mitrabp.biz.id").replace(/\/$/, "");

const ssr = await import(pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href);
const { render, KATALOG_PRODUCTS, ARTICLE_COLUMNS, PROMO_COLUMNS, toListItem } = ssr;

// ── 1. Data dari Supabase ──
async function fetchTable(table, query) {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return undefined;
  try {
    const res = await fetch(`${url}/rest/v1/${table}?${query}`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    return await res.json();
  } catch (err) {
    console.warn(`[prerender] gagal mengambil ${table}: ${err.message} → halaman tetap dibuat tanpa data ini`);
    return undefined;
  }
}

const articles = await fetchTable(
  "articles",
  `select=${ARTICLE_COLUMNS}&status=eq.published&order=published_at.desc`
);
const promos = await fetchTable("promos", `select=${PROMO_COLUMNS}&is_active=eq.true`);
const builtOn = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());
console.log(`[prerender] data: ${articles ? articles.length : "-"} artikel, ${promos ? promos.length : "-"} promo`);

// ── 2. Daftar halaman + data awal per halaman ──
const listItems = articles?.map(toListItem);
const pages = [
  { route: "/", data: { articles: articles?.slice(0, 3).map(toListItem), promos, builtOn }, priority: "1.0" },
  ...KATALOG_PRODUCTS.map((p) => ({ route: `/produk/${p.id}`, data: {}, priority: "0.9" })),
  { route: "/mitra", data: {}, priority: "0.8" },
  { route: "/panduan-bisnis", data: {}, priority: "0.8" },
  { route: "/promo", data: { promos, builtOn }, priority: "0.7" },
  { route: "/artikel", data: { articles: listItems }, priority: "0.8" },
  ...(articles ?? []).map((a) => ({
    route: `/artikel/${a.slug}`,
    data: {
      articles: [a, ...listItems.filter((o) => o.slug !== a.slug && o.audience === a.audience).slice(0, 3)],
    },
    lastmod: (a.updated_at || a.published_at || "").slice(0, 10),
    priority: "0.7",
  })),
];

const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");
const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
if (!SEO_BLOCK.test(template) || !template.includes('<div id="root"></div>')) {
  throw new Error("[prerender] penanda <!--seo:start/end--> atau <div id=\"root\"></div> tidak ditemukan di dist/index.html");
}

const safeJson = (obj) =>
  JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(new RegExp(String.fromCharCode(0x2028), "g"), "\\u2028")
    .replace(new RegExp(String.fromCharCode(0x2029), "g"), "\\u2029");

for (const { route, data } of pages) {
  const { html: appHtml, head } = await render(route, data);
  const dataScript = `<script>window.__INITIAL_DATA__=${safeJson(data)}</script>`;
  const html = template
    .replace(SEO_BLOCK, head)
    .replace('<div id="root"></div>', `<div id="root" data-prerender-path="${route}">${appHtml}</div>\n  ${dataScript}`);

  const outFile = route === "/" ? path.join(distDir, "index.html") : path.join(distDir, route.slice(1), "index.html");
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
  if (fs.existsSync(`${outFile}.gz`)) fs.writeFileSync(`${outFile}.gz`, zlib.gzipSync(html, { level: 9 }));
  console.log(`[prerender] ${route.padEnd(40)} ${(html.length / 1024).toFixed(1)} KB`);
}

// ── 3. sitemap.xml ──
const today = builtOn;
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) =>
      `  <url>\n    <loc>${SITE_URL}${p.route}</loc>\n    <lastmod>${p.lastmod || today}</lastmod>\n    <priority>${p.priority}</priority>\n  </url>`
  )
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap);
console.log(`[prerender] sitemap.xml (${pages.length} URL)`);

// Supabase client bisa menyisakan timer; pastikan proses build selesai
process.exit(0);
