"use client"

import { createStep } from "@/lib/api"
import { useState } from "react"

export default function StepForm({ flavorId }) {
  const [prompt, setPrompt] = useState("")

  const handleSubmit = async () => {
    await createStep(flavorId, prompt)
    setPrompt("")
  }

  return (
    <div>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button onClick={handleSubmit}>Add Step</button>
    </div>
  )
}