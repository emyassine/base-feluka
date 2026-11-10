<template>
  <section class="image-grid-hero">
    <div class="hero-content">
      <h1 class="title">
        <slot name="title">{{ title }}</slot>
      </h1>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>

      <div class="cta-group">
        <a v-if="ctaHref" :href="ctaHref" class="cta-primary">{{ ctaText }}</a>
      </div>

      <div v-if="socialProof" class="social-proof">{{ socialProof }}</div>
    </div>

    <div class="image-grid">
      <slot name="images">
        <div class="grid-item">Team 1</div>
        <div class="grid-item">Team 2</div>
        <div class="grid-item">Team 3</div>
        <div class="grid-item">Team 4</div>
        <div class="grid-item">Team 5</div>
        <div class="grid-item">Team 6</div>
      </slot>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'ImageGridHero' });
type Props = {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  socialProof?: string;
};
withDefaults(defineProps<Props>(), {
  title: 'Where teams make better decisions',
  subtitle: 'Real people, real workflows, real results.',
  ctaText: 'Start collaborating',
  ctaHref: '#',
  socialProof: 'Join 50,000+ teams already using our platform',
});
</script>

<style scoped>
.image-grid-hero {
  margin-bottom: 80px;
}

.hero-content {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 48px;
}

.title {
  font-size: 48px;
  line-height: 1.1;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 20px;
  color: var(--vp-c-text-1);
}

@media (min-width: 640px) {
  .title {
    font-size: 56px;
  }
}

.subtitle {
  font-size: 20px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  margin: 0 0 32px;
}

.cta-group {
  margin-bottom: 20px;
}

.cta-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
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

.social-proof {
  font-size: 14px;
  color: var(--vp-c-text-3);
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.grid-item {
  aspect-ratio: 4 / 3;
  border-radius: 8px;
  border: 1px solid var(--vp-c-border);
  background: var(--vp-c-bg-soft);
  display: grid;
  place-items: center;
  font-size: 14px;
  color: var(--vp-c-text-3);
  overflow: hidden;
}

@media (min-width: 640px) {
  .image-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
