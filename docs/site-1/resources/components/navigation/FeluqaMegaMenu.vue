<script setup lang="ts">
import { computed } from 'vue'
import type { DefaultTheme } from 'vitepress/theme'
import NativeVPFlyout from 'vitepress/dist/client/theme-default/components/VPFlyout.vue'
import { menuTemplates } from '@generated/theme'

const props = defineProps<{
  item: DefaultTheme.NavItemWithChildren
  menuTemplate?: [string, string[]]
}>()

const template = computed<[string, string[]]>(() => props.menuTemplate ?? ['mega.cards', ['title', 'icon', 'image', 'description', 'children']])
const fields = computed(() => new Set(template.value[1] ?? []))
const layout = computed(() => (menuTemplates as Record<string, { layout?: string }>)[template.value[0]]?.layout ?? 'cards')
const children = computed(() => props.item.items ?? [])
// Temporary fixture: repeat the current catalog three times to preview a fuller menu.
const displayChildren = computed(() => Array.from({ length: 3 }, () => children.value).flat())
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
  <NativeVPFlyout class="VPNavBarMenuGroup FeluqaMegaMenu" :button="String(props.item.text ?? '')">
    <div class="FeluqaMegaMenu__body" role="menu">
      <div v-if="layout === 'cards'" class="FeluqaMegaMenu__cards">
        <a v-for="(child, index) in displayChildren" :key="`${href(child) ?? String(child.text)}-${index}`" :href="href(child)" class="FeluqaMegaMenu__card" role="menuitem">
          <img v-if="has('image') && field(child, 'image')" :src="String(field(child, 'image'))" alt="">
          <img v-if="has('icon') && field(child, 'icon')" :src="String(field(child, 'icon'))" alt="" class="FeluqaMegaMenu__icon">
          <strong>{{ field(child, 'title') }}</strong>
          <span v-if="has('description') && field(child, 'description')">{{ field(child, 'description') }}</span>
        </a>
      </div>

      <div v-else-if="layout === 'columns'" class="FeluqaMegaMenu__columns">
        <section v-for="(column, index) in displayChildren" :key="`${String(column.text)}-${index}`"><h3>{{ field(column, 'title') }}</h3>
          <a v-for="(child, childIndex) in ('items' in column ? column.items : [column])" :key="`${href(child) ?? String(child.text)}-${childIndex}`" :href="href(child)" class="FeluqaMegaMenu__line">
            <img v-if="has('icon') && field(child, 'icon')" :src="String(field(child, 'icon'))" alt=""><span>{{ field(child, 'title') }}</span><small v-if="has('description') && field(child, 'description')">{{ field(child, 'description') }}</small>
          </a>
        </section>
      </div>

      <div v-else-if="layout === 'featured'" class="FeluqaMegaMenu__featured">
        <section><a v-for="(child, index) in displayChildren.slice(0, -1)" :key="`${href(child) ?? String(child.text)}-${index}`" :href="href(child)" class="FeluqaMegaMenu__line"><img v-if="has('icon') && field(child, 'icon')" :src="String(field(child, 'icon'))" alt=""><span>{{ field(child, 'title') }}</span></a></section>
        <article v-if="displayChildren.at(-1)"><img v-if="has('image') && field(displayChildren.at(-1), 'image')" :src="String(field(displayChildren.at(-1), 'image'))" alt=""><div><h3>{{ field(displayChildren.at(-1), 'title') }}</h3><p>{{ field(displayChildren.at(-1), 'description') }}</p><a :href="href(displayChildren.at(-1))">Read more →</a></div></article>
      </div>

      <div v-else-if="layout === 'events'" class="FeluqaMegaMenu__events">
        <a v-for="(event, index) in displayChildren" :key="`${href(event) ?? String(event.text)}-${index}`" :href="href(event)" class="FeluqaMegaMenu__event"><strong>{{ field(event, 'date') }}</strong><span><b>{{ field(event, 'title') }}</b><small>{{ field(event, 'location') }}</small></span></a>
      </div>
      <div v-else-if="layout === 'background'" class="FeluqaMegaMenu__background-grid">
        <a v-for="(child, index) in displayChildren" :key="`${href(child) ?? String(child.text)}-${index}`" :href="href(child)" class="FeluqaMegaMenu__background-card" :style="{ backgroundImage: `linear-gradient(180deg, rgb(0 0 0 / .04), rgb(0 0 0 / .82)), url(${String(field(child, 'image') ?? '')})` }">
          <img v-if="has('icon') && field(child, 'icon')" :src="String(field(child, 'icon'))" alt="" class="FeluqaMegaMenu__background-icon">
          <span><strong>{{ field(child, 'title') }}</strong><small>{{ field(child, 'description') }}</small></span>
        </a>
      </div>
    </div>
  </NativeVPFlyout>
