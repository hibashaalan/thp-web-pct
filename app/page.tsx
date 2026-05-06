import Link from "next/link"
import { getSession, isAdmin } from "@/lib/auth"
import { getFlavors } from "@/lib/api"

export default async function Home() {
  const profile = await getSession()
  const admin = isAdmin(profile)

  let flavors: { id: string; name: string }[] = []
  let fetchError: string | null = null

  if (admin) {
    try {
      flavors = await getFlavors()
    } catch (e) {
      fetchError = e instanceof Error ? e.message : String(e)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Humor Flavor Tool</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and test AI-powered humor pipelines.
        </p>
      </div>

      {!admin ? (
        <Link
          href="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Sign In
        </Link>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Flavors</h2>
            <Link
              href="/flavors"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Manage →
            </Link>
          </div>

          {fetchError && (
            <p className="text-sm text-red-500 font-mono">{fetchError}</p>
          )}

          {!fetchError && flavors.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No flavors yet.{" "}
              <Link href="/flavors" className="text-blue-600 dark:text-blue-400 hover:underline">
                Create one
              </Link>
              .
            </p>
          )}

          {flavors.length > 0 && (
            <ul className="space-y-1">
              {flavors.map((f) => (
                <li key={f.id} className="flex items-center gap-3">
                  <Link
                    href={`/flavors/${f.id}`}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {f.name}
                  </Link>
                  <Link
                    href={`/flavors/${f.id}/test`}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:underline"
                  >
                    Test
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
