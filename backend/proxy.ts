import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const VALID_API_KEY = process.env.API_KEY

export default async function proxy(request: NextRequest) {
  const origin = request.headers.get('origin') ?? ''
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001']
  const isAllowedOrigin = allowedOrigins.includes(origin)

  const corsOptions = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const preflightHeaders = {
      ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
      ...corsOptions,
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }

  // API Key verification for all /api routes
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

  // JWT verification for /api/todos routes
  if (request.nextUrl.pathname.startsWith('/api/todos')) {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: Missing or invalid token',
        },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      const { payload } = await jwtVerify(token, secret)
      
      // Add user info to request headers for use in route handlers
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.userId as string)
      requestHeaders.set('x-user-email', payload.email as string)
      
      // Continue with modified headers
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })

      if (isAllowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', origin)
      }

      Object.entries(corsOptions).forEach(([key, value]) => {
        response.headers.set(key, value)
      })

      return response
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: Invalid or expired token',
        },
        { status: 401 }
      )
    }
  }

  // Default response with CORS headers
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
