<template>
  <section
    :id="id"
    class="nm-brand-logo-section"
    :class="[
      `nm-brand-logo-section--${layout}`,
      `nm-brand-logo-section--image-${imageAnimation}`,
      { 'nm-brand-logo-section--bordered': showBorder },
    ]"
    :aria-labelledby="`${id}-title`"
  >
    <header class="nm-brand-logo-section__header">
      <p v-if="eyebrow" class="nm-brand-logo-section__eyebrow" v-html="eyebrow"></p>
      <h2 :id="`${id}-title`" :style="titleStyle" :class="titleClass" v-html="title"></h2>
      <p class="nm-brand-logo-section__description" :style="descriptionStyle" :class="descriptionClass" v-html="description"></p>
    </header>

    <div class="nm-brand-logo-section__images">
      <figure
        v-for="(image, index) in images"
        :key="`${image.src}-${index}`"
        class="nm-brand-logo-section__image"
        :class="{ 'nm-brand-logo-section__image--free': image.dimensions === 'free' }"
        :style="[
          image.style,
          imagePadding ? { padding: imagePadding } : undefined,
          image.dimensions ? { aspectRatio: aspectRatio(image.dimensions) } : undefined,
        ]"
      >
        <img :src="image.src" :alt="image.alt" loading="lazy" />
      </figure>
    </div>
  </section>
</template>

<script setup lang="ts">
type ImageDimensions = 'square' | 'free' | 'rectangle' | `${number}:${number}` | `${number} / ${number}`

function aspectRatio(dimensions?: ImageDimensions) {
  if (dimensions === 'square') return '1 / 1'
  if (dimensions === 'rectangle') return '16 / 9'
  if (dimensions === 'free') return 'auto'
  return dimensions?.replace(':', ' / ')
}

withDefaults(defineProps<{
  id: string
  eyebrow?: string
  title: string
  titleStyle?: string
  titleClass?: string
  description: string
  descriptionStyle?: string
  descriptionClass?: string
  images: Array<{
    src: string
    alt: string
    style?: string | Record<string, string | number>
    dimensions?: ImageDimensions
  }>
  layout?: 'stacked' | 'side' | 'grid'
  imagePadding?: string
  imageAnimation?: 'scroll' | 'none'
  showBorder?: boolean
}>(), {
  layout: 'stacked',
  imageAnimation: 'scroll',
  showBorder: true,
})
</script>

<style scoped>
.nm-brand-logo-section {
  display: grid;
  gap: clamp(1.5rem, 4cqw, 3rem);
  margin: 0;
  padding: clamp(3.5rem, 9cqw, 8rem) 0;
}

.nm-brand-logo-section--bordered {
  border-bottom: 1px solid var(--nm-brand-line);
}

.nm-brand-logo-section__header {
  display: grid;
  gap: 1rem;
  max-width: 68ch;
}

.nm-brand-logo-section__eyebrow {
  margin: 0;
  color: var(--nm-brand-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.nm-brand-logo-section h2 {
  margin: 0;
  font-size: clamp(2rem, 5.5cqw, 5rem);
  font-weight: 500;
  letter-spacing: -0.06em;
  line-height: 0.95;
}

.nm-brand-logo-section__description {
  max-width: 62ch;
  margin: 0;
  color: var(--nm-brand-muted);
  font-size: clamp(1rem, 1.4cqw, 1.2rem);
  line-height: 1.7;
}

.nm-brand-logo-section__images {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: clamp(0.75rem, 2cqw, 1.5rem);
  min-width: 0;
  margin: 0;
  padding: 0;
}

.nm-brand-logo-section__image {
  box-sizing: border-box;
  display: grid;
  place-items: center;
  min-width: 0;
  aspect-ratio: 1.55;
  margin: 0;
  padding: 0;
  border: 1px solid var(--nm-brand-line);
  border-radius: 0.75rem;
  background: transparent;
  box-shadow: none;
}

.nm-brand-logo-section__image--free {
  height: auto;
}

@supports (animation-timeline: view()) {
  .nm-brand-logo-section--image-scroll .nm-brand-logo-section__image {
    animation: nm-brand-image-reveal linear both;
    animation-duration: auto;
    animation-timeline: view(block);
    animation-range: cover 0% cover 50%;
  }
}

.nm-brand-logo-section__image img {
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  object-fit: contain;
}

.nm-brand-logo-section__image--free img {
  height: auto;
}

@keyframes nm-brand-image-reveal {
  from {
    transform: scale(0.75);
  }

  to {
    transform: scale(1);
  }
}

.nm-brand-logo-section--side {
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  align-items: center;
  column-gap: clamp(2rem, 6cqw, 6rem);
}

.nm-brand-logo-section--side .nm-brand-logo-section__image {
  aspect-ratio: 1.25;
}

.nm-brand-logo-section--grid .nm-brand-logo-section__images {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.nm-brand-logo-section--grid .nm-brand-logo-section__image {
  aspect-ratio: 1;
}

@container (max-width: 760px) {
  .nm-brand-logo-section--side {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 720px) {
  .nm-brand-logo-section--grid .nm-brand-logo-section__images {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .nm-brand-logo-section--image-scroll .nm-brand-logo-section__image {
    animation: none;
  }
}
</style>
