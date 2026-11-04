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
let compactViewport: MediaQueryList | undefined
const updateCompact = () => { isCompact.value = compactViewport?.matches ?? false }
onMounted(() => {
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
</template>

<style scoped>
.topbar-actions { display: flex; flex: 0 0 auto; align-items: center; margin-inline-start: .5rem; }
</style>
