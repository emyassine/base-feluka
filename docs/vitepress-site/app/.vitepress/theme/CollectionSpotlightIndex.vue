<script setup lang="ts">
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import VPFlyout from 'vitepress/dist/client/theme-default/components/VPFlyout.vue';
import collections from '@generated/collections.json';

interface ContentCollection {
  id: string;
  titles: Record<string, string>;
  descriptions: Record<string, string>;
  categories: Record<string, Array<{ id: string; label: string }>>;
  articles: Record<string, Array<{ title: string; description: string; date: string; category: string; wordCount: number; readingTime: number; url: string }>>;
}

const props = defineProps<{ collectionId: string }>();
const { lang, frontmatter } = useData();
const collection = computed(() => (collections as ContentCollection[]).find((item) => item.id === props.collectionId));
const locale = computed(() => String(frontmatter.value.requestedLanguage || lang.value).toLowerCase().split('-')[0]);
const title = computed(() => collection.value?.titles[locale.value] ?? collection.value?.titles.en ?? props.collectionId);
const description = computed(() => collection.value?.descriptions[locale.value] ?? collection.value?.descriptions.en ?? '');
const search = ref('');
const category = ref('');
const sort = ref('newest');
const labels = computed(() => locale.value === 'fr'
  ? { search: 'Rechercher dans cette collection', category: 'Toutes les catégories', sort: 'Trier par', newest: 'Plus récents', title: 'Titre', noResults: 'Aucun contenu ne correspond.', read: 'Lire' }
  : { search: 'Search this collection', category: 'All categories', sort: 'Sort by', newest: 'Newest', title: 'Title', noResults: 'No matching content.', read: 'Read' });
const categories = computed(() => collection.value?.categories[locale.value] ?? collection.value?.categories.en ?? []);
const categoryLabel = computed(() => categories.value.find((item) => item.id === category.value)?.label ?? labels.value.category);
const sortLabel = computed(() => sort.value === 'title' ? labels.value.title : labels.value.newest);
const items = computed(() => {
  const source = collection.value?.articles[locale.value] ?? collection.value?.articles.en ?? [];
  const needle = search.value.trim().toLocaleLowerCase(locale.value);
  const filtered = source.filter((item) => {
    const matchesSearch = !needle || `${item.title} ${item.description}`.toLocaleLowerCase(locale.value).includes(needle);
    return matchesSearch && (!category.value || item.category === category.value);
  });
  return filtered.sort((a, b) => sort.value === 'title' ? a.title.localeCompare(b.title, locale.value) : b.date.localeCompare(a.date));
});
</script>

