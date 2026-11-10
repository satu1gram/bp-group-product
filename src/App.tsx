import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Routes, Route, useLocation } from "react-router";
import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { PWAUpdatePrompt } from "@/components/PWAUpdatePrompt";

const KatalogProdukPage = lazy(() => import("./pages/KatalogProdukPage"));
const ProdukDetailPage = lazy(() => import("./pages/ProdukDetailPage"));
const MitraPage = lazy(() => import("./pages/MitraPage"));
const PromoPage = lazy(() => import("./pages/PromoPage"));
const ArtikelListPage = lazy(() => import("./pages/ArtikelListPage"));
const ArtikelDetailPage = lazy(() => import("./pages/ArtikelDetailPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const PanduanBisnisPage = lazy(() => import("./pages/PanduanBisnisPage"));
const KebutuhanPage = lazy(() => import("./pages/KebutuhanPage"));
const KebutuhanIndexPage = lazy(() => import("./pages/KebutuhanIndexPage"));
const MalangPage = lazy(() => import("./pages/MalangPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

/** Pindah halaman → mulai dari atas; bila ada #anchor → gulir ke bagian itu (tunggu halaman lazy termuat). */
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    let tries = 0;
    const timer = window.setInterval(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (el || ++tries > 30) {
        window.clearInterval(timer);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [pathname, hash]);
  return null;
}

function page(el: ReactNode, variant: 'default' | 'katalog' = 'default') {
  return <Suspense fallback={<PageLoader variant={variant} />}>{el}</Suspense>;
}

function PageLoader({ variant }: { variant?: 'default' | 'katalog' | 'dashboard' | 'list' }) {
  return <LoadingScreen variant={variant} />;
}

/**
 * Hanya dirender di browser (setelah mount), supaya HTML hasil prerender
 * identik dengan render pertama di klien saat hydrate.
 */
function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? <>{children}</> : null;
}

// Router dipasang di luar: BrowserRouter di main.tsx, StaticRouter di entry-server.tsx
const App = () => (
  <>
    <ClientOnly>
      <Toaster />
      <PWAUpdatePrompt />
      <Sonner
        position="top-center"
        duration={4000}
        richColors
        expand
        toastOptions={{
          className: "w-full sm:max-w-md",
          classNames: {
            toast: "group toast px-5 py-4 rounded-[1.5rem] shadow-2xl border-2 flex items-center gap-4 bg-white/95 backdrop-blur-md transition-all active:scale-95",
            success: "text-emerald-700 border-emerald-100",
            error: "text-red-700 border-red-100",
            warning: "text-amber-700 border-amber-100",
            info: "text-slate-800 border-slate-100",
            title: "font-black text-[15px] tracking-tight leading-none",
            description: "font-bold text-[13px] opacity-70",
            actionButton: "bg-emerald-600 text-white font-black rounded-xl px-4 py-2 text-xs",
            cancelButton: "bg-slate-100 text-slate-500 font-bold rounded-xl px-4 py-2 text-xs",
          },
        }}
      />
    </ClientOnly>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={page(<KatalogProdukPage />, 'katalog')} />
      <Route path="/produk/:slug" element={page(<ProdukDetailPage />)} />
      <Route path="/mitra" element={page(<MitraPage />)} />
      <Route path="/panduan-bisnis" element={page(<PanduanBisnisPage />)} />
      <Route path="/kebutuhan" element={page(<KebutuhanIndexPage />)} />
      <Route path="/kebutuhan/:slug" element={page(<KebutuhanPage />)} />
      <Route path="/british-propolis-malang" element={page(<MalangPage />)} />
      <Route path="/promo" element={page(<PromoPage />)} />
      <Route path="/artikel" element={page(<ArtikelListPage />)} />
      <Route path="/artikel/:slug" element={page(<ArtikelDetailPage />)} />
      <Route path="/admin" element={page(<AdminPage />)} />
      <Route path="*" element={page(<NotFound />)} />
    </Routes>
  </>
);

export default App;
