<template>
  <div class="landing-faq">
    <h3 class="landing-faq__title">{{ title }}</h3>
    <div class="landing-faq__list">
      <details v-for="item in items" :key="item.q" class="landing-faq__item">
        <summary>{{ item.q }}</summary>
        <p>{{ item.a }}</p>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'FAQBlock' });

type Item = { q: string; a: string };

type Props = {
  title?: string;
  items?: Item[];
};

withDefaults(defineProps<Props>(), {
  title: 'Common questions',
  items: () => [
    { q: 'How long should it be?', a: 'As short as possible without losing clarity.' },
    { q: 'How many fields?', a: 'Only what qualifies the lead. Split if needed.' },
    { q: 'Do I need social proof?', a: 'Only if it increases conversions.' },
  ],
});
</script>

<style scoped>
.landing-faq {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 18px 20px;
  background: rgba(12, 17, 23, 0.6);
}

.landing-faq__title {
  margin: 0 0 12px;
  color: #e8eef6;
}

.landing-faq__list {
  display: grid;
  gap: 10px;
}

.landing-faq__item summary {
  cursor: pointer;
  font-weight: 600;
  color: #e8eef6;
}

.landing-faq__item p {
  margin: 8px 0 0;
  color: #9fb2c7;
}
</style>
