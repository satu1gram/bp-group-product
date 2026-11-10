import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";
import { getWaLink } from "@/lib/site";
import { setupReveal } from "@/lib/reveal";
import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";
import { WaIcon } from "./WaIcon";

/** Kerangka halaman selain beranda: navigasi, isi, footer, tombol WA melayang. */
export function SiteLayout({ children, waMessage }: { children: ReactNode; waMessage?: string }) {
    const { pathname } = useLocation();

    // Animasi muncul untuk elemen .fade-in (dipakai komponen bersama seperti kisah mitra)
    useEffect(() => setupReveal(), [pathname]);

    return (
        <div className="katalog-page-wrapper site-page">
            <SiteNav waMessage={waMessage} />
            <main className="site-main">{children}</main>
            <SiteFooter />
            <a href={getWaLink(waMessage)} target="_blank" rel="noopener noreferrer"
                className="site-float-wa" aria-label="Chat Mbak Tila via WhatsApp">
                <WaIcon size={26} />
                <span>Chat Mbak Tila</span>
            </a>
        </div>
    );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
    return (
        <div className="site-breadcrumbs" role="navigation" aria-label="Breadcrumb">
            {items.map((it, i) => (
                <span key={i}>
                    {i > 0 && <span className="sep" aria-hidden="true">›</span>}
                    {it.href ? <a href={it.href}>{it.label}</a> : <span aria-current="page">{it.label}</span>}
                </span>
            ))}
        </div>
    );
}
