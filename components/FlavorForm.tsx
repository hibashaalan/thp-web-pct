"use client"

import { useState, useTransition } from "react"
import { createFlavorAction } from "@/app/actions"

export default function FlavorForm() {
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [pending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setError("")
    startTransition(async () => {
      const result = await createFlavorAction(name.trim())
      if (result.error) {
        setError(result.error)
      } else {
        setName("")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New flavor name"
          className="flex-1 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-sm"
        />
        <button
          type="submit"
          disabled={pending || !name.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded disabled:opacity-50 shrink-0"
        >
          {pending ? "Creating..." : "Create Flavor"}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  )
}
