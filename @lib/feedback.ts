import { db } from './db'

export async function saveFeedback(chatId: number, feedback: string) {
  console.log(`Feedback from ${chatId}: ${feedback}`)
  // İleride veritabanı entegrasyonu için hazır
}

