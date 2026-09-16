import type { LucideIcon } from 'lucide-react'

import { AnimatedNumber } from './animated-number'

/**
 * 迷你趋势图 —— 轻量 SVG sparkline(纯展示,无交互)
 * @param data 数值序列，自动归一化绘制面积折线
 */
export function Sparkline({ data, className }: { data: number[]; className?: string }) {
  if (!data.length) return <div className={className} />

  const width = 120
  const height = 46
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const range = max - min || 1
  const step = width / Math.max(data.length - 1, 1)

  const points = data.map((v, i) => [i * step, height - 4 - ((v - min) / range) * (height - 8)])
  const line = points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `0,${height} ${line} ${width},${height}`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <polygon
        points={area}
        fill="currentColor"
        opacity="0.08"
      />
      <polyline
        points={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/** 指标卡 —— 标题 + 图标 + 滚动数字 + 迷你趋势图 */
export function MetricCard({
  label,
  hint,
  icon: Icon,
  value,
  display,
  unit,
  data,
  tone = 'primary',
}: {
  /** 指标标题 */
  label: string
  /** 底部说明(如「24 小时累计」) */
  hint: string
  /** 右上角图标 */
  icon: LucideIcon
  /** 动画目标数值(用于数字滚动) */
  value: number
  /** 展示文案(如 ¥1.01 / 100.0%)；优先于 AnimatedNumber */
  display?: string
  /** 数值后缀单位(如 M / K) */
  unit?: string
  /** 迷你趋势数据 */
  data: number[]
  /** 图标&趋势主题色 */
  tone?: 'primary' | 'green' | 'amber' | 'violet' | 'sky'
}) {
  const toneMap = {
    primary: {
      icon: 'bg-(--tc-blue-soft) text-(--tc-blue-bright)',
      spark: 'text-(--tc-blue-bright)',
    },
    green: { icon: 'bg-emerald-50 text-emerald-600', spark: 'text-emerald-500' },
    amber: { icon: 'bg-amber-50 text-amber-600', spark: 'text-amber-500' },
    violet: { icon: 'bg-violet-50 text-violet-600', spark: 'text-violet-500' },
    sky: { icon: 'bg-sky-50 text-sky-600', spark: 'text-sky-500' },
  }[tone]

  return (
    <div className="group overflow-hidden rounded-[15px] border border-(--tc-border) bg-(--tc-surface) shadow-[0_1px_2px_rgb(15_38_79/0.04)] transition-shadow duration-200 hover:shadow-[0_4px_16px_rgb(28_55_105/0.06)]">
      <div className="p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 truncate pt-1 text-[13px] font-semibold tracking-[-0.012em] text-(--tc-strong)">
            {label}
          </p>
          <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${toneMap.icon}`}>
            <Icon className="h-4 w-4" />
          </span>
        </div>

        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_118px] items-end gap-3 xl:grid-cols-[minmax(0,1fr)_126px] 2xl:grid-cols-[minmax(0,1fr)_136px]">
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              {display ? (
                <span className="truncate text-[24px] leading-none font-semibold tracking-[-0.03em] text-(--tc-strong) tabular-nums">
                  {display}
                </span>
              ) : (
                <>
                  <span className="text-[24px] leading-none font-semibold tracking-[-0.03em] text-(--tc-strong)">
                    <AnimatedNumber value={value} />
                  </span>
                  {unit && <span className="text-sm font-semibold text-(--tc-muted)">{unit}</span>}
                </>
              )}
            </div>
          </div>
          <div className={`h-11.5 w-full min-w-0 ${toneMap.spark}`}>
            <Sparkline
              data={data}
              className="h-full w-full"
            />
          </div>
        </div>

        <p className="mt-2.5 truncate text-[11px] font-medium text-(--tc-muted)">{hint}</p>
      </div>
    </div>
  )
}
