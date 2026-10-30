import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadSiteModelSync } from '../spmpst/config/index.mjs'
import { resolveLayout } from '../spmpst/layout.mjs'
import { toVitepressRuntime } from '../preparation/runtime.mjs'

const site = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const baselinePath = join(site, '../.trash/refactor/baseline-config.json')
function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys)
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sortKeys(value[key])]))
  return value
}
const mode = process.argv[2]
if (!['record', 'compare'].includes(mode)) throw new Error('Usage: node scripts/dev/verify-config.mjs record|compare')
if (mode === 'record') {
  const layout = resolveLayout(site)
  const { model, targets } = loadSiteModelSync(layout)
  const canonical = `${JSON.stringify(sortKeys(toVitepressRuntime(model, targets.vitepress, layout)), null, 2)}\n`
  await writeFile(baselinePath, canonical)
  process.stdout.write(`Recorded canonical renderer config at ${baselinePath}\n`)
} else {
  const previous = await readFile(baselinePath, 'utf8')
  const layout = resolveLayout(site)
  const { model, targets } = loadSiteModelSync(layout)
  const currentRuntime = toVitepressRuntime(model, targets.vitepress, layout)
  const expected = structuredClone(JSON.parse(previous))
  const actual = structuredClone(currentRuntime)
  const allowedPaths = JSON.parse(await readFile(join(site, '../.trash/refactor/allowed-config-diffs.json'), 'utf8').catch(() => '["/uiStrings"]'))
  const removePointer = (root, pointer) => {
    const parts = pointer.split('/').slice(1).map((part) => part.replace(/~1/g, '/').replace(/~0/g, '~'))
    const key = parts.pop()
    let target = root
    for (const part of parts) target = target?.[Array.isArray(target) ? Number(part) : part]
    if (target && key !== undefined) delete target[Array.isArray(target) ? Number(key) : key]
  }
  for (const pointer of allowedPaths) { removePointer(actual, pointer); removePointer(expected, pointer) }
  if (JSON.stringify(sortKeys(actual)) !== JSON.stringify(sortKeys(expected))) {
    process.stderr.write(`The new site model produces a different renderer configuration from the recorded baseline. Allowed path diffs: ${allowedPaths.join(', ')}\n`)
    process.exitCode = 1
  } else process.stdout.write('The site model produces the recorded renderer configuration.\n')
}
