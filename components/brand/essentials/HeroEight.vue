<template>
  <section class="nm-brand-hero" aria-labelledby="nm-brand-title">
    <div v-if="backgroundImage" class="nm-brand-hero__image" aria-hidden="true">
      <img :src="backgroundImage" :alt="backgroundImageAlt || ''" />
    </div>
    <p class="nm-brand-hero__eyebrow" :style="eyebrowStyle" :class="eyebrowClass" v-html="eyebrow"></p>
    <div class="nm-brand-hero__content">
      <h1 id="nm-brand-title" :style="titleStyle" :class="titleClass" v-html="title"></h1>
      <div class="nm-brand-hero__bottom">
        <p :style="taglineStyle" :class="taglineClass" v-html="tagline"></p>
        <a :href="ctaHref" :style="ctaLabelStyle" :class="ctaLabelClass" v-html="ctaLabel"></a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow: string
  eyebrowStyle?: string
  eyebrowClass?: string
  title: string
  titleStyle?: string
  titleClass?: string
  tagline: string
  taglineStyle?: string
  taglineClass?: string
  ctaLabel: string
  ctaLabelStyle?: string
  ctaLabelClass?: string
  ctaHref: string
  backgroundImage?: string
  backgroundImageAlt?: string
}>()
</script>

<style scoped>
.nm-brand-hero {
  position: relative;
  display: flex;
  min-height: clamp(30rem, 66vh, 48rem);
  flex-direction: column;
  justify-content: space-between;
  gap: 3rem;
  margin: 0;
  padding: clamp(1.5rem, 4cqw, 3.5rem);
  overflow: hidden;
  border: 1px solid var(--nm-brand-line);
  border-radius: 0.75rem;
  background:
    radial-gradient(ellipse at 78% 90%, color-mix(in srgb, var(--vp-c-brand-1) 76%, transparent), transparent 34%),
    linear-gradient(125deg, var(--nm-brand-surface-soft), var(--nm-brand-surface) 58%, var(--vp-c-brand-soft));
}

.nm-brand-hero__eyebrow {
  position: relative;
  z-index: 1;
  margin: 0;
  color: var(--nm-brand-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.nm-brand-hero__content {
  position: relative;
  z-index: 1;
  display: grid;
  gap: clamp(1rem, 2cqw, 1.75rem);
}

.nm-brand-hero__image {
  position: absolute;
  z-index: 0;
  inset: 0;
  overflow: hidden;
  border-radius: inherit;
}

.nm-brand-hero__image::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, color-mix(in srgb, var(--nm-brand-surface) 82%, transparent), color-mix(in srgb, var(--nm-brand-surface) 24%, transparent));
  content: '';
}

.nm-brand-hero__image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nm-brand-hero h1 {
  min-width: 0;
  max-width: 100%;
  margin: 0;
  font-size: clamp(1.5rem, 12cqw, 11rem);
  font-weight: 500;
  letter-spacing: -0.085em;
  line-height: 0.84;
  word-break: normal;
  overflow-wrap: normal;
  text-wrap: balance;
}

.nm-brand-hero__bottom {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
  min-width: 0;
}

.nm-brand-hero__bottom p {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  font-size: clamp(1rem, 2.7cqw, 2.2rem);
  line-height: 1.05;
}

.nm-brand-hero__bottom a {
  flex: none;
  padding: 0 0 0.25rem;
  border-bottom: 1px solid currentColor;
  color: inherit;
  font-size: 0.85rem;
  line-height: 1.2;
  text-decoration: none;
}

@container (max-width: 680px) {
  .nm-brand-hero {
    min-height: 29rem;
  }

  .nm-brand-hero__bottom {
    align-items: start;
    flex-direction: column;
    gap: 1rem;
  }

  .nm-brand-hero__bottom p {
    max-width: 100%;
    font-size: clamp(1rem, 5cqw, 1.6rem);
  }
}
</style>
