import { Link } from "react-router";
import { getWaLink } from "@/lib/site";
import { WaIcon } from "./WaIcon";

// Ringkasan peluang bisnis di beranda. Detail lengkap (keuntungan, kisah mitra,
// langkah, paket) hanya ada di /mitra supaya beranda tetap fokus ke konsumen.

const POIN = [
    { icon: "inventory_2", title: "Mulai dari 10 botol", desc: "Paket terkecil, isi bisa di-mix sesuai pasar di sekitarmu." },
    { icon: "school", title: "Dibimbing langsung", desc: "Pembinaan dari Mbak Tila, para leader & mentor komunitas." },
    { icon: "campaign", title: "Materi promosi harian", desc: "Konten siap bagikan, kamu tinggal menambah cerita sendiri." },
];

const MITRA = [
    { name: "Mbak Tila", img: "/images/bisnis/avatar-tila.webp" },
    { name: "Bu Estuning", img: "/images/bisnis/avatar-estuning.webp" },
    { name: "Mas Adib", initials: "MA" },
];

export function MitraTeaser() {
    return (
        <div className="mitra-teaser fade-in">
            <div className="mitra-teaser-text">
                <div className="bisnis-hero-badge">
                    <span className="material-symbols-rounded">trending_up</span>
                    Peluang Bisnis
                </div>
                <h2 className="mitra-teaser-title">
                    Mau Punya Penghasilan <em>dari Rumah?</em>
                </h2>
                <blockquote className="mitra-teaser-quote">
                    “Saya Tila, mantan dosen dan ibu 3 anak. Sejak resign, saya membangun bisnis British Propolis dari
                    rumah, dan sekarang membimbing ibu-ibu lain untuk memulainya.”
                </blockquote>

                <ul className="mitra-teaser-points">
                    {POIN.map((p) => (
                        <li key={p.title}>
                            <span className="material-symbols-rounded" aria-hidden="true">{p.icon}</span>
                            <div>
                                <strong>{p.title}</strong>
                                <span>{p.desc}</span>
                            </div>
                        </li>
                    ))}
                </ul>

                <Link to="/mitra#kisah" className="mitra-teaser-people">
                    <span className="mitra-teaser-avatars" aria-hidden="true">
                        {MITRA.map((m) =>
                            m.img ? <img key={m.name} src={m.img} alt="" loading="lazy" width={40} height={40} /> : <span key={m.name}>{m.initials}</span>
                        )}
                    </span>
                    <span className="mitra-teaser-people-text">
                        Mbak Tila, Bu Estuning (mulai di usia 79), Mas Adib, dan mitra lainnya.
                        <strong> Baca kisah mereka →</strong>
                    </span>
                </Link>

                <div className="mitra-teaser-ctas">
                    <Link to="/mitra" className="mt-btn-light">Lihat Program Mitra</Link>
                    <Link to="/panduan-bisnis" className="mt-btn-ghost">Panduan Gratis 7 Langkah</Link>
                </div>
                <a className="mitra-teaser-wa" target="_blank" rel="noopener noreferrer"
                    href={getWaLink("Halo Mbak Tila, saya lihat bagian peluang bisnis di katalog. Saya mau tanya-tanya dulu.")}>
                    <WaIcon size={16} /> atau tanya-tanya dulu via WhatsApp
                </a>
            </div>

            <div className="mitra-teaser-img">
                <img src="/images/bisnis/tila-600.webp" alt="Mbak Tila bersama keluarga saat umroh" loading="lazy" width={600} height={800} />
            </div>
        </div>
    );
}
