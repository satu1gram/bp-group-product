// Toko marketplace Mbak Tila. Isi `url` untuk menampilkan tombolnya; kosongkan bila belum ada.
// Tombol, tautan footer, dan FAQ otomatis menyesuaikan.
export interface Marketplace {
    key: "tokopedia" | "shopee";
    name: string;
    url: string;
}

const ALL: Marketplace[] = [
    { key: "tokopedia", name: "Tokopedia", url: "https://www.tokopedia.com/steffipro" },
    { key: "shopee", name: "Shopee", url: "" }, // menyusul
];

export const MARKETPLACES: Marketplace[] = ALL.filter((m) => m.url);

/** "Tokopedia" / "Tokopedia dan Shopee" */
export function marketplaceNames(): string {
    return MARKETPLACES.map((m) => m.name).join(" dan ");
}
