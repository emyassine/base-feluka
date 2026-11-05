<template>
  <component
    :is="root.tag"
    v-for="root in roots"
    :key="root.key"
    v-bind="root.attributes"
    v-html="root.html"
  />
</template>

<script setup lang="ts">
interface FragmentRoot {
  key: string
  tag: string
  attributes: Record<string, string>
  html: string
}

defineProps<{ roots: FragmentRoot[] }>()
</script>
