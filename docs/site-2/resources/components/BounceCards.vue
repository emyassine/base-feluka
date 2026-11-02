<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

interface BounceCardsProps {
  className?: string
  images?: string[]
  containerWidth?: number
  containerHeight?: number
  animationDelay?: number
  animationStagger?: number
  easeType?: string
  transformStyles?: string[]
  enableHover?: boolean
}

const props = withDefaults(defineProps<BounceCardsProps>(), {
  className: '',
  images: () => [],
  containerWidth: 400,
  containerHeight: 400,
  animationDelay: 0.5,
  animationStagger: 0.06,
  easeType: 'power2.out',
  transformStyles: () => [
    'rotate(10deg) translate(-170px)',
    'rotate(5deg) translate(-85px)',
    'rotate(-3deg)',
    'rotate(-10deg) translate(85px)',
    'rotate(2deg) translate(170px)',
  ],
  enableHover: false,
})

const cardRefs = ref<HTMLElement[]>([])
const animationFrames = new Map<HTMLElement, number>()
const containerStyle = () => ({
  width: `${props.containerWidth}px`,
  height: `${props.containerHeight}px`,
})

function baseTransform(index: number): string {
  return props.transformStyles[index] ?? 'none'
}

function getNoRotationTransform(transform: string): string {
  if (/rotate\([\s\S]*?\)/.test(transform)) {
    return transform.replace(/rotate\([\s\S]*?\)/, 'rotate(0deg)')
  }
  return transform === 'none' ? 'rotate(0deg)' : `${transform} rotate(0deg)`
}

function getPushedTransform(transform: string, offsetX: number): string {
  const translateRegex = /translate\(\s*(-?[\d.]+)(px)?\s*\)/
  const match = transform.match(translateRegex)
  if (match) {
    const currentX = Number.parseFloat(match[1])
    const unit = match[2] ?? 'px'
    return transform.replace(translateRegex, `translate(${currentX + offsetX}${unit})`)
  }
  return transform === 'none' ? `translate(${offsetX}px)` : `${transform} translate(${offsetX}px)`
}

function elasticOut(amplitude: number, period: number): (progress: number) => number {
  const safeAmplitude = Math.max(1, amplitude)
  const shift = safeAmplitude === 1
    ? period / 4
    : period * Math.asin(1 / safeAmplitude) / (2 * Math.PI)
  return (progress) => safeAmplitude * 2 ** (-10 * progress)
    * Math.sin((progress - shift) * (2 * Math.PI) / period) + 1
}

function backOut(overshoot: number): (progress: number) => number {
  return (progress) => {
    const shifted = progress - 1
    return 1 + shifted * shifted * ((overshoot + 1) * shifted + overshoot)
  }
}

function smoothInOut(progress: number): number {
  return progress < 0.5
    ? 2 * progress * progress
    : 1 - ((-2 * progress + 2) ** 2) / 2
}

function easeFunction(ease: string): (progress: number) => number {
  const elastic = ease.match(/elastic\.out\(\s*([\d.]+)?\s*(?:,\s*([\d.]+)\s*)?\)/i)
  if (elastic) return elasticOut(Number(elastic[1] ?? 1), Number(elastic[2] ?? 0.3))
  const back = ease.match(/back\.out\(\s*([\d.]+)?\s*\)/i)
  if (back) return backOut(Number(back[1] ?? 1.70158))
  const power = ease.match(/power([1-4])\.out/i)
  if (power) {
    const exponent = Number(power[1]) + 1
    return (progress) => 1 - (1 - progress) ** exponent
  }
  if (/power[1-4]\.in/i.test(ease)) {
    const exponent = Number(ease.match(/power([1-4])\.in/i)?.[1] ?? 1) + 1
    return (progress) => progress ** exponent
  }
  return (progress) => progress
}

function cancelTween(element: HTMLElement): void {
  const frame = animationFrames.get(element)
  if (frame !== undefined) cancelAnimationFrame(frame)
  animationFrames.delete(element)
}

function tween(
  element: HTMLElement,
  duration: number,
  delay: number,
  ease: (progress: number) => number,
  update: (progress: number) => void,
): void {
  cancelTween(element)
  let startTime: number | undefined
  const tick = (now: number) => {
    if (startTime === undefined) startTime = now + delay * 1000
    if (now < startTime) {
      animationFrames.set(element, requestAnimationFrame(tick))
      return
    }
    const progress = Math.min(1, (now - startTime) / (duration * 1000))
    update(ease(progress))
    if (progress < 1) animationFrames.set(element, requestAnimationFrame(tick))
    else animationFrames.delete(element)
  }
  animationFrames.set(element, requestAnimationFrame(tick))
}

