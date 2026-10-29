import { createReadStream, existsSync, readFileSync } from 'node:fs'
import { extname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const siteDirectory = fileURLToPath(new URL('.', import.meta.url))

const publicDirectory = resolve(siteDirectory, '.generated-guides/public')
const generatedGuideColors = JSON.parse(readFileSync(join(siteDirectory, '.vitepress/generated-guide-colors.json'), 'utf8'))
const primaryFavicon = Object.values(generatedGuideColors)[0]?.favicon
const mimeTypes: Record<string, string> = {
  '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2',
}

export default defineConfig({
  resolve: {
    alias: [
      { find: /^vue$/, replacement: resolve(siteDirectory, 'node_modules/vue/dist/vue.runtime.esm-bundler.js') },
      { find: /^vitepress$/, replacement: resolve(siteDirectory, 'node_modules/vitepress/dist/client/index.js') },
    ],
  },
  publicDir: publicDirectory,
  plugins: [{
    name: 'feluqa-generated-public-assets',
    configureServer(server) {
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
})
