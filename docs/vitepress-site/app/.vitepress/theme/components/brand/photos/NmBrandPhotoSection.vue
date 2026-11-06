<template>
  <section :id="id" class="nm-brand-photo-section">
    <header class="nm-brand-photo-section__heading">
      <p>{{ eyebrow }}</p><h2>{{ title }}</h2><div>{{ description }}</div>
    </header>
    <figure v-if="leadImage" class="nm-brand-photo-section__lead" :style="{ '--image-background': leadBackground }">
      <img :src="leadImage" :alt="leadAlt" :style="{ padding: imagePadding }" />
    </figure>
    <div v-if="items.length" class="nm-brand-photo-section__grid" :class="`nm-brand-photo-section__grid--${columns}`">
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
.nm-brand-photo-section { padding: clamp(3rem, 8cqw, 7rem) 0; border-top: 1px solid var(--nm-brand-line); }
.nm-brand-photo-section__heading { display: grid; grid-template-columns: 1fr 1.35fr; gap: .7rem 3rem; margin-bottom: clamp(2rem, 5cqw, 4rem); }
.nm-brand-photo-section__heading > p { grid-column: 1 / -1; margin: 0; color: var(--nm-brand-muted); font: .7rem var(--vp-font-family-mono); letter-spacing: .14em; text-transform: uppercase; }
.nm-brand-photo-section h2 { margin: 0; font-size: clamp(2rem, 5cqw, 5rem); font-weight: 500; letter-spacing: -.065em; line-height: .95; }
.nm-brand-photo-section__heading > div { align-self: end; max-width: 54ch; color: var(--nm-brand-muted); line-height: 1.6; }
.nm-brand-photo-section figure { min-width: 0; margin: 0; overflow: hidden; border: 1px solid var(--nm-brand-line); border-radius: .65rem; background: var(--image-background); }
.nm-brand-photo-section img { display: block; width: 100%; aspect-ratio: var(--image-ratio, 16 / 9); object-fit: cover; animation: nm-brand-photo-scale linear both; animation-timeline: view(block); animation-range: cover 0% cover 50%; }
.nm-brand-photo-section__lead { margin-bottom: .75rem !important; }
.nm-brand-photo-section__lead img { --image-ratio: 16 / 7; }
.nm-brand-photo-section__grid { display: grid; gap: .75rem; }
.nm-brand-photo-section__grid--1 { grid-template-columns: 1fr; }
.nm-brand-photo-section__grid--2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.nm-brand-photo-section__grid--3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.nm-brand-photo-section__grid--4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.nm-brand-photo-section figcaption { display: grid; gap: .45rem; padding: 1rem; }
.nm-brand-photo-section figcaption strong { font-size: 1.1rem; font-weight: 500; }
.nm-brand-photo-section figcaption span { color: var(--nm-brand-muted); font-size: .9rem; line-height: 1.55; }
@keyframes nm-brand-photo-scale { from { transform: scale(.75); } to { transform: scale(1); } }
@container (max-width: 680px) { .nm-brand-photo-section__heading { grid-template-columns: 1fr; } .nm-brand-photo-section__grid--2, .nm-brand-photo-section__grid--3, .nm-brand-photo-section__grid--4 { grid-template-columns: 1fr; } .nm-brand-photo-section__lead img { --image-ratio: 4 / 3; } }
</style>
