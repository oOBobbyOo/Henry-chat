'use client'

import { useMemo, useState } from 'react'

import Link from 'next/link'

import { ArrowUpRight } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { useModelsQuery } from '@/services/token-hub'

import { ModelCard, type PlazaCurrency } from './_components/model-card'
import { PlazaTable } from './_components/plaza-table'
import { PlazaToolbar, type PlazaView } from './_components/plaza-toolbar'

/**
 * Token Hub 控制台 —— 模型广场(Plaza)
 * 标题 + 筛选工具栏(搜索/能力/供应商/排序/币种/视图)+ 模型卡片网格
 */
export default function PlazaPage() {
  const { t } = useT('token-hub')
  const { data } = useModelsQuery()

  const [query, setQuery] = useState('')
  const [capability, setCapability] = useState('all')
  const [vendor, setVendor] = useState('all')
  const [sort, setSort] = useState('newest')
  const [currency, setCurrency] = useState<PlazaCurrency>('CNY')
  const [view, setView] = useState<PlazaView>('card')

  // 供应商维度统计(用于 chips 与下拉)
  const vendorCounts = useMemo(() => {
    const map = new Map<string, number>()
    for (const m of data.items) {
      for (const p of m.mappings) {
        map.set(p.provider_name, (map.get(p.provider_name) ?? 0) + 1)
      }
    }
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [data.items])

  // 筛选 + 排序后的模型列表
  const filtered = useMemo(() => {
    let list = data.items.filter((m) => {
      if (query && !m.alias.toLowerCase().includes(query.toLowerCase()) && !m.display_name.toLowerCase().includes(query.toLowerCase())) {
        return false
      }
      if (capability !== 'all' && !m.input_modalities.includes(capability) && !m.output_modalities.includes(capability)) {
        return false
      }
      if (vendor !== 'all' && !m.mappings.some((p) => p.provider_name === vendor)) {
        return false
      }
      return true
    })

    const priceOf = (m: TokenHub.CatalogModel) => Math.min(...m.mappings.filter((x) => x.status === 'active').map((x) => x.input_price_cny * x.discount_rate))

    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => priceOf(a) - priceOf(b))
        break
      case 'price-desc':
        list = [...list].sort((a, b) => priceOf(b) - priceOf(a))
        break
      default:
        // 最新上架: 按创建时间倒序
        list = [...list].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    }
    return list
  }, [data.items, query, capability, vendor, sort])

  /** 清空全部筛选 */
  const handleClear = () => {
    setQuery('')
    setCapability('all')
    setVendor('all')
    setSort('newest')
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-6 sm:py-8 lg:px-4 lg:py-9">
      <div className="space-y-7">
        {/* 标题区 */}
        <header className="flex flex-col gap-4 border-b border-[#dce5f6]/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-[24px] font-semibold tracking-[-0.045em] text-[#0f1c3a] sm:text-[26px]">{t('Plaza Title')}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5b6b8c]">{t('Plaza Subtitle')}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link
              href="/token-hub/integrations"
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#dce5f6] bg-white px-4 text-sm font-semibold whitespace-nowrap text-[#5b6b8c] shadow-[0_1px_1px_rgb(15_38_79/0.02)] transition-all duration-200 hover:border-[#4269ee]/40 hover:bg-[#eef3ff] hover:text-[#4269ee] focus-visible:ring-4 focus-visible:ring-[#4269ee]/15 focus-visible:outline-none"
            >
              {t('Plaza Integration Guide')}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </header>

        {/* 筛选工具栏 */}
        <PlazaToolbar
          query={query}
          onQueryChange={setQuery}
          capability={capability}
          onCapabilityChange={setCapability}
          vendor={vendor}
          onVendorChange={setVendor}
          currency={currency}
          onCurrencyChange={setCurrency}
          view={view}
          onViewChange={setView}
          sort={sort}
          onSortChange={setSort}
          shown={filtered.length}
          total={data.items.length}
          vendorCounts={vendorCounts}
          onClear={handleClear}
        />

        {/* 模型列表头 */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#0f1c3a]">
            {t('Plaza Callable Models')}
            <span className="ml-1 font-normal text-[#8a9bc0]">{filtered.length} 个</span>
          </p>
          <p className="hidden text-xs text-[#8a9bc0] sm:block">{t('Plaza Price Note')}</p>
        </div>

        {/* 模型列表: 卡片网格 / 表格视图 */}
        {view === 'list' ? (
          <PlazaTable
            models={filtered}
            currency={currency}
          />
        ) : (
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 [@media(min-width:1600px)_and_(max-height:1200px)]:grid-cols-4">
            {filtered.map((model) => (
              <ModelCard
                key={model.alias}
                model={model}
                currency={currency}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  )
}
