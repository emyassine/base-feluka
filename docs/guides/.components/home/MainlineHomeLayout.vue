<template>
  <div class="docs-home">
    <slot />
  </div>
</template>

<style>
.docs-home {
  position: relative;
  isolation: isolate;
  background:
    radial-gradient(ellipse 78% 34% at 50% 48%, color-mix(in srgb, var(--vp-c-brand-1) 10%, transparent), transparent 100%),
    var(--vp-c-bg);
}
</style>
