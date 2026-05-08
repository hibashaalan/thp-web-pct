export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import TestCaptionGenerator from './_components/TestCaptionGenerator'
import FlavorCaptions from './_components/FlavorCaptions'

export default async function TestFlavorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const [flavorRes, captionsRes, testImagesRes] = await Promise.all([
    admin.from('flavors').select('id, name').eq('id', id).single(),
    admin.from('captions')
      .select('id, output, created_at, image_url')
      .eq('flavor_id', id)
      .order('created_at', { ascending: false })
      .limit(20),
    admin.from('images').select('id, url').eq('is_common_use', true).order('id'),
  ])

  if (flavorRes.error || !flavorRes.data) {
    notFound()
  }

  const flavor = flavorRes.data
  const captions = captionsRes.data ?? []
  const testImages = testImagesRes.data ?? []

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <Link href={`/flavors/${id}`} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
          ← Back to flavor
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Test Flavor</h1>
          <span className="text-sm font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
            {flavor.name}
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        <TestCaptionGenerator flavorId={flavor.id} flavorName={flavor.name} testImages={testImages} />
        <FlavorCaptions captions={captions} />
      </div>
    </div>
  )
}
