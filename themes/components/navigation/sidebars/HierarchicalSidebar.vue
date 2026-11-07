<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, useData } from 'vitepress'
import type { BranchedMenuChild, BranchedMenuItem } from '../menus/HierarchicalMenu.vue'

interface SidebarEntry {
  text?: string
  link?: string
  items?: SidebarEntry[]
}

const route = useRoute()
const router = useRouter()
const { theme, frontmatter } = useData()
const jsEvents = computed(() => {
  const events = frontmatter.value['js-events']
  return Array.isArray(events) ? events.filter((event): event is string => typeof event === 'string') : []
})

function plainText(value: string): string {
  return value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
}

function iconFromText(value: string): string | undefined {
  return value.match(/--sidebar-group-icon-url:\s*url\((?:'|")?([^'")]+)(?:'|")?\)/)?.[1]
}

function pageItems(entries: SidebarEntry[]): BranchedMenuChild[] {
  return entries.flatMap((entry) => {
    if (entry.items?.length) return pageItems(entry.items)
    if (!entry.link) return []
    return [{ value: entry.link, label: plainText(entry.text ?? entry.link), icon: iconFromText(entry.text ?? '') }]
  })
}

function toMenuItem(entry: SidebarEntry): BranchedMenuItem | null {
  const label = plainText(entry.text ?? entry.link ?? '')
  if (entry.items?.length) {
    const children = pageItems(entry.items)
    return children.length ? { label, children } : null
  }
  return entry.link ? { label, value: entry.link, icon: iconFromText(entry.text ?? '') } : null
}

const sourceItems = computed<SidebarEntry[]>(() => {
  if (frontmatter.value.sidebar === false) return []
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
const selectedChild = computed(() => {
  const children = items.value.flatMap((item) => item.children ?? [])
  const routeChild = children.find((child) => pathContainsRoute(child.value))
  if (routeChild) return routeChild

  // Generated directory entry pages reuse their first child page's frontmatter.
  // Use its sidebar title so the page still appears selected at the entry URL.
  const entryTitle = frontmatter.value.search === false
    ? plainText(String(frontmatter.value.sidebarTitle ?? ''))
    : ''
  return entryTitle ? children.find((child) => child.label === entryTitle) : undefined
})
const selectedLink = computed(() => selectedChild.value?.value
  ?? items.value.find((item) => pathContainsRoute(item.value))?.value
  ?? activeLink.value)
const openSection = computed(() => {
  const selected = items.value.findIndex((item) =>
    item.children?.some((child) => child.value === selectedLink.value || pathContainsRoute(child.value)),
  )
  return selected >= 0 ? selected : items.value.findIndex((item) => item.children?.length)
})
const defaultOpenSections = computed(() => jsEvents.value.includes('uncollapse-sidebar')
  ? items.value.flatMap((item, index) => item.children?.length ? [index] : [])
  : openSection.value)

function dispatchFrontmatterEvents(): void {
  for (const eventName of jsEvents.value) {
    window.dispatchEvent(new CustomEvent(`js-event:${eventName}`, { detail: frontmatter.value }))
  }
}

onMounted(dispatchFrontmatterEvents)
watch(() => route.path, dispatchFrontmatterEvents, { flush: 'post' })

function navigate(path: string): void {
  void router.go(path)
}
</script>

<template>
  <div v-if="frontmatter.sidebar !== false && items.length" class="branched-sidebar">
    <HierarchicalMenu
      :key="route.path"
      :items="items"
      :default-open="defaultOpenSections"
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
