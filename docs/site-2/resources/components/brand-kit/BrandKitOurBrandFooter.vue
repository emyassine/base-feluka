<template>
  <div v-bind="attributes" v-html="fragment"></div>
</template>

<script setup lang="ts">
defineProps<{
  fragment: string
  attributes: Record<string, string>
}>()
</script>
