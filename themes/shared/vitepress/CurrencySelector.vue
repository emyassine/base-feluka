<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useData } from 'vitepress'
import siteContent from '@generated/site-content.json'
import { readManagedStorage, writeManagedStorage } from '../../../src/composables/browser-storage'

type CurrencyOption = { code: string; label: string }
type SiteContent = typeof siteContent & {
  currency?: { base: string; options: CurrencyOption[] } | null
  spmpstConfig?: { topbar?: { currency?: { base: string; options: CurrencyOption[] } } }
}

const currencyConfig = (siteContent as SiteContent).spmpstConfig?.topbar?.currency
  ?? (siteContent as SiteContent).currency
  ?? null
const { lang } = useData()
const currency = ref(currencyConfig?.base.toUpperCase() ?? '')
const labelByLanguage: Record<string, string> = {
  en: 'Currency', fr: 'Devise', ar: 'العملة', es: 'Moneda', zh: '货币', hi: 'मुद्रा', ru: 'Валюта',
}
const label = computed(() => labelByLanguage[lang.value.toLowerCase().split('-')[0]] ?? 'Currency')

function readCurrency() {
  if (!currencyConfig) return
  const saved = readManagedStorage('spmpst-currency')
  currency.value = saved && currencyConfig.options.some((option) => option.code.toUpperCase() === saved.toUpperCase())
    ? saved.toUpperCase()
    : currencyConfig.base.toUpperCase()
}
function setCurrency(value: string) {
  currency.value = value.toUpperCase()
  writeManagedStorage('spmpst-currency', currency.value)
  window.dispatchEvent(new CustomEvent('spmpst-currency-change', { detail: currency.value }))
}
function onConsentChange() { readCurrency() }
function onCurrencyChange(event: Event) {
  const value = event instanceof CustomEvent ? event.detail : undefined
  if (typeof value === 'string' && currencyConfig?.options.some((option) => option.code.toUpperCase() === value.toUpperCase())) currency.value = value.toUpperCase()
}

onMounted(() => {
  readCurrency()
  window.addEventListener('spmpst-storage-consent-change', onConsentChange)
  window.addEventListener('spmpst-currency-change', onCurrencyChange)
})
onUnmounted(() => {
  window.removeEventListener('spmpst-storage-consent-change', onConsentChange)
  window.removeEventListener('spmpst-currency-change', onCurrencyChange)
})
</script>

<template>
  <label v-if="currencyConfig" class="topbar-currency-select">
    <span class="visually-hidden">{{ label }}</span>
    <select :value="currency" :aria-label="label" @change="setCurrency(($event.target as HTMLSelectElement).value)">
      <option v-for="option in currencyConfig.options" :key="option.code" :value="option.code.toUpperCase()">{{ option.code.toUpperCase() }}</option>
    </select>
  </label>
</template>

<style scoped>
.topbar-currency-select { display: flex; flex: 0 0 auto; align-items: center; margin-inline-end: .5rem; }
.topbar-currency-select select { min-height: 32px; border: 1px solid var(--vp-c-divider); border-radius: 6px; padding: 0 .45rem; color: var(--vp-c-text-1); background: var(--vp-c-bg); font: inherit; font-size: .8rem; cursor: pointer; }
.topbar-currency-select select:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
</style>
