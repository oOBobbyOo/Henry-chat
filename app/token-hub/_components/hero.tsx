import Link from 'next/link'

import { ArrowRight, Boxes, Braces, Check, ChevronRight, GitMerge, LayoutGrid, Route, Sparkles, Terminal } from 'lucide-react'
import { getT } from 'next-i18next/server'

/** Hero 主视觉 —— 左侧文案 + 右侧「路由控制面」示意卡片 */
export async function Hero() {
  const { t } = await getT('token-hub')

  const checks = [t('Hero Check 1'), t('Hero Check 2'), t('Hero Check 3')]

  const clients = [
    { key: 'Console Client 1', icon: Terminal, bg: 'bg-[#28214b]' },
    { key: 'Console Client 2', icon: Braces, bg: 'bg-[#183a52]' },
    { key: 'Console Client 3', icon: LayoutGrid, bg: 'bg-[#1f2a4d]' },
  ]

  const routes = [
    { index: '01', label: t('Console Route 1 Label'), meta: t('Console Route 1 Meta') },
    { index: '02', label: t('Console Route 2 Label'), meta: t('Console Route 2 Meta') },
  ]

  return (
    <section className="relative overflow-hidden border-b border-[#dce5f6] bg-[radial-gradient(circle_at_75%_16%,rgb(112_141_255/0.18),transparent_25rem),radial-gradient(circle_at_8%_45%,rgb(113_224_183/0.12),transparent_22rem),linear-gradient(180deg,#ffffff_0%,#f4f7ff_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-[6%] top-28 h-44 w-44 rounded-full bg-[#dce6ff] blur-3xl"
      />
      <div className="relative mx-auto grid max-w-330 gap-12 px-5 pb-20 pt-16 sm:px-8 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_530px] lg:items-center lg:gap-16 lg:py-24">
        {/* 左侧文案 */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d8e2fc] bg-white/85 px-3 py-1.5 text-[11px] font-bold tracking-[0.13em] text-[#294fd4]">
            <Sparkles
              className="h-3 w-3"
              aria-hidden="true"
            />
            {t('Hero Badge')}
          </span>

          <h1 className="mt-6 max-w-3xl text-[38px] font-semibold leading-[1.07] tracking-[-0.06em] text-[#0f1c3a] sm:text-[44px] lg:text-[50px]">
            {t('Hero Title Line 1')}
            <br />
            <span className="text-[#4269ee]">{t('Hero Title Highlight')}</span>
            {t('Hero Title Line 2')}
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-8 text-[#5b6b8c] sm:text-[17px]">{t('Hero Subtitle')}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/api/logto/sign-in"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#4269ee_0%,#3158e8_58%,#294fd4_100%)] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgb(49_88_232/0.23)] transition hover:bg-[linear-gradient(135deg,#4b70f2_0%,#3a61ed_58%,#3158e8_100%)] hover:shadow-[0_10px_28px_rgb(49_88_232/0.3)] focus-visible:ring-4 focus-visible:ring-[#4269ee]/20 focus-visible:outline-none"
            >
              {t('Hero CTA Primary')}
              <ArrowRight
                className="h-4 w-4"
                aria-hidden="true"
              />
            </Link>
            <Link
              href="#routing"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#dce5f6] bg-white px-5 text-sm font-semibold text-[#5b6b8c] transition hover:border-[#c9d4ee] hover:bg-[#f8faff] hover:text-[#294fd4] focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none"
            >
              <Route
                className="h-4 w-4"
                aria-hidden="true"
              />
              {t('Hero CTA Secondary')}
            </Link>
          </div>

          <ul className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#8a9bc0]">
            {checks.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-1.5"
              >
                <Check
                  className="h-3.5 w-3.5 text-[#10b981]"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* 右侧路由控制面示意卡片 */}
        <div className="relative overflow-hidden rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_88%_6%,rgb(82_112_236/0.42),transparent_26%),linear-gradient(145deg,#0a1c42_0%,#102c63_56%,#0b2048_100%)] p-4 shadow-[0_28px_70px_rgb(16_35_79/0.25)] sm:p-5">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-35 bg-[linear-gradient(rgb(161_185_255/0.19)_1px,transparent_1px),linear-gradient(90deg,rgb(161_185_255/0.19)_1px,transparent_1px)] bg-size-[28px_28px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#5f7cff]/25 blur-3xl"
          />

          <div className="relative">
            {/* 卡片头部 */}
            <div className="flex items-center justify-between border-b border-white/16 pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <span className="h-2 w-2 rounded-full bg-[#5ce1b2] shadow-[0_0_0_4px_rgb(92_225_178/0.13)]" />
                {t('Console Title')}
              </div>
              <span className="rounded-full bg-white/9 px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] text-white/70">{t('Console Badge')}</span>
            </div>

            {/* 三列：客户端 → 路由策略 */}
            <div className="mt-4 grid gap-3 sm:grid-cols-[0.88fr_42px_1.12fr] sm:items-stretch">
              <div className="rounded-2xl border border-white/[0.07] bg-[#173461]/90 p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_12px_28px_rgb(0_9_34/0.22)]">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold tracking-[0.16em] text-[#a8b8ff]">{t('Console Column Clients')}</p>
                  <Boxes
                    className="h-4 w-4 text-[#829fff]"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  {clients.map(({ key, icon: Icon, bg }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-xl bg-white/5.5 px-2.5 py-2 text-xs text-white/90"
                    >
                      <span className="flex items-center gap-2">
                        <span className={`grid h-6 w-6 place-items-center rounded-lg ${bg}`}>
                          <Icon
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </span>
                        {t(key)}
                      </span>
                      <ChevronRight
                        className="h-3 w-3 text-white/35"
                        aria-hidden="true"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRight
                  className="h-5 w-5 text-[#829fff]/70"
                  aria-hidden="true"
                />
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-[#173461]/90 p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_12px_28px_rgb(0_9_34/0.22)]">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold tracking-[0.16em] text-[#a8b8ff]">{t('Console Column Routes')}</p>
                  <Route
                    className="h-4 w-4 text-[#829fff]"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-1 text-[10px] text-white/50">{t('Console Routes Hint')}</p>
                <div className="mt-3 space-y-2">
                  {routes.map((route) => (
                    <div
                      key={route.index}
                      className="flex items-center justify-between rounded-xl bg-white/5.5 px-2.5 py-2.5"
                    >
                      <span className="flex items-center gap-2 text-[11px] font-semibold text-white/90">
                        <span className="grid h-5 w-5 place-items-center rounded-md bg-[#5f7cff]/20 text-[10px] font-bold text-[#a8b8ff]">{route.index}</span>
                        {route.label}
                      </span>
                      <span className="text-[10px] text-white/55">{route.meta}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 卡片底部 */}
            <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/4 px-4 py-3">
              <span className="flex items-center gap-2 text-xs font-semibold text-white/80">
                <GitMerge
                  className="h-4 w-4 text-[#5ce1b2]"
                  aria-hidden="true"
                />
                {t('Console Route Footer')}
              </span>
              <span className="flex items-center gap-2">
                <span className="text-[10px] text-white/50">{t('Console Obs Meta')}</span>
                <span className="text-xs font-semibold text-[#a8b8ff]">{t('Console Column Obs')}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
