<template>
  <div class="base-card" :class="[`tone-${tone}`]">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'BaseCard' });

type Props = {
  tone?: 'dark' | 'light' | 'glass';
};

withDefaults(defineProps<Props>(), {
  tone: 'glass',
});
</script>

<style scoped>
.base-card {
  border-radius: 16px;
  padding: 18px 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 18px 36px rgba(8, 12, 18, 0.25);
}

.tone-dark {
  background: #0f141a;
  color: #e8eef6;
}

.tone-light {
  background: #f5f7fb;
  color: #0b0f14;
}

.tone-glass {
  background: rgba(15, 22, 30, 0.75);
  color: #e8eef6;
  backdrop-filter: blur(10px);
}
</style>
