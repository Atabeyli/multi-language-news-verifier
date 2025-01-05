import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { LocaleData, Country } from './localization';
import { LRUCache } from 'lru-cache';

const analysisCache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 60, // 1 saat
});

export async function performNLPAnalysis(text: string, locale: LocaleData, country: Country) {
  const cacheKey = `${country}:${text}`;
  const cachedResult = analysisCache.get(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  const prompt = `
Analyze the following news text in ${locale.name} for credibility:

"${text}"

Consider the following factors:
1. Use of credible sources
2. Presence of factual information
3. Emotional language or bias
4. Consistency with known facts
5. Use of expert opinions
6. Presence of verifiable claims

Provide a JSON response with the following structure:
{
  "credibilityScore": number between 0 and 100,
  "analysisResults": {
    "credibleSources": boolean,
    "factualInformation": boolean,
    "emotionalLanguage": boolean,
    "consistencyWithFacts": boolean,
    "expertOpinions": boolean,
    "verifiableClaims": boolean
  },
  "explanation": string explaining the analysis,
  "suggestedActions": array of strings with recommended actions
}
`;

  const { text: analysisResult } = await generateText({
    model: openai('gpt-4-turbo'),
    prompt: prompt,
    temperature: 0.2,
    maxTokens: 500,
  });

  analysisCache.set(cacheKey, analysisResult);
  return analysisResult;
}

