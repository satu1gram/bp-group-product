import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router";
import NotFound from "./pages/NotFound";
import { lazy, Suspense } from "react";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { PWAUpdatePrompt } from "@/components/PWAUpdatePrompt";

const KatalogProdukPage = lazy(() => import("./pages/KatalogProdukPage"));

function PageLoader({ variant }: { variant?: 'default' | 'katalog' | 'dashboard' | 'list' }) {
  return <LoadingScreen variant={variant} />;
}

const App = () => (
  <>
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
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={
          <Suspense fallback={<PageLoader variant="katalog" />}><KatalogProdukPage /></Suspense>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;
