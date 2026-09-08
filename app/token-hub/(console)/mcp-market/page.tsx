'use client'

import { useState } from 'react'

import { Blocks } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { useMcpMarketQuery } from '@/services/token-hub'

import { McpConfigDialog } from './_components/mcp-config-dialog'
import { McpMarketToolbar } from './_components/mcp-market-toolbar'
import { McpServiceCard } from './_components/mcp-service-card'

/** 筛选条件 */
export interface McpFilters {
  price: string
  credential: string
  status: string
}

/** 筛选选项 */
export const FILTER_ALL = 'all'

/**
 * Token Hub 控制台 —— MCP 市场
 * 标题 + 筛选(价格/凭据/状态)+ 服务数量 + 服务卡片网格
 */
export default function McpMarketPage() {
  const { t } = useT('token-hub')

  const [filters, setFilters] = useState<McpFilters>({ price: FILTER_ALL, credential: FILTER_ALL, status: FILTER_ALL })
  const [configTarget, setConfigTarget] = useState<TokenHub.McpService | null>(null)

  const { data } = useMcpMarketQuery(filters)

  const updateFilter = (key: keyof McpFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-6 sm:py-8 lg:px-4 lg:py-9">
      <div className="space-y-6">
        {/* 标题区 */}
        <header className="flex flex-col gap-4 border-b border-(--tc-border)/80 pb-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="flex items-center gap-2.5 text-[28px] font-semibold tracking-tighter text-(--tc-strong) sm:text-[32px]">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-(--tc-blue-soft) text-(--tc-blue-bright)">
                <Blocks className="h-5 w-5" />
              </span>
              {t('Mcp Title')}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-(--tc-body)">{t('Mcp Subtitle')}</p>
          </div>
        </header>

        {/* 筛选栏 */}
        <McpMarketToolbar
          filters={filters}
          onFilterChange={updateFilter}
          shown={data.items.length}
        />

        {/* 服务卡片网格 */}
        {data.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-[15px] border border-dashed border-(--tc-border) bg-(--tc-surface)/60 px-6 py-20 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-(--tc-blue-soft) text-(--tc-primary-text)">
              <Blocks className="h-5 w-5" />
            </span>
            <p className="text-sm font-medium text-(--tc-strong)">{t('Mcp Empty Title')}</p>
            <p className="max-w-md text-xs leading-5 text-(--tc-muted)">{t('Mcp Empty Desc')}</p>
          </div>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {data.items.map((service) => (
              <McpServiceCard
                key={service.id}
                service={service}
                onGenerateConfig={() => setConfigTarget(service)}
              />
            ))}
          </section>
        )}
      </div>

      {/* 生成配置对话框 */}
      {configTarget && (
        <McpConfigDialog
          service={configTarget}
          onClose={() => setConfigTarget(null)}
        />
      )}
    </main>
  )
}
