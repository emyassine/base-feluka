<template>
  <article class="feluqa-card">
    <div v-if="icon" class="feluqa-card__icon" aria-hidden="true">{{ iconGlyph }}</div>
    <div class="feluqa-card__body">
      <h3 v-if="$slots.heading || title" class="feluqa-card__title">
        <slot v-if="$slots.heading" name="heading" />
        <span v-else v-html="title" />
      </h3>
      <p v-if="$slots.description || description" class="feluqa-card__description">
        <slot v-if="$slots.description" name="description" />
        <span v-else v-html="description" />
      </p>
      <slot />
    </div>
  </article>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ title: String, description: String, icon: String, color: String })
const iconGlyph = computed(() => props.icon?.replace(/^heroicon-[os]-/, '').replaceAll('-', ' ') ?? '')
</script>

<style scoped>
.feluqa-card {
  display: flex;
  gap: 0.9rem;
  margin: 0.75rem 0;
  padding: 1rem 1.15rem;
  border: 1px solid var(--feluqa-border);
  border-radius: var(--radius-md);
  background: var(--feluqa-surface-soft);
}
.feluqa-card__icon {
  color: var(--feluqa-brand);
  font-size: 0.8rem;
  text-transform: capitalize;
}
.feluqa-card__body { min-width: 0; }
.feluqa-card__title { margin: 0 0 0.45rem; font-size: 1.05rem; }
.feluqa-card__description { margin: 0; color: var(--feluqa-text-secondary); }
</style>
