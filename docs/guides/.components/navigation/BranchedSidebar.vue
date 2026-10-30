<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter, useData } from 'vitepress'
import BranchedMenu from './BranchedMenu.vue'
import type { BranchedMenuItem } from './BranchedMenu.vue'

interface SidebarEntry {
  text?: string
  link?: string
  items?: SidebarEntry[]
}

const route = useRoute()
const router = useRouter()
const { theme } = useData()

function plainText(value: string): string {
  return value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
}

function iconFromText(value: string): string | undefined {
  return value.match(/--sidebar-group-icon-url:\s*url\((?:'|")?([^'")]+)(?:'|")?\)/)?.[1]
}

function toMenuItem(entry: SidebarEntry): BranchedMenuItem | null {
  const label = plainText(entry.text ?? entry.link ?? '')
  const icon = iconFromText(entry.text ?? '')
  if (entry.items?.length) {
    const children = entry.items.flatMap((child) => {
      const item = toMenuItem(child)
      return item ? [item] : []
    })
    return children.length ? { label, ...(entry.link ? { value: entry.link } : {}), ...(icon ? { icon } : {}), children } : null
  }
  return entry.link ? { label, value: entry.link, ...(icon ? { icon } : {}) } : null
}

const sourceItems = computed<SidebarEntry[]>(() => {
  const sidebar = theme.value.sidebar
  if (Array.isArray(sidebar)) return sidebar as SidebarEntry[]
  if (!sidebar || typeof sidebar !== 'object') return []
  const path = route.path
  const key = Object.keys(sidebar).filter((prefix) => path.startsWith(prefix)).sort((a, b) => b.length - a.length)[0]
  return key ? (sidebar[key] as SidebarEntry[]) : []
})

const items = computed(() => sourceItems.value.flatMap((entry) => {
  const item = toMenuItem(entry)
  return item ? [item] : []
}))

const normalizePath = (path: string) => path.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/+$/, '') || '/'
const activeLink = computed(() => normalizePath(route.path))
const pathContainsRoute = (path?: string) => {
  if (!path) return false
  const target = normalizePath(path)
  return activeLink.value === target || activeLink.value.startsWith(`${target}/`)
}
function findSelected(items: BranchedMenuItem[]): string | undefined {
  for (const item of items) {
    if (item.children?.length) {
      const child = findSelected(item.children)
      if (child) return child
    } else if (item.value && pathContainsRoute(item.value)) {
      return item.value
    }
  }
  return undefined
}
const selectedLink = computed(() => findSelected(items.value) ?? activeLink.value)
const openSection = computed(() => items.value.findIndex((item) =>
  (item.value ? pathContainsRoute(item.value) : false) || Boolean(item.children?.some((child) =>
    (child.value ? pathContainsRoute(child.value) : false) || (child.children?.length ? findSelected([child]) : false),
  )),
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
