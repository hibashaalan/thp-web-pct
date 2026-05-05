"use client"

import { useEffect, useState } from "react"
import { getSteps } from "@/lib/api"
import StepItem from "./StepItem"

export default function StepList({ flavorId }) {
  const [steps, setSteps] = useState([])

  useEffect(() => {
    getSteps(flavorId).then(setSteps)
  }, [flavorId])

  return (
    <div>
      {steps.map((step) => (
        <StepItem key={step.id} step={step} />
      ))}
    </div>
  )
}