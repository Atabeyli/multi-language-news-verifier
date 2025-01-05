import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TelegramBotClient } from '@lib/telegram-bot'
import logger from '@lib/logger'

// Add Node.js types
declare const process: {
  env: {
    VERCEL_URL?: string
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const baseUrl = process.env.VERCEL_URL || request.headers.get('host')
    if (!baseUrl) {
      throw new Error('Base URL not found')
    }
    
    const webhookUrl = `https://${baseUrl}/api/webhook`
    
    logger.info('Setting webhook URL:', webhookUrl)
    
    const result = await TelegramBotClient.setWebhook(webhookUrl)
    
    if (result) {
      logger.info('Webhook set successfully')
      return NextResponse.json({
        ok: true,
        message: 'Webhook was set successfully',
        webhookUrl
      })
    } else {
      logger.error('Failed to set webhook')
      return NextResponse.json({
        ok: false,
        message: 'Failed to set webhook',
        webhookUrl
      }, { status: 500 })
    }
  } catch (error) {
    logger.error('Setup error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

