'use client'

import { useMemo } from 'react'

import { formatShare, formatTokens } from '@/lib/format'

import { VendorLink } from './EntityLinks'

/** Stable colour palette for vendors, used in both the share chart and the
 * legend dots. Falls back to a neutral palette for unknown vendors so that
 * future additions still render. */
const VENDOR_COLOURS: Record<string, string> = {
  OpenAI: '#10a37f',
  Anthropic: '#d97757',
  Google: '#4285f4',
  DeepSeek: '#7c5cff',
  Alibaba: '#ff9900',
  xAI: '#1f2937',
  Meta: '#1877f2',
  Moonshot: '#ec4899',
  Zhipu: '#06b6d4',
  Mistral: '#ff7000',
  ByteDance: '#3b82f6',
  Tencent: '#22c55e',
  MiniMax: '#a855f7',
  Cohere: '#fb923c',
  Baidu: '#ef4444',
  Others: '#94a3b8',
}

const FALLBACK_PALETTE = ['#0ea5e9', '#22c55e', '#a855f7', '#f97316', '#14b8a6', '#eab308', '#ec4899', '#84cc16', '#6366f1', '#10b981', '#f43f5e', '#0891b2', '#94a3b8']

function buildVendorColourMap(names: string[]): Record<string, string> {
  const result: Record<string, string> = {}
  let fallbackIdx = 0
  for (const name of names) {
    if (VENDOR_COLOURS[name]) {
      result[name] = VENDOR_COLOURS[name]
    } else {
      result[name] = FALLBACK_PALETTE[fallbackIdx % FALLBACK_PALETTE.length]
      fallbackIdx += 1
    }
  }
  return result
}

const MAX_VENDORS_IN_LIST = 12

type MarketShareSectionProps = {
  history: Ranking.VendorShareSeries
  rows: Ranking.VendorRanking[]
  period: Ranking.Period
}

export function MarketShareSection(props: MarketShareSectionProps) {
  const visible = props.rows.slice(0, MAX_VENDORS_IN_LIST)
  const half = Math.ceil(visible.length / 2)
  const left = visible.slice(0, half)
  const right = visible.slice(half)

  const colourMap = useMemo(() => buildVendorColourMap(props.history.vendors.map((v) => v.name)), [props.history])

  return (
    <section className="bg-card overflow-hidden rounded-lg border">
      <div className="border-t">
        <header className="px-5 pt-4 pb-2">
          <h3 className="text-foreground text-sm font-semibold">{'By model author'}</h3>
          <p className="text-muted-foreground/80 mt-0.5 text-xs">{'Vendors ranked by aggregated token volume'}</p>
        </header>
        {visible.length === 0 ? (
          <div className="text-muted-foreground/80 px-5 py-8 text-center text-sm">{'No vendor data available'}</div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 px-5 pt-1 pb-4 md:grid-cols-2">
            <VendorList
              rows={left}
              colourMap={colourMap}
            />
            {right.length > 0 && (
              <VendorList
                rows={right}
                colourMap={colourMap}
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function VendorList(props: { rows: Ranking.VendorRanking[]; colourMap: Record<string, string> }) {
  return (
    <ul>
      {props.rows.map((vendor) => (
        <li
          key={vendor.vendor}
          className="flex items-center gap-3 py-2.5"
        >
          <span className="text-muted-foreground/80 w-6 shrink-0 text-right font-mono text-xs tabular-nums">{vendor.rank}.</span>
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-full"
            style={{
              backgroundColor: props.colourMap[vendor.vendor] ?? '#94a3b8',
            }}
          />
          <VendorLink
            vendor={vendor.vendor}
            className="text-foreground min-w-0 flex-1 truncate text-sm font-medium"
          >
            {vendor.vendor}
          </VendorLink>
          <div className="shrink-0 text-right">
            <div className="text-foreground font-mono text-sm font-semibold tabular-nums">{formatTokens(vendor.total_tokens)}</div>
            <div className="text-muted-foreground/80 font-mono text-[11px] tabular-nums">{formatShare(vendor.share)}</div>
          </div>
        </li>
      ))}
    </ul>
  )
}
