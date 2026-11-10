<template>
  <section class="centered-hero">
    <div class="hero-content">
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <h1 class="title">
        <slot name="title">{{ title }}</slot>
      </h1>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>

      <div class="cta-group">
        <a v-if="ctaHref" :href="ctaHref" class="cta-primary">{{ ctaText }}</a>
      </div>

      <div v-if="trustNote" class="trust-note">{{ trustNote }}</div>
    </div>

    <div class="visual-cards">
      <slot name="cards">
        <div class="card">Feature 1</div>
        <div class="card">Feature 2</div>
        <div class="card">Feature 3</div>
      </slot>
    </div>

    <div v-if="$slots.integrations" class="integrations">
      <p class="integrations-label">Integrates with</p>
      <div class="integrations-logos">
        <slot name="integrations" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'CenteredFloatingHero' });
type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  trustNote?: string;
};
withDefaults(defineProps<Props>(), {
  title: 'Platform you can trust',
  subtitle: 'Reliable workflows, seamless integrations, zero friction.',
  ctaText: 'Get started',
  ctaHref: '#',
  trustNote: 'Trusted by 10,000+ teams',
});
</script>

<style scoped>
.centered-hero {
  text-align: center;
  max-width: 960px;
  margin: 0 auto 80px;
}

.hero-content {
  margin-bottom: 48px;
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
  margin-bottom: 16px;
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

.trust-note {
  font-size: 14px;
  color: var(--vp-c-text-3);
}

.visual-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 48px;
}

.card {
  padding: 32px 24px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.integrations {
  padding-top: 32px;
  border-top: 1px solid var(--vp-c-border);
}

.integrations-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
  margin-bottom: 16px;
}

.integrations-logos {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
}
</style>
