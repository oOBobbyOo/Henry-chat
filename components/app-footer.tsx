import Link from 'next/link'

import { Globe, Mail, MessageSquare, Send } from 'lucide-react'

const PRODUCT_LINKS = [
  { label: '广场', href: '/' },
  { label: '排行榜', href: '/rankings' },
  { label: 'AI 对话', href: '/chat-ai' },
  { label: 'Token 中心', href: '/token-hub' },
]

const RESOURCE_LINKS = [
  { label: '使用文档', href: '#' },
  { label: '服务条款', href: '#' },
  { label: '隐私政策', href: '#' },
]

const SOCIAL_LINKS = [
  { label: '官网', href: '#', Icon: Globe },
  { label: 'Discord', href: '#', Icon: MessageSquare },
  { label: 'Telegram', href: '#', Icon: Send },
]

function FooterLinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] font-semibold tracking-[0.12em] text-[#718096] uppercase dark:text-white/50">{title}</p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[13px] text-gray-500 transition hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AppFooter() {
  return (
    <footer className="px-4 pb-6 lg:px-5">
      <div className="mx-auto w-full max-w-(--app-content-max-width) rounded-[20px] border border-gray-200 bg-transparent p-6 shadow-sm saturate-145 backdrop-blur-xl sm:p-8 dark:border-white/8 dark:bg-[linear-gradient(180deg,rgba(13,20,33,0.55),rgba(8,13,24,0.45))] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_42px_rgba(2,6,23,0.16)]">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-semibold tracking-tight text-gray-700 dark:text-[#eef4ff]">Henry AI Chat</h2>
            </div>
            <p className="mt-2.5 text-[13px] leading-relaxed text-[#91a0b5]">一个集多模型对话、模型排行榜与 Token 管理于一体的 AI 工作台，帮助你高效完成从探索到生产落地的全过程。</p>
            <div className="mt-5 flex items-center gap-2.5">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:text-gray-900 dark:border-white/8 dark:text-zinc-400 dark:hover:border-white/15 dark:hover:text-white"
                >
                  <Icon className="h-3.75 w-3.75" />
                </Link>
              ))}
              <Link
                href="mailto:support@henry-ai.example"
                aria-label="Email"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:text-gray-900 dark:border-white/8 dark:text-zinc-400 dark:hover:border-white/15 dark:hover:text-white"
              >
                <Mail className="h-3.75 w-3.75" />
              </Link>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            <FooterLinkColumn
              title="产品"
              links={PRODUCT_LINKS}
            />
            <FooterLinkColumn
              title="资源"
              links={RESOURCE_LINKS}
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/8">
          <p className="text-[12px] text-[#91a0b5]">© 2026 Henry AI Chat. All rights reserved.</p>
          <p className="text-[12px] text-[#91a0b5]">Powered by Henry AI</p>
        </div>
      </div>
    </footer>
  )
}
