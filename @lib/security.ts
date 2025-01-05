import { createHash } from 'crypto'

export function generateApiSignature(payload: string, secret: string): string {
  return createHash('sha256').update(payload + secret).digest('hex')
}

export function validateApiSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = generateApiSignature(payload, secret)
  return expectedSignature === signature
}

export function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>/g, '')
}

