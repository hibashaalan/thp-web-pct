"use client"

import { useState, useTransition, use } from "react"
import Link from "next/link"
import { runChainAction } from "@/app/actions"
import type { StepResult } from "@/lib/chain"

export default function TestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [imageUrl, setImageUrl] = useState("")
  const [results, setResults] = useState<StepResult[]>([])
  const [error, setError] = useState("")
  const [pending, startTransition] = useTransition()

  const handleGenerate = () => {
    if (!imageUrl.trim()) return
    setError("")
    setResults([])
    startTransition(async () => {
      const result = await runChainAction(id, imageUrl.trim())
      if (result.error) {
        setError(result.error)
      } else if (result.results) {
        setResults(result.results)
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
        <label className="block text-sm font-medium">Image URL</label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-sm"
        />
        <button
          onClick={handleGenerate}
          disabled={pending || !imageUrl.trim()}
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

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Step-by-Step Results</h2>
          {results.map((r) => (
            <div
              key={r.step_number}
              className="border border-gray-200 dark:border-gray-800 rounded p-4 bg-white dark:bg-gray-900"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                  Step {r.step_number}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {r.prompt}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{r.output}</p>
            </div>
          ))}

          <div className="border-2 border-green-300 dark:border-green-700 rounded p-4 bg-green-50 dark:bg-green-950">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">
              Final Captions
            </h3>
            <p className="text-sm whitespace-pre-wrap text-green-900 dark:text-green-100">
              {results[results.length - 1]?.output}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
