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
    <form onSubmit={handleSubmit} className="space-y-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. money-greed"
            className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">Lowercase with hyphens, no spaces</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Description
          </label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Captions about greed and money"
            className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-sm"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending || !slug.trim()}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-5 rounded disabled:opacity-50"
        >
          {pending ? "Creating..." : "Create Flavor"}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </form>
  )
}
