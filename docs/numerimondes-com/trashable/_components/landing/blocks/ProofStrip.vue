<template>
  <div class="proof">
    <slot>
      <div class="proof-item">Trusted by teams who convert</div>
      <div class="proof-item">Fast. Clean. Focused.</div>
      <div class="proof-item">Qualified leads, not noise</div>
    </slot>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'ProofStrip' });
</script>

<style scoped>
.proof {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  padding: 32px 0;
  border-top: 1px solid var(--vp-c-border);
  border-bottom: 1px solid var(--vp-c-border);
  margin: 80px 0;
}

.proof-item {
  font-size: 14px;
  color: var(--vp-c-text-2);
}
</style>
