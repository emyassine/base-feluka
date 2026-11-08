<script setup lang="ts">
import { computed, ref } from 'vue'

interface SpotlightItem {
  title: string
  description?: string
  date?: string
  category?: string
  wordCount?: number
  readingTime?: number
  url: string
}

interface CategoryOption {
  id: string
  label: string
}

interface Labels {
  search: string
  category: string
  sort: string
  newest: string
  title: string
  noResults: string
  words: string
  minutes: string
  read: string
}

const props = withDefaults(defineProps<{
  items: SpotlightItem[]
  categories?: CategoryOption[]
  locale?: string
  labels?: Partial<Labels>
}>(), {
  categories: () => [],
  locale: 'en',
})

const search = ref('')
const category = ref('')
const sort = ref<'newest' | 'title'>('newest')
const fallbackLabels = computed<Labels>(() => props.locale.toLowerCase().startsWith('fr')
  ? { search: 'Rechercher des articles', category: 'Toutes les catégories', sort: 'Trier par', newest: 'Plus récents', title: 'Titre', noResults: 'Aucun article ne correspond.', words: 'mots', minutes: 'min de lecture', read: 'Lire l’article' }
  : { search: 'Search articles', category: 'All categories', sort: 'Sort by', newest: 'Newest', title: 'Title', noResults: 'No matching articles.', words: 'words', minutes: 'min read', read: 'Read article' })
const text = computed(() => ({ ...fallbackLabels.value, ...props.labels }))
const items = computed(() => {
  const needle = search.value.trim().toLocaleLowerCase(props.locale)
  const filtered = props.items.filter((item) => {
    const matchesSearch = !needle || `${item.title} ${item.description ?? ''}`.toLocaleLowerCase(props.locale).includes(needle)
    return matchesSearch && (!category.value || item.category === category.value)
  })
  return filtered.sort((left, right) => sort.value === 'title'
    ? left.title.localeCompare(right.title, props.locale)
    : (right.date ?? '').localeCompare(left.date ?? ''))
})
</script>

<template>
  <div class="collection-spotlight-filters" role="search">
    <input v-model="search" type="search" :placeholder="text.search" :aria-label="text.search" />
    <label>
      <span>{{ text.category }}</span>
      <select v-model="category" :aria-label="text.category">
        <option value="">{{ text.category }}</option>
        <option v-for="item in categories" :key="item.id" :value="item.id">{{ item.label }}</option>
      </select>
    </label>
    <label>
      <span>{{ text.sort }}</span>
      <select v-model="sort" :aria-label="text.sort">
        <option value="newest">{{ text.newest }}</option>
        <option value="title">{{ text.title }}</option>
      </select>
    </label>
  </div>
  <div class="collection-spotlight-grid">
    <SpotlightCard v-for="item in items" :key="item.url" class-name="collection-spotlight-card">
      <article class="collection-spotlight-card__body">
        <div class="collection-spotlight-card__meta">
          <time v-if="item.date">{{ item.date }}</time>
          <span v-if="item.wordCount">{{ item.wordCount }} {{ text.words }}</span>
          <span v-if="item.readingTime">{{ item.readingTime }} {{ text.minutes }}</span>
        </div>
        <h2><a :href="item.url">{{ item.title }}</a></h2>
        <p v-if="item.description">{{ item.description }}</p>
        <Button tag="a" :href="item.url" color="gray" outlined size="sm">{{ text.read }}</Button>
      </article>
    </SpotlightCard>
  </div>
  <p v-if="!items.length" class="collection-spotlight-empty">{{ text.noResults }}</p>
</template>

<style scoped>
.collection-spotlight-filters { display:flex; flex-wrap:wrap; align-items:end; gap:10px; margin-top:24px; }
.collection-spotlight-filters label { display:grid; gap:4px; color:var(--feluqa-text-secondary); font-size:12px; }
.collection-spotlight-filters input,.collection-spotlight-filters select { min-height:40px; border:1px solid var(--feluqa-border); border-radius:8px; background:var(--feluqa-surface-soft); color:var(--feluqa-text-primary); padding:0 12px; font:inherit; }
.collection-spotlight-filters input { flex:1 1 240px; }
.collection-spotlight-filters input:focus,.collection-spotlight-filters select:focus { outline:2px solid var(--feluqa-brand); outline-offset:1px; }
.collection-spotlight-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr)); gap:18px; margin-top:28px; }
.collection-spotlight-card { min-height:220px; }
:deep(.collection-spotlight-card::before),:deep(.collection-spotlight-card .spotlight-card__glow) { display:none !important; }
:deep(.collection-spotlight-card:hover),:deep(.collection-spotlight-card:focus-within) { border-color:color-mix(in srgb, var(--feluqa-brand) 55%, var(--feluqa-border)); background:transparent; box-shadow:0 14px 42px color-mix(in srgb, var(--feluqa-brand) 7%, transparent); transform:translateY(-2px); }
.collection-spotlight-card__body { display:flex; height:100%; min-height:220px; flex-direction:column; align-items:flex-start; gap:12px; padding:24px; }
.collection-spotlight-card__meta { display:flex; flex-wrap:wrap; gap:10px; color:var(--feluqa-text-secondary); font-size:12px; }
.collection-spotlight-card__body h2 { margin:0; font-size:20px; }
.collection-spotlight-card__body h2 a { color:var(--feluqa-text-primary); text-decoration:none; }
.collection-spotlight-card__body p { margin:0 auto 8px 0; color:var(--feluqa-text-secondary); font-size:14px; line-height:1.6; }
.collection-spotlight-empty { margin-top:24px; color:var(--feluqa-text-secondary); }
</style>
