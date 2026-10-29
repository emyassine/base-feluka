import { access, readdir, readFile } from 'node:fs/promises'
import { join, resolve, dirname } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'

const output = resolve(process.argv[2])
const htmlFiles = []
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) await collect(path)
    else if (entry.name.endsWith('.html')) htmlFiles.push(path)
  }
}
await collect(output)

const missing = []
for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, 'utf8')
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const href = match[1]
    if (/^(?:[a-z]+:|#|\/\/)/i.test(href)) continue
    const url = new URL(href, pathToFileURL(htmlFile))
    if (url.protocol !== 'file:') continue
    // VitePress uses base-relative URLs (for example /assets/app.js). During
    // the static link audit, that base is the generated output directory.
    let target = href.startsWith('/')
      ? join(output, decodeURIComponent(url.pathname.slice(1)))
      : fileURLToPath(url)
    if (url.pathname.endsWith('/')) target = join(target, 'index.html')
    try {
      await access(target)
    } catch {
      missing.push(`${htmlFile}: ${href} -> ${target}`)
    }
  }
}
if (missing.length) {
  process.stderr.write(`Missing local file links (${missing.length}):\n${missing.join('\n')}\n`)
  process.exit(1)
}
process.stdout.write(`Checked ${htmlFiles.length} HTML pages: all local links resolve to files.\n`)
