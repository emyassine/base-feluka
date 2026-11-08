<script setup lang="ts">
import { computed } from 'vue'
import type { DefaultTheme } from 'vitepress/theme'
import { useData } from 'vitepress'
import NativeVPFlyout from 'vitepress/dist/client/theme-default/components/VPFlyout.vue'
import NativeVPNavScreenMenuGroup from 'vitepress/dist/client/theme-default/components/VPNavScreenMenuGroup.vue'
import { menuTemplates } from '@generated/theme'

type CompositionColumn = Array<number | 'more'> | { width?: string; gap?: number; items: Array<number | 'more'> }

type MenuOptions = {
  mobileToo?: boolean
  maxItems?: number
  cardHeight?: number
  composition?: { columns: CompositionColumn[] }
  more?: { image?: string; text?: string | Record<string, string>; link?: string; position?: 'before' | 'after' }
}

type ComposedCard =
  | { kind: 'child'; item: DefaultTheme.NavItem; key: string }
  | { kind: 'more'; item: NonNullable<MenuOptions['more']>; key: string }

const props = defineProps<{
  item: DefaultTheme.NavItemWithChildren
  menuTemplate?: [string, string[], MenuOptions?]
  screenMenu?: boolean
}>()

const { lang } = useData()
const template = computed<[string, string[], MenuOptions?]>(() => props.menuTemplate ?? ['mega.cards', ['title', 'icon', 'image', 'description', 'children'], {}])
const fields = computed(() => new Set(template.value[1] ?? []))
const layout = computed(() => (menuTemplates as Record<string, { layout?: string }>)[template.value[0]]?.layout ?? 'cards')
const children = computed(() => props.item.items ?? [])
const options = computed(() => template.value[2] ?? {})
const totalCount = computed(() => children.value.length)
const more = computed(() => options.value.more)
const displayChildren = computed(() => {
  const childLimit = options.value.maxItems && more.value
    ? Math.max(0, options.value.maxItems - 1)
    : options.value.maxItems
  return childLimit === undefined ? children.value : children.value.slice(0, childLimit)
})
const cardHeight = computed(() => options.value.cardHeight ?? 260)
function compositionItems(column: CompositionColumn): Array<number | 'more'> {
  return Array.isArray(column) ? column : column.items
}
function defaultCompositionWidth(): string {
  return '1fr'
}
const composedColumns = computed(() => (options.value.composition?.columns ?? []).map((column, columnIndex) => ({
  width: Array.isArray(column) ? defaultCompositionWidth() : column.width ?? defaultCompositionWidth(),
  gap: Array.isArray(column) ? 12 : column.gap ?? 12,
  cards: compositionItems(column).map<ComposedCard | null>((entry, itemIndex) => {
    if (entry === 'more') return more.value ? { kind: 'more', item: more.value, key: `more-${columnIndex}-${itemIndex}` } : null
    const item = children.value[entry]
    return item ? { kind: 'child', item, key: `${href(item) ?? String(item.text)}-${entry}` } : null
  }).filter((card): card is ComposedCard => card !== null),
})))
const backgroundGridStyle = computed(() => ({
  gridTemplateColumns: composedColumns.value.length
    ? composedColumns.value.map((column) => column.width).join(' ')
    : `repeat(${Math.min(3, Math.max(1, displayChildren.value.length + (more.value ? 1 : 0)))}, minmax(0, 1fr))`,
}))
const mobileToo = computed(() => options.value.mobileToo !== false)
const morePosition = computed(() => more.value?.position === 'before' ? 'before' : 'after')
function localized(value: string | Record<string, string> | undefined): string {
  if (typeof value === 'string') return value.replace('{number}', String(totalCount.value))
  return (value?.[lang.value] ?? value?.en ?? Object.values(value ?? {})[0] ?? '').replace('{number}', String(totalCount.value))
}
const label = computed(() => text(props.item.text))

function text(value: unknown): string {
  return String(value ?? '').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
}
function field(item: DefaultTheme.NavItem, name: string): unknown {
  if (name === 'title' || name === 'text') return text(item.text)
  return (item as Record<string, unknown>)[name]
}
function has(name: string): boolean { return fields.value.has(name) }
function href(item: DefaultTheme.NavItem): string | undefined { return 'link' in item ? item.link : undefined }
</script>

