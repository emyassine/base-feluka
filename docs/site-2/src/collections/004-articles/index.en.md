---
title: "Articles | Numerimondes"
sidebarTitle: "Articles"
icon: "@spmpst::icon::book-open"
description: "Practical guides and explanations for using Numerimondes sites and services."
summary: "Guides for using the site and understanding its services."
status: "Ready for review"
---

# Articles

Practical guides to using this site and understanding how its features work.

<CollectionSearch collection-id="articles" v-slot="{ items, query, setQuery, categories, selectedCategory, setCategory, sort, setSort, getCategoryLabel }">
  <CollectionFilterBar
    :query="query"
    :categories="categories"
    :selected-category="selectedCategory"
    :sort="sort"
    query-label="Search articles"
    query-placeholder="Search by title or topic"
    category-label="Category"
    all-categories-label="All categories"
    sort-label="Sort"
    :sort-options="[
      { value: 'newest', label: 'Newest' },
      { value: 'title', label: 'Title' },
      { value: 'none', label: 'Collection order' }
    ]"
    @update:query="setQuery"
    @update:selected-category="setCategory"
    @update:sort="setSort"
  />
  <div v-if="items.length" class="nm-policy-grid">
    <ProductSummaryCard v-for="article in items" :key="article.url" :href="article.url" :image="article.image" :image-alt="article.imageAlt" :video="article.video" :title="article.title" :category="getCategoryLabel(article.category)" :status="article.status" :description="article.summary || article.description" />
  </div>
  <p v-else>No articles match this search.</p>
</CollectionSearch>
