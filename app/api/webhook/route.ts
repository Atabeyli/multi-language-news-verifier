import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TelegramBotClient } from '@/@lib/telegram-bot'
import logger from '@/@lib/logger'
import { db } from '@/@lib/db'
import { enqueueAnalysis } from '@/@lib/queue'
import { extractTextFromImage } from '@/@lib/image-processor'
import { Country } from '@/@lib/localization'

console.log('Webhook route file loaded');
console.log('TELEGRAM_BOT_TOKEN is', process.env.TELEGRAM_BOT_TOKEN ? 'set' : 'not set');

interface TelegramMessage {
  chat: {
    id: number
  }
  text?: string
  photo?: Array<{ file_id: string }>
}

interface TelegramUpdate {
  message?: TelegramMessage
}

export async function POST(request: NextRequest) {
  try {
    logger.info('Webhook POST request received', { timestamp: new Date().toISOString() })
    
    const rawBody = await request.text()
    logger.info('Raw request body:', rawBody)
    
    const update: TelegramUpdate = JSON.parse(rawBody)
    logger.info('Parsed update:', { update })

    if (!update.message) {
      logger.warn('Invalid update format - no message field')
      return NextResponse.json({ ok: false, error: 'Invalid update format' })
    }

    const chatId = update.message.chat.id
    const text = update.message.text
    const photo = update.message.photo

    logger.info('Processing message:', { chatId, text, hasPhoto: !!photo })

    if (text === '/start') {
      logger.info('Processing /start command', { chatId })
      const welcomeMessage = `Haber Doğrulama Asistanı'na Hoş Geldiniz! 🔍
Lütfen dilinizi seçin / Please select your language:

/start_TR - Türkçe 🇹🇷
/start_AZ - Azərbaycanca 🇦🇿
/start_RU - Русский 🇷🇺`

      await TelegramBotClient.sendMessage(chatId, welcomeMessage)
      logger.info('Welcome message sent successfully', { chatId })
      return NextResponse.json({ ok: true })
    }

    if (text?.startsWith('/start_')) {
      const lang = text.split('_')[1] as Country
      logger.info('Language selection received', { chatId, lang })
      
      db.setUserCountry(chatId, lang)
      let message = ''
      switch (lang) {
        case 'TR':
          message = 'Merhaba! 👋 Türkçe seçildi. Lütfen analiz etmek istediğiniz haber metnini veya ekran görüntüsünü gönderin.'
          break
        case 'AZ':
          message = 'Salam! 👋 Azərbaycan dili seçildi. Zəhmət olmasa, təhlil etmək istədiyiniz xəbər mətnini və ya ekran görüntüsünü göndərin.'
          break
        case 'RU':
          message = 'Здравствуйте! 👋 Выбран русский язык. Пожалуйста, отправьте текст новости или скриншот, который вы хотите проанализировать.'
          break
        default:
          message = 'Invalid language selection. Please use /start to choose a language.'
      }
      await TelegramBotClient.sendMessage(chatId, message)
      logger.info('Language confirmation sent', { chatId, lang })
      return NextResponse.json({ ok: true })
    }

    // Handle regular messages or images
    const userCountry = db.getUserCountry(chatId)
    if (!userCountry) {
      logger.info('No language selected for user', { chatId })
      await TelegramBotClient.sendMessage(chatId, 'Please select a language first using /start')
      return NextResponse.json({ ok: true })
    }

    if (text) {
      logger.info('Processing text message', { chatId, textLength: text.length })
      await enqueueAnalysis(text, userCountry, chatId)
    } else if (photo) {
      logger.info('Processing photo message', { chatId })
      const fileId = photo[photo.length - 1]?.file_id
      if (!fileId) {
        logger.warn('No valid file_id in photo message', { chatId })
        await TelegramBotClient.sendMessage(chatId, 'Sorry, I couldn\'t process this image. Please try again.')
        return NextResponse.json({ ok: true })
      }
      
      const file = await TelegramBotClient.getFile(fileId)
      if (!file.file_path) {
        logger.warn('No file_path in getFile response', { chatId, fileId })
        await TelegramBotClient.sendMessage(chatId, 'Sorry, I couldn\'t process this image. Please try again.')
        return NextResponse.json({ ok: true })
      }
      
      const fileBuffer = await TelegramBotClient.downloadFile(file.file_path)
      const extractedText = await extractTextFromImage(fileBuffer)
      
      if (extractedText) {
        logger.info('Successfully extracted text from image', { chatId, textLength: extractedText.length })
        await enqueueAnalysis(extractedText, userCountry, chatId)
      } else {
        logger.warn('No text extracted from image', { chatId })
        await TelegramBotClient.sendMessage(chatId, 'Sorry, I couldn\'t extract any text from the image. Please try sending a clearer image or the text directly.')
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    logger.error('Unhandled error in webhook:', { error })
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  logger.info('GET request received on webhook endpoint', { timestamp: new Date().toISOString() })
  return NextResponse.json({ 
    status: 'Webhook endpoint is active',
    message: 'Webhook is running',
    timestamp: new Date().toISOString()
  })
}

