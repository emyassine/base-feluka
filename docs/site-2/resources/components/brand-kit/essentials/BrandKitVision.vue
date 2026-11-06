<template>
  <article class="brand-kit-vision brand-kit-overview__section brand-kit-overview__section--bordered">
    <div class="brand-kit-overview__column">
      <p class="brand-kit-overview__label">{{ props.label }}</p>
      <h2 :id="props.titleId" class="brand-kit-vision__title">
        <span class="silky-bbi" style="line-height: 1.15">
          <template v-for="(segment, index) in segments" :key="`${segment.text}-${index}`">
            <template v-if="segment.replacement">
              <span v-if="segment.replacement.color" :class="colorClass(segment.replacement.color)">{{ segment.text }}</span>
              <template v-else>{{ segment.text }}</template>
              <span
                v-if="segment.replacement.image"
                class="inline-image-preview"
                :data-preview-caption="segment.replacement.image.caption"
                tabindex="0"
                :aria-describedby="`brand-kit-vision-tooltip-${index}`"
              >
                <img :src="segment.replacement.image.src" :alt="segment.replacement.image.alt || segment.replacement.image.caption" loading="lazy" />
                <span :id="`brand-kit-vision-tooltip-${index}`" class="inline-image-preview__popover" role="tooltip">
                  <img :src="segment.replacement.image.src" alt="" loading="lazy" />
                  <span class="inline-image-preview__caption">{{ segment.replacement.image.caption }}</span>
                </span>
              </span>
            </template>
            <template v-else>{{ segment.text }}</template>
          </template>
        </span>
      </h2>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type VisionColor = 'primary' | 'teal' | 'green' | 'amber' | 'violet'

type VisionReplacement = {
  text: string
  color?: VisionColor
  image?: {
    src: string
    alt?: string
    caption: string
  }
}

type VisionSegment = {
  text: string
  replacement?: VisionReplacement
}

const props = withDefaults(defineProps<{
  label?: string
  titleId?: string
  text: string
  replacements?: VisionReplacement[]
}>(), {
  label: 'Our Vision',
  titleId: 'brand-kit-overview-title-0-0',
  replacements: () => [],
})

const colorClass = (color: VisionColor): string => {
  switch (color) {
    case 'primary': return 'primary-text'
    case 'teal': return 'teal-text is-visible'
    case 'green': return 'green-text is-visible'
    case 'amber': return 'amber-text is-visible'
    case 'violet': return 'violet-text is-visible'
  }
}

const segments = computed<VisionSegment[]>(() => {
  const replacements = props.replacements
    .filter((replacement) => replacement.text.length > 0)
    .slice()
    .sort((left, right) => right.text.length - left.text.length)

  if (!replacements.length) return [{ text: props.text }]

  const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const expression = new RegExp(
    `(?<![\\p{L}\\p{N}_])(?:${replacements.map(({ text }) => escapeRegExp(text)).join('|')})(?![\\p{L}\\p{N}_])`,
    'gu',
  )
  const replacementByText = new Map(replacements.map((replacement) => [replacement.text, replacement]))
  const result: VisionSegment[] = []
  let cursor = 0

  for (const match of props.text.matchAll(expression)) {
    const index = match.index ?? 0
    if (index > cursor) result.push({ text: props.text.slice(cursor, index) })
    result.push({ text: match[0], replacement: replacementByText.get(match[0]) })
    cursor = index + match[0].length
  }

  if (cursor < props.text.length) result.push({ text: props.text.slice(cursor) })
  return result
})
</script>

<style scoped>
.brand-kit-vision {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: center;
  box-sizing: border-box;
  min-height: 100vh;
  min-height: 100svh;
  margin: 0;
  padding: clamp(3.5rem, 9cqw, 8rem) 0;
  border-bottom: 1px solid var(--brand-kit-line);
}

.brand-kit-overview__column {
  min-width: 0;
}

.brand-kit-overview__label {
  margin: 0;
  color: var(--brand-kit-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.brand-kit-vision__title {
  margin: 0;
  padding-top: 0.7rem;
  font-size: clamp(2rem, 5.5cqw, 5rem);
  font-weight: 500;
  letter-spacing: -0.06em;
  line-height: 1.05;
  overflow-wrap: anywhere;
}

.brand-kit-vision :deep(.inline-image-preview) {
  position: relative;
  display: inline-flex;
  width: 1.7em;
  height: 1.15em;
  margin: 0 0.08em;
  vertical-align: -0.15em;
  cursor: pointer;
}

.brand-kit-vision :deep(.inline-image-preview > img) {
  width: 100%;
  height: 100%;
  border-radius: 0.18em;
  object-fit: cover;
}

.brand-kit-vision :deep(.inline-image-preview__popover) {
  position: absolute;
  z-index: 5;
  bottom: calc(100% + 0.65rem);
  left: 50%;
  display: grid;
  width: min(18rem, 75vw);
  gap: 0.45rem;
  padding: 0.55rem;
  font-family: var(--vp-font-family-base);
  font-size: 0.875rem;
  font-weight: 400 !important;
  font-style: normal !important;
  letter-spacing: normal;
  color: var(--vp-c-text-1);
  -webkit-text-stroke: 0 !important;
  text-shadow: none;
  border: 1px solid var(--brand-kit-line);
  border-radius: 0.65rem;
  background: var(--vp-c-bg);
  box-shadow: 0 0.8rem 2.5rem rgb(0 0 0 / 18%);
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 0.35rem);
  transition: opacity 160ms ease, transform 160ms ease;
}

.brand-kit-vision :deep(.inline-image-preview__popover > img) {
  display: block;
  width: 100%;
  max-height: 12rem;
  border-radius: 0.35rem;
  object-fit: cover;
}

.brand-kit-vision :deep(.inline-image-preview__caption) {
  color: inherit;
  font-family: inherit;
  font-size: 0.75rem;
  font-style: normal !important;
  font-weight: 400 !important;
  letter-spacing: normal;
  line-height: 1.4;
  -webkit-text-stroke: 0 !important;
  text-shadow: none;
}

.brand-kit-vision :deep(.inline-image-preview:hover .inline-image-preview__popover),
.brand-kit-vision :deep(.inline-image-preview:focus-visible .inline-image-preview__popover),
.brand-kit-vision :deep(.inline-image-preview:focus-within .inline-image-preview__popover) {
  opacity: 1;
  pointer-events: auto;
  transform: translate(-50%, 0);
}

@media (prefers-reduced-motion: reduce) {
  .brand-kit-vision :deep(.inline-image-preview__popover) {
    transition: none;
  }
}
</style>
