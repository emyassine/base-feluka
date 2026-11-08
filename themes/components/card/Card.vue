<template>
  <article class="xrqx9ssyk">
    <div v-if="icon" class="xrqx9ssyk__icon" aria-hidden="true">{{ iconGlyph }}</div>
    <div class="xrqx9ssyk__body">
      <h3 v-if="$slots.heading || title" class="xrqx9ssyk__title">
        <slot v-if="$slots.heading" name="heading" />
        <span v-else v-html="title" />
      </h3>
      <p v-if="$slots.description || description" class="xrqx9ssyk__description">
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
.xrqx9ssyk {
  display: flex;
  gap: 0.9rem;
  margin: 0.75rem 0;
  padding: 1rem 1.15rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-soft);
}
.xrqx9ssyk__icon {
  color: var(--brand);
  font-size: 0.8rem;
  text-transform: capitalize;
}
.xrqx9ssyk__body { min-width: 0; }
.xrqx9ssyk__title { margin: 0 0 0.45rem; font-size: 1.05rem; }
.xrqx9ssyk__description { margin: 0; color: var(--text-secondary); }
</style>