<template>
  <NativeVPNavScreenMenuGroup v-if="props.screenMenu && !mobileToo" :text="String(props.item.text ?? '')" :items="props.item.items ?? []" />
  <NativeVPFlyout v-else class="VPNavBarMenuGroup MegaMenu" :button="String(props.item.text ?? '')">
    <div class="MegaMenu__body" role="menu" :style="{ '--mega-card-height': `${cardHeight}px` }">
      <div v-if="layout === 'cards'" class="MegaMenu__cards">
        <a v-for="(child, index) in displayChildren" :key="`${href(child) ?? String(child.text)}-${index}`" :href="href(child)" class="MegaMenu__card" role="menuitem">
          <img v-if="has('image') && field(child, 'image')" :src="String(field(child, 'image'))" alt="">
          <img v-if="has('icon') && field(child, 'icon')" :src="String(field(child, 'icon'))" alt="" class="MegaMenu__icon">
          <strong>{{ field(child, 'title') }}</strong>
          <span v-if="has('description') && field(child, 'description')">{{ field(child, 'description') }}</span>
        </a>
      </div>

      <div v-else-if="layout === 'columns'" class="MegaMenu__columns">
        <section v-for="(column, index) in displayChildren" :key="`${String(column.text)}-${index}`"><h3>{{ field(column, 'title') }}</h3>
          <a v-for="(child, childIndex) in ('items' in column ? column.items : [column])" :key="`${href(child) ?? String(child.text)}-${childIndex}`" :href="href(child)" class="MegaMenu__line">
            <img v-if="has('icon') && field(child, 'icon')" :src="String(field(child, 'icon'))" alt=""><span>{{ field(child, 'title') }}</span><small v-if="has('description') && field(child, 'description')">{{ field(child, 'description') }}</small>
          </a>
        </section>
      </div>

      <div v-else-if="layout === 'featured'" class="MegaMenu__featured">
        <section><a v-for="(child, index) in displayChildren.slice(0, -1)" :key="`${href(child) ?? String(child.text)}-${index}`" :href="href(child)" class="MegaMenu__line"><img v-if="has('icon') && field(child, 'icon')" :src="String(field(child, 'icon'))" alt=""><span>{{ field(child, 'title') }}</span></a></section>
        <article v-if="displayChildren.at(-1)"><img v-if="has('image') && field(displayChildren.at(-1), 'image')" :src="String(field(displayChildren.at(-1), 'image'))" alt=""><div><h3>{{ field(displayChildren.at(-1), 'title') }}</h3><p>{{ field(displayChildren.at(-1), 'description') }}</p><a :href="href(displayChildren.at(-1))">Read more →</a></div></article>
      </div>

      <div v-else-if="layout === 'events'" class="MegaMenu__events">
        <a v-for="(event, index) in displayChildren" :key="`${href(event) ?? String(event.text)}-${index}`" :href="href(event)" class="MegaMenu__event"><strong>{{ field(event, 'date') }}</strong><span><b>{{ field(event, 'title') }}</b><small>{{ field(event, 'location') }}</small></span></a>
      </div>
      <div v-else-if="layout === 'background'" class="MegaMenu__background-grid" :style="backgroundGridStyle">
        <template v-if="options.composition">
          <div v-for="(column, columnIndex) in composedColumns" :key="`composition-column-${columnIndex}`" class="MegaMenu__background-column" :style="{ gap: `${column.gap}px`, gridTemplateRows: `repeat(${column.cards.length}, minmax(0, 1fr))` }">
            <a v-for="card in column.cards" :key="card.key" :href="card.kind === 'more' ? card.item.link ?? '#' : href(card.item)" class="MegaMenu__background-card">
              <img class="MegaMenu__background-image" :src="String(card.kind === 'more' ? card.item.image ?? '' : field(card.item, 'image') ?? '')" alt="">
              <img v-if="card.kind === 'child' && has('icon') && field(card.item, 'icon')" :src="String(field(card.item, 'icon'))" alt="" class="MegaMenu__background-icon">
              <span><strong>{{ card.kind === 'more' ? localized(card.item.text) : field(card.item, 'title') }}</strong><small v-if="card.kind === 'more'" class="MegaMenu__more-hint">Explore the full product catalog <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg></small><small v-else>{{ field(card.item, 'description') }}</small></span>
            </a>
          </div>
        </template>
        <template v-else>
        <a v-if="more && morePosition === 'before'" :href="more.link ?? '#'" class="MegaMenu__background-card MegaMenu__more-card">
          <img class="MegaMenu__background-image" :src="more.image ?? ''" alt="">
          <span><strong>{{ localized(more.text) }}</strong><small class="MegaMenu__more-hint">Explore the full product catalog <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg></small></span>
        </a>
        <a v-for="(child, index) in displayChildren" :key="`${href(child) ?? String(child.text)}-${index}`" :href="href(child)" class="MegaMenu__background-card">
          <img class="MegaMenu__background-image" :src="String(field(child, 'image') ?? '')" alt="">
          <img v-if="has('icon') && field(child, 'icon')" :src="String(field(child, 'icon'))" alt="" class="MegaMenu__background-icon">
          <span><strong>{{ field(child, 'title') }}</strong><small>{{ field(child, 'description') }}</small></span>
        </a>
        <a v-if="more && morePosition === 'after'" :href="more.link ?? '#'" class="MegaMenu__background-card MegaMenu__more-card">
          <img class="MegaMenu__background-image" :src="more.image ?? ''" alt="">
          <span><strong>{{ localized(more.text) }}</strong><small class="MegaMenu__more-hint">Explore the full product catalog <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg></small></span>
        </a>
        </template>
      </div>
    </div>
  </NativeVPFlyout>
