import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'ok', message: 'Test endpoint is working' })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ status: 'ok', message: 'Test endpoint is working' })
}