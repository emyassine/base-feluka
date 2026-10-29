import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve, sep } from 'node:path'

const output = resolve(process.argv[2])
const pages = []
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) await collect(path)
    else if (entry.name.endsWith('.html')) pages.push(path)
  }
}
await collect(output)
for (const page of pages) {
  const pageDirectory = relative(output, dirname(page))
  const html = await readFile(page, 'utf8')
  const relativeHtml = html.replace(/\b(href|src)="(\/[^"]*)"/g, (all, attr, url) => {
    const [pathname, ...suffix] = url.slice(1).split(/(?=[?#])/)
    let target = relative(pageDirectory || '.', pathname).split(sep).join('/')
    if (!target.startsWith('.')) target = `./${target}`
    return `${attr}="${target}${suffix.join('')}"`
  })
  await writeFile(page, relativeHtml)
}
