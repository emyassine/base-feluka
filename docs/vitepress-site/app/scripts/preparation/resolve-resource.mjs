import { existsSync, statSync } from 'node:fs'
import { extname, relative, resolve, sep } from 'node:path'

export function resolveVitepressResource(reference, layout) {
  const catalogue = resolve(layout.targetResourcesDir, reference.kind === 'icon' ? 'icons' : 'flags')
  const id = reference.kind === 'flag' && !reference.id.includes('/') ? `language/${reference.id}` : reference.id
  const candidates = reference.kind === 'icon' && !id.includes('/')
    ? ['lucide', 'custom', 'heroicons', 'simple-icons'].map((family) => resolve(catalogue, family, extname(id) ? id : `${id}.svg`))
    : [resolve(catalogue, extname(id) ? id : `${id}.svg`)]
  for (const target of candidates) {
    const local = relative(catalogue, target)
    if (!local || local === '..' || local.startsWith(`..${sep}`) || local.split(sep).includes('..')) {
      throw new Error(`Resource reference escapes its ${reference.kind} catalogue: ${reference.id}`)
    }
    if (existsSync(target) && statSync(target).isFile()) return target
  }
  throw new Error(`Unknown SPMPST resource reference: @spmpst::resources::${reference.kind}::${reference.id}`)
}
