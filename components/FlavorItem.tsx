"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import type { Flavor } from "@/types"
import { updateFlavorAction, deleteFlavorAction } from "@/app/actions"

export default function FlavorItem({ flavor }: { flavor: Flavor }) {
  const [editing, setEditing] = useState(false)
  const [slug, setSlug] = useState(flavor.slug)
  const [description, setDescription] = useState(flavor.description)
  const [error, setError] = useState("")
  const [pending, startTransition] = useTransition()

  const handleSave = () => {
    if (!slug.trim()) return
    setError("")
    startTransition(async () => {
      const result = await updateFlavorAction(flavor.id, slug.trim(), description.trim())
      if (result.error) {
        setError(result.error)
      } else {
        setEditing(false)
      }
    })
  }

  const handleDelete = () => {
    if (!confirm(`Delete "${flavor.slug}"? This cannot be undone.`)) return
    startTransition(async () => {
      const result = await deleteFlavorAction(flavor.id)
      if (result.error) setError(result.error)
    })
  }

  return (
    <li className="flex items-center gap-2 p-3 border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
      {editing ? (
        <>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Slug"
            autoFocus
            className="w-40 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm bg-white dark:bg-gray-900"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="flex-1 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm bg-white dark:bg-gray-900"
          />
          <button
            onClick={handleSave}
            disabled={pending}
            className="text-sm text-green-600 dark:text-green-400 hover:underline disabled:opacity-50"
          >
            Save
          </button>
          <button
            onClick={() => { setEditing(false); setSlug(flavor.slug); setDescription(flavor.description) }}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <Link
            href={`/flavors/${flavor.id}`}
            className="font-mono text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400"
          >
            {flavor.slug}
          </Link>
          {flavor.description && (
            <span className="flex-1 text-xs text-gray-500 dark:text-gray-400 truncate">
              {flavor.description}
            </span>
          )}
          <Link
            href={`/flavors/${flavor.id}/test`}
            className="text-xs text-green-600 dark:text-green-400 hover:underline px-1"
          >
            Test
          </Link>
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-1"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={pending}
            className="text-xs text-red-500 hover:underline disabled:opacity-50 px-1"
          >
            Delete
          </button>
        </>
      )}
      {error && <p className="text-red-500 text-xs ml-2">{error}</p>}
    </li>
  )
}
