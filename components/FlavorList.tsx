import { getFlavors } from "@/lib/api"
import FlavorListClient from "./FlavorListClient"

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

  return <FlavorListClient flavors={flavors} />
}
