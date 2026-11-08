// Kontak calon mitra/konsumen dari formulir panduan gratis.
import { supabase } from "@/integrations/supabase/client";

export type LeadStatus = "baru" | "dihubungi" | "jadi_mitra" | "tidak_lanjut";

export interface Lead {
    id: string;
    name: string;
    whatsapp: string;
    city: string | null;
    interest: "mitra" | "konsumen";
    source: string | null;
    note: string | null;
    status: LeadStatus;
    created_at: string;
}

export const LEAD_COLUMNS = "id,name,whatsapp,city,interest,source,note,status,created_at";

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
    baru: "Baru",
    dihubungi: "Sudah dihubungi",
    jadi_mitra: "Jadi mitra",
    tidak_lanjut: "Tidak lanjut",
};

/** "0812-3456 7890" / "+62 812..." / "812..." → "6281234567890"; null bila tidak valid. */
export function normalizeWhatsapp(input: string): string | null {
    let d = input.replace(/\D/g, "");
    if (d.startsWith("0")) d = `62${d.slice(1)}`;
    else if (d.startsWith("8")) d = `62${d}`;
    return /^628\d{7,12}$/.test(d) ? d : null;
}

export async function submitLead(input: {
    name: string;
    whatsapp: string;
    city?: string;
    interest: "mitra" | "konsumen";
    source: string;
}): Promise<void> {
    if (!supabase) throw new Error("Supabase belum dikonfigurasi");
    // Tanpa .select(): pengunjung tidak punya izin membaca tabel leads
    const { error } = await supabase.from("leads").insert({
        name: input.name.trim(),
        whatsapp: input.whatsapp,
        city: input.city?.trim() || null,
        interest: input.interest,
        source: input.source.slice(0, 120),
        consent: true,
    });
    if (error) throw error;
}
