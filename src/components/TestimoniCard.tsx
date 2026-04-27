// src/components/TestimoniCard.tsx

import { ExpandableText } from './ExpandableText';
import { FotoBuktiGrid } from './FotoBuktiGrid';
import type { Testimoni } from '@/types/testimoni';
import { getDisplayName, getInitials } from '@/types/testimoni';

interface Props {
    testimoni: Testimoni;
    compact?: boolean;
}

export function TestimoniCard({ testimoni, compact = false }: Props) {
    const nama = getDisplayName(testimoni);
    const inisial = getInitials(nama);
    const bintang = testimoni.bintang ?? 5;
    const fotos = testimoni.foto_url ? [testimoni.foto_url] : [];

    if (compact) {
        // ── COMPACT VARIANT — untuk inline AI result ──
        return (
            <article
                className="bg-white rounded-2xl p-4 flex flex-col gap-y-3
                     border border-gray-100
                     shadow-[0_2px_12px_rgb(0,0,0,0.05)]
                     transition-all duration-300 hover:shadow-[0_8px_24px_rgb(45,106,79,0.10)]"
            >
                <div className="flex items-center justify-between gap-2">
                    {testimoni.produk && (
                        <span className="text-[10px] font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                            {testimoni.produk}
                        </span>
                    )}
                </div>

                {/* Quote text */}
                <div className="pl-3 border-l-2 border-green-200/60">
                    <ExpandableText
                        text={testimoni.content}
                        maxLines={fotos.length > 0 ? 3 : 5}
                        className="text-sm text-gray-700 leading-relaxed"
                    />
                </div>

                {/* Foto bukti (compact thumbnails) */}
                {fotos.length > 0 && (
                    <div className="rounded-xl overflow-hidden">
                        <FotoBuktiGrid urls={fotos} />
                    </div>
                )}

            </article>
        );
    }

    // ── STANDARD VARIANT — untuk halaman testimoni utama ──
    return (
        <article
            className="bg-white rounded-[2rem] p-6 h-full flex flex-col gap-y-4
                 border border-gray-100/50
                 shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                 transition-all duration-500 hover:shadow-[0_20px_40px_rgb(45,106,79,0.08)] group"
        >
            {/* ── Teks dengan Quote ── */}
            <div className="relative pl-5 border-l-2 border-green-200/50 flex-1">
                <span
                    className="absolute -top-5 -left-4 text-6xl text-green-100/30
                     font-serif leading-none select-none italic pointer-events-none"
                    aria-hidden
                >
                    &ldquo;
                </span>
                <ExpandableText
                    text={testimoni.content}
                    maxLines={testimoni.foto_url ? 3 : 6}
                    className="pl-1 text-gray-700 leading-relaxed"
                />
            </div>

            {/* ── Foto bukti (jika ada) ── */}
            {fotos.length > 0 && (
                <div className="mt-2">
                    <FotoBuktiGrid urls={fotos} />
                </div>
            )}

            {/* ── Visual Recommendation Bar (Solusi Produk) ── */}
            {(testimoni as any).recommendation && (
                <a 
                    href={`#${(testimoni as any).recommendation.id}`}
                    onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById((testimoni as any).recommendation.id);
                        if (el) {
                            const yOffset = -100; // Offset agar tidak tertutup sticky header
                            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                    }}
                    className="mt-auto pt-4 border-t border-gray-50 flex items-center gap-2 md:gap-3 cursor-pointer"
                >
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-green-50 border border-green-100/50 flex-shrink-0 overflow-hidden group-hover:scale-110 transition-transform">
                        <img 
                            src={(testimoni as any).recommendation.image} 
                            alt={(testimoni as any).recommendation.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">Solusi Produk:</span>
                        <span className="text-xs md:text-sm font-black text-green-800 leading-tight">
                            {(testimoni as any).recommendation.name}
                        </span>
                    </div>
                    <div className="ml-auto">
                         <span className="material-symbols-rounded text-green-600 text-lg md:text-xl opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all">chevron_right</span>
                    </div>
                </a>
            )}

            {/* ── Produk Tag Lama (Fallback) ── */}
            {testimoni.produk && !(testimoni as any).recommendation && (
                <div className="flex mt-auto">
                    <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-3 py-1 rounded-full">
                        {testimoni.produk}
                    </span>
                </div>
            )}
        </article>
    );
}
