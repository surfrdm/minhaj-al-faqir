export type BayanLocale = "ar" | "en";

export interface TranslationDictionary {
  brandName: string;
  brandTagline: string;
  nav: {
    home: string;
    daily: string;
    prayer: string;
    quran: string;
    hadith: string;
    bukhari: string;
    shifa: string;
    arbaeen: string;
  };
  dailySection: {
    title: string;
    subtitle: string;
    morningHizb: string;
    eveningHizb: string;
    todayOrder: string;
    readHizb: string;
    matlaaLabel: string;
    surahsLabel: string;
  };
  prayerSection: {
    title: string;
    subtitle: string;
    selectCity: string;
    qiblaDirection: string;
    nextPrayerLabel: string;
    inLabel: string;
    degreesFromNorth: string;
    compassFaceQibla: string;
    prayers: {
      fajr: string;
      shuruk: string;
      dhuhr: string;
      asr: string;
      maghrib: string;
      isha: string;
    };
  };
  quranSection: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allAhzab: string;
    hizbPrefix: string;
    pageRange: string;
    openReader: string;
    moroccanWarshAudio: string;
    noResults: string;
    versesCount: string;
  };
  hadithSection: {
    title: string;
    subtitle: string;
    tabs: {
      bukhari: string;
      shifa: string;
      arbaeen: string;
    };
    bukhari: {
      title: string;
      subtitle: string;
      searchPlaceholder: string;
      bookPrefix: string;
      hadithsCount: string;
      openBook: string;
    };
    shifa: {
      title: string;
      subtitle: string;
      author: string;
      partsCount: string;
      chaptersCount: string;
      viewChapter: string;
    };
    arbaeen: {
      title: string;
      subtitle: string;
      searchPlaceholder: string;
      hadithPrefix: string;
      narratorLabel: string;
      sourceLabel: string;
      viewFullHadith: string;
    };
  };
  footer: {
    rights: string;
    description: string;
  };
}

