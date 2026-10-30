<template><nav class="nm-contents" aria-label="On this page"><strong>On this page</strong><ul><li v-for="item in headings" :key="item.id"><a :href="`#${item.id}`">{{ item.text }}</a></li></ul></nav></template>
<script setup>
import { onMounted, ref } from 'vue'
const headings = ref([])
onMounted(() => { headings.value = [...document.querySelectorAll('.vp-doc h2, .vp-doc h3')].map((h) => ({ id: h.id, text: h.textContent || '' })).filter((h) => h.id) })
</script>
