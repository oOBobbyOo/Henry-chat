'use client'

import { useMemo, useState } from 'react'

import { Search } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { Skeleton } from '@/components/ui/skeleton'
import { usePlazaPostsQuery, usePlazaTagsQuery } from '@/services/plaza'

/** 灵感 feed 的类型 tab(全部/图片/视频/3D) */
const FEED_TABS = [
  { key: 'all', labelKey: 'Inspiration' },
  { key: 'image', labelKey: 'Image' },
  { key: 'video', labelKey: 'Video' },
  { key: '3d', labelKey: '3D' },
] as const

type FeedTab = (typeof FEED_TABS)[number]['key']

/**
 * 筛选条 + 瀑布流作品卡
 */
export function PlazaFeedSection() {
  const { t } = useT('plaza')
  const { data: tagsData } = usePlazaTagsQuery()
  const { data: postsData, isLoading } = usePlazaPostsQuery()

  const [feedTab, setFeedTab] = useState<FeedTab>('all')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [keyword, setKeyword] = useState('')

  const tags = useMemo(() => tagsData?.data.items ?? [], [tagsData])
  const posts = useMemo(() => postsData?.data.items ?? [], [postsData])

  /** 前端过滤:类型 tab + 分类标签 + 关键词 */
  const filtered = useMemo(() => {
    return posts.filter((post) => {
      if (feedTab !== 'all' && post.assetType !== feedTab) return false
      if (activeTag && !post.tags.includes(activeTag)) return false
      if (keyword) {
        const kw = keyword.toLowerCase()
        const hit = post.title.toLowerCase().includes(kw) || post.tags.some((tg) => tg.toLowerCase().includes(kw))
        if (!hit) return false
      }
      return true
    })
  }, [posts, feedTab, activeTag, keyword])

  return (
    <section className="w-full pt-1">
      {/* 筛选条:feed tab 行 */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex min-w-0 items-center gap-3 overflow-x-auto">
          <div className="inline-flex items-center">
            {FEED_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                data-active={feedTab === tab.key}
                onClick={() => setFeedTab(tab.key)}
                className="relative inline-flex h-10 items-center px-3.5 text-[16px] font-medium whitespace-nowrap text-[rgba(110,126,148,0.72)] transition-colors first:pl-0 hover:text-foreground data-[active=true]:text-foreground dark:text-zinc-500 dark:hover:text-zinc-200 dark:data-[active=true]:text-[#e8f2ff]"
              >
                {t(tab.labelKey)}
                {feedTab === tab.key && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 bottom-0 h-[1.5px] rounded-full bg-gradient-to-r from-blue-500/0 via-blue-400/90 to-blue-500/0"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 次级筛选:分类 chip + 搜索框 */}
      <div className="mt-3 flex flex-col gap-3 pb-2 xl:flex-row xl:items-center">
        <div className="min-w-0 overflow-x-auto">
          <div className="inline-flex items-center">
            <button
              type="button"
              data-active={activeTag === null}
              onClick={() => setActiveTag(null)}
              className="mr-1 inline-flex h-[26px] shrink-0 items-center rounded-full border border-transparent px-[11px] text-[14px] font-medium whitespace-nowrap text-[rgba(110,126,148,0.72)] transition hover:bg-black/5 data-[active=true]:border-white/12 data-[active=true]:bg-white/9 data-[active=true]:text-[#e8f2ff] dark:text-zinc-500 dark:hover:bg-white/5 dark:data-[active=true]:border-white/12 dark:data-[active=true]:bg-white/9 dark:data-[active=true]:text-[#e8f2ff]"
            >
              {t('All')}
            </button>
            {tags.map((tag) => (
              <button
                key={tag.tag}
                type="button"
                data-active={activeTag === tag.tag}
                onClick={() => setActiveTag((prev) => (prev === tag.tag ? null : tag.tag))}
                className="mr-1 inline-flex h-[26px] shrink-0 items-center rounded-full border border-transparent px-[11px] text-[14px] font-medium whitespace-nowrap text-[rgba(110,126,148,0.72)] transition hover:bg-black/5 data-[active=true]:border-white/12 data-[active=true]:bg-white/9 data-[active=true]:text-[#e8f2ff] dark:text-zinc-500 dark:hover:bg-white/5 dark:data-[active=true]:border-white/12 dark:data-[active=true]:bg-white/9 dark:data-[active=true]:text-[#e8f2ff]"
              >
                {t(`tag.${tag.tag}`)}
              </button>
            ))}
          </div>
        </div>
        <label className="group flex h-10 w-full items-center gap-2 rounded-full border bg-card px-4 shadow-sm transition focus-within:ring-2 focus-within:ring-cyan-300/40 dark:border-white/8 dark:bg-white/4 xl:ml-auto xl:w-[320px]">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={t('Search prompts, authors, tags')}
            className="h-full w-full bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
          />
        </label>
      </div>

      {/* 瀑布流 */}
      {isLoading ? (
        <div className="mt-2 flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-1 flex-col gap-4"
            >
              <Skeleton className="h-64 rounded-lg" />
              <Skeleton className="h-40 rounded-lg" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[15px] border border-dashed px-6 py-16 text-center text-sm text-muted-foreground">{t('No works match the current filters')}</div>
      ) : (
        <div className="mt-2 flex items-start gap-4 [column-fill:_balance]">
          <PlazaMasonry posts={filtered} />
        </div>
      )}
      {!isLoading && filtered.length > 0 && <p className="py-6 text-center text-[12px] text-muted-foreground">{t('You have seen all works')}</p>}
    </section>
  )
}

/** CSS 多列瀑布流(4 列,对齐参考站 1560px 容器下的密度) */
function PlazaMasonry(props: { posts: Plaza.Post[] }) {
  const { t } = useT('plaza')
  return (
    <div className="w-full columns-2 gap-4 lg:columns-3 xl:columns-4">
      {props.posts.map((post) => {
        const ratio = post.width && post.height ? post.width / post.height : 1
        return (
          <article
            key={post.id}
            className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg bg-black/60"
          >
            <div
              className="relative w-full"
              style={{ aspectRatio: `${ratio}` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.thumbnailUrl}
                alt={post.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.045]"
              />
              {/* 视频角标 */}
              {post.assetType === 'video' && (
                <span className="pointer-events-none absolute top-2.5 left-2.5 z-10 inline-flex h-6 items-center rounded-full bg-black/55 px-2.5 text-[11px] font-medium text-white backdrop-blur-sm">
                  {t('Video')}
                </span>
              )}
              {/* 官方精选角标 */}
              {post.isStaffPick && post.assetType !== 'video' && (
                <span className="pointer-events-none absolute top-2.5 left-2.5 z-10 inline-flex h-6 items-center rounded-full bg-amber-400/90 px-2.5 text-[11px] font-medium text-amber-950">
                  {t('Staff pick')}
                </span>
              )}
              {/* 底部渐变 + hover 信息 */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 opacity-90" />
              <div className="plaza-card-hover-reveal absolute inset-x-0 bottom-0 z-10 p-3">
                <p className="truncate text-left text-[12.5px] font-medium text-white">{post.title}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="inline-flex h-7 items-center rounded-full bg-white/12 px-3 text-[11.5px] font-medium text-white backdrop-blur-sm transition group-hover:bg-white/22">
                    {t('Remix')}
                  </span>
                  <span className="text-[11.5px] text-white/70">→</span>
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
