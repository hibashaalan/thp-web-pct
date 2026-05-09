export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import TestCaptionGenerator from './_components/TestCaptionGenerator'
import FlavorCaptions from './_components/FlavorCaptions'

export default async function TestFlavorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const [flavorRes, captionsRes, testImagesRes, stepsRes] = await Promise.all([
    admin.from('humor_flavors').select('id, slug, description').eq('id', Number(id)).single(),
    admin.from('captions')
      .select('id, content, created_datetime_utc, images!left(id, url)')
      .eq('humor_flavor_id', Number(id))
      .order('created_datetime_utc', { ascending: false })
      .limit(20),
    admin.from('images').select('id, url').eq('is_common_use', true).order('id'),
    admin.from('humor_flavor_steps').select('id').eq('humor_flavor_id', Number(id)),
  ])

  if (flavorRes.error || !flavorRes.data) notFound()

  const flavor = flavorRes.data
  const captions = captionsRes.data ?? []
  const testImages = testImagesRes.data ?? []
  const stepCount = stepsRes.data?.length ?? 0

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link href={`/flavors/${id}`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
          ← Back to flavor
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Test Flavor</h1>
          <span className="text-sm font-mono bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
            {flavor.slug}
          </span>
        </div>
        {flavor.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{flavor.description}</p>
        )}
      </div>

      {stepCount === 0 ? (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-6 text-center">
          <p className="text-amber-800 dark:text-amber-300 font-semibold mb-1">No steps configured</p>
          <p className="text-sm text-amber-700 dark:text-amber-400 mb-4">
            This flavor has no prompt chain steps. Add at least one step before generating captions.
          </p>
          <Link
            href={`/flavors/${id}`}
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium py-2 px-4 rounded transition-colors"
          >
            Add Steps
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          <TestCaptionGenerator flavorId={flavor.id} flavorSlug={flavor.slug} testImages={testImages} />
          <FlavorCaptions captions={captions} />
        </div>
      )}
    </div>
  )
}
