<script setup lang="ts">
import { computed } from 'vue'
import { Content, useData } from 'vitepress'
import { useSpmpstConfig } from './useSpmpstConfig'
import generatedCollections from '@generated/collections.json'

interface AuthorLink {
  label: string
  href: string
  external?: boolean
}

interface Author {
  id: string
  name: string
  role: string
  bio: string
  avatar: string
  aboutHref: string
  links?: AuthorLink[]
}

interface Collection {
  id: string
  titles: Record<string, string>
  links: Record<string, string>
  articles: Record<string, Array<{ title: string; url: string }>>
}

const { frontmatter, lang } = useData()
const authors = useSpmpstConfig<Author[]>('extra.authors')
const locale = computed(() => String(frontmatter.value.requestedLanguage ?? lang.value).toLowerCase().split('-')[0])
const isFrench = computed(() => locale.value === 'fr')
const author = computed(() => authors.value.find((item) => item.id === frontmatter.value.author) ?? authors.value[0])
const collection = computed(() => (generatedCollections as Collection[]).find((item) => item.id === frontmatter.value.collection))
const articleCount = computed(() => collection.value?.articles[locale.value]?.length ?? collection.value?.articles.en?.length ?? 0)
const collectionTitle = computed(() => collection.value?.titles[locale.value] ?? collection.value?.titles.en ?? (isFrench.value ? 'Articles' : 'Articles'))
const collectionHref = computed(() => collection.value?.links[locale.value] ?? collection.value?.links.en ?? '/articles/')
const aboutHref = computed(() => author.value?.aboutHref ?? '/company/about-us/numerimondes')
</script>

<template>
  <div class="articles-layout">
    <aside v-if="author" class="articles-layout__sidebar">
      <a class="articles-layout__identity" :href="aboutHref">
        <img class="articles-layout__avatar" :src="author.avatar" :alt="author.name" />
        <span class="articles-layout__author-name">{{ author.name }}</span>
      </a>
      <p class="articles-layout__role">{{ author.role }}</p>
      <p class="articles-layout__bio">{{ author.bio }}</p>

      <nav class="articles-layout__nav" :aria-label="isFrench ? 'Navigation de l’auteur' : 'Author navigation'">
        <a :href="aboutHref">{{ isFrench ? 'À propos' : 'About' }}</a>
        <a :href="collectionHref">{{ collectionTitle }}</a>
        <a href="/company/contact">{{ isFrench ? 'Contact' : 'Contact' }}</a>
      </nav>

      <ul v-if="author.links?.length" class="articles-layout__links">
        <li v-for="link in author.links" :key="`${link.href}-${link.label}`">
          <a :href="link.href" :target="link.external ? '_blank' : undefined" :rel="link.external ? 'me noopener noreferrer' : undefined">
            {{ link.label }}
          </a>
        </li>
      </ul>
    </aside>

    <main class="articles-layout__main">
      <article class="articles-layout__frame">
        <header class="articles-layout__header">
          <nav class="articles-layout__crumbs" :aria-label="isFrench ? 'Fil d’Ariane' : 'Breadcrumb'">
            <a :href="collectionHref">{{ collectionTitle }}</a>
            <span aria-hidden="true">•</span>
            <span>{{ articleCount }} {{ isFrench ? 'articles' : 'articles' }}</span>
            <span aria-hidden="true">•</span>
            <a :href="aboutHref">{{ isFrench ? 'À propos de l’auteur' : 'About the author' }}</a>
          </nav>
          <div class="collection-article-actions"><PageActions /></div>
        </header>

        <div class="articles-layout__content">
          <Content class="articles-layout__prose vp-doc" />
        </div>
      </article>
    </main>
  </div>
</template>

<style>
.articles-layout {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 48px;
  align-items: start;
  width: min(calc(100% - 48px), 1056px);
  margin-inline: auto;
  padding: clamp(32px, 5vw, 56px) 0;
  color: var(--vp-c-text-1);
}

