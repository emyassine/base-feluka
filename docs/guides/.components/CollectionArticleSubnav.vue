<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import FeluqaButton from './FeluqaButton.vue';
import { useCollection } from './useCollections';

const { frontmatter, lang, page } = useData();
const collection = computed(() => useCollection(String(frontmatter.value.collection || '')));
const isArticle = computed(() => collection.value?.layout === 'article');
const locale = computed(() => lang.value.toLowerCase().split('-')[0]);
const label = computed(() => collection.value?.titles[locale.value] ?? collection.value?.titles.en ?? 'Back');
const href = computed(() => collection.value?.links[locale.value] ?? collection.value?.links.en ?? '/');
const headings = computed(() => (page.value.headers ?? []).filter((heading) => heading.level === 2));
const readingLabel = computed(() => locale.value === 'fr' ? 'min de lecture' : 'min read');
const wordLabel = computed(() => locale.value === 'fr' ? 'mots' : 'words');
</script>

<template>
  <nav v-if="isArticle" class="collection-article-subnav" :aria-label="locale === 'fr' ? 'Navigation de l’article' : 'Article navigation'">
    <FeluqaButton tag="a" :href="href" color="gray" outlined size="sm">
      <template #icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg></template>
      {{ label }}
    </FeluqaButton>
    <div class="collection-article-subnav__sections" aria-label="On this article">
      <a v-for="heading in headings" :key="heading.slug" :href="`#${heading.slug}`">{{ heading.title }}</a>
    </div>
    <div class="collection-article-subnav__meta">
      <span v-if="frontmatter.wordCount">{{ frontmatter.wordCount }} {{ wordLabel }}</span>
      <span v-if="frontmatter.readingTime">{{ frontmatter.readingTime }} {{ readingLabel }}</span>
    </div>
  </nav>
</template>
