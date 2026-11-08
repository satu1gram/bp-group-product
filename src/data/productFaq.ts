// FAQ per produk — bahasa disesuaikan pedoman klaim BPOM (lihat docs/pedoman-klaim-bpom.md).
import type { ProductData } from "./katalogProducts";

export interface Faq {
    q: string;
    a: string;
}

export function getProductFaqs(p: ProductData): Faq[] {
    const faqs: Faq[] = [];

    faqs.push(
        p.nomorRegistrasi
            ? {
                q: `Apakah ${p.name} terdaftar di BPOM?`,
                a: `Ya. Nomor registrasi ${p.name} adalah ${p.nomorRegistrasi}. Kamu bisa mengecek keasliannya sendiri di situs resmi cekbpom.pom.go.id dengan memasukkan nomor tersebut.`,
            }
            : {
                q: `Apakah ${p.name} terdaftar resmi?`,
                a: `Ya, ${p.name} merupakan produk resmi. Nomor registrasi/notifikasinya tertera di kemasan, dan bisa kamu tanyakan langsung ke Mbak Tila via WhatsApp.`,
            }
    );

    faqs.push({
        q: `Bagaimana cara pakai ${p.name}?`,
        a: `Ikuti aturan pakai yang tertera di kemasan ${p.name}. Bila masih ragu soal takaran atau waktu pemakaian yang pas, tanyakan ke Mbak Tila via WhatsApp, gratis.`,
    });

    const tiers = p.hargaTier?.length
        ? ` Untuk pembelian lebih banyak ada harga khusus: ${p.hargaTier.map((t) => `${t.label} (${t.minQty}) ${t.harga}`).join(", ")}.`
        : "";
    faqs.push({
        q: `Berapa harga ${p.name}?`,
        a: `Harga ${p.name} ${p.price} (${p.priceNote.toLowerCase()}).${tiers}`,
    });

    faqs.push({
        q: "Bagaimana cara pesan dan pengirimannya?",
        a: "Pesan cukup lewat WhatsApp: sebutkan produk, jumlah, dan alamat pengiriman. Pesanan dikirim dari Malang, ongkos kirim dihitung sesuai alamatmu.",
    });

    if (p.category === "skincare") {
        faqs.push({
            q: `Apakah ${p.name} cocok untuk semua jenis kulit?`,
            a: "Setiap kulit bisa bereaksi berbeda. Sebelum pemakaian rutin, lakukan uji tempel di area kecil (misalnya belakang telinga) dan hentikan pemakaian bila muncul iritasi.",
        });
    } else {
        faqs.push({
            q: "Bolehkah dikonsumsi ibu hamil, menyusui, atau anak-anak?",
            a: "Baca peringatan dan aturan pakai di kemasan. Untuk ibu hamil, menyusui, anak-anak, atau yang sedang menjalani pengobatan, konsultasikan dulu dengan dokter sebelum mengonsumsi.",
        });
    }

    return faqs;
}
