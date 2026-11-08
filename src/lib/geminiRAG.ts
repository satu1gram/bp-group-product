// ============================================================
// geminiRAG.ts — AI Advisor via Supabase Edge Function `ai-konsultasi`
// ============================================================

import { supabase } from "@/integrations/supabase/client";

// ── Tipe data ─────────────────────────────────────────────────────
export interface RAGResult {
    empati: string;
    edukasi: string;
    tips_gaya_hidup: { icon: string; title: string; description: string }[];
    rekomendasi: { name: string; emoji: string; reason: string; price: string }[];
    cta: string;
    testimonials?: { id: string; text: string; sender: string }[];
}

// ── Cache ──────────────────────────────────────────────────────────
const CACHE_TTL_HOURS = 24;
const CACHE_PREFIX = 'bp_gemini_v2_';

interface CacheEntry { value: string; expiry: number; }

function buildCacheKey(input: string): string {
    const normalized = input.toLowerCase().trim().replace(/\s+/g, ' ').substring(0, 200);
    return CACHE_PREFIX + btoa(encodeURIComponent(normalized)).replace(/=/g, '');
}

function readCache(key: string): string | null {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const entry: CacheEntry = JSON.parse(raw);
        if (Date.now() > entry.expiry) { localStorage.removeItem(key); return null; }
        return entry.value;
    } catch { return null; }
}

function writeCache(key: string, value: string): void {
    try {
        localStorage.setItem(key, JSON.stringify({ value, expiry: Date.now() + CACHE_TTL_HOURS * 3600000 }));
    } catch { /* storage full */ }
}

export function clearExpiredCache(): void {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX));
    for (const key of keys) {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) continue;
            const entry: CacheEntry = JSON.parse(raw);
            if (Date.now() > entry.expiry) localStorage.removeItem(key);
        } catch { localStorage.removeItem(key); }
    }
}

// ── Dynamic Fallback ──────────────────────────────────────────────
type LifestyleTip = { icon: string; title: string; description: string };

