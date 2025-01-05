import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Bot, webhookCallback } from "grammy"

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || "")

bot.command("start", (ctx) => ctx.reply("Merhaba! Doğrulamak istediğiniz bir haber gönderin."))
bot.on("message", (ctx) => ctx.reply("Mesajınızı aldım. Bu özellik yakında gelecek!"))

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    await bot.handleUpdate(body)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Webhook işleme hatası:", error)
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ ok: true, message: "Webhook aktif" })
}

