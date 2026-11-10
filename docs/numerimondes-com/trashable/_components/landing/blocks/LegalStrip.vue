<template>
  <footer class="legal">
    <slot>
      <span>© 2026</span>
      <a href="/licenses/">Licenses</a>
      <a href="/legal/">Legal</a>
    </slot>
  </footer>
</template>

<script setup lang="ts">
defineOptions({ name: 'LegalStrip' });
</script>

<style scoped>
.legal {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 32px 0;
  border-top: 1px solid var(--vp-c-border);
  font-size: 14px;
  color: var(--vp-c-text-3);
}

.legal a {
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
}

.legal a:hover {
  color: var(--vp-c-brand-1);
}
</style>
