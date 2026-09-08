'use client'

import { useState } from 'react'

import { Activity, AudioLines, Check, Clock3, Copy, FileText, Image, Percent, Sparkles, Type, Video, Zap, type LucideIcon } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { getFamilyIcon, getProviderIcon } from '@/components/token-hub/family-icon'
import { cn } from '@/lib/utils'
import { useModelMetricsQuery } from '@/services/token-hub'

/** 展示币种 */
export type PlazaCurrency = 'CNY' | 'USD'

/** 模态图标映射 */
const MODALITY_ICON: Record<string, LucideIcon> = {
  text: Type,
  image: Image,
  video: Video,
  audio: AudioLines,
  file: FileText,
}

/** 模态图标颜色(与生产一致的语义色,本地项目无 radix-nova 变量,用具体色值) */
const MODALITY_TONE: Record<string, string> = {
  text: 'bg-(--tc-blue-soft) text-(--tc-primary-text)',
  image: 'bg-emerald-50 text-emerald-600',
  video: 'bg-red-50 text-(--tc-danger)',
  audio: 'bg-amber-50 text-amber-600',
  file: 'bg-sky-50 text-sky-600',
}

/** 协议显示名映射 */
const PROTOCOL_LABEL: Record<string, string> = {
  openai_chat: 'OpenAI Chat',
  openai_responses: 'Responses',
  anthropic: 'Messages',
  gemini: 'Gemini',
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

/** 模型卡 —— 名称/别名/徽章/协议/描述/多模态/定价/近30分钟表现/供应商 */
export function ModelCard({ model, currency }: { model: TokenHub.CatalogModel; currency: PlazaCurrency }) {
  const { t } = useT('token-hub')
  const [copied, setCopied] = useState(false)

  // 最低价格映射(按折扣后 CNY 单价取最小)
  const best = model.mappings.filter((m) => m.status === 'active').sort((a, b) => a.input_price_cny * a.discount_rate - b.input_price_cny * b.discount_rate)[0]
  // 折扣率(若无折扣则为 null)
  const discount = best && best.discount_rate < 1 ? best.discount_rate : null
  // 近 3 天内上架 → 新上架
  const isNew = Date.now() - Date.parse(model.created_at) < 3 * 24 * 3600 * 1000
  // 去重供应商
  const providers = Array.from(new Set(model.mappings.map((m) => m.provider_name))).slice(0, 3)

  /** 取价格: 按币种返回 原价/折后价 */
  const price = (pick: (m: TokenHub.CatalogMapping) => number) => {
    const m = best
    if (!m) return null
    const raw = pick(m)
    return {
      original: currency === 'CNY' ? raw : raw / 6.8,
      discounted: currency === 'CNY' ? raw * m.discount_rate : (raw * m.discount_rate) / 6.8,
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

  return (
    <article className="group relative flex min-h-109.5 flex-col overflow-hidden rounded-[15px] border border-(--tc-border) bg-(--tc-surface) shadow-[0_1px_2px_rgb(15_38_79/0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-(--tc-primary-hover)/40 hover:shadow-[0_16px_32px_rgb(28_55_105/0.08)]">
      <div className="flex flex-1 flex-col p-5 sm:px-6 sm:pb-6">
        {/* 头部: 图标 + 名称 + 徽章 */}
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-(--tc-border)/80 bg-(--tc-blue-soft)/65">{getFamilyIcon(model.family, 25)}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-2">
              <h2 className="min-w-0 truncate text-[16px] font-semibold tracking-[-0.03em] text-(--tc-strong)">{model.display_name}</h2>
              <span className="inline-flex shrink-0 items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600">{t('Plaza Callable')}</span>
              {isNew && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-amber-500/55 bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-600">
                  <Sparkles className="h-2.5 w-2.5" />
                  {t('Plaza New')}
                </span>
              )}
            </div>
            {/* 别名 + 复制 */}
            <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-(--tc-muted)">
              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <code className="min-w-0 truncate">{model.alias}</code>
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label={`${t('Plaza Copy Id')} ${model.alias}`}
                  title={t('Plaza Copy Id')}
                  className="grid h-6 w-6 shrink-0 cursor-pointer place-items-center rounded-md text-(--tc-muted) transition hover:bg-(--tc-blue-soft) hover:text-(--tc-primary-text) focus-visible:ring-2 focus-visible:ring-(--tc-primary-hover)/35 focus-visible:outline-none"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              {/* 折扣徽章 */}
              {discount !== null && best && (
                <span
                  title={`${t('Plaza Discount Title')} ${(discount * 10).toFixed(1)}${t('Plaza Discount Unit')}`}
                  aria-label={`${t('Plaza Discount')} ${(discount * 10).toFixed(1)}${t('Plaza Discount Unit')}`}
                  className="inline-flex items-center gap-0.5 overflow-hidden rounded-lg border border-red-500/25 bg-red-50/80 text-[11px] font-bold text-red-500 shadow-[0_2px_8px_rgb(200_67_85/0.1)]"
                >
                  <span className="grid w-6 shrink-0 place-items-center self-stretch bg-red-500/10 text-red-500">
                    <Percent className="h-2.5 w-2.5" />
                  </span>
                  <span className="px-1.5 tabular-nums">
                    {t('Plaza Discount')}{' '}
                    <strong>
                      {(discount * 10).toFixed(1)}
                      {t('Plaza Discount Unit')}
                    </strong>
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 支持协议 */}
        <div
          className="mt-4 flex flex-wrap items-center gap-1.5"
          aria-label={t('Plaza Protocols')}
        >
          <span className="mr-0.5 text-[11px] font-medium text-(--tc-muted)">{t('Plaza Protocols')}</span>
          {model.supported_protocols.map((p) => (
            <span
              key={p}
              className="inline-flex items-center rounded-md bg-(--tc-blue-soft) px-2 py-0.5 text-xs font-semibold tracking-[0.01em] text-(--tc-body)"
            >
              {PROTOCOL_LABEL[p] ?? p}
            </span>
          ))}
        </div>

        {/* 描述 */}
        <p
          className="mt-3 line-clamp-2 min-h-10 text-[13px] leading-5 text-(--tc-body)"
          title={`${model.family}: ${model.description}`}
        >
          {model.family}: {model.description}
        </p>

        {/* 多模态能力 */}
        <section
          className="mt-3 rounded-xl bg-(--tc-blue-soft) px-3 py-2.5"
          aria-label={`${model.display_name} 的多模态能力`}
        >
          <div className="flex items-center gap-2.5">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold tracking-[0.09em] text-(--tc-muted) uppercase">{t('Plaza Input')}</p>
              <div className="mt-1.5 flex flex-nowrap gap-1.5">
                {model.input_modalities.map((mod) => {
                  const Icon = MODALITY_ICON[mod]
                  if (!Icon) return null
                  return (
                    <span
                      key={mod}
                      title={mod}
                      className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-lg', MODALITY_TONE[mod] ?? 'bg-(--tc-blue-soft) text-(--tc-primary-text)')}
                    >
                      <Icon
                        className="h-4 w-4"
                        strokeWidth={2.5}
                      />
                      <span className="sr-only">{mod}</span>
                    </span>
                  )
                })}
              </div>
            </div>
            <div className="min-w-0 flex-1 border-l border-(--tc-border) pl-2.5">
              <p className="text-[10px] font-semibold tracking-[0.09em] text-(--tc-muted) uppercase">{t('Plaza Output')}</p>
              <div className="mt-1.5 flex flex-nowrap gap-1.5">
                {model.output_modalities.map((mod) => {
                  const Icon = MODALITY_ICON[mod]
                  if (!Icon) return null
                  return (
                    <span
                      key={mod}
                      title={mod}
                      className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-lg', MODALITY_TONE[mod] ?? 'bg-(--tc-blue-soft) text-(--tc-primary-text)')}
                    >
                      <Icon
                        className="h-4 w-4"
                        strokeWidth={2.5}
                      />
                      <span className="sr-only">{mod}</span>
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* 定价 */}
        <div
          className="mt-3 grid grid-cols-[0.72fr_repeat(3,minmax(0,1fr))] border-y border-(--tc-border)/80 py-3"
          aria-label={`${model.display_name} 的价格信息（每百万 Token）`}
        >
          <div className="min-w-0 pr-1.5 sm:pr-2">
            <p className="text-[9px] font-semibold tracking-[-0.02em] text-(--tc-muted) whitespace-nowrap sm:text-[10px]">{t('Plaza Context')}</p>
            <p className="mt-1 flex min-h-5 items-center text-[11px] font-semibold text-(--tc-strong) whitespace-nowrap tabular-nums sm:text-sm">{formatContext(model.context_window)}</p>
          </div>
          <PriceCell
            label={t('Plaza Input Price')}
            price={input}
            currency={currency}
          />
          <PriceCell
            label={t('Plaza Output Price')}
            price={output}
            currency={currency}
          />
          <PriceCell
            label={t('Plaza Cache Read Price')}
            price={cacheRead}
            currency={currency}
          />
        </div>

        {/* 近 30 分钟表现 */}
        <MetricsSection model={model} />

        {/* 供应商 */}
        <div
          className="mt-3 flex items-center gap-2"
          aria-label={`${model.display_name} 的供应商信息`}
        >
          <span className="text-[11px] font-semibold text-(--tc-muted)">{t('Plaza Vendors')}</span>
          <div className="flex min-w-0 items-center gap-1.5">
            {providers.map((p) => (
              <span
                key={p}
                title={p}
                className="grid h-6 w-6 place-items-center rounded-md border border-(--tc-border) bg-(--tc-surface-raised)"
              >
                {getProviderIcon(p, 15)}
              </span>
            ))}
            {model.mappings.length > providers.length && <span className="text-[11px] font-semibold text-(--tc-muted)">+{model.mappings.length - providers.length}</span>}
          </div>
        </div>
      </div>
    </article>
  )
}

/** 价格单元格 —— 划线原价 + 绿色折后价 */
function PriceCell({ label, price, currency }: { label: string; price: { original: number; discounted: number } | null; currency: PlazaCurrency }) {
  const symbol = currency === 'CNY' ? '¥' : '$'
  if (!price) {
    return (
      <div className="min-w-0 border-l border-(--tc-border) px-1.5 sm:px-2">
        <p className="text-[9px] font-semibold tracking-[-0.02em] text-(--tc-muted) whitespace-nowrap sm:text-[10px]">{label}</p>
        <p className="mt-1 flex min-h-5 items-center text-[11px] font-semibold text-(--tc-strong) whitespace-nowrap tabular-nums sm:text-sm">—</p>
      </div>
    )
  }
  const hasDiscount = price.discounted < price.original - 1e-9
  return (
    <div className="min-w-0 border-l border-(--tc-border) px-1.5 sm:px-2">
      <p className="text-[9px] font-semibold tracking-[-0.02em] text-(--tc-muted) whitespace-nowrap sm:text-[10px]">{label}</p>
      <p className="mt-1 flex min-h-5 items-center text-[11px] font-semibold text-(--tc-strong) whitespace-nowrap tabular-nums sm:text-sm">
        {hasDiscount ? (
          <span className="inline-flex flex-col items-end leading-none">
            <span
              className="text-[8px] leading-none font-normal text-(--tc-muted) line-through decoration-(--tc-muted)/70"
              aria-hidden
            >
              {symbol}
              {formatPrice(price.original)}
            </span>
            <span className="text-[12px] leading-none text-emerald-600">
              {symbol}
              {formatPrice(price.discounted)}
            </span>
          </span>
        ) : (
          <span>
            {symbol}
            {formatPrice(price.original)}
          </span>
        )}
      </p>
    </div>
  )
}

/** 近 30 分钟表现 —— 请求数 / 延迟 / 吞吐 / 可用率 */
function MetricsSection({ model }: { model: TokenHub.CatalogModel }) {
  const { t } = useT('token-hub')
  // 近 30 分钟性能指标(共享查询,按别名索引)
  const { data } = useModelMetricsQuery(30)
  const metric = data.items.find((m) => m.alias === model.alias)
  const hasData = !!metric && metric.requests > 0

  const latency = metric && metric.p50_ttft_ms ? `${(metric.p50_ttft_ms / 1000).toFixed(2)}s` : '—'
  const tps = metric?.p50_tps ? `${metric.p50_tps.toFixed(0)} tps` : '—'
  const nonStreamTps = metric?.p50_non_stream_tps ? `约 ${metric.p50_non_stream_tps.toFixed(0)} tps` : '—'
  const availability = metric?.availability != null ? `${(metric.availability * 100).toFixed(2)}%` : '—'

  return (
    <section
      className="mt-3"
      aria-label={`${model.display_name} 的近 30 分钟调用表现`}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-[10px] font-semibold tracking-[0.09em] text-(--tc-muted) uppercase">{t('Plaza Performance')}</p>
        <p className="text-[10px] text-(--tc-muted)">{hasData ? `${metric!.requests} ${t('Plaza Requests')}` : t('Plaza No Data')}</p>
      </div>
      <div className="grid grid-cols-3 rounded-xl bg-(--tc-surface-raised)/60 py-2.5">
        <div className="min-w-0 px-2.5">
          <p className="flex items-center gap-1 text-[10px] font-medium text-(--tc-muted)">
            <Clock3 className="h-3 w-3" />
            {t('Plaza Latency')}
          </p>
          <p className="mt-1 truncate text-[13px] font-semibold text-(--tc-strong) tabular-nums">{latency}</p>
        </div>
        <div
          className="min-w-0 border-l border-(--tc-border) px-2.5"
          title={t('Plaza Throughput Title')}
        >
          <p className="flex items-center gap-1 text-[10px] font-medium text-(--tc-muted)">
            <Zap className="h-3 w-3" />
            {t('Plaza Throughput')}
          </p>
          <p className="mt-1 truncate text-[13px] font-semibold text-(--tc-strong) tabular-nums">{tps}</p>
          <p className="mt-0.5 truncate text-[10px] text-(--tc-muted) tabular-nums">非流式 {nonStreamTps}</p>
        </div>
        <div className="min-w-0 border-l border-(--tc-border) px-2.5">
          <p className="flex items-center gap-1 text-[10px] font-medium text-(--tc-muted)">
            <Activity className="h-3 w-3" />
            {t('Plaza Availability')}
          </p>
          <p className="mt-1 truncate text-[13px] font-semibold text-(--tc-strong) tabular-nums">{availability}</p>
        </div>
      </div>
    </section>
  )
}
