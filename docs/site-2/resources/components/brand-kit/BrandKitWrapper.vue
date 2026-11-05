<template>
  <div class="brand-kit-wrapper">
    <slot />
  </div>
</template>

<style scoped>
.brand-kit-wrapper {
  --brand-kit-surface: var(--vp-c-bg);
  --brand-kit-surface-soft: var(--vp-c-bg-soft);
  --brand-kit-text: var(--vp-c-text-1);
  --brand-kit-muted: var(--vp-c-text-2);
  --brand-kit-line: var(--vp-c-divider);

  width: 100%;
  max-width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  overflow: clip;
  color: var(--brand-kit-text);
  background: var(--brand-kit-surface);
  container-type: inline-size;
}
</style>
