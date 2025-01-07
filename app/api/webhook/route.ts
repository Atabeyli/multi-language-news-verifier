import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Bot } from "grammy"

// Bot instance'ını global olarak oluşturalım
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || "")

// Basit komutları ayarlayalım
bot.command("start", async (ctx) => {
  console.log("Start komutu alındı")
  try {
    await ctx.reply("Merhaba! Ben bir haber doğrulama botuyum. Bana bir haber gönder, doğruluğunu kontrol edeyim.")
  } catch (error) {
    console.error("Start komut hatası:", error)
  }
})

bot.on("message", async (ctx) => {
  console.log("Mesaj alındı:", ctx.message)
  try {
    await ctx.reply("Mesajını aldım! Şu anda analiz yapıyorum...")
  } catch (error) {
    console.error("Mesaj yanıt hatası:", error)
  }
})

export async function POST(req: NextRequest) {
  console.log("Webhook isteği alındı")
  
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN bulunamadı!")
    return NextResponse.json({ error: "Token yapılandırması eksik" }, { status: 500 })
  }

  try {
    const update = await req.json()
    console.log("Gelen güncelleme:", JSON.stringify(update, null, 2))
    
    await bot.handleUpdate(update)
    console.log("Güncelleme başarıyla işlendi")
    
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Webhook hatası:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    botInfo: await bot.api.getMe().catch(e => ({ error: String(e) }))
  })
}

