export const KELUHAN_TAG_MAP: Record<string, string[]> = {
    "Susah Tidur": ["susah_tidur", "insomnia"],
    "Badan Pegal": ["nyeri_sendi", "asam_urat", "rematik"],
    "Daya Tahan Tubuh": ["imun", "daya_tahan", "pemulihan"],
    "Mata Lelah": ["mata"],
    "Kurangi Gula": ["gula_darah", "diabetes"],
    "Nutrisi Anak": ["nafsu_makan", "anak"],
    "Rambut Rontok": ["rambut"],
    "Kulit Kusam": ["kulit", "flek"],
    "Sering Flu": ["flu"],           // hanya 'flu', bukan 'imun' — cegah cross-match BP umum
    "Kurang Fokus": ["fokus", "konsentrasi"],
    "Flek Hitam": ["flek", "kulit"],
    "Kurang Stamina": ["stamina", "energi"],
    "Hormon Wanita": ["haid", "hormon", "wanita"],
    "Haid Tidak Teratur": ["haid", "hormon", "wanita"],
    "Bisnis": ["bisnis", "peluang"],
    "Peluang": ["bisnis", "peluang"],
};
