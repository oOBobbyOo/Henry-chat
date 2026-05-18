import { useQuery } from '@tanstack/react-query'

import { request } from '@/lib/request'

export const VALID_PERIODS: Ranking.Period[] = ['today', 'week', 'month', 'year', 'all']

export const RankingService = {
  getRankings: (period: Ranking.Period) =>
    request.get<Ranking.Response>('/api/rankings', {
      baseURL: process.env.NEXT_PUBLIC_HOST_URL,
      params: { period },
    }),
}

export const RANKING_QUERY_KEYS = {
  rankings: ['rankings'],
}

export function useRankings(period: Ranking.Period) {
  return useQuery({
    queryKey: [...RANKING_QUERY_KEYS.rankings, period],
    queryFn: () => RankingService.getRankings(period),
    staleTime: 5 * 60 * 1000,
  })
}
