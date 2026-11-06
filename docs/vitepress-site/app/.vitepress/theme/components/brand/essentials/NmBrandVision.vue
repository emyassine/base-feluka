<template>
  <article class="overview-section overview-section--bordered scroll-reveal">
    <div class="overview-column">
      <p class="overview-label">{{ props.label }}</p>
      <h2 :id="props.titleId">
        <span class="silky-bbi" style="line-height: 1.15" v-html="formattedText"></span>
      </h2>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type VisionColor = 'primary' | 'teal' | 'green' | 'amber' | 'violet'

type VisionReplacement = {
  text?: string
  texts?: string[]
  color?: VisionColor
  image?: {
    src: string
    alt?: string
    caption: string
  }
}

const props = withDefaults(defineProps<{
  label?: string
  titleId?: string
  text: string
  replacements?: VisionReplacement[]
}>(), {
  label: 'Our Vision',
  titleId: 'nm-brand-overview-title-0-0',
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

const formattedText = computed(() => {
  const replacements = props.replacements
    .flatMap((replacement) => {
      const texts = [
        ...(replacement.text ? [replacement.text] : []),
        ...(replacement.texts ?? []),
      ].filter((text) => text.length > 0)

      return texts.map((text) => ({ ...replacement, text }))
    })
    .slice()
    .sort((left, right) => right.text.length - left.text.length)

  if (!replacements.length) return props.text

  const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const expression = new RegExp(
    `(?<![\\p{L}\\p{N}_])(?:${replacements.map(({ text }) => escapeRegExp(text)).join('|')})(?![\\p{L}\\p{N}_])`,
    'gu',
  )
  const replacementByText = new Map(replacements.map((replacement) => [replacement.text, replacement]))
  const escapeAttribute = (value: string): string => value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const formatText = (text: string): string => text.replace(expression, (matched) => {
    const replacement = replacementByText.get(matched)
    const escapedMatch = escapeAttribute(matched)
    const color = replacement?.color ? `<span class="${colorClass(replacement.color)}">${escapedMatch}</span>` : escapedMatch
    if (!replacement?.image) return color

    const image = replacement.image
    const tooltip = escapeAttribute(JSON.stringify({ image: image.src, text: image.caption }))
    return `${color}<img class="nm-brand-vision__inline-image" src="${escapeAttribute(image.src)}" alt="${escapeAttribute(image.alt || image.caption)}" x-tooltip="${tooltip}" tabindex="0" loading="lazy">`
  })

  return props.text
    .split(/(<[^>]*>)/g)
    .map((part) => part.startsWith('<') && part.endsWith('>') ? part : formatText(part))
    .join('')
})
</script>

<style scoped>
:deep(.nm-brand-vision__inline-image) {
  display: inline-block;
  width: 1.7em;
  height: 1.15em;
  margin: 0 0.08em 0 0.24em;
  vertical-align: -0.15em;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.18em;
  object-fit: cover;
  cursor: help;
}

</style>
