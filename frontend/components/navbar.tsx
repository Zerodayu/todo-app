import { Button } from "./ui/button"

export default function Navbar() {
  return (
    <nav className="sticky top-0 flex w-full items-center justify-between p-4 border-b z-50 backdrop-blur">
      <div>
        <h1>Todo App</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* logged out */}
        <Button>
          Login
        </Button>
        <Button variant="outline">
          Signup
        </Button>

        {/* logged in */}
        <h1 className="font-mono font-bold">User name</h1>
        <Button variant="destructive">
          Logout
        </Button>
      </div>
    </nav>
  )
}
