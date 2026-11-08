import { Link } from "react-router";
import { KEBUTUHAN } from "@/data/kebutuhan";

export function KebutuhanGrid() {
    return (
        <div className="need-grid">
            {KEBUTUHAN.map((k) => (
                <Link key={k.slug} to={`/kebutuhan/${k.slug}`} className="need-card">
                    <span className="material-symbols-rounded" aria-hidden="true">{k.icon}</span>
                    <span className="need-card-label">{k.label}</span>
                    <span className="need-card-go" aria-hidden="true">→</span>
                </Link>
            ))}
        </div>
    );
}
