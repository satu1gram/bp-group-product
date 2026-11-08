// Halaman admin untuk Mbak Tila: tulis artikel "Catatan Tila" & kelola promo.
// Login dengan akun Supabase Auth yang terdaftar di tabel public.admins.
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { Link } from "react-router";
import "@/styles/katalog.css";
import "@/styles/ai-advisor.css";
import "@/styles/pages.css";
import { supabase } from "@/integrations/supabase/client";
import { Seo } from "@/lib/seo";
import { checkClaims } from "@/lib/bpomChecker";
import { renderMarkdown } from "@/lib/markdown";
import {
    ARTICLE_COLUMNS,
    PROMO_COLUMNS,
    type Article,
    type ArticleAudience,
    type Promo,
    isPromoRunning,
    readingMinutes,
    slugify,
} from "@/lib/content";
import { formatTanggal } from "@/lib/site";
import { LEAD_COLUMNS, LEAD_STATUS_LABEL, type Lead, type LeadStatus } from "@/lib/leads";

// Tabel baru belum ada di tipe Supabase hasil generate → akses tanpa tipe ketat
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

type Msg = { type: "ok" | "err"; text: string } | null;

function MsgBox({ msg }: { msg: Msg }) {
    if (!msg) return null;
    return <div className={`adm-msg adm-msg-${msg.type}`} role="status">{msg.text}</div>;
}

