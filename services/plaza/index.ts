import { useQuery } from '@tanstack/react-query'

import { request } from '@/lib/request'

/**
 * 广场(Plaza)服务层
 * 数据走本地 API 路由(mock)
 */
export const PlazaService = {
  /** 社区作品列表(瀑布流) */
  getPosts: () =>
    request.get<Plaza.PostsResponse>('/api/plaza/posts', {
      baseURL: process.env.NEXT_PUBLIC_HOST_URL,
    }),
  /** Agent 技能列表(横滑卡片) */
  getSkills: () =>
    request.get<Plaza.SkillsResponse>('/api/plaza/skills', {
      baseURL: process.env.NEXT_PUBLIC_HOST_URL,
    }),
  /** 热门标签(分类筛选条) */
  getTags: () =>
    request.get<Plaza.TagsResponse>('/api/plaza/tags', {
      baseURL: process.env.NEXT_PUBLIC_HOST_URL,
    }),
}

export const PLAZA_QUERY_KEYS = {
  posts: ['plaza-posts'],
  skills: ['plaza-skills'],
  tags: ['plaza-tags'],
}

/** 作品列表查询(非阻塞,瀑布流可渐进加载) */
export function usePlazaPostsQuery() {
  return useQuery({
    queryKey: PLAZA_QUERY_KEYS.posts,
    queryFn: PlazaService.getPosts,
    staleTime: 5 * 60 * 1000,
  })
}

/** 技能列表查询(非阻塞) */
export function usePlazaSkillsQuery() {
  return useQuery({
    queryKey: PLAZA_QUERY_KEYS.skills,
    queryFn: PlazaService.getSkills,
    staleTime: 10 * 60 * 1000,
  })
}

/** 热门标签查询(非阻塞) */
export function usePlazaTagsQuery() {
  return useQuery({
    queryKey: PLAZA_QUERY_KEYS.tags,
    queryFn: PlazaService.getTags,
    staleTime: 10 * 60 * 1000,
  })
}
