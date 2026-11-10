import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import { initAnalytics } from "./lib/analytics";
import { InitialDataContext } from "./lib/initialData";
import "./index.css";
// Semua CSS halaman dimuat di <head> sejak awal, supaya HTML hasil prerender
// langsung tampil rapi (tanpa kedipan halaman polos / menu samping meluncur).
import "./styles/katalog.css";
import "./styles/ai-advisor.css";
import "./styles/pages.css";

const container = document.getElementById("root")!;
const tree = (
  <InitialDataContext.Provider value={window.__INITIAL_DATA__ ?? {}}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </InitialDataContext.Provider>
);

const normalize = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);
const prerenderedPath = container.dataset.prerenderPath;

// Hydrate hanya bila HTML ini memang hasil prerender untuk alamat yang dibuka.
// (Mis. artikel baru yang belum di-prerender dilayani dengan HTML beranda → render ulang.)
if (container.hasChildNodes() && prerenderedPath && normalize(prerenderedPath) === normalize(window.location.pathname)) {
  hydrateRoot(container, tree);
} else {
  container.innerHTML = "";
  createRoot(container).render(tree);
}

initAnalytics();
