import Link from "next/link"
import { cookies } from "next/headers"
import { isLoggedIn } from "@/lib/auth"
import ThemeToggle from "./ThemeToggle"
import LogoutButton from "./LogoutButton"

export default async function Navbar() {
  const [loggedIn, store] = await Promise.all([isLoggedIn(), cookies()])
  const theme = (store.get("theme")?.value ?? "system") as
    | "light"
    | "system"
    | "dark"

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold text-lg">
            Flavor Tool
          </Link>
          {loggedIn && (
            <Link
              href="/flavors"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Flavors
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle initialTheme={theme} />
          {loggedIn ? (
            <LogoutButton />
          ) : (
            <Link
              href="/login"
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
