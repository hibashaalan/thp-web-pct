"use client"

export default function FlavorsError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
        Failed to load flavors
      </h2>
      <pre className="text-xs bg-gray-100 dark:bg-gray-900 rounded p-4 overflow-auto whitespace-pre-wrap">
        {error.message}
        {error.digest ? `\n\ndigest: ${error.digest}` : ""}
      </pre>
    </div>
  )
}
