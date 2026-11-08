<template>
  <div class="xw0k8qsm5" role="img" :aria-label="alt || 'Numerimondes technology and consulting'">
    <span>Strategy</span><span>Engineering</span><span>Operations</span>
  </div>
</template>
<script setup>
defineProps({ alt: String })
</script>

<style scoped>
.xw0k8qsm5 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin: 2rem 0;
}
.xw0k8qsm5 span {
  display: grid;
  min-height: 8rem;
  place-items: end start;
  padding: 1rem;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--brand-soft), var(--surface-soft));
  font-weight: 650;
}
@media (max-width: 640px) {
  .xw0k8qsm5 { grid-template-columns: 1fr; }
}
</style>
