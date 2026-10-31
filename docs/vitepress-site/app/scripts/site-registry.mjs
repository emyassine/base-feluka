import { readFile, realpath, stat } from 'node:fs/promises'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

export const appDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const workspacePath = resolve(appDirectory, '../spmpst.workspace.json')
export const registryPath = resolve(process.env.VITEPRESS_SITE_MANIFEST ?? workspacePath)

const REQUIRED_PATHS = ['root', 'config', 'guides', 'collections', 'resources', 'sharedResources', 'assets', 'components', 'diagrams', 'hooks', 'media', 'schemas', 'public', 'icons', 'flags', 'mermaidConfig', 'toolchain', 'output']
const REQUIRED_CONFIGS = ['appearance', 'collections', 'definitions', 'lang', 'layout', 'links', 'markdown', 'outline', 'search', 'seo', 'topbar']

async function readJson(path, responsibleFile, field) {
  try { return JSON.parse(await readFile(path, 'utf8')) }
  catch (error) {
    if (error.code === 'ENOENT') throw new Error(`File was not found by the conforming tool: ${path}. Restore it there, or update "${field}" in ${responsibleFile}.`)
    throw new Error(`Could not read ${path}: ${error.message}`)
  }
}

async function requireDirectory(path, declarationPath, field) {
  try {
    if (!(await stat(path)).isDirectory()) throw new Error('not a directory')
  } catch {
    throw new Error(`Directory was not found by the conforming tool: ${path}. Restore it there, or update "paths.${field}" in ${declarationPath}.`)
  }
}

async function requireFile(path, declarationPath, field) {
  try {
    if (!(await stat(path)).isFile()) throw new Error('not a file')
  } catch {
    throw new Error(`File was not found by the conforming tool: ${path}. Restore it there, or update "paths.${field}" in ${declarationPath}.`)
  }
}

