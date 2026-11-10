<template>
  <div class="landing-feature-list">
    <div v-for="item in items" :key="item.title" class="landing-feature">
      <div class="landing-feature__title">{{ item.title }}</div>
      <div class="landing-feature__text">{{ item.text }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'FeatureList' });

type Item = { title: string; text: string };

type Props = {
  items?: Item[];
};

withDefaults(defineProps<Props>(), {
  items: () => [
    { title: 'Headline', text: 'Clear promise that stops the scroll.' },
    { title: 'Sub-headline', text: 'Clarifies the promise with context.' },
    { title: 'Proof', text: 'Visual cue or outcome that reinforces trust.' },
  ],
});
</script>

<style scoped>
.landing-feature-list {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.landing-feature {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px 16px;
  background: rgba(12, 17, 23, 0.6);
}

.landing-feature__title {
  font-weight: 600;
  color: #e8eef6;
  margin-bottom: 6px;
}

.landing-feature__text {
  color: #9fb2c7;
}
</style>
