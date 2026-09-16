import Link from 'next/link'

import { ArrowRight, UserCog, UserRound } from 'lucide-react'
import { getT } from 'next-i18next/server'

/** 接入流程（#workflow）—— 平台管理员 / 开发者 两条路径 */
export async function Workflow() {
  const { t } = await getT('token-hub')

  const adminSteps = [
    t('Workflow Admin Step 1'),
    t('Workflow Admin Step 2'),
    t('Workflow Admin Step 3'),
  ]
  const devSteps = [t('Workflow Dev Step 1'), t('Workflow Dev Step 2'), t('Workflow Dev Step 3')]

  return (
    <section
      id="workflow"
      className="scroll-mt-24 border-t border-[#dce5f6] bg-white"
    >
      <div className="mx-auto max-w-330 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[30px] font-semibold leading-tight tracking-tight text-[#0f1c3a] sm:text-[36px]">
            {t('Workflow Heading')}
          </h2>
          <p className="mt-4 text-[15px] leading-8 text-[#5b6b8c]">{t('Workflow Desc')}</p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {/* 平台管理员 */}
          <RoleCard
            tone="admin"
            icon={UserCog}
            role={t('Workflow Admin Role')}
            tagline={t('Workflow Admin Tagline')}
            desc={t('Workflow Admin Desc')}
            steps={adminSteps}
          />
          {/* 开发者 */}
          <RoleCard
            tone="dev"
            icon={UserRound}
            role={t('Workflow Dev Role')}
            tagline={t('Workflow Dev Tagline')}
            desc={t('Workflow Dev Desc')}
            steps={devSteps}
          />
        </div>

        {/* 登录引导 */}
        <div className="mt-10 flex flex-col items-center gap-4 rounded-[24px] border border-[#e4ebf9] bg-[#f7f9fd] px-6 py-8 text-center sm:flex-row sm:justify-between sm:px-10 sm:text-left">
          <div>
            <p className="text-base font-semibold text-[#0f1c3a]">{t('Workflow Note')}</p>
            <p className="mt-1 text-sm text-[#8a9bc0]">{t('Workflow Note Desc')}</p>
          </div>
          <Link
            href="/api/logto/sign-in"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#4269ee_0%,#3158e8_58%,#294fd4_100%)] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgb(49_88_232/0.23)] transition hover:bg-[linear-gradient(135deg,#4b70f2_0%,#3a61ed_58%,#3158e8_100%)] hover:shadow-[0_10px_28px_rgb(49_88_232/0.3)] focus-visible:ring-4 focus-visible:ring-[#4269ee]/20 focus-visible:outline-none"
          >
            {t('Workflow CTA')}
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

/** 单个角色接入路径卡片 */
function RoleCard({
  icon: Icon,
  tone,
  role,
  tagline,
  desc,
  steps,
}: {
  icon: typeof UserCog
  tone: 'admin' | 'dev'
  role: string
  tagline: string
  desc: string
  steps: string[]
}) {
  const muted = tone === 'admin'

  return (
    <article className="flex flex-col rounded-[24px] border border-[#e4ebf9] bg-white p-7 sm:p-8">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${muted ? 'bg-[#eef3ff] text-[#294fd4]' : 'bg-[#eefbf6] text-[#0f9d6c]'}`}
        >
          <Icon
            className="h-5 w-5"
            aria-hidden="true"
          />
        </span>
        <p
          className={`text-[11px] font-bold uppercase tracking-[0.16em] ${muted ? 'text-[#294fd4]' : 'text-[#0f9d6c]'}`}
        >
          {role}
        </p>
      </div>

      <h3 className="mt-5 text-lg font-semibold text-[#0f1c3a]">{tagline}</h3>
      <p className="mt-2 text-sm leading-7 text-[#5b6b8c]">{desc}</p>

      <ol className="mt-6 space-y-3 border-t border-[#eef2fb] pt-6">
        {steps.map((step, index) => (
          <li
            key={step}
            className="flex items-center gap-3"
          >
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[12px] font-bold ${muted ? 'bg-[#eef3ff] text-[#294fd4]' : 'bg-[#eefbf6] text-[#0f9d6c]'}`}
            >
              {index + 1}
            </span>
            <span className="text-sm font-medium text-[#0f1c3a]">{step}</span>
          </li>
        ))}
      </ol>
    </article>
  )
}
