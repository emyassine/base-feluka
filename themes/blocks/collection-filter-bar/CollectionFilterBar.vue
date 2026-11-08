<script setup lang="ts">
interface CategoryOption {
  id: string
  label: string
}

interface SortOption {
  value: string
  label: string
}

withDefaults(defineProps<{
  query: string
  categories?: CategoryOption[]
  selectedCategory?: string
  sort?: string
  queryLabel?: string
  queryPlaceholder?: string
  categoryLabel?: string
  allCategoriesLabel?: string
  sortLabel?: string
  sortOptions?: SortOption[]
}>(), {
  categories: () => [],
  selectedCategory: '',
  sort: 'none',
  queryLabel: 'Search',
  queryPlaceholder: 'Search',
  categoryLabel: 'Category',
  allCategoriesLabel: 'All categories',
  sortLabel: 'Sort',
  sortOptions: () => [],
})

const emit = defineEmits<{
  'update:query': [value: string]
  'update:selectedCategory': [value: string]
  'update:sort': [value: string]
}>()

function inputValue(event: Event): string {
  const target = event.target
  return target instanceof HTMLInputElement || target instanceof HTMLSelectElement ? target.value : ''
}
</script>

<template>
  <div class="collection-search-bar" role="search">
    <label class="collection-search-bar__query">
      <span>{{ queryLabel }}</span>
      <input
        type="search"
        :value="query"
        :placeholder="queryPlaceholder"
        @input="emit('update:query', inputValue($event))"
      />
    </label>
    <label>
      <span>{{ categoryLabel }}</span>
      <select :value="selectedCategory" @change="emit('update:selectedCategory', inputValue($event))">
        <option value="">{{ allCategoriesLabel }}</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.label }}</option>
      </select>
    </label>
    <label>
      <span>{{ sortLabel }}</span>
      <select :value="sort" @change="emit('update:sort', inputValue($event))">
        <option v-for="option in sortOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
    </label>
  </div>
</template>

<style scoped>
.collection-search-bar { display:flex; flex-wrap:wrap; align-items:end; gap:12px; margin:28px 0 22px; }
.collection-search-bar label { display:grid; gap:6px; min-width:160px; color:var(--feluqa-text-secondary); font-size:13px; }
.collection-search-bar__query { flex:1 1 260px; }
.collection-search-bar input,.collection-search-bar select { width:100%; min-height:42px; border:1px solid var(--feluqa-border); border-radius:8px; background:var(--feluqa-surface-soft); color:var(--feluqa-text-primary); padding:0 12px; font:inherit; }
.collection-search-bar input:focus,.collection-search-bar select:focus { outline:2px solid var(--feluqa-brand); outline-offset:1px; }
</style>