async function uploadImage(file: File, folder: "artikel" | "promo"): Promise<string> {
    if (file.size > 3 * 1024 * 1024) throw new Error("Ukuran gambar maksimal 3 MB.");
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${folder}/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, "")) || "gambar"}.${ext}`;
    const { error } = await db.storage.from("konten").upload(path, file, { cacheControl: "31536000", upsert: false });
    if (error) throw error;
    return db.storage.from("konten").getPublicUrl(path).data.publicUrl as string;
}

function ImageField({ label, value, onChange, folder }: {
    label: string; value: string | null; onChange: (url: string | null) => void; folder: "artikel" | "promo";
}) {
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");
    return (
        <div className="adm-field">
            <label>{label}</label>
            <input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy}
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setBusy(true); setErr("");
                    try { onChange(await uploadImage(file, folder)); }
                    catch (ex) { setErr(ex instanceof Error ? ex.message : "Gagal mengunggah gambar."); }
                    finally { setBusy(false); e.target.value = ""; }
                }} />
            <small>JPG/PNG/WebP, maks 3 MB. Ukuran ideal 1200×675 px.</small>
            {busy && <small>Mengunggah…</small>}
            {err && <small style={{ color: "var(--red)" }}>{err}</small>}
            {value && (
                <div>
                    <img src={value} alt="" className="adm-thumb" />
                    <div><button type="button" className="adm-danger" onClick={() => onChange(null)}>Hapus gambar</button></div>
                </div>
            )}
        </div>
    );
}

// ───────────────────────── Artikel ─────────────────────────

const EMPTY_ARTICLE: Omit<Article, "id" | "updated_at"> = {
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    cover_url: null,
    audience: "konsumen",
    status: "draft",
    keyword: "",
    published_at: null,
};

type ArticleDraft = typeof EMPTY_ARTICLE & { id?: string };

function insertAround(el: HTMLTextAreaElement, before: string, after = "", placeholder = "teks"): string {
    const { selectionStart: s, selectionEnd: e, value } = el;
    const selected = value.slice(s, e) || placeholder;
    return value.slice(0, s) + before + selected + after + value.slice(e);
}

function ArticleEditor({ initial, onDone }: { initial: ArticleDraft; onDone: (changed: boolean) => void }) {
    const [a, setA] = useState<ArticleDraft>(initial);
    const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
    const [preview, setPreview] = useState(false);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<Msg>(null);
    const taRef = useRef<HTMLTextAreaElement>(null);

    const set = <K extends keyof ArticleDraft>(k: K, v: ArticleDraft[K]) => setA((x) => ({ ...x, [k]: v }));
    const findings = useMemo(() => checkClaims(`${a.title}\n${a.excerpt ?? ""}\n${a.content}`), [a.title, a.excerpt, a.content]);
    const words = a.content.trim().split(/\s+/).filter(Boolean).length;

    const tool = (before: string, after = "", placeholder?: string) => {
        const el = taRef.current;
        if (!el) return;
        set("content", insertAround(el, before, after, placeholder));
        requestAnimationFrame(() => el.focus());
    };

    const save = async (publish: boolean) => {
        setMsg(null);
        if (!a.title.trim()) return setMsg({ type: "err", text: "Judul wajib diisi." });
        const slug = slugify(a.slug || a.title);
        if (!slug) return setMsg({ type: "err", text: "Alamat (slug) tidak valid." });
        if (publish && words < 150) return setMsg({ type: "err", text: "Isi artikel terlalu pendek untuk diterbitkan (minimal 150 kata)." });
        if (publish && findings.length > 0 && !window.confirm(`Masih ada ${findings.length} jenis kata yang berisiko menurut pedoman BPOM. Tetap terbitkan?`)) return;

        setSaving(true);
        const row = {
            slug,
            title: a.title.trim(),
            excerpt: a.excerpt?.trim() || null,
            content: a.content,
            cover_url: a.cover_url,
            audience: a.audience,
            keyword: a.keyword?.trim() || null,
            status: publish ? "published" : "draft",
            published_at: publish ? (a.published_at ?? new Date().toISOString()) : a.published_at,
        };
        const query = a.id ? db.from("articles").update(row).eq("id", a.id) : db.from("articles").insert(row);
        const { data, error } = await query.select(ARTICLE_COLUMNS).single();
        setSaving(false);
        if (error) {
            const dupe = String(error.message).includes("duplicate") || error.code === "23505";
            return setMsg({ type: "err", text: dupe ? "Alamat (slug) sudah dipakai artikel lain. Ganti sedikit judul/slug-nya." : `Gagal menyimpan: ${error.message}` });
        }
        setA({ ...(data as Article) });
        setSlugTouched(true);
        setMsg({
            type: "ok",
            text: publish
                ? "Artikel terbit! Sudah bisa dibuka di website. Versi untuk Google ikut diperbarui otomatis dalam beberapa menit."
                : "Draf tersimpan. Belum tampil di website.",
        });
    };

    const remove = async () => {
        if (!a.id || !window.confirm("Hapus artikel ini permanen?")) return;
        const { error } = await db.from("articles").delete().eq("id", a.id);
        if (error) return setMsg({ type: "err", text: `Gagal menghapus: ${error.message}` });
        onDone(true);
    };

    return (
        <div className="adm-card">
            <div className="adm-head">
                <h2 style={{ fontSize: "1.3rem" }}>{a.id ? "Edit artikel" : "Artikel baru"}</h2>
                <button type="button" className="site-btn-outline" onClick={() => onDone(true)}>← Kembali ke daftar</button>
            </div>
            <MsgBox msg={msg} />

            <div className="adm-field">
                <label htmlFor="a-title">Judul</label>
                <input id="a-title" value={a.title} maxLength={120}
                    placeholder="mis. Cara Cek British Propolis Asli dan Nomor BPOM-nya"
                    onChange={(e) => { set("title", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} />
                <small>Masukkan kata kunci yang dicari orang di judul. {a.title.length}/120</small>
            </div>

            <div className="adm-row">
                <div className="adm-field">
                    <label htmlFor="a-slug">Alamat halaman</label>
                    <input id="a-slug" value={a.slug} onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} />
                    <small>katalog.mitrabp.biz.id/artikel/{a.slug || "…"}</small>
                </div>
                <div className="adm-field">
                    <label htmlFor="a-aud">Untuk pembaca</label>
                    <select id="a-aud" value={a.audience} onChange={(e) => set("audience", e.target.value as ArticleAudience)}>
                        <option value="konsumen">Konsumen (Hidup Sehat)</option>
                        <option value="mitra">Calon mitra (Bisnis dari Rumah)</option>
                    </select>
                    <small>Menentukan ajakan di akhir artikel.</small>
                </div>
            </div>

            <div className="adm-row">
                <div className="adm-field">
                    <label htmlFor="a-kw">Kata kunci utama (opsional)</label>
                    <input id="a-kw" value={a.keyword ?? ""} placeholder="mis. propolis untuk anak" onChange={(e) => set("keyword", e.target.value)} />
                    {a.keyword && !a.title.toLowerCase().includes(a.keyword.toLowerCase()) && (
                        <small style={{ color: "#8a6315" }}>Tips: kata kunci belum ada di judul.</small>
                    )}
                </div>
                <div className="adm-field">
                    <label htmlFor="a-ex">Ringkasan (1–2 kalimat)</label>
                    <textarea id="a-ex" rows={2} maxLength={200} value={a.excerpt ?? ""} onChange={(e) => set("excerpt", e.target.value)}
                        placeholder="Tampil di kartu artikel & hasil Google." />
                    <small>{(a.excerpt ?? "").length}/200</small>
                </div>
            </div>

            <ImageField label="Gambar sampul (opsional)" value={a.cover_url} folder="artikel" onChange={(v) => set("cover_url", v)} />

            <div className="adm-field">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <label htmlFor="a-content">Isi artikel</label>
                    <div className="adm-editor-tabs">
                        <button type="button" className={`cfc-chip ${!preview ? "active" : ""}`} onClick={() => setPreview(false)}>Tulis</button>
                        <button type="button" className={`cfc-chip ${preview ? "active" : ""}`} onClick={() => setPreview(true)}>Pratinjau</button>
                    </div>
                </div>
                {preview ? (
                    <div className="adm-preview article-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(a.content) }} />
                ) : (
                    <>
                        <div className="adm-toolbar" aria-label="Format teks">
                            <button type="button" onClick={() => tool("\n## ", "\n", "Subjudul")}>Subjudul</button>
                            <button type="button" onClick={() => tool("**", "**")}>Tebal</button>
                            <button type="button" onClick={() => tool("*", "*")}>Miring</button>
                            <button type="button" onClick={() => tool("\n- ", "", "poin")}>• Daftar</button>
                            <button type="button" onClick={() => tool("\n> ", "\n", "kutipan")}>Kutipan</button>
                            <button type="button" onClick={() => tool("[", "](https://)", "teks link")}>Link</button>
                        </div>
                        <textarea id="a-content" ref={taRef} rows={18} value={a.content} onChange={(e) => set("content", e.target.value)}
                            placeholder={"Mulai dengan cerita pengalamanmu…\n\n## Subjudul\nIsi paragraf.\n\n- poin satu\n- poin dua"} />
                    </>
                )}
                <small>{words} kata · ±{readingMinutes({ content: a.content })} menit baca · ideal 800–1.200 kata.</small>
            </div>

            {findings.length > 0 ? (
                <div className="adm-warn">
                    <strong>⚠️ Cek pedoman BPOM ({findings.length})</strong>
                    <ul>
                        {findings.map((f) => (
                            <li key={f.label}><strong>{f.label}:</strong> “{f.matches.join("”, “")}”. {f.saran}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                a.content.length > 50 && <p className="adm-ok-note">✓ Tidak ditemukan kata berisiko menurut pedoman BPOM.</p>
            )}

            <div className="adm-actions">
                {a.id && <button type="button" className="adm-danger" onClick={remove}>Hapus</button>}
                {a.id && a.status === "published" && (
                    <a className="site-btn-outline" href={`/artikel/${a.slug}`} target="_blank" rel="noopener noreferrer">Lihat di website</a>
                )}
                <button type="button" className="site-btn-outline" disabled={saving} onClick={() => save(false)}>
                    {a.status === "published" ? "Jadikan draf" : "Simpan draf"}
                </button>
                <button type="button" className="site-btn-primary" disabled={saving} onClick={() => save(true)}>
                    {saving ? "Menyimpan…" : a.status === "published" ? "Simpan perubahan" : "Terbitkan"}
                </button>
            </div>
        </div>
    );
}

function ArticlesTab() {
    const [list, setList] = useState<Article[] | null>(null);
    const [editing, setEditing] = useState<ArticleDraft | null>(null);
    const [msg, setMsg] = useState<Msg>(null);

    const load = useCallback(async () => {
        const { data, error } = await db.from("articles").select(ARTICLE_COLUMNS).order("updated_at", { ascending: false });
        if (error) setMsg({ type: "err", text: `Gagal memuat artikel: ${error.message}` });
        setList((data ?? []) as Article[]);
    }, []);

    useEffect(() => { load(); }, [load]);

    if (editing) {
        return <ArticleEditor initial={editing} onDone={(changed) => { setEditing(null); if (changed) load(); }} />;
    }

    return (
        <div>
            <div className="adm-head">
                <p style={{ color: "var(--text-muted)" }}>Target: 1 artikel per minggu. Kalender topik ada di panduan.</p>
                <button type="button" className="site-btn-primary" onClick={() => setEditing({ ...EMPTY_ARTICLE })}>+ Tulis artikel</button>
            </div>
            <MsgBox msg={msg} />
            {list === null ? <p>Memuat…</p> : list.length === 0 ? (
                <div className="adm-card">Belum ada artikel. Klik “Tulis artikel” untuk mulai.</div>
            ) : (
                <div className="adm-list">
                    {list.map((a) => (
                        <div key={a.id} className="adm-item">
                            <div>
                                <div className="adm-item-title">
                                    {a.title}
                                    <span className={`adm-badge ${a.status === "published" ? "adm-badge-live" : "adm-badge-draft"}`}>
                                        {a.status === "published" ? "Terbit" : "Draf"}
                                    </span>
                                </div>
                                <div className="adm-item-meta">
                                    {a.audience === "mitra" ? "Calon mitra" : "Konsumen"}
                                    {a.published_at && ` · terbit ${formatTanggal(a.published_at)}`}
                                    {a.updated_at && ` · diubah ${formatTanggal(a.updated_at)}`}
                                </div>
                            </div>
                            <button type="button" className="site-btn-outline" onClick={() => setEditing({ ...a })}>Edit</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ───────────────────────── Promo ─────────────────────────

const EMPTY_PROMO: Omit<Promo, "id"> & { id?: string } = {
    title: "",
    description: "",
    terms: "",
    image_url: null,
    starts_at: null,
    ends_at: null,
    wa_message: "",
    is_active: true,
    sort_order: 0,
};

type PromoDraft = typeof EMPTY_PROMO;

function PromoEditor({ initial, onDone }: { initial: PromoDraft; onDone: (changed: boolean) => void }) {
    const [p, setP] = useState<PromoDraft>(initial);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<Msg>(null);
    const set = <K extends keyof PromoDraft>(k: K, v: PromoDraft[K]) => setP((x) => ({ ...x, [k]: v }));
    const findings = useMemo(() => checkClaims(`${p.title}\n${p.description ?? ""}\n${p.terms ?? ""}`), [p.title, p.description, p.terms]);

    const save = async (e: FormEvent) => {
        e.preventDefault();
        setMsg(null);
        if (!p.title.trim()) return setMsg({ type: "err", text: "Nama promo wajib diisi." });
        if (p.starts_at && p.ends_at && p.ends_at < p.starts_at) return setMsg({ type: "err", text: "Tanggal berakhir tidak boleh sebelum tanggal mulai." });
        setSaving(true);
        const row = {
            title: p.title.trim(),
            description: p.description?.trim() || null,
            terms: p.terms?.trim() || null,
            image_url: p.image_url,
            starts_at: p.starts_at || null,
            ends_at: p.ends_at || null,
            wa_message: p.wa_message?.trim() || null,
            is_active: p.is_active,
            sort_order: Number(p.sort_order) || 0,
        };
        const query = p.id ? db.from("promos").update(row).eq("id", p.id) : db.from("promos").insert(row);
        const { data, error } = await query.select(PROMO_COLUMNS).single();
        setSaving(false);
        if (error) return setMsg({ type: "err", text: `Gagal menyimpan: ${error.message}` });
        setP(data as Promo);
        setMsg({ type: "ok", text: "Promo tersimpan." });
    };

    const remove = async () => {
        if (!p.id || !window.confirm("Hapus promo ini?")) return;
        const { error } = await db.from("promos").delete().eq("id", p.id);
        if (error) return setMsg({ type: "err", text: `Gagal menghapus: ${error.message}` });
        onDone(true);
    };

    return (
        <form className="adm-card" onSubmit={save}>
            <div className="adm-head">
                <h2 style={{ fontSize: "1.3rem" }}>{p.id ? "Edit promo" : "Promo baru"}</h2>
                <button type="button" className="site-btn-outline" onClick={() => onDone(true)}>← Kembali ke daftar</button>
            </div>
            <MsgBox msg={msg} />
            <p className="adm-ok-note" style={{ color: "var(--text-muted)" }}>
                Salin materi promo resmi dari pusat apa adanya. Jangan menambah hadiah atau klaim sendiri.
            </p>

            <div className="adm-field">
                <label htmlFor="p-title">Nama promo</label>
                <input id="p-title" value={p.title} maxLength={100} onChange={(e) => set("title", e.target.value)} placeholder="mis. Program November: Beli 5 Gratis Ongkir" />
            </div>
            <div className="adm-field">
                <label htmlFor="p-desc">Isi program</label>
                <textarea id="p-desc" rows={4} value={p.description ?? ""} onChange={(e) => set("description", e.target.value)} />
            </div>
            <div className="adm-field">
                <label htmlFor="p-terms">Syarat & ketentuan (opsional)</label>
                <textarea id="p-terms" rows={3} value={p.terms ?? ""} onChange={(e) => set("terms", e.target.value)} />
            </div>
            <div className="adm-row">
                <div className="adm-field">
                    <label htmlFor="p-start">Mulai</label>
                    <input id="p-start" type="date" value={p.starts_at ?? ""} onChange={(e) => set("starts_at", e.target.value || null)} />
                </div>
                <div className="adm-field">
                    <label htmlFor="p-end">Berakhir</label>
                    <input id="p-end" type="date" value={p.ends_at ?? ""} onChange={(e) => set("ends_at", e.target.value || null)} />
                    <small>Promo otomatis hilang dari website setelah tanggal ini.</small>
                </div>
            </div>
            <div className="adm-field">
                <label htmlFor="p-wa">Pesan WhatsApp otomatis (opsional)</label>
                <input id="p-wa" value={p.wa_message ?? ""} onChange={(e) => set("wa_message", e.target.value)}
                    placeholder={`Halo Mbak Tila, saya mau ambil promo "${p.title || "…"}". Masih tersedia?`} />
            </div>
            <ImageField label="Gambar/flyer promo (opsional)" value={p.image_url} folder="promo" onChange={(v) => set("image_url", v)} />
            <div className="adm-row">
                <div className="adm-field">
                    <label htmlFor="p-order">Urutan tampil</label>
                    <input id="p-order" type="number" value={p.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} />
                    <small>Angka kecil tampil lebih dulu.</small>
                </div>
                <div className="adm-field">
                    <label htmlFor="p-active">Status</label>
                    <select id="p-active" value={p.is_active ? "1" : "0"} onChange={(e) => set("is_active", e.target.value === "1")}>
                        <option value="1">Aktif</option>
                        <option value="0">Disembunyikan</option>
                    </select>
                </div>
            </div>

            {findings.length > 0 && (
                <div className="adm-warn">
                    <strong>⚠️ Cek pedoman BPOM</strong>
                    <ul>{findings.map((f) => <li key={f.label}><strong>{f.label}:</strong> “{f.matches.join("”, “")}”. {f.saran}</li>)}</ul>
                </div>
            )}

            <div className="adm-actions">
                {p.id && <button type="button" className="adm-danger" onClick={remove}>Hapus</button>}
                <button type="submit" className="site-btn-primary" disabled={saving}>{saving ? "Menyimpan…" : "Simpan promo"}</button>
            </div>
        </form>
    );
}

function PromosTab() {
    const [list, setList] = useState<Promo[] | null>(null);
    const [editing, setEditing] = useState<PromoDraft | null>(null);
    const [msg, setMsg] = useState<Msg>(null);

    const load = useCallback(async () => {
        const { data, error } = await db.from("promos").select(PROMO_COLUMNS).order("created_at", { ascending: false });
        if (error) setMsg({ type: "err", text: `Gagal memuat promo: ${error.message}` });
        setList((data ?? []) as Promo[]);
    }, []);

    useEffect(() => { load(); }, [load]);

    if (editing) return <PromoEditor initial={editing} onDone={(changed) => { setEditing(null); if (changed) load(); }} />;

    return (
        <div>
            <div className="adm-head">
                <p style={{ color: "var(--text-muted)" }}>Promo yang aktif & dalam periode tampil di /promo dan pita beranda.</p>
                <button type="button" className="site-btn-primary" onClick={() => setEditing({ ...EMPTY_PROMO })}>+ Promo baru</button>
            </div>
            <MsgBox msg={msg} />
            {list === null ? <p>Memuat…</p> : list.length === 0 ? (
                <div className="adm-card">Belum ada promo.</div>
            ) : (
                <div className="adm-list">
                    {list.map((p) => {
                        const live = isPromoRunning(p);
                        return (
                            <div key={p.id} className="adm-item">
                                <div>
                                    <div className="adm-item-title">
                                        {p.title}
                                        <span className={`adm-badge ${live ? "adm-badge-live" : "adm-badge-draft"}`}>{live ? "Tayang" : "Tidak tayang"}</span>
                                    </div>
                                    <div className="adm-item-meta">
                                        {p.starts_at ? formatTanggal(p.starts_at) : "…"} – {p.ends_at ? formatTanggal(p.ends_at) : "tanpa batas"}
                                    </div>
                                </div>
                                <button type="button" className="site-btn-outline" onClick={() => setEditing({ ...p })}>Edit</button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// ───────────────────────── Kontak masuk ─────────────────────────

function waFollowUp(lead: Lead): string {
    const text = `Halo Kak ${lead.name}, saya Tila 😊 Terima kasih sudah membuka panduan mulai bisnis dari rumah di katalog. Boleh saya tahu, saat ini Kakak paling tertarik di bagian mana?`;
    return `https://wa.me/${lead.whatsapp}?text=${encodeURIComponent(text)}`;
}

