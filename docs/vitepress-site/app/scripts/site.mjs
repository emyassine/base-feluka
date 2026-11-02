import { spawn, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { copyFile, mkdir, readFile, readdir, rename, rm, stat, symlink, writeFile } from 'node:fs/promises'
import { basename, dirname, join, relative, resolve, sep } from 'node:path'
import { selectSite, appDirectory } from './site-registry.mjs'
import { createSite } from './spmpst/create-site.mjs'

const [command, ...args] = process.argv.slice(2)
if (command === 'new-site') {
  await createSite(args[0])
  process.exit(0)
}
const option = (name) => args.includes(name) ? args[args.indexOf(name) + 1] : undefined
const forwardedArgs = () => args.filter((argument, index) => argument !== '--site' && args[index - 1] !== '--site')
const site = await selectSite(option('--site'))
const trashDirectory = resolve(process.env.SPMPST_CACHE_DIR ?? resolve(appDirectory, '../.trash', site.id))
const devProjectRoot = resolve(trashDirectory, 'vitepress-project')
const localVitepress = resolve(appDirectory, 'node_modules/.bin/vitepress')
const hostVitepress = resolve(appDirectory, '../node_modules/.bin/vitepress')
const vitepress = existsSync(localVitepress) ? localVitepress : hostVitepress
const env = {
  ...process.env,
  SPMPST_PATHS: JSON.stringify(site.paths),
  SPMPST_SITE_ID: site.id,
  SPMPST_ROOT: site.paths.root,
  SPMPST_OUT_DIR: site.paths.output,
  SPMPST_CACHE_DIR: trashDirectory,
  SPMPST_GENERATED_DIR: devProjectRoot,
  SPMPST_MODE: 'dev',
  SPMPST_DECLARATION: site.declarationPath,
}

function run(binary, commandArgs, runEnv = env) {
  const result = spawnSync(binary, commandArgs, { cwd: appDirectory, env: runEnv, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`Command failed with exit code ${result.status}: ${binary} ${commandArgs.join(' ')}`)
}

function toolchainVariables(runEnv = env) {
  return {
    siteId: site.id,
    sourceDir: site.paths.root,
    generatedDir: runEnv.SPMPST_GENERATED_DIR ?? devProjectRoot,
    stageDir: runEnv.SPMPST_STAGE_DIR ?? site.paths.output,
    outDir: site.paths.output,
    cacheDir: trashDirectory,
    host: runEnv.HOST ?? '127.0.0.1',
    port: runEnv.PORT ?? '4173',
  }
}

function expandAction(action, runEnv = env) {
  if (!action || typeof action.command !== 'string' || !Array.isArray(action.args)) {
    throw new Error(`${site.declarationPath}: toolchain action must define command and args`)
  }
  const values = toolchainVariables(runEnv)
  const expand = (value) => String(value).replace(/\{([A-Za-z]+)\}/g, (_, key) => {
    if (!(key in values)) throw new Error(`${site.declarationPath}: unknown toolchain placeholder {${key}}`)
    return values[key]
  })
  return { command: expand(action.command), args: action.args.map(expand) }
}

function runAction(action, runEnv = env) {
  const { command: executable, args: commandArgs } = expandAction(action, runEnv)
  process.stdout.write(`[spmpst] ${executable} ${commandArgs.join(' ')} (cwd: ${site.toolchainCwd})\n`)
  const result = spawnSync(executable, commandArgs, { cwd: site.toolchainCwd, env: runEnv, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(`Toolchain action failed with exit code ${result.status}: ${executable} ${commandArgs.join(' ')}`)
}

function xmlEscape(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function uniquePages(pages) {
  const byRoute = new Map()
  for (const page of pages) {
    const previous = byRoute.get(page.route)
    if (!previous || page.lastmod > previous.lastmod) byRoute.set(page.route, page)
  }
  return [...byRoute.values()].sort((left, right) => left.route.localeCompare(right.route))
}

function markdownFrontmatterValue(source, key) {
  const value = source.match(new RegExp(`^${key}:\\s*(.*?)\\s*$`, 'm'))?.[1]?.trim()
  if (!value) return ''
  return (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))
    ? value.slice(1, -1)
    : value
}

async function loadRssConfig(site) {
  const rssPath = site.paths.configFiles.rss
  if (!rssPath || !existsSync(rssPath)) return {}
  return JSON.parse(await readFile(rssPath, 'utf8'))
}

async function prepareRssImage(site, rssConfig, outputFile, hostname) {
  const configuredImage = typeof rssConfig.fallbackImage === 'string' ? rssConfig.fallbackImage.trim() : ''
  if (!configuredImage) return null
  if (/^https?:\/\//i.test(configuredImage)) return configuredImage
  if (configuredImage.startsWith('/')) return `${hostname}${configuredImage}`
  const rssPath = site.paths.configFiles.rss
  if (!rssPath) return null
  const source = resolve(site.paths.root, configuredImage)
  if (!existsSync(source)) return null
  const imageName = basename(source)
  const target = join(dirname(outputFile), 'rss-assets', imageName)
  await mkdir(dirname(target), { recursive: true })
  await copyFile(source, target)
  return `${hostname}/rss-assets/${encodeURIComponent(imageName)}`
}

function pageImageUrl(image, hostname) {
  if (!image) return null
  if (/^https?:\/\//i.test(image)) return image
  if (image.startsWith('/')) return `${hostname}${image}`
  return null
}

async function writeSitemap(site, outputDirectory) {
  const seoPath = site.paths.configFiles.seo
  const seo = JSON.parse(await readFile(seoPath, 'utf8'))
  const hostname = typeof seo.siteUrl === 'string' ? seo.siteUrl.replace(/\/$/, '') : ''
  if (!hostname) return
  const pages = []
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const target = join(directory, entry.name)
      if (entry.isDirectory()) await visit(target)
      else if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== '404.html') {
        const relativePath = relative(outputDirectory, target).split(sep).join('/')
        const route = relativePath === 'index.html'
          ? '/'
          : `/${relativePath.replace(/\/index\.html$/, '').replace(/\.html$/, '')}`
        const modified = await stat(target)
        pages.push({ route, lastmod: modified.mtime.toISOString() })
      }
    }
  }
  await visit(outputDirectory)
  const body = uniquePages(pages).map(({ route, lastmod }) => `  <url><loc>${xmlEscape(`${hostname}${route}`)}</loc><lastmod>${lastmod}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`).join('\n')
  await writeFile(join(outputDirectory, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`)
}

async function writeEarlySitemap(site, markdownDirectory, outputFile) {
  const seoPath = site.paths.configFiles.seo
  const seo = JSON.parse(await readFile(seoPath, 'utf8'))
  const hostname = typeof seo.siteUrl === 'string' ? seo.siteUrl.replace(/\/$/, '') : ''
  if (!hostname) return

  const pages = []
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const target = join(directory, entry.name)
      if (entry.isDirectory()) {
        if (entry.name !== 'public') await visit(target)
      } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
        const relativePath = relative(markdownDirectory, target).split(sep).join('/')
        const route = relativePath === 'index.md'
          ? '/'
          : `/${relativePath.replace(/\/index\.md$/, '').replace(/\.md$/, '')}`
        const modified = await stat(target)
        const source = await readFile(target, 'utf8')
        pages.push({
          route,
          lastmod: modified.mtime.toISOString(),
          title: markdownFrontmatterValue(source, 'title') || route,
          description: markdownFrontmatterValue(source, 'description') || 'Feluqa documentation',
        })
      }
    }
  }
  await visit(markdownDirectory)
  const body = uniquePages(pages).map(({ route, lastmod }) => `  <url><loc>${xmlEscape(`${hostname}${route}`)}</loc><lastmod>${lastmod}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`).join('\n')
  await mkdir(dirname(outputFile), { recursive: true })
  await writeFile(outputFile, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`)
}

async function writeEarlyRss(site, markdownDirectory, outputFile) {
  const seoPath = site.paths.configFiles.seo
  const seo = JSON.parse(await readFile(seoPath, 'utf8'))
  const hostname = typeof seo.siteUrl === 'string' ? seo.siteUrl.replace(/\/$/, '') : ''
  if (!hostname) return
  const rssConfig = await loadRssConfig(site)
  const fallbackImage = await prepareRssImage(site, rssConfig, outputFile, hostname)
  const creators = Array.isArray(rssConfig.creator)
    ? rssConfig.creator.filter((creator) => creator && typeof creator.name === 'string' && creator.name.trim())
    : []

  const pages = []
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const target = join(directory, entry.name)
      if (entry.isDirectory()) {
        if (entry.name !== 'public') await visit(target)
      } else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md') {
        const relativePath = relative(markdownDirectory, target).split(sep).join('/')
        const route = relativePath === 'index.md'
          ? '/'
          : `/${relativePath.replace(/\/index\.md$/, '').replace(/\.md$/, '')}`
        const modified = await stat(target)
        const source = await readFile(target, 'utf8')
        pages.push({
          route,
          lastmod: modified.mtime.toISOString(),
          title: markdownFrontmatterValue(source, 'title') || route,
          description: markdownFrontmatterValue(source, 'description') || 'Feluqa documentation',
          image: markdownFrontmatterValue(source, 'image') || markdownFrontmatterValue(source, 'ogImage') || '',
        })
      }
    }
  }
  await visit(markdownDirectory)
  const feedPages = uniquePages(pages).sort((left, right) => right.lastmod.localeCompare(left.lastmod))
  const channelTitle = site.name || 'Feluqa Documentation'
  const channelDescription = 'Documentation for the Feluqa platform and unified namespace.'
  const channelUrl = `${hostname}/`
  const lastBuildDate = feedPages[0]?.lastmod ? new Date(feedPages[0].lastmod).toUTCString() : new Date().toUTCString()
  const creatorElements = creators.map(({ name }) => `    <dc:creator>${xmlEscape(name)}</dc:creator>`).join('\n')
  const channelImage = fallbackImage
    ? `    <image>\n      <url>${xmlEscape(fallbackImage)}</url>\n      <title>${xmlEscape(channelTitle)}</title>\n      <link>${xmlEscape(channelUrl)}</link>\n    </image>\n`
    : ''
  const items = feedPages.map(({ route, lastmod, title, description, image }) => {
    const url = `${hostname}${route}`
    const imageUrl = pageImageUrl(image, hostname) ?? fallbackImage
    const media = imageUrl ? `\n      <media:content url="${xmlEscape(imageUrl)}" medium="image" />` : ''
    const itemCreators = creators.map(({ name }) => `      <dc:creator>${xmlEscape(name)}</dc:creator>`).join('\n')
    return `    <item>\n      <title>${xmlEscape(title)}</title>\n      <link>${xmlEscape(url)}</link>\n      <guid isPermaLink="true">${xmlEscape(url)}</guid>\n      <description>${xmlEscape(description)}</description>\n      <pubDate>${new Date(lastmod).toUTCString()}</pubDate>\n${itemCreators}${media}\n    </item>`
  }).join('\n')
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">\n  <channel>\n    <title>${xmlEscape(channelTitle)}</title>\n    <link>${xmlEscape(channelUrl)}</link>\n    <description>${xmlEscape(channelDescription)}</description>\n    <lastBuildDate>${lastBuildDate}</lastBuildDate>\n${creatorElements}\n${channelImage}${items}\n  </channel>\n</rss>\n`
  await mkdir(dirname(outputFile), { recursive: true })
  await writeFile(outputFile, body)
}

function installToolchain() {
  const install = site.toolchain.install
  if (!install) return
  const shouldRun = install.when === 'always' || (install.when === 'missing' && !existsSync(resolve(site.toolchainCwd, 'node_modules')))
  if (shouldRun) runAction(install)
}

function prepare(prepareEnv = env) {
  run(process.execPath, [join(appDirectory, 'scripts/preparation/pipeline.mjs')], prepareEnv)
}

async function ensureVitepressProject(projectRoot) {
  const configRoot = join(projectRoot, '.vitepress')
  await mkdir(configRoot, { recursive: true })
  for (const name of ['config.ts', 'config', 'theme']) {
    const linkPath = join(configRoot, name)
    if (!existsSync(linkPath)) {
      await symlink(resolve(appDirectory, '.vitepress', name), linkPath, name === 'config.ts' ? 'file' : 'dir')
    }
  }
}

async function ensurePreviewProject(projectRoot, outputDirectory) {
  await ensureVitepressProject(projectRoot)
  const distPath = join(projectRoot, '.vitepress', 'dist')
  if (!existsSync(distPath)) await symlink(outputDirectory, distPath, 'dir')
}

if (command === 'prepare') {
  prepare()
} else if (command === 'check' || command === 'new' || command === 'verify') {
  const script = {
    check: 'scripts/dev/docs-check.mjs',
    new: 'scripts/dev/docs-new.mjs',
    verify: 'scripts/dev/verify.mjs',
  }[command]
  run(process.execPath, [join(appDirectory, script), ...forwardedArgs()])
} else if (command === 'build') {
  await rm(site.paths.output, { recursive: true, force: true })
  installToolchain()
  await mkdir(dirname(site.paths.output), { recursive: true })
  const stagingRoot = resolve(dirname(site.paths.output), 'tmp')
  await mkdir(stagingRoot, { recursive: true })
  const outputName = basename(site.paths.output)
  for (const entry of await readdir(stagingRoot)) {
    if (entry.startsWith(`${outputName}.stage-`) || entry.startsWith(`${outputName}.backup-`)) {
      await rm(join(stagingRoot, entry), { recursive: true, force: true })
    }
  }
  const stage = join(stagingRoot, `${outputName}.stage-${process.pid}`)
  await rm(stage, { recursive: true, force: true })
  // Keep a production build isolated from a concurrently running dev server.
  // A normal preparation clears its generated Markdown tree, and sharing that
  // tree with VitePress dev would trigger page reloads across every route.
  const buildEnv = {
    ...env,
    SPMPST_PATHS: JSON.stringify({ ...site.paths, output: stage }),
    SPMPST_STAGE_DIR: stage,
    SPMPST_OUT_DIR: stage,
    SPMPST_CACHE_DIR: join(trashDirectory, 'build'),
    SPMPST_GENERATED_DIR: resolve(trashDirectory, 'build/vitepress-project'),
    SPMPST_MODE: 'build',
    SPMPST_GENERATED_DIR: resolve(trashDirectory, 'build/vitepress-project'),
  }
  try {
    await ensureVitepressProject(buildEnv.SPMPST_GENERATED_DIR)
    prepare(buildEnv)
    await writeEarlySitemap(
      site,
      join(trashDirectory, 'build/generated-guides'),
      join(trashDirectory, 'build/generated-guides', 'public', 'sitemap.xml'),
    )
    await writeEarlyRss(
      site,
      join(trashDirectory, 'build/generated-guides'),
      join(trashDirectory, 'build/generated-guides', 'public', 'rss.xml'),
    )
    await writeEarlySitemap(
      site,
      join(trashDirectory, 'build/generated-guides'),
      join(stage, 'sitemap.xml'),
    )
    runAction(site.toolchain.build, buildEnv)
    await writeSitemap(site, stage)
    await writeEarlyRss(site, join(trashDirectory, 'build/generated-guides'), join(stage, 'rss.xml'))
    await mkdir(join(stage, '.spmpst'), { recursive: true })
    await writeFile(join(stage, '.spmpst', 'build-timestamp'), `${new Date().toISOString()}\n`)
    run(process.execPath, [join(appDirectory, 'scripts/build/check-file-links.mjs'), stage], buildEnv)
    await rename(stage, site.paths.output)
    process.stdout.write(`[site] ${site.name} built to ${site.paths.output}\n`)
  } catch (error) {
    await rm(stage, { recursive: true, force: true })
    throw error
  }
} else if (command === 'serve') {
  installToolchain()
  await ensureVitepressProject(devProjectRoot)
  prepare()
  await writeEarlySitemap(
    site,
    join(trashDirectory, 'generated-guides'),
    join(trashDirectory, 'generated-guides', 'public', 'sitemap.xml'),
  )
  await writeEarlyRss(
    site,
    join(trashDirectory, 'generated-guides'),
    join(trashDirectory, 'generated-guides', 'public', 'rss.xml'),
  )
  const port = process.env.PORT ?? '4173'
  const devCommand = expandAction(site.toolchain.dev, env)
  const web = spawn(devCommand.command, devCommand.args, { cwd: site.toolchainCwd, env, stdio: 'inherit' })
  const watcher = spawn(process.execPath, [join(appDirectory, 'scripts/dev/watch.mjs')], { cwd: appDirectory, env, stdio: 'inherit' })
  const stop = () => { web.kill('SIGTERM'); watcher.kill('SIGTERM') }
  process.once('SIGINT', stop)
  process.once('SIGTERM', stop)
  const result = await Promise.race([web, watcher].map((child) => new Promise((resolveExit) => child.once('exit', (code) => resolveExit(code ?? 1)))))
  stop()
  process.exit(typeof result === 'number' ? result : 0)
} else if (command === 'preview') {
  run(process.execPath, [join(appDirectory, 'scripts/site.mjs'), 'build', '--site', site.id])
  const previewProject = resolve(trashDirectory, 'build/vitepress-project')
  await ensurePreviewProject(previewProject, site.paths.output)
  run(process.execPath, [join(appDirectory, 'scripts/dev/preview-server.mjs')], { ...env, SPMPST_CACHE_DIR: join(trashDirectory, 'build'), SPMPST_GENERATED_DIR: previewProject })
} else if (command === 'serve-build') {
  const previewProject = resolve(trashDirectory, 'build/vitepress-project')
  await ensurePreviewProject(previewProject, site.paths.output)
  run(process.execPath, [join(appDirectory, 'scripts/dev/preview-server.mjs')], { ...env, SPMPST_CACHE_DIR: join(trashDirectory, 'build'), SPMPST_GENERATED_DIR: previewProject })
} else if (command === 'watch') {
  const watcher = spawn(process.execPath, [join(appDirectory, 'scripts/dev/watch.mjs')], {
    cwd: appDirectory,
    env: { ...env, DOCS_WATCH_BUILD: '1' },
    stdio: 'inherit',
  })
  const stop = () => watcher.kill('SIGTERM')
  process.once('SIGINT', stop)
  process.once('SIGTERM', stop)
  watcher.once('exit', (code) => process.exit(code ?? 0))
} else if (command === 'clean') {
  for (const path of [
    join(trashDirectory, 'generated-guides'),
    join(trashDirectory, 'generated-guides.md'),
    join(trashDirectory, 'vitepress-generated'),
    join(trashDirectory, 'vitepress-cache'),
    join(trashDirectory, 'vitepress-project'),
    join(trashDirectory, 'build/vitepress-project'),
    join(trashDirectory, 'app-vitepress-cache'),
    join(trashDirectory, 'legacy-vitepress-cache'),
    join(trashDirectory, 'mermaid-cache'),
    join(trashDirectory, 'build.lock'),
    join(trashDirectory, 'prepare.lock'),
    join(appDirectory, '.vitepress/cache'),
  ]) await rm(path, { recursive: true, force: true })
  await rm(site.paths.output, { recursive: true, force: true })
  await rm(resolve(dirname(site.paths.output), 'tmp'), { recursive: true, force: true })
  process.stdout.write(`[site] Cleaned ${site.id} generated files and ${site.paths.output}\n`)
} else {
  process.stderr.write('Usage: node scripts/site.mjs <prepare|build|serve|preview|serve-build|watch|clean|check|new|new-site|verify> [args] [--site <id>]\n')
  process.exitCode = 2
}