<template>
  <div class="collection-spotlight-page">
    <header class="collection-spotlight-header">
      <h1>{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
    </header>
    <div class="collection-spotlight-filters" role="search">
      <input v-model="search" type="search" :placeholder="labels.search" :aria-label="labels.search" />
      <VPFlyout class="collection-filter-flyout" :button="categoryLabel" :label="labels.category">
        <div class="collection-filter-options">
          <button class="collection-filter-option" type="button" role="menuitemradio" :aria-checked="String(!category)" @click="category = ''">{{ labels.category }}</button>
          <button v-for="item in categories" :key="item.id" class="collection-filter-option" type="button" role="menuitemradio" :aria-checked="String(category === item.id)" @click="category = item.id">{{ item.label }}</button>
        </div>
      </VPFlyout>
      <VPFlyout class="collection-filter-flyout" :button="sortLabel" :label="labels.sort">
        <div class="collection-filter-options">
          <button class="collection-filter-option" type="button" role="menuitemradio" :aria-checked="String(sort === 'newest')" @click="sort = 'newest'">{{ labels.newest }}</button>
          <button class="collection-filter-option" type="button" role="menuitemradio" :aria-checked="String(sort === 'title')" @click="sort = 'title'">{{ labels.title }}</button>
        </div>
      </VPFlyout>
    </div>
    <div class="collection-spotlight-grid">
      <article v-for="item in items" :key="item.url" class="collection-spotlight-card">
        <div class="collection-spotlight-card__body">
          <div class="collection-spotlight-card__meta">
            <time v-if="item.date">{{ item.date }}</time>
            <span>{{ item.wordCount }} {{ lang.toLowerCase().startsWith('fr') ? 'mots' : 'words' }}</span>
            <span>{{ item.readingTime }} {{ lang.toLowerCase().startsWith('fr') ? 'min de lecture' : 'min read' }}</span>
          </div>
          <h2><a :href="item.url">{{ item.title }}</a></h2>
          <p v-if="item.description">{{ item.description }}</p>
          <a class="collection-spotlight-card__link" :href="item.url">{{ labels.read }} {{ item.title }}</a>
        </div>
      </article>
    </div>
    <p v-if="!items.length" class="collection-spotlight-empty">{{ labels.noResults }}</p>
  </div>
</template>

<style scoped>
.collection-spotlight-filters { display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-top:0; }
.collection-spotlight-filters input { min-height:40px; border:1px solid var(--vp-c-divider); border-radius:8px; background:var(--vp-c-bg-soft); color:var(--vp-c-text-1); padding:0 12px; font:inherit; }
.collection-spotlight-filters input { flex:1 1 240px; }
.collection-spotlight-filters input:focus { outline:2px solid var(--vp-c-brand-1); outline-offset:1px; }
.collection-filter-flyout { position:relative; flex:0 1 auto; }
.collection-spotlight-filters :deep(.collection-filter-flyout .button) { height:40px; max-width:min(260px, calc(100vw - 24px)); padding:0 12px; border:1px solid var(--vp-c-divider); border-radius:8px; background:var(--vp-c-bg-soft); }
.collection-spotlight-filters :deep(.collection-filter-flyout .text) { max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.collection-spotlight-filters :deep(.collection-filter-flyout .menu) { top:calc(100% + 6px); right:0; z-index:30; }
.collection-spotlight-filters :deep(.collection-filter-flyout .VPMenu) { width:max-content; max-width:min(320px, calc(100vw - 24px)); }
.collection-filter-options { display:grid; }
.collection-filter-option { width:100%; padding:6px 12px; border:0; border-radius:6px; background:transparent; color:var(--vp-c-text-1); cursor:pointer; font:inherit; font-size:14px; line-height:28px; text-align:left; white-space:normal; overflow-wrap:anywhere; }
.collection-filter-option:hover,.collection-filter-option[aria-checked='true'] { color:var(--vp-c-brand-1); background:var(--vp-c-default-soft); }
.collection-spotlight-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr)); gap:18px; margin-top:28px; }
.collection-spotlight-card { min-height:220px; overflow:hidden; border:1px solid var(--vp-c-divider); border-radius:12px; background:var(--vp-c-bg-soft); transition:border-color .2s,box-shadow .2s,transform .2s; }
.collection-spotlight-card:hover,.collection-spotlight-card:focus-within { border-color:color-mix(in srgb, var(--vp-c-brand-1) 55%, var(--vp-c-divider)); box-shadow:0 14px 42px color-mix(in srgb, var(--vp-c-brand-1) 7%, transparent); transform:translateY(-2px); }
.collection-spotlight-card__body { display:flex; height:100%; min-height:220px; flex-direction:column; align-items:flex-start; gap:12px; padding:24px; }
.collection-spotlight-card__meta { display:flex; flex-wrap:wrap; gap:10px; color:var(--vp-c-text-2); font-size:12px; }
.collection-spotlight-card__body h2 { margin:0; font-size:20px; }
.collection-spotlight-card__body h2 a { color:var(--vp-c-text-1); text-decoration:none; }
.collection-spotlight-card__body p { margin:0 auto 8px 0; color:var(--vp-c-text-2); font-size:14px; line-height:1.6; }
.collection-spotlight-card__link { margin-top:auto; color:var(--vp-c-brand-1); font-size:14px; font-weight:600; text-decoration:none; }
.collection-spotlight-empty { margin-top:24px; color:var(--vp-c-text-2); }
</style>
