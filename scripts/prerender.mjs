// ============================================================
// prerender.mjs — dijalankan setelah `vite build` (lihat package.json)
//
// 1. Render halaman ke HTML statis → isi <div id="root"> di dist/index.html
//    supaya Google, WhatsApp & Facebook bisa membaca isi halaman tanpa JavaScript.
// 2. Sisipkan data terstruktur (JSON-LD) produk & penjual.
// 3. Tulis dist/sitemap.xml.
// ============================================================
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(root, "dist");
const ssrEntry = path.join(root, "dist-ssr", "entry-server.js");
const SITE_URL = (process.env.SITE_URL || "https://katalog.mitrabp.biz.id").replace(/\/$/, "");
const WA_NUMBER = "+6287782697973";

// Halaman yang di-prerender. Tambahkan rute baru di sini (mis. /promo, /artikel/...).
const ROUTES = ["/"];

const { render, KATALOG_PRODUCTS } = await import(pathToFileURL(ssrEntry).href);

const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");
if (!template.includes('<div id="root"></div>')) {
  throw new Error('[prerender] <div id="root"></div> tidak ditemukan di dist/index.html');
}

function brandOf(name) {
  if (name.startsWith("Belgie")) return "Belgie";
  if (name.startsWith("Steffi")) return "Steffi";
  return "British Propolis";
}

function priceNumber(price) {
  return String(price).replace(/[^\d]/g, "");
}

function buildJsonLd() {
  const sellerId = `${SITE_URL}/#penjual`;
  const graph = [
    {
      "@type": "Store",
      "@id": sellerId,
      name: "Katalog British Propolis – Mbak Tila",
      url: `${SITE_URL}/`,
      telephone: WA_NUMBER,
      image: `${SITE_URL}/images/produk/bp.webp`,
      description:
        "Mitra British Propolis di Malang. Konsultasi produk gratis dan pemesanan via WhatsApp, kirim ke seluruh Indonesia.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Malang",
        addressRegion: "Jawa Timur",
        addressCountry: "ID",
      },
      areaServed: { "@type": "Country", name: "Indonesia" },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Katalog British Propolis",
      inLanguage: "id-ID",
      publisher: { "@id": sellerId },
    },
    {
      "@type": "ItemList",
      name: "Produk British Propolis",
      itemListElement: KATALOG_PRODUCTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: p.name,
          description: p.description,
          brand: { "@type": "Brand", name: brandOf(p.name) },
          ...(p.image ? { image: `${SITE_URL}${p.image}` } : {}),
          ...(p.nomorRegistrasi ? { sku: p.nomorRegistrasi } : {}),
          offers: {
            "@type": "Offer",
            price: priceNumber(p.price),
            priceCurrency: "IDR",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/#produk`,
            seller: { "@id": sellerId },
          },
        },
      })),
    },
  ];
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
  // Cegah `</script>` di dalam teks memutus tag
  return `<script type="application/ld+json">${json.replace(/</g, "\\u003c")}</script>`;
}

for (const route of ROUTES) {
  const appHtml = await render(route);
  let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  if (route === "/") html = html.replace("</head>", `  ${buildJsonLd()}\n</head>`);

  const outFile =
    route === "/" ? path.join(distDir, "index.html") : path.join(distDir, route.replace(/^\//, ""), "index.html");
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, html);
  // Perbarui versi .gz agar tidak basi (dibuat oleh vite-plugin-compression)
  if (fs.existsSync(`${outFile}.gz`)) fs.writeFileSync(`${outFile}.gz`, zlib.gzipSync(html, { level: 9 }));
  console.log(`[prerender] ${route} → ${path.relative(root, outFile)} (${(appHtml.length / 1024).toFixed(1)} KB)`);
}

// ── sitemap.xml ──
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((r) => `  <url>\n    <loc>${SITE_URL}${r}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap);
console.log(`[prerender] sitemap.xml (${ROUTES.length} URL)`);

// Supabase client bisa menyisakan timer; pastikan proses build selesai
process.exit(0);
