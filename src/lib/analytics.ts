// ============================================================
// analytics.ts — Google Analytics 4 + pelacakan klik WhatsApp
//
// Aktif hanya jika env VITE_GA4_ID diisi (contoh: G-XXXXXXXXXX).
// Atur di Cloudflare: Settings → Variables and Secrets (build), lalu deploy ulang.
// ============================================================

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;
const CLARITY_ID = import.meta.env.VITE_CLARITY_ID as string | undefined;
let initialized = false;

/** Kirim event ke GA4. Aman dipanggil walau GA belum aktif. */
export function trackEvent(name: string, params: GtagParams = {}): void {
    if (typeof window === "undefined" || !window.gtag) return;
    window.gtag("event", name, params);
}

/** Teks tombol tanpa nama ikon Material Symbols (mis. "chat_bubble"). */
function linkText(link: HTMLAnchorElement): string {
    const clone = link.cloneNode(true) as HTMLElement;
    clone.querySelectorAll(".material-symbols-rounded, svg").forEach((el) => el.remove());
    return (clone.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
}

/** Klik link wa.me di mana pun di halaman → event `click_whatsapp`. */
function handleDocumentClick(e: MouseEvent): void {
    const target = e.target as HTMLElement | null;
    const link = target?.closest?.("a[href*='wa.me']") as HTMLAnchorElement | null;
    if (!link) return;

    let message = "";
    try {
        message = new URL(link.href).searchParams.get("text") ?? "";
    } catch {
        /* abaikan URL tidak valid */
    }

    const code = message.match(/\[([KM]-[A-Z-]+)\]\s*$/)?.[1];
    const intent = code ? (code.startsWith("M-") ? "mitra" : "beli")
        : /mitra|bisnis|reseller|agen|paket/i.test(message) ? "mitra" : "beli";

    trackEvent("click_whatsapp", {
        section: link.closest("section[id], footer, nav, aside")?.id || link.closest("footer, nav, aside")?.tagName.toLowerCase() || "lainnya",
        cta_location: (link.closest("[data-cta]") as HTMLElement | null)?.dataset.cta || code || "lainnya",
        intent,
        code,
        link_text: linkText(link),
        wa_message: message.slice(0, 100),
    });
}

/** Kedalaman gulir 25/50/75/90% per halaman → event `scroll_depth`. */
function setupScrollDepth(): void {
    let sent = new Set<number>();
    let path = location.pathname;
    let ticking = false;
    const check = () => {
        ticking = false;
        if (location.pathname !== path) { path = location.pathname; sent = new Set(); }
        const max = document.documentElement.scrollHeight - innerHeight;
        if (max <= 0) return;
        const pct = (scrollY / max) * 100;
        for (const mark of [25, 50, 75, 90]) {
            if (pct >= mark && !sent.has(mark)) {
                sent.add(mark);
                trackEvent("scroll_depth", { percent: mark, page_path: path });
            }
        }
    };
    addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(check); } }, { passive: true });
}

/** Microsoft Clarity (gratis: rekaman sesi & peta gulir). Aktif bila VITE_CLARITY_ID diisi. */
function loadClarity(id: string): void {
    const w = window as unknown as { clarity?: ((...a: unknown[]) => void) & { q?: unknown[] } };
    w.clarity = w.clarity || Object.assign((...a: unknown[]) => { (w.clarity!.q = w.clarity!.q || []).push(a); }, {});
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.clarity.ms/tag/${encodeURIComponent(id)}`;
    document.head.appendChild(s);
}

export function initAnalytics(): void {
    if (initialized || typeof window === "undefined") return;
    initialized = true;

    if (GA4_ID) {
        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function gtag() {
            // eslint-disable-next-line prefer-rest-params
            window.dataLayer!.push(arguments);
        };
        window.gtag("js", new Date());
        window.gtag("config", GA4_ID);
    }

    if (CLARITY_ID) loadClarity(CLARITY_ID);

    document.addEventListener("click", handleDocumentClick, { capture: true });
    setupScrollDepth();
}
