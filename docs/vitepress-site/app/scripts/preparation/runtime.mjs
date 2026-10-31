import { existsSync, readFileSync } from 'node:fs'
import { isAbsolute, resolve } from 'node:path'
import { resolveResourceReferences } from '../spmpst/resources.mjs'
import { resolveVitepressResource } from './resolve-resource.mjs'

export function toVitepressRuntime(sourceModel, target, layout) {
  const model = resolveResourceReferences(sourceModel, (reference) => resolveVitepressResource(reference, layout, sourceModel))
  const defaultLanguage = model.fallbackLanguage ?? model.languages[0]
  const locales = model.locales
  const seo = Object.fromEntries(model.languages.map((language) => [language, { icon: model.icon, ...locales[language].seo }]))
  const searchLabels = { root: locales[defaultLanguage].search }
  for (const language of model.languages) if (language !== defaultLanguage) searchLabels[language] = locales[language].search
  const publicFiles = Object.fromEntries(Object.entries(model.publicFiles).map(([name, text]) => [name, text.replace(/\n$/, '')]))
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
    fonts: model.fonts,
    logo: model.logo,
    ogImages: model.ogImages,
    mermaid: model.mermaid,
    socialLinks,
    languageLabels: Object.fromEntries(model.languages.map((language) => [language, locales[language].language.label])),
    languageMenuLabels: Object.fromEntries(model.languages.map((language) => [language, locales[language].language.menuLabel])),
    fallbackNotices: Object.fromEntries(model.languages.map((language) => [language, locales[language].language.fallbackNotice])),
    search: { ...target.search, labels: searchLabels },
    outline: { labels: Object.fromEntries(model.languages.map((language) => [language, locales[language].outline.label])), ...target.outline },
    footer: Object.fromEntries(model.languages.map((language) => [language, locales[language].footer])),
    documentationNotices: Object.fromEntries(model.languages.map((language) => [language, locales[language].notices])),
    seo: { siteUrl: model.siteUrl, path: model.path, locales: seo },
    publicFiles,
    resources: { icons: model.icons, flags: model.flags },
    uiStrings: Object.fromEntries(model.languages.map((language) => [language, locales[language].ui])),
    styles: (target.styles ?? []).map((path) => resolve(layout.siteResourcesDir, path)),
    theme: target.theme,
    markdown: target.markdown,
    outputDir: target.outputDir,
    project: {
      ...target.project,
      iconLibrary: layout.iconsDir,
      components: resolve(layout.siteResourcesDir, target.project?.components ?? 'components'),
      hooks: resolve(layout.siteResourcesDir, target.project?.hooks ?? 'hooks'),
      iconFallback: model.iconFallback,
      mermaidConfig: layout.mermaidConfigPath,
    },
  }
}
