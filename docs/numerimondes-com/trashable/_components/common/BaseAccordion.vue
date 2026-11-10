<template>
  <div class="base-accordion">
    <details v-for="item in items" :key="item.id" class="base-accordion__item">
      <summary class="base-accordion__summary">{{ item.title }}</summary>
      <div class="base-accordion__body">
        <slot :item="item">{{ item.content }}</slot>
      </div>
    </details>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'BaseAccordion' });

type Item = { id: string; title: string; content?: string };

type Props = {
  items?: Item[];
};

withDefaults(defineProps<Props>(), {
  items: () => [
    { id: 'a', title: 'What is included?', content: 'A clear headline, proof, and a focused CTA.' },
    { id: 'b', title: 'How long should it be?', content: 'As short as possible without losing clarity.' },
    { id: 'c', title: 'What about social proof?', content: 'Include only if it increases conversions.' },
  ],
});
</script>

<style scoped>
.base-accordion {
  display: grid;
  gap: 10px;
}

.base-accordion__item {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px 14px;
  background: rgba(12, 17, 23, 0.6);
}

.base-accordion__summary {
  cursor: pointer;
  font-weight: 600;
  color: #e8eef6;
}

.base-accordion__body {
  margin-top: 10px;
  color: #9fb2c7;
}
</style>
