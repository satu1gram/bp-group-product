import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { SiteLayout, Breadcrumbs } from "@/components/site/SiteLayout";
import { WaIcon } from "@/components/site/WaIcon";
import { ShareBar } from "@/components/site/ShareBar";
import { PANDUAN_BISNIS } from "@/data/panduanBisnis";
import { trackEvent } from "@/lib/analytics";
import { normalizeWhatsapp, submitLead } from "@/lib/leads";
import { Seo } from "@/lib/seo";
import { getWaLink } from "@/lib/site";
import { breadcrumbLd } from "@/lib/structuredData";

const UNLOCK_KEY = "panduan_bisnis_terbuka";

function readUnlocked(): string | null {
    try {
        return localStorage.getItem(UNLOCK_KEY);
    } catch {
        return null;
    }
}

export default function PanduanBisnisPage() {
    // Selalu terkunci saat render awal (sama dengan HTML prerender), dibuka setelah mount bila tersimpan
    const [unlockedName, setUnlockedName] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [wa, setWa] = useState("");
    const [city, setCity] = useState("");
    const [consent, setConsent] = useState(false);
    const [website, setWebsite] = useState(""); // honeypot anti-spam
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setUnlockedName(readUnlocked());
    }, []);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        if (website) return; // bot
        if (name.trim().length < 2) return setError("Mohon isi nama.");
        const phone = normalizeWhatsapp(wa);
        if (!phone) return setError("Nomor WhatsApp belum benar. Contoh: 0812 3456 7890");
        if (!consent) return setError("Centang persetujuan dulu ya.");

        setBusy(true);
        try {
            await submitLead({ name, whatsapp: phone, city, interest: "mitra", source: "/panduan-bisnis" });
        } catch (err) {
            // Panduan tetap dibuka; kontak bisa dilanjutkan lewat tombol WhatsApp
            console.warn("[lead] gagal disimpan", err);
        }
        setBusy(false);
        trackEvent("generate_lead", { lead_source: "panduan-bisnis" });
        try {
            localStorage.setItem(UNLOCK_KEY, name.trim());
        } catch {
            /* abaikan */
        }
        setUnlockedName(name.trim());
        setTimeout(() => document.getElementById("langkah-1")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    };

    const unlocked = Boolean(unlockedName);
    const waAfter = `Halo Mbak Tila, saya ${unlockedName ?? ""} sudah membaca panduan 7 langkah mulai bisnis dari rumah. Saya mau tanya-tanya lebih lanjut.`;

    return (
        <SiteLayout waMessage="Halo Mbak Tila, saya mau tanya soal panduan mulai bisnis dari rumah">
            <Seo
                title="Panduan Gratis: 7 Langkah Mulai Bisnis British Propolis dari Rumah"
                description="Panduan praktis untuk ibu rumah tangga, karyawan, dan pensiunan yang ingin mulai bisnis British Propolis dari rumah: tujuan, produk, paket, WhatsApp Business, konten, pelanggan, dan pencatatan."
                path="/panduan-bisnis"
                image="/og/panduan-bisnis.jpg"
                jsonLd={[
                    breadcrumbLd([
                        { name: "Beranda", path: "/" },
                        { name: "Jadi Mitra", path: "/mitra" },
                        { name: "Panduan Bisnis", path: "/panduan-bisnis" },
                    ]),
                    {
                        "@type": "HowTo",
                        name: "7 Langkah Mulai Bisnis British Propolis dari Rumah",
                        inLanguage: "id-ID",
                        step: PANDUAN_BISNIS.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.summary })),
                    },
                ]}
            />
            <div className="container site-container">
                <Breadcrumbs items={[{ label: "Beranda", href: "/" }, { label: "Jadi Mitra", href: "/mitra" }, { label: "Panduan Bisnis" }]} />

                <header className="site-page-head">
                    <span className="site-tag">Panduan Gratis</span>
                    <h1>7 Langkah Mulai Bisnis <em>dari Rumah</em></h1>
                    <p>Panduan praktis bersama Mbak Tila untuk kamu yang ingin mulai jualan British Propolis: dari menentukan tujuan sampai merawat pelanggan.</p>
                </header>

                <div className="guide-layout">
                    <ol className="guide-steps">
                        {PANDUAN_BISNIS.map((s, i) => (
                            <li key={s.title} id={`langkah-${i + 1}`} className={`guide-step ${unlocked ? "" : "guide-locked"}`}>
                                <div className="guide-num">{i + 1}</div>
                                <div>
                                    <h2>{s.title}</h2>
                                    <p className="guide-summary">{s.summary}</p>
                                    {unlocked && s.body.map((para) => <p key={para}>{para}</p>)}
                                </div>
                            </li>
                        ))}
                    </ol>

                    <aside className="guide-side">
                        {unlocked ? (
                            <div className="guide-form guide-done">
                                <span className="material-symbols-rounded" aria-hidden="true">celebration</span>
                                <h2>Selamat membaca, {unlockedName}!</h2>
                                <p>Ada yang ingin ditanyakan atau mau langsung mulai? Mbak Tila siap membantu.</p>
                                <a href={getWaLink(waAfter)} target="_blank" rel="noopener noreferrer" className="site-btn-wa">
                                    <WaIcon size={18} /> Chat Mbak Tila
                                </a>
                                <Link to="/mitra#paket" className="site-btn-outline">Lihat pilihan paket</Link>
                            </div>
                        ) : (
                            <form className="guide-form" onSubmit={submit} noValidate>
                                <h2>Buka panduan lengkapnya</h2>
                                <p>Isi data singkat di bawah, panduan langsung terbuka di halaman ini. Gratis.</p>
                                {error && <div className="adm-msg adm-msg-err" role="alert">{error}</div>}
                                <div className="adm-field">
                                    <label htmlFor="g-name">Nama panggilan</label>
                                    <input id="g-name" autoComplete="given-name" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="adm-field">
                                    <label htmlFor="g-wa">Nomor WhatsApp</label>
                                    <input id="g-wa" type="tel" inputMode="tel" autoComplete="tel" placeholder="0812 3456 7890" value={wa} onChange={(e) => setWa(e.target.value)} />
                                </div>
                                <div className="adm-field">
                                    <label htmlFor="g-city">Kota (opsional)</label>
                                    <input id="g-city" autoComplete="address-level2" value={city} maxLength={60} onChange={(e) => setCity(e.target.value)} />
                                </div>
                                <div className="guide-hp" aria-hidden="true">
                                    <label htmlFor="g-web">Website</label>
                                    <input id="g-web" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                                </div>
                                <label className="guide-consent">
                                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                                    <span>Saya setuju dihubungi Mbak Tila via WhatsApp seputar panduan ini dan peluang bisnis British Propolis. Data saya tidak dibagikan ke pihak lain.</span>
                                </label>
                                <button type="submit" className="site-btn-primary" disabled={busy}>
                                    {busy ? "Membuka…" : "Buka Panduan Gratis"}
                                </button>
                            </form>
                        )}
                    </aside>
                </div>

                <div className="site-center">
                    <ShareBar path="/panduan-bisnis" title="Panduan gratis: 7 langkah mulai bisnis dari rumah" label="Bagikan panduan ini" />
                </div>
            </div>
        </SiteLayout>
    );
}
