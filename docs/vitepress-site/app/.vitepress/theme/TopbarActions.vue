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
@media (max-width: 768px) {
  .docs-topbar-actions a[href="/account/"] {
    display: inline-flex;
    width: 2.25rem;
    min-width: 2.25rem;
    height: 2.25rem;
    align-items: center;
    justify-content: center;
    padding: 0;
    overflow: hidden;
    font-size: 0;
  }

  .docs-topbar-actions a[href="/account/"]::before {
    width: 1.2rem;
    height: 1.2rem;
    flex: 0 0 1.2rem;
    background: currentColor;
    content: "";
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='8' r='5'/%3E%3Cpath d='M20 21a8 8 0 0 0-16 0'/%3E%3C/svg%3E") center / contain no-repeat;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='8' r='5'/%3E%3Cpath d='M20 21a8 8 0 0 0-16 0'/%3E%3C/svg%3E") center / contain no-repeat;
  }
}
</style>
