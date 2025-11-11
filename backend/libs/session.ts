import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export interface UserSession {
  userId: string
  email: string
}

/**
 * Verifies JWT token from the request and returns user session data
 * @param request - The Next.js request object
 * @returns User session data or null if verification fails
 */
export async function verifyJWT(request: NextRequest): Promise<UserSession | null> {
  try {
    // First check if user info was already set by middleware
    const userIdFromHeader = request.headers.get('x-user-id')
    const userEmailFromHeader = request.headers.get('x-user-email')
    
    if (userIdFromHeader && userEmailFromHeader) {
      return {
        userId: userIdFromHeader,
        email: userEmailFromHeader,
      }
    }

    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    
    return {
      userId: payload.userId as string,
      email: payload.email as string,
    }
  } catch (error) {
    console.error('JWT verification error:', error)
    return null
  }
}

export function unauthorizedResponse(message: string = 'Unauthorized: Invalid or missing token') {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: 401 }
  )
}
