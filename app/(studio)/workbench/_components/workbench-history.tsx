'use client'

import { useMemo, useState } from 'react'

import { ArrowDown, History, RefreshCw, Search } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'

/**
 * Workbench 右侧创作历史 —— 搜索 / 时间筛选 / 记录卡片·棋盘视图 / 类型 tabs / 空态社群推荐
 */

interface WorkbenchHistoryProps {
  /** 创作历史(config 之外单独接口) */
  history: Workbench.HistoryItem[]
  /** 空态社群灵感卡 */
  communityCases: Workbench.CommunityCase[]
}

/** 时间筛选 pill 的 i18n key 映射 */
const RANGE_KEYS: Record<Workbench.HistoryRange, string> = {
  all: 'All time',
  today: 'Today',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
}

/** 类型 tabs(对应 AssetModality,不含 all) */
const MODALITIES: Array<{ key: Workbench.AssetModality; labelKey: string }> = [
  { key: 'image', labelKey: 'Image' },
  { key: 'video', labelKey: 'Video' },
  { key: 'sound', labelKey: 'Sound' },
  { key: 'music', labelKey: 'Music' },
  { key: 'voice', labelKey: 'Voice' },
]

/** 社群卡封面占位(渐变底 + 模态图标,签名 CDN URL 会过期故用本地占位) */
function CaseCover() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgba(56,152,188,0.25),rgba(56,103,255,0.18))] dark:bg-[linear-gradient(135deg,rgba(56,152,188,0.2),rgba(112,119,224,0.16))]">
      <History
        aria-hidden
        className="h-8 w-8 text-white/70"
        strokeWidth={1.5}
      />
    </div>
  )
}

