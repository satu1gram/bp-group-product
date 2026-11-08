// Pengecek kata/kalimat berisiko menurut pedoman klaim BPOM (docs/pedoman-klaim-bpom.md).
// Dipakai di halaman admin agar Tila langsung tahu sebelum menerbitkan.

export interface ClaimRule {
    pattern: RegExp;
    label: string;
    saran: string;
}

export const CLAIM_RULES: ClaimRule[] = [
    { pattern: /\bmenyembuhkan\b|\bsembuh(?:\s+total)?\b|\bkesembuhan\b/gi, label: "klaim menyembuhkan", saran: "Ganti dengan \"membantu meredakan\" / \"membantu memelihara\", atau ceritakan pengalaman tanpa kata sembuh." },
    { pattern: /\bmengobati\b|\bobat\s+(?:untuk|bagi)\b/gi, label: "klaim mengobati", saran: "Produk tidak boleh diposisikan sebagai obat penyakit." },
    { pattern: /\bmencegah\s+(?:penyakit|kanker|diabetes|stroke|covid|virus)\b/gi, label: "klaim mencegah penyakit", saran: "Gunakan \"membantu memelihara daya tahan tubuh\"." },
    { pattern: /\btanpa\s+efek\s+samping\b|\b100\s*%\s*aman\b|\bpasti\s+aman\b|\baman\s+dikonsumsi\s+(?:semua|siapa)/gi, label: "klaim keamanan", saran: "Hapus klaim \"aman / tanpa efek samping\"." },
    { pattern: /\bampuh\b|\bmanjur\b|\bmujarab\b|\bdijamin\b|\bterbukti\s+(?:efektif|ampuh|menyembuhkan)\b/gi, label: "klaim berlebihan", saran: "Pakai bahasa netral, mis. \"banyak dipilih keluarga\"." },
    { pattern: /\bterbaik\b|\bnomor\s*1\b|\bno\.?\s*1\b|\bpaling\s+(?:bagus|ampuh|efektif)\b/gi, label: "superlatif", saran: "Hindari klaim superlatif tanpa dasar resmi." },
    { pattern: /\b(?:diabetes|kencing\s+manis|asam\s+urat|kolesterol|hipertensi|darah\s+tinggi|kanker|tumor|kista|stroke|jantung\s+koroner|maag|asma|ginjal|hepatitis|tbc|covid)\b/gi, label: "nama penyakit", saran: "Boleh dibahas sebagai edukasi umum, tapi jangan dikaitkan sebagai sasaran produk. Sarankan konsultasi dokter." },
    { pattern: /\bdokter\s+(?:merekomendasikan|menyarankan|kaget)\b|\bdirekomendasikan\s+(?:oleh\s+)?dokter\b/gi, label: "rekomendasi tenaga kesehatan", saran: "Iklan tidak boleh memakai rekomendasi dokter/nakes." },
    { pattern: /\bturun\s+(?:dari\s+)?\d{2,3}\s*(?:ke|jadi|menjadi)\s*\d{2,3}\b/gi, label: "testimoni hasil angka", saran: "Hindari angka hasil kesehatan (gula darah, tensi, dll)." },
];

export interface ClaimFinding {
    label: string;
    saran: string;
    matches: string[];
}

export function checkClaims(text: string): ClaimFinding[] {
    const findings: ClaimFinding[] = [];
    for (const rule of CLAIM_RULES) {
        const found = text.match(rule.pattern);
        if (found && found.length) {
            const uniq = Array.from(new Set(found.map((f) => f.toLowerCase())));
            findings.push({ label: rule.label, saran: rule.saran, matches: uniq });
        }
    }
    return findings;
}
