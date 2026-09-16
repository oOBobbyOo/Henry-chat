import Link from 'next/link'

import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react'
import { getT } from 'next-i18next/server'

import { BrandLogo } from '@/components/brand-logo'
import { LanguageSelector } from '@/components/language-selector'

/** 顶部公告栏 —— 最新上架模型滚动提示 */
async function AnnouncementBar() {
  const { t } = await getT('token-hub')

  return (
    <div
      role="status"
      aria-label={t('Newly Listed')}
      className="border-b border-[#dce5f6] bg-[#eef3ff] px-5 py-2 text-center text-xs text-[#8a9bc0] sm:px-8"
    >
      <div className="mx-auto flex min-h-5 max-w-295 items-center justify-center gap-2 overflow-hidden whitespace-nowrap">
        <span className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-[#294fd4]">
          <Sparkles
            className="h-3.25 w-3.25"
            aria-hidden="true"
          />
          {t('Newly Listed')}
        </span>
        <span className="shrink-0 text-[#afbddb]">·</span>
        <span className="min-w-0 max-w-28 truncate font-semibold text-[#1c2c4d] sm:max-w-none">
          Qwen3.8-27B
        </span>
        <span className="hidden shrink-0 items-center gap-1.5 rounded-md bg-white/70 px-2 py-1 text-[11px] font-medium text-[#8a9bc0] sm:inline-flex">
          <span className="text-[#b1bfd0]">{t('Context')}</span>
          <strong className="font-semibold text-[#8a9bc0]">991K</strong>
        </span>
        <span className="hidden min-w-0 shrink items-center gap-1.5 rounded-md bg-white/70 px-2 py-1 text-[11px] font-medium text-[#8a9bc0] md:inline-flex">
          <span className="shrink-0 text-[#b1bfd0]">{t('Input')}</span>
          <strong className="truncate font-semibold text-[#8a9bc0]">
            {t('Text · Image · Video')}
          </strong>
        </span>
        <Link
          href="/plaza"
          className="ml-1 inline-flex shrink-0 items-center gap-0.5 rounded-md font-semibold text-[#294fd4] transition-colors hover:text-[#4269ee] focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none"
        >
          {t('Model Plaza')}
          <ChevronRight
            className="h-3.25 w-3.25"
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  )
}

/** Token Hub 门户头部 —— Logo + 导航 + 登录按钮 */
export async function AppHeader() {
  const { t } = await getT('token-hub')

  const navItems = [
    { href: '#product', label: t('Platform Capabilities') },
    { href: '#routing', label: t('Routing Control') },
    { href: '#workflow', label: t('Integration Flow') },
    { href: '#governance', label: t('Security & Governance') },
  ]

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-20 border-b border-[#dce5f6]/85 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-19 max-w-330 items-center justify-between px-5 sm:px-8">
          <BrandLogo />

          <nav
            aria-label="门户导航"
            className="hidden items-center gap-7 text-sm font-medium text-[#8a9bc0] lg:flex"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md transition-colors hover:text-[#294fd4] focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="#product"
              className="rounded-md text-sm font-semibold text-[#8a9bc0] transition-colors hover:text-[#294fd4] focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none sm:hidden"
            >
              {t('Capabilities')}
            </Link>
            <Link
              href="/plaza"
              className="hidden rounded-md text-sm font-semibold text-[#8a9bc0] transition-colors hover:text-[#294fd4] focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none sm:inline"
            >
              {t('Model Plaza')}
            </Link>
            <LanguageSelector />
            <Link
              href="/api/logto/sign-in"
              aria-label={t('Sign in to get started')}
              className="group inline-flex h-11 items-center gap-2 rounded-[14px] border border-white/20 bg-[linear-gradient(135deg,#4269ee_0%,#3158e8_58%,#294fd4_100%)] px-4 text-sm font-semibold text-white shadow-[0_8px_20px_rgb(49_88_232/0.22),inset_0_1px_0_rgb(255_255_255/0.22)] transition-[background,box-shadow] duration-200 hover:bg-[linear-gradient(135deg,#4b70f2_0%,#3a61ed_58%,#3158e8_100%)] hover:shadow-[0_10px_24px_rgb(49_88_232/0.29),inset_0_1px_0_rgb(255_255_255/0.28)] focus-visible:ring-4 focus-visible:ring-[#4269ee]/20 focus-visible:outline-none active:shadow-[0_5px_12px_rgb(49_88_232/0.22)]"
            >
              <span>{t('Sign In')}</span>
              <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15 transition-colors group-hover:bg-white/22">
                <ArrowRight
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
