// Kumpulan ayat Al-Qur'an yang dipilih berdasarkan suasana hati.
// Setiap entri: { arab, latin, terjemah, surah, ayat, refleksi }

export const MOODS = [
  { id: 'happy',    emoji: '😄', label: 'Bahagia',   color: 'lemon' },
  { id: 'grateful', emoji: '🤍', label: 'Bersyukur', color: 'mint' },
  { id: 'sad',      emoji: '😔', label: 'Sedih',     color: 'sky' },
  { id: 'anxious',  emoji: '😟', label: 'Cemas',     color: 'lilac' },
  { id: 'tired',    emoji: '😴', label: 'Lelah',     color: 'sky' },
  { id: 'angry',    emoji: '😤', label: 'Marah',     color: 'rose' },
  { id: 'hopeful',  emoji: '✨', label: 'Penuh harap', color: 'lemon' },
  { id: 'lonely',   emoji: '🌙', label: 'Sendirian', color: 'lilac' },
]

export const QURAN_BY_MOOD = {
  happy: [
    {
      arab: 'قُلْ بِفَضْلِ اللَّهِ وَبِرَحْمَتِهِ فَبِذَٰلِكَ فَلْيَفْرَحُوا',
      latin: 'Qul bi fadhlillahi wa bi rahmatihi fa bi dzalika falyafrahu',
      terjemah: 'Katakanlah: "Dengan karunia Allah dan rahmat-Nya, hendaklah dengan itu mereka bergembira."',
      surah: 'Yunus', ayat: 58,
      refleksi: 'Bahagiamu hari ini adalah karunia. Nikmati sambil mensyukuri pemberinya.',
    },
    {
      arab: 'وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ',
      latin: 'Wa amma bini\'mati rabbika fa haddits',
      terjemah: 'Dan terhadap nikmat Tuhanmu, hendaklah engkau menceritakannya (dengan bersyukur).',
      surah: 'Adh-Dhuha', ayat: 11,
      refleksi: 'Ceritakan kebahagiaanmu — bukan untuk pamer, tapi sebagai bentuk syukur.',
    },
  ],
  grateful: [
    {
      arab: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
      latin: 'La in syakartum la-azidannakum',
      terjemah: 'Sesungguhnya jika kamu bersyukur, pasti Aku akan menambah (nikmat) kepadamu.',
      surah: 'Ibrahim', ayat: 7,
      refleksi: 'Syukur adalah pintu yang membuka pintu-pintu lain.',
    },
    {
      arab: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
      latin: 'Fadzkuruni adzkurkum wasykuru li wa la takfurun',
      terjemah: 'Maka ingatlah kepada-Ku, niscaya Aku ingat (pula) kepadamu, dan bersyukurlah kepada-Ku, dan janganlah kamu mengingkari (nikmat)-Ku.',
      surah: 'Al-Baqarah', ayat: 152,
      refleksi: 'Mengingat-Nya adalah cara paling lembut untuk merasa diingat.',
    },
  ],
  sad: [
    {
      arab: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ',
      latin: 'Wa la tahinu wa la tahzanu wa antumul a\'launa in kuntum mu\'minin',
      terjemah: 'Janganlah kamu (merasa) lemah dan jangan (pula) bersedih hati, sebab kamu paling tinggi (derajatnya) jika kamu orang beriman.',
      surah: 'Ali Imran', ayat: 139,
      refleksi: 'Sedihmu valid, tapi imanmu lebih tinggi dari kesedihan itu.',
    },
    {
      arab: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
      latin: 'Inna ma\'al \'usri yusra',
      terjemah: 'Sesungguhnya bersama kesulitan ada kemudahan.',
      surah: 'Al-Insyirah', ayat: 6,
      refleksi: 'Bukan setelah, tapi BERSAMA. Kemudahan itu sudah jalan, hanya belum kelihatan.',
    },
    {
      arab: 'لَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ',
      latin: 'La tay\'asu min rauhillah',
      terjemah: 'Janganlah kamu berputus asa dari rahmat Allah.',
      surah: 'Yusuf', ayat: 87,
      refleksi: 'Selama nafas masih berhembus, harapan itu belum habis.',
    },
  ],
  anxious: [
    {
      arab: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
      latin: 'Ala bi dzikrillahi tathma\'innul qulub',
      terjemah: 'Ingatlah, hanya dengan mengingat Allah hati menjadi tenang.',
      surah: 'Ar-Ra\'d', ayat: 28,
      refleksi: 'Tarik napas. Sebut nama-Nya pelan-pelan. Tenangmu sedang dalam perjalanan.',
    },
    {
      arab: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
      latin: 'Hasbunallahu wa ni\'mal wakil',
      terjemah: 'Cukuplah Allah (menjadi penolong) bagi kami dan Dia sebaik-baik pelindung.',
      surah: 'Ali Imran', ayat: 173,
      refleksi: 'Kamu tidak perlu memikul semuanya sendiri.',
    },
    {
      arab: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
      latin: 'La yukallifullahu nafsan illa wus\'aha',
      terjemah: 'Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.',
      surah: 'Al-Baqarah', ayat: 286,
      refleksi: 'Yang sedang kamu hadapi memang berat — tapi tidak melampaui kemampuanmu.',
    },
  ],
  tired: [
    {
      arab: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا',
      latin: 'Fa inna ma\'al \'usri yusra, inna ma\'al \'usri yusra',
      terjemah: 'Maka sesungguhnya bersama kesulitan ada kemudahan, sesungguhnya bersama kesulitan ada kemudahan.',
      surah: 'Al-Insyirah', ayat: '5-6',
      refleksi: 'Allah sebut dua kali. Lelahmu didengar. Istirahatlah dulu.',
    },
    {
      arab: 'وَجَعَلْنَا نَوْمَكُمْ سُبَاتًا',
      latin: 'Wa ja\'alna naumakum subata',
      terjemah: 'Dan Kami jadikan tidurmu untuk istirahat.',
      surah: 'An-Naba', ayat: 9,
      refleksi: 'Tidur bukan kelemahan — itu pemberian-Nya. Tidurlah dengan tenang.',
    },
  ],
  angry: [
    {
      arab: 'وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ ۗ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ',
      latin: 'Wal kazhiminal ghaizha wal \'afina \'aninnas, wallahu yuhibbul muhsinin',
      terjemah: 'Dan orang-orang yang menahan amarahnya dan memaafkan (kesalahan) orang lain. Allah menyukai orang yang berbuat kebaikan.',
      surah: 'Ali Imran', ayat: 134,
      refleksi: 'Menahan marah hari ini adalah kemenangan kecil yang dilihat-Nya.',
    },
    {
      arab: 'ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ',
      latin: 'Idfa\' billati hiya ahsan',
      terjemah: 'Tolaklah (kejahatan itu) dengan cara yang lebih baik.',
      surah: 'Fussilat', ayat: 34,
      refleksi: 'Balas dengan yang lebih baik — bukan untuk mereka, tapi untuk hatimu sendiri.',
    },
  ],
  hopeful: [
    {
      arab: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ',
      latin: 'Wa man yatawakkal \'alallahi fa huwa hasbuh, innallaha balighu amrih',
      terjemah: 'Dan barangsiapa bertawakal kepada Allah, niscaya Allah akan mencukupkan (keperluan)nya. Sesungguhnya Allah pasti melaksanakan urusan-Nya.',
      surah: 'Ath-Thalaq', ayat: 3,
      refleksi: 'Harapanmu didengar. Tugasmu hanya berusaha & berserah.',
    },
    {
      arab: 'وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ',
      latin: 'Wa \'asa an takrahu syai\'an wa huwa khairul lakum',
      terjemah: 'Boleh jadi kamu membenci sesuatu, padahal itu baik bagimu.',
      surah: 'Al-Baqarah', ayat: 216,
      refleksi: 'Yang belum sesuai harapanmu, mungkin sedang menyiapkan yang lebih baik.',
    },
  ],
  lonely: [
    {
      arab: 'وَنَحْنُ أَقْرَبُ إِلَيْهِ مِنْ حَبْلِ الْوَرِيدِ',
      latin: 'Wa nahnu aqrabu ilaihi min hablil warid',
      terjemah: 'Dan Kami lebih dekat kepadanya daripada urat lehernya sendiri.',
      surah: 'Qaf', ayat: 16,
      refleksi: 'Sekalipun semua orang menjauh, Dia tidak pernah pergi.',
    },
    {
      arab: 'إِنَّ اللَّهَ مَعَنَا',
      latin: 'Innallaha ma\'ana',
      terjemah: 'Sesungguhnya Allah bersama kita.',
      surah: 'At-Taubah', ayat: 40,
      refleksi: 'Sendiri tidak sama dengan sepi. Ada Yang selalu menemani.',
    },
  ],
}

export function getQuoteForMood(moodId, seed = Date.now()) {
  const list = QURAN_BY_MOOD[moodId] || QURAN_BY_MOOD.hopeful
  const idx = Math.abs(Math.floor(seed / 1000)) % list.length
  return list[idx]
}