.articles-layout__sidebar { position: sticky; top: 48px; padding-top: 0; }
.articles-layout__identity { display: inline-flex; flex-direction: column; gap: 18px; color: inherit; text-decoration: none; }
.articles-layout__avatar { width: 70px; height: 70px; border-radius: 8px; object-fit: cover; }
.articles-layout__author-name { font-size: 22px; font-weight: 700; letter-spacing: -0.025em; }
.articles-layout__role { margin: 2px 0 18px; color: var(--vp-c-text-2); font-size: 16px; }
.articles-layout__bio { max-width: 220px; margin: 0 0 26px; color: var(--vp-c-text-2); font: 17px/1.7 var(--vp-font-family-base); }
.articles-layout__nav { display: grid; gap: 8px; }
.articles-layout__nav a { color: var(--vp-c-text-1); font-size: 16px; font-weight: 550; text-decoration: none; }
.articles-layout__nav a:hover, .articles-layout__links a:hover { color: var(--vp-c-brand-1); }
.articles-layout__links { display: flex; flex-wrap: wrap; gap: 12px; margin: 24px 0 0; padding: 0; list-style: none; }
.articles-layout__links a { color: var(--vp-c-text-2); font-size: 13px; text-decoration: none; }
.articles-layout__main { min-width: 0; }
.articles-layout__frame { overflow: hidden; border: 1px solid var(--vp-c-divider); border-radius: 12px; }
.articles-layout__header { display: flex; min-height: 76px; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px; border-bottom: 1px solid var(--vp-c-divider); padding: 0 44px; }
.articles-layout__crumbs { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; color: var(--vp-c-text-2); font-size: 14px; }
.articles-layout__crumbs a { color: var(--vp-c-text-1); text-decoration: none; }
.articles-layout__crumbs a:hover { color: var(--vp-c-brand-1); }
.articles-layout__header .collection-article-actions .VPDocAsideMeta { display: block !important; margin: 0; }
.articles-layout__content { max-width: 700px; margin: 0 auto; padding: 34px 44px 60px; }
.articles-layout__prose { color: var(--vp-c-text-1); font-family: var(--vp-font-family-base); font-size: 19px; line-height: 1.82; }
.articles-layout__prose h1 { margin: 0 0 20px; color: var(--vp-c-text-1); font-family: var(--vp-font-family-heading, var(--vp-font-family-base)); font-size: 40px; font-weight: 700; line-height: 1.18; letter-spacing: -0.04em; }
.articles-layout__prose h2, .articles-layout__prose h3, .articles-layout__prose h4 { color: var(--vp-c-text-1); font-family: var(--vp-font-family-heading, var(--vp-font-family-base)); letter-spacing: -0.02em; }
.articles-layout__prose p { margin: 0 0 24px; }
.articles-layout__prose a { color: var(--vp-c-brand-1); }
.articles-layout__prose :is(ul, ol) { padding-inline-start: 1.35em; }

@media (max-width: 900px) and (min-width: 761px) {
  .articles-layout { grid-template-columns: 190px minmax(0, 1fr); gap: 32px; }
  .articles-layout__header { padding-inline: 28px; }
  .articles-layout__content { padding-inline: 28px; }
}

@media (max-width: 760px) {
  .articles-layout { display: block; width: 100%; padding: 0 0 28px; }
  .articles-layout__sidebar { position: static; display: grid; grid-template-columns: 56px minmax(0, 1fr); grid-template-rows: auto auto auto auto auto; gap: 0 14px; padding: 18px 20px; }
  .articles-layout__identity { display: contents; }
  .articles-layout__avatar { width: 56px; height: 56px; border-radius: 13px; }
  .articles-layout__avatar { grid-column: 1; grid-row: 1 / span 2; }
  .articles-layout__author-name { grid-column: 2; grid-row: 1; align-self: end; overflow: hidden; font-size: 16px; white-space: nowrap; text-overflow: ellipsis; }
  .articles-layout__role { grid-column: 2; grid-row: 2; margin: 2px 0 0; font-size: 13px; }
  .articles-layout__bio, .articles-layout__nav, .articles-layout__links { grid-column: 1 / -1; max-width: none; }
  .articles-layout__bio { grid-row: 3; margin: 14px 0 0; font-size: 15px; line-height: 1.6; }
  .articles-layout__nav { display: flex; grid-row: 4; flex-wrap: wrap; gap: 18px; margin-top: 14px; }
  .articles-layout__links { grid-row: 5; display: flex; margin-top: 14px; }
  .articles-layout__nav a { font-size: 14px; }
  .articles-layout__main { padding-inline: 14px; }
  .articles-layout__frame { border-radius: 12px; }
  .articles-layout__header { min-height: 62px; padding: 14px 18px; gap: 10px; }
  .articles-layout__crumbs { gap: 8px; font-size: 12px; }
  .articles-layout__header .collection-article-actions { margin-inline-start: auto; }
  .articles-layout__content { padding: 28px 22px 48px; }
  .articles-layout__prose { font-size: 17px; line-height: 1.75; }
  .articles-layout__prose h1 { font-size: 32px; }
}
</style>
