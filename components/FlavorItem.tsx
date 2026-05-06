"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import type { Flavor } from "@/types"
import { updateFlavorAction, deleteFlavorAction } from "@/app/actions"

export default function FlavorItem({ flavor }: { flavor: Flavor }) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(flavor.name)
  const [error, setError] = useState("")
  const [pending, startTransition] = useTransition()

  const handleSave = () => {
    if (!name.trim() || name.trim() === flavor.name) {
      setEditing(false)
      setName(flavor.name)
      return
    }
    setError("")
    startTransition(async () => {
      const result = await updateFlavorAction(flavor.id, name.trim())
      if (result.error) {
        setError(result.error)
      } else {
        setEditing(false)
      }
    })
  }

  const handleDelete = () => {
    if (!confirm(`Delete "${flavor.name}"? This cannot be undone.`)) return
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave()
              if (e.key === "Escape") {
                setEditing(false)
                setName(flavor.name)
              }
            }}
            autoFocus
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
            onClick={() => {
              setEditing(false)
              setName(flavor.name)
            }}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <Link
            href={`/flavors/${flavor.id}`}
            className="flex-1 font-medium hover:text-blue-600 dark:hover:text-blue-400 text-sm"
          >
            {flavor.name}
          </Link>
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
            Rename
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
