import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

export async function copyIfChanged(source, target) {
  const content = await readFile(source)
  let current
  try { current = await readFile(target) }
  catch (error) { if (error.code !== 'ENOENT') throw error }
  if (current?.equals(content)) return false
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content)
  return true
}

export async function writeIfChanged(target, content) {
  const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content)
  let current
  try { current = await readFile(target) }
  catch (error) { if (error.code !== 'ENOENT') throw error }
  if (current?.equals(buffer)) return false
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, buffer)
  return true
}

const frontmatterPattern = /^---\s*\n([\s\S]*?)\n---/
const pagerLinePattern = /^(?:prev|next):(?:\s|$)/

/** Split frontmatter lines into ordinary lines and the pager block. */
function splitPager(frontmatter) {
  const lines = frontmatter.split('\n')
  const kept = []
  const pager = []
  for (let index = 0; index < lines.length; index += 1) {
    if (!pagerLinePattern.test(lines[index])) {
      kept.push(lines[index])
      continue
    }
    pager.push(lines[index])
    while (index + 1 < lines.length && /^\s+/.test(lines[index + 1])) {
      index += 1
      pager.push(lines[index])
    }
  }
  return { kept, pager }
}

/**
 * Write a generated Markdown page only when its authored content changed.
 *
 * The pager stage runs last and owns the `prev`/`next` frontmatter keys. An
 * earlier stage that rewrites the page must therefore keep the existing pager
 * block; otherwise every preparation would strip and restore it, touching the
 * file (and triggering a browser reload) even when nothing changed.
 */
export async function writeStagedMarkdownIfChanged(target, content) {
  let current
  try { current = await readFile(target, 'utf8') }
  catch (error) { if (error.code !== 'ENOENT') throw error }
  if (current !== undefined) {
    const currentFrontmatter = current.match(frontmatterPattern)
    const nextFrontmatter = content.match(frontmatterPattern)
    if (currentFrontmatter && nextFrontmatter) {
      const { pager } = splitPager(currentFrontmatter[1])
      if (pager.length) {
        const { kept } = splitPager(nextFrontmatter[1])
        const merged = `---\n${[...kept, ...pager].join('\n')}\n---`
        content = merged + content.slice(nextFrontmatter.index + nextFrontmatter[0].length)
      }
    }
    if (current === content) return false
  }
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content)
  return true
}
