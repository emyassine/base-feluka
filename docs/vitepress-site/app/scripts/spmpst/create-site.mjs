import { cp, mkdir, readFile, readdir, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, isAbsolute, relative, resolve, sep } from 'node:path'
import { appDirectory, loadSites, registryPath } from '../site-registry.mjs'

const specificationDirectory = resolve(appDirectory, '../../.specifications/spmpst')
const sitesDirectory = resolve(appDirectory, '../..')
const hostDirectory = dirname(appDirectory)

function siteSlug(value) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function lookup(context, name) {
  return name.split('.').reduce((value, key) => value?.[key], context)
}

function substitute(value, context) {
  if (typeof value === 'string') {
    return value.replace(/\{([A-Za-z][A-Za-z0-9.]*)\}/g, (token, name) => {
      const replacement = lookup(context, name)
      return replacement === undefined || replacement === null ? token : String(replacement)
    })
  }
  if (Array.isArray(value)) return value.map((item) => substitute(item, context))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, substitute(item, context)]))
  }
  return value
}

function assertInside(root, path, label) {
  const target = resolve(root, path)
  const local = relative(root, target)
  if (local === '..' || local.startsWith(`..${sep}`) || isAbsolute(local)) {
    throw new Error(`Scaffold path for ${label} escapes the new site root: ${path}`)
  }
  return target
}

async function atomicJson(path, value) {
  const temporary = `${path}.${process.pid}.tmp`
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  await rename(temporary, path)
}

