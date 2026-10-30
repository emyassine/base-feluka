<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import FeluqaButton from './FeluqaButton.vue';
import { useCollection } from './useCollections';

const { frontmatter, lang } = useData();
const collection = computed(() => useCollection(String(frontmatter.value.collection || '')));
const locale = computed(() => lang.value.toLowerCase().split('-')[0]);
const label = computed(() => collection.value?.titles[locale.value] ?? collection.value?.titles.en ?? 'Back');
const href = computed(() => collection.value?.links[locale.value] ?? collection.value?.links.en ?? '/');
</script>

<template>
  <nav class="collection-article-subnav" aria-label="Article navigation">
    <FeluqaButton tag="a" :href="href" color="gray" outlined size="sm">
      <span aria-hidden="true">←</span> {{ label }}
    </FeluqaButton>
    <div class="collection-article-subnav__meta">
      <time v-if="frontmatter.date" :datetime="frontmatter.date">{{ frontmatter.date }}</time>
      <span v-if="frontmatter.readingTime">{{ frontmatter.readingTime }} min read</span>
    </div>
    <span class="collection-article-subnav__rule" aria-hidden="true"></span>
  </nav>
</template>
