<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, useData } from 'vitepress'
import BranchedMenu from './BranchedMenu.vue'

interface SidebarEntry {
  text?: string
  link?: string
  items?: SidebarEntry[]
}

const route = useRoute()
const router = useRouter()
const { theme, lang } = useData()

function plainText(value: string): string {
  return value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
}

const sourceItems = computed<SidebarEntry[]>(() => {
  const sidebar = theme.value.sidebar
  if (Array.isArray(sidebar)) return sidebar as SidebarEntry[]
  if (!sidebar || typeof sidebar !== 'object') return []
  const path = route.path
  const key = Object.keys(sidebar).filter((prefix) => path.startsWith(prefix)).sort((a, b) => b.length - a.length)[0]
  return key ? (sidebar[key] as SidebarEntry[]) : []
})

function leafItems(items: SidebarEntry[], parent = ''): Array<{ value: string; label: string }> {
  return items.flatMap((item) => {
    const text = plainText(item.text ?? item.link ?? '')
    const label = [parent, text].filter(Boolean).join(' / ')
    if (item.items?.length) return leafItems(item.items, label)
    return item.link ? [{ value: item.link, label }] : []
  })
}

const items = computed(() => sourceItems.value.flatMap((item) => {
  if (item.items?.length) {
    const children = [
      ...(item.link ? [{ value: item.link, label: lang.value.toLowerCase().startsWith('fr') ? 'Vue d’ensemble' : 'Overview' }] : []),
      ...leafItems(item.items),
    ]
    return children.length ? [{ label: plainText(item.text ?? ''), children }] : []
  }
  return item.link ? [{ label: plainText(item.text ?? item.link), value: item.link }] : []
}))

const normalizePath = (path: string) => path.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/+$/, '') || '/'
const activeLink = computed(() => normalizePath(route.path))
const selectedLink = computed(() => items.value.flatMap((item) => item.children ?? [])
  .find((child) => normalizePath(child.value) === activeLink.value)?.value ?? activeLink.value)
const openSection = computed(() => items.value.findIndex((item) =>
  item.children?.some((child) => normalizePath(child.value) === activeLink.value),
))

function navigate(path: string): void {
  void router.go(path)
}
</script>

<template>
  <div v-if="items.length" class="branched-sidebar">
    <BranchedMenu
      :key="route.path"
      :items="items"
      :default-open="openSection"
      :default-active="selectedLink"
      :width="248"
      :row-height="34"
      :indent="32"
      color="var(--vp-c-text-1)"
      accent-color="var(--vp-c-brand-1)"
      line-color="var(--vp-c-divider)"
      @select="(path: string) => navigate(path)"
    />
  </div>
</template>
