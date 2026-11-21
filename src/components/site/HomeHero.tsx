import { Link } from "react-router";
import { getWaLink } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

/**
 * Pembuka beranda: satu ajakan utama untuk pembeli (pilih produk) dan
 * satu jalur tenang untuk calon mitra (/mitra). Lihat docs/strategi-beranda.md.
 */
export function HomeHero({ onPilihProduk }: { onPilihProduk: () => void }) {
    return (
        <header className="home-hero fade-in" data-cta="hero">
            <div className="home-hero-id">
                <img src="/images/bisnis/avatar-tila.webp" alt="Foto Mbak Tila" width={56} height={56} {...{ fetchpriority: "high" }} />
                <div>
                    <strong>Halo, saya Mbak Tila 👋</strong>
                    <span>Mitra British Propolis</span>
                </div>
            </div>

            <h1 className="home-hero-title">
                Bingung pilih produk untuk keluarga? <em>Saya bantu pilihkan.</em>
            </h1>

            <div className="home-hero-actions">
                <button type="button" className="home-hero-primary"
                    onClick={() => { trackEvent("hero_pilih_produk"); onPilihProduk(); }}>
                    <span className="material-symbols-rounded" aria-hidden="true">auto_awesome</span>
                    Bantu Pilihkan Produk
                </button>
                <a className="home-hero-chat" target="_blank" rel="noopener noreferrer"
                    href={getWaLink("Halo Mbak Tila, saya mau tanya produk British Propolis", "K-HERO")}>
                    atau langsung chat via WhatsApp
                </a>
            </div>

            <ul className="home-hero-trust" aria-label="Jaminan">
                <li><span className="material-symbols-rounded" aria-hidden="true">verified_user</span>Terdaftar BPOM</li>
                <li><span className="material-symbols-rounded" aria-hidden="true">verified</span>Bersertifikat halal</li>
                <li><span className="material-symbols-rounded" aria-hidden="true">local_shipping</span>Kirim ke seluruh Indonesia &amp; luar negeri</li>
            </ul>
            <p className="home-hero-cek">
                Cek keaslian izin edar di{" "}
                <a href="https://cekbpom.pom.go.id/" target="_blank" rel="noopener noreferrer">cekbpom.pom.go.id</a>
            </p>

            <Link to="/mitra" className="home-hero-mitra" onClick={() => trackEvent("partner_cta_click", { cta_location: "hero" })}>
                <span className="material-symbols-rounded" aria-hidden="true">handshake</span>
                <span>Ingin ikut menjual produk ini? <strong>Lihat cara jadi mitra →</strong></span>
            </Link>
        </header>
    );
}