export async function loadSites() {
  const activeRegistryPath = registryPath
  const registry = await readJson(activeRegistryPath, activeRegistryPath, 'sitesPaths (or set VITEPRESS_SITE_MANIFEST)')
  if (!Array.isArray(registry.sitesPaths) || registry.sitesPaths.length === 0) {
    throw new Error(`${activeRegistryPath}: sitesPaths must be a non-empty array of site declaration paths`)
  }
  const registryDirectory = dirname(activeRegistryPath)
  const declarations = await Promise.all(registry.sitesPaths.map(async (sitePath) => {
    if (typeof sitePath !== 'string' || !sitePath.trim()) throw new Error(`${registryPath}: every sitesPaths entry must be a path`)
    const declarationPath = isAbsolute(sitePath) ? sitePath : resolve(registryDirectory, sitePath)
    const activeDeclarationPath = declarationPath
    const declaration = await readJson(activeDeclarationPath, activeRegistryPath, 'sitesPaths')
    for (const key of ['id', 'name']) {
      if (typeof declaration[key] !== 'string' || !declaration[key].trim()) {
        throw new Error(`${activeDeclarationPath}: ${key} must be a non-empty string`)
      }
    }
    if (!declaration.paths || typeof declaration.paths !== 'object' || Array.isArray(declaration.paths)) {
      throw new Error(`${activeDeclarationPath}: paths must be an object containing the site's complete SpmpstPaths registry`)
    }
    for (const key of REQUIRED_PATHS) {
      if (typeof declaration.paths[key] !== 'string' || !declaration.paths[key].trim()) {
        throw new Error(`${activeDeclarationPath}: paths.${key} must be a non-empty path; add or correct it in ${activeDeclarationPath}`)
      }
    }
    for (const key of Object.keys(declaration.paths)) {
      if (![...REQUIRED_PATHS, 'configFiles'].includes(key)) throw new Error(`${activeDeclarationPath}: unknown paths.${key}; add structural paths to the canonical SpmpstPaths registry only`)
    }
    if (!declaration.paths.configFiles || typeof declaration.paths.configFiles !== 'object' || Array.isArray(declaration.paths.configFiles)) {
      throw new Error(`${activeDeclarationPath}: paths.configFiles must map each concern name to its config file path`)
    }
    for (const concern of REQUIRED_CONFIGS) {
      if (typeof declaration.paths.configFiles[concern] !== 'string' || !declaration.paths.configFiles[concern].trim()) {
        throw new Error(`${activeDeclarationPath}: paths.configFiles.${concern} must name its config file`)
      }
    }
    for (const concern of Object.keys(declaration.paths.configFiles)) {
      if (!REQUIRED_CONFIGS.includes(concern)) throw new Error(`${activeDeclarationPath}: unknown paths.configFiles.${concern}`)
    }
    const base = dirname(activeDeclarationPath)
    const resolvePath = (value) => isAbsolute(value) ? resolve(value) : resolve(base, value)
    const paths = Object.fromEntries(Object.entries(declaration.paths).map(([key, value]) => [key, key === 'configFiles' ? Object.fromEntries(Object.entries(value).map(([name, path]) => [name, resolvePath(path)])) : resolvePath(value)]))
    const sourceRoot = paths.root
    const inTree = ['config', 'guides', 'collections', 'resources', 'assets', 'components', 'diagrams', 'hooks', 'media', 'schemas', 'public', 'mermaidConfig', ...Object.keys(paths.configFiles).map((name) => `configFiles.${name}`)]
    for (const key of inTree) {
      const path = key.startsWith('configFiles.') ? paths.configFiles[key.slice('configFiles.'.length)] : paths[key]
      const local = relative(sourceRoot, path)
      if (local === '..' || local.startsWith(`..${sep}`) || isAbsolute(local)) {
        throw new Error(`paths.${key} must stay inside paths.root. Change paths.${key} in ${activeDeclarationPath}.`)
      }
    }
    for (const key of ['root', 'config', 'guides', 'collections', 'resources', 'assets', 'components', 'diagrams', 'hooks', 'media', 'schemas', 'public', 'sharedResources', 'icons', 'flags', 'toolchain']) {
      await requireDirectory(paths[key], activeDeclarationPath, key)
    }
    await requireFile(paths.mermaidConfig, activeDeclarationPath, 'mermaidConfig')
    for (const [concern, path] of Object.entries(paths.configFiles)) await requireFile(path, activeDeclarationPath, `configFiles.${concern}`)
    const realRoot = await realpath(paths.root)
    for (const key of inTree.filter((name) => name !== 'root')) {
      const actualPath = await realpath(key.startsWith('configFiles.') ? paths.configFiles[key.slice('configFiles.'.length)] : paths[key])
      const actualRelative = relative(realRoot, actualPath)
      if (actualRelative === '..' || actualRelative.startsWith(`..${sep}`) || isAbsolute(actualRelative)) {
        throw new Error(`Resolved paths.${key} escapes paths.root through a symlink: ${actualPath}. Keep it inside ${realRoot}, or update paths.${key} in ${activeDeclarationPath}.`)
      }
    }
    const toolchain = declaration.toolchain
    if (declaration.engine !== 'toolchain' || !toolchain || typeof toolchain !== 'object') {
      throw new Error(`${activeDeclarationPath}: declare engine and toolchain actions from SPMPST B3`)
    }
    const cwd = toolchain.cwd && paths[toolchain.cwd]
    if (!cwd) throw new Error(`${activeDeclarationPath}: toolchain.cwd must name a directory key in paths (for example "toolchain")`)
    await requireDirectory(cwd, activeDeclarationPath, `toolchain.cwd → paths.${toolchain.cwd}`)
    for (const action of ['build']) {
      if (!toolchain[action] || typeof toolchain[action].command !== 'string' || !Array.isArray(toolchain[action].args)) {
        throw new Error(`${activeDeclarationPath}: toolchain.${action} needs command and args`)
      }
    }
    if (!toolchain.dev || typeof toolchain.dev.command !== 'string' || !Array.isArray(toolchain.dev.args)) {
      throw new Error(`${activeDeclarationPath}: toolchain.dev needs command and args`)
    }
    if (toolchain.install && (typeof toolchain.install.command !== 'string' || !Array.isArray(toolchain.install.args) || !['missing', 'always', 'never'].includes(toolchain.install.when))) {
      throw new Error(`${activeDeclarationPath}: toolchain.install needs command, args, and when=missing|always|never`)
    }
    if (toolchain.network && !['none', 'install-only', 'full'].includes(toolchain.network)) {
      throw new Error(`${activeDeclarationPath}: toolchain.network must be none, install-only, or full`)
    }
    return { ...declaration, declarationPath: activeDeclarationPath, paths, sourceRoot, outputRoot: paths.output, toolchainCwd: cwd }
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
  const requested = requestedId ?? process.env.SPMPST_SITE_ID
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
