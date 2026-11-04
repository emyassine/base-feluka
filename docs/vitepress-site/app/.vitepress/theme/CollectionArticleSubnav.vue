<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import collections from '@generated/collections.json'

interface Collection {
  id: string
  layout: string
  links: Record<string, string>
  titles: Record<string, string>
  articles: Record<string, Array<{ title: string; url: string }>>
}
interface SidebarEntry { text?: string; link?: string; items?: SidebarEntry[] }

const { frontmatter, lang, page, theme } = useData()
const route = useRoute()
const collection = computed(() => (collections as Collection[]).find((item) => item.id === frontmatter.value.collection))
const isArticle = computed(() => collection.value?.layout === 'article')
const isHomeSubheader = computed(() => frontmatter.value.pageLayout === 'home-subheader')
const locale = computed(() => String(frontmatter.value.requestedLanguage || lang.value).toLowerCase().split('-')[0])
const label = computed(() => collection.value?.titles[locale.value] ?? collection.value?.titles.en ?? 'Back')
const href = computed(() => collection.value?.links[locale.value] ?? collection.value?.links.en ?? '/')
const headings = computed(() => (page.value.headers ?? []).filter((heading) => heading.level === 2))
const readingLabel = computed(() => locale.value === 'fr' ? 'min de lecture' : 'min read')
const wordLabel = computed(() => locale.value === 'fr' ? 'mots' : 'words')
const withAnd = (value: string) => value.replace(/\s*&\s*/g, ' and ')

const collectionLinks = computed(() => {
  const articles = collection.value?.articles[locale.value] ?? collection.value?.articles.en ?? []
  return articles.flatMap((article) => article.title && article.url
    ? [{ text: withAnd(article.title), link: article.url }]
    : [])
})

const guideLinks = computed(() => {
  const sidebar = theme.value.sidebar as Record<string, SidebarEntry[] | SidebarEntry> | SidebarEntry[] | undefined
  if (!sidebar) return []
  const entries = Array.isArray(sidebar)
    ? sidebar
    : (() => {
        const keys = Object.keys(sidebar).filter((key) => route.path.startsWith(key) && key !== '/' && key !== '')
        const root = keys.sort((a, b) => a.length - b.length)[0]
        const selected = root ? sidebar[root] : undefined
        return Array.isArray(selected) ? selected : selected ? [selected] : []
      })()
  const flatten = (items: SidebarEntry[]): Array<{ text: string; link: string }> => items.flatMap((item) => {
    if (item.items?.length) return flatten(item.items)
    if (!item.link || !item.text || /^(?:https?:)?\/\//i.test(item.link)) return []
    return [{ text: withAnd(item.text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim()), link: item.link }]
  })
  const segments = route.path.split('/').filter(Boolean)
  const localized = segments[0] && ['en', 'fr', 'ar', 'es'].includes(segments[0])
  const guide = localized ? segments[1] : segments[0]
  const guidePrefixes = [`/${guide}/`, ...(localized ? [`/${segments[0]}/${guide}/`] : [])]
  const seen = new Set<string>()
  return flatten(entries).filter((item) => {
    const path = item.link.replace(/\/$/, '')
    if (!guidePrefixes.some((prefix) => path.startsWith(prefix) || path === prefix.slice(0, -1)) || seen.has(path)) return false
    seen.add(path)
    return true
  })
})
const subheaderLinks = computed(() => collection.value ? collectionLinks.value : guideLinks.value)
const currentPath = computed(() => route.path.replace(/\/$/, '') || '/')
const isCurrentPage = (link: string) => currentPath.value === link.replace(/\/$/, '')
</script>

<template>
  <nav v-if="isHomeSubheader" class="collection-article-subnav collection-article-subnav--home" :aria-label="locale === 'fr' ? 'Navigation du guide' : 'Guide navigation'">
    <div class="collection-article-subnav__inner">
      <div class="collection-article-subnav__sections">
        <a v-for="item in subheaderLinks" :key="item.link" :href="item.link" :aria-current="isCurrentPage(item.link) ? 'page' : undefined">{{ item.text }}</a>
      </div>
      <div class="collection-article-actions"><slot name="actions" /></div>
    </div>
  </nav>
  <nav v-else-if="isArticle" class="collection-article-subnav" :aria-label="locale === 'fr' ? 'Navigation de l’article' : 'Article navigation'">
    <div class="collection-article-subnav__inner">
      <FeluqaButton tag="a" :href="href" color="gray" outlined size="sm">
        <template #icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg></template>
        {{ label }}
      </FeluqaButton>
      <div class="collection-article-subnav__sections" :aria-label="locale === 'fr' ? 'Sur cet article' : 'On this article'">
        <a v-for="heading in headings" :key="heading.slug" :href="`#${heading.slug}`">{{ heading.title }}</a>
      </div>
      <div class="collection-article-subnav__meta">
        <span v-if="frontmatter.wordCount">{{ frontmatter.wordCount }} {{ wordLabel }}</span>
        <span v-if="frontmatter.readingTime">{{ frontmatter.readingTime }} {{ readingLabel }}</span>
      </div>
      <div class="collection-article-actions"><slot name="actions" /></div>
    </div>
  </nav>
</template>

