const SVG_NS = 'http://www.w3.org/2000/svg'
const EFFECT_SIZE = 60
const STROKE_WIDTH = 2
const DURATION = 0.4
const ANGLES = [45, 80, 115, 150]

type ClickParticlesWindow = Window & {
  __feluqaClickParticlesPointerDown?: (event: PointerEvent) => void
  __feluqaClickParticlesClick?: (event: MouseEvent) => void
}

function burst(x: number, y: number): void {
  const svg = document.createElementNS(SVG_NS, 'svg')
  const center = EFFECT_SIZE / 2
  const color = getComputedStyle(document.documentElement)
    .getPropertyValue('--text-primary')
    .trim() || 'rgb(0, 0, 0)'

  svg.style.cssText = `
    position: fixed;
    left: ${x - center}px;
    top: ${y - center}px;
    width: ${EFFECT_SIZE}px;
    height: ${EFFECT_SIZE}px;
    overflow: visible;
    pointer-events: none;
    z-index: 9999;
  `

  for (const degrees of ANGLES) {
    const radians = degrees * (Math.PI / 180)
    const x1 = center + EFFECT_SIZE * 0.1 * Math.cos(radians)
    const y1 = center - EFFECT_SIZE * 0.1 * Math.sin(radians)
    const x2 = center + EFFECT_SIZE * 0.25 * Math.cos(radians)
    const y2 = center - EFFECT_SIZE * 0.25 * Math.sin(radians)
    const tx = (EFFECT_SIZE / 4) * Math.cos(radians)
    const ty = -(EFFECT_SIZE / 4) * Math.sin(radians)
    const lineLength = Math.hypot(x2 - x1, y2 - y1)

    const line = document.createElementNS(SVG_NS, 'line')
    line.setAttribute('x1', String(x1))
    line.setAttribute('y1', String(y1))
    line.setAttribute('x2', String(x2))
    line.setAttribute('y2', String(y2))
    line.setAttribute('stroke', color)
    line.setAttribute('stroke-width', String(STROKE_WIDTH))
    line.setAttribute('stroke-linecap', 'square')

    const retract = document.createElementNS(SVG_NS, 'animate')
    retract.setAttribute('attributeName', 'stroke-dashoffset')
    retract.setAttribute('from', '0')
    retract.setAttribute('to', String(lineLength))
    retract.setAttribute('dur', `${DURATION}s`)
    retract.setAttribute('fill', 'freeze')

    const translate = document.createElementNS(SVG_NS, 'animateTransform')
    translate.setAttribute('attributeName', 'transform')
    translate.setAttribute('type', 'translate')
    translate.setAttribute('from', '0 0')
    translate.setAttribute('to', `${tx} ${ty}`)
    translate.setAttribute('dur', `${DURATION}s`)
    translate.setAttribute('fill', 'freeze')

    const thin = document.createElementNS(SVG_NS, 'animate')
    thin.setAttribute('attributeName', 'stroke-width')
    thin.setAttribute('from', String(STROKE_WIDTH))
    thin.setAttribute('to', '0')
    thin.setAttribute('begin', `${DURATION * 0.6}s`)
    thin.setAttribute('dur', `${DURATION * 0.4}s`)
    thin.setAttribute('fill', 'freeze')

    line.setAttribute('stroke-dasharray', String(lineLength))
    line.setAttribute('stroke-dashoffset', '0')
    line.append(retract, translate, thin)
    svg.appendChild(line)
  }

  document.body.appendChild(svg)
  window.setTimeout(() => svg.remove(), DURATION * 1000 + 80)
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  const host = window as ClickParticlesWindow
  if (host.__feluqaClickParticlesPointerDown) {
    document.removeEventListener('pointerdown', host.__feluqaClickParticlesPointerDown)
    delete host.__feluqaClickParticlesPointerDown
  }
  if (host.__feluqaClickParticlesClick) {
    document.removeEventListener('click', host.__feluqaClickParticlesClick)
  }

  const onClick = (event: MouseEvent) => {
    if (event.detail === 0) return
    burst(event.clientX, event.clientY)
  }

  host.__feluqaClickParticlesClick = onClick
  document.addEventListener('click', onClick)
}
