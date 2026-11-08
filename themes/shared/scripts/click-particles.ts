const rand = (min: number, max: number): number => Math.random() * (max - min) + min

export function burst(x: number, y: number, count = 10): void {
  const element = document.createElement('div')
  element.className = 'click-burst'
  element.style.left = `${x}px`
  element.style.top = `${y}px`

  const ring = document.createElement('span')
  ring.className = 'click-ring'
  element.appendChild(ring)

  for (let index = 0; index < count; index += 1) {
    const particle = document.createElement('span')
    particle.className = 'click-particle'
    particle.style.setProperty('--angle', `${(360 / count) * index + rand(-12, 12)}deg`)
    particle.style.setProperty('--radius', `${rand(28, 54)}px`)
    particle.style.setProperty('--len', `${rand(6, 13)}px`)
    particle.style.setProperty('--dur', `${rand(0.4, 0.6)}s`)
    element.appendChild(particle)
  }

  document.body.appendChild(element)
  window.setTimeout(() => element.remove(), 700)
}

type ClickParticlesWindow = Window & {
  __feluqaClickParticlesPointerDown?: (event: PointerEvent) => void
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  const host = window as ClickParticlesWindow
  if (host.__feluqaClickParticlesPointerDown) {
    document.removeEventListener('pointerdown', host.__feluqaClickParticlesPointerDown)
  }

  const onPointerDown = (event: PointerEvent) => {
    if (!event.isPrimary || event.button !== 0) return
    burst(event.clientX, event.clientY)
  }

  host.__feluqaClickParticlesPointerDown = onPointerDown
  document.addEventListener('pointerdown', onPointerDown, { passive: true })
}
