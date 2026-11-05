<template>
  <section :id="id" class="brand-kit-photo-section">
    <header class="brand-kit-photo-section__heading">
      <p>{{ eyebrow }}</p><h2>{{ title }}</h2><div>{{ description }}</div>
    </header>
    <figure v-if="leadImage" class="brand-kit-photo-section__lead" :style="{ '--image-background': leadBackground }">
      <img :src="leadImage" :alt="leadAlt" :style="{ padding: imagePadding }" />
    </figure>
    <div v-if="items.length" class="brand-kit-photo-section__grid" :class="`brand-kit-photo-section__grid--${columns}`">
      <figure v-for="item in items" :key="item.src" :style="{ '--image-background': item.background || leadBackground, '--image-ratio': item.ratio || '4 / 3' }">
        <img :src="item.src" :alt="item.alt || ''" :style="{ padding: item.padding || imagePadding }" />
        <figcaption v-if="item.title || item.description"><strong>{{ item.title }}</strong><span>{{ item.description }}</span></figcaption>
      </figure>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  id: string
  eyebrow: string
  title: string
  description: string
  leadImage?: string
  leadAlt?: string
  leadBackground?: string
  imagePadding?: string
  columns?: 1 | 2 | 3 | 4
  items?: Array<{ src: string; alt?: string; title?: string; description?: string; background?: string; padding?: string; ratio?: string }>
}>(), {
  leadAlt: '',
  leadBackground: '#f2efeb',
  imagePadding: '0px',
  columns: 3,
  items: () => [],
})
</script>

<style scoped>
.brand-kit-photo-section { padding: clamp(3rem, 8cqw, 7rem) 0; border-top: 1px solid var(--brand-kit-line); }
.brand-kit-photo-section__heading { display: grid; grid-template-columns: 1fr 1.35fr; gap: .7rem 3rem; margin-bottom: clamp(2rem, 5cqw, 4rem); }
.brand-kit-photo-section__heading > p { grid-column: 1 / -1; margin: 0; color: var(--brand-kit-muted); font: .7rem var(--vp-font-family-mono); letter-spacing: .14em; text-transform: uppercase; }
.brand-kit-photo-section h2 { margin: 0; font-size: clamp(2rem, 5cqw, 5rem); font-weight: 500; letter-spacing: -.065em; line-height: .95; }
.brand-kit-photo-section__heading > div { align-self: end; max-width: 54ch; color: var(--brand-kit-muted); line-height: 1.6; }
.brand-kit-photo-section figure { min-width: 0; margin: 0; overflow: hidden; border: 1px solid var(--brand-kit-line); border-radius: .65rem; background: var(--image-background); }
.brand-kit-photo-section img { display: block; width: 100%; aspect-ratio: var(--image-ratio, 16 / 9); object-fit: cover; animation: brand-kit-photo-scale linear both; animation-timeline: view(block); animation-range: cover 0% cover 50%; }
.brand-kit-photo-section__lead { margin-bottom: .75rem !important; }
.brand-kit-photo-section__lead img { --image-ratio: 16 / 7; }
.brand-kit-photo-section__grid { display: grid; gap: .75rem; }
.brand-kit-photo-section__grid--1 { grid-template-columns: 1fr; }
.brand-kit-photo-section__grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.brand-kit-photo-section__grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.brand-kit-photo-section__grid--4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.brand-kit-photo-section figcaption { display: grid; gap: .45rem; padding: 1rem; }
.brand-kit-photo-section figcaption strong { font-size: 1.1rem; font-weight: 500; }
.brand-kit-photo-section figcaption span { color: var(--brand-kit-muted); font-size: .9rem; line-height: 1.55; }
@keyframes brand-kit-photo-scale { from { transform: scale(.75); } to { transform: scale(1); } }
@container (max-width: 680px) { .brand-kit-photo-section__heading { grid-template-columns: 1fr; } .brand-kit-photo-section__grid--2, .brand-kit-photo-section__grid--3, .brand-kit-photo-section__grid--4 { grid-template-columns: 1fr; } .brand-kit-photo-section__lead img { --image-ratio: 4 / 3; } }
</style>
