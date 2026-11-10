export interface ProductData {
    id: string;
    category: string;
    badgeText: string;
    badgeColor: 'green' | 'red' | 'blue' | 'gold' | 'kids' | 'supplement';
    name: string;
    tagline: string;
    description: string;
    benefits: string[];
    specs: { icon: string; text: string }[];
    price: string;
    priceNote: string;
    oldPrice?: string;
    nomorRegistrasi?: string;
    hargaTier?: { label: string; minQty: string; harga: string }[];
    bgStyle: 'green' | 'teal' | 'gold' | 'blue' | 'red' | 'purple';
    emoji: string;
    image?: string;
    /** Titik fokus gambar saat terpotong (CSS object-position), mis. "32% center" */
    imagePosition?: string;
    /** Tampilkan badge "BARU" & taruh paling atas di katalog. Hapus/false bila sudah tidak baru. */
    isNew?: boolean;
}

export const KATALOG_PRODUCTS: ProductData[] = [
    {
        id: "british-propolis",
        category: "propolis",
        badgeText: "Paling Populer",
        badgeColor: "green",
        name: "British Propolis",
        tagline: "Teman Harian Daya Tahan Tubuh",
        description: "Propolis dari lebah Inggris, sumber flavonoid alami. Diminum rutin untuk membantu memelihara daya tahan tubuh keluarga sehari-hari.",
        benefits: [
            "Membantu memelihara daya tahan tubuh",
            "Praktis: cukup diteteskan ke air minum",
            "Mengandung flavonoid alami dari propolis"
        ],
        specs: [
            { icon: "water_drop", text: "Drop 6 ML" },
            { icon: "science", text: "Botol Kaca" }
        ],
        price: "Rp 265.000",
        priceNote: "Per Botol 6 ML",
        nomorRegistrasi: "TR183610771",
        hargaTier: [
            { label: 'Reseller', minQty: 'min. 3 pcs', harga: 'Rp 240.000' },
            { label: 'Agen', minQty: 'min. 5 pcs', harga: 'Rp 225.000' },
            { label: 'Agen Plus', minQty: 'min. 10 pcs', harga: 'Rp 210.000' },
        ],
        bgStyle: "green",
        emoji: "medication_liquid",
        image: "/images/produk/bp.webp"
    },
    {
        id: "british-propolis-green",
        category: "propolis",
        badgeText: "Untuk Anak",
        badgeColor: "kids",
        name: "British Propolis Green",
        tagline: "Propolis Pilihan untuk Si Kecil",
        description: "Formulasi untuk anak dengan Madu Trigona. Membantu memelihara daya tahan tubuh si kecil. Ikuti aturan pakai sesuai usia di label.",
        benefits: [
            "Membantu memelihara daya tahan tubuh anak",
            "Dengan Madu Trigona, rasa disukai anak",
            "Mudah diberikan: diteteskan ke minuman"
        ],
        specs: [
            { icon: "water_drop", text: "Drop 6 ML" },
            { icon: "child_care", text: "Usia 1-12 Th" }
        ],
        price: "Rp 285.000",
        priceNote: "Per Botol 6 ML",
        nomorRegistrasi: "TR193631981",
        hargaTier: [
            { label: 'Reseller', minQty: 'min. 3 pcs', harga: 'Rp 260.000' },
            { label: 'Agen', minQty: 'min. 5 pcs', harga: 'Rp 245.000' },
            { label: 'Agen Plus', minQty: 'min. 10 pcs', harga: 'Rp 225.000' },
        ],
        bgStyle: "teal",
        emoji: "child_care",
        image: "/images/produk/bpgreen.webp"
    },
    {
        id: "british-propolis-blue",
        category: "propolis",
        badgeText: "Untuk Wanita",
        badgeColor: "blue",
        name: "British Propolis Blue",
        tagline: "✨ Varian Terbaru Khusus Wanita",
        description: "PRODUK BARU! Varian propolis khusus wanita untuk menemani hari-hari aktifmu, termasuk saat datang bulan. Tanyakan detail manfaat sesuai label via WhatsApp.",
        benefits: [
            "Diformulasikan khusus untuk wanita",
            "Menemani hari-hari saat datang bulan",
            "Membantu memelihara daya tahan tubuh"
        ],
        specs: [
            { icon: "water_drop", text: "Drop 6 ML" },
            { icon: "female", text: "Khusus Wanita" }
        ],
        price: "Rp 285.000",
        priceNote: "Per Botol 6 ML",
        hargaTier: [
            { label: 'Reseller', minQty: 'min. 3 pcs', harga: 'Rp 260.000' },
            { label: 'Agen', minQty: 'min. 5 pcs', harga: 'Rp 245.000' },
            { label: 'Agen Plus', minQty: 'min. 10 pcs', harga: 'Rp 225.000' },
        ],
        bgStyle: "purple",
        emoji: "female",
        image: "/images/produk/bpblue.webp"
    },
    {
        id: "brassic-pro",
        category: "suplemen",
        badgeText: "Suplemen",
        badgeColor: "gold",
        name: "Brassic Pro",
        tagline: "Badan Nyaman, Istirahat Lebih Berkualitas",
        description: "Perpaduan Moringa dan Echinacea. Teman bagi kamu yang sering pegal-pegal dan ingin istirahat malam lebih nyenyak.",
        benefits: [
            "Membantu meredakan pegal-pegal",
            "Mendukung istirahat yang lebih nyenyak",
            "Badan terasa lebih segar"
        ],
        specs: [
            { icon: "pill", text: "40 Kapsul" },
            { icon: "eco", text: "Moringa" }
        ],
        price: "Rp 265.000",
        priceNote: "1 Botol 40 Kapsul",
        nomorRegistrasi: "TR203341281",
        hargaTier: [
            { label: 'Reseller', minQty: 'min. 3 pcs', harga: 'Rp 240.000' },
            { label: 'Agen', minQty: 'min. 5 pcs', harga: 'Rp 225.000' },
            { label: 'Agen Plus', minQty: 'min. 10 pcs', harga: 'Rp 210.000' },
        ],
        bgStyle: "gold",
        emoji: "healing",
        image: "/images/produk/brassicpro.webp"
    },
    {
        id: "brassic-eye",
        category: "suplemen",
        badgeText: "Suplemen Mata",
        badgeColor: "blue",
        name: "Brassic Eye",
        tagline: "Perlindungan Mata Era Gadget",
        description: "Ekstrak Bilberry dan Gynura. Teman bagi kamu yang setiap hari lama menatap layar HP atau laptop dan sering merasa mata lelah.",
        benefits: [
            "Membantu meredakan mata lelah",
            "Membantu memelihara kesehatan mata",
            "Cocok untuk pengguna gadget harian"
        ],
        specs: [
            { icon: "pill", text: "40 Kapsul" },
            { icon: "nutrition", text: "Bilberry Extract" }
        ],
        price: "Rp 265.000",
        priceNote: "1 Botol 40 Kapsul",
        nomorRegistrasi: "TR203342441",
        hargaTier: [
            { label: 'Reseller', minQty: 'min. 3 pcs', harga: 'Rp 240.000' },
            { label: 'Agen', minQty: 'min. 5 pcs', harga: 'Rp 225.000' },
            { label: 'Agen Plus', minQty: 'min. 10 pcs', harga: 'Rp 210.000' },
        ],
        bgStyle: "blue",
        emoji: "visibility",
        image: "/images/produk/brassiceye.webp"
    },
    {
        id: "bp-norway",
        category: "suplemen",
        badgeText: "Suplemen Otak",
        badgeColor: "supplement",
        name: "BP Norway",
        tagline: "Omega-3 dari Salmon Norwegia",
        description: "Minyak ikan Atlantic Salmon dari perairan Norwegia. Mengandung Omega-3 (DHA) dan Astaxanthin untuk melengkapi nutrisi harian keluarga.",
        benefits: [
            "Sumber Omega-3 (DHA & EPA)",
            "Mengandung Astaxanthin",
            "Soft capsule, mudah ditelan"
        ],
        specs: [
            { icon: "pill", text: "Soft Kapsul" },
            { icon: "inventory_2", text: "40 Kapsul" },
            { icon: "set_meal", text: "Salmon Oil" }
        ],
        price: "Rp 265.000",
        priceNote: "40 Soft Capsules",
        nomorRegistrasi: "TR233005481",
        hargaTier: [
            { label: 'Reseller', minQty: 'min. 3 pcs', harga: 'Rp 240.000' },
            { label: 'Agen', minQty: 'min. 5 pcs', harga: 'Rp 225.000' },
            { label: 'Agen Plus', minQty: 'min. 10 pcs', harga: 'Rp 210.000' },
        ],
        bgStyle: "blue",
        emoji: "psychology",
        image: "/images/produk/norway.webp"
    },
    {
        id: "belgie-facial-wash",
        category: "skincare",
        badgeText: "Skincare Halal",
        badgeColor: "red",
        name: "Belgie Facial Wash",
        tagline: "Wajah Bersih Tanpa Ketarik",
        description: "Sabun wajah yang membersihkan kotoran dan minyak tanpa membuat kulit terasa kering. Wajah terasa segar dan lembap setelah dibilas.",
        benefits: [
            "Membersihkan tanpa rasa ketarik",
            "Wajah terasa lembap & segar",
            "Membantu mengangkat minyak berlebih"
        ],
        specs: [
            { icon: "sanitizer", text: "Gel 100 ML" },
            { icon: "science", text: "Propolis" }
        ],
        price: "Rp 195.000",
        priceNote: "Gel 100 ML",
        hargaTier: [
            { label: 'Reseller', minQty: 'min. 3 pcs', harga: 'Rp 195.000' },
            { label: 'Agen', minQty: 'min. 5 pcs', harga: 'Rp 195.000' },
            { label: 'Agen Plus', minQty: 'min. 10 pcs', harga: 'Rp 180.000' },
        ],
        bgStyle: "red",
        emoji: "water_drop",
        image: "/images/produk/facialwash.webp"
    },
    {
        id: "belgie-serum",
        category: "skincare",
        badgeText: "Skincare Halal",
        badgeColor: "red",
        name: "Belgie Anti Aging Serum",
        tagline: "Bantu Samarkan Flek & Garis Halus",
        description: "Dengan Kolagen dan Propolis. Ringan dan mudah meresap, membantu menyamarkan tampilan flek dan garis halus agar wajah tampak lebih kencang.",
        benefits: [
            "Membantu menyamarkan tampilan flek",
            "Membantu menyamarkan garis halus",
            "Kulit tampak lebih kenyal"
        ],
        specs: [
            { icon: "water_drop", text: "Cair 10 ML" },
            { icon: "auto_awesome", text: "5 Bahan Aktif" }
        ],
        price: "Rp 195.000",
        priceNote: "10 ML",
        hargaTier: [
            { label: 'Reseller', minQty: 'min. 3 pcs', harga: 'Rp 195.000' },
            { label: 'Agen', minQty: 'min. 5 pcs', harga: 'Rp 195.000' },
            { label: 'Agen Plus', minQty: 'min. 10 pcs', harga: 'Rp 180.000' },
        ],
        bgStyle: "purple",
        emoji: "auto_awesome",
        image: "/images/produk/serum.webp"
    },
    {
        id: "belgie-day-cream",
        category: "skincare",
        badgeText: "Skincare Halal",
        badgeColor: "red",
        name: "Belgie Day Cream",
        tagline: "Perlindungan Siang Anti UV",
        description: "Krim siang dengan SPF30+ untuk membantu melindungi kulit dari sinar matahari dan menjaga kelembapan saat beraktivitas.",
        benefits: [
            "Dengan SPF30+",
            "Wajah tampak segar di siang hari",
            "Membantu menjaga kelembapan kulit"
        ],
        specs: [
            { icon: "light_mode", text: "Krim 10 gr" },
            { icon: "wb_sunny", text: "SPF 30+" }
        ],
        price: "Rp 195.000",
        priceNote: "10 Gram",
        hargaTier: [
            { label: 'Reseller', minQty: 'min. 3 pcs', harga: 'Rp 195.000' },
            { label: 'Agen', minQty: 'min. 5 pcs', harga: 'Rp 195.000' },
            { label: 'Agen Plus', minQty: 'min. 10 pcs', harga: 'Rp 180.000' },
        ],
        bgStyle: "red",
        emoji: "light_mode",
        image: "/images/produk/daycream.webp"
    },
    {
        id: "belgie-night-cream",
        category: "skincare",
        badgeText: "Skincare Halal",
        badgeColor: "red",
        name: "Belgie Night Cream",
        tagline: "Perawatan Kulit Saat Kamu Tidur",
        description: "Krim malam dengan Salicylic Acid untuk merawat kulit selama kamu beristirahat. Bangun pagi dengan wajah yang terasa lebih kenyal dan lembap.",
        benefits: [
            "Merawat kulit saat tidur",
            "Kulit terasa lebih kenyal",
            "Membantu menjaga kelembapan kulit"
        ],
        specs: [
            { icon: "dark_mode", text: "Malam" },
            { icon: "inventory_2", text: "10 Gram" },
            { icon: "science", text: "Collagen" }
        ],
        price: "Rp 195.000",
        priceNote: "Krim 10 Gram",
        hargaTier: [
            { label: 'Reseller', minQty: 'min. 3 pcs', harga: 'Rp 195.000' },
            { label: 'Agen', minQty: 'min. 5 pcs', harga: 'Rp 195.000' },
            { label: 'Agen Plus', minQty: 'min. 10 pcs', harga: 'Rp 180.000' },
        ],
        bgStyle: "red",
        emoji: "dark_mode",
        image: "/images/produk/nightcream.webp"
    },
    {
        id: "belgie-hair-tonic",
        category: "skincare",
        badgeText: "Perawatan Rambut",
        badgeColor: "red",
        name: "Belgie Hair Tonic",
        tagline: "Rawat Kulit Kepala & Rambut",
        description: "Dengan AnaGain dari Swiss. Disemprotkan ke kulit kepala untuk membantu merawat rambut agar tampak lebih sehat dan tidak mudah patah.",
        benefits: [
            "Membantu merawat kekuatan rambut",
            "Dengan bahan aktif AnaGain",
            "Sensasi dingin yang menyegarkan kulit kepala"
        ],
        specs: [
            { icon: "face_retouching_natural", text: "Spray" },
            { icon: "inventory_2", text: "100 ML" },
            { icon: "eco", text: "Anagain Swiss" }
        ],
        price: "Rp 195.000",
        priceNote: "Spray 100 ML",
        hargaTier: [
            { label: 'Reseller', minQty: 'min. 3 pcs', harga: 'Rp 195.000' },
            { label: 'Agen', minQty: 'min. 5 pcs', harga: 'Rp 195.000' },
            { label: 'Agen Plus', minQty: 'min. 10 pcs', harga: 'Rp 180.000' },
        ],
        bgStyle: "gold",
        emoji: "face_retouching_natural",
        image: "/images/produk/hairtonic.webp"
    },
    {
        id: "steffi-pro",
        category: "natural",
        badgeText: "Natural Sweetener",
        badgeColor: "blue",
        name: "Steffi Pro",
        tagline: "Manisnya Teh Tanpa Rasa Bersalah",
        description: "Pemanis dari ekstrak Stevia untuk teh, kopi, dan masakan. Pilihan bagi kamu yang sedang mengurangi konsumsi gula pasir.",
        benefits: [
            "Pilihan saat mengurangi gula pasir",
            "Cukup sedikit tetes untuk rasa manis",
            "Tanpa rasa pahit di akhir (aftertaste)"
        ],
        specs: [
            { icon: "water_drop", text: "Cair" },
            { icon: "inventory_2", text: "30 ML" },
            { icon: "eco", text: "Stevia Extract" }
        ],
        price: "Rp 265.000",
        priceNote: "Per Botol 30 ML",
        nomorRegistrasi: "MD 272824001500528",
        hargaTier: [
            { label: 'Reseller', minQty: 'min. 3 pcs', harga: 'Rp 240.000' },
            { label: 'Agen', minQty: 'min. 5 pcs', harga: 'Rp 225.000' },
            { label: 'Agen Plus', minQty: 'min. 10 pcs', harga: 'Rp 210.000' },
        ],
        bgStyle: "blue",
        emoji: "local_cafe",
        image: "/images/produk/steffi.webp"
    },
    {
        id: "belgie-luxury-perfume",
        category: "parfum",
        badgeText: "Parfum Mewah",
        badgeColor: "gold",
        name: "Belgie Luxury Perfume",
        tagline: "Aroma Elegan, Inspirasi Kemewahan Eropa",
        description: "Parfum mewah beraroma elegan yang terinspirasi keanggunan Eropa. Disemprotkan ke pakaian untuk melengkapi penampilan dan menambah rasa percaya diri, dari aktivitas harian sampai acara spesial.",
        benefits: [
            "Aroma elegan dan berkelas",
            "Dirancang agar wangi bertahan lama",
            "Botol premium biru & emas, cocok untuk hadiah"
        ],
        specs: [
            { icon: "auto_awesome", text: "Luxury Perfume" },
            { icon: "checkroom", text: "Semprot ke pakaian" }
        ],
        price: "Rp 225.000",
        priceNote: "Per Botol",
        bgStyle: "blue",
        emoji: "auto_awesome",
        image: "/images/produk/belgie-perfume.webp",
        imagePosition: "32% center",
        isNew: true
    }
];
