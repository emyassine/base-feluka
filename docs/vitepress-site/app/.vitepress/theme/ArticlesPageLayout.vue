<script setup lang="ts">
import { computed } from 'vue'
import { Content, useData } from 'vitepress'
import { useSpmpstConfig } from './useSpmpstConfig'
import ManageCookies from './ManageCookies.vue'
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

const { frontmatter, lang, isDark } = useData()
const authors = useSpmpstConfig<Author[]>('extra.authors')
const locale = computed(() => String(frontmatter.value.requestedLanguage ?? lang.value).toLowerCase().split('-')[0])
const isFrench = computed(() => locale.value === 'fr')
const author = computed(() => authors.value.find((item) => item.id === frontmatter.value.author) ?? authors.value[0])
const collection = computed(() => (generatedCollections as Collection[]).find((item) => item.id === frontmatter.value.collection))
const articleCount = computed(() => collection.value?.articles[locale.value]?.length ?? collection.value?.articles.en?.length ?? 0)
const collectionTitle = computed(() => collection.value?.titles[locale.value] ?? collection.value?.titles.en ?? (isFrench.value ? 'Articles' : 'Articles'))
const collectionHref = computed(() => collection.value?.links[locale.value] ?? collection.value?.links.en ?? '/articles/')
const aboutHref = computed(() => author.value?.aboutHref ?? '/company/about-us/numerimondes')
const toggleTheme = () => { isDark.value = !isDark.value }
</script>

<template>
  <div class="articles-layout" :class="{ 'articles-layout--dark': isDark }">
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
          <button
            class="articles-layout__theme-toggle"
            type="button"
            :aria-label="isDark ? (isFrench ? 'Passer au thème clair' : 'Switch to light theme') : (isFrench ? 'Passer au thème sombre' : 'Switch to dark theme')"
            @click="toggleTheme"
          >
            <svg v-if="!isDark" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.4 15.5A8.5 8.5 0 0 1 8.5 3.6 8.5 8.5 0 1 0 20.4 15.5Z" /></svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>
          </button>
        </header>

        <div class="articles-layout__content">
          <div class="articles-layout__byline">
            <span v-if="author">{{ author.name }}</span>
            <span v-if="frontmatter.date">{{ frontmatter.date }}</span>
            <span v-if="frontmatter.readingTime">{{ frontmatter.readingTime }} {{ isFrench ? 'min de lecture' : 'min read' }}</span>
          </div>
          <Content class="articles-layout__prose vp-doc" />
        </div>
      </article>
    </main>
    <ManageCookies />
  </div>
</template>

<style>
.articles-layout {
  --articles-canvas: #f1f5f9;
  --articles-paper: #fff;
  --articles-ink: #1b2436;
  --articles-muted: #64748b;
  --articles-border: #dbe3ed;
  --articles-link: #0787d8;
  display: grid;
  grid-template-columns: 220px minmax(0, 792px);
  gap: 56px;
  align-items: start;
  width: min(100% - 64px, 1068px);
  min-height: 100vh;
  margin-inline: auto;
  padding: 48px 0;
  background: var(--articles-canvas);
  color: var(--articles-ink);
}

html.dark .articles-layout {
  --articles-canvas: #111827;
  --articles-paper: #171f2d;
  --articles-ink: #e5eaf2;
  --articles-muted: #9aa9bf;
  --articles-border: #344154;
  --articles-link: #60b9f4;
}

