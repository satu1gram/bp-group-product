import { Link } from "react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Seo } from "@/lib/seo";

const NotFound = () => (
    <SiteLayout>
        <Seo title="Halaman tidak ditemukan | Katalog British Propolis" description="Halaman yang kamu cari tidak ditemukan." path="/404" noindex />
        <div className="container site-container site-empty">
            <span className="material-symbols-rounded" aria-hidden="true">search_off</span>
            <h1>Halaman tidak ditemukan</h1>
            <p>Mungkin tautannya sudah berubah. Yuk kembali ke katalog atau baca Catatan Tila.</p>
            <div className="site-btn-row">
                <Link to="/" className="site-btn-primary">Ke Beranda</Link>
                <Link to="/artikel" className="site-btn-outline">Catatan Tila</Link>
            </div>
        </div>
    </SiteLayout>
);

export default NotFound;
