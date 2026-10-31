import { resolveSitePaths } from '../paths.mjs'

/** Resolve the one canonical path registry for the selected SPMPST site. */
export function resolveLayout(siteDirectory) {
  return {
    paths: resolveSitePaths(siteDirectory),
    siteId: process.env.SPMPST_SITE_ID ?? null,
    version: 'spmpst',
  }
}
