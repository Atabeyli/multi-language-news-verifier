import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Bot } from "grammy"

export async function GET(req: NextRequest) {
  console.log("Setup route accessed")
  
  const token = process.env.TELEGRAM_BOT_TOKEN
  console.log("Token exists:", !!token)
  
  if (!token) {
    console.error("TELEGRAM_BOT_TOKEN is not accessible")
    return NextResponse.json({
      status: 'error',
      message: 'TELEGRAM_BOT_TOKEN is not accessible. Please check your environment variables.',
      debug: {
        envVars: Object.keys(process.env),
        nodeEnv: process.env.NODE_ENV
      }
    }, { status: 500 })
  }

  const bot = new Bot(token)
  
  const vercelUrl = process.env.VERCEL_URL || req.headers.get('host')
  console.log("Vercel URL:", vercelUrl)
  
  if (!vercelUrl) {
    console.error("Unable to determine the server URL")
    return NextResponse.json({ 
      status: 'error', 
      message: 'Unable to determine the server URL',
      debug: {
        headers: Object.fromEntries(req.headers.entries())
      }
    }, { status: 500 })
  }
  
  const webhookUrl = `https://${vercelUrl}/api/webhook`
  
  try {
    await bot.api.setWebhook(webhookUrl)
    console.log(`Webhook set to ${webhookUrl}`)
    return NextResponse.json({ 
      status: 'ok', 
      message: `Webhook successfully set to ${webhookUrl}`,
      debug: {
        botInfo: await bot.api.getMe()
      }
    })
  } catch (error) {
    console.error("Error setting webhook:", error)
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to set webhook', 
      error: (error as Error).message,
      stack: (error as Error).stack
    }, { status: 500 })
  }
}

