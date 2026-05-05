"use client"

import { moveStepUp, moveStepDown } from "@/lib/api"

export default function StepItem({ step }) {
  return (
    <div>
      <p>{step.prompt}</p>
      <button onClick={() => moveStepUp(step)}>↑</button>
      <button onClick={() => moveStepDown(step)}>↓</button>
    </div>
  )
}