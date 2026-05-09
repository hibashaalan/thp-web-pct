"use client"

import { useState, useTransition } from "react"
import type { Step } from "@/types"
import {
  updateStepAction,
  deleteStepAction,
  moveStepUpAction,
  moveStepDownAction,
} from "@/app/actions"

export default function StepItem({
  step,
  flavorId,
  isFirst,
  isLast,
}: {
  step: Step
  flavorId: number
  isFirst: boolean
  isLast: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [prompt, setPrompt] = useState(step.prompt)
  const [error, setError] = useState("")
  const [pending, startTransition] = useTransition()

  const handleSave = () => {
    if (!prompt.trim() || prompt.trim() === step.prompt) {
      setEditing(false)
      setPrompt(step.prompt)
      return
    }
    setError("")
    startTransition(async () => {
      const result = await updateStepAction(step.id, flavorId, prompt.trim())
      if (result.error) {
        setError(result.error)
      } else {
        setEditing(false)
      }
    })
  }

  const handleDelete = () => {
    if (!confirm("Delete this step?")) return
    startTransition(async () => {
      const result = await deleteStepAction(step.id, flavorId)
      if (result.error) setError(result.error)
    })
  }

  return (
    <li className="border border-gray-200 dark:border-gray-800 rounded bg-white dark:bg-gray-900 p-4">
      <div className="flex items-start gap-3">
        <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded shrink-0">
          {step.step_number}
        </span>
        <div className="flex-1 min-w-0">
          {editing ? (
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              autoFocus
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm bg-white dark:bg-gray-900 resize-none"
            />
          ) : (
            <p className="text-sm whitespace-pre-wrap">{step.prompt}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <button
            onClick={() =>
              startTransition(async () => {
                await moveStepUpAction(step.id, flavorId)
              })
            }
            disabled={pending || isFirst}
            className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30"
          >
            Up
          </button>
          <button
            onClick={() =>
              startTransition(async () => {
                await moveStepDownAction(step.id, flavorId)
              })
            }
            disabled={pending || isLast}
            className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30"
          >
            Down
          </button>
        </div>
      </div>

      <div className="flex gap-3 mt-3 justify-end">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              disabled={pending}
              className="text-xs text-green-600 dark:text-green-400 hover:underline disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditing(false)
                setPrompt(step.prompt)
              }}
              className="text-xs text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={pending}
              className="text-xs text-red-500 hover:underline disabled:opacity-50"
            >
              Delete
            </button>
          </>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </li>
  )
}
