import Link from 'next/link'

import { ArrowRight, Gauge, KeyRound, Lock } from 'lucide-react'
import { getT } from 'next-i18next/server'

/** 安全与治理（#governance）—— 内建治理能力 */
export async function Governance() {
  const { t } = await getT('token-hub')

  const cards = [
    { icon: KeyRound, title: t('Governance Card 1 Title'), desc: t('Governance Card 1 Desc') },
    { icon: Lock, title: t('Governance Card 2 Title'), desc: t('Governance Card 2 Desc') },
    { icon: Gauge, title: t('Governance Card 3 Title'), desc: t('Governance Card 3 Desc') },
  ]

  return (
    <section
      id="governance"
      className="scroll-mt-24 border-t border-[#dce5f6] bg-[#f4f7ff]"
    >
      <div className="mx-auto max-w-330 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#294fd4]">
            {t('Governance Heading')}
          </p>
          <h2 className="mt-4 text-[30px] font-semibold leading-tight tracking-tight text-[#0f1c3a] sm:text-[36px]">
            {t('Governance Title')}
          </h2>
          <p className="mt-4 text-[15px] leading-8 text-[#5b6b8c]">{t('Governance Desc')}</p>
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/usage"
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#dce5f6] bg-white px-4 text-sm font-semibold text-[#294fd4] transition hover:border-[#c9d4ee] hover:bg-[#f8faff] focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none"
          >
            {t('Governance CTA 1')}
            <ArrowRight
              className="h-4 w-4"
              aria-hidden="true"
            />
          </Link>
          <Link
            href="#workflow"
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[#dce5f6] bg-white px-4 text-sm font-semibold text-[#294fd4] transition hover:border-[#c9d4ee] hover:bg-[#f8faff] focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none"
          >
            {t('Governance CTA 2')}
            <ArrowRight
              className="h-4 w-4"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {cards.map(({ icon: Icon, title, desc }) => (
            <article
              key={title}
              className="rounded-[24px] border border-[#e4ebf9] bg-white p-7 transition-colors hover:border-[#c9d4ee]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#294fd4]">
                <Icon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </span>
              <h3 className="mt-5 text-base font-semibold text-[#0f1c3a]">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5b6b8c]">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
