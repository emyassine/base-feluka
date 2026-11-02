<script setup lang="ts">
import { gsap } from 'gsap'
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
  easeType: 'elastic.out(1, 0.8)',
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

function pushSiblings(hoveredIndex: number): void {
  if (!props.enableHover) return

  cardRefs.value.forEach((card, index) => {
    if (!card) return
    gsap.killTweensOf(card)
    if (index === hoveredIndex) {
      gsap.to(card, {
        transform: getNoRotationTransform(baseTransform(index)),
        duration: 0.4,
        ease: 'back.out(1.4)',
        overwrite: 'auto',
      })
      return
    }

    const offsetX = index < hoveredIndex ? -160 : 160
    const distance = Math.abs(hoveredIndex - index)
    gsap.to(card, {
      transform: getPushedTransform(baseTransform(index), offsetX),
      duration: 0.4,
      ease: 'back.out(1.4)',
      delay: distance * 0.05,
      overwrite: 'auto',
    })
  })
}

function resetSiblings(): void {
  if (!props.enableHover) return

  cardRefs.value.forEach((card, index) => {
    if (!card) return
    gsap.killTweensOf(card)
    gsap.to(card, {
      transform: baseTransform(index),
      duration: 0.4,
      ease: 'back.out(1.4)',
      overwrite: 'auto',
    })
  })
}

function playEntranceAnimation(): void {
  const cards = cardRefs.value.filter(Boolean)
  if (!cards.length) return

  gsap.killTweensOf(cards)
  gsap.fromTo(cards, { scale: 0 }, {
    scale: 1,
    stagger: props.animationStagger,
    ease: props.easeType,
    delay: props.animationDelay,
    overwrite: 'auto',
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
  gsap.killTweensOf(cardRefs.value)
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
  will-change: transform;
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
