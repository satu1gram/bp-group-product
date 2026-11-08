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

    trackEvent("click_whatsapp", {
        section: link.closest("section[id], footer, nav, aside")?.id || link.closest("footer, nav, aside")?.tagName.toLowerCase() || "lainnya",
        link_text: linkText(link),
        wa_message: message.slice(0, 100),
    });
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

    document.addEventListener("click", handleDocumentClick, { capture: true });
}
