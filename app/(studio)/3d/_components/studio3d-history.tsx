'use client'

import { useMemo, useState } from 'react'

import { Box, Search, Upload } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'

/**
 * 3D 建模右侧资产面板 —— 我的资产 / 公共资源 tabs + 搜索 + 上传卡 + 资产 2 列网格
 */

interface Studio3dHistoryProps {
  /** 资产列表(assets 接口返回) */
  assets: Studio3d.AssetItem[]
  /** 选中资产 ID(选中后视口加载预览) */
  selectedAssetId: string | null
  /** 选择资产回调 */
  onSelectAsset: (id: string) => void
}

/** 资产卡封面占位(渐变底 + 立方体图标) */
function AssetCover() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,rgba(56,152,188,0.22),rgba(56,103,255,0.16))] dark:bg-[linear-gradient(135deg,rgba(56,152,188,0.18),rgba(112,119,224,0.14))]">
      <Box
        aria-hidden
        className="h-6 w-6 text-white/75"
        strokeWidth={1.5}
      />
    </div>
  )
}

export function Studio3dHistory({ assets, selectedAssetId, onSelectAsset }: Studio3dHistoryProps) {
  const { t } = useT('studio3d')

  const [scope, setScope] = useState<Studio3d.AssetScope>('mine')
  const [keyword, setKeyword] = useState('')

  const filtered = useMemo(
    () =>
      assets.filter((item) => {
        if (scope === 'mine' ? item.isPublic : !item.isPublic) return false
        if (!keyword.trim()) return true
        return item.name.toLowerCase().includes(keyword.trim().toLowerCase())
      }),
    [assets, keyword, scope],
  )

  return (
    <div className="flex h-full min-h-0 min-w-0">
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
        {/* tabs(我的资产 / 公共资源) */}
        <div className="shrink-0 border-b border-[rgba(12,24,36,0.08)] px-3 pt-3 pb-0 dark:border-white/8">
          <div className="flex w-full rounded-[5px] border border-[rgba(12,24,36,0.08)] bg-white p-0.5 dark:border-white/10 dark:bg-white/6">
            {(
              [
                { key: 'mine', label: 'My assets' },
                { key: 'public', label: 'Public assets' },
              ] as const
            ).map((tab) => (
              <button
                className={cn(
                  'flex-1 rounded-[8px] py-1.5 text-[12px] font-medium transition',
                  scope === tab.key
                    ? 'bg-[rgba(59,130,246,0.13)] text-[#091423] shadow-[inset_0_1px_0_rgba(147,197,253,0.18),inset_0_0_0_1px_rgba(59,130,246,0.32)] dark:text-[#eef4ff]'
                    : 'text-[#4e6585] hover:text-[#2e4268] dark:text-[#8a9bc0] dark:hover:text-[#b6c4dc]',
                )}
                key={tab.key}
                onClick={() => setScope(tab.key)}
                type="button"
              >
                {t(tab.label)}
              </button>
            ))}
          </div>
        </div>

        {/* 内容区:搜索 + 上传卡 + 资产网格 */}
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <div className="space-y-2">
            <div className="relative">
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a9bc0]"
                strokeWidth={2}
              />
              <input
                aria-label={t('Search assets')}
                className="w-full rounded-[8px] border border-[rgba(12,24,36,0.08)] bg-[rgba(245,249,255,0.95)] py-1.5 pr-3 pl-7 text-[12px] text-[#091423] transition outline-none placeholder:text-[#8a9bc0] focus:border-[rgba(12,24,36,0.14)] focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-[#eef4ff] dark:placeholder:text-[#5b6b8c]"
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={t('Search assets')}
                type="text"
                value={keyword}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {/* 上传 3D 模型卡(仅我的资产 tab 显示,对齐参考站) */}
              {scope === 'mine' ? (
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-[12px] border-2 border-dashed border-[rgba(12,24,36,0.08)] bg-[rgba(245,249,255,0.95)] px-2 py-2 text-center transition hover:border-[rgba(12,24,36,0.14)] hover:bg-[rgba(93,175,206,0.04)] dark:border-white/12 dark:bg-white/5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-[0_0_14px_rgba(37,99,235,0.40)]">
                    <Upload
                      aria-hidden
                      className="h-3.5 w-3.5"
                      strokeWidth={1.75}
                    />
                  </div>
                  <p className="text-[11px] leading-tight font-semibold text-[#091423] dark:text-[#eef4ff]">{t('Upload 3D model')}</p>
                  <p className="text-[10px] leading-3 text-[#8a9bc0] dark:text-[#6b7f9d]">{t('OBJ FBX STL GLB')}</p>
                  <input
                    accept=".obj,.fbx,.stl,.glb,.gltf,.ply,.splat"
                    className="sr-only"
                    type="file"
                  />
                </label>
              ) : null}
              {filtered.map((item) => {
                const selected = item.id === selectedAssetId
                return (
                  <button
                    className={cn(
                      'group overflow-hidden rounded-[12px] border text-left transition',
                      selected
                        ? 'border-[rgba(59,130,246,0.5)] shadow-[0_0_0_1px_rgba(59,130,246,0.4),0_6px_18px_-6px_rgba(37,99,235,0.35)]'
                        : 'border-[rgba(12,24,36,0.08)] hover:border-[rgba(59,130,246,0.35)] dark:border-white/10',
                    )}
                    key={item.id}
                    onClick={() => onSelectAsset(item.id)}
                    type="button"
                  >
                    <div className="aspect-square overflow-hidden">
                      <AssetCover />
                    </div>
                    <div className="px-2 py-1.5">
                      <p className="truncate text-[11px] font-medium text-[#091423] dark:text-[#eef4ff]">{item.name}</p>
                      <p className="mt-0.5 truncate text-[10px] text-[#8a9bc0] dark:text-[#6b7f9d]">
                        {item.format} · {item.faceCountK}K
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
            {filtered.length === 0 ? <p className="pt-6 text-center text-[12px] text-[#8a9bc0] dark:text-[#6b7f9d]">{t('No assets for this filter')}</p> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
