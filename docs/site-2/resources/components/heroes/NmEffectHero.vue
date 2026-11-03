<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import type { CSSProperties } from 'vue'
type EffectName = 'aurora' | 'silk' | 'shape-grid' | 'prismatic-burst'
type Effect = readonly [EffectName, { inject?: Record<string, unknown> }?]

interface TextContent {
  text: string
  color?: string | ModeColor
}

interface ModeColor {
  light?: string
  dark?: string
}

interface LightBackground {
  start: string
  middle: string
  end: string
  accent: string
}

interface HeroBackground {
  light?: LightBackground
  dark?: { preset?: 'numerimondes-brand-silk' }
}

interface HeroButton {
  label: string
  href: string
  color?: 'primary' | 'gray' | 'info' | 'success' | 'warning' | 'danger' | 'dark'
  external?: boolean
  icon?: 'whatsapp'
}

const props = withDefaults(defineProps<{
  effect: Effect
  background?: HeroBackground
  eyebrow?: string | TextContent
  fullBleed?: boolean
  heroStyle?: CSSProperties
  title: string | TextContent
  description: string | TextContent
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
const lightBackgroundStyle = computed<CSSProperties | undefined>(() => {
  if (isDark.value) return undefined
  const palette = props.background?.light ?? {
    start: '#f6f8ff',
    middle: '#eaf0ff',
    end: '#e3edfb',
    accent: '#3977c8',
  }
  return {
    '--nm-hero-light-start': palette.start,
    '--nm-hero-light-middle': palette.middle,
    '--nm-hero-light-end': palette.end,
    '--nm-hero-light-accent': palette.accent,
  }
})
const backgroundPreset = computed(() => isDark.value ? props.background?.dark?.preset : undefined)
const eyebrowText = computed(() => typeof props.eyebrow === 'string' ? props.eyebrow : props.eyebrow?.text)
const titleText = computed(() => typeof props.title === 'string' ? props.title : props.title.text)
const descriptionText = computed(() => typeof props.description === 'string' ? props.description : props.description.text)
const resolveColor = (color?: string | ModeColor) =>
  typeof color === 'string' ? color : color?.[isDark.value ? 'dark' : 'light']
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
  const { lightColor, darkColor, lightNoise, lightSpeed, ...injected } = props.effect[1]?.inject ?? {}
  const merged = { ...defaults, ...injected }

  if (selectedEffect.value !== 'silk') return merged

  const modeColor = isDark.value ? (darkColor ?? merged.color) : (lightColor ?? '#d5e2fa')

  return {
    ...merged,
    ...(modeColor === undefined ? {} : { color: modeColor }),
    ...(!isDark.value && lightNoise !== undefined ? { noiseIntensity: lightNoise } : {}),
    ...(!isDark.value && lightSpeed !== undefined ? { speed: lightSpeed } : {}),
  }
})
const titleStyles = computed(() => ({
  ...props.titleStyle,
  ...(isDark.value ? props.titleStyleDark : props.titleStyleLight),
  ...(typeof props.title === 'string' || props.title.color === undefined ? {} : { color: resolveColor(props.title.color) }),
}))
const descriptionStyles = computed(() => ({
  ...props.descriptionStyle,
  ...(isDark.value ? props.descriptionStyleDark : props.descriptionStyleLight),
  ...(typeof props.description === 'string' || props.description.color === undefined ? {} : { color: resolveColor(props.description.color) }),
}))
</script>

