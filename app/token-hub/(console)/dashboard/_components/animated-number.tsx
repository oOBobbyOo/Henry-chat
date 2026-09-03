'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * 数字滚动动画 —— 数值从 0 快速递增到目标值
 * @param value 目标数值
 * @param duration 动画时长(ms)
 */
export function AnimatedNumber({ value, duration = 800 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const start = performance.now()
    const from = 0
    const to = value

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      // easeOutCubic —— 先快后慢
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(from + (to - from) * eased)
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [value, duration])

  return <span className="tabular-nums">{display}</span>
}
