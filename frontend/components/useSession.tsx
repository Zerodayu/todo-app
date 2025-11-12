import { getSession } from "@/lib/session"

export async function IsLoggedIn({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  
  if (!session.token || !session.user) {
    return null
  }
  
  return <>{children}</>
}

export async function IsLoggedOut({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  
  if (session.token && session.user) {
    return null
  }
  
  return <>{children}</>
}
