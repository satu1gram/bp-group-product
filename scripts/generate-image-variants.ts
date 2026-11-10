// ============================================================
// generate-image-variants.ts — membuat versi kecil (600px) gambar produk
// agar kartu produk di HP lebih ringan. Jalankan setelah menambah/mengganti
// gambar di public/images/produk/:
//   npx tsx scripts/generate-image-variants.ts
// (butuh Playwright + Chromium; tidak dijalankan saat build Cloudflare —
//  bila versi kecil belum ada, build otomatis memakai gambar aslinya)
// ============================================================
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { chromium } = require("playwright");

const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "public", "images", "produk");
const files = fs.readdirSync(dir).filter((f) => f.endsWith(".webp") && !f.endsWith("-600.webp"));

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent("<canvas id=c></canvas>");
for (const f of files) {
    const data = "data:image/webp;base64," + fs.readFileSync(path.join(dir, f)).toString("base64");
    const url: string = await page.evaluate(async (src: string) => {
        const img = new Image();
        img.src = src;
        await img.decode();
        const c = document.getElementById("c") as HTMLCanvasElement;
        const s = Math.min(1, 600 / img.naturalWidth);
        c.width = Math.round(img.naturalWidth * s);
        c.height = Math.round(img.naturalHeight * s);
        const ctx = c.getContext("2d")!;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, c.width, c.height);
        return c.toDataURL("image/webp", 0.82);
    }, data);
    const out = path.join(dir, f.replace(/\.webp$/, "-600.webp"));
    fs.writeFileSync(out, Buffer.from(url.split(",")[1], "base64"));
    console.log("600px:", path.basename(out));
}
await browser.close();
