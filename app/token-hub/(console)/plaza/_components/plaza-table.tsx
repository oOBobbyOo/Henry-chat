'use client'

import { useState } from 'react'

import { AudioLines, Check, Copy, FileText, Image, Sparkles, Type, Video, type LucideIcon } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { ConsoleTable, ConsoleTableBody, ConsoleTableCell, ConsoleTableHead, ConsoleTableHeader, ConsoleTableRow } from '@/components/token-hub/table'
import { cn } from '@/lib/utils'
import { useModelMetricsQuery } from '@/services/token-hub'

import type { PlazaCurrency } from './model-card'

import { getFamilyIcon, getProviderIcon } from './family-icon'

/** 模态图标映射(与 model-card 一致) */
const MODALITY_ICON: Record<string, LucideIcon> = {
  text: Type,
  image: Image,
  video: Video,
  audio: AudioLines,
  file: FileText,
}

/** 模态图标颜色(与 model-card 一致) */
const MODALITY_TONE: Record<string, string> = {
  text: 'bg-[#eef3ff] text-[#4269ee]',
  image: 'bg-emerald-50 text-emerald-600',
  video: 'bg-red-50 text-[#fb5a26]',
  audio: 'bg-amber-50 text-amber-600',
  file: 'bg-sky-50 text-sky-600',
}