const FALLBACK_RULES: Record<string, { tips: LifestyleTip[]; products: string[] }> = {
    tidur: {
        tips: [
            { icon: '🌙', title: 'Power Down', description: 'Matikan gadget 60 menit sebelum tidur agar hormon melatonin bekerja optimal.' },
            { icon: '🍵', title: 'Chamomile Tea', description: 'Minum seduhan hangat untuk menenangkan sistem saraf pusat.' }
        ],
        products: ['Brassic Pro', 'British Propolis']
    },
    sendi: {
        tips: [
            { icon: '🧘', title: 'Stretching Rendah Kompresi', description: 'Lakukan peregangan ringan setiap pagi untuk melumasi persendian.' },
            { icon: '🔥', title: 'Kompres Hangat', description: 'Gunakan handuk hangat pada area nyeri selama 15 menit.' }
        ],
        products: ['Brassic Pro', 'British Propolis']
    },
    rambut: {
        tips: [
            { icon: '💆', title: 'Pijat Kulit Kepala', description: 'Lakukan pijat ringan selama 5 menit untuk melancarkan sirkulasi darah ke folikel rambut.' },
            { icon: '🥩', title: 'Makan Protein Tinggi', description: 'Konsumsi telur, ikan, dan kacang-kacangan untuk memperkuat struktur rambut.' },
            { icon: '🌿', title: 'Hindari Bahan Kimia', description: 'Kurangi penggunaan hair styling products yang mengandung bahan kimia keras.' }
        ],
        products: ['Belgie Hair Tonic', 'British Propolis']
    },
    anak: {
        tips: [
            { icon: '🥦', title: 'Visual Food Styling', description: 'Hias makanan dengan bentuk menarik untuk meningkatkan minat makan si kecil.' },
            { icon: '🕒', title: 'Jadwal Konsisten', description: 'Berikan snack sehat di jam yang sama agar metabolisme anak terbentuk.' }
        ],
        products: ['British Propolis Green']
    },
    wanita: {
        tips: [
            { icon: '🧘', title: 'Peregangan Panggul', description: 'Lakukan pose yoga ringan untuk melancarkan sirkulasi di area reproduksi.' },
            { icon: '🍫', title: 'Dark Chocolate', description: 'Konsumsi cokelat hitam tanpa gula untuk bantu redakan kram perut.' }
        ],
        products: ['British Propolis Blue']
    },
    mata: {
        tips: [
            { icon: '👁️', title: 'Aturan 20-20-20', description: 'Tiap 20 menit, lihat objek sejauh 20 kaki selama 20 detik untuk rileksasi mata.' },
            { icon: '🥕', title: 'Cukupan Vitamin A', description: 'Konsumsi asupan bergizi untuk memperkuat sel retina mata.' }
        ],
        products: ['Brassic Eye']
    },
    kulit: {
        tips: [
            { icon: '🧴', title: 'Double Cleansing', description: 'Bersihkan wajah dua kali: pertama dengan makeup remover, kedua dengan facial wash.' },
            { icon: '💧', title: 'Hydration', description: 'Gunakan pelembab dan minum air putih minimal 8 gelas sehari.' },
            { icon: '🌞', title: 'Sunscreen', description: 'Gunakan sunscreen SPF 30+ setiap hari meskipun di dalam ruangan.' }
        ],
        products: ['Belgie Anti Aging Serum', 'Belgie Facial Wash']
    },
    gula: {
        tips: [
            { icon: '🥗', title: 'Diet Rendah Karbohidrat', description: 'Pilih karbohidrat kompleks seperti quinoa, brown rice, dan oatmeal.' },
            { icon: '🏃', title: 'Olahraga Rutin', description: 'Lakukan jalan kaki 30 menit setiap hari untuk meningkatkan sensitivitas insulin.' },
            { icon: '🥜', title: 'Snack Sehat', description: 'Ganti camilan manis dengan kacang almond, yogurt, atau buah berry.' }
        ],
        products: ['Steffi Pro', 'British Propolis']
    },
    imun: {
        tips: [
            { icon: '🍊', title: 'Vitamin C Alami', description: 'Konsumsi jeruk, strawberry, dan sayuran hijau untuk daya tahan tubuh.' },
            { icon: '😴', title: 'Tidur Cukup', description: 'Pastikan tidur 7-8 jam setiap malam untuk regenerasi sel imun.' },
            { icon: '🧘', title: 'Stress Management', description: 'Lakukan meditasi 10 menit setiap hari untuk mengurangi kortisol.' }
        ],
        products: ['British Propolis', 'British Propolis Green']
    },
    stamina: {
        tips: [
            { icon: '🥤', title: 'Electrolyte Balance', description: 'Minum air kelapa atau tambahkan garam Himalaya untuk keseimbangan elektrolit.' },
            { icon: '🍯', title: 'Natural Energy', description: 'Konsumsi madu dan kurma sebagai sumber energi alami.' },
            { icon: '🏋️', title: 'Progressive Exercise', description: 'Mulai dengan olahraga ringan dan tingkatkan intensitas secara bertahap.' }
        ],
        products: ['British Propolis', 'BP Norway']
    },
    fokus: {
        tips: [
            { icon: '🧠', title: 'Brain Training', description: 'Lakukan puzzle atau game strategi 15 menit setiap hari untuk melatih fokus.' },
            { icon: '🎵', title: 'Focus Music', description: 'Dengarkan instrumental music atau white noise saat bekerja.' },
            { icon: '🍳', title: 'Omega-3 Breakfast', description: 'Sarapan dengan telur, ikan salmon, atau walnut untuk nutrisi otak.' }
        ],
        products: ['Brassic Pro', 'British Propolis']
    }
};