export async function createSite(inputName) {
  if (typeof inputName !== 'string' || !inputName.trim()) {
    throw new Error('Usage: serve.sh new <sitename>')
  }
  const slug = siteSlug(inputName.trim())
  if (!slug) throw new Error(`Site name does not produce a valid site id: ${inputName}`)
  const name = inputName.trim().replace(/\s+/g, ' ')
  const targetRoot = resolve(sitesDirectory, slug)
  const temporaryRoot = resolve(sitesDirectory, `.${slug}.creating-${process.pid}`)
  const schema = JSON.parse(await readFile(resolve(specificationDirectory, 'spmpst.schema.json'), 'utf8'))
  const scaffold = schema['x-spmpst-scaffold']
  if (!schema.default || !scaffold || !Array.isArray(scaffold.directories) || !Array.isArray(scaffold.files)) {
    throw new Error(`${resolve(specificationDirectory, 'spmpst.schema.json')}: default and x-spmpst-scaffold declarations are required`)
  }

  const workspace = JSON.parse(await readFile(registryPath, 'utf8'))
  if (!Array.isArray(workspace.sitesPaths)) throw new Error(`${registryPath}: sitesPaths must be an array`)
  const existing = await loadSites()
  if (existing.some(({ id }) => id === slug)) throw new Error(`A site with id "${slug}" is already registered.`)
  try { await readFile(targetRoot); throw new Error(`Site directory already exists: ${targetRoot}`) }
  catch (error) { if (error.code !== 'ENOENT') throw error }

  const publicOutput = resolve(sitesDirectory, '../docs-output', slug)
  const relativePath = (from, to) => relative(from, to).split(sep).join('/') || '.'
  const hostRelative = relativePath(targetRoot, hostDirectory)
  const sharedResources = resolve(hostDirectory, 'resources')
  const scaffoldValues = scaffold.values ?? {}
  const context = {
    siteId: slug,
    siteSlug: slug,
    siteName: name,
    siteRoot: '.',
    guidePath: scaffoldValues.guidePath ?? 'guides',
    language: scaffoldValues.language ?? 'en',
    sharedResourcesPath: relativePath(targetRoot, sharedResources),
    iconsPath: relativePath(targetRoot, resolve(sharedResources, 'icons')),
    flagsPath: relativePath(targetRoot, resolve(sharedResources, 'flags')),
    toolchainPath: hostRelative,
    outputPath: relativePath(targetRoot, publicOutput),
  }

  const manifest = substitute(schema.default, context)
  const filesToWrite = []
  await rm(temporaryRoot, { recursive: true, force: true })
  try {
    await mkdir(temporaryRoot, { recursive: true })
    const directoryContext = { ...context, paths: manifest.paths }
    for (const directoryTemplate of scaffold.directories) {
      const path = substitute(directoryTemplate, directoryContext)
      await mkdir(assertInside(temporaryRoot, path, 'directory'), { recursive: true })
    }

    const schemaPattern = scaffold.concernSchemaPattern
    const filenamePattern = scaffold.concernFilenamePattern
    if (typeof schemaPattern !== 'string' || typeof filenamePattern !== 'string') {
      throw new Error('x-spmpst-scaffold must declare concernSchemaPattern and concernFilenamePattern')
    }
    for (const [concern, relativeConfigPath] of Object.entries(manifest.paths.configFiles)) {
      const schemaPath = resolve(specificationDirectory, substitute(schemaPattern, { ...context, concern }))
      let concernSchema
      try { concernSchema = JSON.parse(await readFile(schemaPath, 'utf8')) }
      catch (error) { throw new Error(`Cannot load scaffold schema for ${concern} from ${schemaPath}: ${error.message}`) }
      if (!Object.hasOwn(concernSchema, 'default')) throw new Error(`${schemaPath}: add a root default for site generation`)
      const configPath = assertInside(temporaryRoot, relativeConfigPath, `paths.configFiles.${concern}`)
      const schemaFile = substitute(filenamePattern, { ...context, concern })
      const configContext = {
        ...directoryContext,
        concern,
        schemaName: schemaFile,
        schemaRef: relativePath(dirname(resolve(targetRoot, relativeConfigPath)), resolve(targetRoot, manifest.paths.schemas, `${concern}.schema.json`)),
      }
      filesToWrite.push([configPath, substitute(concernSchema.default, configContext)])
    }

    for (const file of scaffold.files) {
      if (!file || typeof file.path !== 'string' || !Object.hasOwn(file, 'content')) {
        throw new Error('Every x-spmpst-scaffold.files entry needs path and content')
      }
      const path = substitute(file.path, directoryContext)
      filesToWrite.push([assertInside(temporaryRoot, path, 'file'), substitute(file.content, directoryContext)])
    }

    const schemaCopy = scaffold.schemaCopy
    if (!schemaCopy || typeof schemaCopy.source !== 'string' || typeof schemaCopy.destination !== 'string' || typeof schemaCopy.pattern !== 'string') {
      throw new Error('x-spmpst-scaffold.schemaCopy must declare source, destination, and pattern')
    }
    const sourceDirectory = resolve(specificationDirectory, schemaCopy.source)
    const destinationDirectory = assertInside(temporaryRoot, substitute(schemaCopy.destination, directoryContext), 'schema copy')
    await mkdir(destinationDirectory, { recursive: true })
    const suffix = schemaCopy.pattern.startsWith('*') ? schemaCopy.pattern.slice(1) : null
    if (!suffix) throw new Error(`Unsupported scaffold schema pattern: ${schemaCopy.pattern}`)
    for (const entry of await readdir(sourceDirectory, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith(suffix)) {
        await cp(resolve(sourceDirectory, entry.name), resolve(destinationDirectory, entry.name))
      }
    }

    for (const [path, value] of filesToWrite) {
      await mkdir(dirname(path), { recursive: true })
      const content = typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`
      await writeFile(path, content, { flag: 'wx' })
    }

    await writeFile(resolve(temporaryRoot, 'spmpst.json'), `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' })
    await rename(temporaryRoot, targetRoot)

    const declaration = relativePath(dirname(registryPath), resolve(targetRoot, 'spmpst.json'))
    const nextWorkspace = { ...workspace, sitesPaths: [...workspace.sitesPaths, declaration] }
    await atomicJson(registryPath, nextWorkspace)
    try {
      await loadSites()
    } catch (error) {
      await atomicJson(registryPath, workspace)
      throw error
    }
    process.stdout.write(`[spmpst] Created site "${name}" (${slug}) at ${targetRoot}\n`)
    return { id: slug, name, root: targetRoot, declarationPath: resolve(targetRoot, 'spmpst.json') }
  } catch (error) {
    await rm(temporaryRoot, { recursive: true, force: true })
    try { await readFile(resolve(targetRoot, 'spmpst.json')); await rm(targetRoot, { recursive: true, force: true }) }
    catch (cleanupError) { if (cleanupError.code !== 'ENOENT') throw cleanupError }
    throw error
  }
}
