import { getFlavors } from "@/lib/api"
import FlavorItem from "./FlavorItem"

export default async function FlavorList() {
  const flavors = await getFlavors()

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
