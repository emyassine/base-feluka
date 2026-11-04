<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import collections from '@generated/collections.json'

interface CollectionItem {
  title: string
  description: string
  summary: string
  date: string
  category: string
  status: string
  icon: string
  image: string
  imageAlt: string
  tags: string[]
  wordCount: number
  readingTime: number
  sourcePath: string
  url: string
}

interface ContentCollection {
  id: string
  titles: Record<string, string>
  descriptions: Record<string, string>
  categories: Record<string, Array<{ id: string; label: string }>>
  articles: Record<string, CollectionItem[]>
}

const props = withDefaults(defineProps<{
  collectionId: string
  searchFields?: Array<keyof CollectionItem>
}>(), {
  searchFields: () => ['title', 'description', 'summary', 'tags'],
})

const allCollections = collections as ContentCollection[]
const { lang, frontmatter } = useData()
const query = ref('')
const selectedCategory = ref('')
const sort = ref<'newest' | 'title' | 'none'>('newest')
const locale = computed(() => String(frontmatter.value.requestedLanguage || lang.value).toLowerCase().split('-')[0])
const collection = computed(() => allCollections.find((item) => item.id === props.collectionId))
const categories = computed(() => collection.value?.categories[locale.value] ?? collection.value?.categories.en ?? [])
const allItems = computed(() => collection.value?.articles[locale.value] ?? collection.value?.articles.en ?? [])
function getCategoryLabel(id: string): string {
  return categories.value.find((category) => category.id === id)?.label ?? id
}
const items = computed(() => {
  const needle = query.value.trim().toLocaleLowerCase(locale.value)
  const filtered = allItems.value.filter((item) => {
    const text = props.searchFields.map((field) => {
      const value = item[field]
      return Array.isArray(value) ? value.join(' ') : value ?? ''
    }).join(' ').toLocaleLowerCase(locale.value)
    return (!needle || text.includes(needle)) && (!selectedCategory.value || item.category === selectedCategory.value)
  })
  if (sort.value === 'title') return [...filtered].sort((a, b) => a.title.localeCompare(b.title, locale.value))
  if (sort.value === 'newest') return [...filtered].sort((a, b) => b.date.localeCompare(a.date))
  return filtered
})

function inputValue(value: unknown): string {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'target' in value) {
    const target = value.target
    if (target && typeof target === 'object' && 'value' in target && typeof target.value === 'string') return target.value
  }
  return ''
}

function setQuery(value: unknown): void {
  query.value = inputValue(value)
}

function setCategory(value: unknown): void {
  selectedCategory.value = inputValue(value)
}

function setSort(value: unknown): void {
  const next = inputValue(value)
  if (next === 'newest' || next === 'title' || next === 'none') sort.value = next
}
</script>

<template>
  <slot
    :items="items"
    :all-items="allItems"
    :collection="collection"
    :categories="categories"
    :get-category-label="getCategoryLabel"
    :query="query"
    :set-query="setQuery"
    :selected-category="selectedCategory"
    :set-category="setCategory"
    :sort="sort"
    :set-sort="setSort"
    :locale="locale"
  />
</template>
