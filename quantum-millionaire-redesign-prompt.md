# Prompt: Redesign Quantum Millionaire — Pearl & Bordeaux Premium

## Context & Objective

Saya sedang me-redesign website **Quantum Millionaire**, sebuah komunitas bisnis yang menjual produk kesehatan British Propolis (suplemen herbal halal) sekaligus menawarkan peluang kemitraan. Versi sekarang menggunakan palette hijau cerah saturasi tinggi (#22C55E-ish) yang membuat brand terlihat seperti e-commerce mass-market biasa, padahal positioning yang dituju adalah **eksklusif, premium, dan profesional** untuk produk dan kemitraan bernilai tinggi.

Target audience: Muslim Indonesia, profesional & ibu-ibu usia 28–55, yang mencari produk kesehatan berkualitas dan/atau peluang bisnis serius.

Goal: redesign keseluruhan visual layer (palette, typography, spacing, components) tanpa mengubah struktur konten yang sudah ada. Aesthetic yang dituju: **quiet luxury** — pearl background dengan bordeaux sebagai signature accent, kesan private banking yang tetap warm dan boutique.

---

## 1. Design System

### Color Palette: "Pearl & Bordeaux" (Light Premium Editorial)

Gunakan CSS variable berikut sebagai single source of truth. Implementasikan di `globals.css` atau equivalent:

```css
:root {
  /* Backgrounds (60% usage) */
  --color-bg-primary: #FAFAF7;      /* Pearl - main background, hampir putih murni */
  --color-bg-secondary: #EFE9DD;    /* Stone - section alternation, subtle warmth */
  --color-bg-tertiary: #FFFFFF;     /* Pure white - product cards on stone sections */
  --color-bg-inverse: #1F1A17;      /* Onyx - footer, hero kemitraan */

  /* Text */
  --color-text-primary: #1F1A17;    /* Onyx - all body & headings */
  --color-text-secondary: #5C5048;  /* Warm slate - secondary text */
  --color-text-tertiary: #8A8073;   /* Taupe - captions, meta */
  --color-text-inverse: #FAFAF7;    /* Pearl - text on dark backgrounds */

  /* Brand accent - Bordeaux (signature warna eksklusif) */
  --color-brand: #722F3A;           /* Bordeaux - primary CTA, headlines emphasis */
  --color-brand-hover: #5C2530;     /* Bordeaux dark - hover states */
  --color-brand-soft: #F4E8E9;      /* Bordeaux tint - badge backgrounds */
  --color-brand-border: #E5D0D2;    /* Bordeaux subtle - borders */

  /* Secondary accent - Champagne (premium highlight) */
  --color-accent: #C9A961;          /* Champagne - decorative lines, eyebrow */
  --color-accent-hover: #B0924A;    /* Champagne dark - hover */
  --color-accent-soft: #F2EBD8;     /* Champagne tint - subtle bg */

  /* Semantic (functional only - dipakai sangat sparingly) */
  --color-success: #5C7C4A;         /* Olive muted - halal/natural badges */
  --color-success-soft: #E8EDDF;    /* Olive light */
  --color-warning: #B8853D;         /* Amber muted */
  --color-danger: #8B3A3A;          /* Tetap dalam family bordeaux */

  /* Borders & dividers */
  --color-border-subtle: #EDE8DD;   /* Hampir tak terlihat */
  --color-border-default: #D9D2C4;  /* Visible tapi halus */
  --color-border-strong: #1F1A17;   /* Onyx - emphasis only */

  /* Shadows - very subtle, premium */
  --shadow-sm: 0 1px 2px rgba(31, 26, 23, 0.04);
  --shadow-md: 0 4px 12px rgba(31, 26, 23, 0.06);
  --shadow-lg: 0 12px 32px rgba(31, 26, 23, 0.08);
  --shadow-brand: 0 8px 24px rgba(114, 47, 58, 0.12); /* Untuk CTA bordeaux */
}
```

**Aturan penggunaan warna (60-30-10 rule):**

- **60% Pearl (#FAFAF7)** — background utama, paling banyak terlihat saat scroll
- **30% Onyx + Stone** — Onyx untuk semua teks utama, Stone (#EFE9DD) untuk section alternation
- **10% Bordeaux (#722F3A)** — signature accent, dipakai untuk:
  - CTA primary (background solid bordeaux)
  - Heading emphasis (italic word dalam heading)
  - Featured price tier card border
  - Eyebrow labels yang ingin menonjol
- **Champagne (#C9A961)** — secondary accent, dipakai HANYA untuk:
  - Garis dekoratif horizontal di atas eyebrow
  - Underline pada link penting
  - Border tipis di featured cards
  - Icon outline pada benefit cards

**Hierarchy rule yang penting:** Bordeaux dan Champagne tidak boleh tampil bersamaan dalam satu element. Pilih salah satu sebagai accent dominan per section. Bordeaux untuk section dengan high-conversion intent (CTA, pricing, hero kemitraan). Champagne untuk section editorial/decorative (benefit cards, footer divider, dll).

### Typography

Import dari Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

Typography scale:

```css
:root {
  --font-serif: 'Fraunces', Georgia, serif;
  --font-sans: 'Plus Jakarta Sans', -apple-system, system-ui, sans-serif;

  /* Display - hero & section titles */
  --text-display-xl: clamp(2.5rem, 5vw, 4rem);      /* 40-64px */
  --text-display-lg: clamp(2rem, 4vw, 3rem);        /* 32-48px */
  --text-display-md: clamp(1.75rem, 3vw, 2.25rem);  /* 28-36px */

  /* Body */
  --text-lg: 1.125rem;   /* 18px - lead paragraphs */
  --text-base: 1rem;     /* 16px - body */
  --text-sm: 0.875rem;   /* 14px - secondary */
  --text-xs: 0.75rem;    /* 12px - caption, label */

  /* Line heights */
  --leading-tight: 1.15;   /* Display */
  --leading-snug: 1.35;    /* Subheading */
  --leading-normal: 1.6;   /* Body */
  --leading-relaxed: 1.75; /* Long-form */

  /* Letter spacing */
  --tracking-tight: -0.02em;   /* Display serif */
  --tracking-normal: 0;
  --tracking-wide: 0.05em;
  --tracking-widest: 0.15em;   /* Eyebrow labels */
}
```

**Aturan typography:**

- Heading utama (h1, h2, h3) pakai **Fraunces** dengan font-weight 400 atau 500. JANGAN pakai weight 700+ untuk Fraunces karena akan terlihat heavy.
- Untuk emphasis dalam heading, pakai **Fraunces italic** dengan warna **Bordeaux** — kombinasi italic serif + warna bordeaux memberi kesan editorial premium yang sangat khas.
- Body text pakai **Plus Jakarta Sans** weight 400 dengan line-height 1.6.
- Eyebrow labels pakai Plus Jakarta Sans 12px, weight 500, `letter-spacing: 0.15em`, uppercase. Warna: BORDEAUX untuk section CTA-oriented, CHAMPAGNE untuk section editorial.
- Sentence case untuk semua heading. JANGAN Title Case atau ALL CAPS kecuali untuk eyebrow labels.

### Spacing System (8px base)

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
}
```

**Aturan spacing:** Section padding vertikal minimum 96px (--space-24) di desktop, 64px di mobile. Gap antar elemen di dalam section minimum 32px. Whitespace yang generous adalah signature premium — JANGAN padatkan elemen.

### Border Radius

```css
:root {
  --radius-sm: 4px;     /* Badges, tags */
  --radius-md: 8px;     /* Buttons, inputs */
  --radius-lg: 12px;    /* Cards */
  --radius-xl: 20px;    /* Hero containers, feature cards */
  --radius-full: 9999px;
}
```

---

## 2. Component Specifications

### Buttons

```css
/* Primary - paling penting, signature bordeaux */
.btn-primary {
  background: var(--color-brand);  /* Bordeaux */
  color: var(--color-text-inverse);
  padding: 14px 28px;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 15px;
  letter-spacing: 0.01em;
  border: none;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-primary:hover {
  background: var(--color-brand-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-brand);
}

/* Secondary - ghost button dengan bordeaux border */
.btn-secondary {
  background: transparent;
  color: var(--color-brand);
  border: 1px solid var(--color-brand);
  padding: 13px 27px;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 15px;
  transition: all 200ms ease;
}
.btn-secondary:hover {
  background: var(--color-brand);
  color: var(--color-text-inverse);
}

/* Tertiary - ghost button dengan onyx (untuk CTA non-conversion) */
.btn-ghost {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-text-primary);
  padding: 13px 27px;
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: 15px;
  transition: all 200ms ease;
}
.btn-ghost:hover {
  background: var(--color-text-primary);
  color: var(--color-text-inverse);
}

/* Link with champagne underline */
.btn-link {
  color: var(--color-text-primary);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid var(--color-accent);
  padding-bottom: 2px;
  transition: border-color 200ms ease;
}
.btn-link:hover {
  border-bottom-color: var(--color-brand);
}
```

**Penting:** Tombol primary HANYA pakai bordeaux solid bg untuk CTA paling penting (Daftar Mitra, Konsultasi WA utama, Beli Paket Featured). Untuk CTA sekunder seperti "Pelajari lebih", "Lihat detail", pakai btn-ghost atau btn-secondary. Hindari spamming bordeaux di banyak tombol — ini akan mengurangi power-nya.

### Product Cards

```css
.product-card {
  background: var(--color-bg-tertiary);  /* white */
  border: 0.5px solid var(--color-border-subtle);
  border-radius: var(--radius-lg);
  padding: 0;
  overflow: hidden;
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
.product-card:hover {
  border-color: var(--color-border-default);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.product-card-image {
  aspect-ratio: 4/3;
  object-fit: cover;
  transition: transform 600ms ease;
}
.product-card:hover .product-card-image {
  transform: scale(1.02);
}

.product-card-content {
  padding: 24px;
}

.product-card-eyebrow {
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-brand);  /* Bordeaux */
  font-weight: 500;
  margin-bottom: 8px;
}

.product-card-title {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 400;
  color: var(--color-text-primary);
  line-height: 1.25;
  margin-bottom: 8px;
}

.product-card-description {
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 16px;
}

.product-card-price {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.product-card-price-strike {
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-text-tertiary);
  text-decoration: line-through;
  margin-right: 8px;
}
```

### Badges

Untuk badge sertifikasi (Halal MUI, BPOM, dll) — buat sangat halus:

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.badge-halal {
  background: var(--color-success-soft);
  color: var(--color-success);
  border: 0.5px solid #C8D4B5;
}

.badge-exclusive {
  background: var(--color-brand-soft);     /* Bordeaux tint */
  color: var(--color-brand);
  border: 0.5px solid var(--color-brand-border);
}

.badge-premium {
  background: var(--color-accent-soft);    /* Champagne tint */
  color: #7A6230;
  border: 0.5px solid #DCC9A4;
}
```

**KURANGI jumlah badge per card.** Maksimum 2 badge per product card.

### Section Pattern

Setiap section harus punya struktur ini:

```html
<section class="section">
  <div class="container">
    <div class="section-header">
      <p class="eyebrow">QUANTUM MILLIONAIRE</p>
      <h2 class="section-title">
        Bukan sekadar konsumen, <em>jadilah mitra eksklusif</em>
      </h2>
      <p class="section-lead">
        Lead paragraph, satu kalimat saja, max 20 kata.
      </p>
    </div>
    <div class="section-content">...</div>
  </div>
</section>
```

```css
.section {
  padding: var(--space-24) 0;
}
.section-alt {
  background: var(--color-bg-secondary);  /* Stone */
}
.section-dark {
  background: var(--color-bg-inverse);    /* Onyx */
  color: var(--color-text-inverse);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.section-header {
  max-width: 720px;
  margin: 0 auto var(--space-16);
  text-align: center;
}

.eyebrow {
  font-size: 12px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-brand);  /* Default bordeaux, override ke champagne where needed */
  font-weight: 500;
  margin-bottom: 16px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

/* Decorative line decorator untuk eyebrow */
.eyebrow::before,
.eyebrow::after {
  content: '';
  width: 24px;
  height: 1px;
  background: currentColor;
  opacity: 0.4;
}

.section-title {
  font-family: var(--font-serif);
  font-size: var(--text-display-lg);
  font-weight: 400;
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  margin-bottom: 16px;
  color: var(--color-text-primary);
}
.section-title em {
  font-style: italic;
  color: var(--color-brand);  /* Italic words in bordeaux - signature look */
}

.section-lead {
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
}
```

---

## 3. Section-by-Section Redesign

### A. Hero Section "Konsultasi Kesehatan"

**Sekarang:** Hijau kotak besar dengan banyak bullet kategori, terasa padat dan generic.

**Redesign:**
- Background pearl (`--color-bg-primary`)
- Layout: full-width container dengan max-width 720px untuk content area
- Eyebrow: "AI HEALTH ADVISOR" dalam **bordeaux** dengan decorative line di kiri-kanan
- Heading utama pakai Fraunces 48px: "Bingung pilih produk? *Ceritakan keluhanmu.*" (bagian italic dalam **bordeaux**)
- Subtitle Plus Jakarta Sans 18px regular, max 2 baris, color text-secondary
- Container interaktif: white background dengan 0.5px border subtle, border-radius 20px, padding 40px, shadow-sm
- Tag kategori (Susah Tidur, Nyeri Sendi, dll) sebagai pill button: bg pearl, border 0.5px champagne, color text-primary, hover bg champagne-soft. JANGAN pakai bg hijau atau border tebal.
- Textarea dengan border subtle, focus state border bordeaux 2px dengan shadow-brand subtle
- CTA primary: "Analisis & rekomendasikan produk" dengan **bg bordeaux solid**, text pearl

### B. Section "Katalog Produk"

**Redesign:**
- Background stone (`--color-bg-secondary`) untuk membedakan dari hero
- Section header centered dengan eyebrow champagne "KATALOG PRODUK" + heading "Semua produk *British Propolis*" (italic *British Propolis* dalam bordeaux)
- Lead paragraph singkat: "Dirumuskan dari British Propolis Yorkshire, premium grade, halal MUI."
- Grid produk: 3 kolom desktop, 2 kolom tablet, 1 kolom mobile, gap 32px
- Filter/kategori bar: redesign sebagai horizontal scroll dengan pill buttons minimalis. Active state: bg onyx, color pearl. Inactive: transparent, border subtle.
- Product card spec sudah didefinisikan di atas
- Hover state: card sedikit lift, shadow-md muncul
- "Konsultasi & pesan via WA" button: ghost button dengan bordeaux border (btn-secondary)

### C. Section "Bukan Sekadar Konsumen — Jadilah Mitra"

**Sekarang:** Hijau gelap dengan banyak text, terasa heavy.

**Redesign:**
- Background ONYX (`--color-bg-inverse: #1F1A17`)
- Eyebrow champagne: "PELUANG BISNIS" dengan decorative line champagne 60px di atasnya
- Heading Fraunces 56px pearl: "Bukan sekadar konsumen, *jadilah mitra eksklusif*" (bagian italic dalam **champagne** — di dark bg, bordeaux akan terlalu gelap, jadi pakai champagne yang kontras lebih baik)
- Lead paragraph max 2 baris, pearl dengan opacity 0.85
- Single primary CTA "Saya mau jadi mitra — info lengkap via WA" dalam **CHAMPAGNE bg dengan ONYX text**. Ini satu-satunya tempat champagne dipakai sebagai bg button karena pop natural di dark onyx.
- Tambahkan ornamen halus: garis horizontal champagne 1px, lebar 60px, di atas eyebrow untuk efek editorial premium.

### D. Section "Hak & Keuntungan Mitra"

**Redesign:**
- Background pearl
- Eyebrow bordeaux: "MENGAPA BERGABUNG"
- Grid 3 kolom benefit cards
- Tiap card: bg white, border 0.5px subtle, border-radius xl (20px), padding 32px
- Icon di tiap card: outline style 1.5px **champagne**, size 32px (Lucide React dengan `strokeWidth={1.5}`). JANGAN filled icon.
- Card title Fraunces 20px medium, color text-primary
- Card body Plus Jakarta Sans 15px text-secondary, line-height 1.6

### E. Section "Mulai Bisnis dengan Membeli Produk BP" (Pricing Tiers)

**Sekarang:** Tiga kotak dengan bg hijau gelap, semua mirip, tier "Paket SAP" sebagai featured tapi tidak terlalu menonjol.

**Redesign:**
- Background stone (`--color-bg-secondary`)
- Eyebrow bordeaux: "PILIH PAKET KEMITRAAN"
- Heading: "Mulai bisnis dengan *membeli produk BP*"
- Tiga kartu: Paket SE / Paket SAP / Paket AP dengan layout grid 3 kolom (di mobile stack vertical)
- Default card (SE & AP): bg white, border 0.5px subtle, padding 40px, border-radius xl
- **Featured card (Paket SAP):**
  - Background tetap white (bukan bordeaux solid — ini key)
  - Border **2px bordeaux**
  - Badge "PALING DIMINATI" di atas card: bg bordeaux, text pearl, padding 6px 16px, border-radius full, position absolute -top 12px center
  - Subtle inner ring: box-shadow inset 0 0 0 1px var(--color-brand-border) untuk depth
- Tier name: Fraunces 28px italic — "Paket SE", "Paket SAP", "Paket AP", color text-primary
- Price: Fraunces 40px medium, color text-primary. Format "Rp 30.000.000" dengan letter spacing tight.
- "Modal awal:" label dalam Plus Jakarta Sans 12px text-tertiary uppercase
- Bullet list features: JANGAN pakai bullet point bulat. Pakai garis horizontal champagne 1px width 24px di kiri tiap item, ATAU Lucide check icon outline 14px champagne stroke-width 2.
- CTA per card:
  - Paket SE & AP: btn-secondary (ghost dengan bordeaux border)
  - Paket SAP (featured): **btn-primary** (bordeaux solid bg)

### F. Section "Cara Bergabung" (3 Langkah)

**Redesign:**
- Background pearl
- Eyebrow champagne: "CARA BERGABUNG"
- Layout: 3 kolom horizontal dengan connector line champagne 1px dashed antar kolom (hidden di mobile)
- Tiap step: number indicator dalam circle 48px, border 1px champagne, no fill, font Fraunces 20px italic medium
- Step title Fraunces 22px medium
- Step description Plus Jakarta Sans 15px text-secondary

### G. Footer

**Redesign:**
- Background pearl (jangan dark — agar konsisten dengan tone editorial)
- Border-top 0.5px subtle dengan accent garis champagne 60px center di atas content
- Logo + tagline + sosial media link minimalis
- Sosial icon: outline champagne 1.5px, size 20px
- Copyright text-tertiary 12px

---

## 4. Micro-interaction & Polish

- Semua transisi pakai `cubic-bezier(0.4, 0, 0.2, 1)` duration 200-300ms
- Image hover: scale(1.02) dengan duration 600ms — sangat subtle
- Link underline pakai champagne border-bottom 1px dengan offset 4px untuk look editorial
- Cursor: pointer hanya pada interactive elements
- Focus states: outline 2px **bordeaux** dengan offset 2px untuk accessibility
- Bordeaux CTA: subtle shadow-brand pada hover untuk tambahan depth premium

---

## 5. Mobile-First Adjustments

- Section padding: 64px atas-bawah di mobile (vs 96px desktop)
- Display heading: clamp dari 32px ke 64px berdasarkan viewport
- Grid produk: 1 kolom di mobile, dengan card image aspect-ratio diubah ke 16/9
- Sticky CTA bar di bottom mobile untuk "Konsultasi via WA" — bg pearl, border-top champagne 1px, button bordeaux solid
- Touch target minimum 44x44px untuk semua interactive

---

## 6. Implementation Notes

- Pakai Tailwind CSS dengan custom config yang map ke CSS variables di atas, ATAU CSS module murni
- Jika pakai Tailwind, extend theme di `tailwind.config.js`:

```js
colors: {
  pearl: '#FAFAF7',
  stone: '#EFE9DD',
  onyx: '#1F1A17',
  bordeaux: { DEFAULT: '#722F3A', dark: '#5C2530', soft: '#F4E8E9' },
  champagne: { DEFAULT: '#C9A961', dark: '#B0924A', soft: '#F2EBD8' },
  taupe: '#8A8073',
}
```

- Semua icon pakai Lucide React dengan `strokeWidth={1.5}` untuk konsistensi delicate look
- Image: pakai Next/Image dengan quality 90, gunakan WebP. Aspect ratio konsisten per use case.
- Hindari box-shadow yang heavy. Pakai shadow definisi di atas, sangat subtle.
- Hindari gradient — flat colors only. Premium = restraint.
- Pastikan kontras WCAG AA: bordeaux #722F3A on pearl #FAFAF7 = 8.7:1 (AAA pass), onyx on pearl = 16:1 (AAA pass)

---

## 7. Apa Yang TIDAK Perlu Diubah

- Struktur informasi & copy konten utama (hanya mungkin perlu tweak headline agar lebih punchy)
- Functionality (AI advisor, link WA, dll)
- Sertifikasi & trust signals — TETAP tampilkan, hanya cara presentasi yang lebih halus

---

## 8. Visual Identity Summary (yang harus konsisten di semua section)

**The "Pearl & Bordeaux" signature elements yang harus muncul konsisten:**

1. **Italic bordeaux emphasis** dalam serif headline — ini adalah signature visual utama. Setiap section heading harus punya 2-3 kata dalam Fraunces italic bordeaux.
2. **Decorative champagne lines** — garis horizontal 1px champagne, panjang 24-60px, dipakai sebagai eyebrow decorator dan section divider.
3. **Generous whitespace** — section padding minimum 96px, header margin-bottom 64px.
4. **Light borders, no heavy shadows** — premium = restraint. 0.5px borders, subtle shadows only.
5. **Tipografi serif-sans dance** — Fraunces serif untuk heading & price, Plus Jakarta Sans untuk body. Contrast antara dua font family memberi kesan editorial.
6. **CTA hierarchy disiplin** — bordeaux solid CTA sangat sparingly. Maksimum 1 bordeaux primary button per section.

---

## Output yang Diharapkan

Hasilkan kode lengkap untuk:
1. Update `globals.css` / `tailwind.config.js` dengan design tokens di atas
2. Refactor semua component existing untuk match design system baru
3. Per section, output sebagai komponen terpisah dengan props yang clean
4. Pastikan responsive di mobile, tablet, desktop
5. Pastikan semantic HTML & accessibility (aria-labels, alt text, focus states)

**Mulai dari Hero section dulu**, lalu lanjut ke section berikutnya berurutan. Tunjukkan preview / screenshot setelah tiap section selesai agar saya bisa kasih feedback iteratif.
