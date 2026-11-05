<template>
  <footer class="brand-kit-footer" :class="{ 'brand-kit-footer--bordered': props.showBorder }">
    <span :style="props.brandStyle" :class="props.brandClass" v-html="props.brand"></span>
    <span :style="props.noteStyle" :class="props.noteClass" v-html="props.note"></span>
  </footer>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  brand: string
  brandStyle?: string
  brandClass?: string
  note: string
  noteStyle?: string
  noteClass?: string
  showBorder?: boolean
}>(), {
  showBorder: true,
})
</script>

<style scoped>
.brand-kit-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin: 0;
  padding: 1.25rem 0;
  color: var(--brand-kit-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.brand-kit-footer--bordered {
  border-top: 1px solid var(--brand-kit-line);
}
</style>
