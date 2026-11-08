<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ base: string; nonBaseTooltip?: string }>()
const attrs = useAttrs()
const values = Object.fromEntries(Object.entries(attrs)
  .filter(([key, value]) => /^[a-z]{3}$/i.test(key) && typeof value === 'string')
  .map(([key, value]) => [key.toUpperCase(), value as string]))
const baseCurrency = props.base.toUpperCase()
const currency = ref(baseCurrency)
const displayedCurrency = computed(() => values[currency.value] !== undefined ? currency.value : baseCurrency)
const displayedValue = computed(() => values[displayedCurrency.value] ?? '')
const isApproximate = computed(() => displayedCurrency.value !== baseCurrency)

function syncCurrency(event: Event) {
  const selected = event instanceof CustomEvent ? event.detail : undefined
  if (typeof selected === 'string' && /^[a-z]{3}$/i.test(selected)) currency.value = selected.toUpperCase()
}

onMounted(() => window.addEventListener('currency-change', syncCurrency))
onUnmounted(() => window.removeEventListener('currency-change', syncCurrency))
</script>

<template>
  <span :title="isApproximate ? nonBaseTooltip : undefined">
    {{ isApproximate ? '~' : '' }}{{ displayedValue }} {{ displayedCurrency }}
  </span>
</template>
