import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TelegramBotClient } from '@/@lib/telegram-bot'
import { db } from '@/@lib/db'
import { enqueueAnalysis } from '@/@lib/queue'
import { extractTextFromImage } from '@/@lib/image-processor'
import { Country } from '@/@lib/localization'

export async function POST(request: NextRequest) {
  try {
    console.log('Webhook endpoint hit')
    
    const update = await request.json()
    console.log('Update received:', JSON.stringify(update))

    if (!update.message) {
      return NextResponse.json({ ok: false, error: 'Invalid update format' })
    }

    const chatId = update.message.chat.id
    const text = update.message.text
    const photo = update.message.photo

    if (text === '/start') {
      try {
        const welcomeMessage = `Haber Doğrulama Asistanı'na Hoş Geldiniz! 🔍
Lütfen dilinizi seçin / Please select your language:

/start_TR - Türkçe 🇹🇷
/start_AZ - Azərbaycanca 🇦🇿
/start_RU - Русский 🇷🇺`

        await TelegramBotClient.sendMessage(chatId, welcomeMessage)
        return NextResponse.json({ ok: true })
      } catch (error) {
        console.error('Error sending welcome message:', error)
        throw error
      }
    }

    if (text?.startsWith('/start_')) {
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
      return NextResponse.json({ ok: true })
    }

    const userCountry = db.getUserCountry(chatId)
    if (!userCountry) {
      await TelegramBotClient.sendMessage(chatId, 'Please select a language first using /start')
      return NextResponse.json({ ok: true })
    }

    if (text) {
      await enqueueAnalysis(text, userCountry, chatId)
    } else if (photo) {
      const fileId = photo[photo.length - 1]?.file_id
      if (!fileId) {
        await TelegramBotClient.sendMessage(chatId, 'Sorry, I couldn\'t process this image. Please try again.')
        return NextResponse.json({ ok: true })
      }
      
      const file = await TelegramBotClient.getFile(fileId)
      if (!file.file_path) {
        await TelegramBotClient.sendMessage(chatId, 'Sorry, I couldn\'t process this image. Please try again.')
        return NextResponse.json({ ok: true })
      }
      
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
    console.error('Webhook error:', error)
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'Webhook endpoint is active' })
}
