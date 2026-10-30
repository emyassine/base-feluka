<script setup lang="ts">
import ReactDevMarkup from './ReactDevMarkup.vue'
defineProps<{ title?: string; lead?: string; detail?: string; markupTitle?: string }>()
</script>
<template>
  <ReactDevMarkup block="components" :title="title" :lead="lead" :detail="detail" />
  <ReactDevMarkup block="markup" :title="markupTitle" />
</template>
