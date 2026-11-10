<template>
  <div class="bullets">
    <div v-for="(item, index) in items" :key="index" class="bullet">
      <h3 class="bullet-title">{{ item.title }}</h3>
      <p class="bullet-text">{{ item.text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'BulletGrid' });
type Bullet = { title: string; text: string };
type Props = {
  items?: Bullet[];
};
withDefaults(defineProps<Props>(), {
  items: () => [
    { title: 'Clear promise', text: 'Headline stops the scroll and states the outcome.' },
    { title: 'Visual proof', text: 'Hero image supports the claim with context.' },
    { title: 'Single action', text: 'CTA explains what you get and how you get it.' },
  ],
});
</script>

<style scoped>
.bullets {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin: 64px 0;
}

.bullet {
  padding: 24px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
}

.bullet-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--vp-c-text-1);
}

.bullet-text {
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
}
</style>
