<template>
  <div class="xmgjg2taw">
    <span class="xmgjg2taw__label" v-html="label" />
    <strong class="xmgjg2taw__value" v-html="value" />
    <span v-if="description" class="xmgjg2taw__description" v-html="description" />
  </div>
</template>
<script setup>
defineProps({ label: String, value: String, description: String, color: String, icon: String })
</script>

<style scoped>
.xmgjg2taw {
  display: flex;
  height: 100%;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.15rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-soft);
}
.xmgjg2taw__label { color: var(--text-secondary); font-size: 0.8rem; }
.xmgjg2taw__value { font-size: 1.45rem; }
.xmgjg2taw__description { color: var(--text-secondary); font-size: 0.85rem; }
</style>
