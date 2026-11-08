// Data terstruktur schema.org (JSON-LD) untuk Google.
import type { ProductData } from "@/data/katalogProducts";
import { SITE_URL, WA_NUMBER, absoluteUrl } from "./site";

export const SELLER_ID = `${SITE_URL}/#penjual`;

export function brandOf(name: string): string {
    if (name.startsWith("Belgie")) return "Belgie";
    if (name.startsWith("Steffi")) return "Steffi";
    return "British Propolis";
}

export function priceNumber(price: string): string {
    return price.replace(/[^\d]/g, "");
}

export function storeLd(): Record<string, unknown> {
    return {
        "@type": "Store",
        "@id": SELLER_ID,
        name: "Katalog British Propolis – Mbak Tila",
        url: `${SITE_URL}/`,
        telephone: `+${WA_NUMBER}`,
        image: absoluteUrl("/images/produk/bp.webp"),
        description: "Mitra British Propolis di Malang. Konsultasi produk gratis dan pemesanan via WhatsApp.",
        address: { "@type": "PostalAddress", addressLocality: "Malang", addressRegion: "Jawa Timur", addressCountry: "ID" },
    };
}

export function productLd(p: ProductData, url: string): Record<string, unknown> {
    return {
        "@type": "Product",
        name: p.name,
        description: p.description,
        brand: { "@type": "Brand", name: brandOf(p.name) },
        ...(p.image ? { image: absoluteUrl(p.image) } : {}),
        ...(p.nomorRegistrasi ? { sku: p.nomorRegistrasi } : {}),
        offers: {
            "@type": "Offer",
            price: priceNumber(p.price),
            priceCurrency: "IDR",
            availability: "https://schema.org/InStock",
            url,
            seller: { "@id": SELLER_ID, "@type": "Store", name: "Katalog British Propolis – Mbak Tila" },
        },
    };
}

export function breadcrumbLd(items: { name: string; path: string }[]): Record<string, unknown> {
    return {
        "@type": "BreadcrumbList",
        itemListElement: items.map((it, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: it.name,
            item: absoluteUrl(it.path),
        })),
    };
}

export function faqLd(faqs: { q: string; a: string }[]): Record<string, unknown> {
    return {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
    };
}
