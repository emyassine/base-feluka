import { readFile, readdir, stat } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { loadSiteModelSync } from '../spmpst/config/index.mjs'
import { resolveLayout } from '../spmpst/layout.mjs'

const siteDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const strictI18n = process.argv.includes('--strict-i18n')
const layout = resolveLayout(siteDirectory)
const errors = []
let warnings = []
try {
  const loaded = loadSiteModelSync(layout, { strictI18n })
  warnings = loaded.warnings
  async function visit(directory, collection = false) {
    const entries = await readdir(directory, { withFileTypes: true })
    const visible = entries.filter((entry) => !entry.name.startsWith('.') && entry.name !== 'README.md')
    const markdown = visible.filter((entry) => entry.isFile() && extname(entry.name).toLowerCase() === '.md')
    const hasNonIndexPage = markdown.some((entry) => !/^(?:\d+[-.])?index(?:\.[a-z]{2,3}(?:-[A-Z]{2})?)?\.md$/i.test(entry.name))
    if (hasNonIndexPage && !collection) {
      try { await stat(join(directory, 'spmpst.sidebar.json')) }
      catch { errors.push(`${relative(layout.treeRoot, directory)}: missing spmpst.sidebar.json`) }
    }
    for (const entry of visible) {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) await visit(path, collection)
      else if (entry.isFile() && extname(entry.name).toLowerCase() === '.md') {
        const content = await readFile(path, 'utf8')
        const frontmatter = content.match(/^---\s*\n([\s\S]*?)\n---/)
        if (!frontmatter) { errors.push(`${relative(layout.treeRoot, path)}: missing frontmatter`); continue }
        for (const key of ['icon', 'sidebarTitle']) if (!new RegExp(`^${key}:\\s*.+$`, 'm').test(frontmatter[1])) errors.push(`${relative(layout.treeRoot, path)}: missing ${key}`)
      }
    }
  }
  await visit(layout.guidesDir)
  await visit(layout.collectionsDir, true)
} catch (error) {
  if (error instanceof AggregateError) errors.push(...error.errors.map((item) => item.message))
  else errors.push(error.message)
}
for (const warning of warnings) process.stderr.write(`warning: ${warning}\n`)
for (const error of errors) process.stderr.write(`error: ${error}\n`)
if (errors.length) process.exitCode = 1
else process.stdout.write(`Documentation check passed${strictI18n ? ' (strict i18n)' : ''}.\n`)
