<script setup lang="ts">
import { inject } from 'vue'
import { tabsContextKey } from './tabs-context'

const props = defineProps<{ value: string }>()
const context = inject(tabsContextKey)
if (!context) throw new Error('TabsPanel must be rendered inside Tabs.')
</script>

<template>
  <section
    v-show="context.isActive(value)"
    class="xmqrre3s1__panel"
    role="tabpanel"
    tabindex="0"
    :id="context.panelId(value)"
    :aria-labelledby="context.tabId(value)"
  >
    <slot />
  </section>
</template>

<style scoped>
.xmqrre3s1__panel:focus-visible { outline: 2px solid var(--brand, #3977c8); outline-offset: 3px; }
</style>
