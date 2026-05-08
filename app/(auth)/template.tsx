'use client'

import { usePathname } from 'next/navigation'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

export default function AuthTemplate({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const prefersReducedMotion = useReducedMotion()

  // 判断当前是否为注册页，用于控制滑入/滑出方向
  const isSignup = pathname.includes('/signup')

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname} // 🔑 必须：路由变化时触发 AnimatePresence
        initial={{ opacity: 0, x: isSignup ? 40 : -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isSignup ? -40 : 40 }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
          ease: [0.4, 0, 0.2, 1], // 平滑缓动曲线
        }}
        className="w-full max-w-md"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
