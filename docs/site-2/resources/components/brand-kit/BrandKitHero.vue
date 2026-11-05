<template>
  <section class="brand-kit-hero" aria-labelledby="brand-kit-title">
    <p class="brand-kit-hero__eyebrow" :style="eyebrowStyle" :class="eyebrowClass" v-html="eyebrow"></p>
    <div class="brand-kit-hero__content">
      <h1 id="brand-kit-title" :style="titleStyle" :class="titleClass" v-html="title"></h1>
      <div class="brand-kit-hero__bottom">
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
}>()
</script>

<style scoped>
.brand-kit-hero {
  position: relative;
  display: flex;
  min-height: clamp(30rem, 66vh, 48rem);
  flex-direction: column;
  justify-content: space-between;
  gap: 3rem;
  margin: 0;
  padding: clamp(1.5rem, 4cqw, 3.5rem);
  overflow: hidden;
  border: 1px solid var(--brand-kit-line);
  border-radius: 0.75rem;
  background:
    radial-gradient(ellipse at 78% 90%, color-mix(in srgb, var(--vp-c-brand-1) 76%, transparent), transparent 34%),
    linear-gradient(125deg, var(--brand-kit-surface-soft), var(--brand-kit-surface) 58%, var(--vp-c-brand-soft));
}

.brand-kit-hero__eyebrow {
  margin: 0;
  color: var(--brand-kit-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.brand-kit-hero__content {
  display: grid;
  gap: clamp(1.5rem, 4cqw, 3rem);
}

.brand-kit-hero h1 {
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

.brand-kit-hero__bottom {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1.5rem;
  min-width: 0;
}

.brand-kit-hero__bottom p {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  font-size: clamp(1rem, 2.7cqw, 2.2rem);
  line-height: 1.05;
}

.brand-kit-hero__bottom a {
  flex: none;
  padding: 0.7rem 0;
  border-bottom: 1px solid currentColor;
  color: inherit;
  font-size: 0.85rem;
  text-decoration: none;
}

@container (max-width: 680px) {
  .brand-kit-hero {
    min-height: 29rem;
  }

  .brand-kit-hero__bottom {
    align-items: start;
    flex-direction: column;
    gap: 1rem;
  }

  .brand-kit-hero__bottom p {
    max-width: 100%;
    font-size: clamp(1rem, 5cqw, 1.6rem);
  }
}
</style>
