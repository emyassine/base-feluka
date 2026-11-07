const CLICK_PARTICLE_CLASSNAME = 'click-particle'
const CLICK_PARTICLE_COUNT = 6
const CLICK_PARTICLE_RADIUS_PX = 25

const spawnClickParticles = (event: MouseEvent): void => {
  for (let index = 0; index < CLICK_PARTICLE_COUNT; index += 1) {
    const angle = (index * 360) / CLICK_PARTICLE_COUNT
    const particle = document.createElement('div')
    particle.className = CLICK_PARTICLE_CLASSNAME
    particle.style.left = `${event.clientX}px`
    particle.style.top = `${event.clientY}px`
    particle.style.setProperty('--angle', `${angle}deg`)
    particle.style.setProperty('--radius', `${CLICK_PARTICLE_RADIUS_PX}px`)
    particle.addEventListener('animationend', () => { particle.remove() })
    document.body.appendChild(particle)
  }
}

const startClickParticles = (): void => {
  document.addEventListener('click', spawnClickParticles)
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startClickParticles, { once: true })
  } else {
    startClickParticles()
  }
}
