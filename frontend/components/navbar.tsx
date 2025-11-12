import { Button } from "./ui/button"
import Link from "next/link";
import { LogoutAction } from "@/server/logout-action";
import { getSession } from "@/lib/session";
import {
  IsLoggedIn,
  IsLoggedOut,
} from "./useSession"

export default async function Navbar() {
  const session = await getSession();

  return (
    <nav className="sticky top-0 flex w-full items-center justify-between p-4 border-b z-50 backdrop-blur">
      <div>
        <h1>Todo App</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* logged out */}
        <IsLoggedOut>
          <Link href="/auth/login">
            <Button>
              Login
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="outline">
              Signup
            </Button>
          </Link>
        </IsLoggedOut>

        {/* logged in */}
        <IsLoggedIn>
          <h1 className="font-mono font-bold">{session?.user.email}</h1>
          <form action={LogoutAction}>
            <Button variant="destructive">
              Logout
            </Button>
          </form>
        </IsLoggedIn>
      </div>
    </nav>
  )
}
