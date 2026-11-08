// Dipakai saat build (scripts/prerender.mjs) untuk menghasilkan HTML statis
// yang bisa langsung dibaca Google, WhatsApp, dan media sosial.
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router";
import { Writable } from "node:stream";
import App from "./App";

export { KATALOG_PRODUCTS } from "./data/katalogProducts";

export function render(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = "";
    const sink = new Writable({
      write(chunk, _enc, cb) {
        html += chunk.toString();
        cb();
      },
      final(cb) {
        resolve(html);
        cb();
      },
    });

    const stream = renderToPipeableStream(
      <StaticRouter location={url}>
        <App />
      </StaticRouter>,
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
