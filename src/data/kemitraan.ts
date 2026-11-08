// Data program kemitraan — dipakai di beranda (section Bisnis) dan halaman /mitra.

export const KEUNTUNGAN_MITRA = [
    { icon: 'sell', title: 'Harga Kemitraan', desc: 'Dapatkan harga khusus mitra mulai dari Rp 195.000/botol, jauh lebih hemat dari harga eceran.' },
    { icon: 'school', title: 'Pembinaan Langsung', desc: 'Dibimbing langsung oleh Mas Ippho, para Leader, dan Mentor berpengalaman sampai menghasilkan.' },
    { icon: 'campaign', title: 'Bahan Promosi Harian', desc: 'Setiap hari mendapatkan materi promosi siap pakai untuk langsung dibagikan ke calon pelanggan.' },
    { icon: 'menu_book', title: 'Akses Pendidikan', desc: 'Akses penuh ke materi Knowledge & Skill untuk meningkatkan kemampuan bisnis dan produk.' },
    { icon: 'groups', title: 'Komunitas & Grup WA', desc: 'Bergabung ke komunitas aktif dan grup-grup WhatsApp untuk saling support dan sharing.' },
    { icon: 'trending_up', title: 'Potensi Untung Besar', desc: 'Untung hingga Rp 90.000/botol dengan potensi maksimal Rp 18.000.000 dari paket SE 200 Botol.' },
];

export const LANGKAH_MITRA = [
    { step: '01', icon: 'chat_bubble', title: 'Hubungi Kami', desc: 'Chat WhatsApp & ceritakan minatmu. Tim kami bantu pilihkan paket yang cocok (SE/SAP/AP).' },
    { step: '02', icon: 'shopping_cart', title: 'Pilih & Beli Paket', desc: 'Pilih paket kemitraan (bisa MIX produk). Langsung dapat harga mitra dan akses komunitas.' },
    { step: '03', icon: 'rocket_launch', title: 'Dibimbing Sampai Cuan', desc: 'Dapat pembinaan, bahan promosi harian, masuk grup WA, dan akses pendidikan bisnis sampai menghasilkan.' },
];

export interface PaketKemitraan {
    nama: string;
    jumlah: string;
    hargaPaket: string;
    modal: string;
    jual: string;
    untung: string;
    potensi: string;
    highlight: boolean;
}

export const PAKET_KEMITRAAN: PaketKemitraan[] = [
    { nama: 'Paket SE', jumlah: '200 Botol', hargaPaket: 'Rp 35.000.000', modal: 'Rp 175.000', jual: 'Rp 265.000', untung: 'Rp 90.000', potensi: 'Rp 18.000.000', highlight: true },
    { nama: 'Paket SAP', jumlah: '40 Botol', hargaPaket: 'Rp 7.800.000', modal: 'Rp 195.000', jual: 'Rp 265.000', untung: 'Rp 70.000', potensi: 'Rp 2.800.000', highlight: false },
    { nama: 'Paket AP', jumlah: '10 Botol', hargaPaket: 'Rp 2.100.000', modal: 'Rp 210.000', jual: 'Rp 265.000', untung: 'Rp 55.000', potensi: 'Rp 550.000', highlight: false },
];