<template>
<div class="block h-6 md:hidden" aria-hidden="true"></div>
  <section class="nm-effect-hero" :class="[isDark ? 'nm-effect-hero--dark' : 'nm-effect-hero--light', `nm-effect-hero--${selectedEffect}`, backgroundPreset ? `nm-effect-hero--background-${backgroundPreset}` : '', { 'nm-effect-hero--contained': !props.fullBleed, 'nm-effect-hero--has-dock': Boolean($slots.dock) }]" :style="[props.heroStyle, lightBackgroundStyle]">
    <div class="nm-effect-hero__background" aria-hidden="true">
      <component :is="effectComponent" v-bind="effectProps" />
      <div v-if="$slots.background" class="nm-effect-hero__background-slot">
        <slot name="background" />
      </div>
    </div>
    <div class="nm-effect-hero__content">
      <p v-if="eyebrowText" class="nm-effect-hero__eyebrow" :style="typeof props.eyebrow === 'string' ? undefined : { color: resolveColor(props.eyebrow.color) }" v-html="eyebrowText" />
      <h1 :style="titleStyles" v-html="titleText" />
      <p :style="descriptionStyles" v-html="descriptionText" />
      <div v-if="props.buttons.length" class="nm-effect-hero__actions">
        <FeluqaButton
          v-for="(button, index) in props.buttons"
          :key="`${button.href}-${index}`"
          tag="a"
          :href="button.href"
          size="md"
          :color="button.color ?? (index === 0 ? 'primary' : 'gray')"
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
      <div v-if="$slots.content" class="nm-effect-hero__content-slot">
        <slot name="content" />
      </div>
    </div>
    <div v-if="$slots.dock" class="nm-effect-hero__dock">
      <slot name="dock" />
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
  border-radius: var(--radius-lg);
  background: #0c0c13;
}

.nm-effect-hero--contained {
  width: 100%;
  margin-inline: 0;
}

.nm-effect-hero--has-dock {
  padding-bottom: clamp(5rem, 9svh, 7rem);
}

.nm-effect-hero__background {
  position: absolute;
  inset: 0;
}

.nm-effect-hero__background :deep(*) {
  width: 100%;
  height: 100%;
}

.nm-effect-hero__background-slot {
  position: absolute;
  inset: 0;
}

.nm-effect-hero__content {
  position: relative;
  z-index: 1;
  width: min(100% - 2rem, 820px);
  padding: 3.5rem 0;
  text-align: center;
  pointer-events: none;
}

.nm-effect-hero__content-slot {
  margin-top: 1.5rem;
  pointer-events: auto;
}

.nm-effect-hero__dock {
  position: absolute;
  z-index: 1;
  inset-inline: 0;
  bottom: clamp(1rem, 4vw, 2.5rem);
  display: flex;
  justify-content: center;
  padding-inline: 1rem;
  pointer-events: auto;
}

.nm-effect-hero--light { color: #172033; }
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
  color: #e2e8f0;
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
  border-radius: var(--radius-md);
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

/* Light theme: pearl surface with recognizable, saturated Silk waves. */
.nm-effect-hero--light {
  isolation: isolate;
  background:
    radial-gradient(ellipse at 14% 20%, color-mix(in srgb, var(--nm-hero-light-accent) 20%, transparent), transparent 36%),
    radial-gradient(ellipse at 88% 24%, color-mix(in srgb, var(--nm-hero-light-accent) 30%, transparent), transparent 40%),
    radial-gradient(ellipse at 52% 115%, color-mix(in srgb, var(--nm-hero-light-accent) 18%, transparent), transparent 46%),
    linear-gradient(128deg, var(--nm-hero-light-start), var(--nm-hero-light-middle) 48%, var(--nm-hero-light-end));
}

.nm-effect-hero--dark.nm-effect-hero--background-numerimondes-brand-silk {
  background: #0c0c13;
}

.nm-effect-hero--light .nm-effect-hero__eyebrow,
.nm-effect-hero--light p {
  color: #e2e8f0;
}

.nm-effect-hero--light:not(.nm-effect-hero--silk) .nm-effect-hero__background {
  opacity: 0.5;
}

@media (max-width: 640px) {
  .nm-effect-hero { min-height: 34rem; margin-top: -20px; }
  .nm-effect-hero--contained { margin-top: 0; }
  .nm-effect-hero__content { padding: 2.5rem 0; }
  .nm-effect-hero h1 { font-size: clamp(2rem, 8vw, 2.75rem); }
  .nm-effect-hero__actions { gap: 0.5rem; margin-top: 1.5rem; }
}
</style>
