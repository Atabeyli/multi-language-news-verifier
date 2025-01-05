import { analyzeNews } from './news-analyzer';
import { TelegramBotClient } from './telegram-bot';
import { locales, Country } from './localization';
import logger from './logger';

export async function enqueueAnalysis(text: string, country: Country, chatId: number) {
  try {
    const analysis = await analyzeNews(text, country);
    const locale = locales[country];
    
    const responseMessage = `
📊 ${locale.analysisTitles.result}

${analysis.explanation}

${locale.analysisTitles.credibilityScore}: ${analysis.score}/100

🔍 ${locale.analysisTitles.evaluation}: ${locale.credibilityLevels[analysis.credibilityLevel]}

💡 ${locale.analysisTitles.suggestions}:
${analysis.tips.map(tip => `• ${tip}`).join('\n')}

📋 ${locale.analysisTitles.detailedAnalysis}:
${Object.entries(analysis.detailedAnalysis).map(([key, value]) => 
  `• ${locale.analysisFactors[key as keyof typeof locale.analysisFactors]}: ${value ? '✅' : '❌'}`
).join('\n')}

🔔 ${locale.analysisTitles.reminder}
    `;

    await TelegramBotClient.sendMessage(chatId, responseMessage);
  } catch (error) {
    logger.error('Analysis error:', error);
    await TelegramBotClient.sendMessage(chatId, "Sorry, an error occurred while analyzing the content. Please try again later.");
  }
}

