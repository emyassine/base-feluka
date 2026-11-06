<template>
  <section id="attributions" class="nm-brand-attributions" aria-labelledby="nm-brand-attributions-title">
    <header class="nm-brand-attributions__header">
      <div><p>{{ eyebrow }}</p><h2 id="nm-brand-attributions-title">{{ title }}</h2></div>
      <p>{{ description }}</p>
    </header>

    <ul class="nm-brand-attributions__grid">
      <li v-for="image in images" :key="image.path" class="nm-brand-attributions__card">
        <a class="nm-brand-attributions__preview" :href="image.path" :aria-label="`Open full image: ${image.title}`">
          <img :src="image.path" :alt="image.alt" loading="lazy" decoding="async" />
        </a>
        <h3><a :href="image.path">{{ image.title }}</a></h3>
        <small v-if="image.sourceUrl">
          <a :href="image.sourceUrl" target="_blank" rel="noopener noreferrer">Photo by {{ image.creator }} on Unsplash</a>
          · <a :href="image.licenseUrl" target="_blank" rel="noopener noreferrer">Unsplash License</a>
          · cropped for this page
        </small>
        <small v-else>{{ image.credit }}</small>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import registry from '../attributions.json'

defineProps<{
  eyebrow: string
  title: string
  description: string
}>()

const images = registry.images
</script>

<style scoped>
.nm-brand-attributions {
  padding: clamp(3rem, 8cqw, 7rem) 0;
  border-top: 1px solid var(--nm-brand-line);
}

.nm-brand-attributions__header {
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  gap: 1rem 3rem;
  margin-bottom: clamp(2rem, 5cqw, 4rem);
}

.nm-brand-attributions__header > div > p {
  margin: 0 0 .7rem;
  color: var(--nm-brand-muted);
  font: .7rem var(--vp-font-family-mono);
  letter-spacing: .14em;
  text-transform: uppercase;
}

.nm-brand-attributions h2 {
  margin: 0;
  font-size: clamp(2rem, 5cqw, 5rem);
  font-weight: 500;
  letter-spacing: -.065em;
  line-height: .95;
}

.nm-brand-attributions__header > p {
  align-self: end;
  max-width: 54ch;
  margin: 0;
  color: var(--nm-brand-muted);
  line-height: 1.6;
}

.nm-brand-attributions__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2cqw, 1.5rem);
  margin: 0;
  padding: 0;
  list-style: none;
}

.nm-brand-attributions__card { min-width: 0; }

.nm-brand-attributions__preview {
  display: block;
  overflow: hidden;
  border: 1px solid var(--nm-brand-line);
  border-radius: .65rem;
  background: var(--nm-brand-surface-soft);
}

.nm-brand-attributions__preview img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  transition: transform 180ms ease;
}

.nm-brand-attributions__preview:hover img,
.nm-brand-attributions__preview:focus-visible img { transform: scale(1.025); }

.nm-brand-attributions h3 {
  margin: .7rem 0 .25rem;
  font-size: 1rem;
  font-weight: 500;
}

.nm-brand-attributions h3 a { color: var(--nm-brand-text); text-decoration: none; }
.nm-brand-attributions small { display: block; color: var(--nm-brand-muted); font-size: .72rem; line-height: 1.5; }
.nm-brand-attributions small a { color: inherit; text-underline-offset: .15em; }

@container (max-width: 760px) {
  .nm-brand-attributions__header { grid-template-columns: 1fr; }
  .nm-brand-attributions__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@container (max-width: 480px) {
  .nm-brand-attributions__grid { grid-template-columns: 1fr; }
}

@media (prefers-reduced-motion: reduce) {
  .nm-brand-attributions__preview img { transition: none; }
}
</style>
