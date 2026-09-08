'use client'

import { useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { useT } from 'next-i18next/client'

import { TOKEN_HUB_QUERY_KEYS, useBalanceQuery, useBalanceTransactionsQuery, useKeysQuery, useProfileQuery, useSummaryQuery } from '@/services/token-hub'

import { AccountOverviewCard } from './_components/account-overview-card'
import { BalanceDetailsCard } from './_components/balance-details-card'
import { ProfileInfoCard } from './_components/profile-info-card'
import { QuickLinksCard } from './_components/quick-links-card'

/** 余额明细每页条数(对齐生产) */
const PAGE_SIZE = 10

/**
 * Token Hub 控制台 —— 个人中心
 * 标题 + 刷新 → 用户信息卡 + 账户概览 → 余额明细 + 常用入口
 * 布局对齐生产: Row1 = 1.1fr/0.9fr, Row2 = 1.45fr/0.55fr
 */
export default function ProfilePage() {
  const { t } = useT('token-hub')
  const queryClient = useQueryClient()

  // —— 数据 ——
  const { data: profile } = useProfileQuery()
  const { data: balance } = useBalanceQuery()
  const { data: summary } = useSummaryQuery(30)
  const { data: keysData } = useKeysQuery()

  // —— 余额明细分页 ——
  const [page, setPage] = useState(1)
  const { data: transactions } = useBalanceTransactionsQuery(page, PAGE_SIZE)

  const refresh = () => {
    void queryClient.refetchQueries({ queryKey: TOKEN_HUB_QUERY_KEYS.profile })
    void queryClient.refetchQueries({ queryKey: TOKEN_HUB_QUERY_KEYS.balance })
    void queryClient.refetchQueries({ queryKey: TOKEN_HUB_QUERY_KEYS.summary })
    void queryClient.refetchQueries({ queryKey: TOKEN_HUB_QUERY_KEYS.balanceTransactions })
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-7 sm:px-6 sm:py-8 lg:px-4 lg:py-9">
      <div className="space-y-6">
        {/* 标题区 */}
        <header className="flex items-center justify-between gap-4 border-b border-(--tc-border)/80 pb-5">
          <div>
            <h1 className="text-[24px] font-semibold tracking-[-0.045em] text-(--tc-strong) sm:text-[26px]">{t('Profile Title')}</h1>
            <p className="mt-1.5 text-sm text-(--tc-body)">{t('Profile Subtitle')}</p>
          </div>
          <button
            type="button"
            onClick={refresh}
            title={t('Profile Refresh')}
            aria-label={t('Profile Refresh')}
            className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-xl border border-(--tc-border) bg-(--tc-surface) text-(--tc-body) transition hover:bg-(--tc-blue-soft) hover:text-(--tc-primary-text) focus-visible:ring-2 focus-visible:ring-(--tc-primary-hover)/35 focus-visible:outline-none active:rotate-180 active:duration-300"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </header>

        {/* Row1: 用户信息卡 + 账户概览(1.1fr / 0.9fr) */}
        <section className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <ProfileInfoCard profile={profile} />
          <AccountOverviewCard
            balance={balance}
            summary={summary}
            activeKeyCount={keysData.items.filter((k) => k.status === 'active').length}
          />
        </section>

        {/* Row2: 余额明细 + 常用入口(1.45fr / 0.55fr) */}
        <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.55fr)]">
          <BalanceDetailsCard
            transactions={transactions}
            page={page}
            onPageChange={setPage}
          />
          <QuickLinksCard />
        </section>
      </div>
    </main>
  )
}
