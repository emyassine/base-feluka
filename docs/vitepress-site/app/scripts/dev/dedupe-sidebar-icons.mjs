import { copyFile, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveLayout } from '../spmpst/layout.mjs'

const siteDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const layout = resolveLayout(siteDirectory)
const customDirectory = join(layout.paths.icons, 'custom')
await import('node:fs/promises').then(({ mkdir }) => mkdir(customDirectory, { recursive: true }))
const registered = new Map()
let replaced = 0
let kept = 0

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) { await visit(path); continue }
    if (entry.name !== 'spmpst.sidebar.json') continue
    const config = JSON.parse(await readFile(path, 'utf8'))
    if (typeof config.icon !== 'string' || !config.icon.toLowerCase().endsWith('.svg')) { kept += 1; continue }
    const source = resolve(directory, config.icon)
    const bytes = await readFile(source)
    const hash = createHash('sha256').update(bytes).digest('hex')
    const filename = `sidebar-${hash.slice(0, 16)}.svg`
    const target = join(customDirectory, filename)
    if (!registered.has(hash)) {
      try { await readFile(target) }
      catch { await copyFile(source, target) }
      registered.set(hash, `custom/${filename.slice(0, -4)}`)
    }
    config.icon = registered.get(hash)
    await writeFile(path, `${JSON.stringify(config, null, 2)}\n`)
    await rm(source)
    replaced += 1
  }
}

await visit(layout.paths.guides)
process.stdout.write(`Sidebar icons: ${replaced} paths replaced by ${registered.size} shared named icons; ${kept} entries kept.\n`)
