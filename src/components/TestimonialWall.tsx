import React, { useState, useMemo } from 'react';
import { useTestimonials } from '@/hooks/useTestimonials';
import { TestimoniCard } from './TestimoniCard';
import { KELUHAN_FILTER_TABS } from '@/pages/KatalogProdukPage';

// Mapping categories to DB tags/keywords for accurate counting
const CATEGORY_MAP: Record<string, string[]> = {
    tidur: ['tidur', 'susah_tidur'],
    sendi: ['sendi', 'nyeri_sendi', 'tulang'],
    imun: ['imun', 'daya_tahan'],
    mata: ['mata', 'brassiceye'],
    gula: ['gula', 'guladarah', 'diabetes'],
    anak: ['anak', 'nafsu_makan'],
    rambut: ['rambut'],
    kulit: ['kulit', 'flek', 'jerawat', 'wajah'],
    flu: ['flu', 'batuk', 'pilek', 'asma', 'paru'],
    fokus: ['fokus', 'otak'],
    stamina: ['stamina', 'lelah'],
    wanita: ['wanita', 'hormon', 'kista', 'ovarium', 'haid']
};

const PRODUCT_RECOMMENDATION_MAP = [
    { id: 'steffi-pro', name: 'Steffi Pro', image: '/images/produk/steffi.webp', keywords: ['gula', 'diabetes', 'manis', 'diet', 'stevia', 'karbo'] },
    { id: 'brassic-pro', name: 'Brassic Pro', image: '/images/produk/brassicpro.webp', keywords: ['tidur', 'insomnia', 'sendi', 'rematik', 'kolesterol', 'asam urat', 'tulang'] },
    { id: 'brassic-eye', name: 'Brassic Eye', image: '/images/produk/brassiceye.webp', keywords: ['mata', 'kacamata', 'minus', 'silinder', 'katarak', 'lelah'] },
    { id: 'british-propolis-green', name: 'British Propolis Green', image: '/images/produk/bpgreen.webp', keywords: ['anak', 'nafsu makan', 'kecerdasan', 'balita'] },
    { id: 'british-propolis-blue', name: 'British Propolis Blue', image: '/images/produk/bpblue.webp', keywords: ['wanita', 'haid', 'kista', 'promil', 'rahim', 'hormon'] },
    { id: 'bp-norway', name: 'BP Norway', image: '/images/produk/norway.webp', keywords: ['fokus', 'memori', 'otak', 'konsentrasi'] },
    { id: 'belgie-serum', name: 'Belgie Pro', image: '/images/produk/serum.webp', keywords: ['kulit', 'wajah', 'serum', 'jerawat', 'flek', 'facial'] },
    { id: 'british-propolis', name: 'British Propolis', image: '/images/produk/bp.webp', keywords: ['imun', 'maag', 'stamina', 'flu', 'batuk', 'pilek', 'asma', 'paru'] },
];

export function TestimonialWall() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [limit, setLimit] = useState(12);

    const { data: allData, loading } = useTestimonials({ limit: 200 });

    // Calculate dynamic counts for each tab
    const tabCounts = useMemo(() => {
        const counts: Record<string, number> = { all: allData.length };
        
        allData.forEach(t => {
            const tags = t.tags || [];
            Object.entries(CATEGORY_MAP).forEach(([key, keywords]) => {
                const hasMatch = tags.some(tag => 
                    keywords.some(k => tag.toLowerCase().includes(k.toLowerCase()))
                ) || keywords.some(k => t.content.toLowerCase().includes(k.toLowerCase()));
                
                if (hasMatch) {
                    counts[key] = (counts[key] || 0) + 1;
                }
            });
        });
        
        return counts;
    }, [allData]);

    // Only show tabs that have data
    const visibleTabs = useMemo(() => {
        return KELUHAN_FILTER_TABS.filter(tab => 
            tab.key === 'all' || (tabCounts[tab.key] || 0) > 0
        );
    }, [tabCounts]);

    // Filter logic for the list + enrichment with recommendations
    const filteredData = useMemo(() => {
        return allData.filter(t => {
            const matchesSearch = t.content.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (activeTab === 'all') return matchesSearch;
            
            const keywords = CATEGORY_MAP[activeTab] || [];
            const matchesTab = (t.tags || []).some(tag => 
                keywords.some(k => tag.toLowerCase().includes(k.toLowerCase()))
            ) || keywords.some(k => t.content.toLowerCase().includes(k.toLowerCase()));

            return matchesSearch && matchesTab;
        }).map(t => {
            // Smart Recommendation Logic
            const contentLower = t.content.toLowerCase();
            const tagsLower = (t.tags || []).map(tag => tag.toLowerCase());
            
            const recommendation = PRODUCT_RECOMMENDATION_MAP.find(p => 
                p.keywords.some(k => contentLower.includes(k)) || 
                p.keywords.some(k => tagsLower.some(tag => tag.includes(k)))
            );

            return {
                ...t,
                recommendation: recommendation ? {
                    id: recommendation.id,
                    name: recommendation.name,
                    image: recommendation.image
                } : undefined
            };
        });
    }, [allData, searchQuery, activeTab]);

    const displayedData = filteredData.slice(0, limit);

    return (
        <section id="testimoni-wall" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                        Wall of Love
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
                        Kisah Nyata Keluarga <em className="italic text-green-700 not-italic">British Propolis</em>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Berikut adalah ribuan bukti pemulihan kesehatan yang dikirimkan langsung oleh mitra dan pelanggan kami.
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="sticky top-20 z-30 bg-white/80 backdrop-blur-md py-4 mb-10 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                            <input 
                                type="text"
                                placeholder="Cari keluhan (misal: kista, amandel, stroke)..."
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
                            {visibleTabs.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => {
                                        setActiveTab(tab.key);
                                        setLimit(12);
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                                        activeTab === tab.key 
                                        ? 'bg-green-600 text-white shadow-lg shadow-green-200' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {tab.label}
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                        {tabCounts[tab.key] || 0}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Masonry-like Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1,2,3,4,5,6].map(i => (
                            <div key={i} className="h-64 bg-gray-50 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            {displayedData.map((t) => (
                                <div key={t.id} className="break-inside-avoid">
                                    <TestimoniCard testimoni={t} />
                                </div>
                            ))}
                        </div>

                        {filteredData.length > limit && (
                            <div className="mt-12 text-center">
                                <button 
                                    onClick={() => setLimit(prev => prev + 12)}
                                    className="px-8 py-3 bg-white border-2 border-green-600 text-green-600 font-bold rounded-xl hover:bg-green-50 transition-all flex items-center gap-2 mx-auto"
                                >
                                    <span className="material-symbols-rounded">expand_more</span>
                                    Lihat Lebih Banyak Testimoni
                                </button>
                                <p className="text-gray-400 text-sm mt-4">
                                    Menampilkan {limit} dari {filteredData.length} testimoni relevan
                                </p>
                            </div>
                        )}

                        {filteredData.length === 0 && (
                            <div className="text-center py-20">
                                <span className="material-symbols-rounded text-6xl text-gray-200 mb-4">sentiment_dissatisfied</span>
                                <p className="text-gray-500">Maaf, belum ada testimoni untuk kategori tersebut.</p>
                                <button 
                                    onClick={() => {setSearchQuery(''); setActiveTab('all');}}
                                    className="text-green-600 font-bold mt-2"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
