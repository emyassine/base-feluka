import { existsSync, realpathSync, statSync } from 'node:fs'
import { extname, relative, resolve, sep } from 'node:path'

const ICON_FAMILIES = ['lucide', 'heroicons', 'simple-icons', 'custom']

function containedFile(root, id, kind) {
  const extension = extname(id) ? '' : '.svg'
  const target = resolve(root, `${id}${extension}`)
  const local = relative(root, target)
  if (local === '..' || local.startsWith(`..${sep}`) || local.split(sep).includes('..')) {
    throw new Error(`${kind} reference escapes its resource registry: ${id}`)
  }
  if (!existsSync(target) || !statSync(target).isFile()) return null
  const canonicalRoot = realpathSync(root)
  const canonicalTarget = realpathSync(target)
  const canonicalRelative = relative(canonicalRoot, canonicalTarget)
  if (canonicalRelative === '..' || canonicalRelative.startsWith(`..${sep}`)) {
    throw new Error(`${kind} resource symlink escapes its registry: ${id}`)
  }
  return canonicalTarget
}

/** Resolve tool-owned icon/flag resources and site-owned media by logical ID. */
export function resolveVitepressResource(reference, layout) {
  if (reference.kind === 'media') {
    const target = containedFile(resolve(layout.siteResourcesDir, 'media'), reference.id, 'media')
    if (target) return target
  } else if (reference.kind === 'flag') {
    const target = containedFile(resolve(layout.targetResourcesDir, 'flags/language'), reference.id, 'flag')
    if (target) return target
  } else if (reference.kind === 'icon') {
    const slash = reference.id.indexOf('/')
    const family = slash > 0 ? reference.id.slice(0, slash) : null
    const name = family ? reference.id.slice(slash + 1) : reference.id
    for (const candidateFamily of family ? [family] : ICON_FAMILIES) {
      if (!ICON_FAMILIES.includes(candidateFamily)) continue
      const target = containedFile(resolve(layout.targetResourcesDir, 'icons', candidateFamily), name, 'icon')
      if (target) return target
    }
  }
  throw new Error(`Unknown SPMPST resource reference: @spmpst::${reference.kind}::${reference.id}`)
}
