const dataProvinsi = [
    { id: "aceh", nama: "Nanggroe Aceh Darussalam", suku: "Aceh", rumah: "Rumoh Aceh", pakaian: "Ulee Balang", kuis: "Tari apakah yang sangat terkenal dari Aceh yang menari sambil duduk dan menepuk dada?", opsi: ["Tari Saman", "Tari Kecak", "Tari Piring"], jawaban: "Tari Saman" },
    { id: "sumut", nama: "Sumatra Utara", suku: "Batak", rumah: "Rumah Bolon", pakaian: "Ulos", kuis: "Kain tenun khas suku Batak dari Sumatra Utara disebut?", opsi: ["Batik", "Ulos", "Songket"], jawaban: "Ulos" },
    { id: "sumbar", nama: "Sumatra Barat", suku: "Minangkabau", rumah: "Rumah Gadang", pakaian: "Bundo Kanduang", kuis: "Bentuk atap Rumah Gadang dari Sumatra Barat menyerupai tanduk hewan apa?", opsi: ["Rusa", "Kerbau", "Banteng"], jawaban: "Kerbau" },
    { id: "riau", nama: "Riau", suku: "Melayu", rumah: "Selaso Jatuh Kembar", pakaian: "Belanga", kuis: "Bahasa daerah yang paling banyak digunakan di Riau adalah?", opsi: ["Bahasa Jawa", "Bahasa Melayu", "Bahasa Bugis"], jawaban: "Bahasa Melayu" },
    { id: "kepri", nama: "Kepulauan Riau", suku: "Melayu", rumah: "Belah Bubung", pakaian: "Teluk Belanga", kuis: "Pantun sangat identik dengan budaya suku apa di Kepulauan Riau?", opsi: ["Melayu", "Asmat", "Sunda"], jawaban: "Melayu" },
    { id: "jambi", nama: "Jambi", suku: "Jambi", rumah: "Panggung Kajang Lako", pakaian: "Baju Kurung Tanggung", kuis: "Rumah adat Jambi yang ditopang oleh tiang-tiang kayu disebut?", opsi: ["Rumah Joglo", "Rumah Panggung", "Rumah Gadang"], jawaban: "Rumah Panggung" },
    { id: "sumsel", nama: "Sumatra Selatan", suku: "Palembang", rumah: "Rumah Limas", pakaian: "Aesan Gede", kuis: "Makanan khas Palembang yang terbuat dari ikan dan sagu adalah?", opsi: ["Rendang", "Pempek", "Gudeg"], jawaban: "Pempek" },
    { id: "babel", nama: "Bangka Belitung", suku: "Bangka", rumah: "Rumah Rakit", pakaian: "Paksian", kuis: "Bangka Belitung sangat terkenal dengan sumber daya alam apa?", opsi: ["Emas", "Timah", "Nikel"], jawaban: "Timah" },
    { id: "bengkulu", nama: "Bengkulu", suku: "Rejang", rumah: "Bubungan Lima", pakaian: "Bengkulu", kuis: "Bunga raksasa yang ditemukan di Bengkulu bernama?", opsi: ["Rafflesia Arnoldii", "Melati", "Mawar"], jawaban: "Rafflesia Arnoldii" },
    { id: "lampung", nama: "Lampung", suku: "Lampung", rumah: "Nuwo Sesat", pakaian: "Tulang Bawang", kuis: "Aksara tradisional warga Lampung disebut?", opsi: ["Aksara Jawa", "Aksara Kaganga", "Aksara Lontara"], jawaban: "Aksara Kaganga" },
    
    // Jawa
    { id: "banten", nama: "Banten", suku: "Baduy", rumah: "Suladah", pakaian: "Pangsi", kuis: "Suku di Banten yang sangat menjaga tradisi dan menolak teknologi modern adalah?", opsi: ["Suku Baduy", "Suku Tengger", "Suku Asmat"], jawaban: "Suku Baduy" },
    { id: "jakarta", nama: "DKI Jakarta", suku: "Betawi", rumah: "Rumah Kebaya", pakaian: "Abang None", kuis: "Kesenian boneka raksasa dari Betawi bernama?", opsi: ["Wayang", "Ondel-ondel", "Reog"], jawaban: "Ondel-ondel" },
    { id: "jabar", nama: "Jawa Barat", suku: "Sunda", rumah: "Kasepuhan", pakaian: "Kebaya Sunda", kuis: "Alat musik yang terbuat dari bambu khas Sunda adalah?", opsi: ["Gamelan", "Angklung", "Sasando"], jawaban: "Angklung" },
    { id: "jateng", nama: "Jawa Tengah", suku: "Jawa", rumah: "Rumah Joglo", pakaian: "Kebaya", kuis: "Wayang yang dimainkan oleh dalang dengan layar berupa bayangan disebut?", opsi: ["Wayang Golek", "Wayang Kulit", "Wayang Orang"], jawaban: "Wayang Kulit" },
    { id: "diy", nama: "DI Yogyakarta", suku: "Jawa", rumah: "Bangsal Kencono", pakaian: "Kesatrian", kuis: "Candi bercorak Buddha terbesar di dunia yang terletak dekat Yogyakarta adalah?", opsi: ["Candi Prambanan", "Candi Borobudur", "Candi Mendut"], jawaban: "Candi Borobudur" },
    { id: "jatim", nama: "Jawa Timur", suku: "Jawa/Madura", rumah: "Rumah Joglo", pakaian: "Pesa'an", kuis: "Kesenian Reog berasal dari daerah mana di Jawa Timur?", opsi: ["Surabaya", "Malang", "Ponorogo"], jawaban: "Ponorogo" },
    
    // Bali & Nusa Tenggara
    { id: "bali", nama: "Bali", suku: "Bali", rumah: "Gapura Candi Bentar", pakaian: "Payas Agung", kuis: "Tari yang dilakukan beramai-ramai oleh pria yang duduk melingkar sambil menyerukan 'cak' adalah?", opsi: ["Tari Pendet", "Tari Kecak", "Tari Legong"], jawaban: "Tari Kecak" },
    { id: "ntb", nama: "Nusa Tenggara Barat", suku: "Sasak", rumah: "Bale", pakaian: "Lombok", kuis: "Tradisi pertarungan menggunakan tongkat antar pemuda di NTB disebut?", opsi: ["Peresean", "Pencak Silat", "Tarung Derajat"], jawaban: "Peresean" },
    { id: "ntt", nama: "Nusa Tenggara Timur", suku: "Rote", rumah: "Musa Laki", pakaian: "Ti'i Langga", kuis: "Alat musik tradisional dari NTT yang dipetik bernama?", opsi: ["Kecapi", "Sasando", "Gitar"], jawaban: "Sasando" },
    
    // Kalimantan
    { id: "kalbar", nama: "Kalimantan Barat", suku: "Dayak", rumah: "Rumah Panjang", pakaian: "Perang", kuis: "Sungai terpanjang di Indonesia yang ada di Kalimantan Barat adalah?", opsi: ["Sungai Musi", "Sungai Kapuas", "Sungai Mahakam"], jawaban: "Sungai Kapuas" },
    { id: "kalteng", nama: "Kalimantan Tengah", suku: "Dayak Ngaju", rumah: "Rumah Betang", pakaian: "Upak Nyamu", kuis: "Burung khas dari pedalaman Kalimantan yang dianggap suci oleh suku Dayak adalah?", opsi: ["Burung Enggang", "Burung Cendrawasih", "Burung Merak"], jawaban: "Burung Enggang" },
    { id: "kalsel", nama: "Kalimantan Selatan", suku: "Banjar", rumah: "Rumah Bubungan Tinggi", pakaian: "Bagajah", kuis: "Pasar unik di Banjarmasin yang aktivitasnya dilakukan di atas perahu disebut?", opsi: ["Pasar Malam", "Pasar Terapung", "Pasar Apung"], jawaban: "Pasar Terapung" },
    { id: "kaltim", nama: "Kalimantan Timur", suku: "Kutai", rumah: "Rumah Lamin", pakaian: "Takwo", kuis: "Ibukota baru Indonesia (IKN) akan berlokasi di provinsi mana?", opsi: ["Kalimantan Timur", "Kalimantan Tengah", "Kalimantan Barat"], jawaban: "Kalimantan Timur" },
    { id: "kaltara", nama: "Kalimantan Utara", suku: "Tidung", rumah: "Rumah Baloy", pakaian: "Ta'a", kuis: "Kalimantan Utara berbatasan langsung dengan negara apa?", opsi: ["Filipina", "Malaysia", "Brunei"], jawaban: "Malaysia" },
    
    // Sulawesi
    { id: "sulut", nama: "Sulawesi Utara", suku: "Minahasa", rumah: "Rumah Pewaris", pakaian: "Laku Tepu", kuis: "Taman Nasional laut di Sulawesi Utara yang terkenal akan keindahan karangnya adalah?", opsi: ["Raja Ampat", "Bunaken", "Wakatobi"], jawaban: "Bunaken" },
    { id: "sulteng", nama: "Sulawesi Tengah", suku: "Kaili", rumah: "Tambi", pakaian: "Nggembe", kuis: "Logam purba yang sering digunakan membuat senjata di Sulteng bernama?", opsi: ["Besi", "Perunggu", "Emas"], jawaban: "Besi" },
    { id: "sulbar", nama: "Sulawesi Barat", suku: "Mandar", rumah: "Boyang", pakaian: "Lipa Saqbe", kuis: "Suku Mandar sangat dikenal sebagai bangsa pelaut yang menggunakan perahu khas bernama?", opsi: ["Pinisi", "Sandeq", "Jukung"], jawaban: "Sandeq" },
    { id: "sulsel", nama: "Sulawesi Selatan", suku: "Bugis/Makassar", rumah: "Tongkonan", pakaian: "Baju Bodo", kuis: "Perahu tradisional khas suku Bugis yang kokoh menyeberangi lautan adalah?", opsi: ["Perahu Kertas", "Perahu Pinisi", "Kapal Feri"], jawaban: "Perahu Pinisi" },
    { id: "sultra", nama: "Sulawesi Tenggara", suku: "Tolaki", rumah: "Banua Tada", pakaian: "Babu Nggawi", kuis: "Tari penyambutan tamu dari Sulawesi Tenggara adalah?", opsi: ["Tari Lulo", "Tari Saman", "Tari Piring"], jawaban: "Tari Lulo" },
    { id: "gorontalo", nama: "Gorontalo", suku: "Gorontalo", rumah: "Dulohupa", pakaian: "Biliu", kuis: "Gorontalo mendapat julukan sebagai kota?", opsi: ["Kota Pahlawan", "Serambi Madinah", "Kota Hujan"], jawaban: "Serambi Madinah" },
    
    // Maluku & Papua
    { id: "maluku", nama: "Maluku", suku: "Ambon", rumah: "Baileo", pakaian: "Cele", kuis: "Rempah-rempah yang dulu sangat diincar bangsa Eropa dari Maluku adalah?", opsi: ["Pala dan Cengkeh", "Garam", "Gula"], jawaban: "Pala dan Cengkeh" },
    { id: "malut", nama: "Maluku Utara", suku: "Ternate", rumah: "Baileo", pakaian: "Manteren Lamo", kuis: "Gunung Gamalama adalah ikon terkenal di pulau?", opsi: ["Halmahera", "Ternate", "Tidore"], jawaban: "Ternate" },
    { id: "papuabarat", nama: "Papua Barat", suku: "Dani", rumah: "Mod Aki Aksa", pakaian: "Ewer", kuis: "Kawasan gugusan pulau indah di Papua Barat yang menjadi surga penyelam adalah?", opsi: ["Raja Ampat", "Bunaken", "Bali"], jawaban: "Raja Ampat" },
    { id: "papua", nama: "Papua", suku: "Asmat/Dani", rumah: "Honai", pakaian: "Koteka", kuis: "Rumah tradisional Papua berbentuk melingkar dengan atap jerami dinamakan?", opsi: ["Honai", "Gadang", "Joglo"], jawaban: "Honai" }
];

// Data Modul khusus pertanyaan Roda Budaya (Roda tidak memuat 34, tapi perwakilan)
const wheelSegments = [
    { label: "Sunda", id: "jabar" },
    { label: "Minang", id: "sumbar" },
    { label: "Batak", id: "sumut" },
    { label: "Betawi", id: "jakarta" },
    { label: "Jawa", id: "jateng" },
    { label: "Bali", id: "bali" },
    { label: "Bugis", id: "sulsel" },
    { label: "Dayak", id: "kalbar" },
    { label: "Asmat", id: "papua" }
];