/** 上下文窗口格式化: 1M / 991K / 66K */
function formatContext(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(0)}M`
  if (tokens >= 1_000) return `${Math.round(tokens / 1_000)}K`
  return String(tokens)
}

/** 价格格式化: 保留合适小数位 */
function formatPrice(v: number): string {
  if (v >= 100) return v.toFixed(0)
  if (v >= 10) return v.toFixed(1)
  if (v >= 1) return v.toFixed(2)
  return v.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')
}

/**
 * 模型广场表格视图 —— 模型 / 上下文 / 延迟 / 吞吐 / 价格 / 能力 / 供应商 / 操作
 * 与生产参考表头一致(生产另有「档位」价格子列,本地 mock 数据未含,以输入/输出/缓存读三行替代)
 */
export function PlazaTable({ models, currency }: { models: TokenHub.CatalogModel[]; currency: PlazaCurrency }) {
  const { t } = useT('token-hub')

  return (
    <div className="overflow-hidden rounded-[15px] border border-[#dce5f6] bg-white shadow-[0_1px_2px_rgb(15_38_79/0.04)]">
      <ConsoleTable className="min-w-270">
        <ConsoleTableHeader>
          <ConsoleTableRow>
            {[
              t('Plaza Table Model'),
              t('Plaza Context'),
              t('Plaza Latency'),
              t('Plaza Throughput'),
              t('Plaza Table Price'),
              t('Plaza Table Capabilities'),
              t('Plaza Table Vendors'),
              t('Plaza Table Actions'),
            ].map((h, i) => (
              <ConsoleTableHead
                key={h}
                className={cn(i === 0 && 'text-left', i === 7 && 'text-right')}
              >
                {h}
              </ConsoleTableHead>
            ))}
          </ConsoleTableRow>
        </ConsoleTableHeader>
        <ConsoleTableBody>
          {models.map((model) => (
            <PlazaRow
              key={model.alias}
              model={model}
              currency={currency}
            />
          ))}
        </ConsoleTableBody>
      </ConsoleTable>
    </div>
  )
}

/** 表格行 —— 复制 ID、性能指标(延迟/吞吐)来自共享的近 30 分钟查询 */
function PlazaRow({ model, currency }: { model: TokenHub.CatalogModel; currency: PlazaCurrency }) {
  const { t } = useT('token-hub')
  const [copied, setCopied] = useState(false)

  // 近 30 分钟性能指标(共享查询,按别名索引)
  const { data } = useModelMetricsQuery(30)
  const metric = data.items.find((m) => m.alias === model.alias)

  // 最低价格映射(按折扣后 CNY 单价取最小,与卡片视图一致)
  const best = model.mappings.filter((m) => m.status === 'active').sort((a, b) => a.input_price_cny * a.discount_rate - b.input_price_cny * b.discount_rate)[0]
  // 近 3 天内上架 → 新上架
  const isNew = Date.now() - Date.parse(model.created_at) < 3 * 24 * 3600 * 1000
  // 去重供应商
  const providers = Array.from(new Set(model.mappings.map((m) => m.provider_name))).slice(0, 3)

  /** 取价格: 按币种返回 原价/折后价 */
  const price = (pick: (m: TokenHub.CatalogMapping) => number) => {
    if (!best) return null
    const raw = pick(best)
    return {
      original: currency === 'CNY' ? raw : raw / 6.8,
      discounted: currency === 'CNY' ? raw * best.discount_rate : (raw * best.discount_rate) / 6.8,
    }
  }
  const input = price((m) => m.input_price_cny)
  const output = price((m) => m.output_price_cny)
  const cacheRead = price((m) => m.cache_read_price_cny)

  /** 复制模型别名 */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(model.alias)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* 剪贴板不可用时静默失败 */
    }
  }

  const latency = metric && metric.p50_ttft_ms ? `${(metric.p50_ttft_ms / 1000).toFixed(2)}s` : '—'
  const tps = metric?.p50_tps ? `${metric.p50_tps.toFixed(0)} tps` : '—'
  const nonStreamTps = metric?.p50_non_stream_tps ? `约 ${metric.p50_non_stream_tps.toFixed(0)} tps` : '—'

  return (
    <ConsoleTableRow>
      {/* 模型: 家族图标 + 名称 + 别名 + 徽章 */}
      <ConsoleTableCell className="text-left">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#dce5f6]/80 bg-[#edf1ff]/65">{getFamilyIcon(model.family, 20)}</span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="max-w-48 truncate text-[13px] font-semibold text-[#0f1c3a]">{model.display_name}</span>
              <span className="inline-flex shrink-0 items-center rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">{t('Plaza Callable')}</span>
              {isNew && (
                <span className="inline-flex shrink-0 items-center gap-0.5 rounded-md border border-amber-500/55 bg-amber-50 px-1 py-0.5 text-[10px] font-bold text-amber-600">
                  <Sparkles className="h-2.5 w-2.5" />
                  {t('Plaza New')}
                </span>
              )}
            </div>
            <code className="block truncate text-xs text-[#8a9bc0]">{model.alias}</code>
          </div>
        </div>
      </ConsoleTableCell>
      {/* 上下文 */}
      <ConsoleTableCell className="text-[13px] text-[#0f1c3a] tabular-nums">{formatContext(model.context_window)}</ConsoleTableCell>
      {/* 延迟 */}
      <ConsoleTableCell className="text-[13px] text-[#5b6b8c] tabular-nums">{latency}</ConsoleTableCell>
      {/* 吞吐 */}
      <ConsoleTableCell className="text-[13px] text-[#5b6b8c] tabular-nums">
        <p className="text-[13px] text-[#0f1c3a] tabular-nums">{tps}</p>
        <p className="mt-0.5 text-[10px] text-[#8a9bc0] tabular-nums">非流式 {nonStreamTps}</p>
      </ConsoleTableCell>
      {/* 价格(每百万 Token): 输入 / 输出 / 缓存读 */}
      <ConsoleTableCell>
        <div className="flex flex-col gap-0.5">
          <PriceLine
            label={t('Plaza Table Price Input')}
            price={input}
            currency={currency}
          />
          <PriceLine
            label={t('Plaza Table Price Output')}
            price={output}
            currency={currency}
          />
          <PriceLine
            label={t('Plaza Table Price Cache')}
            price={cacheRead}
            currency={currency}
          />
        </div>
      </ConsoleTableCell>
      {/* 能力: 输入 + 输出模态 */}
      <ConsoleTableCell>
        <div className="flex items-center gap-1">
          {[...model.input_modalities, ...model.output_modalities.filter((m) => !model.input_modalities.includes(m))].map((mod) => {
            const Icon = MODALITY_ICON[mod]
            if (!Icon) return null
            return (
              <span
                key={mod}
                title={mod}
                className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-lg', MODALITY_TONE[mod] ?? 'bg-[#eef3ff] text-[#4269ee]')}
              >
                <Icon
                  className="h-3.5 w-3.5"
                  strokeWidth={2.5}
                />
                <span className="sr-only">{mod}</span>
              </span>
            )
          })}
        </div>
      </ConsoleTableCell>
      {/* 供应商 */}
      <ConsoleTableCell>
        <div className="flex items-center gap-1.5">
          {providers.map((p) => (
            <span
              key={p}
              title={p}
              className="grid h-6 w-6 place-items-center rounded-md border border-[#dce5f6] bg-[#f7f9fd]"
            >
              {getProviderIcon(p, 15)}
            </span>
          ))}
          {model.mappings.length > providers.length && <span className="text-[11px] font-semibold text-[#8a9bc0]">+{model.mappings.length - providers.length}</span>}
        </div>
      </ConsoleTableCell>
      {/* 操作: 复制模型 ID */}
      <ConsoleTableCell className="text-right">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleCopy}
            aria-label={`${t('Plaza Copy Id')} ${model.alias}`}
            title={t('Plaza Copy Id')}
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-xl text-[#8a9bc0] transition-all duration-200 hover:bg-[#eef3ff] hover:text-[#4269ee] focus-visible:ring-4 focus-visible:ring-[#4269ee]/15 focus-visible:outline-none"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </ConsoleTableCell>
    </ConsoleTableRow>
  )
}

/** 价格行 —— 划线原价 + 绿色折后价(每百万 Token) */
function PriceLine({ label, price, currency }: { label: string; price: { original: number; discounted: number } | null; currency: PlazaCurrency }) {
  const symbol = currency === 'CNY' ? '¥' : '$'
  return (
    <span className="inline-flex items-baseline gap-1.5 text-[11px] text-[#5b6b8c]">
      <span className="text-[10px] font-medium text-[#8a9bc0]">{label}</span>
      {!price ? (
        <span className="tabular-nums">—</span>
      ) : price.discounted < price.original - 1e-9 ? (
        <span className="inline-flex items-baseline gap-1">
          <span className="text-[10px] font-normal text-[#8a9bc0] line-through decoration-[#8a9bc0]/70 tabular-nums">
            {symbol}
            {formatPrice(price.original)}
          </span>
          <span className="font-semibold text-emerald-600 tabular-nums">
            {symbol}
            {formatPrice(price.discounted)}
          </span>
        </span>
      ) : (
        <span className="font-medium text-[#0f1c3a] tabular-nums">
          {symbol}
          {formatPrice(price.original)}
        </span>
      )}
    </span>
  )
}