body:has(.articles-layout) { background: #f1f5f9; }
html.dark body:has(.articles-layout) { background: #111827; }
.articles-layout__sidebar { position: sticky; top: 48px; padding-top: 0; }
.articles-layout__identity { display: inline-flex; flex-direction: column; gap: 18px; color: inherit; text-decoration: none; }
.articles-layout__avatar { width: 70px; height: 70px; border-radius: 15px; object-fit: cover; }
.articles-layout__author-name { font-size: 22px; font-weight: 700; letter-spacing: -0.025em; }
.articles-layout__role { margin: 2px 0 18px; color: var(--articles-muted); font-size: 16px; }
.articles-layout__bio { max-width: 220px; margin: 0 0 26px; color: #46556b; font: 17px/1.7 Georgia, serif; }
html.dark .articles-layout__bio { color: var(--articles-muted); }
.articles-layout__nav { display: grid; gap: 8px; }
.articles-layout__nav a { color: var(--articles-ink); font-size: 16px; font-weight: 550; text-decoration: none; }
.articles-layout__nav a:hover, .articles-layout__links a:hover { color: var(--articles-link); }
.articles-layout__links { display: flex; flex-wrap: wrap; gap: 12px; margin: 24px 0 0; padding: 0; list-style: none; }
.articles-layout__links a { color: var(--articles-muted); font-size: 13px; text-decoration: none; }
.articles-layout__main { min-width: 0; }
.articles-layout__frame { overflow: hidden; min-height: calc(100vh - 96px); border: 1px solid var(--articles-border); border-radius: 20px; background: var(--articles-paper); }
.articles-layout__header { display: flex; min-height: 76px; align-items: center; justify-content: space-between; gap: 20px; border-bottom: 1px solid var(--articles-border); padding: 0 44px; }
.articles-layout__crumbs { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; color: var(--articles-muted); font-size: 14px; }
.articles-layout__crumbs a { color: var(--articles-ink); text-decoration: none; }
.articles-layout__crumbs a:hover { color: var(--articles-link); }
.articles-layout__theme-toggle { display: grid; width: 36px; height: 36px; flex: 0 0 auto; place-items: center; border: 0; border-radius: 50%; background: transparent; color: var(--articles-muted); cursor: pointer; }
.articles-layout__theme-toggle:hover { background: color-mix(in srgb, var(--articles-muted) 12%, transparent); }
.articles-layout__theme-toggle svg { width: 19px; height: 19px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.articles-layout__content { max-width: 700px; margin: 0 auto; padding: 34px 44px 60px; }
.articles-layout__byline { display: flex; flex-wrap: wrap; gap: 10px; margin: 0 0 14px; color: var(--articles-muted); font-size: 13px; }
.articles-layout__byline > span + span::before { content: '·'; margin-right: 10px; }
.articles-layout__prose { color: var(--articles-ink); font: 19px/1.82 Georgia, 'Times New Roman', serif; }
.articles-layout__prose h1 { margin: 0 0 20px; color: var(--articles-ink); font: 700 40px/1.18 Inter, ui-sans-serif, system-ui, sans-serif; letter-spacing: -0.04em; }
.articles-layout__prose h2, .articles-layout__prose h3, .articles-layout__prose h4 { color: var(--articles-ink); font-family: Inter, ui-sans-serif, system-ui, sans-serif; letter-spacing: -0.02em; }
.articles-layout__prose p { margin: 0 0 24px; }
.articles-layout__prose a { color: var(--articles-link); }
.articles-layout__prose :is(ul, ol) { padding-inline-start: 1.35em; }

@media (max-width: 760px) {
  .articles-layout { display: block; width: 100%; padding: 0; }
  .articles-layout__sidebar { position: static; display: grid; grid-template-columns: 56px minmax(0, 1fr); gap: 0 14px; padding: 18px 20px; }
  .articles-layout__identity { grid-row: span 2; gap: 0; }
  .articles-layout__avatar { width: 56px; height: 56px; border-radius: 13px; }
  .articles-layout__author-name { align-self: start; font-size: 17px; }
  .articles-layout__role { margin: 2px 0 0; font-size: 13px; }
  .articles-layout__bio, .articles-layout__links { display: none; }
  .articles-layout__nav { display: flex; grid-column: 1 / -1; flex-wrap: wrap; gap: 18px; margin-top: 14px; }
  .articles-layout__nav a { font-size: 14px; }
  .articles-layout__frame { min-height: calc(100vh - 150px); border-radius: 18px 18px 0 0; }
  .articles-layout__header { min-height: 62px; padding-inline: 20px; }
  .articles-layout__crumbs { gap: 8px; font-size: 12px; }
  .articles-layout__content { padding: 28px 22px 48px; }
  .articles-layout__prose { font-size: 17px; line-height: 1.75; }
  .articles-layout__prose h1 { font-size: 32px; }
}
</style>