function getDynamicFallback(query: string): RAGResult {
    const q = query.toLowerCase();
    let selected = FALLBACK_RULES['imun']; // Default ke IMUNITAS

    // Priority mapping untuk keluhan spesifik
    if (q.includes('rambut') || q.includes('rontok') || q.includes('botak') || q.includes('ketombe')) {
        selected = FALLBACK_RULES['rambut'];
        console.log('[AI] 🎯 Keluhan detected: RAMBUT -> Belgie Hair Tonic');
    }
    else if (q.includes('kulit') || q.includes('flek') || q.includes('jerawat') || q.includes('wajah') || q.includes('kusam')) {
        selected = FALLBACK_RULES['kulit'];
        console.log('[AI] 🎯 Keluhan detected: KULIT -> Belgie Serum & Facial Wash');
    }
    else if (q.includes('gula') || q.includes('diabetes') || q.includes('manis') || q.includes('kencing manis')) {
        selected = FALLBACK_RULES['gula'];
        console.log('[AI] 🎯 Keluhan detected: GULA DARAH -> Steffi Pro');
    }
    else if (q.includes('imun') || q.includes('daya tahan') || q.includes('sakit') || q.includes('flu') || q.includes('batuk')) {
        selected = FALLBACK_RULES['imun'];
        console.log('[AI] 🎯 Keluhan detected: IMUN -> British Propolis');
    }
    else if (q.includes('stamina') || q.includes('energi') || q.includes('lemas') || q.includes('capek') || q.includes('letih')) {
        selected = FALLBACK_RULES['stamina'];
        console.log('[AI] 🎯 Keluhan detected: STAMINA -> British Propolis/BP Norway');
    }
    else if (q.includes('fokus') || q.includes('konsentrasi') || q.includes('otak') || q.includes('ingatan') || q.includes('lupa')) {
        selected = FALLBACK_RULES['fokus'];
        console.log('[AI] 🎯 Keluhan detected: FOKUS -> Brassic Pro');
    }
    else if (q.includes('anak') || q.includes('makan') || q.includes('lahap') || q.includes('nafsu')) {
        selected = FALLBACK_RULES['anak'];
        console.log('[AI] 🎯 Keluhan detected: ANAK -> British Propolis Green');
    }
    else if (q.includes('sendi') || q.includes('tulang') || q.includes('pegal') || q.includes('nyeri') || q.includes('asam urat') || q.includes('rematik')) {
        selected = FALLBACK_RULES['sendi'];
        console.log('[AI] 🎯 Keluhan detected: SENDI -> Brassic Pro');
    }
    else if (q.includes('haid') || q.includes('wanita') || q.includes('hormon') || q.includes('promil') || q.includes('hamil')) {
        selected = FALLBACK_RULES['wanita'];
        console.log('[AI] 🎯 Keluhan detected: WANITA -> British Propolis Blue');
    }
    else if (q.includes('mata') || q.includes('lelah') || q.includes('rabun') || q.includes('silau')) {
        selected = FALLBACK_RULES['mata'];
        console.log('[AI] 🎯 Keluhan detected: MATA -> Brassic Eye');
    }
    else if (q.includes('tidur') || q.includes('insomnia') || q.includes('sulit tidur') || q.includes('gelisah')) {
        selected = FALLBACK_RULES['tidur'];
        console.log('[AI] 🎯 Keluhan detected: TIDUR -> Brassic Pro');
    }
    else {
        console.log('[AI] 🎯 Keluhan not detected, using default: IMUNITAS -> British Propolis');
    }

    const productDetails: Record<string, { emoji: string; reason: string }> = {
        'British Propolis': { emoji: '🍯', reason: 'Membantu memelihara daya tahan tubuh' },
        'British Propolis Green': { emoji: '🧒', reason: 'Propolis untuk anak, membantu memelihara daya tahan tubuh si kecil' },
        'British Propolis Blue': { emoji: '💜', reason: 'Varian propolis yang diformulasikan khusus untuk wanita' },
        'Brassic Pro': { emoji: '💪', reason: 'Moringa & Echinacea, teman saat badan pegal dan ingin istirahat lebih nyenyak' },
        'Brassic Eye': { emoji: '👁️', reason: 'Bilberry & Gynura, membantu memelihara kesehatan mata' },
        'Belgie Hair Tonic': { emoji: '💇', reason: 'Membantu merawat kulit kepala dan kekuatan rambut' },
        'Belgie Anti Aging Serum': { emoji: '✨', reason: 'Membantu menyamarkan tampilan flek dan garis halus' },
        'Belgie Facial Wash': { emoji: '🧼', reason: 'Membersihkan wajah dari kotoran dan minyak berlebih' },
        'Steffi Pro': { emoji: '🩸', reason: 'Pemanis stevia, pilihan saat mengurangi gula pasir' },
        'BP Norway': { emoji: '🌊', reason: 'Omega-3 dari salmon Norwegia untuk melengkapi nutrisi harian' },
    };

    return {
        empati: "Terima kasih sudah bercerita. Kami paham keluhan seperti ini bisa mengganggu aktivitas sehari-hari 🌿",
        edukasi: "Banyak masalah kesehatan ringan berawal dari pola istirahat dan nutrisi yang kurang seimbang.",
        tips_gaya_hidup: selected.tips,
        rekomendasi: selected.products.map(name => ({
            name,
            emoji: productDetails[name]?.emoji || '🌿',
            reason: productDetails[name]?.reason || 'Membantu memelihara kesehatan tubuh',
            price: 'Rp 265.000'
        })),
        cta: "Ingin tahu cara pakai yang pas? Ngobrol langsung dengan Mbak Tila via WhatsApp, gratis 💬",
        testimonials: []
    };
}

