export type Country = 'TR' | 'AZ' | 'RU';

export interface LocaleData {
  name: string;
  welcomeMessage: string;
  analysisTitles: {
    result: string;
    credibilityScore: string;
    evaluation: string;
    suggestions: string;
    reminder: string;
    detailedAnalysis: string;
  };
  credibilityLevels: {
    low: string;
    medium: string;
    high: string;
  };
  keywords: {
    suspicious: string[];
    credible: string[];
  };
  trustworthySources: string[];
  tips: {
    checkSources: string;
    lookForOfficial: string;
    compareMultiple: string;
    additionalResearch: string;
    waitForConfirmation: string;
    checkMultipleSources: string;
    crossCheck: string;
    stayUpdated: string;
    verifyOfficial: string;
  };
  analysisFactors: {
    credibleSources: string;
    factualInformation: string;
    emotionalLanguage: string;
    consistencyWithFacts: string;
    expertOpinions: string;
    verifiableClaims: string;
  };
}

const trLocale: LocaleData = {
  name: "Türkçe",
  welcomeMessage: "Hoş geldiniz",
  analysisTitles: {
    result: "Sonuç",
    credibilityScore: "Güvenilirlik Puanı",
    evaluation: "Değerlendirme",
    suggestions: "Öneriler",
    reminder: "Hatırlatma",
    detailedAnalysis: "Detaylı Analiz"
  },
  credibilityLevels: {
    low: "Düşük",
    medium: "Orta",
    high: "Yüksek"
  },
  keywords: {
    suspicious: ["şüpheli", "doğrulanmamış", "iddia", "söylenti", "rivayet"],
    credible: ["resmi", "doğrulanmış", "kanıtlanmış", "belgelenmiş", "teyit edilmiş"]
  },
  trustworthySources: ["resmi.gov.tr", "aa.com.tr", "teyit.org", "who.int"],
  tips: {
    checkSources: "Kaynakları kontrol edin",
    lookForOfficial: "Resmi açıklamaları arayın",
    compareMultiple: "Birden fazla kaynağı karşılaştırın",
    additionalResearch: "Ek araştırma yapın",
    waitForConfirmation: "Resmi doğrulama bekleyin",
    checkMultipleSources: "Birden fazla kaynağı inceleyin",
    crossCheck: "Çapraz kontrol yapın",
    stayUpdated: "Güncel kalın",
    verifyOfficial: "Resmi kaynaklardan doğrulayın"
  },
  analysisFactors: {
    credibleSources: "Güvenilir Kaynaklar",
    factualInformation: "Faktüel Bilgiler",
    emotionalLanguage: "Duygusal Dil Kullanımı",
    consistencyWithFacts: "Gerçeklerle Tutarlılık",
    expertOpinions: "Uzman Görüşleri",
    verifiableClaims: "Doğrulanabilir İddialar"
  }
};

const azLocale: LocaleData = {
  name: "Azərbaycan",
  welcomeMessage: "Xoş gəlmisiniz",
  analysisTitles: {
    result: "Nəticə",
    credibilityScore: "Etibarlılıq Balı",
    evaluation: "Qiymətləndirmə",
    suggestions: "Təkliflər",
    reminder: "Xatırlatma",
    detailedAnalysis: "Ətraflı Təhlil"
  },
  credibilityLevels: {
    low: "Aşağı",
    medium: "Orta",
    high: "Yüksək"
  },
  keywords: {
    suspicious: ["şübhəli", "təsdiqlənməmiş", "iddia", "şayiə", "deyilən"],
    credible: ["rəsmi", "təsdiqlənmiş", "sübut edilmiş", "sənədləşdirilmiş", "təsdiq edilmiş"]
  },
  trustworthySources: ["president.az", "azertag.az", "who.int", "fact.az"],
  tips: {
    checkSources: "Mənbələri yoxlayın",
    lookForOfficial: "Rəsmi açıqlamaları axtarın",
    compareMultiple: "Bir neçə mənbəni müqayisə edin",
    additionalResearch: "Əlavə araşdırma aparın",
    waitForConfirmation: "Rəsmi təsdiq gözləyin",
    checkMultipleSources: "Bir neçə mənbəni yoxlayın",
    crossCheck: "Çarpaz yoxlama aparın",
    stayUpdated: "Məlumatlı olun",
    verifyOfficial: "Rəsmi mənbələrdən təsdiqləyin"
  },
  analysisFactors: {
    credibleSources: "Etibarlı Mənbələr",
    factualInformation: "Faktiki Məlumat",
    emotionalLanguage: "Emosional Dil İstifadəsi",
    consistencyWithFacts: "Faktlarla Uyğunluq",
    expertOpinions: "Ekspert Rəyləri",
    verifiableClaims: "Yoxlanıla Bilən İddialar"
  }
};

const ruLocale: LocaleData = {
  name: "Русский",
  welcomeMessage: "Добро пожаловать",
  analysisTitles: {
    result: "Результат",
    credibilityScore: "Оценка достоверности",
    evaluation: "Оценка",
    suggestions: "Предложения",
    reminder: "Напоминание",
    detailedAnalysis: "Подробный анализ"
  },
  credibilityLevels: {
    low: "Низкий",
    medium: "Средний",
    high: "Высокий"
  },
  keywords: {
    suspicious: ["подозрительный", "неподтвержденный", "утверждение", "слух", "молва"],
    credible: ["официальный", "подтвержденный", "доказанный", "документированный", "верифицированный"]
  },
  trustworthySources: ["kremlin.ru", "tass.ru", "who.int", "ria.ru"],
  tips: {
    checkSources: "Проверяйте источники",
    lookForOfficial: "Ищите официальные заявления",
    compareMultiple: "Сравнивайте несколько источников",
    additionalResearch: "Проведите дополнительное исследование",
    waitForConfirmation: "Ждите официального подтверждения",
    checkMultipleSources: "Проверяйте несколько источников",
    crossCheck: "Делайте перекрестную проверку",
    stayUpdated: "Оставайтесь в курсе",
    verifyOfficial: "Проверяйте через официальные источники"
  },
  analysisFactors: {
    credibleSources: "Надежные источники",
    factualInformation: "Фактическая информация",
    emotionalLanguage: "Использование эмоционального языка",
    consistencyWithFacts: "Соответствие фактам",
    expertOpinions: "Мнения экспертов",
    verifiableClaims: "Проверяемые утверждения"
  }
};

export const locales: Record<Country, LocaleData> = {
  TR: trLocale,
  AZ: azLocale,
  RU: ruLocale
};