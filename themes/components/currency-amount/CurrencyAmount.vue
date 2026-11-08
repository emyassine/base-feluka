<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  amount: number
  currency: string
  locale?: string
  approximate?: boolean
}>(), {
  locale: 'en',
  approximate: false,
})

const formattedAmount = computed(() => new Intl.NumberFormat(props.locale, {
  style: 'currency',
  currency: props.currency,
}).format(props.amount))
</script>

<template>
  <span>{{ approximate ? '~' : '' }}{{ formattedAmount }}</span>
</template>
