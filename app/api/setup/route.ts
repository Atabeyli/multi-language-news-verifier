import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Bot } from "grammy"

export async function GET(req: NextRequest) {
  console.log("Setup endpoint çağrıldı")

  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) {
    console.error("TELEGRAM_BOT_TOKEN bulunamadı")
    return NextResponse.json({
      ok: false,
      error: "Bot token'ı bulunamadı"
    }, { status: 500 })
  }

  const bot = new Bot(token)
  const host = req.headers.get('host')
  
  if (!host) {
    console.error("Host bilgisi alınamadı")
    return NextResponse.json({
      ok: false,
      error: "Host bilgisi alınamadı"
    }, { status: 500 })
  }

  const webhookUrl = `https://${host}/api/webhook`
  console.log("Ayarlanacak webhook URL'i:", webhookUrl)

  try {
    // Mevcut webhook bilgisini al
    const currentWebhook = await bot.api.getWebhookInfo()
    console.log("Mevcut webhook durumu:", currentWebhook)

    // Eski webhook'u temizle
    await bot.api.deleteWebhook()
    console.log("Eski webhook temizlendi")

    // Yeni webhook'u ayarla
    await bot.api.setWebhook(webhookUrl)
    console.log("Yeni webhook ayarlandı")

    // Bot bilgilerini al
    const botInfo = await bot.api.getMe()
    console.log("Bot bilgileri:", botInfo)

    // Yeni webhook durumunu kontrol et
    const newWebhook = await bot.api.getWebhookInfo()
    console.log("Yeni webhook durumu:", newWebhook)

    return NextResponse.json({
      ok: true,
      bot: botInfo,
      webhook: {
        url: webhookUrl,
        previous: currentWebhook,
        current: newWebhook
      }
    })
  } catch (error) {
    console.error("Setup hatası:", error)
    return NextResponse.json({
      ok: false,
      error: String(error)
    }, { status: 500 })
  }
}

