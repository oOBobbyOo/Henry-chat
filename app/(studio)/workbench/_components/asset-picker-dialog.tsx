'use client'

/**
 * 资产库选择弹窗 —— 参考站「我的素材」模态:
 *   头部(eyebrow + 标题 + 说明 + 圆形关闭)→ 工具栏(搜索 + 我收藏的筛选 + 已选计数 + 清空选择)
 *   → 资产行列表(56×56 缩略图 + 名称 + 可选择/已选择徽章 + 创建时间)→ 页脚(说明 + 取消 + 使用所选图片)
 * 单击选中(单选),确认后写入图片编辑面板的源图。
 */

import { useMemo, useState } from 'react'

import { Bookmark, Check, Image as ImageIcon, Search, X } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

/** 资产缩略图占位底色(mock 无真实图片,按资产 id 取固定渐变,保证渲染稳定) */
const THUMB_GRADIENTS = [
  'linear-gradient(135deg,rgba(56,152,188,0.32),rgba(56,103,255,0.22))',
  'linear-gradient(135deg,rgba(112,119,224,0.3),rgba(56,103,255,0.2))',
  'linear-gradient(135deg,rgba(56,103,255,0.26),rgba(93,175,206,0.24))',
  'linear-gradient(135deg,rgba(93,175,206,0.3),rgba(112,119,224,0.2))',
]

/** 按索引取占位渐变 */
function thumbGradient(index: number) {
  return THUMB_GRADIENTS[index % THUMB_GRADIENTS.length]
}

