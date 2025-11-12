import { cookies } from 'next/headers'

export async function getSession() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('token')
  const sessionUser = cookieStore.get('user')
  
  return {
    token: sessionToken?.value,
    user: sessionUser?.value
  }
}