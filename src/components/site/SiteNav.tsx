import { useState } from "react";
import { Link } from "react-router";
import { getWaLink } from "@/lib/site";

// Tautan halaman: Link (pindah halaman tanpa reload); tautan bagian beranda: <a href="/#...">
export const NAV_ITEMS: { label: string; href: string; page?: boolean }[] = [
    { label: "Pilih Produk", href: "/#advisor" },
    { label: "Produk", href: "/#produk" },
    { label: "Catatan Tila", href: "/artikel", page: true },
    { label: "Promo", href: "/promo", page: true },
    { label: "Jadi Mitra", href: "/mitra", page: true },
];

function NavLink({ item, className }: { item: (typeof NAV_ITEMS)[number]; className?: string }) {
    return item.page ? (
        <Link to={item.href} className={className}>{item.label}</Link>
    ) : (
        <a href={item.href} className={className}>{item.label}</a>
    );
}

export function SiteNav({ waMessage }: { waMessage?: string }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const waLink = getWaLink(waMessage, waMessage && /mitra|bisnis|reseller|agen/i.test(waMessage) ? "M-NAV" : "K-NAV");

    return (
        <>
            <nav>
                <div className="nav-logo-wrap">
                    <Link to="/" className="nav-logo nav-brand" aria-label="Beranda katalog Tila, Mitra British Propolis Malang">
                        <img src="/images/bisnis/avatar-tila.webp" width={40} height={40} alt="" />
                        <span className="nav-brand-text">
                            <strong>Tila</strong>
                            <span>Mitra British Propolis · Malang</span>
                        </span>
                    </Link>
                </div>
                <ul className="nav-links desktop-only">
                    {NAV_ITEMS.map(item => <li key={item.href}><NavLink item={item} /></li>)}
                </ul>
                <div className="nav-right desktop-only">
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="nav-cta">
                        <span className="material-symbols-rounded" style={{ fontSize: '18px', marginRight: '6px', verticalAlign: 'bottom' }}>chat</span>
                        Hubungi Kami
                    </a>
                </div>
                <div className="mobile-controls mobile-only">
                    <button className="hamburger-btn" type="button"
                        aria-label="Buka menu" aria-expanded={menuOpen} aria-controls="mobile-drawer"
                        onClick={() => setMenuOpen(true)}>
                        <span className="line" /><span className="line" /><span className="line" />
                    </button>
                </div>
            </nav>

            <div className={`mobile-drawer-overlay ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} aria-hidden="true" />
            <aside id="mobile-drawer" className={`mobile-drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen} aria-label="Menu navigasi">
                <button type="button" className="drawer-close" aria-label="Tutup menu" onClick={() => setMenuOpen(false)}>
                    <span className="material-symbols-rounded">close</span>
                </button>
                <div className="drawer-links" role="navigation" onClick={() => setMenuOpen(false)}>
                    {NAV_ITEMS.map(item => <NavLink key={item.href} item={item} />)}
                </div>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="nav-cta drawer-cta">
                    Chat Mbak Tila via WhatsApp
                </a>
            </aside>
        </>
    );
}