</template>

<style scoped>
.FeluqaMegaMenu__body { width: min(960px, calc(100vw - 32px)); min-width: 0; padding: 8px; color: var(--vp-c-text-1); box-sizing: border-box; }
:deep(.menu) { right: auto !important; left: 50% !important; transform: translate(-50%, 0) !important; }
:deep(.button), :deep(.button:hover), :deep(.text), :deep(.VPFlyout:hover .text), :deep(.VPFlyout.active .text) { color: var(--vp-c-text-1) !important; }
.FeluqaMegaMenu__cards { display: grid; width: 100%; min-width: 0; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; align-items: stretch; }
.FeluqaMegaMenu__card { display: flex; width: 100%; min-width: 0; min-height: 126px; box-sizing: border-box; flex-direction: column; gap: 7px; padding: 14px; border: 1px solid var(--vp-c-divider); border-radius: 10px; color: var(--vp-c-text-1) !important; text-decoration: none; }
.FeluqaMegaMenu__card:hover { border-color: var(--vp-c-brand-1); }
.FeluqaMegaMenu__card > img:first-child { width: 100%; height: 90px; object-fit: cover; border-radius: 7px; }
.FeluqaMegaMenu__icon, .FeluqaMegaMenu__line img { width: 20px; height: 20px; object-fit: contain; }
.FeluqaMegaMenu__card strong, .FeluqaMegaMenu__card span, .FeluqaMegaMenu__line small, .FeluqaMegaMenu__featured p, .FeluqaMegaMenu__event small { min-width: 0; max-width: 100%; overflow-wrap: anywhere; word-break: break-word; }
.FeluqaMegaMenu__card strong { color: var(--vp-c-text-1); }
.FeluqaMegaMenu__card span, .FeluqaMegaMenu__line small, .FeluqaMegaMenu__featured p, .FeluqaMegaMenu__event small { color: var(--vp-c-text-2); font-size: .82rem; }
.FeluqaMegaMenu__card span { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 3; text-overflow: ellipsis; }
.FeluqaMegaMenu__columns, .FeluqaMegaMenu__featured { display: grid; grid-template-columns: repeat(3, 1fr); }
.FeluqaMegaMenu__columns section, .FeluqaMegaMenu__featured > section, .FeluqaMegaMenu__featured article { padding: 14px 18px; border-right: 1px solid var(--vp-c-divider); }
.FeluqaMegaMenu__columns section:last-child, .FeluqaMegaMenu__featured article { border-right: 0; }
h3 { margin: 0 0 12px; font-size: .95rem; }
.FeluqaMegaMenu__line { display: flex; flex-wrap: wrap; align-items: center; gap: 9px; padding: 8px 0; color: var(--vp-c-text-1) !important; text-decoration: none; }
.FeluqaMegaMenu__line small { flex-basis: 100%; padding-left: 29px; }
.FeluqaMegaMenu__featured { grid-template-columns: 1fr 2fr; }.FeluqaMegaMenu__featured article { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }.FeluqaMegaMenu__featured article img { width: 100%; height: 170px; object-fit: cover; border-radius: 8px; }.FeluqaMegaMenu__featured article a { color: var(--vp-c-brand-1); }
.FeluqaMegaMenu__events { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 20px; padding: 14px 18px; }.FeluqaMegaMenu__event { display: flex; gap: 12px; padding: 10px; color: var(--vp-c-text-1) !important; text-decoration: none; }.FeluqaMegaMenu__event strong { min-width: 54px; color: var(--vp-c-brand-1); }.FeluqaMegaMenu__event span { display: grid; gap: 3px; }
.FeluqaMegaMenu__background-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.FeluqaMegaMenu__background-card { display: flex; min-width: 0; min-height: 220px; box-sizing: border-box; flex-direction: column; justify-content: space-between; padding: 18px; border-radius: 10px; background-position: center; background-size: cover; color: white !important; text-decoration: none; }
.FeluqaMegaMenu__background-card span { display: grid; gap: 6px; min-width: 0; }.FeluqaMegaMenu__background-card strong { overflow-wrap: anywhere; font-size: 1.05rem; }.FeluqaMegaMenu__background-card small { display: -webkit-box; overflow: hidden; color: rgb(255 255 255 / .82); -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
.FeluqaMegaMenu__background-icon { width: 28px; height: 28px; object-fit: contain; filter: brightness(0) invert(1); }
@media (max-width: 768px) { .FeluqaMegaMenu__body { width: min(600px, calc(100vw - 32px)); }.FeluqaMegaMenu__cards, .FeluqaMegaMenu__columns, .FeluqaMegaMenu__featured, .FeluqaMegaMenu__events { grid-template-columns: 1fr; } }
</style>
