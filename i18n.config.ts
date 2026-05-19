import type { I18nConfig } from 'next-i18next/proxy'

const resourceLoader =
  process.env.NODE_ENV === 'development'
    ? async (language: string, namespace: string) => {
        const fs = await import('fs/promises')
        const path = await import('path')
        const content = await fs.readFile(path.resolve(process.cwd(), `i18n/locales/${language}/${namespace}.json`), 'utf-8')
        return JSON.parse(content)
      }
    : (language: string, namespace: string) => import(`./i18n/locales/${language}/${namespace}.json`)

const i18nConfig: I18nConfig = {
  supportedLngs: ['zh', 'en'],
  fallbackLng: 'zh',
  defaultNS: 'common',
  ns: ['common', 'rankings'],
  localeInPath: false,
  resourceLoader,
}

export default i18nConfig
