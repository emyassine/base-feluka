<template>
  <footer class="brand-kit-footer">
    <span :style="brandStyle" :class="brandClass" v-html="brand"></span>
    <span :style="noteStyle" :class="noteClass" v-html="note"></span>
  </footer>
</template>

<script setup lang="ts">
defineProps<{
  brand: string
  brandStyle?: string
  brandClass?: string
  note: string
  noteStyle?: string
  noteClass?: string
}>()
</script>

<style scoped>
.brand-kit-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin: 0;
  padding: 1.25rem 0;
  border-top: 1px solid var(--brand-kit-line);
  color: var(--brand-kit-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
</style>
