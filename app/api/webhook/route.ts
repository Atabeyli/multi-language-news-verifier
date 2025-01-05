import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TelegramBotClient } from '@lib/telegram-bot'
import logger from '@lib/logger'
import { db } from '@lib/db'
import { enqueueAnalysis } from '@lib/queue'
import { extractTextFromImage } from '@lib/image-processor'
import { Country } from '@lib/localization'

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
    logger.info('Received webhook request')
    
    const update: TelegramUpdate = await request.json()
    logger.info('Update:', JSON.stringify(update, null, 2))

    if (!update.message) {
      logger.info('Invalid update format')
      return NextResponse.json({ ok: false, error: 'Invalid update format' })
    }

    const chatId = update.message.chat.id
    const text = update.message.text
    const photo = update.message.photo

    logger.info(`Received message: "${text}" from chat ID: ${chatId}`)

    if (text === '/start') {
      logger.info('Received /start command')
      try {
        const welcomeMessage = `Welcome to News Checker! 🔍
Please select your language:

/start_TR - Türkçe 🇹🇷
/start_AZ - Azərbaycanca 🇦🇿
/start_RU - Русский 🇷🇺`

        logger.info('Sending welcome message', { chatId })
        await TelegramBotClient.sendMessage(chatId, welcomeMessage)
        logger.info('Welcome message sent successfully')
      } catch (error) {
        logger.error('Error sending welcome message:', error)
        throw error
      }
      return NextResponse.json({ ok: true })
    }

    if (text?.startsWith('/start_')) {
      const lang = text.split('_')[1] as Country
      logger.info(`Language selected: ${lang}`)
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
      try {
        await TelegramBotClient.sendMessage(chatId, message)
        logger.info('Language confirmation sent successfully')
      } catch (error) {
        logger.error('Error sending language confirmation:', error)
        throw error
      }
      return NextResponse.json({ ok: true })
    }

    // Handle regular messages or images
    const userCountry = db.getUserCountry(chatId)
    if (!userCountry) {
      await TelegramBotClient.sendMessage(chatId, 'Please select a language first using /start')
      return NextResponse.json({ ok: true })
    }

    if (text) {
      // Process text message
      await enqueueAnalysis(text, userCountry, chatId)
    } else if (photo) {
      // Process image
      const fileId = photo[photo.length - 1].file_id // Get the highest resolution photo
      const file = await TelegramBotClient.getFile(fileId)
      const fileBuffer = await TelegramBotClient.downloadFile(file.file_path)
      const extractedText = await extractTextFromImage(fileBuffer)
      if (extractedText) {
        await enqueueAnalysis(extractedText, userCountry, chatId)
      } else {
        await TelegramBotClient.sendMessage(chatId, 'Sorry, I couldn\'t extract any text from the image. Please try sending a clearer image or the text directly.')
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    logger.error('Unhandled error in webhook:', error)
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'Webhook endpoint is active' })
}

