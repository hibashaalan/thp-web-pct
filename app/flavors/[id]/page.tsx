import Link from "next/link"
import { requireAdmin } from "@/lib/auth"
import { getFlavor } from "@/lib/api"
import StepForm from "@/components/StepForm"
import StepList from "@/components/StepList"

export default async function FlavorDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const flavor = await getFlavor(Number(id)).catch(() => null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/flavors"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to Flavors
          </Link>
          <h1 className="text-2xl font-bold mt-1 font-mono">{flavor?.slug ?? "Flavor"}</h1>
          {flavor?.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{flavor.description}</p>
          )}
        </div>
        <Link
          href={`/flavors/${id}/test`}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded text-sm"
        >
          Test Flavor
        </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Steps</h2>
        <StepList flavorId={id} />
        <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
          <h3 className="text-sm font-medium mb-2">Add Step</h3>
          <StepForm flavorId={id} />
        </div>
      </div>
    </div>
  )
}
