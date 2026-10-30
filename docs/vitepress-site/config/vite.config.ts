import { createReadStream, existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadConfigFromFile, mergeConfig, searchForWorkspaceRoot } from 'vite'
import { loadSiteModelSync } from '../scripts/spmpst/config/index.mjs'
import { resolveLayout } from '../scripts/spmpst/layout.mjs'
import { toVitepressRuntime } from '../scripts/preparation/runtime.mjs'

const siteDirectory = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const projectDirectory = resolve(siteDirectory, '..')
const siteRequire = createRequire(join(siteDirectory, 'package.json'))
const layout = resolveLayout(siteDirectory)
const loadedSite = loadSiteModelSync(layout)
const siteConfiguration = toVitepressRuntime(loadedSite.model, loadedSite.targets.vitepress, layout)
const componentDirectory = resolve(projectDirectory, siteConfiguration.project?.components ?? 'resources/targets/vitepress/components')

async function loadProjectViteConfig(): Promise<Record<string, unknown>> {
  const configured = siteConfiguration.project?.viteConfig
  const candidates = configured
    ? [resolve(projectDirectory, configured)]
    : ['vite.config.ts', 'vite.config.mts', 'vite.config.js', 'vite.config.mjs'].map((name) => join(projectDirectory, name))
  const configFile = candidates.find((candidate) => existsSync(candidate))
  if (!configFile) return {}
  const loaded = await loadConfigFromFile(
    { command: process.env.NODE_ENV === 'production' ? 'build' : 'serve', mode: process.env.NODE_ENV ?? 'development' },
    configFile,
    projectDirectory,
    'silent',
  )
  return (loaded?.config ?? {}) as Record<string, unknown>
}

const publicDirectory = resolve(siteDirectory, '.generated-guides/public')
const generatedGuideColors = JSON.parse(readFileSync(join(siteDirectory, '.vitepress/generated/guide-colors.json'), 'utf8'))
const primaryFavicon = Object.values(generatedGuideColors)[0]?.favicon
const mimeTypes: Record<string, string> = {
  '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2',
}

const siteViteConfig = {
  // Component-owned assets live under the configured component root.
  server: { fs: { allow: [...new Set([searchForWorkspaceRoot(siteDirectory), componentDirectory])] } },
  css: { postcss: resolve(siteDirectory, 'config/postcss.config.js') },
  resolve: {
    alias: [
      { find: /^vue$/, replacement: resolve(siteDirectory, 'node_modules/vue/dist/vue.runtime.esm-bundler.js') },
      { find: /^vue\/(.+)$/, replacement: `${resolve(siteDirectory, 'node_modules/vue')}/$1` },
      { find: /^vitepress$/, replacement: resolve(siteDirectory, 'node_modules/vitepress/dist/client/index.js') },
    ],
  },
  publicDir: publicDirectory,
  plugins: [{
    name: 'resolve-guide-component-dependencies',
    enforce: 'pre' as const,
    resolveId(source: string, importer?: string) {
      if (!importer || source.startsWith('.') || source.startsWith('/') || source.startsWith('node:')) return null
      if (source === 'vue' || source.startsWith('vue/') || source === 'vitepress') return null
      const importerPath = importer.split(/[?#]/, 1)[0]
      const componentRelativePath = relative(componentDirectory, importerPath)
      if (componentRelativePath === '..' || componentRelativePath.startsWith(`..${sep}`) || componentRelativePath.startsWith(sep)) return null
      try {
        return siteRequire.resolve(source)
      } catch {
        return null
      }
    },
  }, {
    name: 'generated-public-assets',
    configureServer(server: { middlewares: { use: (handler: (request: any, response: any, next: () => void) => void) => void } }) {
      server.middlewares.use((request, response, next) => {
        let requestUrl: URL
        let pathname: string
        try {
          requestUrl = new URL(request.url ?? '/', 'http://localhost')
          pathname = decodeURIComponent(requestUrl.pathname)
        }
        catch { next(); return }
        if (requestUrl.searchParams.has('import')) {
          if (pathname.endsWith('/index.md')) {
            const siblingMarkdown = pathname.slice(0, -'/index.md'.length) + '.md'
            const siblingPath = resolve(siteDirectory, '.generated-guides', `.${siblingMarkdown}`)
            if (!existsSync(resolve(siteDirectory, '.generated-guides', `.${pathname}`)) && existsSync(siblingPath)) {
              request.url = `${siblingMarkdown}${requestUrl.search}`
            }
          }
          next()
          return
        }
        const isDefaultIcon = pathname === '/favicon.ico' && typeof primaryFavicon === 'string'
        const isConfiguredTextFile = /^\/(?:[A-Za-z0-9._-]+\.txt)$/.test(pathname)
        if (!isDefaultIcon && !isConfiguredTextFile && !pathname.startsWith('/mermaid/') && !pathname.startsWith('/__docs-assets/')) {
          next()
          return
        }
        const target = resolve(publicDirectory, `.${isDefaultIcon ? primaryFavicon : pathname}`)
        const relativeTarget = relative(publicDirectory, target)
        if (!relativeTarget || relativeTarget.startsWith(`..${sep}`) || relativeTarget === '..' || !existsSync(target)) {
          next()
          return
        }
        response.statusCode = 200
        response.setHeader('Content-Type', mimeTypes[extname(target).toLowerCase()] ?? 'application/octet-stream')
        response.setHeader('Cache-Control', 'no-cache')
        createReadStream(target).pipe(response)
      })
    },
  }],
}

export default defineConfig(async () => {
  const projectViteConfig = await loadProjectViteConfig()
  return mergeConfig(siteViteConfig, projectViteConfig)
})
