type VueBackedElement = HTMLElement & {
  __vueParentComponent?: { proxy?: Record<string, unknown> }
}

type TooltipTrigger = HTMLElement & { __xTooltipDescription?: string }
type TooltipContent = string | { image?: string; text?: string }

const tooltipId = 'docs-x-tooltip'
const placementNames = ['top', 'right', 'bottom', 'left'] as const
type Placement = typeof placementNames[number]

let installed = false
let activeTrigger: TooltipTrigger | undefined
let pinnedTrigger: TooltipTrigger | undefined
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

function resolveExpressionValue(element: TooltipTrigger, expression: string): unknown {
  const value = expression.trim()
  const quoted = value.match(/^(?:'((?:\\.|[^'])*)'|"((?:\\.|[^"])*)")$/)
  if (quoted) return (quoted[1] ?? quoted[2] ?? '').replace(/\\([\\'"nrt])/g, (_match, escaped: string) => {
    if (escaped === 'n') return '\n'
    if (escaped === 'r') return '\r'
    if (escaped === 't') return '\t'
    return escaped
  })

  if (!/^[\w$]+(?:\.[\w$]+)*$/.test(value)) return undefined

  let resolved: unknown = (element as VueBackedElement).__vueParentComponent?.proxy
  for (const key of value.split('.')) {
    if (!resolved || (typeof resolved !== 'object' && typeof resolved !== 'function') || !(key in resolved)) {
      return undefined
    }
    resolved = (resolved as Record<string, unknown>)[key]
  }
  return resolved
}

function resolveTooltipContent(element: TooltipTrigger): TooltipContent | undefined {
  const attribute = tooltipAttribute(element)
  if (!attribute) return undefined

  const expression = attribute.value.trim()
  const quoted = expression.match(/^(?:'([\s\S]*)'|"([\s\S]*)")$/)
  if (quoted) return quoted[1] ?? quoted[2] ?? ''

  try {
    const parsed: unknown = JSON.parse(expression)
    if (typeof parsed === 'string') return parsed
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const content = parsed as Record<string, unknown>
      if ((content.image === undefined || typeof content.image === 'string') && (content.text === undefined || typeof content.text === 'string')) {
        return { image: content.image as string | undefined, text: content.text as string | undefined }
      }
    }
  } catch {
    // Continue with the simple Vue-style object expression parser below.
  }

  const objectExpression = expression.match(/^\{([\s\S]*)\}$/)
  if (objectExpression) {
    const values: Record<string, unknown> = {}
    const propertyExpression = /(?:^|,)\s*(image|text)\s*:\s*("(?:\\.|[^"])*"|'(?:\\.|[^'])*'|[\w$]+(?:\.[\w$]+)*)(?=\s*(?:,|$))/g
    for (const property of objectExpression[1].matchAll(propertyExpression)) {
      values[property[1]] = resolveExpressionValue(element, property[2])
    }
    if ((values.image === undefined || typeof values.image === 'string') && (values.text === undefined || typeof values.text === 'string')) {
      return { image: values.image as string | undefined, text: values.text as string | undefined }
    }
  }

  const value = resolveExpressionValue(element, expression)
  return value === undefined || value === null ? expression : String(value)
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
  const content = resolveTooltipContent(trigger)
  const tooltip = tooltipElement()
  if (typeof content === 'string' ? !content : !content || (!content.image && !content.text)) {
    hideTooltip()
    return
  }
  const signature = typeof content === 'string' ? `text:${content}` : `media:${content.image ?? ''}\n${content.text ?? ''}`
  if (tooltip.dataset.content !== signature) {
    tooltip.replaceChildren()
    tooltip.classList.toggle('docs-x-tooltip--media', typeof content !== 'string')
    if (typeof content === 'string') {
      tooltip.textContent = content
    } else {
      if (content.image) {
        const image = document.createElement('img')
        image.className = 'docs-x-tooltip__image'
        image.src = content.image
        image.alt = content.text ?? ''
        image.loading = 'lazy'
        tooltip.append(image)
      }
      if (content.text) {
        const text = document.createElement('div')
        text.className = 'docs-x-tooltip__text'
        text.textContent = content.text
        tooltip.append(text)
      }
    }
    tooltip.dataset.content = signature
  }
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
  pinnedTrigger = undefined
  const tooltip = document.getElementById(tooltipId)
  if (tooltip) tooltip.dataset.state = 'hidden'
  if (refreshTimer) clearInterval(refreshTimer)
  refreshTimer = undefined
}

function deferHide(): void {
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(hideTooltip, 90)
}

function cancelHide(): void {
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = undefined
}

function isInsideTooltip(target: EventTarget | null): boolean {
  const tooltip = document.getElementById(tooltipId)
  return Boolean(tooltip && target instanceof Node && tooltip.contains(target))
}

export function installXTooltip(): void {
  if (installed || typeof document === 'undefined') return
  installed = true

  document.addEventListener('pointerover', (event) => {
    if (isInsideTooltip(event.target)) {
      cancelHide()
      return
    }
    const trigger = findTrigger(event.target)
    if (trigger && !trigger.contains(event.relatedTarget as Node | null)) showTooltip(trigger)
  })
  document.addEventListener('pointerout', (event) => {
    if (isInsideTooltip(event.target)) {
      if (pinnedTrigger && event.pointerType === 'touch') return
      if (isInsideTooltip(event.relatedTarget) || activeTrigger?.contains(event.relatedTarget as Node | null)) cancelHide()
      else deferHide()
      return
    }
    const trigger = findTrigger(event.target)
    if (trigger && trigger === activeTrigger && !trigger.contains(event.relatedTarget as Node | null)) {
      if (pinnedTrigger === trigger && event.pointerType === 'touch') return
      if (isInsideTooltip(event.relatedTarget)) cancelHide()
      else deferHide()
    }
  })
  document.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'touch') return
    const trigger = findTrigger(event.target)
    if (trigger) {
      if (pinnedTrigger === trigger && activeTrigger === trigger) {
        hideTooltip()
      } else {
        pinnedTrigger = trigger
        showTooltip(trigger)
      }
      return
    }
    if (!isInsideTooltip(event.target)) hideTooltip()
  })
  document.addEventListener('pointermove', () => {
    if (activeTrigger && tooltipElement().dataset.state === 'visible') positionTooltip(activeTrigger, tooltipElement())
  }, { passive: true })
  document.addEventListener('focusin', (event) => {
    if (isInsideTooltip(event.target)) {
      cancelHide()
      return
    }
    const trigger = findTrigger(event.target)
    if (trigger) showTooltip(trigger, 0)
  })
  document.addEventListener('focusout', (event) => {
    if (isInsideTooltip(event.target)) {
      if (isInsideTooltip(event.relatedTarget) || activeTrigger?.contains(event.relatedTarget as Node | null)) cancelHide()
      else deferHide()
      return
    }
    const trigger = findTrigger(event.target)
    if (trigger) {
      if (isInsideTooltip(event.relatedTarget)) cancelHide()
      else deferHide()
    }
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
