import { createWorker } from 'tesseract.js'
import logger from './logger'

export async function extractTextFromImage(imageBuffer: Buffer): Promise<string> {
  try {
    const worker = await createWorker('eng+tur+aze+rus')
    const { data: { text } } = await worker.recognize(imageBuffer)
    await worker.terminate()
    return text
  } catch (error) {
    logger.error('Error in extractTextFromImage:', error)
    throw new Error('Failed to extract text from image')
  }
}

