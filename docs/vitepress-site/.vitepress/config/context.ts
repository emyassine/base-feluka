import { join, resolve } from 'node:path'
import type { GuideConfig, SiteConfig } from '../types/site-config'

/** File-loading port. The composition root selects a Node implementation; other
 * adapters can provide memory-backed or generated config for tooling. */
export interface SiteConfigSource {
  readSiteConfig(siteDirectory: string): SiteConfig
  readJson<T>(path: string): T
  readJsonOr<T>(path: string, fallback: T): T
}

export interface SiteRuntimeContext {
  siteDirectory: string
  configDirectory: string
  siteConfig: SiteConfig
  site: SiteConfig
  generatedDirectory: string
  generatedMetadata: string
  sidebarMetadata: Record<string, any>
  sidebarPageIcons: Record<string, string>
  navigationOrder: Record<string, string>
  generatedCollections: any[]
  generatedFonts: { site: Record<string, any>; guides: Record<string, Record<string, any>> }
  generatedGuideColors: Record<string, Record<string, string>>
  generatedOgImages: Record<string, string[]>
  defaultLanguage: string
  sourceDirectory: string
  outputDirectory: string
  guideConfigs: Record<string, { path: string; config: GuideConfig }>
}

/** Load source and prepared metadata using the injected file-source port. */
export function loadSiteRuntimeContext(
  siteDirectory: string,
  source: SiteConfigSource,
  outputOverride = process.env.DOCS_OUTPUT_DIR,
): SiteRuntimeContext {
  const configDirectory = resolve(siteDirectory, '..')
  const siteConfig = source.readSiteConfig(siteDirectory)
  const generatedDirectory = join(siteDirectory, '.generated-guides')
  const generatedMetadata = join(siteDirectory, '.vitepress/generated')
  const sidebarMetadata = source.readJsonOr(join(generatedMetadata, 'sidebar.json'), {})
  const sidebarPageIcons = source.readJsonOr(join(generatedMetadata, 'sidebar-page-icons.json'), {})
  const navigationOrder = source.readJsonOr(join(generatedMetadata, 'navigation-order.json'), {})
  const generatedCollections = source.readJsonOr(join(generatedMetadata, 'collections.json'), [])
  const generatedFonts = source.readJsonOr(join(generatedMetadata, 'fonts.json'), { site: {}, guides: {} })
  const generatedGuideColors = source.readJsonOr(join(generatedMetadata, 'guide-colors.json'), {})
  const generatedOgImages = source.readJsonOr(join(generatedMetadata, 'og-images.json'), {})
  const defaultLanguage = siteConfig.fallbackLanguage ?? siteConfig.languages[0]
  const sourceDirectory = resolve(configDirectory, siteConfig.guidesPath)
  const outputDirectory = outputOverride
    ? resolve(outputOverride)
    : resolve(configDirectory, siteConfig.outputDir)
  const guideConfigs = Object.fromEntries(siteConfig.subguides.map((guide) => {
    const path = resolve(sourceDirectory, guide.path, 'guide.config.json')
    return [guide.path, { path, config: source.readJson<GuideConfig>(path) }]
  }))

  return {
    siteDirectory,
    configDirectory,
    siteConfig,
    site: siteConfig,
    generatedDirectory,
    generatedMetadata,
    sidebarMetadata,
    sidebarPageIcons,
    navigationOrder,
    generatedCollections,
    generatedFonts,
    generatedGuideColors,
    generatedOgImages,
    defaultLanguage,
    sourceDirectory,
    outputDirectory,
    guideConfigs,
  }
}
