import DefaultTheme from 'vitepress/theme'
import { h, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import guideColors from '../generated-guide-colors.json'
import siteContent from '../generated-site-content.json'
import './style.css'

const zoomStep = 0.25
const minZoom = 0.75
const maxZoom = 4

type MarkdownNode = Node

function markdownFromNode(node: MarkdownNode): string {
  if (node.nodeType === Node.TEXT_NODE) return (node.textContent || '').replace(/\\/g, '\\\\').replace(/([*_`])/g, '\\$1')
  if (!(node instanceof HTMLElement)) return ''
  if (node.matches('.header-anchor, button, .mermaid-toolbar, .VPBadge')) return node.matches('.VPBadge') ? node.textContent?.trim() || '' : ''
  const children = () => Array.from(node.childNodes).map(markdownFromNode).join('')
  const content = children().trim()
  if (!content && !['IMG', 'BR', 'HR'].includes(node.tagName)) return ''
  switch (node.tagName) {
    case 'H1': case 'H2': case 'H3': case 'H4': case 'H5': case 'H6': return `${'#'.repeat(Number(node.tagName[1]))} ${content}\n\n`
    case 'P': return `${content}\n\n`
    case 'A': return `[${content}](${node.getAttribute('href') || ''})`
    case 'STRONG': case 'B': return `**${content}**`
    case 'EM': case 'I': return `*${content}*`
    case 'CODE': return node.parentElement?.tagName === 'PRE' ? content : `\`${content}\``
    case 'PRE': {
      const code = node.querySelector('code')
      const language = Array.from(code?.classList || []).find((name) => name.startsWith('language-'))?.slice(9) || ''
      return `\n\`\`\`${language}\n${code?.textContent?.trimEnd() || node.textContent?.trimEnd() || ''}\n\`\`\`\n\n`
    }
    case 'UL': case 'OL': return `${Array.from(node.children).map((item, index) => `${node.tagName === 'OL' ? `${index + 1}.` : '-'} ${markdownFromNode(item).trim().replace(/\n/g, '\n  ')}`).join('\n')}\n\n`
    case 'LI': return children()
    case 'BLOCKQUOTE': return `${content.split('\n').map((line) => `> ${line}`).join('\n')}\n\n`
    case 'IMG': return `![${node.getAttribute('alt') || ''}](${node.getAttribute('src') || ''})`
    case 'BR': return '  \n'
    case 'HR': return '\n---\n\n'
    case 'TABLE': return `${Array.from(node.querySelectorAll('tr')).map((row, index) => `| ${Array.from(row.children).map((cell) => cell.textContent?.trim().replace(/\|/g, '\\|') || '').join(' | ')} |${index === 0 ? `\n| ${Array.from(row.children).map(() => '---').join(' | ')} |` : ''}`).join('\n')}\n\n`
    default: return content
  }
}

async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.append(textarea)
    textarea.select()
    document.execCommand('copy')
    textarea.remove()
  }
}

const PageActions = {
  setup() {
    const { lang } = useData()
    const open = ref(false)
    const isFrench = () => lang.value.toLowerCase().startsWith('fr')
    const labels = () => isFrench()
      ? { title: 'À propos de cette page', trigger: 'Markdown', copyLink: 'Copier le lien de la page', copyMarkdown: 'Copier en Markdown', chatgpt: 'Demander à ChatGPT', claude: 'Demander à Claude', copied: 'Copié' }
      : { title: 'About this page', trigger: 'Markdown', copyLink: 'Copy page link', copyMarkdown: 'Copy as markdown', chatgpt: 'Ask ChatGPT', claude: 'Ask Claude', copied: 'Copied' }
    const action = (label: string, run: () => void | Promise<void>) => h('button', { class: 'page-actions__item', type: 'button', role: 'menuitem', onClick: () => { void run(); open.value = false } }, label)
    const pageUrl = () => window.location.href
    const askUrl = (provider: 'chatgpt' | 'claude') => {
      const prompt = `${isFrench() ? 'Explique cette page de documentation' : 'Explain this documentation page'}: ${pageUrl()}`
      return provider === 'chatgpt' ? `https://chatgpt.com/?q=${encodeURIComponent(prompt)}` : `https://claude.ai/new?q=${encodeURIComponent(prompt)}`
    }
    const copyMarkdown = async () => {
      const article = document.querySelector<HTMLElement>('.vp-doc')
      if (!article) return
      const clone = article.cloneNode(true) as HTMLElement
      clone.querySelectorAll('.header-anchor, button, .mermaid-toolbar').forEach((element) => element.remove())
      await copyText(Array.from(clone.childNodes).map(markdownFromNode).join('').trim() + '\n')
    }
    const onKeydown = (event: KeyboardEvent) => { if (event.key === 'Escape') open.value = false }
    const onDocumentClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('.VPDocAsideMeta')) open.value = false
    }
    onMounted(() => {
      document.addEventListener('keydown', onKeydown)
      document.addEventListener('click', onDocumentClick)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onKeydown)
      document.removeEventListener('click', onDocumentClick)
    })
    return () => {
      const text = labels()
      return h('section', { class: 'VPDocAsideMeta', 'aria-label': text.title }, [
        h('h2', { class: 'meta-title' }, text.title),
        h('div', { class: 'meta-box' }, [
          h('div', { class: 'meta-row VPLlmsPageActions' }, [
            h('button', { class: 'page-actions__trigger', type: 'button', 'aria-haspopup': 'menu', 'aria-expanded': String(open.value), onClick: () => { open.value = !open.value } }, [
              h('span', { class: 'page-actions__file-icon', 'aria-hidden': 'true' }, '▤'), h('span', text.trigger), h('span', { class: 'page-actions__caret', 'aria-hidden': 'true' }, '⌄'),
            ]),
            open.value ? h('div', { class: 'page-actions__menu', role: 'menu' }, [
              action(text.copyLink, () => copyText(pageUrl())),
              action(text.copyMarkdown, copyMarkdown),
              h('a', { class: 'page-actions__item', role: 'menuitem', href: askUrl('chatgpt'), target: '_blank', rel: 'noreferrer', onClick: () => { open.value = false } }, text.chatgpt),
              h('a', { class: 'page-actions__item', role: 'menuitem', href: askUrl('claude'), target: '_blank', rel: 'noreferrer', onClick: () => { open.value = false } }, text.claude),
            ]) : null,
          ]),
        ]),
      ])
    }
  },
}

