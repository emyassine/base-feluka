<template>
  <div class="feluqa-stat">
    <span class="feluqa-stat__label" v-html="label" />
    <strong class="feluqa-stat__value" v-html="value" />
    <span v-if="description" class="feluqa-stat__description" v-html="description" />
  </div>
</template>
<script setup>
defineProps({ label: String, value: String, description: String, color: String, icon: String })
</script>

<style scoped>
.feluqa-stat {
  display: flex;
  height: 100%;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.15rem;
  border: 1px solid var(--feluqa-border);
  border-radius: var(--radius-md);
  background: var(--feluqa-surface-soft);
}
.feluqa-stat__label { color: var(--feluqa-text-secondary); font-size: 0.8rem; }
.feluqa-stat__value { font-size: 1.45rem; }
.feluqa-stat__description { color: var(--feluqa-text-secondary); font-size: 0.85rem; }
</style>
