import Link from "next/link"
import { getSession } from "@/lib/auth"

export default async function Home() {
  const user = await getSession()

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Humor Flavor Tool</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Manage and test AI-powered humor pipelines.
      </p>
      {user ? (
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
