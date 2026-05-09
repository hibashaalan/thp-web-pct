import Link from "next/link"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { createAdminClient } from "@/lib/supabase/admin"
import StepsManager from "@/components/StepsManager"

export default async function FlavorDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const admin = createAdminClient()

  const [flavorRes, stepsRes, modelsRes, stepTypesRes, inputTypesRes, outputTypesRes] = await Promise.all([
    admin.from("humor_flavors").select("id, slug, description").eq("id", Number(id)).single(),
    admin.from("humor_flavor_steps").select("*").eq("humor_flavor_id", Number(id)).order("order_by", { ascending: true }),
    admin.from("llm_models").select("id, name").order("name"),
    admin.from("humor_flavor_step_types").select("id, slug, description").order("slug"),
    admin.from("llm_input_types").select("id, slug, description").order("slug"),
    admin.from("llm_output_types").select("id, slug, description").order("slug"),
  ])

  if (flavorRes.error || !flavorRes.data) notFound()

  const flavor = flavorRes.data
  const steps = stepsRes.data ?? []
  const models = modelsRes.data ?? []
  const stepTypes = stepTypesRes.data ?? []
  const inputTypes = inputTypesRes.data ?? []
  const outputTypes = outputTypesRes.data ?? []

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
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-bold font-mono">{flavor.slug}</h1>
            <span className="text-xs text-gray-400 font-mono">#{flavor.id}</span>
          </div>
          {flavor.description && (
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

      <StepsManager
        flavorId={Number(id)}
        steps={steps}
        models={models}
        stepTypes={stepTypes}
        inputTypes={inputTypes}
        outputTypes={outputTypes}
      />
    </div>
  )
}
