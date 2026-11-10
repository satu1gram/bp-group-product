import { SiteLayout, Breadcrumbs } from "@/components/site/SiteLayout";
import { WaIcon } from "@/components/site/WaIcon";
import { ShareBar } from "@/components/site/ShareBar";
import { usePromos } from "@/lib/initialData";
import { Seo } from "@/lib/seo";
import { formatTanggal, getWaLink } from "@/lib/site";
import { breadcrumbLd } from "@/lib/structuredData";

export default function PromoPage() {
    const { data: promos, loading } = usePromos();

    return (
        <SiteLayout waMessage="Halo Mbak Tila, saya mau tanya promo British Propolis bulan ini">
            <Seo
                title="Promo British Propolis Bulan Ini | Katalog Mbak Tila"
                description="Program promo resmi British Propolis yang sedang berlaku. Cek periode dan syaratnya, lalu ambil promo langsung via WhatsApp bersama Mbak Tila."
                path="/promo"
                image="/og/promo.jpg"
                jsonLd={[breadcrumbLd([{ name: "Beranda", path: "/" }, { name: "Promo", path: "/promo" }])]}
            />
            <div className="container site-container">
                <Breadcrumbs items={[{ label: "Beranda", href: "/" }, { label: "Promo" }]} />

                <header className="site-page-head">
                    <span className="site-tag">Program Resmi</span>
                    <h1>Program Spesial <em>Bulan Ini</em></h1>
                    <p>Promo resmi British Propolis yang sedang berlaku. Kuota tiap program terbatas, amankan pesananmu lewat WhatsApp.</p>
                </header>

                {loading && promos.length === 0 ? (
                    <div className="promo-grid" aria-busy="true">
                        {[0, 1].map((i) => <div key={i} className="promo-card promo-skeleton" />)}
                    </div>
                ) : promos.length > 0 ? (
                    <div className="promo-grid">
                        {promos.map((p) => {
                            const waText = p.wa_message || `Halo Mbak Tila, saya mau ambil promo "${p.title}". Masih tersedia?`;
                            return (
                                <article key={p.id} className={`promo-card ${p.image_url ? "promo-card-has-img" : ""}`}>
                                    {p.image_url && (
                                        <a className="promo-img-wrap" href={p.image_url} target="_blank" rel="noopener noreferrer"
                                            aria-label={`Lihat flyer ${p.title} ukuran penuh`}>
                                            <img className="promo-img" src={p.image_url} alt={p.title} />
                                            <span className="promo-img-zoom" aria-hidden="true">
                                                <span className="material-symbols-rounded">zoom_in</span> Perbesar
                                            </span>
                                        </a>
                                    )}
                                    <div className="promo-body">
                                        {p.ends_at && (
                                            <span className="promo-deadline">
                                                <span className="material-symbols-rounded" aria-hidden="true">schedule</span>
                                                Berlaku s.d. {formatTanggal(p.ends_at)}
                                            </span>
                                        )}
                                        <h2 className="promo-title">{p.title}</h2>
                                        {p.description && <p className="promo-desc">{p.description}</p>}
                                        {p.terms && (
                                            <details className="promo-terms">
                                                <summary>Syarat & ketentuan</summary>
                                                <p>{p.terms}</p>
                                            </details>
                                        )}
                                        <a href={getWaLink(waText)} target="_blank" rel="noopener noreferrer" className="site-btn-wa promo-wa-btn">
                                            <WaIcon size={18} /> Ambil Promo via WhatsApp
                                        </a>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="site-empty promo-empty">
                        <span className="material-symbols-rounded" aria-hidden="true">notifications_active</span>
                        <h2>Program baru segera hadir</h2>
                        <p>Mau dikabari duluan saat promo baru dibuka? Kirim pesan <strong>INFO PROMO</strong> ke WhatsApp Mbak Tila.</p>
                        <a href={getWaLink("INFO PROMO")} target="_blank" rel="noopener noreferrer" className="site-btn-wa">
                            <WaIcon size={18} /> Kabari Saya
                        </a>
                    </div>
                )}

                {promos.length > 0 && (
                    <div className="site-center">
                        <ShareBar path="/promo" title="Promo British Propolis bulan ini, cek di sini" label="Bagikan ke teman" />
                    </div>
                )}

                <p className="health-disclaimer">
                    Program promo mengikuti ketentuan resmi dari BP Group dan dapat berakhir lebih cepat bila kuota habis.
                </p>
            </div>
        </SiteLayout>
    );
}
