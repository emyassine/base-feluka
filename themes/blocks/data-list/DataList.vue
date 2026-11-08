<template><section class="xrtcu3emp"><slot name="title"><h2 v-html="title" /></slot><ul v-if="items.length"><li v-for="item in items" :key="item.href || item.title"><a v-if="item.href" :href="item.href" v-html="item.title" /><span v-else v-html="item.title" /><p v-if="item.description" v-html="item.description" /></li></ul><p v-else v-html="emptyMessage" /></section></template>
<script setup>
defineProps({ title: { type: String, default: 'Updates' }, items: { type: Array, default: () => [] }, emptyMessage: { type: String, default: 'No items have been published yet.' } })
</script>

<style scoped>
.xrtcu3emp {
  margin: 1.5rem 0;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-soft);
}
</style>