export function AssetPickerDialog({
  open,
  assets,
  onOpenChange,
  onConfirm,
}: {
  /** 是否打开 */
  open: boolean
  /** 资产库条目 */
  assets: Workbench.LibraryAsset[]
  /** 关闭回调 */
  onOpenChange: (open: boolean) => void
  /** 确认所选资产 */
  onConfirm: (asset: Workbench.LibraryAsset) => void
}) {
  const { t } = useT('workbench')
  const [keyword, setKeyword] = useState('')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // 仅图片可作源图;再按收藏筛选 + 关键词(资产名 / 模型名 / 格式)过滤
  const list = useMemo(() => {
    const kw = keyword.trim().toLowerCase()

    return assets
      .filter((item) => item.assetType === 'image')
      .filter((item) => !favoritesOnly || item.favorite)
      .filter(
        (item) => !kw || `${item.name} ${item.modelName} ${item.format}`.toLowerCase().includes(kw),
      )
  }, [assets, favoritesOnly, keyword])

  const selected = list.find((item) => item.id === selectedId) ?? null

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setKeyword('')
          setFavoritesOnly(false)
          setSelectedId(null)
        }
        onOpenChange(next)
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="flex h-[min(86vh,720px)] w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-[24px] border border-[rgba(12,24,36,0.08)] bg-white p-0 shadow-[0_32px_80px_-24px_rgba(15,23,42,0.3)] sm:max-w-[720px] dark:border-white/10 dark:bg-[linear-gradient(180deg,rgba(20,22,32,0.98),rgba(12,14,22,1))] dark:shadow-[0_32px_80px_-24px_rgba(0,0,0,0.7)]"
      >
        {/* 头部:eyebrow + 标题 + 说明 + 关闭 */}
        <div className="flex items-start justify-between gap-4 border-b border-[rgba(12,24,36,0.06)] px-5 py-4 dark:border-white/8">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#8296b4] dark:text-[#7b8aa8]">
              {t('My assets')}
            </p>
            <DialogTitle className="mt-1 text-lg font-semibold tracking-[-0.01em] text-[#091423] dark:text-[#eef4ff]">
              {t('Choose from asset library')}
            </DialogTitle>
            <p className="mt-2 text-[12px] leading-6 text-[#4a6080] dark:text-[#8fa5c4]">
              {t('Asset picker hint')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label={t('Close')}
            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[rgba(12,24,36,0.08)] bg-[#f7f9fd] text-[#0f1c3a] transition hover:border-[rgba(12,24,36,0.18)] dark:border-white/10 dark:bg-white/6 dark:text-[#eef4ff] dark:hover:border-white/20"
          >
            <X
              aria-hidden
              className="h-4 w-4"
              strokeWidth={1.75}
            />
          </button>
        </div>

        {/* 工具栏:搜索 + 我收藏的 + 已选计数 + 清空选择 */}
        <div className="flex flex-wrap items-center gap-3 border-b border-[rgba(12,24,36,0.06)] px-5 py-3 dark:border-white/8">
          <div className="min-w-[220px] flex-1">
            <div className="relative">
              <Search
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a9bc0]"
                strokeWidth={1.75}
              />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder={t('Search assets placeholder')}
                className="h-10 w-full rounded-[14px] border border-[rgba(12,24,36,0.1)] bg-[#f7f9fd] pl-8 pr-3 text-[13px] text-[#091423] outline-none transition placeholder:text-[#8a9bc0] focus:border-[rgba(56,103,255,0.35)] dark:border-white/10 dark:bg-white/5 dark:text-[#eef4ff] dark:placeholder:text-[#8a9bc0]"
              />
            </div>
          </div>
          <button
            type="button"
            aria-pressed={favoritesOnly}
            onClick={() => setFavoritesOnly((prev) => !prev)}
            className={cn(
              'inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3 text-[11px] transition',
              favoritesOnly
                ? 'border-[#3867ff] bg-[#3867ff] font-medium text-white dark:border-[#5d7dff] dark:bg-[#5d7dff] dark:text-white'
                : 'border-[rgba(12,24,36,0.1)] bg-[#f7f9fd] text-[#4a6080] hover:border-[rgba(12,24,36,0.18)] hover:text-[#091423] dark:border-white/10 dark:bg-white/5 dark:text-[#b6c5e0] dark:hover:text-[#eef4ff]',
            )}
          >
            <Bookmark
              aria-hidden
              className="h-3.5 w-3.5"
              strokeWidth={1.75}
            />
            {t('My favorites')}
          </button>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[11px] text-[#4a6080] dark:text-[#8fa5c4]">
              {t('Selected count', { count: selected ? 1 : 0 })}
            </span>
            {selected && (
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="cursor-pointer text-[11px] text-[#3867ff] transition hover:text-[#294fd4] dark:text-[#8fa5ff] dark:hover:text-[#b3c2ff]"
              >
                {t('Clear selection')}
              </button>
            )}
          </div>
        </div>

        {/* 资产列表 */}
        <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-3">
          {list.length === 0 ? (
            <div className="flex h-full min-h-[160px] flex-col items-center justify-center text-center">
              <ImageIcon
                aria-hidden
                className="h-6 w-6 text-[#8a9bc0]"
                strokeWidth={1.5}
              />
              <p className="mt-3 text-[12.5px] text-[#4a6080] dark:text-[#8fa5c4]">
                {t('No matching assets')}
              </p>
            </div>
          ) : (
            list.map((item, index) => {
              const isSelected = item.id === selectedId

              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 border-b border-[rgba(12,24,36,0.05)] py-2.5 last:border-b-0 dark:border-white/6"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedId(isSelected ? null : item.id)}
                    aria-label={item.name}
                    aria-pressed={isSelected}
                    className={cn(
                      'relative flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[14px] border transition',
                      isSelected
                        ? 'border-[#3867ff] shadow-[0_0_0_2px_rgba(56,103,255,0.28)] dark:border-[#5d7dff] dark:shadow-[0_0_0_2px_rgba(93,125,255,0.3)]'
                        : 'border-[rgba(12,24,36,0.08)] hover:border-[rgba(12,24,36,0.18)] dark:border-white/10 dark:hover:border-white/20',
                    )}
                    style={{ backgroundImage: thumbGradient(index) }}
                  >
                    <ImageIcon
                      aria-hidden
                      className="h-4 w-4 text-white/80"
                      strokeWidth={1.5}
                    />
                    {isSelected && (
                      <span className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#3867ff] text-white dark:bg-[#5d7dff]">
                        <Check
                          aria-hidden
                          className="h-2.5 w-2.5"
                          strokeWidth={2.5}
                        />
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedId(isSelected ? null : item.id)}
                    className="min-w-0 flex-1 cursor-pointer text-left"
                  >
                    <p className="truncate text-[13px] font-medium text-[#091423] dark:text-[#eef4ff]">
                      {item.name}
                    </p>
                    <div className="mt-1.5">
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2 py-0.5 text-[10px]',
                          isSelected
                            ? 'border-[#3867ff] bg-[rgba(56,103,255,0.12)] text-[#3867ff] dark:border-[#5d7dff] dark:bg-[rgba(143,165,255,0.16)] dark:text-[#8fa5ff]'
                            : 'border-[rgba(12,24,36,0.08)] bg-[#f7f9fd] text-[#4a6080] dark:border-white/10 dark:bg-white/5 dark:text-[#8fa5c4]',
                        )}
                      >
                        {isSelected ? t('Selected') : t('Available')}
                      </span>
                    </div>
                    <div className="mt-2 flex min-w-0 items-center gap-2 text-[10px] text-[#8a9bc0] dark:text-[#8a9bc0]">
                      <span className="truncate">{item.createdAt}</span>
                      <span className="shrink-0">·</span>
                      <span className="truncate">{item.modelName}</span>
                      <span className="shrink-0">·</span>
                      <span className="shrink-0">{item.format}</span>
                    </div>
                  </button>
                </div>
              )
            })
          )}
        </div>

        {/* 页脚:说明 + 取消 + 使用所选图片 */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[rgba(12,24,36,0.06)] px-5 py-4 dark:border-white/8">
          <p className="text-[12px] leading-6 text-[#4a6080] dark:text-[#8fa5c4]">
            {t('Asset picker footer hint')}
          </p>
          <div className="ml-auto flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-[12px] border border-[rgba(12,24,36,0.1)] bg-white px-4 text-[13px] font-medium text-[#2e4268] transition hover:border-[rgba(12,24,36,0.18)] hover:text-[#091423] dark:border-white/10 dark:bg-white/5 dark:text-[#b6c5e0] dark:hover:text-[#eef4ff]"
            >
              {t('Cancel')}
            </button>
            <button
              type="button"
              disabled={!selected}
              onClick={() => {
                if (selected) {
                  onConfirm(selected)
                  onOpenChange(false)
                  setKeyword('')
                  setFavoritesOnly(false)
                  setSelectedId(null)
                }
              }}
              className={cn(
                'inline-flex h-10 items-center justify-center rounded-[12px] px-4 text-[13px] font-medium transition',
                selected
                  ? 'cursor-pointer bg-[#3867ff] text-white hover:bg-[#294fd4] dark:bg-[#5d7dff] dark:hover:bg-[#4d6ff0]'
                  : 'cursor-not-allowed bg-[#e6ecf7] text-[#8a9bc0] dark:bg-white/8 dark:text-[#6f7d99]',
              )}
            >
              {t('Use selected image')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
