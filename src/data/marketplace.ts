// Toko marketplace Mbak Tila. Isi `url` untuk menampilkan tombolnya; kosongkan bila belum ada.
// Tombol, tautan footer, dan FAQ otomatis menyesuaikan.
export interface Marketplace {
    key: "tokopedia" | "shopee";
    name: string;
    url: string;
    logo: string;
}

const ALL: Marketplace[] = [
    { key: "tokopedia", name: "Tokopedia", url: "https://www.tokopedia.com/steffipro", logo: "/images/marketplace/tokopedia.png" },
    { key: "shopee", name: "Shopee", url: "https://shopee.co.id/shop/51435698", logo: "/images/marketplace/shopee.png" }, // menyusul: isi URL toko Shopee agar kartunya tampil
];

export const MARKETPLACES: Marketplace[] = ALL.filter((m) => m.url);

/** "Tokopedia" / "Tokopedia dan Shopee" */
export function marketplaceNames(): string {
    return MARKETPLACES.map((m) => m.name).join(" dan ");
}
