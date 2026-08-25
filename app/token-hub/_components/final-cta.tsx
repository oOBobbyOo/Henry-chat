import Link from 'next/link'

import { ArrowRight } from 'lucide-react'
import { getT } from 'next-i18next/server'

/** 结尾 CTA —— 从一把 Key 开始 */
export async function FinalCta() {
  const { t } = await getT('token-hub')

  return (
    <section className="relative overflow-hidden bg-[#0a1c42]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 bg-[linear-gradient(rgb(161_185_255/0.12)_1px,transparent_1px),linear-gradient(90deg,rgb(161_185_255/0.12)_1px,transparent_1px)] bg-size-[28px_28px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-[10%] h-64 w-64 rounded-full bg-[#5f7cff]/25 blur-3xl"
      />
      <div className="relative mx-auto max-w-330 px-5 py-20 text-center sm:px-8 sm:py-24">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#a8b8ff]">{t('Cta Heading')}</p>
        <h2 className="mx-auto mt-4 max-w-2xl text-[28px] font-semibold leading-tight tracking-tight text-white sm:text-[36px]">{t('Cta Title')}</h2>
        <div className="mt-8 flex justify-center">
          <Link
            href="/api/logto/sign-in"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#4269ee_0%,#3158e8_58%,#294fd4_100%)] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgb(49_88_232/0.35)] transition hover:bg-[linear-gradient(135deg,#4b70f2_0%,#3a61ed_58%,#3158e8_100%)] hover:shadow-[0_12px_30px_rgb(49_88_232/0.45)] focus-visible:ring-4 focus-visible:ring-[#5f7cff]/40 focus-visible:outline-none"
          >
            {t('Cta Button')}
            <ArrowRight
              className="h-4 w-4"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
