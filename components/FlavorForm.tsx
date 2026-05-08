"use client"

import { useState, useTransition } from "react"
import { createFlavorAction } from "@/app/actions"

export default function FlavorForm() {
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [pending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!slug.trim()) return
    setError("")
    startTransition(async () => {
      const result = await createFlavorAction(slug.trim(), description.trim())
      if (result.error) {
        setError(result.error)
      } else {
        setSlug("")
        setDescription("")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Slug (e.g. my-flavor)"
          className="w-48 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-sm"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="flex-1 border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-sm"
        />
        <button
          type="submit"
          disabled={pending || !slug.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded disabled:opacity-50 shrink-0"
        >
          {pending ? "Creating..." : "Create"}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  )
}
