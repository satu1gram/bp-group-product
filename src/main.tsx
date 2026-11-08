import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import { initAnalytics } from "./lib/analytics";
import "./index.css";

const container = document.getElementById("root")!;
const tree = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Halaman yang sudah di-prerender saat build → hydrate; mode dev → render biasa
if (container.hasChildNodes()) {
  hydrateRoot(container, tree);
} else {
  createRoot(container).render(tree);
}

initAnalytics();
