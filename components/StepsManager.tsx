'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Step, LookupType, Model } from '@/types'

interface Props {
  flavorId: number
  steps: Step[]
  models: Model[]
  stepTypes: LookupType[]
  inputTypes: LookupType[]
  outputTypes: LookupType[]
}

function StepCard({
  step,
  index,
  total,
  models,
  stepTypes,
  inputTypes,
  outputTypes,
  flavorId,
  onRefresh,
  onMove,
  onDelete,
}: {
  step: Step
  index: number
  total: number
  models: Model[]
  stepTypes: LookupType[]
  inputTypes: LookupType[]
  outputTypes: LookupType[]
  flavorId: number
  onRefresh: () => void
  onMove: (stepId: number, direction: 'up' | 'down') => Promise<void>
  onDelete: (stepId: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [moving, setMoving] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const [stepTypeId, setStepTypeId] = useState(String(step.humor_flavor_step_type_id ?? ''))
  const [inputTypeId, setInputTypeId] = useState(String(step.llm_input_type_id ?? ''))
  const [outputTypeId, setOutputTypeId] = useState(String(step.llm_output_type_id ?? ''))
  const [modelId, setModelId] = useState(String(step.llm_model_id ?? ''))
  const [temperature, setTemperature] = useState(String(step.llm_temperature ?? '0.7'))
  const [description, setDescription] = useState(step.description ?? '')
  const [systemPrompt, setSystemPrompt] = useState(step.llm_system_prompt ?? '')
  const [userPrompt, setUserPrompt] = useState(step.llm_user_prompt ?? '')

  const modelName = models.find((m) => m.id === step.llm_model_id)?.name ?? `#${step.llm_model_id}`
  const stepTypeName = stepTypes.find((s) => s.id === step.humor_flavor_step_type_id)?.slug ?? `#${step.humor_flavor_step_type_id}`

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/flavors/${flavorId}/steps/${step.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          humor_flavor_step_type_id: stepTypeId ? Number(stepTypeId) : null,
          llm_input_type_id: inputTypeId ? Number(inputTypeId) : null,
          llm_output_type_id: outputTypeId ? Number(outputTypeId) : null,
          llm_model_id: modelId ? Number(modelId) : null,
          llm_temperature: temperature ? Number(temperature) : null,
          description,
          llm_system_prompt: systemPrompt || null,
          llm_user_prompt: userPrompt || null,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to save')
      }
      setEditing(false)
      onRefresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    setError('')
    try {
      const res = await fetch(`/api/flavors/${flavorId}/steps/${step.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to delete')
      }
      onDelete(step.id)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setDeleting(false)
    }
  }

  const handleMove = async (direction: 'up' | 'down') => {
    setMoving(true)
    setError('')
    try {
      await onMove(step.id, direction)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setMoving(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-start gap-3 p-4">
        <div className="flex flex-col items-center gap-1 shrink-0">
          <button
            onClick={() => handleMove('up')}
            disabled={index === 0 || moving}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
          >
            ▲
          </button>
          <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-bold">
            {step.order_by}
          </span>
          <button
            onClick={() => handleMove('down')}
            disabled={index === total - 1 || moving}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs"
          >
            ▼
          </button>
        </div>

        <div className="flex-1 min-w-0">
          {!editing ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-mono">
                  {stepTypeName}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{modelName}</span>
                {step.llm_temperature != null && (
                  <span className="text-xs text-gray-400 dark:text-gray-600">temp: {step.llm_temperature}</span>
                )}
              </div>
              {step.description && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">{step.description}</p>
              )}
              {step.llm_user_prompt && (
                <p className="text-xs text-gray-500 font-mono bg-gray-50 dark:bg-gray-800/50 rounded p-2 mt-2 line-clamp-2">
                  {step.llm_user_prompt}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Step Type</label>
                  <select value={stepTypeId} onChange={(e) => setStepTypeId(e.target.value)} className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500">
                    <option value="">— none —</option>
                    {stepTypes.map((st) => <option key={st.id} value={st.id}>{st.slug}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">LLM Model</label>
                  <select value={modelId} onChange={(e) => setModelId(e.target.value)} className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500">
                    <option value="">— none —</option>
                    {models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Input Type</label>
                  <select value={inputTypeId} onChange={(e) => setInputTypeId(e.target.value)} className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500">
                    <option value="">— select —</option>
                    {inputTypes.map((it) => <option key={it.id} value={it.id}>{it.slug}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Output Type</label>
                  <select value={outputTypeId} onChange={(e) => setOutputTypeId(e.target.value)} className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500">
                    <option value="">— select —</option>
                    {outputTypes.map((ot) => <option key={ot.id} value={ot.id}>{ot.slug}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Temperature</label>
                <input type="number" min="0" max="2" step="0.1" value={temperature} onChange={(e) => setTemperature(e.target.value)} className="w-32 px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What does this step do?" className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">System Prompt</label>
                <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} rows={3} placeholder="System prompt for this step..." className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none font-mono" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">User Prompt</label>
                <textarea value={userPrompt} onChange={(e) => setUserPrompt(e.target.value)} rows={3} placeholder="User prompt for this step..." className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none font-mono" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saving} className="px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => { setEditing(false); setError('') }} className="px-3 py-1.5 rounded border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {!editing && (
          <div className="flex gap-2 shrink-0">
            <button onClick={() => setEditing(true)} className="px-2.5 py-1.5 rounded text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Edit
            </button>
            <button onClick={handleDelete} disabled={deleting} className="px-2.5 py-1.5 rounded text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50">
              {deleting ? '...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      {error && !editing && (
        <div className="px-4 pb-3 text-xs text-red-600 dark:text-red-400">{error}</div>
      )}
    </div>
  )
}

export default function StepsManager({ flavorId, steps: initialSteps, models, stepTypes, inputTypes, outputTypes }: Props) {
  const router = useRouter()
  const [steps, setSteps] = useState(initialSteps)
  const [showNewForm, setShowNewForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')

  const [newStepTypeId, setNewStepTypeId] = useState('')
  const [newInputTypeId, setNewInputTypeId] = useState('')
  const [newOutputTypeId, setNewOutputTypeId] = useState('')
  const [newModelId, setNewModelId] = useState('')
  const [newTemperature, setNewTemperature] = useState('0.7')
  const [newDescription, setNewDescription] = useState('')
  const [newSystemPrompt, setNewSystemPrompt] = useState('')
  const [newUserPrompt, setNewUserPrompt] = useState('')

  const handleRefresh = () => router.refresh()

  const handleDelete = (stepId: number) => {
    setSteps((prev) => {
      const filtered = prev.filter((s) => s.id !== stepId)
      return filtered.map((s, i) => ({ ...s, order_by: i + 1 }))
    })
  }

  const handleMove = async (stepId: number, direction: 'up' | 'down') => {
    const res = await fetch(`/api/flavors/${flavorId}/steps/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stepId, direction }),
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error ?? 'Failed to reorder')
    }
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.id === stepId)
      if (idx === -1) return prev
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= prev.length) return prev
      const next = [...prev]
      const tempOrder = next[idx].order_by
      next[idx] = { ...next[idx], order_by: next[swapIdx].order_by }
      next[swapIdx] = { ...next[swapIdx], order_by: tempOrder }
      return direction === 'up'
        ? [...next.slice(0, swapIdx), next[idx], next[swapIdx], ...next.slice(swapIdx + 2)]
        : [...next.slice(0, idx), next[swapIdx], next[idx], ...next.slice(idx + 2)]
    })
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setCreateError('')
    try {
      const res = await fetch(`/api/flavors/${flavorId}/steps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          humor_flavor_step_type_id: newStepTypeId ? Number(newStepTypeId) : null,
          llm_input_type_id: newInputTypeId ? Number(newInputTypeId) : null,
          llm_output_type_id: newOutputTypeId ? Number(newOutputTypeId) : null,
          llm_model_id: newModelId ? Number(newModelId) : null,
          llm_temperature: newTemperature ? Number(newTemperature) : 0.7,
          description: newDescription || null,
          llm_system_prompt: newSystemPrompt || null,
          llm_user_prompt: newUserPrompt || null,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to create step')
      }
      const newStep = await res.json()
      setSteps((prev) => [...prev, newStep])
      setShowNewForm(false)
      setNewStepTypeId('')
      setNewInputTypeId('')
      setNewOutputTypeId('')
      setNewModelId('')
      setNewTemperature('0.7')
      setNewDescription('')
      setNewSystemPrompt('')
      setNewUserPrompt('')
      router.refresh()
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Prompt Chain Steps</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {steps.length} step{steps.length !== 1 ? 's' : ''} — executed in order
          </p>
        </div>
        <button onClick={() => setShowNewForm(!showNewForm)} className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition-colors">
          + Add Step
        </button>
      </div>

      {showNewForm && (
        <form onSubmit={handleCreate} className="mb-6 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/50 rounded-xl p-4 flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">New Step</h3>
          {createError && <p className="text-xs text-red-600 dark:text-red-400">{createError}</p>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Step Type</label>
              <select value={newStepTypeId} onChange={(e) => setNewStepTypeId(e.target.value)} className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500">
                <option value="">— none —</option>
                {stepTypes.map((st) => <option key={st.id} value={st.id}>{st.slug}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">LLM Model</label>
              <select value={newModelId} onChange={(e) => setNewModelId(e.target.value)} className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500">
                <option value="">— none —</option>
                {models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Input Type</label>
              <select value={newInputTypeId} onChange={(e) => setNewInputTypeId(e.target.value)} required className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500">
                <option value="">— select —</option>
                {inputTypes.map((it) => <option key={it.id} value={it.id}>{it.slug}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Output Type</label>
              <select value={newOutputTypeId} onChange={(e) => setNewOutputTypeId(e.target.value)} required className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500">
                <option value="">— select —</option>
                {outputTypes.map((ot) => <option key={ot.id} value={ot.id}>{ot.slug}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Temperature</label>
            <input type="number" min="0" max="2" step="0.1" value={newTemperature} onChange={(e) => setNewTemperature(e.target.value)} className="w-32 px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Description</label>
            <input type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="What does this step do?" className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">System Prompt</label>
            <textarea value={newSystemPrompt} onChange={(e) => setNewSystemPrompt(e.target.value)} rows={3} placeholder="System prompt for this step..." className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none font-mono" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">User Prompt</label>
            <textarea value={newUserPrompt} onChange={(e) => setNewUserPrompt(e.target.value)} rows={3} placeholder="User prompt for this step..." className="w-full px-2 py-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none font-mono" />
          </div>

          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={creating} className="px-4 py-1.5 rounded bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium transition-colors disabled:opacity-50">
              {creating ? 'Adding...' : 'Add Step'}
            </button>
            <button type="button" onClick={() => { setShowNewForm(false); setCreateError('') }} className="px-4 py-1.5 rounded border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs transition-colors">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {steps.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            index={index}
            total={steps.length}
            models={models}
            stepTypes={stepTypes}
            inputTypes={inputTypes}
            outputTypes={outputTypes}
            flavorId={flavorId}
            onRefresh={handleRefresh}
            onMove={handleMove}
            onDelete={handleDelete}
          />
        ))}
        {steps.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-600">
            <p className="font-medium text-sm">No steps yet</p>
            <p className="text-xs mt-1">Add steps to define this humor flavor&apos;s prompt chain</p>
          </div>
        )}
      </div>
    </div>
  )
}
