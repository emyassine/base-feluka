<template>
  <div class="nm-triptych" role="img" :aria-label="alt || 'Numerimondes technology and consulting'">
    <span>Strategy</span><span>Engineering</span><span>Operations</span>
  </div>
</template>
<script setup>
defineProps({ alt: String })
</script>

<style scoped>
.nm-triptych {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin: 2rem 0;
}
.nm-triptych span {
  display: grid;
  min-height: 8rem;
  place-items: end start;
  padding: 1rem;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--vp-c-brand-soft), var(--vp-c-bg-soft));
  font-weight: 650;
}
@media (max-width: 640px) {
  .nm-triptych { grid-template-columns: 1fr; }
}
</style>