export const DICTIONARY: Record<BayanLocale, TranslationDictionary> = {
  ar: {
    brandName: "بَيَان",
    brandTagline: "المنصة الرقمية للقرآن الكريم والحديث الشريف ومواقيت الصلاة",
    nav: {
      home: "الرئيسية",
      daily: "حزب اليوم",
      prayer: "الصلاة والقبلة",
      quran: "المصحف الشريف",
      hadith: "مكتبة الحديث",
      bukhari: "صحيح البخاري",
      shifa: "كتاب الشفا",
      arbaeen: "الأربعون النووية",
    },
    dailySection: {
      title: "وِرْدُ اليَوْمِ وَاللَّيْلَةِ",
      subtitle: "الحزبان اليوميان وفق الترتيب الشهري المعتمد (حزبان لكل يوم)",
      morningHizb: "حِزْبُ الصَّبَاحِ",
      eveningHizb: "حِزْبُ المَسَاءِ",
      todayOrder: "اليوم من الشهر",
      readHizb: "فتح الحزب في المصحف",
      matlaaLabel: "المطلع",
      surahsLabel: "السور",
    },
    prayerSection: {
      title: "مَوَاقِيتُ الصَّلَاةِ وَالقِبْلَةُ",
      subtitle: "حساب فلكي دقيق مع بوصلة القبلة التفاعلية باتجاه الكعبة المشرفة",
      selectCity: "اختر المدينة",
      qiblaDirection: "اتجاه القبلة",
      nextPrayerLabel: "الصلاة القادمة",
      inLabel: "بقي عليها",
      degreesFromNorth: "درجة من الشمال الحقيقي",
      compassFaceQibla: "المؤشر الذهبي يتجه مباشرة نحو مكة المكرمة",
      prayers: {
        fajr: "الفجر",
        shuruk: "الشروق",
        dhuhr: "الظهر",
        asr: "العصر",
        maghrib: "المغرب",
        isha: "العشاء",
      },
    },
    quranSection: {
      title: "القُرْآنُ الكَرِيمُ كَامِلاً",
      subtitle: "ستون حزباً بالرسم المغربي والمحمدي الأصيل، مع التلاوات والتفاسير المعتمدة",
      searchPlaceholder: "ابحث برقم الحزب (1-60) أو اسم السورة أو الصفحة...",
      allAhzab: "جميع الأحزاب (60)",
      hizbPrefix: "الحزب",
      pageRange: "الصفحات",
      openReader: "تلاوة وقراءة الحزب",
      moroccanWarshAudio: "تلاوات مغربية برواية ورش • بدون ذكاء اصطناعي",
      noResults: "لم يُعثر على حزب أو سورة مطابقة للبحث",
      versesCount: "آية",
    },
    hadithSection: {
      title: "مَكْتَبَةُ الحَدِيثِ الشَّرِيفِ وَالسُّنَّةِ",
      subtitle: "أمهات المصادر النبوية الشريفة: صحيح البخاري، الشفا للقاضي عياض، والأربعون النووية",
      tabs: {
        bukhari: "صحيح البخاري (97 كتاباً)",
        shifa: "الشفا للقاضي عياض (كاملاً)",
        arbaeen: "الأربعون النووية (42 حديثاً)",
      },
      bukhari: {
        title: "الجَامِعُ المُسْنَدُ الصَّحِيحُ (البُخَارِيُّ)",
        subtitle: "أصح كتاب بعد كتاب الله عز وجل، مرتباً على 97 كتاباً فقهياً وحديثياً",
        searchPlaceholder: "ابحث في عناوين كتب البخاري (الإيمان، العلم، الصلاة، التوحيد...)",
        bookPrefix: "الكتاب",
        hadithsCount: "حديثاً",
        openBook: "تصفح أبواب الكتاب",
      },
      shifa: {
        title: "الشِّفَا بِتَعْرِيفِ حُقُوقِ المُصْطَفَى ﷺ",
        subtitle: "للإمام القاضي عياض السبتي المالكي — السفر الخالد في محبة النبي ﷺ وخصائصه وأحكامه",
        author: "القاضي عياض السبتي (ت 544 هـ)",
        partsCount: "4 أقسام رئيسية",
        chaptersCount: "13 باباً مفصلاً",
        viewChapter: "عرض الفصول والمطالب",
      },
      arbaeen: {
        title: "الأَرْبَعُونَ النَّوَوِيَّةُ فِي الأَحَادِيثِ الصَّحِيحَةِ",
        subtitle: "للإمام محيي الدين يحيى بن شرف النووي — جوامع الكلم وقواعد الإسلام الكبرى",
        searchPlaceholder: "ابحث بموضوع الحديث أو الراوي أو النص (النية، الإحسان، الحلال...)",
        hadithPrefix: "الحديث",
        narratorLabel: "الراوي",
        sourceLabel: "المخرج",
        viewFullHadith: "قراءة نص الحديث وشرحه",
      },
    },
    footer: {
      rights: "جميع الحقوق محفوظة للمنصة",
      description: "منصة بَيَان — وقف رقمي مخصص لنشر القرآن الكريم والحديث النبوي الشريف ومواقيت الصلاة.",
    },
  },
  en: {
    brandName: "BAYAN",
    brandTagline: "Digital Platform for the Holy Quran, Prophetic Hadith & Prayer Times",
    nav: {
      home: "Home",
      daily: "Daily Hizb",
      prayer: "Prayer & Qibla",
      quran: "The Holy Quran",
      hadith: "Hadith Library",
      bukhari: "Sahih Al-Bukhari",
      shifa: "Kitab Ash-Shifa",
      arbaeen: "An-Nawawi's 40",
    },
    dailySection: {
      title: "DAILY PORTION (DAY & NIGHT)",
      subtitle: "The two daily ahzab according to the traditional 30-day lunar cycle (2 ahzab per day)",
      morningHizb: "MORNING HIZB",
      eveningHizb: "EVENING HIZB",
      todayOrder: "Day of Month",
      readHizb: "Read in Mushaf",
      matlaaLabel: "Opening Verse",
      surahsLabel: "Surahs",
    },
    prayerSection: {
      title: "PRAYER TIMES & QIBLA COMPASS",
      subtitle: "High-precision astronomical calculations with interactive Qibla heading toward Makkah",
      selectCity: "Select City",
      qiblaDirection: "Qibla Direction",
      nextPrayerLabel: "Next Prayer",
      inLabel: "in",
      degreesFromNorth: "degrees from True North",
      compassFaceQibla: "The golden pointer aligns directly toward Makkah Al-Mukarramah",
      prayers: {
        fajr: "Fajr",
        shuruk: "Sunrise",
        dhuhr: "Dhuhr",
        asr: "Asr",
        maghrib: "Maghrib",
        isha: "Isha",
      },
    },
    quranSection: {
      title: "THE COMPLETE HOLY QURAN",
      subtitle: "All 60 Ahzab in authentic Maghribi and Mohammadi scripts, with recitations and classical commentaries",
      searchPlaceholder: "Search by Hizb number (1-60), Surah name, or page...",
      allAhzab: "All Ahzab (60)",
      hizbPrefix: "Hizb",
      pageRange: "Pages",
      openReader: "Recite & Read Hizb",
      moroccanWarshAudio: "Moroccan Warsh Recitations • Pure Human Voice (No AI)",
      noResults: "No matching Hizb or Surah found",
      versesCount: "verses",
    },
    hadithSection: {
      title: "PROPHETIC HADITH & SUNNAH REPOSITORY",
      subtitle: "Masterworks of the Sunnah: Sahih Al-Bukhari, Kitab Ash-Shifa by Qadi Ayyad, and An-Nawawi's Forty Hadiths",
      tabs: {
        bukhari: "Sahih Al-Bukhari (97 Books)",
        shifa: "Kitab Ash-Shifa (Complete)",
        arbaeen: "An-Nawawi's 40 (42 Hadiths)",
      },
      bukhari: {
        title: "AL-JAMI' AS-SAHIH (BUKHARI)",
        subtitle: "The most authentic book after the Quran, organized into 97 thematic and legal books",
        searchPlaceholder: "Search book titles (Faith, Knowledge, Prayer, Monotheism...)",
        bookPrefix: "Book",
        hadithsCount: "hadiths",
        openBook: "Explore Chapters",
      },
      shifa: {
        title: "ASH-SHIFA BI TA'RIF HUQUQ AL-MUSTAFA ﷺ",
        subtitle: "By Imam Qadi Ayyad al-Yahsubi — The immortal masterpiece on devotion, attributes, and rights of the Prophet ﷺ",
        author: "Qadi Ayyad of Ceuta (d. 544 AH)",
        partsCount: "4 Major Sections",
        chaptersCount: "13 Detailed Chapters",
        viewChapter: "Read Chapters & Sections",
      },
      arbaeen: {
        title: "AL-ARBA'IN AN-NAWAWIYYA (THE FORTY HADITHS)",
        subtitle: "By Imam Yahya ibn Sharaf an-Nawawi — Foundational traditions encompassing core Islamic guidance",
        searchPlaceholder: "Search by topic, narrator, or keyword (Intention, Ihsan, Halal...)",
        hadithPrefix: "Hadith",
        narratorLabel: "Narrator",
        sourceLabel: "Reference",
        viewFullHadith: "Read Full Hadith & Translation",
      },
    },
    footer: {
      rights: "All rights reserved",
      description: "BAYAN Platform — Dedicated digital endowment for the Holy Quran, Prophetic Hadith, and Prayer Times.",
    },
  },
};
