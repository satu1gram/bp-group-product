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
const CITY_KEY = "panduan_bisnis_kota";
const REDIRECT_SECONDS = 3;

/** Pesan WA yang dikirim calon mitra ke Mbak Tila setelah membuka panduan. */
function leadWaMessage(name: string, city: string): string {
    const asal = city.trim() ? ` dari ${city.trim()}` : "";
    return `Halo Mbak Tila, saya ${name.trim()}${asal}. Saya baru membuka panduan 7 langkah mulai bisnis dari rumah di katalog dan ingin tanya-tanya soal jadi mitra.`;
}

function isTouchDevice(): boolean {
    try {
        return window.matchMedia("(pointer: coarse)").matches;
    } catch {
        return false;
    }
}

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
    const [unlockedCity, setUnlockedCity] = useState("");
    const [justSubmitted, setJustSubmitted] = useState(false);
    const [redirectIn, setRedirectIn] = useState<number | null>(null);
    const [name, setName] = useState("");
    const [wa, setWa] = useState("");
    const [city, setCity] = useState("");
    const [consent, setConsent] = useState(false);
    const [website, setWebsite] = useState(""); // honeypot anti-spam
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setUnlockedName(readUnlocked());
        try {
            setUnlockedCity(localStorage.getItem(CITY_KEY) ?? "");
        } catch {
            /* abaikan */
        }
    }, []);

    const waAfter = getWaLink(leadWaMessage(unlockedName ?? "", unlockedCity));

    // HP: setelah formulir terkirim, buka WhatsApp otomatis (bisa dibatalkan)
    useEffect(() => {
        if (redirectIn === null) return;
        if (redirectIn <= 0) {
            setRedirectIn(null);
            trackEvent("lead_whatsapp_redirect", { lead_source: "panduan-bisnis" });
            window.location.href = waAfter;
            return;
        }
        const t = window.setTimeout(() => setRedirectIn((n) => (n === null ? null : n - 1)), 1000);
        return () => window.clearTimeout(t);
    }, [redirectIn, waAfter]);

    const skipRedirect = () => {
        setRedirectIn(null);
        document.getElementById("langkah-1")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

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
            localStorage.setItem(CITY_KEY, city.trim());
        } catch {
            /* abaikan */
        }
        setUnlockedName(name.trim());
        setUnlockedCity(city.trim());
        setJustSubmitted(true);
        if (isTouchDevice()) {
            setRedirectIn(REDIRECT_SECONDS);
            setTimeout(() => document.querySelector(".guide-done")?.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
        } else {
            setTimeout(() => document.getElementById("langkah-1")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
        }
    };

    const unlocked = Boolean(unlockedName);

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
                            <div className={`guide-form guide-done ${justSubmitted ? "guide-done-new" : ""}`} aria-live="polite">
                                <span className="material-symbols-rounded" aria-hidden="true">{justSubmitted ? "mark_chat_unread" : "celebration"}</span>
                                {justSubmitted ? (
                                    <>
                                        <h2>Satu langkah lagi, {unlockedName}!</h2>
                                        <p>Panduan sudah terbuka. Kirim pesan ke Mbak Tila supaya kamu dibantu memulai. Pesannya sudah kami siapkan, tinggal tekan kirim.</p>
                                    </>
                                ) : (
                                    <>
                                        <h2>Selamat membaca, {unlockedName}!</h2>
                                        <p>Ada yang ingin ditanyakan atau mau langsung mulai? Mbak Tila siap membantu.</p>
                                    </>
                                )}
                                <a href={waAfter} target="_blank" rel="noopener noreferrer" className="site-btn-wa guide-wa-btn"
                                    onClick={() => setRedirectIn(null)}>
                                    <WaIcon size={20} /> {justSubmitted ? "Kirim ke Mbak Tila via WhatsApp" : "Chat Mbak Tila"}
                                </a>
                                {redirectIn !== null && (
                                    <p className="guide-redirect">
                                        Membuka WhatsApp dalam {redirectIn} detik…{" "}
                                        <button type="button" onClick={skipRedirect}>Nanti saja, baca panduan dulu</button>
                                    </p>
                                )}
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
                                <p className="guide-form-note">Setelah panduan terbuka, kamu bisa langsung ngobrol dengan Mbak Tila via WhatsApp.</p>
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
