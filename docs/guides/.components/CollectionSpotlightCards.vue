<script setup lang="ts">
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import VPFlyout from 'vitepress/dist/client/theme-default/components/VPFlyout.vue';
import FeluqaButton from './FeluqaButton.vue';
import SpotlightCard from './SpotlightCard.vue';
import { useCollection } from './useCollections';

const props = defineProps<{ collectionId: string }>();
const { lang, frontmatter } = useData();
const collection = computed(() => useCollection(props.collectionId));
const locale = computed(() => String(frontmatter.value.requestedLanguage || lang.value).toLowerCase().split('-')[0]);
const search = ref('');
const category = ref('');
const sort = ref('newest');
const labels = computed(() => locale.value === 'fr'
  ? { search: 'Rechercher des articles', category: 'Toutes les catégories', sort: 'Trier par', newest: 'Plus récents', title: 'Titre', noResults: 'Aucun article ne correspond.' }
  : { search: 'Search articles', category: 'All categories', sort: 'Sort by', newest: 'Newest', title: 'Title', noResults: 'No matching articles.' });
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
    <SpotlightCard v-for="item in items" :key="item.url" class-name="collection-spotlight-card">
      <article class="collection-spotlight-card__body">
        <div class="collection-spotlight-card__meta">
          <time v-if="item.date">{{ item.date }}</time>
          <span>{{ item.wordCount }} {{ lang.toLowerCase().startsWith('fr') ? 'mots' : 'words' }}</span>
          <span>{{ item.readingTime }} {{ lang.toLowerCase().startsWith('fr') ? 'min de lecture' : 'min read' }}</span>
        </div>
        <h2><a :href="item.url">{{ item.title }}</a></h2>
        <p v-if="item.description">{{ item.description }}</p>
        <FeluqaButton tag="a" :href="item.url" color="gray" outlined size="sm">{{ lang.toLowerCase().startsWith('fr') ? 'Lire l’article' : 'Read article' }}</FeluqaButton>
      </article>
    </SpotlightCard>
  </div>
  <p v-if="!items.length" class="collection-spotlight-empty">{{ labels.noResults }}</p>
</template>

<style scoped>
.collection-spotlight-filters { display:flex; flex-wrap:wrap; align-items:center; gap:10px; margin-top:24px; }
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
.collection-spotlight-card { min-height:220px; }
.collection-spotlight-card__body { display:flex; height:100%; min-height:220px; flex-direction:column; align-items:flex-start; gap:12px; padding:24px; }
.collection-spotlight-card__meta { display:flex; flex-wrap:wrap; gap:10px; color:var(--vp-c-text-2); font-size:12px; }
.collection-spotlight-card__body h2 { margin:0; font-size:20px; }
.collection-spotlight-card__body h2 a { color:var(--vp-c-text-1); text-decoration:none; }
.collection-spotlight-card__body p { margin:0 auto 8px 0; color:var(--vp-c-text-2); font-size:14px; line-height:1.6; }
.collection-spotlight-empty { margin-top:24px; color:var(--vp-c-text-2); }
</style>
