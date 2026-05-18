'use client'

import { useParams } from 'next/navigation'

import { Skeleton } from '@/components/ui/skeleton'
import { useRankings, VALID_PERIODS } from '@/services/ranking'

import { ModelsSection } from './_components/ModelsSection'
import { PulseSection } from './_components/PulseSection'

export default function RankingsPage() {
  const params = useParams()

  const period: Ranking.Period = VALID_PERIODS.includes(params.period as Ranking.Period) ? (params.period as Ranking.Period) : 'today'

  const { data, isLoading, error } = useRankings(period)
  const snapshot = data?.data as Ranking.Snapshots

  if (isLoading)
    return (
      <div className="space-y-6">
        <Skeleton className="h-[420px] w-full rounded-xl" />
        <Skeleton className="h-[360px] w-full rounded-xl" />
        <Skeleton className="h-[180px] w-full rounded-xl" />
      </div>
    )

  if (error) return

  return (
    <div className="relative mx-auto w-full max-w-[1280px] space-y-8 px-3 pt-16 pb-10 sm:px-6 sm:pt-20 sm:pb-12 xl:px-8">
      <ModelsSection
        history={snapshot.models_history}
        rows={snapshot.models}
        period={period}
      />

      <PulseSection
        movers={snapshot.top_movers}
        droppers={snapshot.top_droppers}
      />
    </div>
  )
}
