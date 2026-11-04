<script setup lang="ts">
import registry from '../../.site/spmpst.images-attributions.json'

const images = registry.images
</script>

<template>
  <section aria-labelledby="image-attributions">
    <h2 id="image-attributions">Attributions</h2>
    <p>Images created for the site, with their visual credits.</p>
    <ul class="image-grid">
      <li v-for="image in images" :key="image.path" class="image-card">
        <a class="image-preview" :href="image.path" :aria-label="`Open full image: ${image.title}`">
          <img :src="image.path" :alt="image.alt" loading="lazy" decoding="async">
        </a>
        <h3><a :href="image.path">{{ image.title }}</a></h3>
        <small>{{ image.credit }}</small>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 1.25rem;
  padding: 0;
  list-style: none;
}

.image-card {
  min-width: 0;
}

.image-preview {
  display: block;
  overflow: hidden;
  border-radius: 0.75rem;
  background: var(--surface, #f1f3f5);
}

.image-preview img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  transition: transform 180ms ease;
}

.image-preview:hover img,
.image-preview:focus-visible img {
  transform: scale(1.025);
}

.image-card h3 {
  margin: 0.65rem 0 0.2rem;
  font-size: 1rem;
}

.image-card small {
  display: block;
  line-height: 1.45;
  opacity: 0.78;
}

@media (prefers-reduced-motion: reduce) {
  .image-preview img {
    transition: none;
  }
}
</style>
