import { ShieldCheck } from 'lucide-react'
import { getT } from 'next-i18next/server'

/** 「无需重写客户端」声明 + 路由策略示意（#routing） */
export async function Routing() {
  const { t } = await getT('token-hub')

  return (
    <>
      {/* 无需重写客户端 */}
      <section className="border-y border-[#dce5f6] bg-[radial-gradient(circle_at_20%_20%,rgb(112_141_255/0.1),transparent_20rem),linear-gradient(180deg,#f4f7ff_0%,#ffffff_100%)]">
        <div className="mx-auto max-w-330 px-5 py-20 text-center sm:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#294fd4]">
            {t('NoRewrite Title')}
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-[28px] font-semibold leading-tight tracking-tight text-[#0f1c3a] sm:text-[34px]">
            {t('NoRewrite Line 1')}
            <br className="sm:hidden" />
            {t('NoRewrite Line 2')}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-8 text-[#5b6b8c]">
            {t('NoRewrite Desc')}
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#d8e2fc] bg-white/80 px-4 py-1.5 text-xs font-medium text-[#5b6b8c]">
            <ShieldCheck
              className="h-3.5 w-3.5 text-[#10b981]"
              aria-hidden="true"
            />
            {t('NoRewrite Note')}
          </p>
        </div>
      </section>

      {/* 路由策略示意 */}
      <section
        id="routing"
        className="scroll-mt-24"
      >
        <div className="mx-auto max-w-330 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[30px] font-semibold leading-tight tracking-tight text-[#0f1c3a] sm:text-[36px]">
              {t('Routing Heading')}
            </h2>
            <p className="mt-3 text-[15px] text-[#5b6b8c]">{t('Routing Subtitle')}</p>
          </div>

          <article className="mx-auto mt-12 max-w-3xl overflow-hidden rounded-[28px] border border-[#e4ebf9] bg-white shadow-[0_20px_50px_rgb(16_35_79/0.06)]">
            {/* 卡片头部 */}
            <header className="flex items-center justify-between border-b border-[#eef2fb] px-7 py-5 sm:px-9">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[#4269ee]" />
                <span className="text-sm font-semibold text-[#0f1c3a]">
                  {t('Routing Alias Label')}
                </span>
                <code className="rounded-lg bg-[#eef3ff] px-2.5 py-1 font-mono text-sm font-semibold text-[#294fd4]">
                  {t('Routing Alias Value')}
                </code>
              </div>
              <span className="rounded-full border border-[#d8e2fc] bg-[#eef3ff] px-2.5 py-1 text-[11px] font-semibold text-[#294fd4]">
                {t('Routing Badge')}
              </span>
            </header>

            <div className="space-y-4 px-7 py-7 sm:px-9">
              {/* 别名说明 */}
              <div className="rounded-2xl border border-[#eef2fb] bg-[#f7f9fd] px-5 py-4">
                <p className="text-sm font-semibold text-[#0f1c3a]">{t('Routing Alias Label')}</p>
                <p className="mt-1 text-xs text-[#8a9bc0]">{t('Routing Alias Desc')}</p>
              </div>

              {/* 优先路径 */}
              <ConfigRow
                label={t('Routing Primary Label')}
                value={t('Routing Primary Value')}
                desc={t('Routing Primary Desc')}
                tone="primary"
              />
              {/* 回退路径 */}
              <ConfigRow
                label={t('Routing Fallback Label')}
                value={t('Routing Fallback Value')}
                desc={t('Routing Fallback Desc')}
                tone="fallback"
              />
              {/* 保护策略 */}
              <ConfigRow
                label={t('Routing Guard Label')}
                value={t('Routing Guard Value')}
                desc={t('Routing Guard Desc')}
                tone="guard"
              />
            </div>
          </article>
        </div>
      </section>
    </>
  )
}

/** 示例配置中的单条策略行 */
function ConfigRow({
  label,
  value,
  desc,
  tone,
}: {
  label: string
  value: string
  desc: string
  tone: 'primary' | 'fallback' | 'guard'
}) {
  const toneStyles = {
    primary: 'bg-[#eef3ff] text-[#294fd4]',
    fallback: 'bg-[#eefbf6] text-[#0f9d6c]',
    guard: 'bg-[#fdf3ee] text-[#d4622a]',
  }[tone]

  const dotStyles = {
    primary: 'bg-[#4269ee]',
    fallback: 'bg-[#21c183]',
    guard: 'bg-[#ef8a4a]',
  }[tone]

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[#eef2fb] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotStyles}`} />
        <span className="text-sm font-semibold text-[#0f1c3a]">{label}</span>
        <span className={`rounded-md px-2 py-0.5 font-mono text-xs font-semibold ${toneStyles}`}>
          {value}
        </span>
      </div>
      <p className="text-xs text-[#8a9bc0]">{desc}</p>
    </div>
  )
}
