import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TelegramBotClient } from '@/@lib/telegram-bot'
import { db } from '@/@lib/db'
import { enqueueAnalysis } from '@/@lib/queue'
import { extractTextFromImage } from '@/@lib/image-processor'
import { Country } from '@/@lib/localization'

export async function POST(request: NextRequest) {
  console.log('Webhook endpoint hit')
  try {
    const update = await request.json()
    console.log('Update received:', JSON.stringify(update))

    if (!update.message) {
      console.log('Invalid update format')
      return NextResponse.json({ ok: false, error: 'Invalid update format' })
    }

    const chatId = update.message.chat.id
    const text = update.message.text
    const photo = update.message.photo

    console.log(`Processing message for chat ID ${chatId}`)

    if (text === '/start') {
      console.log('Start command received')
      try {
        const welcomeMessage = `Haber Doğrulama Asistanı'na Hoş Geldiniz! 🔍
Lütfen dilinizi seçin / Please select your language:

/start_TR - Türkçe 🇹🇷
/start_AZ - Azərbaycanca 🇦🇿
/start_RU - Русский 🇷🇺`

        await TelegramBotClient.sendMessage(chatId, welcomeMessage)
        console.log('Welcome message sent')
        return NextResponse.json({ ok: true })
      } catch (error) {
        console.error('Error sending welcome message:', error)
        throw error
      }
    }

    if (text?.startsWith('/start_')) {
      console.log('Language selection received')
      const lang = text.split('_')[1] as Country
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
      console.log('Language confirmation sent')
      return NextResponse.json({ ok: true })
    }

    console.log('Processing regular message or image')
    const userCountry = db.getUserCountry(chatId)
    if (!userCountry) {
      console.log('No language selected for user')
      await TelegramBotClient.sendMessage(chatId, 'Please select a language first using /start')
      return NextResponse.json({ ok: true })
    }

    if (text) {
      console.log('Processing text message')
      await enqueueAnalysis(text, userCountry, chatId)
    } else if (photo) {
      console.log('Processing photo message')
      const fileId = photo[photo.length - 1]?.file_id
      if (!fileId) {
        console.log('No valid file_id in photo message')
        await TelegramBotClient.sendMessage(chatId, 'Sorry, I couldn\'t process this image. Please try again.')
        return NextResponse.json({ ok: true })
      }
      
      const file = await TelegramBotClient.getFile(fileId)
      if (!file.file_path) {
        console.log('No file_path in getFile response')
        await TelegramBotClient.sendMessage(chatId, 'Sorry, I couldn\'t process this image. Please try again.')
        return NextResponse.json({ ok: true })
      }
      
      const fileBuffer = await TelegramBotClient.downloadFile(file.file_path)
      const extractedText = await extractTextFromImage(fileBuffer)
      
      if (extractedText) {
        console.log('Text extracted from image')
        await enqueueAnalysis(extractedText, userCountry, chatId)
      } else {
        console.log('No text extracted from image')
        await TelegramBotClient.sendMessage(chatId, 'Sorry, I couldn\'t extract any text from the image. Please try sending a clearer image or the text directly.')
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  console.log('GET request received on webhook endpoint')
  return NextResponse.json({ status: 'Webhook endpoint is active' })
}
