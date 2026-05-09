'use client'

import { useState } from 'react'
import type { Flavor } from '@/types'
import FlavorItem from './FlavorItem'

export default function FlavorListClient({ flavors }: { flavors: Flavor[] }) {
  const [search, setSearch] = useState('')

  const filtered = flavors.filter(
    (f) =>
      f.slug.toLowerCase().includes(search.toLowerCase()) ||
      (f.description ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-3">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search flavors..."
        className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-900 text-sm"
      />
      {filtered.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {search ? `No flavors match "${search}".` : 'No flavors yet. Create one above.'}
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((f) => (
            <FlavorItem key={f.id} flavor={f} />
          ))}
        </ul>
      )}
    </div>
  )
}
