<script setup lang="ts">
import { computed } from 'vue'
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
}

const { lang } = useData()
const actions = (siteContent as typeof siteContent & { topbarActions?: TopbarAction[] }).topbarActions ?? []
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
  <div v-if="actions.length" class="docs-topbar-actions">
    <FeluqaButton
      v-for="(action, index) in actions"
      :key="`${href(action)}-${index}`"
      tag="a"
      :href="href(action)"
      :label="localized(action.label)"
      :color="action.color ?? 'primary'"
      :size="action.size ?? 'sm'"
      :outlined="action.outlined ?? false"
      :target="isExternal(action) ? '_blank' : undefined"
      :rel="isExternal(action) ? 'noopener noreferrer' : undefined"
    />
  </div>
</template>

<style>
.docs-topbar-actions { display: flex; align-items: center; gap: .5rem; margin-inline-start: .75rem; }
.docs-topbar-actions .feluqa-button { white-space: nowrap; }
@media (max-width: 768px) { .docs-topbar-actions { margin-inline-start: .35rem; } }
</style>
