<template>
  <div class="feluqa-triptych" role="img" :aria-label="alt || 'Numerimondes technology and consulting'">
    <span>Strategy</span><span>Engineering</span><span>Operations</span>
  </div>
</template>
<script setup>
defineProps({ alt: String })
</script>

<style scoped>
.feluqa-triptych {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin: 2rem 0;
}
.feluqa-triptych span {
  display: grid;
  min-height: 8rem;
  place-items: end start;
  padding: 1rem;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--feluqa-brand-soft), var(--feluqa-surface-soft));
  font-weight: 650;
}
@media (max-width: 640px) {
  .feluqa-triptych { grid-template-columns: 1fr; }
}
</style>
