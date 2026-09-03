'use client'

import { useT } from 'next-i18next/client'

import { formatShare, formatTokens } from '@/lib/format'

/** 表头列定义 */
const COLUMNS: { key: string; labelKey: string; align?: 'right' }[] = [
  { key: 'model', labelKey: 'Usage Col Model' },
  { key: 'provider', labelKey: 'Usage Col Provider' },
  { key: 'client', labelKey: 'Usage Col Client' },
  { key: 'tokens', labelKey: 'Usage Col Tokens', align: 'right' },
  { key: 'requests', labelKey: 'Usage Col Requests', align: 'right' },
  { key: 'cost', labelKey: 'Usage Col Cost', align: 'right' },
  { key: 'success', labelKey: 'Usage Col Success', align: 'right' },
  { key: 'ttft', labelKey: 'Usage Col TTFT', align: 'right' },
  { key: 'tps', labelKey: 'Usage Col Throughput', align: 'right' },
  { key: 'cache', labelKey: 'Usage Col Cache', align: 'right' },
]

/**
 * 模型表现表格 —— 按 Token 消耗排序,性能与可靠性在同一行对比
 */
export function ModelPerformanceTable({ items }: { items: TokenHub.ModelStatsItem[] }) {
  const { t } = useT('token-hub')

  const sorted = [...items].sort((a, b) => b.tokens - a.tokens)

  return (
    <div className="overflow-hidden rounded-[15px] border border-[#dce5f6] bg-white shadow-[0_1px_2px_rgb(15_38_79/0.04)]">
      {/* 标题 */}
      <div className="border-b border-[#dce5f6] px-5 py-5 sm:px-6">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#0f1c3a]">{t('Usage Models Title')}</h2>
        </div>
        <p className="mt-1.5 text-xs text-[#8a9bc0]">{t('Usage Models Subtitle')}</p>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 border-t border-dashed border-[#dce5f6] bg-white/60 px-6 py-16 text-center">
          <p className="text-sm font-medium text-[#0f1c3a]">{t('Usage Models Empty Title')}</p>
          <p className="max-w-md text-xs leading-5 text-[#8a9bc0]">{t('Usage Models Empty Desc')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#dce5f6] bg-[#f7f9fd]/70">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={`px-5 py-3 text-[11px] font-bold tracking-[0.06em] whitespace-nowrap text-[#8a9bc0] uppercase ${col.align === 'right' ? 'text-right' : ''}`}
                  >
                    {t(col.labelKey)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr
                  key={row.model}
                  className="border-b border-[#dce5f6]/60 transition-colors last:border-b-0 hover:bg-[#f7f9fd]/60"
                >
                  <td className="px-5 py-4">
                    <span className="text-[13px] font-semibold whitespace-nowrap text-[#0f1c3a]">{row.model}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-2 text-[12px] whitespace-nowrap text-[#5b6b8c]">
                      <span className="grid h-5 w-5 place-items-center rounded-md bg-[#eef3ff] text-[10px] font-bold text-[#294fd4]">{row.provider.charAt(0)}</span>
                      {row.provider}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[12px] whitespace-nowrap text-[#5b6b8c]">{row.client}</span>
                  </td>
                  <td className="px-5 py-4 text-right text-[13px] font-semibold text-[#0f1c3a] tabular-nums">{formatTokens(row.tokens)}</td>
                  <td className="px-5 py-4 text-right text-[12px] text-[#5b6b8c] tabular-nums">{row.requests.toLocaleString()}</td>
                  <td className="px-5 py-4 text-right text-[12px] text-[#5b6b8c] tabular-nums">¥{row.cost.toFixed(4)}</td>
                  <td className="px-5 py-4 text-right">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[12px] font-semibold tabular-nums ${
                        row.success_rate >= 0.99 ? 'text-emerald-600' : row.success_rate >= 0.9 ? 'text-amber-600' : 'text-rose-600'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${row.success_rate >= 0.99 ? 'bg-emerald-500' : row.success_rate >= 0.9 ? 'bg-amber-500' : 'bg-rose-500'}`} />
                      {formatShare(row.success_rate)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-[12px] text-[#5b6b8c] tabular-nums">{row.avg_ttft_ms.toFixed(0)} ms</td>
                  <td className="px-5 py-4 text-right text-[12px] text-[#5b6b8c] tabular-nums">{row.p50_tps.toFixed(1)} tok/s</td>
                  <td className="px-5 py-4 text-right text-[12px] text-[#5b6b8c] tabular-nums">{formatShare(row.cache_hit_rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