const SidebarFooter = {
  setup() {
    const { frontmatter, lang } = useData()
    const route = useRoute()
    return () => {
      if (frontmatter.value.footer === false || frontmatter.value.layout === 'home') return null
      const guidePath = route.path.split('/').filter(Boolean)[0]
      if (!siteContent.guidePaths.includes(guidePath)) return null
      const language = lang.value.toLowerCase().split('-')[0]
      const footer = siteContent.footer[language] ?? siteContent.footer.root
      if (!footer) return null
      return h('footer', { class: 'FeluqaSidebarFooter' }, [
        h('div', { class: 'FeluqaSidebarFooter__content' }, [
          footer.message ? h('p', { class: 'message', innerHTML: footer.message }) : null,
          footer.copyright ? h('p', { class: 'copyright', innerHTML: footer.copyright }) : null,
        ]),
      ])
    }
  },
}

type ZoomTarget = HTMLElement

function setZoom(target: ZoomTarget, value: number): void {
  const zoom = Math.min(maxZoom, Math.max(minZoom, value))
  target.dataset.zoom = String(zoom)
  const image = target.querySelector('img')
  if (image) image.style.width = String(zoom * 100) + '%'
}

function createIcon(name: 'in' | 'out' | 'expand' | 'close'): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('width', '18')
  svg.setAttribute('height', '18')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '1.8')
  svg.setAttribute('stroke-linecap', 'round')
  svg.setAttribute('stroke-linejoin', 'round')
  const paths: Record<typeof name, string[]> = {
    in: ['M12 5v14', 'M5 12h14'],
    out: ['M5 12h14'],
    expand: ['M8 3H5a2 2 0 0 0-2 2v3', 'M16 3h3a2 2 0 0 1 2 2v3', 'M21 16v3a2 2 0 0 1-2 2h-3', 'M3 16v3a2 2 0 0 0 2 2h3'],
    close: ['M18 6 6 18', 'm6 6 12 12'],
  }
  for (const d of paths[name]) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', d)
    svg.append(path)
  }
  return svg
}

