import { requireAdmin } from "@/lib/auth"
import FlavorForm from "@/components/FlavorForm"
import FlavorList from "@/components/FlavorList"

export default async function FlavorsPage() {
  await requireAdmin()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Humor Flavors</h1>
      <FlavorForm />
      <FlavorList />
    </div>
  )
}
