<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import type { CSSProperties } from 'vue'
type Effect = 'aurora' | 'silk' | 'shape-grid' | 'prismatic-burst'

interface HeroButton {
  label: string
  href: string
  style?: 'primary' | 'secondary'
  external?: boolean
  icon?: 'whatsapp'
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
  aurora: 'Aurora',
  silk: 'Silk',
  'shape-grid': 'ShapeGrid',
  'prismatic-burst': 'PrismaticBurst',
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
const isSecondaryButton = (button: HeroButton, index: number) =>
  (button.style ?? (index === 0 ? 'primary' : 'secondary')) === 'secondary'
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
        <FeluqaButton
          v-for="(button, index) in props.buttons"
          :key="`${button.href}-${index}`"
          tag="a"
          :href="button.href"
          size="md"
          :color="isSecondaryButton(button, index) ? 'gray' : 'primary'"
          :outlined="isSecondaryButton(button, index)"
          :class="isSecondaryButton(button, index) ? 'nm-effect-hero__button--secondary' : 'nm-effect-hero__button--primary'"
          :target="button.external ? '_blank' : undefined"
          :rel="button.external ? 'noopener noreferrer' : undefined"
        >
          <template v-if="button.icon === 'whatsapp'" #icon>
            <svg class="nm-effect-hero__whatsapp-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M20.1 11.8a8.1 8.1 0 0 1-12 7.1L4 20l1.1-4a8.1 8.1 0 1 1 15-4.2Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M9 8.5c.2-.5.5-.5.8-.5h.4c.2 0 .3.1.4.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.2.2-.2.4 0 .6.5.8 1.1 1.4 2 1.8.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.5.7c.2.1.3.2.3.4 0 .4-.2 1.1-.7 1.4-.5.4-1.1.6-1.8.4-1-.2-2.2-.8-3.3-1.8-1.2-1.1-2-2.4-2.2-3.4-.2-.8.1-1.4.6-1.8Z" fill="currentColor" />
            </svg>
          </template>
          {{ button.label }}
        </FeluqaButton>
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
  min-height: clamp(34rem, 70svh, 46rem);
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
  width: min(100% - 2rem, 820px);
  padding: 3.5rem 0;
  text-align: center;
  pointer-events: none;
}

.nm-effect-hero--light,
.nm-effect-hero--dark { color: #fff; }

.nm-effect-hero h1 {
  margin: 0 auto;
  color: inherit;
  max-width: 760px;
  font-size: clamp(2rem, 3.6vw, 3.25rem);
  font-weight: 500;
  letter-spacing: -0.04em;
  line-height: 1.08;
}

.nm-effect-hero p {
  max-width: 590px;
  margin: 1rem auto 0;
  color: inherit;
  font-size: 1rem;
  line-height: 1.6;
}

.nm-effect-hero__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.625rem;
  margin-top: 1.5rem;
  pointer-events: auto;
}

.nm-effect-hero__actions :deep(.feluqa-button) {
  min-height: 2.25rem;
  padding: 0.45rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 550;
  box-shadow: none;
}

.nm-effect-hero__actions :deep(.nm-effect-hero__whatsapp-icon) {
  width: 1rem;
  height: 1rem;
  flex: none;
}

.nm-effect-hero__actions :deep(.feluqa-button:hover:not(:disabled):not(.is-disabled)) {
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.18);
}

.nm-effect-hero__actions :deep(.nm-effect-hero__button--primary) {
  border-color: #fff;
  background: #fff;
  color: #111827 !important;
}

.nm-effect-hero__actions :deep(.nm-effect-hero__button--primary:hover) {
  background: #f1f5f9;
}

.nm-effect-hero__actions :deep(.nm-effect-hero__button--secondary) {
  border-color: rgb(255 255 255 / 0.42);
  background: rgb(15 23 42 / 0.28);
  color: #fff !important;
  backdrop-filter: blur(8px);
}

.nm-effect-hero__actions :deep(.nm-effect-hero__button--secondary:hover) {
  border-color: rgb(255 255 255 / 0.68);
  background: rgb(255 255 255 / 0.12);
}

@media (max-width: 640px) {
  .nm-effect-hero { min-height: 34rem; margin-top: -20px; }
  .nm-effect-hero__content { padding: 2.5rem 0; }
  .nm-effect-hero h1 { font-size: clamp(2rem, 8vw, 2.75rem); }
  .nm-effect-hero__actions { gap: 0.5rem; margin-top: 1.5rem; }
}
</style>
