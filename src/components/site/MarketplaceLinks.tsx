import { trackEvent } from "@/lib/analytics";
import { MARKETPLACES } from "@/data/marketplace";

/** Tombol ke toko marketplace (pilihan kedua setelah WhatsApp). Tidak tampil bila belum ada toko. */
export function MarketplaceLinks({ placement, product, label = "Lebih suka belanja di marketplace?" }: {
    placement: string;
    product?: string;
    label?: string;
}) {
    if (MARKETPLACES.length === 0) return null;
    return (
        <div className="market-links">
            <span className="market-label">{label}</span>
            <span className="market-btns">
                {MARKETPLACES.map((m) => (
                    <a key={m.key} href={m.url} target="_blank" rel="noopener noreferrer" className={`market-btn market-${m.key}`}
                        onClick={() => trackEvent("click_marketplace", { platform: m.key, placement, product })}>
                        <span className="material-symbols-rounded" aria-hidden="true">storefront</span>
                        Toko di {m.name}
                    </a>
                ))}
            </span>
        </div>
    );
}
