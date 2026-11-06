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
              <img
                v-if="segment.replacement.image"
                class="brand-kit-vision__inline-image"
                :src="segment.replacement.image.src"
                :alt="segment.replacement.image.alt || segment.replacement.image.caption"
                :x-tooltip="JSON.stringify({ image: segment.replacement.image.src, text: segment.replacement.image.caption })"
                loading="lazy"
              />
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

.brand-kit-vision__inline-image {
  display: inline-block;
  width: 1.7em;
  height: 1.15em;
  margin: 0 0.08em;
  vertical-align: -0.15em;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.18em;
  object-fit: cover;
  cursor: help;
}

</style>
