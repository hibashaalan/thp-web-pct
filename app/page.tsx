import Link from "next/link"
import { isLoggedIn } from "@/lib/auth"

export default async function Home() {
  const loggedIn = await isLoggedIn()

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Humor Flavor Tool</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Manage and test AI-powered humor pipelines.
      </p>
      {loggedIn ? (
        <Link
          href="/flavors"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Manage Flavors
        </Link>
      ) : (
        <Link
          href="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Sign In
        </Link>
      )}
    </div>
  )
}
