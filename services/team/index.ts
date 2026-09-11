import { useQuery } from '@tanstack/react-query'

import { request } from '@/lib/request'

/**
 * 团队控制台(Team)页服务层
 * 数据走本地 API 路由(mock), /api/v1/workspaces
 */
export const TeamService = {
  /** 团队控制台聚合:当前工作区 + 空态特性卡 + 创建模板 */
  getConsole: () =>
    request.get<Team.ConsoleResponse>('/api/team/console', {
      baseURL: process.env.NEXT_PUBLIC_HOST_URL,
    }),
}

export const TEAM_QUERY_KEYS = {
  console: ['team-console'],
}

/** 团队控制台聚合查询(非阻塞) */
export function useTeamConsoleQuery() {
  return useQuery({
    queryKey: TEAM_QUERY_KEYS.console,
    queryFn: TeamService.getConsole,
    staleTime: 1 * 60 * 1000,
  })
}
