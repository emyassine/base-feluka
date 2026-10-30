import { assembleConfig } from './assemble.mjs'
import { discoverConfig } from './discover.mjs'

export function loadSiteModelSync(layout, options = {}) {
  return assembleConfig(layout, discoverConfig(layout), options)
}
