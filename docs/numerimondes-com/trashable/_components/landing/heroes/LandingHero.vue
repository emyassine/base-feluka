<template>
  <section class="hero">
    <div class="hero-content">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h1 class="title">
        <slot name="title">{{ title }}</slot>
      </h1>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      <div v-if="ctaHref || $slots.cta" class="cta-group">
        <slot name="cta">
          <a v-if="ctaHref" :href="ctaHref" class="cta-primary">{{ ctaText }}</a>
        </slot>
      </div>
    </div>
    <div v-if="$slots.media" class="hero-media">
      <slot name="media" />
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'LandingHero' });
type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
};
withDefaults(defineProps<Props>(), {
  title: 'Build a landing page that converts',
  subtitle: "Stop the scroll with a clear outcome. Cut everything that doesn't increase qualified opt-ins.",
  ctaText: 'Get started',
  ctaHref: '#form',
});
</script>

<style scoped>
.hero {
  display: grid;
  gap: 48px;
  align-items: center;
  margin-bottom: 80px;
}

@media (min-width: 960px) {
  .hero {
    grid-template-columns: 1.2fr 1fr;
    gap: 64px;
    margin-bottom: 120px;
  }
}

.hero-content {
  max-width: 640px;
}

.eyebrow {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-brand-1);
  margin-bottom: 16px;
}

.title {
  font-size: 40px;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 24px;
  color: var(--vp-c-text-1);
}

@media (min-width: 640px) {
  .title {
    font-size: 56px;
  }
}

.subtitle {
  font-size: 18px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0 0 32px;
}

@media (min-width: 640px) {
  .subtitle {
    font-size: 20px;
  }
}

.cta-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.cta-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background: var(--vp-c-brand-1);
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s;
}

.cta-primary:hover {
  background: var(--vp-c-brand-2);
}

.hero-media {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--vp-c-border);
}
</style>
