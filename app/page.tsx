import Link from "next/link"
import { getSession, isAdmin } from "@/lib/auth"
import { getFlavors, getExternalFlavors } from "@/lib/api"
import type { Flavor } from "@/types"

async function fetchSilently<T>(fn: () => Promise<T>): Promise<{ data: T | null; error: string | null }> {
  try {
    return { data: await fn(), error: null }
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : String(e) }
  }
}

function FlavorSection({
  title,
  flavors,
  error,
  linkBase,
  badge,
}: {
  title: string
  flavors: Flavor[] | null
  error: string | null
  linkBase?: string
  badge?: string
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {badge && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            {badge}
          </span>
        )}
      </div>
      {error && <p className="text-sm text-red-500 font-mono">{error}</p>}
      {flavors && flavors.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">No flavors found.</p>
      )}
      {flavors && flavors.length > 0 && (
        <ul className="space-y-1">
          {flavors.map((f) => (
            <li key={f.id}>
              {linkBase ? (
                <Link
                  href={`${linkBase}/${f.id}`}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {f.name}
                </Link>
              ) : (
                <span className="text-sm">{f.name}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default async function Home() {
  const profile = await getSession()
  const admin = isAdmin(profile)

  const [supabase, external] = admin
    ? await Promise.all([fetchSilently(getFlavors), fetchSilently(getExternalFlavors)])
    : [{ data: null, error: null }, { data: null, error: null }]

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
        <>
          <div className="grid gap-8 sm:grid-cols-2">
            <FlavorSection
              title="CrackedAI Flavors"
              flavors={external.data}
              error={external.error}
              badge="api.almostcrackd.ai"
            />
            <FlavorSection
              title="My Flavors"
              flavors={supabase.data}
              error={supabase.error}
              linkBase="/flavors"
              badge="Supabase"
            />
          </div>
          <Link
            href="/flavors"
            className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Manage My Flavors →
          </Link>
        </>
      )}
    </div>
  )
}
