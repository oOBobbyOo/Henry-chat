'use client'

import { ChevronLeft, ChevronRight, ListFilter, ReceiptText } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { cn } from '@/lib/utils'

/**
 * 余额明细卡 —— 每笔余额增加与扣费记录(分页表格)
 * 列: 明细 / 时间 / 变动后余额 / 变动金额;底部: 共 N 笔 + 分页
 */
export function BalanceDetailsCard({ transactions, page, onPageChange }: { transactions: TokenHub.BalanceTransactionsResponse; page: number; onPageChange: (page: number) => void }) {
  const { t } = useT('token-hub')

  const total = transactions.total
  const totalPages = Math.max(1, Math.ceil(total / transactions.page_size))

  /** 分页窗口(当前页 ±1) */
  const pageWindow = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)

  const formatDateTime = (iso: string) => {
    const d = new Date(iso)
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="overflow-hidden rounded-[15px] border border-[#dce5f6] bg-white shadow-[0_1px_2px_rgb(15_38_79/0.04)]">
      {/* 标题 */}
      <div className="flex flex-col gap-3 border-b border-[#dce5f6] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#0f1c3a]">{t('Profile Balance Details')}</h2>
          <p className="mt-1 text-xs text-[#8a9bc0]">{t('Profile Balance Details Desc')}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs whitespace-nowrap text-[#8a9bc0]">
            {t('Profile Total')} <span className="font-semibold text-[#0f1c3a] tabular-nums">{total}</span> {t('Profile Total Unit')}
          </span>
          <button
            type="button"
            className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-[#dce5f6] bg-white px-3 text-xs font-semibold text-[#5b6b8c] transition hover:bg-[#eef3ff] hover:text-[#294fd4]"
          >
            <ListFilter className="h-3.5 w-3.5" />
            {t('Profile Detail')}
          </button>
        </div>
      </div>

      {/* 表格 */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-140 border-collapse text-left">
          <thead>
            <tr className="border-b border-[#dce5f6] bg-[#f7f9fd]/70">
              <th
                scope="col"
                className="px-5 py-3 text-[11px] font-bold tracking-[0.06em] whitespace-nowrap text-[#8a9bc0] uppercase"
              >
                {t('Profile Col Detail')}
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-[11px] font-bold tracking-[0.06em] whitespace-nowrap text-[#8a9bc0] uppercase"
              >
                {t('Profile Col Time')}
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-right text-[11px] font-bold tracking-[0.06em] whitespace-nowrap text-[#8a9bc0] uppercase"
              >
                {t('Profile Col After')}
              </th>
              <th
                scope="col"
                className="px-5 py-3 text-right text-[11px] font-bold tracking-[0.06em] whitespace-nowrap text-[#8a9bc0] uppercase"
              >
                {t('Profile Col Amount')}
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.items.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-[#dce5f6]/60 transition-colors last:border-b-0 hover:bg-[#f7f9fd]/60"
              >
                <td className="px-5 py-3.5">
                  <span className="flex items-center gap-2 text-[13px] font-medium text-[#0f1c3a]">
                    <ReceiptText className="h-3.5 w-3.5 shrink-0 text-[#8a9bc0]" />
                    {tx.title}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[12px] whitespace-nowrap text-[#8a9bc0] tabular-nums">{formatDateTime(tx.created_at)}</td>
                <td className="px-5 py-3.5 text-right text-[12px] whitespace-nowrap text-[#0f1c3a] tabular-nums">¥{tx.balance_after.toFixed(2)}</td>
                <td className={cn('px-5 py-3.5 text-right text-[12px] font-semibold whitespace-nowrap tabular-nums', tx.amount_delta > 0 ? 'text-emerald-600' : 'text-[#0f1c3a]')}>
                  {tx.amount_delta > 0 ? '+' : '-'}¥{Math.abs(tx.amount_delta).toFixed(4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      <div className="flex flex-col gap-3 border-t border-[#dce5f6] bg-[#f7f9fd]/50 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-xs text-[#8a9bc0]">
          {t('Profile Pagination Info')} {total} {t('Profile Pagination Unit')}，{t('Profile Pagination Page')} {page} / {totalPages} {t('Profile Pagination Page Unit')}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label={t('Profile Prev')}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#dce5f6] bg-white text-[#5b6b8c] transition hover:bg-[#eef3ff] hover:text-[#294fd4] disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {pageWindow.map((p, idx) => {
            const prev = pageWindow[idx - 1]
            const showGap = prev !== undefined && p - prev > 1
            return (
              <span
                key={p}
                className="flex items-center gap-1"
              >
                {showGap && <span className="px-1 text-xs text-[#8a9bc0]">…</span>}
                <button
                  type="button"
                  onClick={() => onPageChange(p)}
                  aria-current={p === page ? 'page' : undefined}
                  className={cn(
                    'inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-xs font-semibold tabular-nums transition',
                    p === page ? 'bg-[#294fd4] text-white shadow-[0_2px_6px_rgb(49_88_232/0.22)]' : 'text-[#5b6b8c] hover:bg-[#eef3ff] hover:text-[#294fd4]',
                  )}
                >
                  {p}
                </button>
              </span>
            )
          })}

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label={t('Profile Next')}
            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-[#dce5f6] bg-white text-[#5b6b8c] transition hover:bg-[#eef3ff] hover:text-[#294fd4] disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
