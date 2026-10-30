<template>
  <div
    ref="card"
    class="spotlight-card"
    :class="className"
    @pointermove="handlePointerMove"
    @pointerenter="opacity = 1"
    @pointerleave="opacity = 0"
  >
    <div
      class="spotlight-card__glow"
      aria-hidden="true"
      :style="{
        opacity,
        background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 78%)`,
      }"
    />
    <div class="spotlight-card__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Position {
  x: number
  y: number
}

interface SpotlightCardProps {
  className?: string
  spotlightColor?: string
}

const { className = '', spotlightColor = 'rgba(74, 222, 128, 0.13)' } = defineProps<SpotlightCardProps>()
const card = ref<HTMLDivElement | null>(null)
const position = ref<Position>({ x: 0, y: 0 })
const opacity = ref(0)

function handlePointerMove(event: PointerEvent): void {
  if (!card.value) return
  const rect = card.value.getBoundingClientRect()
  position.value = { x: event.clientX - rect.left, y: event.clientY - rect.top }
}
</script>
