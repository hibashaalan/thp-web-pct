"use client"

import { moveStepUp, moveStepDown } from "@/lib/api"

type Step = {
  id: string
  prompt: string
}

export default function StepItem({ step }: { step: Step }) {
  return (
    <div>
      <p>{step.prompt}</p>
      <button onClick={() => moveStepUp(step.id)}>↑</button>
      <button onClick={() => moveStepDown(step.id)}>↓</button>
    </div>
  )
}