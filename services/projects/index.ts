import { useQuery } from '@tanstack/react-query'

import { request } from '@/lib/request'

/**
 * 项目(Projects)页服务层
 * 数据走本地 API 路由(mock)
 */
export const ProjectsService = {
  /** 技能市场列表 */
  getSkills: () => request.get<Projects.SkillsResponse>('/api/projects/skills', { baseURL: process.env.NEXT_PUBLIC_HOST_URL }),
  /** 最近项目列表(本地会话态) */
  getRecent: () => request.get<Projects.RecentResponse>('/api/projects/recent', { baseURL: process.env.NEXT_PUBLIC_HOST_URL }),
}

export const PROJECTS_QUERY_KEYS = {
  skills: ['projects-skills'],
  recent: ['projects-recent'],
}

/** 技能市场列表查询(非阻塞) */
export function useProjectsSkillsQuery() {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEYS.skills,
    queryFn: ProjectsService.getSkills,
    staleTime: 10 * 60 * 1000,
  })
}

/** 最近项目查询(非阻塞) */
export function useProjectsRecentQuery() {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEYS.recent,
    queryFn: ProjectsService.getRecent,
    staleTime: 1 * 60 * 1000,
  })
}
