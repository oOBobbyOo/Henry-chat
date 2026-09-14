'use client'

import { useState } from 'react'

import { useT } from 'next-i18next/client'

import { useWorkbenchCommunityQuery, useWorkbenchConfigQuery, useWorkbenchHistoryQuery } from '@/services/workbench'

import { WorkbenchControls } from './_components/workbench-controls'
import { WorkbenchHistory } from './_components/workbench-history'
import { WorkbenchNav } from './_components/workbench-nav'

/**
 * 创作工坊(Workbench)
 * 三栏集成布局:左侧功能导航(196px)+ 中部控制面板(432~488px)+ 右侧创作历史(自适应)
 * AppRail / SiteHeader 由 (studio) 路由组布局统一提供
 */
export default function WorkbenchPage() {
  const { t } = useT('workbench')
  const { data: configData } = useWorkbenchConfigQuery()
  const { data: historyData } = useWorkbenchHistoryQuery()
  const { data: communityData } = useWorkbenchCommunityQuery()

  const [activeCapability, setActiveCapability] = useState('image-gen')

  const capabilities = configData?.data.capabilities ?? []
  const models = configData?.data.models ?? []
  const aspectRatios = configData?.data.aspectRatios ?? []
  const resolutions = configData?.data.resolutions ?? []
  const formats = configData?.data.formats ?? []

  return (
    <div className="mx-auto flex w-full max-w-[var(--app-content-max-width)] px-4 pt-2 pb-8 lg:px-5 xl:h-[calc(100dvh-88px)] xl:min-h-0 xl:pb-4">
      <div className="grid min-h-0 min-w-0 flex-1 items-stretch gap-1.5 xl:grid-cols-[196px_minmax(432px,488px)_minmax(0,1fr)] xl:gap-1">
        <WorkbenchNav
          activeId={activeCapability}
          capabilities={capabilities}
          onSelect={setActiveCapability}
        />
        <WorkbenchControls
          activeCapability={activeCapability}
          activeNameKey={t(capabilities.find((c) => c.id === activeCapability)?.nameKey ?? 'Image generation')}
          aspectRatios={aspectRatios}
          configs={configData?.data}
          formats={formats}
          models={models}
          resolutions={resolutions}
          videoConfig={configData?.data.video}
        />
        <WorkbenchHistory
          communityCases={communityData?.data.items ?? []}
          history={historyData?.data.items ?? []}
        />
      </div>
      {/* 屏幕阅读器可访问的页面标题(视觉标题由 SiteHeader 承担) */}
      <h1 className="sr-only">{t('Workbench')}</h1>
    </div>
  )
}
