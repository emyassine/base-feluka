<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import FeluqaButton from './FeluqaButton.vue';
import SpotlightCard from './SpotlightCard.vue';
import { useCollection } from './useCollections';

const props = defineProps<{ collectionId: string }>();
const { lang } = useData();
const collection = computed(() => useCollection(props.collectionId));
const locale = computed(() => lang.value.toLowerCase().split('-')[0]);
const items = computed(() => collection.value?.articles[locale.value] ?? collection.value?.articles.en ?? []);
</script>

<template>
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
</template>

<style scoped>
.collection-spotlight-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr)); gap:18px; margin-top:28px; }
.collection-spotlight-card { min-height:220px; }
.collection-spotlight-card__body { display:flex; height:100%; min-height:220px; flex-direction:column; align-items:flex-start; gap:12px; padding:24px; }
.collection-spotlight-card__meta { display:flex; flex-wrap:wrap; gap:10px; color:var(--vp-c-text-2); font-size:12px; }
.collection-spotlight-card__body h2 { margin:0; font-size:20px; }
.collection-spotlight-card__body h2 a { color:var(--vp-c-text-1); text-decoration:none; }
.collection-spotlight-card__body p { margin:0 auto 8px 0; color:var(--vp-c-text-2); font-size:14px; line-height:1.6; }
</style>
