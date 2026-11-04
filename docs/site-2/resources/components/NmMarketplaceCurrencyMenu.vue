<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const supportedCurrencies = ['MAD', 'EUR', 'USD'] as const
type Currency = (typeof supportedCurrencies)[number]
const currency = ref<Currency>('MAD')

onMounted(() => {
  try {
    const saved = localStorage.getItem('nm-marketplace-currency')
    if (supportedCurrencies.includes(saved as Currency)) currency.value = saved as Currency
  } catch { /* storage unavailable */ }
})

watch(currency, (value) => {
  try { localStorage.setItem('nm-marketplace-currency', value) } catch { /* storage unavailable */ }
  window.dispatchEvent(new CustomEvent('nm-marketplace-currency-change', { detail: value }))
})
</script>

<template>
  <label class="nm-marketplace-currency-menu">
    <span>Currency</span>
    <select v-model="currency" aria-label="Display currency">
      <option value="MAD">MAD</option>
      <option value="EUR">EUR</option>
      <option value="USD">USD</option>
    </select>
  </label>
</template>

<style scoped>
.nm-marketplace-currency-menu { display: inline-flex; align-items: center; gap: .4rem; color: var(--vp-c-text-2); font-size: 12px; white-space: nowrap; }
.nm-marketplace-currency-menu select { height: 32px; min-width: 76px; border: 1px solid var(--vp-c-divider); border-radius: 6px; padding: 0 .4rem; background: var(--vp-c-bg); color: var(--vp-c-text-1); font: inherit; cursor: pointer; }
.nm-marketplace-currency-menu select:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
</style>
