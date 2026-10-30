<template><section class="nm-dynamic-list"><slot name="title"><h2>{{ title }}</h2></slot><ul v-if="items.length"><li v-for="item in items" :key="item.href || item.title"><a v-if="item.href" :href="item.href">{{ item.title }}</a><span v-else>{{ item.title }}</span><p v-if="item.description">{{ item.description }}</p></li></ul><p v-else>{{ emptyMessage }}</p></section></template>
<script setup>
defineProps({ title: { type: String, default: 'Updates' }, items: { type: Array, default: () => [] }, emptyMessage: { type: String, default: 'No items have been published yet.' } })
</script>
