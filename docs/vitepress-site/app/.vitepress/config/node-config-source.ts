import { existsSync, readFileSync } from 'node:fs'
import { loadSiteModelSync } from '../../scripts/spmpst/config/index.mjs'
import { resolveLayout } from '../../scripts/spmpst/layout.mjs'
import { toVitepressRuntime } from '../../scripts/preparation/runtime.mjs'
import type { SiteConfigSource } from './context'
import type { SiteConfig } from '../types/site-config'

/** Node filesystem adapter for the site configuration source port. */
export const nodeConfigSource: SiteConfigSource = {
  readSiteConfig(siteDirectory: string): SiteConfig {
    const layout = resolveLayout(siteDirectory)
    const loaded = loadSiteModelSync(layout)
    return toVitepressRuntime(loaded.model, layout) as SiteConfig
  },
  readJson<T>(path: string): T {
    return JSON.parse(readFileSync(path, 'utf8')) as T
  },
  readJsonOr<T>(path: string, fallback: T): T {
    return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) as T : fallback
  },
}
