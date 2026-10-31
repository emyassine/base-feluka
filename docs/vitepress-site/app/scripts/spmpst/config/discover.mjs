import { readdirSync } from 'node:fs'
import { join } from 'node:path'

function files(directory, predicate) {
  try { return readdirSync(directory, { withFileTypes: true }).filter((entry) => entry.isFile() && predicate(entry.name)).map((entry) => join(directory, entry.name)).sort() }
  catch (error) { if (error.code === 'ENOENT') return []; throw error }
}

export function discoverConfig(layout) {
  const concerns = files(layout.siteDir, (name) => /^spmpst\.[a-z][a-z0-9-]*\.json$/.test(name))
  const publicFiles = files(join(layout.siteDir, 'public'), () => true)
  const targets = files(join(layout.siteDir, 'targets'), (name) => name.endsWith('.target.config.json'))
  return { concerns, publicFiles, targets }
}
