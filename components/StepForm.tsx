"use client"

import { useState, useTransition } from "react"
import { createStepAction } from "@/app/actions"

export default function StepForm({ flavorId }: { flavorId: number }) {
  const [prompt, setPrompt] = useState("")
  const [error, setError] = useState("")
  const [pending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    setError("")
    startTransition(async () => {
      const result = await createStepAction(flavorId, prompt.trim())
      if (result.error) {
        setError(result.error)
      } else {
        setPrompt("")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Step prompt (e.g., 'Take in an image and describe it in text')"
        rows={3}
        className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-sm resize-none"
      />
      <button
        type="submit"
        disabled={pending || !prompt.trim()}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded disabled:opacity-50"
      >
        {pending ? "Adding..." : "Add Step"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  )
}
