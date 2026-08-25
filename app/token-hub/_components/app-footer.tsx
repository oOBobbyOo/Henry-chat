import Link from 'next/link'

import { getT } from 'next-i18next/server'

import { BrandLogo } from '@/components/brand-logo'

/** Token Hub 门户页脚 —— 品牌 + 链接分组 + 版权/免责声明 */
export async function AppFooter() {
  const { t } = await getT('token-hub')

  const groups = [
    {
      title: t('Product'),
      links: [
        { href: '/plaza', label: t('Model Marketplace') },
        { href: '/pricing', label: t('Pricing') },
        { href: '/playground', label: t('Playground') },
      ],
    },
    {
      title: t('Solutions'),
      links: [
        { href: '/solutions/api-relay', label: t('API Relay') },
        { href: '/solutions/mcp', label: t('MCP Protocol') },
        { href: '/solutions/enterprise', label: t('Enterprise') },
      ],
    },
    {
      title: t('Developers'),
      links: [
        { href: '/docs', label: t('API Documentation') },
        { href: '/gpu-rental', label: t('GPU Rental') },
        { href: '/partners', label: t('Partners') },
      ],
    },
    {
      title: t('Company'),
      links: [
        { href: '/about', label: t('About Us') },
        { href: '/contact', label: t('Contact Us') },
        { href: '/privacy', label: t('Privacy Policy') },
        { href: '/terms', label: t('Terms of Service') },
      ],
    },
  ]

  return (
    <footer className="border-t border-[#dce5f6] bg-[#eef3ff]">
      <div className="mx-auto max-w-330 px-5 py-14 sm:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          {/* 品牌区 */}
          <div className="col-span-2">
            <BrandLogo />
            <p className="mt-5 max-w-65 text-sm leading-relaxed text-[#8a9bc0]">{t('Footer Description')}</p>
          </div>

          {/* 链接分组 */}
          {groups.map((group) => (
            <nav
              key={group.title}
              aria-label={group.title}
              className="text-sm"
            >
              <h3 className="font-semibold text-[#1c2c4d]">{group.title}</h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-md text-[#8a9bc0] transition-colors hover:text-[#294fd4] focus-visible:ring-2 focus-visible:ring-[#4269ee]/35 focus-visible:outline-none"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* 版权与免责声明 */}
        <div className="mt-12 flex flex-col gap-3 border-t border-[#dce5f6] pt-6 text-xs leading-relaxed text-[#afbddb] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Token Hub. {t('Copyright')}
          </p>
          <p className="max-w-2xl sm:text-right">{t('Disclaimer')}</p>
        </div>
      </div>
    </footer>
  )
}
