<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useData } from 'vitepress'
import siteContent from '@generated/site-content.json'

type TextValue = string | Record<string, string>
type TopbarAction = {
  label: TextValue
  link: string | Record<string, string>
  color?: 'primary' | 'gray' | 'info' | 'success' | 'warning' | 'danger' | 'dark' | 'secondary'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  outlined?: boolean
  external?: boolean
  icon?: string
  mobile?: { color?: 'primary' | 'gray' | 'info' | 'success' | 'warning' | 'danger' | 'dark' | 'secondary'; icon?: string; tooltip?: string }
}

const { lang } = useData()
const actions = (siteContent as typeof siteContent & { topbarActions?: TopbarAction[] }).topbarActions ?? []
const isCompact = ref(false)
const hasMoreMenu = ref(false)
let compactViewport: MediaQueryList | undefined
const updateCompact = () => { isCompact.value = compactViewport?.matches ?? false }
onMounted(() => {
  hasMoreMenu.value = Boolean(document.querySelector('.VPNavBarExtra .VPMenu'))
  compactViewport = window.matchMedia('(max-width: 1279px)')
  compactViewport.addEventListener('change', updateCompact)
  updateCompact()
})
onUnmounted(() => {
  compactViewport?.removeEventListener('change', updateCompact)
})
const language = computed(() => lang.value.toLowerCase().split('-')[0])
const localized = (value: TextValue) => typeof value === 'string'
  ? value
  : value[language.value] ?? value.en ?? Object.values(value)[0] ?? ''
const href = (action: TopbarAction) => typeof action.link === 'string'
  ? action.link
  : action.link[language.value] ?? action.link.en ?? Object.values(action.link)[0] ?? '/'

const isExternal = (action: TopbarAction) => action.external ?? /^(?:https?:)?\/\//i.test(href(action))
</script>

<template>
  <div class="topbar-actions">
    <template v-for="(action, index) in actions" :key="`${href(action)}-${index}`">
      <FeluqaButton
        tag="a"
        :href="href(action)"
        :tooltip="isCompact ? action.mobile?.tooltip ?? localized(action.label) : undefined"
        :icon="isCompact ? action.mobile?.icon ?? action.icon : action.icon"
        class="topbar-action-button"
        :color="isCompact ? action.mobile?.color ?? action.color ?? 'primary' : action.color ?? 'primary'"
        :size="isCompact ? 'xs' : action.size ?? 'sm'"
        :outlined="action.outlined ?? false"
        :target="isExternal(action) ? '_blank' : undefined"
        :rel="isExternal(action) ? 'noopener noreferrer' : undefined"
        :aria-label="localized(action.label)"
      >
        <template #default><span v-if="!isCompact">{{ localized(action.label) }}</span></template>
      </FeluqaButton>
    </template>
  </div>
  <Teleport v-if="hasMoreMenu && actions.length" defer to=".VPNavBarExtra .VPMenu">
    <div v-for="(action, index) in actions" :key="`more-${href(action)}-${index}`" class="group topbar-action-menu">
      <FeluqaButton
        tag="a"
        :href="href(action)"
        :aria-label="localized(action.label)"
        :icon="action.icon"
        :size="'xs'"
        :color="action.color ?? 'primary'"
        :outlined="action.outlined ?? false"
        :target="isExternal(action) ? '_blank' : undefined"
        :rel="isExternal(action) ? 'noopener noreferrer' : undefined"
      >
        {{ localized(action.label) }}
      </FeluqaButton>
    </div>
  </Teleport>
</template>

<style scoped>
.topbar-actions { display: flex; flex: 0 0 auto; align-items: center; gap: .5rem; }
.topbar-actions:has(> .topbar-currency, > .topbar-action-button)::before { width: 1px; height: 24px; flex: 0 0 1px; margin-inline: 16px 0; background: var(--vp-c-divider); content: ''; }
.topbar-actions > .topbar-action-button { margin-inline-start: .5rem; }
.topbar-action-menu { display: none; }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@media (max-width: 767px) { .topbar-actions::before { display: none; } }
@media (min-width: 768px) and (max-width: 1099px) { .topbar-actions:not(:has(> .topbar-currency))::before { display: none; } }
</style>
