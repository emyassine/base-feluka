---
sidebarTitle: "Legal notices"
title: "Legal notices | Numerimondes"
icon: "@spmpst::icon::scale"
description: "Website terms, privacy notices, publisher identity and legal information for Numerimondes."
summary: "Browse the legal notices that apply to Numerimondes websites, accounts and services."
status: "Ready for review"
---

# Legal notices

Find the notices and terms that explain who publishes this site, how information is handled, and which conditions apply to website use and development work.

<CollectionSearch collection-id="legal" v-slot="{ items, query, setQuery, categories, selectedCategory, setCategory, sort, setSort, getCategoryLabel }">
  <CollectionSearchBar
    :query="query"
    :categories="categories"
    :selected-category="selectedCategory"
    :sort="sort"
    query-label="Search legal notices"
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
    <ProductCard
      v-for="notice in items"
      :key="notice.url"
      :href="notice.url"
      :image="notice.image"
      :image-alt="notice.imageAlt"
      :video="notice.video"
      :title="notice.title"
      :category="getCategoryLabel(notice.category)"
      :status="notice.status"
      :description="notice.summary || notice.description"
    />
  </div>
  <p v-else>No legal notices match this search.</p>
</CollectionSearch>
