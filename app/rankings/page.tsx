'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { Skeleton } from '@/components/ui/skeleton'
import { useRankings, VALID_PERIODS } from '@/services/ranking'

import { MarketShareSection } from './_components/MarketShareSection'
import { ModelsSection } from './_components/ModelsSection'
import { PulseSection } from './_components/PulseSection'
import { RankingsHero } from './_components/RankingsHero'

export default function RankingsPage() {
  const router = useRouter()

  const searchParams = useSearchParams()
  const searchPeriod = searchParams.get('period') as Ranking.Period

  const period = VALID_PERIODS.includes(searchPeriod) ? searchPeriod : 'today'

  const { data, isLoading, error } = useRankings(period)
  const snapshot = data?.data as Ranking.Snapshots

  const handlePeriodChange = (next: Ranking.Period) => {
    router.push(`/rankings?period=${next}`)
  }

  if (isLoading) return <RankingsLoading />

  if (error)
    return (
      <>
        <RankingsError message={error instanceof Error ? error.message : 'Unable to load rankings data'} />
      </>
    )

  return (
    <>
      <RankingsHero
        period={period}
        onPeriodChange={handlePeriodChange}
      />

      <ModelsSection
        history={snapshot.models_history}
        rows={snapshot.models}
        period={period}
      />

      <MarketShareSection
        history={snapshot.vendor_share_history}
        rows={snapshot.vendors}
        period={period}
      />

      <PulseSection
        movers={snapshot.top_movers}
        droppers={snapshot.top_droppers}
      />
    </>
  )
}

function RankingsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[420px] w-full rounded-xl" />
      <Skeleton className="h-[360px] w-full rounded-xl" />
      <Skeleton className="h-[180px] w-full rounded-xl" />
    </div>
  )
}

function RankingsError(props: { message: string }) {
  return (
    <div className="bg-card rounded-xl border border-dashed px-6 py-12 text-center">
      <h2 className="text-foreground text-base font-semibold">{'Unable to load rankings'}</h2>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">{props.message}</p>
    </div>
  )
}
