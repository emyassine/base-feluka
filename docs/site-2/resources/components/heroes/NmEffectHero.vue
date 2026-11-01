<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import type { CSSProperties } from 'vue'
import Aurora from './Aurora.vue'
import PrismaticBurst from './PrismaticBurst.vue'
import ShapeGrid from './ShapeGrid.vue'
import Silk from './Silk.vue'

type Effect = 'aurora' | 'silk' | 'shape-grid' | 'prismatic-burst'

interface HeroButton {
  label: string
  href: string
  style?: 'primary' | 'secondary'
  external?: boolean
}

const props = withDefaults(defineProps<{
  effect: Effect
  title: string
  description: string
  buttons?: HeroButton[]
  titleStyle?: CSSProperties
  titleStyleLight?: CSSProperties
  titleStyleDark?: CSSProperties
  descriptionStyle?: CSSProperties
  descriptionStyleLight?: CSSProperties
  descriptionStyleDark?: CSSProperties
}>(), {
  buttons: () => [],
})

const { isDark } = useData()
const effectComponent = computed(() => ({
  aurora: Aurora,
  silk: Silk,
  'shape-grid': ShapeGrid,
  'prismatic-burst': PrismaticBurst,
}[props.effect]))
const effectProps = computed<Record<string, unknown>>(() => {
  switch (props.effect) {
    case 'aurora':
      return { colorStops: ['#3A29FF', '#FF94B4', '#FF3232'], blend: 0.5, amplitude: 1.0, speed: 0.5 }
    case 'silk':
      return { speed: 5, scale: 1, color: '#7B7481', noiseIntensity: 1.5, rotation: 0 }
    case 'shape-grid':
      return { speed: 0.5, squareSize: 40, direction: 'diagonal', borderColor: '#fff', hoverFillColor: '#222', shape: 'square', hoverTrailAmount: 5 }
    case 'prismatic-burst':
      return {
        animationType: 'rotate3d', intensity: 2, speed: 0.5, distort: 1.0, paused: false,
        offset: { x: 0, y: 0 }, hoverDampness: 0.25, rayCount: 24,
        mixBlendMode: 'lighten', colors: ['#ff007a', '#4d3dff', '#ffffff'],
      }
  }
})
const titleStyles = computed(() => ({
  ...props.titleStyle,
  ...(isDark.value ? props.titleStyleDark : props.titleStyleLight),
}))
const descriptionStyles = computed(() => ({
  ...props.descriptionStyle,
  ...(isDark.value ? props.descriptionStyleDark : props.descriptionStyleLight),
}))
</script>

<template>
  <section class="nm-effect-hero" :class="isDark ? 'nm-effect-hero--dark' : 'nm-effect-hero--light'">
    <div class="nm-effect-hero__background" aria-hidden="true">
      <component :is="effectComponent" v-bind="effectProps" />
    </div>
    <div class="nm-effect-hero__content">
      <h1 :style="titleStyles">{{ props.title }}</h1>
      <p :style="descriptionStyles">{{ props.description }}</p>
      <div v-if="props.buttons.length" class="nm-effect-hero__actions">
        <a
          v-for="(button, index) in props.buttons"
          :key="`${button.href}-${index}`"
          class="nm-effect-hero__button"
          :class="[
            `nm-effect-hero__button--${button.style || (index === 0 ? 'primary' : 'secondary')}`,
            { 'nm-effect-hero__button--dark': isDark },
          ]"
          :href="button.href"
          :target="button.external ? '_blank' : undefined"
          :rel="button.external ? 'noopener noreferrer' : undefined"
        >{{ button.label }}</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nm-effect-hero {
  position: relative;
  z-index: 0;
  display: grid;
  width: 100vw;
  height: 600px;
  place-items: center;
  margin: 0 calc(50% - 50vw) 3rem;
  overflow: hidden;
  background: #0c0c13;
}

.nm-effect-hero__background {
  position: absolute;
  inset: 0;
}

.nm-effect-hero__background :deep(*) {
  width: 100%;
  height: 100%;
}

.nm-effect-hero__content {
  position: relative;
  z-index: 1;
  width: min(100% - 2rem, 740px);
  text-align: center;
  pointer-events: none;
}

.nm-effect-hero--light,
.nm-effect-hero--dark { color: #fff; }

.nm-effect-hero h1 {
  margin: 0 auto;
  color: inherit;
  font-size: clamp(2.4rem, 6vw, 4.4rem);
  font-weight: 450;
  letter-spacing: -0.045em;
  line-height: 1.05;
}

.nm-effect-hero p {
  max-width: 650px;
  margin: 1.25rem auto 0;
  color: inherit;
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.55;
}

.nm-effect-hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
  pointer-events: auto;
}

.nm-effect-hero__button {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.25rem;
  border: 1px solid currentColor;
  border-radius: 999px;
  color: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
}

.nm-effect-hero__button--primary { border-color: #1749dc; background: #1749dc; color: #fff; }
.nm-effect-hero__button--secondary { background: rgb(255 255 255 / 84%); color: #111827; }
.nm-effect-hero__button--secondary.nm-effect-hero__button--dark { background: rgb(13 24 43 / 78%); color: #fff; }

@media (max-width: 640px) {
  .nm-effect-hero { height: 34rem; margin-top: -20px; }
}
</style>
