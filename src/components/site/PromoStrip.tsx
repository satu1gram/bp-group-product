import { useEffect, useState } from "react";
import { Link } from "react-router";
import { usePromos } from "@/lib/initialData";
import { formatTanggal, todayJakarta } from "@/lib/site";

/** Sisa hari sampai tanggal berakhir (dihitung di browser agar selalu akurat). */
function sisaHari(endsAt: string): number {
    const end = new Date(`${endsAt}T00:00:00+07:00`).getTime();
    const today = new Date(`${todayJakarta()}T00:00:00+07:00`).getTime();
    return Math.round((end - today) / 86400000);
}

/** Kartu promo ringkas di paling atas beranda; tampil hanya bila ada promo berjalan. */
export function PromoStrip() {
    const { data: promos } = usePromos();
    const [daysLeft, setDaysLeft] = useState<number | null>(null);
    const first = promos[0];

    useEffect(() => {
        setDaysLeft(first?.ends_at ? sisaHari(first.ends_at) : null);
    }, [first?.ends_at]);

    if (!first) return null;

    const urgency =
        daysLeft === null ? null : daysLeft <= 0 ? "Hari terakhir!" : daysLeft === 1 ? "Berakhir besok" : `Sisa ${daysLeft} hari`;

    return (
        <Link to="/promo" className="promo-hero fade-in" aria-label={`Lihat promo: ${first.title}`}>
            {first.image_url && (
                <span className="promo-hero-thumb">
                    <img src={first.image_url} alt="" loading="eager" decoding="async" />
                </span>
            )}
            <span className="promo-hero-body">
                <span className="promo-hero-top">
                    <span className="promo-hero-badge">
                        <span className="material-symbols-rounded" aria-hidden="true">local_offer</span>
                        Promo Spesial
                    </span>
                    {urgency && <span className="promo-hero-urgency">{urgency}</span>}
                </span>
                <span className="promo-hero-title">{first.title}</span>
                <span className="promo-hero-meta">
                    {first.ends_at ? `Berlaku s.d. ${formatTanggal(first.ends_at)}` : "Selama persediaan masih ada"}
                    {promos.length > 1 && ` · +${promos.length - 1} promo lainnya`}
                </span>
            </span>
            <span className="promo-hero-cta">
                Lihat Promo
                <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
            </span>
        </Link>
    );
}
