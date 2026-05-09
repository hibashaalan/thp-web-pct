export const dynamic = 'force-dynamic'

import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

type FlavorVoteStat = {
  flavor_id: number
  flavor_slug: string
  caption_count: number
  funny: number
  meh: number
}

type TopCaption = {
  id: string
  content: string
  funny: number
  meh: number
  image_url: string | null
  flavor_slug: string
}

export default async function StatsPage() {
  await requireAdmin()
  const admin = createAdminClient()

  const [totalCaptionsRes, totalVotesRes, allVotesRes, topVotesRes] = await Promise.all([
    admin.from('captions').select('*', { count: 'exact', head: true }),
    admin.from('caption_votes').select('*', { count: 'exact', head: true }),
    admin
      .from('caption_votes')
      .select('vote_value, caption_id, captions!inner(id, content, humor_flavor_id, images!left(url), humor_flavors!inner(id, slug))')
      .limit(5000),
    admin
      .from('caption_votes')
      .select('caption_id, vote_value, captions!inner(id, content, humor_flavor_id, images!left(url), humor_flavors!inner(id, slug))')
      .eq('vote_value', 1)
      .limit(1000),
  ])

  const totalCaptions = totalCaptionsRes.count ?? 0
  const totalVotes = totalVotesRes.count ?? 0
  const allVotes = allVotesRes.data ?? []

  // Per-flavor stats
  const flavorMap: Record<number, FlavorVoteStat> = {}
  for (const v of allVotes) {
    const caption = v.captions as any
    const flavor = caption?.humor_flavors
    if (!flavor) continue
    const fid = flavor.id as number
    if (!flavorMap[fid]) {
      flavorMap[fid] = { flavor_id: fid, flavor_slug: flavor.slug, caption_count: 0, funny: 0, meh: 0 }
    }
    if (v.vote_value === 1) flavorMap[fid].funny++
    else if (v.vote_value === -1) flavorMap[fid].meh++
  }

  // caption count per flavor (separate: votes don't cover every caption)
  const captionFlavorRes = await admin
    .from('captions')
    .select('humor_flavor_id, humor_flavors!inner(id, slug)')
    .limit(5000)
  for (const row of captionFlavorRes.data ?? []) {
    const flavor = row.humor_flavors as any
    if (!flavor) continue
    const fid = flavor.id as number
    if (!flavorMap[fid]) {
      flavorMap[fid] = { flavor_id: fid, flavor_slug: flavor.slug, caption_count: 0, funny: 0, meh: 0 }
    }
    flavorMap[fid].caption_count++
  }

  const flavorStats = Object.values(flavorMap).sort((a, b) => (b.funny + b.meh) - (a.funny + a.meh))

  // Top captions by funny votes
  const captionVoteMap: Record<string, { content: string; funny: number; meh: number; image_url: string | null; flavor_slug: string }> = {}
  for (const v of allVotes) {
    const caption = v.captions as any
    if (!caption) continue
    const cid = caption.id as string
    if (!captionVoteMap[cid]) {
      captionVoteMap[cid] = {
        content: caption.content,
        funny: 0,
        meh: 0,
        image_url: caption.images?.url ?? null,
        flavor_slug: caption.humor_flavors?.slug ?? '',
      }
    }
    if (v.vote_value === 1) captionVoteMap[cid].funny++
    else if (v.vote_value === -1) captionVoteMap[cid].meh++
  }

  const topCaptions: TopCaption[] = Object.entries(captionVoteMap)
    .map(([id, d]) => ({ id, ...d }))
    .sort((a, b) => b.funny - a.funny)
    .slice(0, 10)

  const totalFunny = allVotes.filter((v) => v.vote_value === 1).length
  const totalMeh = allVotes.filter((v) => v.vote_value === -1).length
  const funnyPct = totalVotes > 0 ? Math.round((totalFunny / totalVotes) * 100) : 0

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Caption Statistics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Aggregated ratings from user votes across all flavors.
        </p>
      </div>

      {/* Top-level stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Captions', value: totalCaptions },
          { label: 'Total Votes', value: totalVotes },
          { label: 'Funny Votes', value: totalFunny },
          { label: 'Meh Votes', value: totalMeh },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5"
          >
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">{label}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white font-mono">{value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Sentiment bar */}
      {totalVotes > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Overall Sentiment</h2>
            <span className="text-sm font-mono text-purple-600 dark:text-purple-400">{funnyPct}% Funny</span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all"
              style={{ width: `${funnyPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400 dark:text-slate-500">
            <span>Funny ({totalFunny})</span>
            <span>Meh ({totalMeh})</span>
          </div>
        </div>
      )}

      {/* Per-flavor breakdown */}
      {flavorStats.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Per-Flavor Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="text-left pb-2 pr-4 font-medium">Flavor</th>
                  <th className="text-right pb-2 px-4 font-medium">Captions</th>
                  <th className="text-right pb-2 px-4 font-medium">Funny</th>
                  <th className="text-right pb-2 px-4 font-medium">Meh</th>
                  <th className="text-right pb-2 pl-4 font-medium">Funny %</th>
                </tr>
              </thead>
              <tbody>
                {flavorStats.map((f) => {
                  const total = f.funny + f.meh
                  const pct = total > 0 ? Math.round((f.funny / total) * 100) : null
                  return (
                    <tr
                      key={f.flavor_id}
                      className="border-b border-slate-50 dark:border-slate-800/50 last:border-0"
                    >
                      <td className="py-2.5 pr-4">
                        <span className="font-mono text-purple-700 dark:text-purple-400 text-xs bg-purple-50 dark:bg-purple-900/30 px-1.5 py-0.5 rounded">
                          {f.flavor_slug}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right text-slate-700 dark:text-slate-300 font-mono">{f.caption_count}</td>
                      <td className="py-2.5 px-4 text-right text-green-600 dark:text-green-400 font-mono">{f.funny}</td>
                      <td className="py-2.5 px-4 text-right text-red-500 dark:text-red-400 font-mono">{f.meh}</td>
                      <td className="py-2.5 pl-4 text-right">
                        {pct !== null ? (
                          <span className={`font-mono text-xs font-semibold ${pct >= 60 ? 'text-green-600 dark:text-green-400' : pct >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'}`}>
                            {pct}%
                          </span>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top captions */}
      {topCaptions.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Top Rated Captions</h2>
          <div className="flex flex-col gap-3">
            {topCaptions.map((c, i) => (
              <div
                key={c.id}
                className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
              >
                <span className="text-xs font-mono font-bold text-purple-500 dark:text-purple-400 mt-0.5 shrink-0 w-5">
                  #{i + 1}
                </span>
                {c.image_url && (
                  <img
                    src={c.image_url}
                    alt=""
                    className="w-10 h-10 rounded-md object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-snug line-clamp-2">{c.content}</p>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-mono mt-0.5 inline-block">{c.flavor_slug}</span>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400 font-mono">{c.funny} funny</p>
                  {c.meh > 0 && <p className="text-xs text-red-400 font-mono">{c.meh} meh</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalVotes === 0 && (
        <div className="text-center py-16 text-slate-400 dark:text-slate-600">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-base font-medium">No votes yet</p>
          <p className="text-sm mt-1">Caption votes will appear here once users start rating.</p>
        </div>
      )}
    </div>
  )
}
