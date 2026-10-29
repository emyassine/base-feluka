import { readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, join, relative, resolve, sep, extname } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'

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

async function inlineCss(css, cssPath) {
  const urls = [...css.matchAll(/url\((['"]?)([^)'\"]+)\1\)/g)]
  for (const match of urls.reverse()) {
    const url = match[2]
    if (/^(?:data:|https?:|#)/i.test(url)) continue
    const assetPath = url.startsWith('/') ? join(output, url.slice(1)) : resolve(dirname(cssPath), url)
    try {
      const bytes = await readFile(assetPath)
      const mime = extname(assetPath) === '.woff2' ? 'font/woff2' : 'application/octet-stream'
      css = `${css.slice(0, match.index)}url("data:${mime};base64,${bytes.toString('base64')}")${css.slice(match.index + match[0].length)}`
    } catch {}
  }
  return css
}

const staticControls = `<script>(()=>{const key='vitepress-theme-appearance';const setTheme=(dark,save=true)=>{document.documentElement.classList.toggle('dark',dark);if(save)localStorage.setItem(key,dark?'dark':'light')};document.addEventListener('click',event=>{const appearance=event.target.closest('.VPSwitchAppearance');if(appearance){setTheme(!document.documentElement.classList.contains('dark'));return}const group=event.target.closest('.VPSidebarItem.collapsible');if(group&&event.target.closest('.item')){if(group.querySelector('.item').contains(event.target)){group.classList.toggle('collapsed')}}});document.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.matches('.VPSidebarItem.collapsible .item')){event.preventDefault();event.target.closest('.VPSidebarItem.collapsible').classList.toggle('collapsed')}});document.querySelectorAll('.VPSidebarItem.collapsible.has-active').forEach(group=>group.classList.remove('collapsed'))})();</script>`

for (const page of pages) {
  let html = await readFile(page, 'utf8')
  const pageUrl = pathToFileURL(page)
  const cssLinks = [...html.matchAll(/<link\b[^>]*href="([^"]+\.css)"[^>]*>/g)]
  for (const match of cssLinks.reverse()) {
    const cssPath = match[1].startsWith('/')
      ? join(output, match[1].slice(1))
      : fileURLToPath(new URL(match[1], pageUrl))
    const css = await inlineCss(await readFile(cssPath, 'utf8'), cssPath)
    html = `${html.slice(0, match.index)}<style>${css}</style>${html.slice(match.index + match[0].length)}`
  }
  html = html.replace(/<link\b[^>]*(?:rel="modulepreload"|rel="preload"[^>]*as="font")[^>]*>/g, '')
  html = html.replace(/\b(href|src)="(\/[^"]*)"/g, (all, attr, url) => {
    const [pathname, ...suffix] = url.slice(1).split(/(?=[?#])/)
    let target = relative(relative(output, dirname(page)) || '.', pathname).split(sep).join('/')
    if (!target.startsWith('.')) target = `./${target}`
    return `${attr}="${target}${suffix.join('')}"`
  })
  for (const match of [...html.matchAll(/\b(?:src|href)="((?:\.\/|\.\.\/)[^"]+\.(?:svg|png|ico))"/g)].reverse()) {
    const url = new URL(match[1], pageUrl)
    const assetPath = fileURLToPath(url)
    const bytes = await readFile(assetPath)
    const ext = extname(assetPath).toLowerCase()
    const mime = ext === '.svg' ? 'image/svg+xml' : ext === '.png' ? 'image/png' : 'image/x-icon'
    const data = `data:${mime};base64,${bytes.toString('base64')}`
    html = `${html.slice(0, match.index)}${match[0].replace(match[1], data)}${html.slice(match.index + match[0].length)}`
  }
  html = html.replace(/<\/body>/i, `${staticControls}</body>`)
  await writeFile(page, html)
}
