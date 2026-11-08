import { SiteLayout, Breadcrumbs } from "@/components/site/SiteLayout";
import { KebutuhanGrid } from "@/components/site/KebutuhanGrid";
import { Seo } from "@/lib/seo";
import { breadcrumbLd } from "@/lib/structuredData";

export default function KebutuhanIndexPage() {
    return (
        <SiteLayout>
            <Seo
                title="Cari Produk British Propolis Sesuai Kebutuhan Keluarga"
                description="Daya tahan tubuh, si kecil, mata lelah, tidur nyenyak, badan pegal, kurangi gula, perawatan kulit & rambut. Temukan tips harian dan produk yang sering dipilih."
                path="/kebutuhan"
                image="/og/default.jpg"
                jsonLd={[breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Kebutuhan", path: "/kebutuhan" }])]}
            />
            <div className="container site-container">
                <Breadcrumbs items={[{ label: "Beranda", href: "/" }, { label: "Kebutuhan" }]} />
                <header className="site-page-head">
                    <span className="site-tag">Sesuai Kebutuhan</span>
                    <h1>Apa yang Sedang <em>Kamu Butuhkan?</em></h1>
                    <p>Pilih kebutuhanmu untuk melihat tips harian dan produk yang sering dipilih keluarga lain.</p>
                </header>
                <KebutuhanGrid />
            </div>
        </SiteLayout>
    );
}
