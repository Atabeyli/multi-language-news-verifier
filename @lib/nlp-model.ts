import OpenAI from 'openai'
import { LocaleData, Country } from './localization'
import { LRUCache } from 'lru-cache'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const analysisCache = new LRUCache<string, any>({
  max: 100,
  ttl: 1000 * 60 * 60, // 1 saat
})

export async function performNLPAnalysis(text: string, locale: LocaleData, country: Country) {
  const cacheKey = `${country}:${text}`
  const cachedResult = analysisCache.get(cacheKey)
  if (cachedResult) {
    return cachedResult
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
`

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_tokens: 500,
  })

  const analysisResult = response.choices[0].message.content

  if (analysisResult) {
    analysisCache.set(cacheKey, analysisResult)
  }

  return analysisResult
}