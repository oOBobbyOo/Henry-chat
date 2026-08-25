import { CircleDollarSign, GitBranch, Plug, Route, Telescope } from 'lucide-react'
import { getT } from 'next-i18next/server'

/** 平台能力（#product）—— 模型运营层 + 两张能力卡 + 三大特性 */
export async function Capabilities() {
  const { t } = await getT('token-hub')

  const controlPlaneSteps = [t('Product Card 1 Step 1'), t('Product Card 1 Step 2'), t('Product Card 1 Step 3')]

  const features = [
    { icon: Plug, title: t('Feature 1 Title'), tagline: t('Feature 1 Tagline'), desc: t('Feature 1 Desc') },
    { icon: Route, title: t('Feature 2 Title'), tagline: t('Feature 2 Tagline'), desc: t('Feature 2 Desc') },
    { icon: Telescope, title: t('Feature 3 Title'), tagline: t('Feature 3 Tagline'), desc: t('Feature 3 Desc') },
  ]

  return (
    <section
      id="product"
      className="scroll-mt-24"
    >
      <div className="mx-auto max-w-330 px-5 py-20 sm:px-8">
        {/* 标题 */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[30px] font-semibold leading-tight tracking-tight text-[#0f1c3a] sm:text-[36px]">{t('Product Heading')}</h2>
          <p className="mt-4 text-[15px] leading-8 text-[#5b6b8c]">{t('Product Subtitle')}</p>
        </div>

        {/* 两张能力卡 */}
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <article className="flex flex-col rounded-[24px] border border-[#e4ebf9] bg-white p-7 sm:p-8">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#294fd4]">
              <GitBranch
                className="h-5 w-5"
                aria-hidden="true"
              />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-[#0f1c3a]">{t('Product Card 1 Title')}</h3>
            <p className="mt-2 text-sm leading-7 text-[#5b6b8c]">{t('Product Card 1 Desc')}</p>
            <ol className="mt-6 space-y-2 border-t border-[#eef2fb] pt-5">
              {controlPlaneSteps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-center gap-3 text-sm font-medium text-[#0f1c3a]"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#eef3ff] text-[11px] font-bold text-[#294fd4]">0{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </article>

          <article className="flex flex-col rounded-[24px] border border-[#e4ebf9] bg-white p-7 sm:p-8">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef3ff] text-[#294fd4]">
              <CircleDollarSign
                className="h-5 w-5"
                aria-hidden="true"
              />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-[#0f1c3a]">{t('Product Card 2 Title')}</h3>
            <p className="mt-2 text-sm leading-7 text-[#5b6b8c]">{t('Product Card 2 Desc')}</p>
          </article>
        </div>

        {/* 三大特性 */}
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, tagline, desc }) => (
            <article
              key={title}
              className="rounded-[24px] border border-[#e4ebf9] bg-white p-7 transition-colors hover:border-[#c9d4ee]"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef3ff] text-[#294fd4]">
                <Icon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </span>
              <h3 className="mt-5 text-base font-semibold text-[#0f1c3a]">{title}</h3>
              <p className="mt-1 text-sm font-medium text-[#294fd4]">{tagline}</p>
              <p className="mt-3 text-sm leading-7 text-[#5b6b8c]">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