function interpolateTransform(from: string, to: string, progress: number): string {
  const fromParts = [...from.matchAll(/([a-zA-Z0-9]+)\(([^)]*)\)/g)]
  const toParts = [...to.matchAll(/([a-zA-Z0-9]+)\(([^)]*)\)/g)]
  if (fromParts.length && fromParts.length === toParts.length
    && fromParts.every((part, index) => part[1] === toParts[index][1])) {
    let result = ''
    fromParts.forEach((part, index) => {
      const fromValues = part[2].match(/-?(?:\d+\.?\d*|\.\d+)(?:[a-z%]+)?/gi) ?? []
      const toValues = toParts[index][2].match(/-?(?:\d+\.?\d*|\.\d+)(?:[a-z%]+)?/gi) ?? []
      const fromNumbers = [...part[2].matchAll(/-?(?:\d+\.?\d*|\.\d+)(?:[a-z%]+)?/gi)]
      if (fromValues.length !== toValues.length || fromValues.length !== fromNumbers.length) return
      let valueIndex = 0
      const args = part[2].replace(/-?(?:\d+\.?\d*|\.\d+)(?:[a-z%]+)?/gi, () => {
        const start = Number.parseFloat(fromValues[valueIndex])
        const end = Number.parseFloat(toValues[valueIndex])
        const unit = fromValues[valueIndex].replace(/^-?(?:\d+\.?\d*|\.\d+)/, '')
        valueIndex += 1
        return `${start + (end - start) * progress}${unit}`
      })
      result += `${index ? ' ' : ''}${part[1]}(${args})`
    })
    if (result && fromParts.length === toParts.length) return result
  }

  const fromMatrix = new DOMMatrix(from === 'none' ? undefined : from)
  const toMatrix = new DOMMatrix(to === 'none' ? undefined : to)
  const values = ['a', 'b', 'c', 'd', 'e', 'f'] as const
  return `matrix(${values.map((key) => fromMatrix[key] + (toMatrix[key] - fromMatrix[key]) * progress).join(',')})`
}

function animateTransform(element: HTMLElement, target: string, delay = 0): void {
  const source = element.dataset.currentTransform ?? baseTransform(cardRefs.value.indexOf(element))
  tween(element, 0.28, delay, smoothInOut, (progress) => {
    const value = interpolateTransform(source, target, progress)
    element.style.transform = value
    element.dataset.currentTransform = value
  })
}

function pushSiblings(hoveredIndex: number): void {
  if (!props.enableHover) return

  cardRefs.value.forEach((card, index) => {
    if (!card) return
    if (index === hoveredIndex) {
      animateTransform(card, getNoRotationTransform(baseTransform(index)))
      return
    }

    const offsetX = index < hoveredIndex ? -180 : 180
    const distance = Math.abs(hoveredIndex - index)
    animateTransform(card, getPushedTransform(baseTransform(index), offsetX), distance * 0.008)
  })
}

function resetSiblings(): void {
  if (!props.enableHover) return

  cardRefs.value.forEach((card, index) => {
    if (!card) return
    animateTransform(card, baseTransform(index))
  })
}

function playEntranceAnimation(): void {
  const cards = cardRefs.value.filter(Boolean)
  const ease = easeFunction(props.easeType)
  cards.forEach((card, index) => {
    cancelTween(card)
    card.style.setProperty('scale', '0')
    card.style.opacity = '0'
    tween(card, 0.85, props.animationDelay + index * props.animationStagger, ease, (progress) => {
      card.style.setProperty('scale', String(progress))
      card.style.opacity = String(Math.min(1, progress * 1.2))
    })
  })
}

onMounted(playEntranceAnimation)

watch(
  () => [props.images, props.animationDelay, props.animationStagger, props.easeType],
  async () => {
    await nextTick()
    playEntranceAnimation()
  },
)

onUnmounted(() => {
  cardRefs.value.forEach(cancelTween)
})
</script>

<template>
  <div
    :class="['bounce-cards', props.className]"
    :style="containerStyle()"
  >
    <div
      v-for="(src, index) in props.images"
      :key="`${src}-${index}`"
      ref="cardRefs"
      :class="['bounce-cards__card', `bounce-cards__card--${index}`]"
      :style="{ transform: baseTransform(index) }"
      @mouseenter="pushSiblings(index)"
      @mouseleave="resetSiblings"
    >
      <img :src="src" :alt="`Card ${index + 1}`">
    </div>
  </div>
</template>

<style scoped>
.bounce-cards {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  margin-inline: auto;
}

.bounce-cards__card {
  position: absolute;
  width: 200px;
  aspect-ratio: 1;
  overflow: hidden;
  border: 8px solid #fff;
  border-radius: 30px;
  background: var(--vp-c-bg-soft);
  box-shadow: 0 4px 10px rgb(0 0 0 / 20%);
  transform-origin: center;
  will-change: transform, scale;
}

.bounce-cards__card img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 540px) {
  .bounce-cards__card { width: min(40vw, 170px); }
}

@media (prefers-reduced-motion: reduce) {
  .bounce-cards__card { will-change: auto; }
}
</style>
