import { createReadStream, existsSync } from 'node:fs'
import { extname, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

const siteDirectory = fileURLToPath(new URL('.', import.meta.url))

const publicDirectory = resolve(siteDirectory, '.generated-guides/public')
const mimeTypes: Record<string, string> = {
  '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon', '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.woff2': 'font/woff2',
}

export default defineConfig({
  publicDir: publicDirectory,
  plugins: [{
    name: 'feluqa-generated-public-assets',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        let pathname: string
        try { pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname) }
        catch { next(); return }
        if (!pathname.startsWith('/mermaid/') && !pathname.startsWith('/__docs-assets/')) {
          next()
          return
        }
        const target = resolve(publicDirectory, `.${pathname}`)
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
