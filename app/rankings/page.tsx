'use client'

import { useParams } from 'next/navigation'

import { Skeleton } from '@/components/ui/skeleton'
import { useRankings, VALID_PERIODS } from '@/services/ranking'

export default function RankingsPage() {
  const params = useParams()

  const period: Ranking.Period = VALID_PERIODS.includes(params.period as Ranking.Period) ? (params.period as Ranking.Period) : 'week'

  const { data, isLoading, error } = useRankings(period)

  console.log(data)
  console.log(isLoading)
  console.log(error)

  if (isLoading)
    return (
      <div className="space-y-6">
        <Skeleton className="h-[420px] w-full rounded-xl" />
        <Skeleton className="h-[360px] w-full rounded-xl" />
        <Skeleton className="h-[180px] w-full rounded-xl" />
      </div>
    )

  return <div>Rankings</div>
}
