import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router';
import '@/styles/katalog.css';
import '@/styles/ai-advisor.css';
import '@/styles/pages.css';
import { KATALOG_PRODUCTS } from '@/data/katalogProducts';
import { TestimoniSection } from '@/components/TestimoniSection';
import { BusinessTestimonials } from '@/components/BusinessTestimonials';
import { TestimonialWall } from '@/components/TestimonialWall';
import { generateAIAdvice, type RAGResult } from '@/lib/geminiRAG';
import { trackEvent } from '@/lib/analytics';
import { getWaLink, SITE_URL } from '@/lib/site';
import { Seo } from '@/lib/seo';
import { storeLd, productLd } from '@/lib/structuredData';
import { KEUNTUNGAN_MITRA, LANGKAH_MITRA, PAKET_KEMITRAAN } from '@/data/kemitraan';
import { SiteNav } from '@/components/site/SiteNav';
import { SiteFooter } from '@/components/site/SiteFooter';
import { WaIcon } from '@/components/site/WaIcon';
import { PromoStrip } from '@/components/site/PromoStrip';
import { ArticleTeaser } from '@/components/site/ArticleTeaser';
import { KebutuhanGrid } from '@/components/site/KebutuhanGrid';

// ─── Konstanta ───────────────────────────────────────────────────────────────

const COMPLAINT_OPTIONS = [
    "Susah Tidur", "Badan Pegal", "Daya Tahan Tubuh", "Mata Lelah",
    "Kurangi Gula", "Nutrisi Anak", "Rambut Rontok", "Kulit Kusam",
    "Sering Flu", "Kurang Fokus", "Flek Hitam", "Kurang Stamina"
];

export const KELUHAN_FILTER_TABS = [
    { key: 'all', label: 'Semua' },
    { key: 'tidur', label: 'Susah Tidur' },
    { key: 'sendi', label: 'Badan Pegal' },
    { key: 'imun', label: 'Daya Tahan' },
    { key: 'mata', label: 'Mata Lelah' },
    { key: 'gula', label: 'Kurangi Gula' },
    { key: 'anak', label: 'Anak' },
    { key: 'rambut', label: 'Rambut Rontok' },
    { key: 'kulit', label: 'Kulit & Flek' },
    { key: 'flu', label: 'Sering Flu' },
    { key: 'fokus', label: 'Kurang Fokus' },
    { key: 'stamina', label: 'Stamina' },
    { key: 'wanita', label: 'Hormon Wanita' },
];

const KELUHAN_PRODUCTS: Record<string, string[]> = {
    all: [],
    tidur: ['brassic-pro'],
    sendi: ['brassic-pro', 'british-propolis'],
    imun: ['british-propolis', 'british-propolis-green'],
    mata: ['brassic-eye'],
    gula: ['steffi-pro'],
    anak: ['british-propolis-green'],
    rambut: ['belgie-hair-tonic'],
    kulit: ['belgie-serum', 'belgie-facial-wash', 'belgie-day-cream', 'belgie-night-cream'],
    flu: ['british-propolis', 'british-propolis-green'],
    fokus: ['bp-norway', 'brassic-pro'],
    stamina: ['british-propolis', 'bp-norway'],
    wanita: ['british-propolis-blue'],
};

const PRODUCT_NAME_TO_ID: Record<string, string> = {
    'british propolis green': 'british-propolis-green',
    'british propolis blue': 'british-propolis-blue',
    'british propolis': 'british-propolis',
    'brassic pro': 'brassic-pro',
    'brassic eye': 'brassic-eye',
    'bp norway': 'bp-norway',
    'belgie facial wash': 'belgie-facial-wash',
    'belgie anti aging serum': 'belgie-serum',
    'belgie serum': 'belgie-serum',
    'belgie day cream': 'belgie-day-cream',
    'belgie night cream': 'belgie-night-cream',
    'belgie hair tonic': 'belgie-hair-tonic',
    'steffi pro': 'steffi-pro',
};

// ─── Helper ──────────────────────────────────────────────────────────────────

function getRecommendedIds(rekomendasi: RAGResult['rekomendasi']): string[] {
    const ids = new Set<string>();
    rekomendasi.forEach(r => {
        const nameLower = r.name.toLowerCase().trim();
        // Ambil nama produk terpanjang yang cocok, supaya "British Propolis"
        // tidak ikut menyeret varian Green & Blue.
        const match = Object.keys(PRODUCT_NAME_TO_ID)
            .filter(key => nameLower.includes(key))
            .sort((a, b) => b.length - a.length)[0];
        if (match) ids.add(PRODUCT_NAME_TO_ID[match]);
    });
    return Array.from(ids);
}

