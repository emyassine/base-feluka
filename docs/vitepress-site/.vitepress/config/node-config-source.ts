import { existsSync, readFileSync } from 'node:fs'
import type { SiteConfigSource } from './context'

/** Node filesystem adapter for the site configuration source port. */
export const nodeConfigSource: SiteConfigSource = {
  readJson<T>(path: string): T {
    return JSON.parse(readFileSync(path, 'utf8')) as T
  },
  readJsonOr<T>(path: string, fallback: T): T {
    return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) as T : fallback
  },
}
