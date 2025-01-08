import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Bot, webhookCallback } from 'grammy'
import { Update } from '@grammyjs/types'

let bot: Bot | null = null;

function initializeBot() {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  console.log('Attempting to initialize bot...');
  console.log('TELEGRAM_BOT_TOKEN is ' + (botToken ? 'set' : 'not set'));

  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN is not set in the environment variables');
    return null;
  }

  try {
    const newBot = new Bot(botToken);
    console.log('Bot initialized successfully');
    return newBot;
  } catch (error) {
    console.error('Error initializing bot:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  console.log('Webhook received a POST request');
  
  if (!bot) {
    bot = initializeBot();
    if (!bot) {
      console.error('Failed to initialize bot');
      return new NextResponse('Bot initialization failed', { status: 500 });
    }

    bot.command('start', (ctx) => ctx.reply('Merhaba! Ben bir haber doğrulama botuyum.'));
    bot.on('message', (ctx) => ctx.reply('Mesajınızı aldım ve işliyorum...'));
  }

  try {
    const body = await request.json() as Update;
    console.log('Request body:', JSON.stringify(body));
    
    const handler = webhookCallback(bot, 'next-js');
    
    const response = await handler(
      { body, headers: Object.fromEntries(request.headers) },
      { 
        status: (statusCode: number) => ({ json: () => new NextResponse(null, { status: statusCode }) }),
        end: () => new NextResponse(null, { status: 200 })
      } as any
    );

    console.log('Webhook response processed');
    return response;
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new NextResponse('Webhook Error', { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  console.log('Webhook received a GET request');
  const botStatus = bot ? 'initialized' : 'not initialized';
  return new NextResponse(`Webhook is running. Bot status: ${botStatus}`);
}

