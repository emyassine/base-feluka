<template>
  <div class="landing-cta" :class="[`tone-${tone}`]">
    <div class="landing-cta__content">
      <h3 class="landing-cta__title">{{ title }}</h3>
      <p v-if="subtitle" class="landing-cta__subtitle">{{ subtitle }}</p>
    </div>
    <div class="landing-cta__actions">
      <slot>
        <a :href="href" class="landing-cta__button">{{ buttonText }}</a>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'LandingCTA' });

type Props = {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  href?: string;
  tone?: 'dark' | 'accent';
};

withDefaults(defineProps<Props>(), {
  title: 'Ready to build a focused landing page?',
  subtitle: 'One promise, one proof, one action.',
  buttonText: 'Get the checklist',
  href: '#lead-form',
  tone: 'accent',
});
</script>

<style scoped>
.landing-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.landing-cta.tone-dark {
  background: rgba(12, 17, 23, 0.65);
}

.landing-cta.tone-accent {
  background: linear-gradient(120deg, rgba(240, 97, 42, 0.18), rgba(29, 78, 216, 0.2));
}

.landing-cta__title {
  margin: 0;
  color: #e8eef6;
  font-size: 1.2rem;
}

.landing-cta__subtitle {
  margin: 4px 0 0;
  color: #9fb2c7;
}

.landing-cta__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 12px;
  background: #f0612a;
  color: #0b0f14;
  font-weight: 700;
  text-decoration: none;
}
</style>
