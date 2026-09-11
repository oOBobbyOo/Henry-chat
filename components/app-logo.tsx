export type AppLogoProps = {
  /** Logo 像素尺寸(默认 40;非 40 时用内联样式覆盖 h-10 w-10) */
  size?: number
  /** 透传 className(作用于外层圆形底,如 mx-auto、hover 缩放等) */
  className?: string
}

/**
 * 品牌 Logo —— 蓝色圆形底 + 渐变描边(无限符号 + 中心圆环)。
 * 圆形底固定 #294fd4,描边使用品牌渐变(上 #9fe8ff → 下 #4d4fa6),亮/暗背景均清晰。
 */
export function AppLogo({ size, className }: AppLogoProps) {
  return (
    <div
      className={`relative grid h-10 w-10 place-items-center overflow-hidden rounded-lg shadow-[0_10px_24px_rgb(16_35_79/0.2)] ${className ?? ''}`}
      style={size && size !== 40 ? { width: size, height: size } : undefined}
    >
      <svg
        viewBox="0 0 40 40"
        className="h-full w-full"
        role="img"
        aria-label="Henry Chat"
      >
        <defs>
          <linearGradient
            id="app-logo-gradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#9fe8ff"
            />
            <stop
              offset="26%"
              stopColor="#38bdf8"
            />
            <stop
              offset="58%"
              stopColor="#6366f1"
            />
            <stop
              offset="82%"
              stopColor="#8b5cf6"
            />
            <stop
              offset="100%"
              stopColor="#4d4fa6"
            />
          </linearGradient>
        </defs>
        {/* 无限符号 —— 环绕中心 */}
        <path
          d="M 12 20 C 12 14.5, 15 11.5, 19 11.5 C 23.5 11.5, 20 18, 20 20 C 20 22, 16.5 28.5, 21 28.5 C 25 28.5, 28 25.5, 28 20"
          fill="none"
          stroke="url(#app-logo-gradient)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        {/* 中心圆环 —— token */}
        <circle
          cx="20"
          cy="20"
          r="3.6"
          fill="none"
          stroke="url(#app-logo-gradient)"
          strokeWidth="2.2"
        />
      </svg>
    </div>
  )
}
