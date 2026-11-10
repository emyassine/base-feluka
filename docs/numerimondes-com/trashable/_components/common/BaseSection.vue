<template>
  <section class="base-section">
    <header class="base-section__head">
      <p v-if="eyebrow" class="base-section__eyebrow">{{ eyebrow }}</p>
      <h2 class="base-section__title">{{ title }}</h2>
      <p v-if="subtitle" class="base-section__subtitle">{{ subtitle }}</p>
    </header>
    <div class="base-section__body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'BaseSection' });

type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
};

withDefaults(defineProps<Props>(), {
  title: 'Section title',
});
</script>

<style scoped>
.base-section {
  padding: 24px 0;
}

.base-section__head {
  margin-bottom: 18px;
}

.base-section__eyebrow {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: #9fb2c7;
  margin-bottom: 10px;
}

.base-section__title {
  margin: 0 0 6px;
  font-size: 1.6rem;
  color: #e8eef6;
}

.base-section__subtitle {
  margin: 0;
  color: #9fb2c7;
}
</style>
