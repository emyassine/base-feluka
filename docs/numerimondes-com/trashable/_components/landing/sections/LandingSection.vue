<template>
  <section class="section">
    <header v-if="eyebrow || title || subtitle" class="section-header">
      <p v-if="eyebrow" class="section-eyebrow">{{ eyebrow }}</p>
      <h2 v-if="title" class="section-title">{{ title }}</h2>
      <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>
    </header>
    <div class="section-body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'LandingSection' });
type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};
withDefaults(defineProps<Props>(), {});
</script>

<style scoped>
.section {
  margin: 80px 0;
}

.section-header {
  max-width: 720px;
  margin: 0 auto 48px;
  text-align: center;
}

.section-eyebrow {
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-brand-1);
  margin-bottom: 12px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 16px;
  color: var(--vp-c-text-1);
}

@media (min-width: 640px) {
  .section-title {
    font-size: 40px;
  }
}

.section-subtitle {
  font-size: 18px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
}
</style>
