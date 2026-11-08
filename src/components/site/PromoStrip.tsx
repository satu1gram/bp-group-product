import { Link } from "react-router";
import { usePromos } from "@/lib/initialData";
import { formatTanggal } from "@/lib/site";

/** Pita promo di beranda; tampil hanya bila ada promo yang sedang berjalan. */
export function PromoStrip() {
    const { data: promos } = usePromos();
    if (promos.length === 0) return null;
    const first = promos[0];
    return (
        <Link to="/promo" className="promo-strip fade-in">
            <span className="material-symbols-rounded" aria-hidden="true">local_offer</span>
            <span className="promo-strip-text">
                <strong>Program bulan ini:</strong> {first.title}
                {first.ends_at && <> · s.d. {formatTanggal(first.ends_at)}</>}
                {promos.length > 1 && <> · +{promos.length - 1} program lain</>}
            </span>
            <span className="promo-strip-cta">Lihat promo →</span>
        </Link>
    );
}
