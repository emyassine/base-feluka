<template>
  <div class="landing-magnet">
    <div class="landing-magnet__content">
      <p v-if="eyebrow" class="landing-magnet__eyebrow">{{ eyebrow }}</p>
      <h4 class="landing-magnet__title">{{ title }}</h4>
      <p v-if="description" class="landing-magnet__desc">{{ description }}</p>
    </div>
    <div class="landing-magnet__actions">
      <slot>
        <a :href="href" class="landing-magnet__btn">{{ buttonText }}</a>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'LeadMagnetCard' });

type Props = {
  eyebrow?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  href?: string;
};

withDefaults(defineProps<Props>(), {
  eyebrow: 'Lead magnet',
  title: 'Landing Page Checklist',
  description: 'Short, focused checklist to increase qualified opt-ins.',
  buttonText: 'Download',
  href: '#lead-form',
});
</script>

<style scoped>
.landing-magnet {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px 18px;
  background: rgba(12, 17, 23, 0.65);
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.landing-magnet__eyebrow {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #9fb2c7;
  margin-bottom: 6px;
}

.landing-magnet__title {
  margin: 0 0 6px;
  color: #e8eef6;
}

.landing-magnet__desc {
  margin: 0;
  color: #9fb2c7;
}

.landing-magnet__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 12px;
  background: rgba(240, 97, 42, 0.2);
  color: #ffb08a;
  text-decoration: none;
  font-weight: 600;
}
</style>
