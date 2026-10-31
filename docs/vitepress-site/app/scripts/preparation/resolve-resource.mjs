import { existsSync, realpathSync, statSync } from 'node:fs'
import { extname, relative, resolve, sep } from 'node:path'

function sourceEntries(reference, config) {
  const entries = config?.[reference.kind === 'icon' ? 'icons' : 'flags']?.sources ?? []
  if (!Array.isArray(entries)) {
    throw new Error(`The site resource config must define ${reference.kind}.sources as an ordered array`)
  }
  const slash = reference.id.indexOf('/')
  if (slash > 0) {
    if (reference.kind !== 'icon') throw new Error('Flag references use a country/language code without a site prefix')
    const owner = reference.id.slice(0, slash)
    const name = reference.id.slice(slash + 1)
    const siteSources = config?.icons?.sites?.[owner]
    if (!Array.isArray(siteSources) || !siteSources.length) throw new Error(`Unknown icon source site id "${owner}"`)
    return siteSources.map((uri) => [owner, uri, name])
  }
  return entries.map(({ id = 'shared', uri }) => [id, uri, reference.id])
}

export function resolveVitepressResource(reference, layout, config = {}) {
  const extension = extname(reference.id) ? '' : '.svg'
  const sources = sourceEntries(reference, config)
  for (const [owner, source, name] of sources) {
    if (typeof source !== 'string' || !source.trim()) throw new Error(`Invalid ${reference.kind} source "${owner}" in .site/spmpst.resources.json`)
    if (/^https?:\/\//i.test(source)) {
      throw new Error(`Remote ${reference.kind} source "${owner}" must be downloaded or vendored before this VitePress adapter can build it`)
    }
    const sourceRoot = resolve(layout.treeRoot, source)
    const target = resolve(sourceRoot, `${name}${extension}`)
    const local = relative(sourceRoot, target)
    if (!local || local === '..' || local.startsWith(`..${sep}`) || local.split(sep).includes('..')) {
      throw new Error(`${reference.kind} reference escapes configured source "${owner}": ${reference.id}`)
    }
    if (!existsSync(target) || !statSync(target).isFile()) continue
    const canonicalRoot = realpathSync(sourceRoot)
    const canonicalTarget = realpathSync(target)
    const canonicalRelative = relative(canonicalRoot, canonicalTarget)
    if (canonicalRelative === '..' || canonicalRelative.startsWith(`..${sep}`)) {
      throw new Error(`${reference.kind} source symlink escapes configured source "${owner}": ${reference.id}`)
    }
    return canonicalTarget
  }
  throw new Error(`Unknown SPMPST resource reference: @spmpst::${reference.kind}::${reference.id}`)
}