// Prompt AI aktif ada di Supabase Edge Function `ai-konsultasi`.
// Pedoman klaim BPOM untuk prompt tersebut: docs/pedoman-klaim-bpom.md

// ── Testimonials Retrieval ──────────────────────────────────────
export async function searchTestimonials(query: string, limit: number = 3): Promise<any[]> {
    try {
        console.info('[AI] 🔍 Searching relevant testimonials for:', query);
        
        // Sederhanakan query untuk pencarian (ambil kata kunci penting)
        const keywords = query.toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .split(' ')
            .filter(w => w.length > 3);

        if (keywords.length === 0) return [];

        // Pencarian menggunakan text search di content atau tags
        let queryBuilder = supabase
            .from('telegram_messages' as any)
            .select('*')
            .eq('is_testimoni', true)
            .eq('status', 'approved');

        // Jika ada banyak kata kunci, buat pencarian yang lebih luas
        if (keywords.length > 0) {
            const orConditions = keywords.map(k => `content.ilike.%${k}%,tags.cs.{${k}}`).join(',');
            queryBuilder = queryBuilder.or(orConditions);
        }

        const { data, error } = await queryBuilder
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('[AI] ❌ Testimonial search error:', err);
        return [];
    }
}

// ── Fungsi utama ──────────────────────────────────────────────────
export async function generateAIAdvice(selectedComplaints: string[], complaintText: string): Promise<RAGResult> {
    const userInput = (complaintText || selectedComplaints.join(', ')).trim();

    if (!userInput) {
        return getDynamicFallback('');
    }

    // 1. Cache check
    const cacheKey = buildCacheKey(userInput);
    const cached = readCache(cacheKey);
    if (cached) {
        console.info('[AI] ✅ Cache hit');
        try { 
            const parsed = JSON.parse(cached);
            // Tetap cari testimoni terbaru meski cache hit untuk teks utamanya
            const testimonials = await searchTestimonials(userInput);
            return { ...parsed, testimonials }; 
        }
        catch { localStorage.removeItem(cacheKey); }
    }

    // 2. Call via Supabase Edge Function (CORS-safe proxy)
    try {
        console.info('[AI] 🔄 Calling ai-konsultasi edge function...');

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

        const response = await fetch(
            `${supabaseUrl}/functions/v1/ai-konsultasi`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseKey}`,
                    'apikey': supabaseKey,
                },
                body: JSON.stringify({ userInput })
            }
        );

        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`Edge function error ${response.status}: ${errBody}`);
        }

        const parsed = await response.json();

        if (parsed.error) {
            throw new Error(parsed.error);
        }

        // Cari testimoni relevan dari database
        const testimonials = await searchTestimonials(userInput);

        // Cache result (hanya teks AI-nya)
        writeCache(cacheKey, JSON.stringify(parsed));
        console.info('[AI] ✅ Berhasil via edge function');

        return { ...parsed, testimonials };

    } catch (err) {
        console.error('[AI] ❌ Error:', err);
        const fallback = getDynamicFallback(userInput);
        const testimonials = await searchTestimonials(userInput);
        return { ...fallback, testimonials };
    }
}
