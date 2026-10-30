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
const { theme } = useData()

function plainText(value: string): string {
  return value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim()
}

function iconFromText(value: string): string | undefined {
  return value.match(/--sidebar-group-icon-url:\s*url\((?:'|")?([^'")]+)(?:'|")?\)/)?.[1]
}

const sourceItems = computed<SidebarEntry[]>(() => {
  const sidebar = theme.value.sidebar
  if (Array.isArray(sidebar)) return sidebar as SidebarEntry[]
  if (!sidebar || typeof sidebar !== 'object') return []
  const path = route.path
  const key = Object.keys(sidebar).filter((prefix) => path.startsWith(prefix)).sort((a, b) => b.length - a.length)[0]
  return key ? (sidebar[key] as SidebarEntry[]) : []
})

const items = computed(() => sourceItems.value.flatMap((item) => {
  const label = plainText(item.text ?? item.link ?? '')
  if (item.items?.length) {
    const children = item.items.flatMap((child) => {
      if (!child.link) return []
      return [{
        value: child.link,
        label: plainText(child.text ?? child.link),
        icon: iconFromText(child.text ?? ''),
      }]
    })
    return children.length ? [{ label, ...(item.link ? { value: item.link } : {}), children }] : []
  }
  const icon = iconFromText(item.text ?? '')
  return item.link ? [{ label, value: item.link, icon }] : []
}))

const normalizePath = (path: string) => path.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/+$/, '') || '/'
const activeLink = computed(() => normalizePath(route.path))
const pathContainsRoute = (path: string) => {
  const target = normalizePath(path)
  return activeLink.value === target || activeLink.value.startsWith(`${target}/`)
}
const selectedLink = computed(() => items.value.flatMap((item) => item.children ?? [])
  .find((child) => pathContainsRoute(child.value))?.value ?? activeLink.value)
const openSection = computed(() => items.value.findIndex((item) =>
  (item.value ? pathContainsRoute(item.value) : false) || item.children?.some((child) => pathContainsRoute(child.value)),
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
