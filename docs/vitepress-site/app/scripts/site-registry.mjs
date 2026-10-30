import { readFile } from 'node:fs/promises'
import { dirname, isAbsolute, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

export const appDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const registryPath = resolve(process.env.VITEPRESS_SITE_MANIFEST ?? resolve(appDirectory, '../vitepress-site.json'))

export async function loadSites() {
  const registry = JSON.parse(await readFile(registryPath, 'utf8'))
  if (!Array.isArray(registry.sitesPaths) || registry.sitesPaths.length === 0) {
    throw new Error(`${registryPath}: sitesPaths must be a non-empty array of site declaration paths`)
  }
  const registryDirectory = dirname(registryPath)
  const declarations = await Promise.all(registry.sitesPaths.map(async (sitePath) => {
    if (typeof sitePath !== 'string' || !sitePath.trim()) throw new Error(`${registryPath}: every sitesPaths entry must be a path`)
    const declarationPath = isAbsolute(sitePath) ? sitePath : resolve(registryDirectory, sitePath)
    const declaration = JSON.parse(await readFile(declarationPath, 'utf8'))
    for (const key of ['id', 'name', 'sourcePath', 'outputPath']) {
      if (typeof declaration[key] !== 'string' || !declaration[key].trim()) {
        throw new Error(`${declarationPath}: ${key} must be a non-empty string`)
      }
    }
    for (const key of ['resourcesPath', 'siteResourcesPath']) {
      if (declaration[key] != null && (typeof declaration[key] !== 'string' || !declaration[key].trim())) {
        throw new Error(`${declarationPath}: ${key} must be a non-empty path when provided`)
      }
    }
    const base = dirname(declarationPath)
    return {
      ...declaration,
      declarationPath,
      sourceRoot: isAbsolute(declaration.sourcePath) ? declaration.sourcePath : resolve(base, declaration.sourcePath),
      resourcesRoot: declaration.resourcesPath
        ? (isAbsolute(declaration.resourcesPath) ? declaration.resourcesPath : resolve(base, declaration.resourcesPath))
        : resolve(dirname(registryPath), 'resources'),
      siteResourcesRoot: declaration.siteResourcesPath
        ? (isAbsolute(declaration.siteResourcesPath) ? declaration.siteResourcesPath : resolve(base, declaration.siteResourcesPath))
        : resolve(base, 'resources'),
      outputRoot: isAbsolute(declaration.outputPath) ? declaration.outputPath : resolve(base, declaration.outputPath),
    }
  }))
  const ids = new Set()
  for (const declaration of declarations) {
    if (ids.has(declaration.id)) throw new Error(`${registryPath}: duplicate site id "${declaration.id}"`)
    ids.add(declaration.id)
  }
  return declarations
}

export async function selectSite(requestedId) {
  const sites = await loadSites()
  const requested = requestedId ?? process.env.VITEPRESS_SITE_ID
  if (requested) {
    const site = sites.find(({ id, name }, index) => id === requested || name === requested || String(index + 1) === requested)
    if (!site) throw new Error(`Unknown site "${requested}". Available sites: ${sites.map(({ id }) => id).join(', ')}`)
    return site
  }
  if (sites.length === 1) return sites[0]
  if (!stdin.isTTY || !stdout.isTTY) {
    throw new Error(`Choose a site with --site <id>. Available sites: ${sites.map(({ id }) => id).join(', ')}`)
  }
  stdout.write('Available sites:\n')
  sites.forEach((site, index) => stdout.write(`  ${index + 1}) ${site.name} [${site.id}]\n`))
  const terminal = createInterface({ input: stdin, output: stdout })
  try {
    const answer = await terminal.question('Build or serve which site? ')
    const site = sites.find(({ id }, index) => id === answer || String(index + 1) === answer)
    if (!site) throw new Error(`Invalid site selection: ${answer}`)
    return site
  } finally {
    terminal.close()
  }
}