export function WorkbenchHistory({ history, communityCases }: WorkbenchHistoryProps) {
  const { t } = useT('workbench')

  const [keyword, setKeyword] = useState('')
  const [range, setRange] = useState<Workbench.HistoryRange>('all')
  const [view, setView] = useState<Workbench.HistoryView>('cards')
  const [modality, setModality] = useState<Workbench.AssetModality | 'all'>('all')

  // 类型 tab 过滤(有记录时生效;当前 mock 历史为空,结构先行)
  const filtered = useMemo(
    () =>
      history.filter((item) => {
        if (modality !== 'all' && item.modality !== modality) return false
        if (!keyword.trim()) return true
        const kw = keyword.trim().toLowerCase()
        return item.title.toLowerCase().includes(kw) || item.modelName.toLowerCase().includes(kw)
      }),
    [history, modality, keyword],
  )

  const empty = filtered.length === 0

  return (
    <div className="flex h-full min-h-0 min-w-0">
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[24px] border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(245,249,255,0.9))] shadow-[0_10px_30px_rgba(8,20,48,0.05)] backdrop-blur-md dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(15,22,36,0.92),rgba(9,14,25,0.9))]">
        {/* 头部:标题 + 刷新 */}
        <div className="border-b border-[rgba(12,24,36,0.08)] px-5 pt-4 pb-0 dark:border-white/8">
          <div className="flex items-end justify-between gap-3 pb-3">
            <div className="min-w-0">
              <div className="flex items-baseline gap-2.5">
                <h2 className="text-[18px] leading-none font-semibold whitespace-nowrap text-[#091423] dark:text-[#eef4ff]">{t('Creation history')}</h2>
              </div>
            </div>
            <button
              className="inline-flex h-8 max-w-full min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[rgba(12,24,36,0.1)] bg-[rgba(255,255,255,0.9)] px-3 text-[12px] text-[#2e4268] transition-colors hover:border-[rgba(56,103,255,0.35)] dark:border-white/10 dark:bg-white/5 dark:text-[#b6c4dc] dark:hover:border-white/20"
              type="button"
            >
              <RefreshCw
                className="h-3.5 w-3.5"
                strokeWidth={1.75}
              />
              {t('Refresh history')}
            </button>
          </div>

          {/* 搜索 */}
          <label className="block">
            <div className="relative">
              <Search
                aria-hidden
                className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#8a9bc0] dark:text-[#8a9bc0]"
                strokeWidth={1.75}
              />
              <input
                className="h-10 w-full rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(245,249,255,0.9)] pr-3 pl-9 text-[13px] text-[#091423] transition-colors outline-none placeholder:text-[#8a9bc0] focus:border-[rgba(56,103,255,0.4)] dark:border-white/10 dark:bg-white/5 dark:text-[#eef4ff] dark:placeholder:text-[#8a9bc0]"
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={t('Search history')}
                value={keyword}
              />
            </div>
          </label>

          {/* 时间 pills + 视图切换 */}
          <div className="mt-2.5 mb-2 flex flex-col gap-2 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                {(Object.keys(RANGE_KEYS) as Workbench.HistoryRange[]).map((key) => (
                  <button
                    className={cn(
                      'inline-flex h-7 items-center rounded-full border px-3 text-[12px] transition-colors',
                      range === key
                        ? 'border-[rgba(56,103,255,0.35)] bg-[rgba(56,103,255,0.1)] font-medium text-[#3867ff] dark:text-[#8fa5ff]'
                        : 'border-[rgba(12,24,36,0.1)] text-[#5b6b8c] hover:bg-[rgba(12,24,36,0.04)] dark:border-white/10 dark:text-[#8a9bc0] dark:hover:bg-white/6',
                    )}
                    key={key}
                    onClick={() => setRange(key)}
                    type="button"
                  >
                    {t(RANGE_KEYS[key])}
                  </button>
                ))}
              </div>
            </div>
            <div className="xl:shrink-0">
              {/* 记录卡片 / 棋盘视图 segment */}
              <div className="inline-flex items-center gap-0.5 rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-[rgba(245,249,255,0.9)] p-[2px] dark:border-white/10 dark:bg-white/5">
                {(
                  [
                    { key: 'cards', label: 'Record cards' },
                    { key: 'board', label: 'Board view' },
                  ] as const
                ).map((opt) => (
                  <button
                    className={cn(
                      'inline-flex h-8 items-center gap-1.5 rounded-[9px] px-3 text-[12px] font-semibold transition-colors',
                      view === opt.key
                        ? 'bg-white text-[#091423] shadow-[0_1px_3px_rgba(8,20,48,0.12)] dark:bg-white/12 dark:text-[#eef4ff]'
                        : 'text-[#8a9bc0] hover:text-[#2e4268] dark:hover:text-[#b6c4dc]',
                    )}
                    key={opt.key}
                    onClick={() => setView(opt.key)}
                    type="button"
                  >
                    <span className="whitespace-nowrap">{t(opt.label)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 类型 tabs */}
          <div className="flex items-center gap-3">
            <div className="-mx-5 min-w-0 flex-1 [scrollbar-width:none] overflow-x-auto px-5 [&::-webkit-scrollbar]:hidden">
              <div className="flex items-center gap-5">
                {[{ key: 'all' as const, labelKey: 'All' }, ...MODALITIES].map((tab) => {
                  const active = modality === tab.key
                  return (
                    <button
                      className={cn(
                        'relative pb-2.5 text-[13px] font-medium whitespace-nowrap transition-colors',
                        active ? 'text-[#091423] dark:text-[#eef4ff]' : 'text-[#8a9bc0] hover:text-[#2e4268] dark:hover:text-[#b6c4dc]',
                      )}
                      key={tab.key}
                      onClick={() => setModality(tab.key as Workbench.AssetModality | 'all')}
                      type="button"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <span>{t(tab.labelKey)}</span>
                      </span>
                      <span className={cn('absolute right-0 -bottom-px left-0 h-[2px] rounded-full bg-gradient-to-r from-[#3898bc] to-[#3867ff]', active ? 'opacity-100' : 'opacity-0')} />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 内容区 */}
        <div className="relative min-h-0 flex-1">
          <div className="h-full min-h-0 overflow-y-auto overscroll-contain scrollbar-slim">
            {empty ? (
              /* 空态 + 社群灵感卡 */
              <div className="mx-3 my-3 rounded-[22px] border border-dashed border-[rgba(12,24,36,0.14)] p-5 dark:border-white/20">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[16px] font-semibold text-[#091423] dark:text-[#eef4ff]">{t('No creation records for this filter')}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      className="inline-flex cursor-pointer items-center rounded-full border border-[rgba(12,24,36,0.1)] bg-[rgba(245,249,255,0.9)] px-3 py-1.5 text-[12px] text-[#2e4268] transition-colors hover:border-[rgba(56,103,255,0.35)] dark:border-white/10 dark:bg-white/5 dark:text-[#b6c4dc]"
                      type="button"
                    >
                      {t('Shuffle')}
                    </button>
                  </div>
                </div>
                {/* 社群灵感 pill */}
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[rgba(12,24,36,0.1)] bg-[rgba(245,249,255,0.9)] px-3 py-1.5 text-[12px] text-[#2e4268] dark:border-white/10 dark:bg-white/5 dark:text-[#b6c4dc]">
                  <span className="h-2 w-2 rounded-full bg-[#3867ff] shadow-[0_0_10px_rgba(56,103,255,0.85)]" />
                  {t('Community picks')}
                </div>
                {/* 社群卡 3 列 */}
                <div className="mt-4 grid w-full gap-3 xl:grid-cols-3">
                  {communityCases.map((item) => (
                    <article
                      className="overflow-hidden rounded-[18px] border border-[rgba(12,24,36,0.08)] text-left shadow-[0_16px_34px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.02)] transition-transform duration-300 hover:-translate-y-[2px] dark:border-white/8 dark:shadow-[0_16px_34px_rgba(2,6,23,0.4)]"
                      key={item.id}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-[rgba(245,249,255,0.9)] dark:bg-white/5">
                        <CaseCover />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,14,0.02),rgba(4,7,14,0.16)_45%,rgba(4,7,14,0.82)_100%)]" />
                        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                          {t(item.modality === 'image' ? 'Image' : 'Video')}
                        </div>
                        {item.featured ? (
                          <div className="absolute top-3 right-3 rounded-full border border-white/24 bg-black/35 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">{t('Featured')}</div>
                        ) : null}
                        {item.durationSeconds ? (
                          <div className="absolute right-3 bottom-3 rounded-full border border-white/24 bg-black/35 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                            {item.durationSeconds}s
                          </div>
                        ) : null}
                      </div>
                      <div className="border-t border-[rgba(12,24,36,0.08)] px-3 py-3 dark:border-white/8">
                        <div className="flex items-center gap-3">
                          <div className="min-w-0 flex-1 text-left">
                            <p className="truncate text-[13px] font-medium text-[#091423] dark:text-[#eef4ff]">{item.title}</p>
                          </div>
                          <button
                            className="inline-flex shrink-0 cursor-pointer items-center rounded-full border border-[rgba(12,24,36,0.1)] px-2.5 py-1 text-[11px] text-[#2e4268] transition-colors hover:border-[rgba(56,103,255,0.35)] hover:text-[#3867ff] dark:border-white/10 dark:text-[#b6c4dc] dark:hover:text-[#8fa5ff]"
                            type="button"
                          >
                            {t('Remix')}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              /* 有记录:按视图模式渲染(棋盘视图 = 2 列紧凑网格) */
              <div className={cn('grid gap-3 p-3', view === 'cards' ? 'grid-cols-1' : 'grid-cols-2 xl:grid-cols-3')}>
                {filtered.map((item) => (
                  <article
                    className="overflow-hidden rounded-[18px] border border-[rgba(12,24,36,0.08)] dark:border-white/8"
                    key={item.id}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[rgba(245,249,255,0.9)] dark:bg-white/5">
                      <CaseCover />
                    </div>
                    <div className="border-t border-[rgba(12,24,36,0.08)] px-3 py-3 dark:border-white/8">
                      <p className="truncate text-[13px] font-medium text-[#091423] dark:text-[#eef4ff]">{item.title}</p>
                      <p className="mt-0.5 truncate text-[11px] text-[#8a9bc0] dark:text-[#8a9bc0]">{item.modelName}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
          {/* 右下角浮动按钮(回到底部) */}
          <button
            aria-label={t('Clear')}
            className="absolute right-4 bottom-4 z-10 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[rgba(12,24,36,0.1)] bg-white text-[#2e4268] shadow-[0_8px_20px_rgba(8,20,48,0.12)] transition-colors hover:border-[rgba(56,103,255,0.35)] hover:text-[#3867ff] dark:border-white/10 dark:bg-[#101828] dark:text-[#b6c4dc]"
            type="button"
          >
            <ArrowDown
              className="h-4 w-4"
              strokeWidth={1.75}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
