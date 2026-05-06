import { getFlavors } from "@/lib/api"
import FlavorItem from "./FlavorItem"

export default async function FlavorList() {
  let flavors
  try {
    flavors = await getFlavors()
  } catch (e) {
    return (
      <div className="text-red-500 text-sm p-4 bg-red-50 dark:bg-red-950 rounded border border-red-200 dark:border-red-800">
        <p className="font-medium">Could not load flavors</p>
        <p className="font-mono text-xs mt-1">
          {e instanceof Error ? e.message : String(e)}
        </p>
      </div>
    )
  }

  if (flavors.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        No flavors yet. Create one above.
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {flavors.map((f) => (
        <FlavorItem key={f.id} flavor={f} />
      ))}
    </ul>
  )
}
