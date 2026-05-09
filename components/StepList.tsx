import { getSteps } from "@/lib/api"
import StepItem from "./StepItem"

export default async function StepList({ flavorId }: { flavorId: number }) {
  let steps
  try {
    steps = await getSteps(flavorId)
  } catch (e) {
    console.error('[StepList] getSteps failed:', e)
    return (
      <div className="text-red-500 text-sm p-4 bg-red-50 dark:bg-red-950 rounded border border-red-200 dark:border-red-800">
        <p className="font-medium">Could not load steps</p>
        <p className="font-mono text-xs mt-1">
          {e instanceof Error ? e.message : String(e)}
        </p>
      </div>
    )
  }
  const sorted = steps.sort((a, b) => a.step_number - b.step_number)

  if (sorted.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        No steps yet. Add one below.
      </p>
    )
  }

  return (
    <ol className="space-y-3">
      {sorted.map((step, index) => (
        <StepItem
          key={step.id}
          step={step}
          flavorId={flavorId}
          isFirst={index === 0}
          isLast={index === sorted.length - 1}
        />
      ))}
    </ol>
  )
}
