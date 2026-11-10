<template>
  <span class="base-badge" :class="[`tone-${tone}`]">
    <slot />
  </span>
</template>

<script setup lang="ts">
defineOptions({ name: 'BaseBadge' });

type Props = {
  tone?: 'neutral' | 'accent' | 'info';
};

withDefaults(defineProps<Props>(), {
  tone: 'neutral',
});
</script>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.tone-neutral {
  background: rgba(15, 22, 30, 0.65);
  color: #9fb2c7;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tone-accent {
  background: rgba(240, 97, 42, 0.18);
  color: #ffb08a;
  border: 1px solid rgba(240, 97, 42, 0.3);
}

.tone-info {
  background: rgba(29, 78, 216, 0.2);
  color: #9bb7ff;
  border: 1px solid rgba(29, 78, 216, 0.3);
}
</style>
