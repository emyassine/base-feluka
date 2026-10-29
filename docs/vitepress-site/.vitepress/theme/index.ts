import DefaultTheme from 'vitepress/theme'
import { h, nextTick, onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import './style.css'

const zoomStep = 0.25
const minZoom = 0.75
const maxZoom = 4

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
    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKeydown)
    observer = new MutationObserver(installFigures)
    observer.observe(document.body, { childList: true, subtree: true })
    themeObserver = new MutationObserver(syncDiagramTheme)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    void nextTick(installFigures)
  })
  const stopWatchingRoute = watch(() => route.path, () => void nextTick(installFigures), { flush: 'post' })
  onBeforeUnmount(() => {
    stopWatchingRoute()
    observer?.disconnect()
    themeObserver?.disconnect()
    document.removeEventListener('click', handleClick)
    document.removeEventListener('keydown', handleKeydown)
    dialog?.remove()
  })
    return () => h(DefaultTheme.Layout)
  },
}

export default {
  ...DefaultTheme,
  Layout: MermaidLayout,
}
