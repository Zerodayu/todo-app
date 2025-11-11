import { NextRequest, NextResponse } from 'next/server'

const VALID_API_KEY = process.env.API_KEY

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    const apiKey = request.headers.get('x-api-key')
    
    if (!apiKey || apiKey !== VALID_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: Invalid or missing API key',
        },
        { status: 401 }
      )
    }
  }

  const origin = request.headers.get('origin') ?? ''
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001']
  const isAllowedOrigin = allowedOrigins.includes(origin)

  const corsOptions = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
  }

  const isPreflight = request.method === 'OPTIONS'

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }

  const response = NextResponse.next()

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: '/api/:path*',
}
