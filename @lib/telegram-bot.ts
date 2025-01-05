import TelegramBotApi from 'node-telegram-bot-api';
import logger from './logger';

// Define a type alias for the TelegramBot instance
type TelegramBotInstance = InstanceType<typeof TelegramBotApi>;

export class TelegramBotClient {
  private static instance: TelegramBotInstance | null = null;

  static getInstance(): TelegramBotInstance {
    if (!this.instance) {
      const token = process.env.TELEGRAM_BOT_TOKEN;
      if (!token) {
        throw new Error('TELEGRAM_BOT_TOKEN is not configured');
      }
      this.instance = new TelegramBotApi(token, { polling: false });
      logger.info('Telegram bot instance created');
    }
    return this.instance;
  }

  static async sendMessage(chatId: number, text: string): Promise<TelegramBotApi.Message> {
    const bot = this.getInstance();
    return bot.sendMessage(chatId, text, { parse_mode: 'HTML' });
  }

  static async setWebhook(url: string): Promise<boolean> {
    const bot = this.getInstance();
    return bot.setWebHook(url);
  }

  static async getFile(fileId: string): Promise<TelegramBotApi.File> {
    const bot = this.getInstance();
    return bot.getFile(fileId);
  }

  static async downloadFile(filePath: string): Promise<Buffer> {
    const bot = this.getInstance();
    const downloadedFile = await bot.downloadFile(filePath, './tmp');
    return Buffer.from(downloadedFile);
  }
}
