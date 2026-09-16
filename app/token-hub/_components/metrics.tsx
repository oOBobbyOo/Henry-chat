import { getT } from 'next-i18next/server'

/** 关键指标条 + 现有工具链展示 */
export async function Metrics() {
  const { t } = await getT('token-hub')

  const metrics = [
    { value: t('Metric 1 Value'), label: t('Metric 1 Label'), desc: t('Metric 1 Desc') },
    { value: t('Metric 2 Value'), label: t('Metric 2 Label'), desc: t('Metric 2 Desc') },
    { value: t('Metric 3 Value'), label: t('Metric 3 Label'), desc: t('Metric 3 Desc') },
    { value: t('Metric 4 Value'), label: t('Metric 4 Label'), desc: t('Metric 4 Desc') },
  ]

  const toolchain = [
    t('Toolchain 1'),
    t('Toolchain 2'),
    t('Toolchain 3'),
    t('Toolchain 4'),
    t('Toolchain 5'),
  ]

  return (
    <section className="border-b border-[#dce5f6] bg-white">
      <div className="mx-auto max-w-330 px-5 py-14 sm:px-8">
        {/* 指标条 */}
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-[20px] border border-[#e4ebf9] bg-[#f7f9fd] px-5 py-6"
            >
              <dt className="text-2xl font-semibold tracking-tight text-[#0f1c3a]">
                {metric.value}
              </dt>
              <dd className="mt-1 text-sm font-semibold text-[#294fd4]">{metric.label}</dd>
              <dd className="mt-2 text-xs leading-relaxed text-[#8a9bc0]">{metric.desc}</dd>
            </div>
          ))}
        </dl>

        {/* 工具链 */}
        <div className="mt-12 flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
          <p className="text-sm font-medium text-[#8a9bc0]">{t('Toolchain Title')}</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {toolchain.map((name) => (
              <span
                key={name}
                className="inline-flex h-8 items-center rounded-full border border-[#e4ebf9] bg-white px-3.5 text-xs font-semibold text-[#5b6b8c]"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