// ─── Komponen Utama ───────────────────────────────────────────────────────────

export default function KatalogProdukPage() {

    // ── State ──
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeKeluhan, setActiveKeluhan] = useState('all');
    const [selectedKeluhan, setSelectedKeluhan] = useState<string[]>([]);
    const [complaintText, setComplaintText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiResult, setAiResult] = useState<RAGResult | null>(null);
    const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set());
    const toggleTier = useCallback((id: string) => {
        setExpandedTiers(prev => {
            const next = new Set(prev);
            if (next.has(id)) { next.delete(id); } else { next.add(id); }
            return next;
        });
    }, []);

    // ── Refs untuk navigasi ──
    const sectionAdvisorRef = useRef<HTMLElement>(null);
    const sectionProdukRef = useRef<HTMLElement>(null);
    const sectionBisnisRef = useRef<HTMLElement>(null);
    const aiResultRef = useRef<HTMLDivElement>(null);
    const complaintTextRef = useRef<HTMLTextAreaElement>(null);

    // ── Scroll + Fade-in observer ──
    useEffect(() => {
        const hasHash = window.location.hash.length > 1;
        if (!hasHash) window.scrollTo(0, 0);
        // Langsung tampilkan elemen yang sudah ada di viewport saat halaman dibuka
        const triggerVisible = () => {
            document.querySelectorAll('.fade-in:not(.in-view)').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add('in-view');
                }
            });
        };
        // Trigger setelah 50ms untuk pastikan DOM sudah render
        const t = setTimeout(triggerVisible, 50);

        // Fokus otomatis ke textarea keluhan
        if (!hasHash) setTimeout(() => complaintTextRef.current?.focus({ preventScroll: true }), 500);

        const observer = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); }),
            { threshold: 0, rootMargin: '0px 0px -5% 0px' }
        );
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        return () => { observer.disconnect(); clearTimeout(t); };
    }, []);

    // ── Scroll helper ──
    const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // ── AI Advisor handlers ──
    const toggleComplaint = (opt: string) => {
        const next = selectedKeluhan.includes(opt)
            ? selectedKeluhan.filter(c => c !== opt)
            : [...selectedKeluhan, opt];
        setSelectedKeluhan(next);
        const manual = complaintText.split(',').map(p => p.trim()).filter(p => !COMPLAINT_OPTIONS.includes(p));
        setComplaintText([...next, ...manual].join(', '));
    };

    const handleTextChange = (val: string) => {
        setComplaintText(val);
        setSelectedKeluhan(COMPLAINT_OPTIONS.filter(opt => val.includes(opt)));
    };

    const handleAnalyze = async () => {
        if (!selectedKeluhan.length && !complaintText.trim()) return;
        setIsAnalyzing(true);
        setAiResult(null);
        trackEvent('ai_consultation', {
            keluhan: selectedKeluhan.join(', ').slice(0, 100),
            pakai_teks: complaintText.trim().length > 0 && complaintText.trim() !== selectedKeluhan.join(', '),
        });
        try {
            const result = await generateAIAdvice(selectedKeluhan, complaintText);
            setAiResult(result);
            setTimeout(() => aiResultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
        } catch {
            setAiResult({ empati: 'Maaf, ada kendala teknis. Tim kami siap membantu via WhatsApp.', edukasi: '', tips_gaya_hidup: [], rekomendasi: [], cta: '' });
        } finally {
            setIsAnalyzing(false);
        }
    };

    // ── Produk rekomendasi dari AI ──
    const recommendedIds = aiResult ? getRecommendedIds(aiResult.rekomendasi) : [];
    const recommendedProducts = KATALOG_PRODUCTS.filter(p => recommendedIds.includes(p.id));

    // ── Filter produk di katalog ──
    const filteredProducts = useMemo(() => {
        return KATALOG_PRODUCTS.filter(p => {
            const catOk = activeCategory === 'all' || p.category === activeCategory;
            const kelOk = activeKeluhan === 'all' || KELUHAN_PRODUCTS[activeKeluhan]?.includes(p.id);
            return catOk && kelOk;
        });
    }, [activeCategory, activeKeluhan]);

    const isFiltering = activeKeluhan !== 'all' || activeCategory !== 'all';

    const handleKeluhanFilter = useCallback((key: string) => {
        setActiveKeluhan(key);
        setActiveCategory('all');
    }, []);

    const handleCategoryFilter = useCallback((cat: string) => {
        setActiveCategory(cat);
        setActiveKeluhan('all');
    }, []);

    const resetFilter = useCallback(() => {
        setActiveKeluhan('all');
        setActiveCategory('all');
    }, []);

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="katalog-page-wrapper">

            <Seo
                title="British Propolis Asli – Katalog & Konsultasi Gratis | Mbak Tila Malang"
                description="Katalog lengkap British Propolis, Brassic, BP Norway & Belgie, terdaftar BPOM. Konsultasi produk gratis dan pesan langsung via WhatsApp bersama Mbak Tila, Malang."
                path="/"
                image="/og/default.jpg"
                jsonLd={[
                    storeLd(),
                    { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: 'Katalog British Propolis', inLanguage: 'id-ID' },
                    {
                        '@type': 'ItemList',
                        name: 'Produk British Propolis',
                        itemListElement: KATALOG_PRODUCTS.map((p, i) => ({
                            '@type': 'ListItem',
                            position: i + 1,
                            url: `${SITE_URL}/produk/${p.id}`,
                            item: productLd(p, `${SITE_URL}/produk/${p.id}`),
                        })),
                    },
                ]}
            />
            <SiteNav />

            {/* ════════════════════════════════════════════════════════
                DUNIA 1 — AI ADVISOR FLOW
            ════════════════════════════════════════════════════════ */}
            <section className="world-section world-advisor" id="advisor" ref={sectionAdvisorRef}>

                {/* Label dunia */}
                <div className="world-label">
                    <span className="material-symbols-rounded">health_and_safety</span>
                    Konsultasi Kesehatan
                </div>

                <PromoStrip />

                {/* ── Value Proposition Banner ── */}
                <div className="advisor-value-banner fade-in">
                    <span className="advisor-value-stat">10.000+</span> keluarga Indonesia sudah memilih British Propolis untuk membantu menjaga kesehatan keluarga setiap hari.
                </div>

                {/* ── AI Advisor Card ── */}
                <div className="advisor-embed-container">
                    <div className="advisor-embed-card fade-in">

                        <div className="advisor-embed-header" style={{ marginBottom: '40px' }}>
                            <div className="advisor-live-badge" style={{ marginBottom: '16px' }}>
                                <span className="advisor-dot" />
                                <span>Konsultasi AI</span>
                                <span className="advisor-free-tag">Gratis</span>
                            </div>
                            <h1 className="advisor-embed-title">
                                Bingung Pilih Produk?<br />
                                <em>Ceritakan Keluhanmu</em>
                            </h1>
                            <p className="advisor-embed-sub" style={{ marginTop: '16px' }}>
                                Pilih keluhan di bawah, AI kami rekomendasikan produk paling tepat dalam hitungan detik.
                            </p>
                        </div>

                        <div className="chips-wrap advisor-chips">
                            {COMPLAINT_OPTIONS.map(opt => (
                                <button key={opt} type="button"
                                    className={`chip ${selectedKeluhan.includes(opt) ? 'active' : ''}`}
                                    onClick={() => toggleComplaint(opt)}
                                >{opt}</button>
                            ))}
                        </div>

                        <textarea ref={complaintTextRef} className="ai-textarea"
                            placeholder="Atau ceritakan keluhan Anda secara lengkap di sini (opsional)..."
                            value={complaintText}
                            onChange={e => handleTextChange(e.target.value)}
                            rows={3}
                        />

                        <button type="button" className="btn-analyze"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing || (!selectedKeluhan.length && !complaintText.trim())}
                        >
                            {isAnalyzing
                                ? <><span className="ai-spinner" style={{ display: 'block' }} />Sedang Menganalisis...</>
                                : <><span className="material-symbols-rounded" style={{ fontSize: '20px' }}>health_and_safety</span>Analisis & Rekomendasikan Produk</>
                            }
                        </button>

                        <div className="advisor-trust-row">
                            <div className="advisor-trust-pills">
                                {[
                                    { icon: 'check_circle', text: 'Gratis' },
                                    { icon: 'bolt', text: '<10 detik' },
                                    { icon: 'lock', text: 'Privasi aman' },
                                ].map(t => (
                                    <span key={t.text} className="advisor-trust-pill">
                                        <span className="material-symbols-rounded" style={{ fontSize: '14px' }}>{t.icon}</span>
                                        {t.text}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── AI Result (muncul setelah analisis) ── */}
                {aiResult && (
                    <div className="ai-result-world" ref={aiResultRef}>
                        <div className="ai-result-container">

                            {/* Empati */}
                            <div className="advisor-empati-block">
                                <span className="advisor-empati-icon">💚</span>
                                <p className="advisor-empati-text">{aiResult.empati}</p>
                            </div>

                            {/* Tips Gaya Hidup */}
                            {aiResult.tips_gaya_hidup.length > 0 && (
                                <div className="advisor-tips-block">
                                    <div className="advisor-tips-label">
                                        <span className="material-symbols-rounded">tips_and_updates</span>
                                        Tips Gaya Hidup untuk Kamu
                                    </div>
                                    <div className="lifestyle-tips">
                                        {aiResult.tips_gaya_hidup.slice(0, 3).map((tip, i) => (
                                            <div key={i} className="tip-item">
                                                <div className="tip-icon">{tip.icon}</div>
                                                <div className="tip-text"><strong>{tip.title}</strong>: {tip.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Produk Rekomendasi Inline ── */}
                            {recommendedProducts.length > 0 && (
                                <div className="inline-reco-section">
                                    <div className="inline-reco-header">
                                        <span className="material-symbols-rounded">medication</span>
                                        <div>
                                            <div className="inline-reco-title">Produk yang Cocok untuk Kamu</div>
                                            <div className="inline-reco-sub">Dipilih AI berdasarkan keluhanmu</div>
                                        </div>
                                    </div>
                                    <div className="inline-reco-list">
                                        {recommendedProducts.map(product => {
                                            const recoData = aiResult.rekomendasi.find(r =>
                                                r.name.toLowerCase().includes(product.name.toLowerCase().split(' ')[0].toLowerCase())
                                            );
                                            const waMsg = `Halo Mbak Tila, saya mau konsultasi/pesan ${product.name} untuk keluhan: ${selectedKeluhan.join(', ')}`;
                                            return (
                                                <div key={product.id} className="inline-reco-card">
                                                    <div className={`inline-reco-img card-img-bg-wrap ${product.bgStyle}`}>
                                                        {product.image
                                                            ? <img src={product.image} alt={product.name} />
                                                            : <span className="material-symbols-rounded">{product.emoji}</span>
                                                        }
                                                    </div>
                                                    <div className="inline-reco-body">
                                                        <div className="inline-reco-name">{product.name}</div>
                                                        {recoData?.reason && (
                                                            <div className="inline-reco-reason">{recoData.reason}</div>
                                                        )}
                                                        <div className="inline-reco-price">{product.price}</div>
                                                    </div>
                                                    <a href={getWaLink(waMsg)} target="_blank" rel="noopener noreferrer"
                                                        className="inline-reco-wa-btn">
                                                        <WaIcon size={16} />
                                                        <span>Pesan</span>
                                                    </a>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* CTA lihat semua produk */}
                                    <button type="button" className="inline-reco-see-all"
                                        onClick={() => scrollTo(sectionProdukRef)}>
                                        <span className="material-symbols-rounded">expand_more</span>
                                        Lihat Semua Produk Kami
                                    </button>
                                </div>
                            )}

                            {/* ── Testimoni Terkait ── */}
                            <div className="inline-testimoni-section">
                                <div className="inline-section-header">
                                    <span className="material-symbols-rounded">format_quote</span>
                                    <div>
                                        <div className="inline-section-title">Cerita Nyata dari Pengguna</div>
                                        <div className="inline-section-sub">
                                            {selectedKeluhan.length > 0
                                                ? `Testimoni untuk keluhan: ${selectedKeluhan.join(', ')}`
                                                : 'Testimoni pilihan dari pelanggan kami'
                                            }
                                        </div>
                                    </div>
                                </div>
                                <TestimoniSection 
                                    activeKeluhan={selectedKeluhan} 
                                    compact={true} 
                                    externalData={aiResult.testimonials}
                                />
                            </div>

                            <p className="health-disclaimer">
                                Rekomendasi ini bersifat informasi umum, bukan diagnosis atau pengganti saran dokter.
                                Testimoni adalah pengalaman pribadi pengguna, hasil pada setiap orang bisa berbeda.
                                Bila keluhan berlanjut, segera konsultasikan dengan tenaga kesehatan.
                            </p>
                        </div>
                    </div>
                )}

                {/* Jelajah sesuai kebutuhan (tautan ke halaman /kebutuhan/...) */}
                <div className="need-home fade-in">
                    <h2>Atau cari sesuai kebutuhan</h2>
                    <KebutuhanGrid />
                </div>

                {/* Separator bawah Dunia 1 */}
                <div className="world-divider">
                    <span>Jelajahi Lebih Lanjut</span>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                DUNIA 2 — KATALOG PRODUK
            ════════════════════════════════════════════════════════ */}
            <section className="world-section world-produk" id="produk" ref={sectionProdukRef}>

                <div className="world-label">
                    <span className="material-symbols-rounded">inventory_2</span>
                    Katalog Produk
                </div>

                <div className="container">

                    {/* ─── Merged Catalog Hero ─── */}
                    <div className="brand-hero catalog-merged-hero fade-in" style={{ marginBottom: '80px' }}>
                        <div className="brand-hero-left">
                            <span className="section-tag">Healthy Living Guide</span>
                            <h2 className="brand-title">
                                Semua Produk <em>British Propolis</em>
                                <span className="brand-subtitle">(Katalog Mbak Tila, Malang)</span>
                            </h2>
                            <p className="brand-desc">
                                Propolis dari lebah habitat 4 musim di East Yorkshire, Inggris, sumber flavonoid alami. Terdaftar di BPOM RI dan bersertifikat Halal (MUI/HMC), menjadi pilihan banyak keluarga Indonesia untuk menjaga kesehatan sehari-hari.
                            </p>
                            <div className="brand-stats">
                                {[
                                    { num: '12+', label: 'Produk Unggulan' },
                                    { num: '4', label: 'Kategori Utama' },
                                    { num: '10rb+', label: 'Keluarga Terlayani' },
                                    { num: '2018', label: 'Berdiri Sejak' },
                                ].map(s => (
                                    <div key={s.label}>
                                        <span className="bstat-num">{s.num}</span>
                                        <div className="bstat-label">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="brand-hero-right">
                            <div className="brand-img-grid ingredient-grid">
                                {[
                                    { src: '/images/katalog/propolis-400.webp', title: 'British Propolis', desc: '100% Ekstrak Asli Inggris' },
                                    { src: '/images/katalog/moringa-400.webp', title: 'Moringa Oleifera', desc: 'Superfood Kaya Nutrisi' },
                                    { src: '/images/katalog/salmon-400.webp', title: 'Salmon Omega-3', desc: 'Tinggi DHA dari Norwegia' },
                                    { src: '/images/katalog/collagen-400.webp', title: 'Marine Collagen', desc: 'Untuk Perawatan Kulit' },
                                ].map(item => (
                                    <div key={item.title} className="brand-img-card ingredient-card">
                                        <img src={item.src} alt={item.title} className="ingredient-img" />
                                        <div className="ingredient-info">
                                            <span className="title">{item.title}</span>
                                            <span className="desc">{item.desc}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Trust Bar (Inline under Hero) */}
                    <div className="trust-bar trust-bar-inline fade-in">
                        {[
                            { icon: 'verified_user', text: 'BPOM RI' },
                            { icon: 'verified', text: 'Halal MUI' },
                            { icon: 'security', text: 'FDA USA Registered' },
                            { icon: 'workspace_premium', text: 'HMC UK Halal certified' },
                        ].map((item, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <div className="trust-sep" />}
                                <div className="trust-item">
                                    <span className="material-symbols-rounded icon" style={{ fontSize: '18px' }}>{item.icon}</span>
                                    {item.text}
                                </div>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* ── Compact Filter Bar ── */}
                    <div className="compact-filter-bar fade-in">

                        {/* Row 1 — Keluhan */}
                        <div className="compact-filter-row">
                            <span className="compact-filter-label">
                                <span className="material-symbols-rounded">favorite</span>
                                Keluhan
                            </span>
                            <div className="compact-filter-chips keluhan-tabs">
                                {KELUHAN_FILTER_TABS.map(tab => (
                                    <button key={tab.key} type="button"
                                        className={`cfc-chip ${activeKeluhan === tab.key ? 'active' : ''}`}
                                        onClick={() => handleKeluhanFilter(tab.key)}
                                    >{tab.label}</button>
                                ))}
                            </div>
                        </div>

                        <div className="compact-filter-divider" />

                        {/* Row 2 — Kategori */}
                        <div className="compact-filter-row">
                            <span className="compact-filter-label">
                                <span className="material-symbols-rounded">category</span>
                                Kategori
                            </span>
                            <div className="compact-filter-chips">
                                {[
                                    { key: 'all', label: 'Semua' },
                                    { key: 'propolis', label: 'Propolis' },
                                    { key: 'skincare', label: 'Skincare' },
                                    { key: 'suplemen', label: 'Suplemen' },
                                    { key: 'natural', label: 'Natural' },
                                ].map(cat => (
                                    <button key={cat.key} type="button"
                                        className={`cfc-chip ${activeCategory === cat.key ? 'active' : ''}`}
                                        onClick={() => handleCategoryFilter(cat.key)}
                                    >{cat.label}</button>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Filter result info bar */}
                    {isFiltering && (
                        <div className="filter-result-bar">
                            {filteredProducts.length > 0 ? (
                                <>
                                    <span className="material-symbols-rounded">check_circle</span>
                                    <strong>{filteredProducts.length}</strong> produk ditemukan
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-rounded">search_off</span>
                                    Tidak ada produk yang cocok
                                </>
                            )}
                            <button type="button" className="filter-reset-link" onClick={resetFilter}>
                                Lihat Semua ✕
                            </button>
                        </div>
                    )}

                    {/* Product Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="product-grid" id="productGrid">
                            {filteredProducts.map((product, idx) => {
                                const waMsg = `Halo Mbak Tila, saya mau tanya-tanya/pesan ${product.name}`;
                                return (
                                    <div key={product.id}
                                        className="product-card product-card-animated"
                                        style={{ animationDelay: `${idx * 60}ms` }}>
                                        <div className="card-inner">
                                            <div className="card-img" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--green-ultra)', overflow: 'hidden' }}>
                                                <div className={`card-img-bg ${product.bgStyle}`} />
                                                {product.image
                                                    ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 2 }} />
                                                    : <span className="material-symbols-rounded" style={{ fontSize: '72px', color: 'var(--green-dark)', position: 'relative', zIndex: 2 }}>{product.emoji}</span>
                                                }
                                            </div>
                                            <div className="card-body">
                                                <span className={`card-badge badge-${product.badgeColor}`}>{product.badgeText}</span>
                                                <Link to={`/produk/${product.id}`} className="card-name card-name-link">{product.name}</Link>
                                                <div className="card-tagline">{product.tagline}</div>
                                                <p className="card-desc">{product.description}</p>
                                                <Link to={`/produk/${product.id}`} className="card-detail-link">
                                                    Lihat detail, cara pesan & FAQ
                                                    <span className="material-symbols-rounded" aria-hidden="true">arrow_forward</span>
                                                </Link>
                                                <ul className="card-benefits">
                                                    {product.benefits.map((b, i) => <li key={i}>{b}</li>)}
                                                </ul>
                                                <div className="card-specs">
                                                    {product.specs.map((s, i) => (
                                                        <span key={i} className="spec-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                            <span className="material-symbols-rounded" style={{ fontSize: '14px' }}>{s.icon}</span>{s.text}
                                                        </span>
                                                    ))}
                                                </div>
                                                {product.nomorRegistrasi && (
                                                    <div className="card-registrasi">
                                                        <span className="material-symbols-rounded" style={{ fontSize: '13px' }}>verified_user</span>
                                                        <span>No. Reg: <strong>{product.nomorRegistrasi}</strong></span>
                                                    </div>
                                                )}
                                                <div className="card-footer" style={{ flexDirection: 'column', gap: '12px', alignItems: 'stretch' }}>
                                                    <div className="price-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', width: '100%', marginBottom: '4px' }}>
                                                        <div>
                                                            {product.oldPrice && <span className="price-old" style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '11px', marginRight: '6px' }}>{product.oldPrice}</span>}
                                                            <span className="price">{product.price}</span>
                                                        </div>
                                                        <span className="price-note">{product.priceNote}</span>
                                                    </div>
                                                    {product.hargaTier && product.hargaTier.length > 0 && (
                                                        <div>
                                                            <button
                                                                type="button"
                                                                className="price-tier-toggle"
                                                                onClick={() => toggleTier(product.id)}
                                                            >
                                                                <span className="material-symbols-rounded" style={{ fontSize: '14px' }}>sell</span>
                                                                Harga Mitra
                                                                <span className="material-symbols-rounded" style={{ fontSize: '14px', marginLeft: 'auto', transition: 'transform 0.2s', transform: expandedTiers.has(product.id) ? 'rotate(180deg)' : 'none' }}>expand_more</span>
                                                            </button>
                                                            {expandedTiers.has(product.id) && (
                                                                <div className="price-tier-table">
                                                                    {product.hargaTier.map((tier, i) => (
                                                                        <div key={i} className="price-tier-row">
                                                                            <span className="tier-label">{tier.label} <span className="tier-qty">({tier.minQty})</span></span>
                                                                            <span className="tier-price">{tier.harga}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    <a href={getWaLink(waMsg)} target="_blank" rel="noopener noreferrer"
                                                        className="btn-cta-wa" style={{ width: '100%', justifyContent: 'center' }}>
                                                        <span className="material-symbols-rounded" style={{ marginRight: '8px' }}>chat_bubble</span>
                                                        Pesan Sekarang via WA
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : isFiltering ? (
                        <div className="filter-empty-state">
                            <span className="material-symbols-rounded" style={{ fontSize: '48px', color: 'var(--text-light)' }}>search_off</span>
                            <p>Tidak ada produk untuk keluhan ini.</p>
                            <button type="button" className="cfc-chip active" onClick={resetFilter}>
                                Tampilkan Semua Produk
                            </button>
                        </div>
                    ) : null}

                </div>

                <div className="world-divider">
                    <span>Peluang Bisnis</span>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                DUNIA 2.5 — WALL OF LOVE (400+ TESTIMONI)
            ════════════════════════════════════════════════════════ */}
            <TestimonialWall />

            <ArticleTeaser />

            {/* ════════════════════════════════════════════════════════
                DUNIA 3 — TENTANG BISNIS (Placeholder)
            ════════════════════════════════════════════════════════ */}
            <section className="world-section world-bisnis" id="bisnis" ref={sectionBisnisRef}>

                <div className="container">

                    {/* Hero Bisnis */}
                    <div className="bisnis-hero fade-in">
                        <div className="bisnis-hero-badge">
                            <span className="material-symbols-rounded">trending_up</span>
                            Quantum Millionaire Partner Program
                        </div>
                        <h2 className="bisnis-hero-title">
                            Bukan Sekadar Konsumen<br />
                            <em>Jadilah Mitra & Raih Penghasilan</em>
                        </h2>
                        <p className="bisnis-hero-sub">
                            Bergabunglah bersama ribuan mitra aktif Quantum Millionaire.
                            Bangun bisnis kesehatan yang menguntungkan sambil membantu orang-orang di sekitarmu hidup lebih sehat.
                        </p>
                        <a href={getWaLink('Halo Mbak Tila, saya tertarik bergabung sebagai mitra British Propolis. Bisa minta info lengkapnya?')}
                            target="_blank" rel="noopener noreferrer"
                            className="bisnis-hero-cta">
                            <WaIcon size={20} />
                            Saya Mau Jadi Mitra, Info Lengkap via WA
                        </a>
                    </div>

                    {/* Keuntungan Menjadi Mitra */}
                    <div className="bisnis-keuntungan-section fade-in" style={{ marginBottom: '60px' }}>
                        <div className="world-section-header">
                            <span className="tag">Mengapa Bergabung?</span>
                            <h3>Hak & Keuntungan Mitra <em>Quantum Millionaire</em></h3>
                        </div>
                        <div className="bisnis-cards-grid">
                            {KEUNTUNGAN_MITRA.map((item, i) => (
                                <div key={i} className="bisnis-card">
                                    <div className="bisnis-card-icon">
                                        <span className="material-symbols-rounded">{item.icon}</span>
                                    </div>
                                    <div className="bisnis-card-title">{item.title}</div>
                                    <div className="bisnis-card-desc">{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Testimoni Bisnis (Sukses Mitra) */}
                    <BusinessTestimonials />

                    {/* Cara Bergabung */}
                    <div className="bisnis-steps-section fade-in" style={{ marginBottom: '60px' }}>
                        <div className="world-section-header">
                            <span className="tag">Cara Bergabung</span>
                            <h3>3 Langkah Mudah Mulai Bisnis</h3>
                        </div>
                        <div className="bisnis-steps-grid">
                            {LANGKAH_MITRA.map((item, i) => (
                                <div key={i} className="bisnis-step-card">
                                    <div className="bisnis-step-num">{item.step}</div>
                                    <div className="bisnis-step-icon">
                                        <span className="material-symbols-rounded">{item.icon}</span>
                                    </div>
                                    <div className="bisnis-step-title">{item.title}</div>
                                    <div className="bisnis-step-desc">{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Paket Bisnis Mitra */}
                    <div className="bisnis-paket-section fade-in">
                        <div className="world-section-header">
                            <span className="tag">Pilih Paket Kemitraan</span>
                            <h3>Mulai Bisnis dengan <em>Membeli Produk BP</em></h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '12px' }}>
                                Pembelian paket bisa di-MIX produknya (BP/Brassic/Norway/Belgie/Steffi)
                            </p>
                        </div>
                        <div className="bisnis-paket-grid">
                            {PAKET_KEMITRAAN.map((paket, i) => (
                                <div key={i} className={`bisnis-paket-card ${paket.highlight ? 'paket-highlight' : ''}`}>
                                    {paket.highlight && <div className="paket-best-badge">Paling Untung</div>}
                                    <div className="paket-header">
                                        <div className="paket-nama">{paket.nama}</div>
                                        <div className="paket-jumlah">{paket.jumlah}</div>
                                    </div>
                                    <div className="paket-harga-utama">{paket.hargaPaket}</div>
                                    <div className="paket-detail-table">
                                        <div className="paket-row">
                                            <span>Modal per botol</span>
                                            <strong>{paket.modal}</strong>
                                        </div>
                                        <div className="paket-row">
                                            <span>Harga jual satuan</span>
                                            <strong>{paket.jual}</strong>
                                        </div>
                                        <div className="paket-row paket-row-untung">
                                            <span>Untung per botol</span>
                                            <strong>{paket.untung}</strong>
                                        </div>
                                        <div className="paket-row paket-row-potensi">
                                            <span>Potensi untung max</span>
                                            <strong>{paket.potensi}</strong>
                                        </div>
                                    </div>
                                    <a href={getWaLink(`Halo Mbak Tila, saya tertarik dengan ${paket.nama} (${paket.jumlah}) seharga ${paket.hargaPaket}. Bisa info lebih lanjut?`)}
                                        target="_blank" rel="noopener noreferrer"
                                        className="paket-cta-btn">
                                        <WaIcon size={16} />
                                        Ambil {paket.nama}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* CTA Bisnis */}
                    <div className="bisnis-cta-block fade-in">
                        <h3 className="bisnis-cta-title">Siap Memulai Perjalanan Bisnismu?</h3>
                        <p className="bisnis-cta-sub">Konsultasi gratis, tim kami akan bantu kamu memulai tanpa rasa bingung.</p>
                        <div className="cta-btn-group">
                            <a href={getWaLink('Halo Mbak Tila, saya tertarik bergabung sebagai mitra British Propolis. Bisa minta info lengkapnya?')}
                                target="_blank" rel="noopener noreferrer" className="bisnis-cta-btn-primary">
                                <WaIcon size={20} />
                                Gabung Jadi Mitra via WA
                            </a>
                            <a href={getWaLink('Halo Mbak Tila, saya mau konsultasi produk dulu sebelum bergabung sebagai mitra British Propolis')}
                                target="_blank" rel="noopener noreferrer" className="bisnis-cta-btn-secondary">
                                <span className="material-symbols-rounded">help_outline</span>
                                Tanya-Tanya Dulu
                            </a>
                        </div>
                        <div className="bisnis-more-links">
                            <Link to="/mitra" className="bisnis-more-link">Pelajari program kemitraan →</Link>
                            <Link to="/panduan-bisnis" className="bisnis-more-link">Panduan gratis 7 langkah mulai bisnis →</Link>
                        </div>
                    </div>

                </div>
            </section>

            <SiteFooter />

            {/* ════════════════ STICKY WA (Desktop) ════════════════ */}
            <a href={getWaLink('Halo Mbak Tila, saya mau konsultasi produk British Propolis')}
                target="_blank" rel="noopener noreferrer"
                className="sticky-wa desktop-only" title="Hubungi via WhatsApp">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <WaIcon size={28} />
                    <span style={{ color: 'white', fontWeight: 600, fontSize: '15px', whiteSpace: 'nowrap' }}>Chat Sekarang</span>
                </div>
            </a>

            {/* ════════════════ MOBILE STICKY BAR (4 tombol) ════════════════ */}
            <div className="mobile-sticky-bar mobile-only">
                <button type="button" className="mobile-bar-btn" onClick={() => scrollTo(sectionAdvisorRef)}>
                    <span className="material-symbols-rounded">health_and_safety</span>
                    <span>Konsultasi</span>
                </button>
                <div className="mobile-bar-divider" />
                <button type="button" className="mobile-bar-btn" onClick={() => scrollTo(sectionProdukRef)}>
                    <span className="material-symbols-rounded">inventory_2</span>
                    <span>Produk</span>
                </button>
                <div className="mobile-bar-divider" />
                <button type="button" className="mobile-bar-btn" onClick={() => scrollTo(sectionBisnisRef)}>
                    <span className="material-symbols-rounded">handshake</span>
                    <span>Bisnis</span>
                </button>
                <div className="mobile-bar-divider" />
                <a href={getWaLink('Halo Mbak Tila, saya mau konsultasi produk British Propolis')}
                    target="_blank" rel="noopener noreferrer"
                    className="mobile-bar-btn mobile-bar-wa">
                    <WaIcon size={20} />
                    <span>WA</span>
                </a>
            </div>

        </div>
    );
}
