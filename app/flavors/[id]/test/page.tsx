"use client"

import { useState, useTransition, use } from "react"
import Link from "next/link"
import { runChainAction } from "@/app/actions"
import type { CaptionResult } from "@/lib/chain"

export default function TestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [imageId, setImageId] = useState("")
  const [result, setResult] = useState<CaptionResult | null>(null)
  const [error, setError] = useState("")
  const [pending, startTransition] = useTransition()

  const handleGenerate = () => {
    if (!imageId.trim()) return
    setError("")
    setResult(null)
    startTransition(async () => {
      const res = await runChainAction(id, imageId.trim())
      if (res.error) {
        setError(res.error)
      } else if (res.result) {
        setResult(res.result)
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/flavors/${id}`}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Back to Flavor
        </Link>
        <h1 className="text-2xl font-bold mt-1">Test Flavor</h1>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium">Image ID</label>
        <input
          type="text"
          value={imageId}
          onChange={(e) => setImageId(e.target.value)}
          placeholder="Enter image ID"
          className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-sm"
        />
        <button
          onClick={handleGenerate}
          disabled={pending || !imageId.trim()}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded disabled:opacity-50"
        >
          {pending ? "Generating..." : "Generate Captions"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Result</h2>
          <pre className="border border-gray-200 dark:border-gray-800 rounded p-4 bg-white dark:bg-gray-900 text-sm whitespace-pre-wrap overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
