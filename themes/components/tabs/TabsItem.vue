<script setup lang="ts">
import { computed, inject, type Component } from 'vue'
import { tabsContextKey } from './tabs-context'

const props = withDefaults(defineProps<{
  value?: string
  /** Render a link in navigation mode. */
  href?: string
  tag?: 'button' | 'a'
  active?: boolean
  disabled?: boolean
  icon?: string | Component
  iconPosition?: 'before' | 'after'
  badge?: string | number
  target?: string
  rel?: string
}>(), {
  tag: 'button',
  iconPosition: 'before',
  disabled: false,
})
defineOptions({ inheritAttrs: false })

const context = inject(tabsContextKey)
if (!context) throw new Error('TabsItem must be rendered inside Tabs.')
if (context.mode.value === 'switch' && !props.value) throw new Error('TabsItem in switch mode requires a value.')

const isLink = computed(() => Boolean(props.href) || props.tag === 'a')
const itemValue = computed(() => props.value ?? props.href ?? '')
const selected = computed(() => context.mode.value === 'navigation'
  ? (Boolean(itemValue.value) && context.isActive(itemValue.value)) || props.active
  : context.isActive(itemValue.value))
const tabRole = computed(() => context.mode.value === 'switch' && !isLink.value ? 'tab' : undefined)
const elementTag = computed(() => isLink.value ? 'a' : 'button')

const iconPaths: Record<string, string> = {
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4',
  briefcase: 'M3 7h18v13H3z M8 7V4h8v3 M3 12h18 M10 12v2h4v-2',
  check: 'm5 12 4 4L19 6',
  home: 'm3 10 9-7 9 7 M5 9v12h14V9 M9 21v-7h6v7',
  search: 'm20 20-4.5-4.5 M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z',
  settings: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.1h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6.4v-2.6h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.1H15v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1V14h-.1a1.7 1.7 0 0 0-1.5 1z',
  users: 'M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20 M10 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.3 M15.5 5.2a3.5 3.5 0 0 1 0 6.6',
}
const iconPath = computed(() => typeof props.icon === 'string' ? iconPaths[props.icon] : undefined)

function onClick(event: MouseEvent): void {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  if (context.mode.value === 'switch' && !isLink.value) context.select(itemValue.value)
}
</script>

<template>
  <component
    :is="elementTag"
    v-bind="$attrs"
    class="feluqa-tabs__item"
    :class="[$attrs.class, `feluqa-tabs__item--${context.preset.value}`, { 'is-active': selected, 'is-disabled': disabled, 'has-icon-after': iconPosition === 'after' }]"
    :href="isLink ? href : undefined"
    :target="target"
    :rel="rel"
    :type="elementTag === 'button' ? 'button' : undefined"
    :disabled="elementTag === 'button' ? disabled : undefined"
    :aria-disabled="elementTag === 'a' && disabled ? 'true' : undefined"
    :role="tabRole"
    :id="tabRole ? context.tabId(itemValue) : undefined"
    :aria-selected="tabRole ? selected : undefined"
    :aria-controls="tabRole ? context.panelId(itemValue) : undefined"
    :aria-current="isLink && selected ? 'page' : undefined"
    :tabindex="disabled && isLink ? -1 : tabRole ? (selected ? 0 : -1) : undefined"
    @click="onClick"
  >
    <component :is="icon" v-if="typeof icon !== 'string' && icon && iconPosition === 'before'" class="feluqa-tabs__icon" aria-hidden="true" />
    <svg v-else-if="iconPath && iconPosition === 'before'" class="feluqa-tabs__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path :d="iconPath" /></svg>
    <slot name="icon" v-else-if="iconPosition === 'before'" />
    <span class="feluqa-tabs__label"><slot /></span>
    <component :is="icon" v-if="typeof icon !== 'string' && icon && iconPosition === 'after'" class="feluqa-tabs__icon" aria-hidden="true" />
    <svg v-else-if="iconPath && iconPosition === 'after'" class="feluqa-tabs__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path :d="iconPath" /></svg>
    <slot name="icon" v-else-if="iconPosition === 'after'" />
    <span v-if="badge !== undefined || $slots.badge" class="feluqa-tabs__badge"><slot name="badge">{{ badge }}</slot></span>
  </component>
</template>

<style scoped>
.feluqa-tabs__item {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  min-height: 2.5rem;
  padding: .5rem .875rem;
  border: 1px solid transparent;
  border-radius: var(--radius-md, .5rem);
  background: transparent;
  color: var(--feluqa-text-secondary, #475569);
  font: inherit;
  line-height: 1.25;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color .16s ease, border-color .16s ease, color .16s ease;
}
.feluqa-tabs__item:hover:not(.is-disabled) { background: color-mix(in srgb, currentColor 8%, transparent); color: var(--feluqa-text-primary, #0f172a); }
.feluqa-tabs__item.is-active { border-color: color-mix(in srgb, var(--feluqa-brand, #3977c8) 28%, transparent); background: var(--feluqa-brand, #3977c8); color: var(--feluqa-on-brand, #fff); }
.feluqa-tabs__item.is-disabled { opacity: .5; cursor: not-allowed; }
.feluqa-tabs__icon { width: 1rem; height: 1rem; flex: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.feluqa-tabs__badge { display: inline-flex; align-items: center; justify-content: center; min-width: 1.25rem; padding: .1rem .35rem; border-radius: 999px; background: color-mix(in srgb, currentColor 14%, transparent); font-size: .75em; line-height: 1.2; }
.feluqa-tabs__item:focus-visible { outline: 2px solid var(--feluqa-brand, #3977c8); outline-offset: 2px; }

.feluqa-tabs__item--rounded {
  min-height: 1.75rem;
  padding: .25rem .9rem;
  border: 0;
  border-radius: 999px;
  color: var(--feluqa-text-primary);
  font-size: .75rem;
  font-weight: 600;
  line-height: 1.2;
  transition: background-color 160ms ease, color 160ms ease;
  -webkit-tap-highlight-color: transparent;
}
.feluqa-tabs__item--rounded.is-active { background: var(--feluqa-brand); color: var(--feluqa-on-brand); }
.feluqa-tabs__item--rounded:hover:not(.is-active):not(.is-disabled) { background: color-mix(in srgb, var(--feluqa-text-primary) 10%, transparent); }
.feluqa-tabs__item--headless {
  min-height: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: inherit;
  text-decoration: none;
  transition: none;
}
.feluqa-tabs__item--headless.is-active,
.feluqa-tabs__item--headless:hover:not(.is-disabled) { border: 0; background: transparent; color: inherit; }
@media (prefers-reduced-motion: reduce) {
  .feluqa-tabs__item { transition: none; }
}
</style>
