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

export const locales: Record<Country, LocaleData> = {
  TR: {
    // Türkçe lokalizasyon verileri
  },
  AZ: {
    // Azerbaycan dili lokalizasyon verileri
  },
  RU: {
    // Rusça lokalizasyon verileri
  }
};

// Lokalizasyon verilerinin tamamını buraya ekleyin

