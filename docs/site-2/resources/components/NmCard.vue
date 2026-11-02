<template>
  <article class="nm-card">
    <div v-if="icon" class="nm-card__icon" aria-hidden="true">{{ iconGlyph }}</div>
    <div class="nm-card__body">
      <h3 v-if="$slots.heading || title" class="nm-card__title"><slot name="heading">{{ title }}</slot></h3>
      <p v-if="$slots.description || description" class="nm-card__description"><slot name="description">{{ description }}</slot></p>
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
.nm-card {
  display: flex;
  gap: 0.9rem;
  margin: 0.75rem 0;
  padding: 1rem 1.15rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
.nm-card__icon {
  color: var(--vp-c-brand-1);
  font-size: 0.8rem;
  text-transform: capitalize;
}
.nm-card__body { min-width: 0; }
.nm-card__title { margin: 0 0 0.45rem; font-size: 1.05rem; }
.nm-card__description { margin: 0; color: var(--vp-c-text-2); }
</style>
