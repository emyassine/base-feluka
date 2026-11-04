<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ base: string; nonBaseTooltip?: string }>()
const attrs = useAttrs()
const currency = ref(props.base.toUpperCase())
const values = Object.fromEntries(Object.entries(attrs)
  .filter(([key, value]) => /^[a-z]{3}$/i.test(key) && typeof value === 'string')
  .map(([key, value]) => [key.toUpperCase(), value as string]))
const displayedCurrency = computed(() => values[currency.value] !== undefined ? currency.value : props.base.toUpperCase())
const selectedValue = computed(() => values[displayedCurrency.value] ?? '')
const isApproximate = computed(() => displayedCurrency.value !== props.base.toUpperCase())
function syncCurrency(event?: Event) {
  const selected = event instanceof CustomEvent ? event.detail : undefined
  const saved = selected ?? (() => { try { return localStorage.getItem('spmpst-currency') } catch { return null } })()
  if (typeof saved === 'string' && /^[a-z]{3}$/i.test(saved)) currency.value = saved.toUpperCase()
}
onMounted(() => {
  syncCurrency()
  window.addEventListener('spmpst-currency-change', syncCurrency)
})
onUnmounted(() => window.removeEventListener('spmpst-currency-change', syncCurrency))
</script>

<template>
  <span
    class="spmpst-currency"
    :title="isApproximate ? nonBaseTooltip : undefined"
  >{{ isApproximate ? '~' : '' }}{{ selectedValue }} {{ displayedCurrency }}</span>
</template>
