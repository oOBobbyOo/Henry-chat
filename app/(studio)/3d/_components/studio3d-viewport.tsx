'use client'

import { Box } from 'lucide-react'
import { useT } from 'next-i18next/client'

/**
 * 3D 建模中部视口 —— 空态占位(圆环图标 + 引导文案)
 * 生成完成或选中资产后此处替换为 three.js 预览(canvas),当前阶段为空态结构先行
 */
export function Studio3dViewport() {
  const { t } = useT('studio3d')

  return (
    <div className="flex h-full min-h-0 min-w-0">
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[rgba(12,24,36,0.08)] bg-[rgba(245,249,255,0.95)] text-[#5b6b8c] dark:border-white/10 dark:bg-white/5 dark:text-[#8a9bc0]">
          <Box
            aria-hidden
            className="h-9 w-9"
            strokeWidth={1.75}
          />
        </div>
        <div>
          <p className="text-[14px] font-medium text-[#2e4268] dark:text-[#b6c4dc]">{t('Preview placeholder title')}</p>
          <p className="mt-1 text-[12px] text-[#4e6585] dark:text-[#6b7f9d]">{t('Preview placeholder hint')}</p>
        </div>
      </div>
    </div>
  )
}
