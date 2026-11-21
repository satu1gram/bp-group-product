import { trackEvent } from "@/lib/analytics";
import { MARKETPLACES } from "@/data/marketplace";

/** Kartu tombol ke toko marketplace (pilihan kedua setelah WhatsApp). Tidak tampil bila belum ada toko. */
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
                    <a key={m.key} href={m.url} target="_blank" rel="noopener noreferrer" className={`market-card market-${m.key}`}
                        aria-label={`Belanja di ${m.name} (tautan luar)`}
                        onClick={() => trackEvent("click_marketplace", { platform: m.key, placement, product })}>
                        <span className="market-card-text">
                            <span className="market-card-sub">Belanja di</span>
                            <img src={m.logo} alt={m.name} height={26} loading="lazy" decoding="async" />
                        </span>
                        <span className="material-symbols-rounded market-card-go" aria-hidden="true">arrow_outward</span>
                    </a>
                ))}
            </span>
        </div>
    );
}
