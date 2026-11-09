// Halaman per kebutuhan konsumen (/kebutuhan/:slug) — untuk menangkap pencarian Google.
// Bahasa mengikuti pedoman klaim BPOM: tidak menjanjikan menyembuhkan/mencegah penyakit,
// produk diposisikan sebagai pendamping gaya hidup sehat.

export interface Kebutuhan {
    slug: string;
    /** Label pendek untuk kartu & menu */
    label: string;
    icon: string;
    h1: string;
    metaTitle: string;
    metaDescription: string;
    intro: string[];
    tips: { title: string; desc: string }[];
    productIds: string[];
    /** Pesan WA otomatis */
    waTopic: string;
    faqs: { q: string; a: string }[];
}

export const KEBUTUHAN: Kebutuhan[] = [
    {
        slug: "daya-tahan-tubuh",
        label: "Daya Tahan Tubuh",
        icon: "shield",
        h1: "Menjaga Daya Tahan Tubuh Keluarga Setiap Hari",
        metaTitle: "Suplemen Daya Tahan Tubuh Keluarga: Tips & Pilihan British Propolis",
        metaDescription:
            "Kebiasaan sederhana menjaga daya tahan tubuh keluarga, terutama saat musim hujan, plus pilihan British Propolis untuk dewasa dan anak. Konsultasi gratis via WhatsApp.",
        intro: [
            "Pergantian musim, jadwal yang padat, dan kurang tidur sering membuat badan terasa mudah drop. Daya tahan tubuh dibangun dari kebiasaan harian: makan bergizi, tidur cukup, bergerak, dan mengelola stres.",
            "Banyak keluarga melengkapi kebiasaan itu dengan propolis. British Propolis berasal dari lebah di Inggris dan mengandung flavonoid alami. Diminum rutin untuk membantu memelihara daya tahan tubuh.",
        ],
        tips: [
            { title: "Piring berwarna", desc: "Isi setengah piring dengan sayur dan buah beragam warna setiap makan." },
            { title: "Tidur 7–8 jam", desc: "Untuk dewasa, usahakan jam tidur yang konsisten, termasuk di akhir pekan." },
            { title: "Bergerak 30 menit", desc: "Jalan kaki, bersepeda, atau senam ringan hampir setiap hari." },
            { title: "Cuci tangan", desc: "Biasakan cuci tangan dengan sabun sebelum makan dan sepulang dari luar." },
        ],
        productIds: ["british-propolis", "british-propolis-green", "bp-norway"],
        waTopic: "menjaga daya tahan tubuh keluarga",
        faqs: [
            {
                q: "Propolis mana yang cocok untuk dewasa dan untuk anak?",
                a: "British Propolis (reguler) untuk dewasa, British Propolis Green diformulasikan untuk anak. Ikuti aturan pakai sesuai usia di kemasan, dan tanyakan ke Mbak Tila bila ragu.",
            },
            {
                q: "Kapan sebaiknya diminum?",
                a: "Ikuti aturan pakai di kemasan. Yang terpenting adalah rutin, dibarengi pola makan dan istirahat yang baik.",
            },
            {
                q: "Apakah bisa menggantikan obat dari dokter?",
                a: "Tidak. Produk ini bukan obat. Bila sedang sakit atau dalam pengobatan, ikuti anjuran dokter dan konsultasikan sebelum mengonsumsi suplemen.",
            },
        ],
    },
    {
        slug: "anak",
        label: "Si Kecil",
        icon: "child_care",
        h1: "Menemani Tumbuh Kembang & Daya Tahan Tubuh Si Kecil",
        metaTitle: "Propolis untuk Anak: Tips Menjaga Daya Tahan Tubuh Si Kecil | British Propolis Green",
        metaDescription:
            "Tips menjaga daya tahan tubuh anak dan mengenal British Propolis Green, propolis yang diformulasikan untuk anak dengan Madu Trigona. Tanya Mbak Tila gratis via WhatsApp.",
        intro: [
            "Anak yang mulai sekolah atau sering bermain di luar biasanya lebih sering bertemu kuman. Gizi seimbang, tidur cukup, dan waktu bermain aktif adalah fondasi utamanya.",
            "British Propolis Green diformulasikan untuk anak dengan tambahan Madu Trigona, jadi lebih mudah diterima si kecil. Diberikan rutin untuk membantu memelihara daya tahan tubuh anak.",
        ],
        tips: [
            { title: "Jadwal makan teratur", desc: "Makan utama dan camilan sehat di jam yang sama setiap hari membantu anak lebih lahap." },
            { title: "Sajikan dengan menarik", desc: "Bentuk dan warna makanan yang menarik membuat anak mau mencoba sayur dan lauk baru." },
            { title: "Tidur cukup", desc: "Anak usia sekolah umumnya butuh 9–12 jam tidur. Batasi gawai sebelum tidur." },
            { title: "Main di luar", desc: "Aktivitas fisik dan sinar matahari pagi baik untuk tumbuh kembang." },
        ],
        productIds: ["british-propolis-green", "bp-norway"],
        waTopic: "propolis untuk anak",
        faqs: [
            {
                q: "Mulai usia berapa anak boleh diberi British Propolis Green?",
                a: "Ikuti batas usia dan takaran yang tertera di kemasan. Untuk bayi, anak dengan kondisi khusus, atau yang sedang berobat, konsultasikan dulu dengan dokter anak.",
            },
            {
                q: "Bagaimana kalau anak tidak suka rasanya?",
                a: "Bisa diteteskan ke air atau minuman kesukaannya sesuai aturan pakai. Mbak Tila bisa berbagi trik dari pengalaman sebagai ibu 3 anak.",
            },
            {
                q: "Apakah perlu diberikan setiap hari?",
                a: "Ikuti aturan pakai di kemasan. Konsistensi, ditambah makan bergizi dan tidur cukup, lebih penting daripada dosis yang banyak.",
            },
        ],
    },
    {
        slug: "mata-lelah",
        label: "Mata Lelah",
        icon: "visibility",
        h1: "Mata Lelah karena Layar? Kebiasaan Kecil yang Membantu",
        metaTitle: "Mata Lelah karena HP & Laptop: Tips Harian & Brassic Eye",
        metaDescription:
            "Sering menatap layar HP atau laptop dan mata terasa lelah? Coba aturan 20-20-20 dan kebiasaan sederhana lainnya, serta kenali Brassic Eye dengan Bilberry & Gynura.",
        intro: [
            "Bekerja dan sekolah lewat layar membuat mata dipakai fokus jarak dekat berjam-jam. Akibatnya mata terasa lelah, kering, atau pegal di sore hari.",
            "Selain mengatur kebiasaan, sebagian orang melengkapi nutrisinya dengan Brassic Eye yang mengandung ekstrak Bilberry dan Gynura untuk membantu memelihara kesehatan mata.",
        ],
        tips: [
            { title: "Aturan 20-20-20", desc: "Setiap 20 menit, lihat objek sejauh ±6 meter selama 20 detik." },
            { title: "Atur layar", desc: "Kecerahan layar disesuaikan ruangan, jarak layar sekitar satu lengan." },
            { title: "Jangan lupa berkedip", desc: "Saat fokus kita jarang berkedip. Sadari dan berkedip pelan beberapa kali." },
            { title: "Periksa rutin", desc: "Bila penglihatan kabur atau mata sering merah, periksakan ke dokter mata." },
        ],
        productIds: ["brassic-eye", "bp-norway"],
        waTopic: "mata lelah karena layar",
        faqs: [
            {
                q: "Apakah Brassic Eye bisa mengurangi minus atau mengganti kacamata?",
                a: "Tidak. Brassic Eye adalah suplemen untuk membantu memelihara kesehatan mata, bukan pengganti kacamata atau pengobatan. Gangguan penglihatan sebaiknya diperiksakan ke dokter mata.",
            },
            {
                q: "Siapa yang biasanya memilih Brassic Eye?",
                a: "Banyak dipilih pekerja kantoran, pelajar, dan siapa saja yang setiap hari lama menatap layar.",
            },
            {
                q: "Bagaimana cara konsumsinya?",
                a: "Ikuti aturan pakai di kemasan. Tanyakan ke Mbak Tila bila ingin dikombinasikan dengan produk lain.",
            },
        ],
    },
    {
        slug: "tidur-nyenyak",
        label: "Tidur Nyenyak",
        icon: "bedtime",
        h1: "Susah Tidur? Mulai dari Kebiasaan Malam yang Lebih Baik",
        metaTitle: "Susah Tidur Nyenyak? 5 Kebiasaan Malam & Pilihan Brassic Pro",
        metaDescription:
            "Tips sederhana agar istirahat malam lebih nyenyak: jam tidur teratur, batasi gawai, kurangi kafein. Kenali juga Brassic Pro dengan Moringa & Echinacea.",
        intro: [
            "Tidur yang kurang berkualitas membuat badan lemas dan sulit fokus keesokan harinya. Seringkali penyebabnya kebiasaan kecil: main HP sampai larut, kopi sore hari, atau jam tidur yang berubah-ubah.",
            "Selain memperbaiki kebiasaan, ada yang melengkapinya dengan Brassic Pro, perpaduan Moringa dan Echinacea, untuk mendukung istirahat yang lebih nyenyak.",
        ],
        tips: [
            { title: "Jam tidur tetap", desc: "Tidur dan bangun di jam yang sama setiap hari, termasuk akhir pekan." },
            { title: "Gawai off 1 jam", desc: "Matikan atau jauhkan HP sekitar satu jam sebelum tidur." },
            { title: "Kafein sebelum siang", desc: "Batasi kopi dan teh pekat setelah jam 2 siang." },
            { title: "Kamar gelap & sejuk", desc: "Redupkan lampu dan jaga suhu kamar tetap nyaman." },
        ],
        productIds: ["brassic-pro", "british-propolis"],
        waTopic: "istirahat malam yang lebih nyenyak",
        faqs: [
            {
                q: "Apakah Brassic Pro obat tidur?",
                a: "Bukan. Brassic Pro adalah suplemen herbal untuk mendukung istirahat, bukan obat tidur. Gangguan tidur yang berkepanjangan sebaiknya dikonsultasikan ke dokter.",
            },
            {
                q: "Kapan sebaiknya diminum?",
                a: "Ikuti aturan pakai di kemasan. Mbak Tila bisa membantu menjelaskan cara konsumsi yang pas.",
            },
            {
                q: "Bolehkah diminum bersama obat lain?",
                a: "Bila sedang mengonsumsi obat rutin, tanyakan dulu ke dokter atau apoteker.",
            },
        ],
    },
    {
        slug: "badan-pegal",
        label: "Badan Pegal",
        icon: "accessibility_new",
        h1: "Badan Sering Pegal? Rawat dengan Gerak & Istirahat yang Cukup",
        metaTitle: "Badan Sering Pegal-Pegal: Tips Harian & Pilihan Brassic Pro",
        metaDescription:
            "Pegal-pegal setelah beraktivitas? Coba peregangan, kompres hangat, dan istirahat cukup. Kenali juga Brassic Pro dengan Moringa & Echinacea. Konsultasi gratis via WhatsApp.",
        intro: [
            "Duduk terlalu lama, mengangkat beban, atau aktivitas rumah tangga seharian bisa membuat badan pegal. Peregangan rutin dan istirahat cukup adalah langkah pertama.",
            "Brassic Pro dengan Moringa dan Echinacea sering dipilih sebagai teman saat badan terasa pegal-pegal setelah beraktivitas.",
        ],
        tips: [
            { title: "Peregangan pagi", desc: "5–10 menit peregangan ringan setelah bangun tidur." },
            { title: "Kompres hangat", desc: "Kompres area yang pegal dengan handuk hangat sekitar 15 menit." },
            { title: "Jeda dari duduk", desc: "Berdiri dan bergerak sebentar setiap 30–60 menit duduk." },
            { title: "Cukup minum", desc: "Minum air putih yang cukup sepanjang hari." },
        ],
        productIds: ["brassic-pro", "british-propolis"],
        waTopic: "badan yang sering pegal",
        faqs: [
            {
                q: "Nyeri sendi saya sudah lama, apakah cukup dengan Brassic Pro?",
                a: "Untuk nyeri yang lama, bengkak, atau mengganggu aktivitas, periksakan ke dokter terlebih dulu. Brassic Pro adalah suplemen pendamping, bukan obat.",
            },
            {
                q: "Siapa yang biasanya memilih Brassic Pro?",
                a: "Banyak dipilih ibu rumah tangga, pekerja yang banyak duduk atau berdiri, dan orang tua yang tetap aktif.",
            },
            {
                q: "Bagaimana cara konsumsinya?",
                a: "Ikuti aturan pakai di kemasan dan tanyakan ke Mbak Tila bila ragu.",
            },
        ],
    },
    {
        slug: "kurangi-gula",
        label: "Kurangi Gula",
        icon: "cookie",
        h1: "Mau Mengurangi Gula Pasir? Mulai dari Minuman Harian",
        metaTitle: "Cara Mengurangi Konsumsi Gula Sehari-hari & Pemanis Stevia Steffi Pro",
        metaDescription:
            "Tips praktis mengurangi gula pasir di minuman dan masakan keluarga, plus mengenal Steffi Pro, pemanis dari ekstrak stevia. Tanya Mbak Tila gratis via WhatsApp.",
        intro: [
            "Gula paling banyak masuk lewat minuman: teh manis, kopi susu, dan minuman kemasan. Mengurangi gula bisa dimulai pelan-pelan dari kebiasaan di rumah.",
            "Steffi Pro adalah pemanis dari ekstrak stevia yang bisa dipakai untuk teh, kopi, dan masakan, sebagai pilihan saat kamu sedang mengurangi gula pasir.",
        ],
        tips: [
            { title: "Kurangi bertahap", desc: "Kurangi satu sendok gula dari minuman setiap minggu agar lidah terbiasa." },
            { title: "Cek label", desc: "Perhatikan kandungan gula pada label minuman dan camilan kemasan." },
            { title: "Air putih dulu", desc: "Jadikan air putih minuman utama, minuman manis sebagai sesekali." },
            { title: "Buah utuh", desc: "Pilih buah utuh untuk camilan manis dibanding jus bergula." },
        ],
        productIds: ["steffi-pro"],
        waTopic: "mengurangi gula pasir dengan Steffi Pro",
        faqs: [
            {
                q: "Apakah Steffi Pro obat diabetes atau bisa menurunkan gula darah?",
                a: "Bukan. Steffi Pro adalah pemanis (produk pangan), bukan obat. Bagi yang memiliki diabetes, ikuti anjuran dokter dan ahli gizi untuk pola makan dan pengobatan.",
            },
            {
                q: "Bisa dipakai untuk apa saja?",
                a: "Untuk teh, kopi, minuman lain, dan masakan. Takarannya sedikit karena rasa manis stevia lebih kuat dari gula pasir.",
            },
            {
                q: "Apakah ada rasa pahit di akhir?",
                a: "Steffi Pro dirancang tanpa rasa pahit di akhir (aftertaste). Setiap lidah bisa berbeda, jadi mulai dengan sedikit dulu.",
            },
        ],
    },
    {
        slug: "perawatan-kulit",
        label: "Perawatan Kulit",
        icon: "face",
        h1: "Rutinitas Perawatan Kulit Sederhana untuk Ibu Sibuk",
        metaTitle: "Skincare Sederhana untuk Ibu Sibuk: Rutinitas Pagi & Malam | Belgie",
        metaDescription:
            "Rutinitas skincare 4 langkah yang praktis: bersihkan, rawat, lindungi di siang hari, dan rawat di malam hari dengan rangkaian Belgie. Konsultasi gratis via WhatsApp.",
        intro: [
            "Tidak perlu belasan langkah. Kulit yang terawat dimulai dari rutinitas sederhana yang dilakukan konsisten: membersihkan, melembapkan, dan melindungi dari sinar matahari.",
            "Rangkaian Belgie terdiri dari facial wash, serum dengan kolagen & propolis, day cream SPF30+, dan night cream, sehingga mudah disusun menjadi rutinitas pagi dan malam.",
        ],
        tips: [
            { title: "Pagi: bersih & lindungi", desc: "Cuci muka, pakai serum, lalu day cream dengan SPF sebelum beraktivitas." },
            { title: "Malam: bersih & rawat", desc: "Bersihkan wajah dari debu dan riasan, lalu serum dan night cream." },
            { title: "Uji tempel", desc: "Coba produk baru di area kecil dulu selama 1–2 hari." },
            { title: "Konsisten", desc: "Beri waktu beberapa minggu sebelum menilai hasil perawatan." },
        ],
        productIds: ["belgie-facial-wash", "belgie-serum", "belgie-day-cream", "belgie-night-cream"],
        waTopic: "rutinitas perawatan kulit Belgie",
        faqs: [
            {
                q: "Urutan pemakaian rangkaian Belgie bagaimana?",
                a: "Pagi: Facial Wash → Serum → Day Cream. Malam: Facial Wash → Serum → Night Cream.",
            },
            {
                q: "Apakah cocok untuk kulit sensitif?",
                a: "Setiap kulit berbeda. Lakukan uji tempel lebih dulu dan hentikan pemakaian bila muncul iritasi. Untuk masalah kulit yang serius, konsultasikan ke dokter kulit.",
            },
            {
                q: "Boleh beli satuan dulu?",
                a: "Boleh. Banyak yang mulai dari Facial Wash dan Day Cream, lalu melengkapi rangkaiannya.",
            },
        ],
    },
    {
        slug: "perawatan-rambut",
        label: "Perawatan Rambut",
        icon: "content_cut",
        h1: "Rambut Mudah Patah & Rontok saat Keramas? Mulai Rawat Kulit Kepala",
        metaTitle: "Rambut Rontok saat Keramas: Tips Merawat Rambut & Belgie Hair Tonic",
        metaDescription:
            "Tips merawat rambut dan kulit kepala agar rambut tampak lebih sehat: pijat kulit kepala, gizi cukup, kurangi panas. Kenali juga Belgie Hair Tonic dengan AnaGain.",
        intro: [
            "Rambut yang rontok saat keramas atau disisir bisa dipengaruhi banyak hal: stres, kurang tidur, pola makan, hingga kebiasaan menata rambut dengan panas.",
            "Belgie Hair Tonic dengan AnaGain dari Swiss disemprotkan ke kulit kepala untuk membantu merawat rambut agar tampak lebih sehat dan tidak mudah patah.",
        ],
        tips: [
            { title: "Pijat kulit kepala", desc: "Pijat lembut dengan ujung jari 3–5 menit setiap hari." },
            { title: "Protein cukup", desc: "Telur, ikan, tempe, dan kacang-kacangan baik untuk rambut." },
            { title: "Kurangi panas", desc: "Batasi catok dan pengering rambut bersuhu tinggi." },
            { title: "Ikat longgar", desc: "Hindari mengikat rambut terlalu kencang setiap hari." },
        ],
        productIds: ["belgie-hair-tonic"],
        waTopic: "perawatan rambut dengan Belgie Hair Tonic",
        faqs: [
            {
                q: "Apakah Belgie Hair Tonic bisa menumbuhkan rambut di area botak?",
                a: "Belgie Hair Tonic adalah kosmetik perawatan rambut dan kulit kepala, bukan obat. Kerontokan yang parah atau tiba-tiba sebaiknya diperiksakan ke dokter kulit.",
            },
            {
                q: "Bagaimana cara pakainya?",
                a: "Semprotkan ke kulit kepala yang bersih, lalu pijat lembut. Ikuti petunjuk di kemasan.",
            },
            {
                q: "Bisa dipakai pria dan wanita?",
                a: "Bisa, untuk pria maupun wanita dewasa.",
            },
        ],
    },
];
