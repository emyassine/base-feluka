<script setup lang="ts">
import './home.css'

defineProps<{
  tone: 'implemented' | 'partial' | 'target' | 'exploring'
  label: string
}>()
</script>

<template>
  <em class="fh-status" :class="`fh-status--${tone}`">
    <i class="fh-status__dot" aria-hidden="true"></i>
    {{ label }}
  </em>
</template>
