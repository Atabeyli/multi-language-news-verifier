import { LocaleData, locales, Country } from './localization';
import { performNLPAnalysis } from './nlp-model';

export interface AnalysisResult {
  score: number;
  credibilityLevel: 'low' | 'medium' | 'high';
  explanation: string;
  tips: string[];
  detailedAnalysis: {
    credibleSources: boolean;
    factualInformation: boolean;
    emotionalLanguage: boolean;
    consistencyWithFacts: boolean;
    expertOpinions: boolean;
    verifiableClaims: boolean;
  };
}

function performBasicAnalysis(text: string, locale: LocaleData) {
  const keywords = locale.keywords;
  const trustworthySources = locale.trustworthySources;

  const suspiciousCount = keywords.suspicious.filter(word =>
    text.toLowerCase().includes(word)
  ).length;

  const credibleCount = keywords.credible.filter(word =>
    text.toLowerCase().includes(word)
  ).length;

  const hasTrustworthySource = trustworthySources.some(source =>
    text.toLowerCase().includes(source)
  );

  return { suspiciousCount, credibleCount, hasTrustworthySource };
}

function combineAnalysisResults(basicAnalysis: {suspiciousCount: number, credibleCount: number, hasTrustworthySource: boolean}, nlpAnalysis: any, locale: LocaleData): AnalysisResult {
  let score = (nlpAnalysis.credibilityScore + (basicAnalysis.credibleCount - basicAnalysis.suspiciousCount + 5) * 10) / 2;
  if (basicAnalysis.hasTrustworthySource) score = Math.min(100, score + 10);

  score = Math.max(0, Math.min(100, score));

  let credibilityLevel: 'low' | 'medium' | 'high';
  let explanation: string;
  let tips: string[];

  if (score < 40) {
    credibilityLevel = 'low';
    explanation = '⚠️ ' + locale.analysisTitles.result;
    tips = [
      locale.tips.checkSources,
      locale.tips.lookForOfficial,
      locale.tips.compareMultiple
    ];
  } else if (score < 70) {
    credibilityLevel = 'medium';
    explanation = '❓ ' + locale.analysisTitles.result;
    tips = [
      locale.tips.additionalResearch,
      locale.tips.waitForConfirmation,
      locale.tips.checkMultipleSources
    ];
  } else {
    credibilityLevel = 'high';
    explanation = '✅ ' + locale.analysisTitles.result;
    tips = [
      locale.tips.crossCheck,
      locale.tips.stayUpdated,
      locale.tips.verifyOfficial
    ];
  }

  return {
    score,
    credibilityLevel,
    explanation,
    tips,
    detailedAnalysis: nlpAnalysis.analysisResults
  };
}

export async function analyzeNews(text: string, country: Country): Promise<AnalysisResult> {
  const locale = locales[country];
  const basicAnalysis = performBasicAnalysis(text, locale);
  const nlpAnalysis = await performNLPAnalysis(text, locale, country);
  return combineAnalysisResults(basicAnalysis, nlpAnalysis, locale);
}

