<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import type { CSSProperties } from 'vue'
type EffectName = 'aurora' | 'silk' | 'shape-grid' | 'prismatic-burst'
type Effect = readonly [EffectName, { inject?: Record<string, unknown> }?]

interface HeroButton {
  label: string
  href: string
  style?: 'primary' | 'secondary'
  external?: boolean
  icon?: 'whatsapp'
}

const props = withDefaults(defineProps<{
  effect: Effect
  eyebrow?: string
  fullBleed?: boolean
  heroStyle?: CSSProperties
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
  fullBleed: true,
})

const { isDark } = useData()
const selectedEffect = computed(() => props.effect[0])
const effectComponent = computed(() => ({
  aurora: 'Aurora',
  silk: 'Silk',
  'shape-grid': 'ShapeGrid',
  'prismatic-burst': 'PrismaticBurst',
}[selectedEffect.value]))
const effectProps = computed<Record<string, unknown>>(() => {
  let defaults: Record<string, unknown> = {}
  switch (selectedEffect.value) {
    case 'aurora':
      defaults = { colorStops: ['#3A29FF', '#FF94B4', '#FF3232'], blend: 0.5, amplitude: 1.0, speed: 0.5 }
      break
    case 'silk':
      defaults = { speed: 5, scale: 1, color: '#7B7481', noiseIntensity: 1.5, rotation: 0 }
      break
    case 'shape-grid':
      defaults = { speed: 0.5, squareSize: 40, direction: 'diagonal', borderColor: '#fff', hoverFillColor: '#222', shape: 'square', hoverTrailAmount: 5 }
      break
    case 'prismatic-burst':
      defaults = {
        animationType: 'rotate3d', intensity: 2, speed: 0.5, distort: 1.0, paused: false,
        offset: { x: 0, y: 0 }, hoverDampness: 0.25, rayCount: 24,
        mixBlendMode: 'lighten', colors: ['#ff007a', '#4d3dff', '#ffffff'],
      }
      break
  }
  const { colorLight, noiseIntensityLight, ...injected } = (props.effect[1]?.inject ?? {}) as Record<string, unknown>
  const merged = { ...defaults, ...injected }

  if (isDark.value || selectedEffect.value !== 'silk') return merged

  return {
    ...merged,
    ...(colorLight === undefined ? {} : { color: colorLight }),
    ...(noiseIntensityLight === undefined ? {} : { noiseIntensity: noiseIntensityLight }),
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
<div class="block h-6 md:hidden" aria-hidden="true"></div>
  <section class="nm-effect-hero" :class="[isDark ? 'nm-effect-hero--dark' : 'nm-effect-hero--light', `nm-effect-hero--${selectedEffect}`, { 'nm-effect-hero--contained': !props.fullBleed }]" :style="props.heroStyle">
    <div class="nm-effect-hero__background" aria-hidden="true">
      <component :is="effectComponent" :key="isDark ? 'dark' : 'light'" v-bind="effectProps" />
    </div>
    <div class="nm-effect-hero__content">
      <p v-if="props.eyebrow" class="nm-effect-hero__eyebrow">{{ props.eyebrow }}</p>
      <h1 :style="titleStyles">{{ props.title }}</h1>
      <p :style="descriptionStyles" v-html="props.description" />
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

.nm-effect-hero--contained {
  width: 100%;
  margin-inline: 0;
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

.nm-effect-hero .nm-effect-hero__eyebrow {
  margin: 0 auto 1rem;
  color: rgb(255 255 255 / 0.82);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  line-height: 1.5;
  text-transform: uppercase;
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

/* Light theme: pearl surface with recognizable, saturated Silk waves. */
.nm-effect-hero--light {
  isolation: isolate;
  background: var(--nm-effect-hero-light-background, transparent);
}

.nm-effect-hero--light.nm-effect-hero--silk .nm-effect-hero__background {
  opacity: 0.58;
  mix-blend-mode: multiply;
  filter: saturate(1.7) contrast(1.05);
}

.nm-effect-hero--light:not(.nm-effect-hero--silk) .nm-effect-hero__background {
  opacity: 0.5;
}

.nm-effect-hero--light .nm-effect-hero__eyebrow {
  color: var(--nm-effect-hero-light-eyebrow-color, inherit);
}

.nm-effect-hero--light :deep(.nm-effect-hero__button--primary) {
  border-color: var(--nm-effect-hero-light-primary-border, currentColor);
  background: var(--nm-effect-hero-light-primary-background, transparent);
  color: var(--nm-effect-hero-light-primary-color, inherit) !important;
}

.nm-effect-hero--light :deep(.nm-effect-hero__button--primary:hover) {
  background: var(--nm-effect-hero-light-primary-hover-background, var(--nm-effect-hero-light-primary-background, transparent));
}

.nm-effect-hero--light :deep(.nm-effect-hero__button--secondary) {
  border-color: var(--nm-effect-hero-light-secondary-border, currentColor);
  background: var(--nm-effect-hero-light-secondary-background, transparent);
  color: var(--nm-effect-hero-light-secondary-color, inherit) !important;
  backdrop-filter: var(--nm-effect-hero-light-secondary-backdrop-filter, none);
}

.nm-effect-hero--light :deep(.nm-effect-hero__button--secondary:hover) {
  border-color: var(--nm-effect-hero-light-secondary-hover-border, var(--nm-effect-hero-light-secondary-border, currentColor));
  background: var(--nm-effect-hero-light-secondary-hover-background, var(--nm-effect-hero-light-secondary-background, transparent));
}

@media (max-width: 640px) {
  .nm-effect-hero { min-height: 34rem; margin-top: -20px; }
  .nm-effect-hero--contained { margin-top: 0; }
  .nm-effect-hero__content { padding: 2.5rem 0; }
  .nm-effect-hero h1 { font-size: clamp(2rem, 8vw, 2.75rem); }
  .nm-effect-hero__actions { gap: 0.5rem; margin-top: 1.5rem; }
}
</style>
