type VueBackedElement = HTMLElement & {
  __vueParentComponent?: { proxy?: Record<string, unknown> }
}

type TooltipTrigger = HTMLElement & { __xTooltipDescription?: string }

const tooltipId = 'docs-x-tooltip'
const placementNames = ['top', 'right', 'bottom', 'left'] as const
type Placement = typeof placementNames[number]

let installed = false
let activeTrigger: TooltipTrigger | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined
let showTimer: ReturnType<typeof setTimeout> | undefined
let refreshTimer: ReturnType<typeof setInterval> | undefined

function tooltipAttribute(element: HTMLElement): { name: string; value: string; placement: Placement } | undefined {
  for (const placement of placementNames) {
    const name = `x-tooltip.${placement}`
    if (element.hasAttribute(name)) return { name, value: element.getAttribute(name) ?? '', placement }
  }
  if (element.hasAttribute('x-tooltip')) return { name: 'x-tooltip', value: element.getAttribute('x-tooltip') ?? '', placement: 'top' }
  return undefined
}

function resolveTooltipText(element: TooltipTrigger): string {
  const attribute = tooltipAttribute(element)
  if (!attribute) return ''

  const expression = attribute.value.trim()
  const quoted = expression.match(/^(?:'([\s\S]*)'|"([\s\S]*)")$/)
  if (quoted) return quoted[1] ?? quoted[2] ?? ''

  if (/^[\w$]+(?:\.[\w$]+)*$/.test(expression)) {
    let value: unknown = (element as VueBackedElement).__vueParentComponent?.proxy
    for (const key of expression.split('.')) {
      if (!value || (typeof value !== 'object' && typeof value !== 'function') || !(key in value)) {
        value = undefined
        break
      }
      value = (value as Record<string, unknown>)[key]
    }
    if (value !== undefined && value !== null) return String(value)
  }

  return expression
}

function findTrigger(target: EventTarget | null): TooltipTrigger | undefined {
  if (!(target instanceof Element)) return undefined
  let element: Element | null = target
  while (element) {
    if (element.hasAttribute('x-tooltip') || placementNames.some((placement) => element?.hasAttribute(`x-tooltip.${placement}`))) {
      return element as TooltipTrigger
    }
    element = element.parentElement
  }
  return undefined
}

function tooltipElement(): HTMLDivElement {
  let tooltip = document.getElementById(tooltipId) as HTMLDivElement | null
  if (!tooltip) {
    tooltip = document.createElement('div')
    tooltip.id = tooltipId
    tooltip.className = 'docs-x-tooltip'
    tooltip.setAttribute('role', 'tooltip')
    tooltip.dataset.state = 'hidden'
    document.body.append(tooltip)
  }
  return tooltip
}

function positionTooltip(trigger: TooltipTrigger, tooltip: HTMLDivElement): void {
  const rect = trigger.getBoundingClientRect()
  const box = tooltip.getBoundingClientRect()
  const gap = 8
  const padding = 8
  const { placement: requestedPlacement } = tooltipAttribute(trigger) ?? { placement: 'top' as Placement }
  let placement = requestedPlacement
  let left = rect.left + (rect.width - box.width) / 2
  let top = rect.top - box.height - gap

  if (placement === 'bottom') top = rect.bottom + gap
  if (placement === 'left') {
    left = rect.left - box.width - gap
    top = rect.top + (rect.height - box.height) / 2
  }
  if (placement === 'right') {
    left = rect.right + gap
    top = rect.top + (rect.height - box.height) / 2
  }

  if (placement === 'top' && top < padding) {
    placement = 'bottom'
    top = rect.bottom + gap
  } else if (placement === 'bottom' && top + box.height > window.innerHeight - padding) {
    placement = 'top'
    top = rect.top - box.height - gap
  }
  if (placement === 'left' && left < padding) {
    placement = 'right'
    left = rect.right + gap
  } else if (placement === 'right' && left + box.width > window.innerWidth - padding) {
    placement = 'left'
    left = rect.left - box.width - gap
  }

  tooltip.dataset.placement = placement
  tooltip.style.left = `${Math.max(padding, Math.min(left, window.innerWidth - box.width - padding))}px`
  tooltip.style.top = `${Math.max(padding, Math.min(top, window.innerHeight - box.height - padding))}px`
}

