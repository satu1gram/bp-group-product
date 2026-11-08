import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { absoluteUrl } from "@/lib/site";
import { WaIcon } from "./WaIcon";

/**
 * Tombol bagikan: WhatsApp, Facebook, salin link (+ menu bagikan bawaan HP bila ada).
 * Link diberi penanda UTM agar sumber kunjungan terlihat di GA4.
 */
export function ShareBar({ path, title, label = "Bagikan" }: { path: string; title: string; label?: string }) {
    const [copied, setCopied] = useState(false);
    const withUtm = (source: string) => `${absoluteUrl(path)}?utm_source=${source}&utm_medium=share`;

    const waHref = `https://wa.me/?text=${encodeURIComponent(`${title}\n${withUtm("whatsapp")}`)}`;
    const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(withUtm("facebook"))}`;

    const track = (method: string) => trackEvent("share", { method, content_path: path });

    const copy = async () => {
        const url = withUtm("salin");
        try {
            if (navigator.share) {
                await navigator.share({ title, url });
                track("native");
                return;
            }
            await navigator.clipboard.writeText(url);
            setCopied(true);
            track("copy");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* dibatalkan pengguna */
        }
    };

    return (
        <div className="share-bar" aria-label={label}>
            <span className="share-label">{label}:</span>
            <a className="share-btn share-wa" href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp")}
                aria-label="Bagikan ke WhatsApp">
                <WaIcon size={16} /> WhatsApp
            </a>
            <a className="share-btn share-fb" href={fbHref} target="_blank" rel="noopener noreferrer" onClick={() => track("facebook")}
                aria-label="Bagikan ke Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07" /></svg>
                Facebook
            </a>
            <button type="button" className="share-btn" onClick={copy} aria-live="polite">
                <span className="material-symbols-rounded" aria-hidden="true">{copied ? "check" : "link"}</span>
                {copied ? "Tersalin" : "Salin link"}
            </button>
        </div>
    );
}
