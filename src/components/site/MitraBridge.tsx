import { Link } from "react-router";
import { getWaLink } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { PAKET_KEMITRAAN } from "@/data/kemitraan";
import { WaIcon } from "./WaIcon";

/** Kartu jembatan ke /mitra di layar 2–3 beranda (bukan hanya di bagian paling bawah). */
export function MitraBridge() {
    const modal = PAKET_KEMITRAAN.map((p) => p.modal);
    const jual = PAKET_KEMITRAAN[0]?.jual;
    return (
        <aside className="mitra-bridge fade-in" data-cta="jembatan" aria-label="Peluang jadi mitra">
            <div className="mitra-bridge-icon" aria-hidden="true">
                <span className="material-symbols-rounded">storefront</span>
            </div>
            <div className="mitra-bridge-body">
                <strong>Suka produknya? Bisa juga ikut menjualnya.</strong>
                <p>
                    Bukan money game: untungnya dari selisih harga jual produk ke konsumen, tanpa deposit dan tanpa wajib merekrut.
                    Contoh: modal mulai {modal[modal.length - 1]} per botol (turun hingga {modal[0]} di paket besar), harga jual {jual}.
                </p>
                <div className="mitra-bridge-actions">
                    <Link to="/mitra" className="mitra-bridge-link" onClick={() => trackEvent("partner_cta_click", { cta_location: "jembatan" })}>
                        Lihat cara jadi mitra →
                    </Link>
                    <a className="mitra-bridge-wa" target="_blank" rel="noopener noreferrer"
                        href={getWaLink("Halo Mbak Tila, saya mau tahu cara jadi mitra British Propolis", "M-JEMBATAN")}>
                        <WaIcon size={14} /> Tanya dulu
                    </a>
                </div>
                <small>Contoh hitungan, bukan jaminan penghasilan.</small>
            </div>
        </aside>
    );
}
