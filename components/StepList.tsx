import { getSteps } from "@/lib/api"
import StepItem from "./StepItem"

export default async function StepList({ flavorId }: { flavorId: string }) {
  const steps = await getSteps(flavorId)
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
