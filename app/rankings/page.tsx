'use client'

import { useParams } from 'next/navigation'

import { useRankings, VALID_PERIODS } from '@/services/ranking'

export default function RankingsPage() {
  const params = useParams()

  const period: Ranking.Period = VALID_PERIODS.includes(params.period as Ranking.Period) ? (params.period as Ranking.Period) : 'week'

  const { data, isLoading, error } = useRankings(period)

  console.log(data)
  console.log(isLoading)
  console.log(error)

  return <div>Rankings</div>
}