function csvCell(v: string | null): string {
    const t = (v ?? "").replace(/"/g, '""');
    return /[",\n;]/.test(t) ? `"${t}"` : t;
}

function LeadsTab() {
    const [list, setList] = useState<Lead[] | null>(null);
    const [filter, setFilter] = useState<LeadStatus | "semua">("semua");
    const [msg, setMsg] = useState<Msg>(null);

    const load = useCallback(async () => {
        const { data, error } = await db.from("leads").select(LEAD_COLUMNS).order("created_at", { ascending: false }).limit(500);
        if (error) setMsg({ type: "err", text: `Gagal memuat kontak: ${error.message}` });
        setList((data ?? []) as Lead[]);
    }, []);

    useEffect(() => { load(); }, [load]);

    const setStatus = async (lead: Lead, status: LeadStatus) => {
        setList((l) => l?.map((x) => (x.id === lead.id ? { ...x, status } : x)) ?? null);
        const { error } = await db.from("leads").update({ status }).eq("id", lead.id);
        if (error) { setMsg({ type: "err", text: `Gagal mengubah status: ${error.message}` }); load(); }
    };

    const exportCsv = () => {
        if (!list?.length) return;
        const header = "Tanggal,Nama,WhatsApp,Kota,Status,Sumber";
        const rows = list.map((l) => [formatTanggal(l.created_at), l.name, `+${l.whatsapp}`, l.city, LEAD_STATUS_LABEL[l.status], l.source].map(csvCell).join(","));
        const blob = new Blob([`\ufeff${header}\n${rows.join("\n")}`], { type: "text/csv;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `kontak-katalog-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    const shown = list?.filter((l) => filter === "semua" || l.status === filter) ?? [];
    const count = (st: LeadStatus) => list?.filter((l) => l.status === st).length ?? 0;

    return (
        <div>
            <div className="adm-head">
                <p style={{ color: "var(--text-muted)" }}>Orang yang membuka panduan bisnis gratis. Hubungi dalam 1×24 jam selagi masih hangat.</p>
                <button type="button" className="site-btn-outline" onClick={exportCsv} disabled={!list?.length}>Unduh CSV</button>
            </div>
            <MsgBox msg={msg} />
            <div className="adm-tabs" style={{ flexWrap: "wrap" }}>
                <button type="button" className={`cfc-chip ${filter === "semua" ? "active" : ""}`} onClick={() => setFilter("semua")}>Semua ({list?.length ?? 0})</button>
                {(Object.keys(LEAD_STATUS_LABEL) as LeadStatus[]).map((st) => (
                    <button key={st} type="button" className={`cfc-chip ${filter === st ? "active" : ""}`} onClick={() => setFilter(st)}>
                        {LEAD_STATUS_LABEL[st]} ({count(st)})
                    </button>
                ))}
            </div>
            {list === null ? <p>Memuat…</p> : shown.length === 0 ? (
                <div className="adm-card">Belum ada kontak{filter !== "semua" ? " dengan status ini" : ""}.</div>
            ) : (
                <div className="adm-list">
                    {shown.map((l) => (
                        <div key={l.id} className="adm-item adm-lead">
                            <div>
                                <div className="adm-item-title">
                                    {l.name}
                                    {l.status === "baru" && <span className="adm-badge adm-badge-live">Baru</span>}
                                </div>
                                <div className="adm-item-meta">
                                    +{l.whatsapp}{l.city && ` · ${l.city}`} · {formatTanggal(l.created_at)}{l.source && ` · dari ${l.source}`}
                                </div>
                            </div>
                            <div className="adm-lead-actions">
                                <select aria-label={`Status ${l.name}`} value={l.status} onChange={(e) => setStatus(l, e.target.value as LeadStatus)}>
                                    {(Object.keys(LEAD_STATUS_LABEL) as LeadStatus[]).map((st) => <option key={st} value={st}>{LEAD_STATUS_LABEL[st]}</option>)}
                                </select>
                                <a className="site-btn-wa" href={waFollowUp(l)} target="_blank" rel="noopener noreferrer"
                                    onClick={() => { if (l.status === "baru") setStatus(l, "dihubungi"); }}>
                                    Chat
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ───────────────────────── Login & kerangka ─────────────────────────

function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [msg, setMsg] = useState<Msg>(null);

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setBusy(true); setMsg(null);
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        setBusy(false);
        if (error) setMsg({ type: "err", text: "Email atau kata sandi salah." });
    };

    return (
        <form className="adm-card adm-login" onSubmit={submit}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: "1.8rem", marginBottom: 6 }}>Masuk Admin</h1>
            <p style={{ color: "var(--text-muted)", marginBottom: 16, fontSize: 14 }}>Khusus Mbak Tila untuk mengelola artikel & promo.</p>
            <MsgBox msg={msg} />
            <div className="adm-field">
                <label htmlFor="l-email">Email</label>
                <input id="l-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="adm-field">
                <label htmlFor="l-pass">Kata sandi</label>
                <input id="l-pass" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="site-btn-primary" style={{ width: "100%" }} disabled={busy}>{busy ? "Masuk…" : "Masuk"}</button>
        </form>
    );
}

export default function AdminPage() {
    const [session, setSession] = useState<Session | null>(null);
    const [ready, setReady] = useState(false);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [tab, setTab] = useState<"artikel" | "promo" | "kontak">("artikel");

    useEffect(() => {
        if (!supabase) { setReady(true); return; }
        supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
        const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
        return () => sub.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (!session) { setIsAdmin(null); return; }
        db.from("admins").select("user_id").eq("user_id", session.user.id).maybeSingle()
            .then(({ data }: { data: unknown }) => setIsAdmin(Boolean(data)));
    }, [session]);

    let body;
    if (!ready) body = <p>Memuat…</p>;
    else if (!supabase) body = <div className="adm-card">Supabase belum dikonfigurasi (VITE_SUPABASE_URL / KEY).</div>;
    else if (!session) body = <LoginForm />;
    else if (isAdmin === null) body = <p>Memeriksa akses…</p>;
    else if (!isAdmin) {
        body = (
            <div className="adm-card adm-login">
                <p style={{ marginBottom: 12 }}>Akun <strong>{session.user.email}</strong> belum terdaftar sebagai admin.</p>
                <button type="button" className="site-btn-outline" onClick={() => supabase.auth.signOut()}>Keluar</button>
            </div>
        );
    } else {
        body = (
            <>
                <div className="adm-head">
                    <h1>Halo, Mbak Tila 👋</h1>
                    <div className="site-btn-row">
                        <Link to="/" className="site-btn-outline">Lihat website</Link>
                        <button type="button" className="site-btn-outline" onClick={() => supabase.auth.signOut()}>Keluar</button>
                    </div>
                </div>
                <div className="adm-tabs" role="tablist">
                    <button type="button" role="tab" aria-selected={tab === "artikel"} className={`cfc-chip ${tab === "artikel" ? "active" : ""}`} onClick={() => setTab("artikel")}>Catatan Tila</button>
                    <button type="button" role="tab" aria-selected={tab === "promo"} className={`cfc-chip ${tab === "promo" ? "active" : ""}`} onClick={() => setTab("promo")}>Promo</button>
                    <button type="button" role="tab" aria-selected={tab === "kontak"} className={`cfc-chip ${tab === "kontak" ? "active" : ""}`} onClick={() => setTab("kontak")}>Kontak Masuk</button>
                </div>
                {tab === "artikel" ? <ArticlesTab /> : tab === "promo" ? <PromosTab /> : <LeadsTab />}
            </>
        );
    }

    return (
        <div className="katalog-page-wrapper" style={{ minHeight: "100vh", background: "var(--cream)" }}>
            <Seo title="Admin | Katalog British Propolis" description="Halaman admin." path="/admin" noindex />
            <div className="adm-wrap">{body}</div>
        </div>
    );
}
