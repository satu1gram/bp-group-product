/// <reference types="node" />
// Dipakai saat build (scripts/prerender.mjs) untuk menghasilkan HTML statis
// yang bisa langsung dibaca Google, WhatsApp, dan media sosial.
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router";
import { Writable } from "node:stream";
import App from "./App";
import { HeadContext, buildHeadHtml, type HeadCollector } from "./lib/seo";
import { InitialDataContext, type InitialData } from "./lib/initialData";

export { KATALOG_PRODUCTS } from "./data/katalogProducts";
export { ARTICLE_COLUMNS, PROMO_COLUMNS } from "./lib/content";
export { buildHeadHtml };

export interface RenderResult {
    html: string;
    head: string;
}

export function render(url: string, data: InitialData = {}): Promise<RenderResult> {
    const collector: HeadCollector = {};
    return new Promise((resolve, reject) => {
        let html = "";
        const sink = new Writable({
            write(chunk, _enc, cb) {
                html += chunk.toString();
                cb();
            },
            final(cb) {
                if (!collector.meta) {
                    reject(new Error(`[prerender] halaman ${url} tidak memasang <Seo>`));
                } else {
                    resolve({ html, head: buildHeadHtml(collector.meta) });
                }
                cb();
            },
        });

        const stream = renderToPipeableStream(
            <HeadContext.Provider value={collector}>
                <InitialDataContext.Provider value={data}>
                    <StaticRouter location={url}>
                        <App />
                    </StaticRouter>
                </InitialDataContext.Provider>
            </HeadContext.Provider>,
            {
                // Tunggu sampai semua komponen lazy selesai dimuat
                onAllReady() {
                    stream.pipe(sink);
                },
                onShellError: reject,
                onError(err) {
                    reject(err);
                },
            }
        );
    });
}
export { toListItem } from "./lib/content";
