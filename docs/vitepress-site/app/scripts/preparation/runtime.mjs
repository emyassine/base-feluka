import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute, resolve } from 'node:path'
import { resolveResourceReferences } from '../spmpst/resources.mjs'
import { resolveVitepressResource } from './resolve-resource.mjs'

export function toVitepressRuntime(sourceModel, layout) {
  const model = resolveResourceReferences(sourceModel, (reference) => resolveVitepressResource(reference, layout))
  const defaultLanguage = model.fallbackLanguage ?? model.languages[0]
  const footer = model.footer ?? {}
  const localizedFooterText = (value, language) => {
    if (typeof value === 'string') return value
    if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
    return value[language] ?? value[defaultLanguage] ?? Object.values(value).find((entry) => typeof entry === 'string')
  }
  const localizeTree = (value, language) => {
    if (Array.isArray(value)) return value.map((item) => localizeTree(item, language))
    if (!value || typeof value !== 'object') return value
    const entries = Object.entries(value)
    if (entries.length && entries.every(([key, entry]) => model.languages.includes(key) && typeof entry === 'string')) {
      return value[language] ?? value[defaultLanguage] ?? entries[0][1]
    }
    return Object.fromEntries(entries.map(([key, entry]) => [key, localizeTree(entry, language)]))
  }
  const locales = Object.fromEntries(model.languages.map((language) => [language, localizeTree(model.strings ?? {}, language)]))
  const seoCopy = Object.fromEntries(['pageTitle', 'pageNavTitle', 'description', 'quickLinksTitle', 'faqTitle', 'quickLinks', 'faq']
    .filter((key) => model[key] !== undefined)
    .map((key) => [key, model[key]]))
  const seo = Object.fromEntries(model.languages.map((language) => [language, { icon: model.icon, ...localizeTree(seoCopy, language) }]))
  const searchLabels = { root: locales[defaultLanguage].search }
  for (const language of model.languages) if (language !== defaultLanguage) searchLabels[language] = locales[language].search
  const publicFiles = Object.fromEntries(Object.entries(model.publicFiles).map(([name, text]) => [name, text.replace(/\n$/, '')]))
  const layoutComponentSlots = {
    ...(model.components?.sidebarNavigationBefore ? { 'sidebar-nav-before': model.components.sidebarNavigationBefore } : {}),
    ...(model.components?.navigationAfter ? { 'nav-bar-content-after': model.components.navigationAfter } : {}),
  }
  const socialLinks = (model.socialLinks ?? []).map((item) => ({
    ...item,
    icon: typeof item.icon === 'string' && isAbsolute(item.icon) && existsSync(item.icon)
      ? { svg: readFileSync(item.icon, 'utf8') }
      : item.icon,
  }))
  return {
    site: model.site,
    guidesPath: 'src/guides',
    indexPath: `src/guides/index.${defaultLanguage}.md`,
    subguides: model.subguides,
    languages: model.languages,
    fallbackLanguage: model.fallbackLanguage,
    topbar: { items: model.items, language: model.selector, theme: model.theme },
    collections: (model.collections ?? []).map(({ dir, ...collection }) => ({ ...collection, path: dir ?? collection.id })),
    siteFooter: footer.component,
    fonts: model.fonts,
    logo: model.logo,
    ogImages: model.ogImages,
    mermaid: model.mermaid,
    socialLinks,
    languageLabels: Object.fromEntries(model.languages.map((language) => [language, locales[language].language.label])),
    languageMenuLabels: Object.fromEntries(model.languages.map((language) => [language, locales[language].language.menuLabel])),
    fallbackNotices: Object.fromEntries(model.languages.map((language) => [language, locales[language].language.fallbackNotice])),
    search: { ...model.search, labels: searchLabels },
    outline: { labels: Object.fromEntries(model.languages.map((language) => [language, locales[language].outline.label])), ...model.outline },
    footer: Object.fromEntries(model.languages.map((language) => [language, Object.fromEntries(
      ['message', 'copyright']
        .map((key) => [key, localizedFooterText(footer[key], language)])
        .filter(([, value]) => value !== undefined),
    )])),
    documentationNotices: Object.fromEntries(model.languages.map((language) => [language, locales[language].notices])),
    seo: { siteUrl: model.siteUrl, path: model.path, locales: seo },
    publicFiles,
    uiStrings: Object.fromEntries(model.languages.map((language) => [language, locales[language].ui])),
    styles: (model.styles ?? []).map((path) => resolve(layout.siteResourcesDir, path)),
    theme: { slots: layoutComponentSlots },
    markdown: model.markdown,
    outputDir: layout.outputDirectory,
    project: {
      ...model.project,
      iconLibrary: layout.iconsDir,
      components: resolve(layout.siteResourcesDir, model.project?.components ?? 'components'),
      hooks: resolve(layout.siteResourcesDir, model.project?.hooks ?? 'hooks'),
      iconFallback: model.iconFallback,
      mermaidConfig: layout.mermaidConfigPath,
    },
  }
}