</template>

<style scoped>
.MegaMenu__body { width: 100%; max-width: 100%; min-width: 0; color: var(--vp-c-text-1); box-sizing: border-box; }
:deep(.menu) { position: fixed !important; top: var(--vp-nav-height) !important; right: auto !important; left: 50% !important; width: min(960px, calc(100dvw - 32px)) !important; max-width: calc(100dvw - 32px) !important; min-width: 0 !important; box-sizing: border-box; transform: translate(-50%, 0) !important; }
:deep(.menu > .VPMenu) { width: 100% !important; max-width: 100% !important; min-width: 0 !important; box-sizing: border-box; }
:deep(.button), :deep(.button:hover), :deep(.text), :deep(.VPFlyout:hover .text), :deep(.VPFlyout.active .text) { color: var(--vp-c-text-1) !important; }
.MegaMenu__cards { display: grid; width: 100%; min-width: 0; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; align-items: stretch; }
.MegaMenu__card { display: flex; width: 100%; min-width: 0; min-height: 126px; box-sizing: border-box; flex-direction: column; gap: 7px; padding: 14px; border: 1px solid var(--vp-c-divider); border-radius: 10px; color: var(--vp-c-text-1) !important; text-decoration: none; overflow: hidden; }
.MegaMenu:hover .MegaMenu__card, .MegaMenu.active .MegaMenu__card { animation: MegaMenu-card-in .36s cubic-bezier(.22, 1, .36, 1) both; }
.MegaMenu__card:nth-child(1) { animation-delay: .16s; }
.MegaMenu__card:nth-child(2) { animation-delay: .1s; }
.MegaMenu__card:nth-child(3) { animation-delay: .04s; }
.MegaMenu__card:hover { border-color: var(--vp-c-brand-1); }
.MegaMenu__card > img:first-child { width: 100%; height: 90px; object-fit: cover; border-radius: 7px; transition: transform .4s cubic-bezier(.22, 1, .36, 1); }
.MegaMenu__card:hover > img:first-child { transform: scale(1.08); }
.MegaMenu__icon, .MegaMenu__line img { width: 20px; height: 20px; object-fit: contain; }
.MegaMenu__card strong, .MegaMenu__card span, .MegaMenu__line small, .MegaMenu__featured p, .MegaMenu__event small { min-width: 0; max-width: 100%; overflow-wrap: anywhere; word-break: break-word; }
.MegaMenu__card strong { color: var(--vp-c-text-1); }
.MegaMenu__card span, .MegaMenu__line small, .MegaMenu__featured p, .MegaMenu__event small { color: var(--vp-c-text-2); font-size: .82rem; }
.MegaMenu__card span { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 3; text-overflow: ellipsis; }
.MegaMenu__columns, .MegaMenu__featured { display: grid; min-width: 0; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.MegaMenu__columns section, .MegaMenu__featured > section, .MegaMenu__featured article { padding: 14px 18px; border-right: 1px solid var(--vp-c-divider); }
.MegaMenu__columns section:last-child, .MegaMenu__featured article { border-right: 0; }
h3 { margin: 0 0 12px; font-size: .95rem; }
.MegaMenu__line { display: flex; flex-wrap: wrap; align-items: center; gap: 9px; padding: 8px 0; color: var(--vp-c-text-1) !important; text-decoration: none; }
.MegaMenu__line small { flex-basis: 100%; padding-left: 29px; }
.MegaMenu__featured { grid-template-columns: 1fr 2fr; }
.MegaMenu__featured article { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.MegaMenu__featured article img { width: 100%; height: 170px; object-fit: cover; border-radius: 8px; transition: transform .4s cubic-bezier(.22, 1, .36, 1); }
.MegaMenu__featured article img:hover { transform: scale(1.08); }
.MegaMenu__featured article div > img:hover { transform: scale(1.08); }
.MegaMenu__featured article a { color: var(--vp-c-brand-1); }
.MegaMenu__events { display: grid; min-width: 0; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2px 20px; padding: 14px 18px; }
.MegaMenu__event { display: flex; gap: 12px; padding: 10px; color: var(--vp-c-text-1) !important; text-decoration: none; }
.MegaMenu__event strong { min-width: 54px; color: var(--vp-c-brand-1); }
.MegaMenu__event span { display: grid; gap: 3px; }
.MegaMenu__background-grid { display: grid; width: 100%; min-width: 0; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.MegaMenu__background-column { display: grid; min-width: 0; min-height: 0; }
.MegaMenu__background-card { position: relative; display: flex; min-width: 0; min-height: var(--mega-card-height, 260px); box-sizing: border-box; flex-direction: column; justify-content: space-between; padding: 18px; border-radius: 10px; color: white !important; text-decoration: none; overflow: hidden; transition: box-shadow .4s cubic-bezier(.22, 1, .36, 1); }
.MegaMenu__background-card::after { position: absolute; z-index: 1; inset: 0; background: linear-gradient(180deg, rgb(0 0 0 / .04), rgb(0 0 0 / .82)); content: ''; pointer-events: none; }
.MegaMenu__background-card:hover { box-shadow: 0 12px 28px rgb(0 0 0 / .16); }
.MegaMenu__background-image { position: absolute; z-index: 0; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .45s cubic-bezier(.22, 1, .36, 1); }
.MegaMenu__background-card:hover .MegaMenu__background-image { transform: scale(1.08); }
.MegaMenu:hover .MegaMenu__background-card, .MegaMenu.active .MegaMenu__background-card { animation: MegaMenu-card-in .36s cubic-bezier(.22, 1, .36, 1) both; }
.MegaMenu__background-card:nth-child(1) { animation-delay: .16s; }
.MegaMenu__background-card:nth-child(2) { animation-delay: .1s; }
.MegaMenu__background-card:nth-child(3) { animation-delay: .04s; }
.MegaMenu__background-card:nth-child(n + 4) { animation-delay: 0s; }
.MegaMenu__background-card span { position: relative; z-index: 2; display: grid; gap: 6px; min-width: 0; }
.MegaMenu__background-card strong { overflow-wrap: anywhere; font-size: 1.05rem; }
.MegaMenu__background-card small { display: -webkit-box; overflow: hidden; color: rgb(255 255 255 / .82); -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
.MegaMenu__more-hint { display: inline-flex !important; align-items: center; gap: 6px; }
.MegaMenu__more-hint svg { width: 14px; height: 14px; flex: none; }
:dir(rtl) .MegaMenu__more-hint svg { transform: scaleX(-1); }
.MegaMenu__background-icon { position: relative; z-index: 2; width: 28px; height: 28px; object-fit: contain; filter: brightness(0) invert(1); }
@media (max-width: 768px) { :deep(.menu) { width: calc(100dvw - 24px) !important; max-width: calc(100dvw - 24px) !important; }.MegaMenu__cards, .MegaMenu__columns, .MegaMenu__featured, .MegaMenu__events, .MegaMenu__background-grid { grid-template-columns: minmax(0, 1fr) !important; }.MegaMenu__background-card { min-height: 220px; } }
@media (prefers-reduced-motion: reduce) { .MegaMenu__card, .MegaMenu__background-card, .MegaMenu__card > img, .MegaMenu__background-image { animation: none; transform: none; } }
@keyframes MegaMenu-card-in { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
</style>
