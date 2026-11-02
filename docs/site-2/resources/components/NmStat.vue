<template>
  <div class="nm-stat">
    <span class="nm-stat__label">{{ label }}</span>
    <strong class="nm-stat__value">{{ value }}</strong>
    <span v-if="description" class="nm-stat__description">{{ description }}</span>
  </div>
</template>
<script setup>
defineProps({ label: String, value: String, description: String, color: String, icon: String })
</script>

<style scoped>
.nm-stat {
  display: flex;
  height: 100%;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.15rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-md);
  background: var(--vp-c-bg-soft);
}
.nm-stat__label { color: var(--vp-c-text-2); font-size: 0.8rem; }
.nm-stat__value { font-size: 1.45rem; }
.nm-stat__description { color: var(--vp-c-text-2); font-size: 0.85rem; }
</style>
