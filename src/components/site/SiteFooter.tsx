import { Link } from "react-router";

export function SiteFooter() {
    return (
        <footer>
            <div className="logo-text">
                <img src="/images/qm-logo.webp" alt="Quantum Millionaire"
                    style={{ height: '50px', width: 'auto', marginBottom: '12px' }} />
            </div>
            <div className="site-footer-links">
                <Link to="/">Beranda</Link>
                <a href="/#produk">Produk</a>
                <Link to="/artikel">Catatan Tila</Link>
                <Link to="/promo">Promo</Link>
                <Link to="/mitra">Jadi Mitra</Link>
                <Link to="/panduan-bisnis">Panduan Bisnis Gratis</Link>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-muted)' }}>
                Mbak Tila · Mitra British Propolis, Malang<br />
                Bagian dari Komunitas Bisnis Quantum Millionaire<br />
                © {new Date().getFullYear()} Katalog British Propolis
            </p>
        </footer>
    );
}
