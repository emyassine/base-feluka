<script setup lang="ts">
withDefaults(defineProps<{
  isArticle?: boolean
  locale?: string
  label?: string
  href?: string
  headings?: Array<{ slug: string; title: string; level?: number }>
  wordCount?: number
  readingTime?: number
}>(), {
  isArticle: false,
  locale: 'en',
  label: 'Back',
  href: '/',
  headings: () => [],
})
</script>

<template>
  <nav v-if="isArticle" class="collection-article-subnav" :aria-label="locale === 'fr' ? 'Navigation de l’article' : 'Article navigation'">
    <div class="collection-article-subnav__inner">
      <Button tag="a" :href="href" color="gray" outlined size="sm">
        <template #icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg></template>
        {{ label }}
      </Button>
      <div class="collection-article-subnav__sections" :aria-label="locale === 'fr' ? 'Sur cet article' : 'On this article'">
        <a v-for="heading in headings" :key="heading.slug" :href="`#${heading.slug}`">{{ heading.title }}</a>
      </div>
      <div class="collection-article-subnav__meta">
        <span v-if="wordCount">{{ wordCount }} {{ locale.toLowerCase().startsWith('fr') ? 'mots' : 'words' }}</span>
        <span v-if="readingTime">{{ readingTime }} {{ locale.toLowerCase().startsWith('fr') ? 'min de lecture' : 'min read' }}</span>
      </div>
      <div class="collection-article-actions"><slot name="actions" /></div>
    </div>
  </nav>
</template>
