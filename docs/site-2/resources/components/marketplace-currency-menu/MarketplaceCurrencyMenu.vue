<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { readManagedStorage, writeManagedStorage } from '@themes/shared/scripts/browser-storage.ts'

const supportedCurrencies = ['MAD', 'EUR', 'USD'] as const
type CurrencyCode = (typeof supportedCurrencies)[number]
const currency = ref<CurrencyCode>('MAD')

onMounted(() => {
  const saved = readManagedStorage('spmpst-currency')
  if (supportedCurrencies.includes(saved as CurrencyCode)) currency.value = saved as CurrencyCode
  window.addEventListener('spmpst-currency-change', syncFromSharedCurrency)
  window.addEventListener('spmpst-storage-consent-change', onConsentChange)
})

watch(currency, (value) => {
  writeManagedStorage('spmpst-currency', value)
  window.dispatchEvent(new CustomEvent('currency-change', { detail: value }))
  window.dispatchEvent(new CustomEvent('spmpst-currency-change', { detail: value }))
})

function syncFromSharedCurrency(event: Event) {
  const value = event instanceof CustomEvent ? event.detail : undefined
  if (supportedCurrencies.includes(value as CurrencyCode)) currency.value = value as CurrencyCode
}
function onConsentChange() {
  const saved = readManagedStorage('spmpst-currency')
  if (supportedCurrencies.includes(saved as CurrencyCode)) currency.value = saved as CurrencyCode
}
onUnmounted(() => {
  window.removeEventListener('spmpst-currency-change', syncFromSharedCurrency)
  window.removeEventListener('spmpst-storage-consent-change', onConsentChange)
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