function updateTooltip(): void {
  const trigger = activeTrigger
  if (!trigger?.isConnected) {
    hideTooltip()
    return
  }
  const text = resolveTooltipText(trigger)
  const tooltip = tooltipElement()
  if (!text) {
    hideTooltip()
    return
  }
  tooltip.textContent = text
  tooltip.dataset.state = 'visible'
  const describedBy = new Set((trigger.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean))
  describedBy.add(tooltipId)
  trigger.setAttribute('aria-describedby', [...describedBy].join(' '))
  positionTooltip(trigger, tooltip)
}

function clearDescription(trigger: TooltipTrigger): void {
  const remaining = (trigger.getAttribute('aria-describedby') ?? '').split(/\s+/).filter((id) => id && id !== tooltipId)
  if (remaining.length) trigger.setAttribute('aria-describedby', remaining.join(' '))
  else trigger.removeAttribute('aria-describedby')
}

function showTooltip(trigger: TooltipTrigger, delay = 0): void {
  if (hideTimer) clearTimeout(hideTimer)
  if (showTimer) clearTimeout(showTimer)
  if (activeTrigger && activeTrigger !== trigger) clearDescription(activeTrigger)
  activeTrigger = trigger
  const show = () => {
    showTimer = undefined
    if (activeTrigger === trigger) {
      updateTooltip()
      if (tooltipElement().dataset.state === 'visible' && !refreshTimer) refreshTimer = setInterval(updateTooltip, 160)
    }
  }
  if (delay <= 0) show()
  else showTimer = setTimeout(show, delay)
}

function hideTooltip(): void {
  if (showTimer) clearTimeout(showTimer)
  if (hideTimer) clearTimeout(hideTimer)
  showTimer = undefined
  hideTimer = undefined
  if (activeTrigger) clearDescription(activeTrigger)
  activeTrigger = undefined
  const tooltip = document.getElementById(tooltipId)
  if (tooltip) tooltip.dataset.state = 'hidden'
  if (refreshTimer) clearInterval(refreshTimer)
  refreshTimer = undefined
}

function deferHide(): void {
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(hideTooltip, 90)
}

export function installXTooltip(): void {
  if (installed || typeof document === 'undefined') return
  installed = true

  document.addEventListener('pointerover', (event) => {
    const trigger = findTrigger(event.target)
    if (trigger && !trigger.contains(event.relatedTarget as Node | null)) showTooltip(trigger)
  })
  document.addEventListener('pointerout', (event) => {
    const trigger = findTrigger(event.target)
    if (trigger && trigger === activeTrigger && !trigger.contains(event.relatedTarget as Node | null)) deferHide()
  })
  document.addEventListener('pointermove', () => {
    if (activeTrigger && tooltipElement().dataset.state === 'visible') positionTooltip(activeTrigger, tooltipElement())
  }, { passive: true })
  document.addEventListener('focusin', (event) => {
    const trigger = findTrigger(event.target)
    if (trigger) showTooltip(trigger, 0)
  })
  document.addEventListener('focusout', (event) => {
    const trigger = findTrigger(event.target)
    if (trigger) deferHide()
  })
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hideTooltip()
  })
  window.addEventListener('scroll', () => {
    if (activeTrigger && tooltipElement().dataset.state === 'visible') positionTooltip(activeTrigger, tooltipElement())
  }, true)
  window.addEventListener('resize', () => {
    if (activeTrigger && tooltipElement().dataset.state === 'visible') positionTooltip(activeTrigger, tooltipElement())
  })
  new MutationObserver(() => {
    if (activeTrigger && !activeTrigger.isConnected) hideTooltip()
  }).observe(document.documentElement, { childList: true, subtree: true })
}
