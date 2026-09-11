'use client'

import { useState } from 'react'

import { useT } from 'next-i18next/client'

import { useStudio3dAssetsQuery, useStudio3dConfigQuery } from '@/services/studio3d'

import { Studio3dControls } from './_components/studio3d-controls'
import { Studio3dHistory } from './_components/studio3d-history'
import { Studio3dNav } from './_components/studio3d-nav'
import { Studio3dViewport } from './_components/studio3d-viewport'

/**
 * 3D 建模(Studio 3D)
 * 四栏集成布局:能力导航(76px) + 控制面板(320px) + 3D 视口(自适应) + 资产面板(280px)
 * AppRail / SiteHeader 由 (studio) 路由组布局统一提供
 */
export default function Studio3dPage() {
  const { t } = useT('studio3d')
  const { data: configData } = useStudio3dConfigQuery()
  const { data: assetsData } = useStudio3dAssetsQuery()

  const [activeCapability, setActiveCapability] = useState('model-generation')
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null)

  const capabilities = configData?.data.capabilities ?? []
  const models = configData?.data.models ?? []
  const textureQualities = configData?.data.textureQualities ?? []
  const geometryQualities = configData?.data.geometryQualities ?? []
  const topologies = configData?.data.topologies ?? []
  const assets = assetsData?.data.items ?? []

  return (
    <div className="mx-auto w-full max-w-[var(--app-content-max-width)] px-4 pt-4 pb-8 xl:h-[calc(100dvh-88px)] xl:min-h-0 xl:px-5 xl:pb-2">
      <div className="grid min-h-0 gap-1.5 xl:h-full xl:grid-cols-[76px_320px_minmax(0,1fr)_280px] xl:gap-0 xl:overflow-hidden xl:rounded-[30px] xl:border xl:border-[rgba(12,24,36,0.08)] xl:shadow-[0_20px_52px_rgba(15,23,42,0.1)] dark:xl:border-white/8 dark:xl:shadow-[0_24px_64px_rgba(2,6,23,0.24)]">
        <Studio3dNav
          activeId={activeCapability}
          capabilities={capabilities}
          onSelect={setActiveCapability}
        />
        <div className="min-h-0 border-[rgba(12,24,36,0.08)] max-xl:rounded-[24px] max-xl:border max-xl:bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(245,249,255,0.9))] max-xl:shadow-[0_10px_30px_rgba(8,20,48,0.05)] xl:min-h-0 xl:border-r xl:border-[rgba(12,24,36,0.08)] xl:bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(243,246,250,0.92))] dark:max-xl:border-white/8 dark:max-xl:bg-[linear-gradient(180deg,rgba(15,22,36,0.92),rgba(9,14,25,0.9))] dark:xl:border-r dark:xl:border-white/8 dark:xl:bg-[linear-gradient(180deg,rgba(15,22,36,0.92),rgba(9,14,25,0.9))]">
          <Studio3dControls
            geometryQualities={geometryQualities}
            models={models}
            textureQualities={textureQualities}
            topologies={topologies}
          />
        </div>
        <main className="hidden min-h-0 border-[rgba(12,24,36,0.08)] xl:block xl:min-h-0 xl:border-r xl:bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(243,246,250,0.92))] dark:dark:border-white/8 xl:dark:bg-[linear-gradient(180deg,rgba(15,22,36,0.92),rgba(9,14,25,0.9))]">
          <Studio3dViewport />
        </main>
        <div className="min-h-0 border-[rgba(12,24,36,0.08)] max-xl:rounded-[24px] max-xl:border max-xl:bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(245,249,255,0.9))] max-xl:shadow-[0_10px_30px_rgba(8,20,48,0.05)] xl:min-h-0 xl:bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(243,246,250,0.92))] dark:max-xl:border-white/8 dark:max-xl:bg-[linear-gradient(180deg,rgba(15,22,36,0.92),rgba(9,14,25,0.9))] dark:xl:bg-[linear-gradient(180deg,rgba(15,22,36,0.92),rgba(9,14,25,0.9))]">
          <Studio3dHistory
            assets={assets}
            selectedAssetId={selectedAssetId}
            onSelectAsset={setSelectedAssetId}
          />
        </div>
      </div>
      {/* 移动端(<xl)视口占位:四栏隐藏后仍保留预览引导 */}
      <div className="mt-1.5 flex min-h-[480px] flex-col items-center justify-center gap-4 rounded-[24px] border border-[rgba(12,24,36,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(245,249,255,0.9))] text-center shadow-[0_10px_30px_rgba(8,20,48,0.05)] xl:hidden dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(15,22,36,0.92),rgba(9,14,25,0.9))]">
        <Studio3dViewport />
      </div>
      {/* 屏幕阅读器可访问的页面标题(视觉标题由 SiteHeader 承担) */}
      <h1 className="sr-only">{t('3D Modeling')}</h1>
    </div>
  )
}
