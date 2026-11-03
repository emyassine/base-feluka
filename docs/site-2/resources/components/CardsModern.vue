<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

type LocalizedText = string | Record<string, string>
type CardAction = {
  label: LocalizedText
  href: string
  icon?: string
  iconOnly?: boolean
  iconPosition?: 'before' | 'after'
  tooltip?: LocalizedText
  tooltipPlacement?: 'top' | 'right' | 'bottom' | 'left'
  color?: 'primary' | 'gray' | 'info' | 'success' | 'warning' | 'danger' | 'dark' | 'secondary'
  outlined?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  external?: boolean
}
export type ModernCard = {
  meta?: LocalizedText
  title: LocalizedText
  description: LocalizedText
  icon?: string
  image?: string
  imageAlt?: LocalizedText
  actions?: CardAction[]
}

const props = withDefaults(defineProps<{
  title: LocalizedText
  description?: LocalizedText
  sectionTitle?: LocalizedText
  cards: ModernCard[]
  columns?: 1 | 2 | 3 | 4
}>(), { columns: 2 })

const { lang } = useData()
const locale = computed(() => lang.value.split('-')[0].toLowerCase())
const text = (value?: LocalizedText) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[locale.value] ?? value.en ?? Object.values(value)[0] ?? ''
}

const iconMarkup: Record<string, string> = {
  'user-round': '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  'circle-user-round': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20a5 5 0 0 1 10 0"/>',
  'user-plus': '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 8v6m3-3h-6"/>',
  'shield-check': '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11"/><path d="m9 12 2 2 4-4"/>',
  'arrow-up-right': '<path d="M7 17 17 7M7 7h10v10"/>',
}
const icon = (name?: string) => iconMarkup[name?.replace(/^@spmpst::icon::/, '') ?? ''] ?? ''
</script>

<template>
  <section class="cards-modern" :class="`cards-modern--${columns}`">
    <header class="cards-modern__heading">
      <div>
        <h1 v-html="text(title)" />
        <p v-if="description" class="cards-modern__intro" v-html="text(description)" />
      </div>
    </header>

    <h2 v-if="sectionTitle" class="cards-modern__section-title" v-html="text(sectionTitle)" />

    <div class="cards-modern__grid">
      <article v-for="(card, index) in cards" :key="`${text(card.title)}-${index}`" class="cards-modern__card">
        <div v-if="card.image" class="cards-modern__image" aria-hidden="true">
          <img :src="card.image" alt="" loading="lazy" decoding="async">
        </div>
        <div class="cards-modern__body">
          <p v-if="card.meta" class="cards-modern__meta" v-html="text(card.meta)" />
          <h3 class="cards-modern__title">
            <svg v-if="icon(card.icon)" class="cards-modern__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="icon(card.icon)" />
            <span v-html="text(card.title)" />
          </h3>
          <p class="cards-modern__description" v-html="text(card.description)" />
          <div v-if="card.actions?.length" class="cards-modern__actions">
            <FeluqaButton
              v-for="(action, actionIndex) in card.actions"
              :key="`${action.href}-${actionIndex}`"
              tag="a"
              :href="action.href"
              :color="action.color ?? (actionIndex === 0 ? 'gray' : 'primary')"
              :outlined="action.outlined ?? false"
              :size="action.size ?? 'sm'"
              :aria-label="action.iconOnly ? (text(action.tooltip) || text(action.label)) : undefined"
              :class="{ 'cards-modern__action--icon-only': action.iconOnly }"
              v-bind="action.tooltip ? { [`x-tooltip.${action.tooltipPlacement ?? 'top'}`]: text(action.tooltip) } : {}"
              :icon-position="action.iconPosition ?? 'before'"
              :target="action.external ? '_blank' : undefined"
              :rel="action.external ? 'noopener noreferrer' : undefined"
            >
              <template v-if="icon(action.icon)" #icon>
                <svg class="cards-modern__action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" v-html="icon(action.icon)" />
              </template>
              {{ text(action.label) }}
            </FeluqaButton>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.cards-modern { width: 100%; }
.cards-modern__heading h1 { margin: 0; font-size: clamp(2rem, 4vw, 3rem); font-weight: 500; letter-spacing: -.04em; line-height: 1.12; }
.cards-modern__intro { margin: .85rem 0 0; color: var(--vp-c-text-2); font-size: 1.05rem; line-height: 1.7; }
.cards-modern__section-title { margin: 3rem 0 1.5rem; padding: 0 !important; border: 0 !important; font-size: clamp(1.5rem, 2.5vw, 2rem); font-weight: 450; }
.cards-modern__grid { display: grid; grid-template-columns: repeat(var(--cards-columns, 2), minmax(0, 1fr)); gap: 1.5rem; }
.cards-modern--1 .cards-modern__grid { --cards-columns: 1; }
.cards-modern--2 .cards-modern__grid { --cards-columns: 2; }
.cards-modern--3 .cards-modern__grid { --cards-columns: 3; }
.cards-modern--4 .cards-modern__grid { --cards-columns: 4; }
.cards-modern__card { position: relative; isolation: isolate; display: flex; min-width: 0; min-height: 26.25rem; align-items: end; overflow: hidden; padding: 1.5rem; border-radius: var(--radius-md); color: #fafafa; background: #18181b; color-scheme: dark; }
.cards-modern__card::after { position: absolute; z-index: 0; inset: 0; content: ''; background: linear-gradient(180deg, rgb(9 9 11 / .12), rgb(9 9 11 / .88)); pointer-events: none; }
.cards-modern__image { position: absolute; z-index: -1; inset: 0; }
.cards-modern__image img { display: block; width: 100%; height: 100%; object-fit: cover; }
.cards-modern__body { position: relative; z-index: 1; width: 100%; }
.cards-modern__meta { margin: 0 0 .75rem; color: #d4d4d8; font-size: .75rem; }
.cards-modern__title { display: flex; align-items: center; gap: .625rem; margin: 0; color: inherit; font-size: clamp(1.25rem, 2vw, 1.625rem); font-weight: 450; line-height: 1.3; }
.cards-modern__icon { flex: none; width: 1.5rem; height: 1.5rem; }
.cards-modern__description { margin: .75rem 0 0; color: #e4e4e7; font-size: .875rem; line-height: 1.75; }
.cards-modern__actions { display: flex; flex-wrap: wrap; align-items: center; gap: .75rem; margin-top: 1.25rem; }
.cards-modern__actions :deep(.feluqa-button) { min-height: 2.25rem; font-size: .75rem; }
.cards-modern__actions :deep(.cards-modern__action--icon-only) { width: 2.25rem; min-width: 2.25rem; padding-inline: 0; }
.cards-modern__actions :deep(.cards-modern__action--icon-only .button-content) { display: none; }
.cards-modern__action-icon { width: 1rem; height: 1rem; }
@media (max-width: 760px) { .cards-modern__grid { grid-template-columns: 1fr; gap: 1rem; } .cards-modern__card { min-height: 22.5rem; padding: 1.25rem; } .cards-modern__section-title { margin-top: 2.25rem; } }
</style>
