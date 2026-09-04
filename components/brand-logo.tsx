import Link from 'next/link'

/** Token Hub 品牌 Logo —— 蓝色圆形底 + 白色无限符号 + 中心 token 圆环 */
export function BrandLogo({ href = '/' }: { href?: string }) {
  return (
    <Link
      href={href}
      aria-label="Token Hub"
      className="shrink-0 rounded-lg px-2 focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none"
    >
      <span className="inline-flex items-center gap-3">
        <span
          aria-hidden="true"
          className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-[#294fd4] shadow-[0_10px_24px_rgb(16_35_79/0.2)]"
        >
          <svg
            viewBox="0 0 40 40"
            className="h-full w-full"
            role="img"
          >
            {/* 无限符号 —— 环绕中心，白色 */}
            <path
              d="M 12 20 C 12 14.5, 15 11.5, 19 11.5 C 23.5 11.5, 20 18, 20 20 C 20 22, 16.5 28.5, 21 28.5 C 25 28.5, 28 25.5, 28 20"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            {/* 中心圆环 —— token，白色 */}
            <circle
              cx="20"
              cy="20"
              r="3.6"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.2"
            />
          </svg>
        </span>
        <span className="leading-none hidden lg:block">
          <span className="block text-[15px] font-semibold tracking-[-0.04em] text-[#1c2c4d]">Token Hub</span>
          <span className="mt-1 block text-[9px] font-bold tracking-[0.18em] text-[#b1bfd0] uppercase">AI Gateway</span>
        </span>
      </span>
    </Link>
  )
}