function actionButton(action: string, label: string, icon: 'in' | 'out' | 'expand' | 'close'): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'mermaid-tool'
  button.dataset.mermaidAction = action
  button.setAttribute('aria-label', label)
  button.title = label
  button.append(createIcon(icon))
  return button
}

const MermaidLayout = {
  setup() {
    const route = useRoute()
    const colorProperties: Record<string, string> = {
      primary: '--vp-c-brand-1',
      secondary: '--vp-c-brand-2',
      tertiary: '--vp-c-brand-3',
      soft: '--vp-c-brand-soft',
      sidebarIcon: '--vp-sidebar-icon-color',
      inlineCode: '--vp-code-color',
      heroNameColor: '--vp-home-hero-name-color',
      heroNameBackground: '--vp-home-hero-name-background',
    }
    const applyGuideColors = () => {
      const pathGuide = route.path.split('/').filter(Boolean)[0]
      const configured = guideColors as Record<string, Record<string, string>>
      const colors = configured[pathGuide] ?? Object.values(configured)[0] ?? {}
      const root = document.documentElement
      for (const [key, property] of Object.entries(colorProperties)) {
        root.style.removeProperty(property)
        const value = colors[key]
        if (typeof value === 'string' && value.trim()) root.style.setProperty(property, value.trim())
      }
      if (colors.primary && !colors.tertiary) root.style.setProperty('--vp-c-brand-3', 'var(--vp-c-brand-1)')
      if (colors.primary && !colors.soft) root.style.setProperty('--vp-c-brand-soft', 'color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent)')
      if (colors.favicon) {
        let icon = document.querySelector<HTMLLinkElement>('link[data-feluqa-favicon]')
        if (!icon) {
          icon = document.createElement('link')
          icon.rel = 'icon'
          icon.dataset.feluqaFavicon = ''
          document.head.append(icon)
        }
        icon.href = colors.favicon
      }
    }
    let observer: MutationObserver | undefined
    let dialog: HTMLDialogElement | undefined
    let dialogImage: HTMLImageElement | undefined
    let viewport: HTMLDivElement | undefined
    let themeObserver: MutationObserver | undefined
    let pointer: { id: number; x: number; y: number; left: number; top: number } | undefined

    const syncDiagramTheme = () => {
      const dark = document.documentElement.classList.contains('dark')
      document.querySelectorAll<HTMLImageElement>('.mermaid-figure img, .mermaid-dialog img').forEach((image) => {
        const lightSource = image.dataset.lightSrc
        const darkSource = image.dataset.darkSrc
        if (!lightSource || !darkSource) return
        const source = dark ? darkSource : lightSource
        if (image.getAttribute('src') !== source) image.setAttribute('src', source)
      })
    }

  const installDialog = () => {
    if (dialog) return
    dialog = document.createElement('dialog')
    dialog.className = 'mermaid-dialog'
    dialog.setAttribute('aria-label', 'Mermaid diagram viewer')
    const panel = document.createElement('div')
    panel.className = 'mermaid-dialog__panel'
    const toolbar = document.createElement('div')
    toolbar.className = 'mermaid-toolbar mermaid-toolbar--dialog'
    toolbar.append(
      actionButton('zoom-out', 'Zoom out', 'out'),
      actionButton('zoom-in', 'Zoom in', 'in'),
      actionButton('close', 'Close diagram', 'close'),
    )
    viewport = document.createElement('div')
    viewport.className = 'mermaid-dialog__viewport'
    dialogImage = document.createElement('img')
    dialogImage.alt = 'Mermaid diagram'
    viewport.append(dialogImage)
    panel.append(toolbar, viewport)
    dialog.append(panel)
    document.body.append(dialog)
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog?.close()
    })
    viewport.addEventListener('pointerdown', (event) => {
      if ((event.target as Element).closest('button')) return
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, left: viewport!.scrollLeft, top: viewport!.scrollTop }
      viewport!.setPointerCapture(event.pointerId)
      viewport!.classList.add('is-dragging')
    })
    viewport.addEventListener('pointermove', (event) => {
      if (!pointer || pointer.id !== event.pointerId) return
      viewport!.scrollLeft = pointer.left - (event.clientX - pointer.x)
      viewport!.scrollTop = pointer.top - (event.clientY - pointer.y)
    })
    const finishPan = () => {
      pointer = undefined
      viewport?.classList.remove('is-dragging')
    }
    viewport.addEventListener('pointerup', finishPan)
    viewport.addEventListener('pointercancel', finishPan)
  }

  const openDiagram = (figure: HTMLElement) => {
    installDialog()
    const source = figure.querySelector('img')
    if (!dialog || !dialogImage || !viewport || !source) return
    const lightSource = source.dataset.lightSrc || source.getAttribute('src') || source.src
    const darkSource = source.dataset.darkSrc || lightSource.replace(/\.svg$/, '.dark.svg')
    dialogImage.dataset.lightSrc = lightSource
    dialogImage.dataset.darkSrc = darkSource
    dialogImage.src = document.documentElement.classList.contains('dark') ? darkSource : lightSource
    dialogImage.alt = source.alt || 'Mermaid diagram'
    setZoom(viewport, 1)
    viewport.scrollTo(0, 0)
    dialog.showModal()
    dialog.querySelector<HTMLButtonElement>('[data-mermaid-action="close"]')?.focus()
  }

  const installFigures = () => {
    const root = document.querySelector('.vp-doc')
    if (!root) return
    root.querySelectorAll<HTMLImageElement>('img[src^="/mermaid/"]').forEach((image) => {
      if (image.closest('.mermaid-figure')) return
      const figure = document.createElement('div')
      figure.className = 'mermaid-figure'
      figure.dataset.zoom = '1'
      figure.tabIndex = 0
      figure.setAttribute('role', 'group')
      figure.setAttribute('aria-label', 'Mermaid diagram. Use the controls to zoom or open a larger view.')
      image.dataset.lightSrc = image.getAttribute('src') || image.src
      image.dataset.darkSrc = image.dataset.lightSrc.replace(/\.svg$/, '.dark.svg')
      image.parentNode?.insertBefore(figure, image)
      figure.append(image)
      const toolbar = document.createElement('div')
      toolbar.className = 'mermaid-toolbar'
      toolbar.append(
        actionButton('zoom-out', 'Zoom out', 'out'),
        actionButton('zoom-in', 'Zoom in', 'in'),
        actionButton('open', 'Open diagram in large view', 'expand'),
      )
      figure.append(toolbar)
      image.draggable = false
    })
    syncDiagramTheme()
  }

  const handleClick = (event: MouseEvent) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>('[data-mermaid-action]')
    if (!button) return
    const action = button.dataset.mermaidAction
    if (action === 'close') {
      dialog?.close()
      return
    }
    const figure = button.closest<HTMLElement>('.mermaid-figure')
    if (action === 'open' && figure) {
      openDiagram(figure)
      return
    }
    const inDialog = button.closest('dialog')
    const target = inDialog ? viewport : figure
    if (!target) return
    const current = Number(target.dataset.zoom || '1')
    const next = action === 'zoom-in' ? current + zoomStep : current - zoomStep
    setZoom(target, next)
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.target instanceof Element && event.target.closest('button')) return
    const figure = (event.target as Element | null)?.closest<HTMLElement>('.mermaid-figure')
    if (!figure || (event.key !== 'Enter' && event.key !== ' ')) return
    event.preventDefault()
    openDiagram(figure)
  }

  onMounted(() => {
    applyGuideColors()
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKeydown)
    observer = new MutationObserver(installFigures)
    observer.observe(document.body, { childList: true, subtree: true })
    themeObserver = new MutationObserver(syncDiagramTheme)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    void nextTick(installFigures)
  })
  const stopWatchingRoute = watch(() => route.path, () => void nextTick(() => { applyGuideColors(); installFigures() }), { flush: 'post' })
  onBeforeUnmount(() => {
    stopWatchingRoute()
    observer?.disconnect()
    themeObserver?.disconnect()
    document.removeEventListener('click', handleClick)
    document.removeEventListener('keydown', handleKeydown)
    dialog?.remove()
  })
    return () => h(DefaultTheme.Layout, null, {
      'aside-outline-before': () => h(PageActions),
      'layout-bottom': () => h(SidebarFooter),
    })
  },
}

export default {
  ...DefaultTheme,
  Layout: MermaidLayout,
}
