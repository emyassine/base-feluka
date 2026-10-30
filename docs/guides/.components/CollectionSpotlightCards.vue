<script setup lang="ts">
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
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
    <select v-model="category" :aria-label="labels.category">
      <option value="">{{ labels.category }}</option>
      <option v-for="item in categories" :key="item.id" :value="item.id">{{ item.label }}</option>
    </select>
    <select v-model="sort" :aria-label="labels.sort">
      <option value="newest">{{ labels.newest }}</option>
      <option value="title">{{ labels.title }}</option>
    </select>
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
.collection-spotlight-filters { display:flex; flex-wrap:wrap; gap:10px; margin-top:24px; }
.collection-spotlight-filters input,.collection-spotlight-filters select { min-height:40px; border:1px solid var(--vp-c-divider); border-radius:8px; background:var(--vp-c-bg-soft); color:var(--vp-c-text-1); padding:0 12px; font:inherit; }
.collection-spotlight-filters input { flex:1 1 240px; }
.collection-spotlight-filters select { flex:0 1 200px; }
.collection-spotlight-filters input:focus,.collection-spotlight-filters select:focus { outline:2px solid var(--vp-c-brand-1); outline-offset:1px; }
.collection-spotlight-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr)); gap:18px; margin-top:28px; }
.collection-spotlight-card { min-height:220px; }
.collection-spotlight-card__body { display:flex; height:100%; min-height:220px; flex-direction:column; align-items:flex-start; gap:12px; padding:24px; }
.collection-spotlight-card__meta { display:flex; flex-wrap:wrap; gap:10px; color:var(--vp-c-text-2); font-size:12px; }
.collection-spotlight-card__body h2 { margin:0; font-size:20px; }
.collection-spotlight-card__body h2 a { color:var(--vp-c-text-1); text-decoration:none; }
.collection-spotlight-card__body p { margin:0 auto 8px 0; color:var(--vp-c-text-2); font-size:14px; line-height:1.6; }
.collection-spotlight-empty { margin-top:24px; color:var(--vp-c-text-2); }
</style>
