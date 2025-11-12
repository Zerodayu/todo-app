import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function getSession() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('token')
  
  if (!sessionToken?.value) {
    return null
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    
    const { payload } = await jwtVerify(sessionToken.value, secret)
    
    return {
      token: sessionToken.value,
      user: {
        userId: payload.userId as string,
        email: payload.email as string,
        name: payload.name as string | undefined,
      }
    }
  } catch (error) {
    console.error('Invalid or expired token:', error)
    return null
  }
}