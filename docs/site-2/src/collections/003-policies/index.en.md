---
layout: home-subheader
sidebarTitle: "Policies"
title: "Policies | Numerimondes"
icon: "@spmpst::icon::scale"
description: "The boundaries and commitments that shape Numerimondes services, client work, and partnerships."
summary: "Policies explain what Numerimondes offers, what it does not offer, and the terms that need to be agreed."
status: "Ready for review"
---

# Policies

These policies make our working boundaries visible: what we offer, what we do not offer, and what needs to be agreed before work begins. Draft policies are marked clearly and should not be treated as established commitments.

<CollectionSearch collection-id="policies" v-slot="{ items, query, setQuery, categories, selectedCategory, setCategory, sort, setSort, getCategoryLabel }">
  <CollectionSearchBar
    :query="query"
    :categories="categories"
    :selected-category="selectedCategory"
    :sort="sort"
    query-label="Search policies"
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
      v-for="policy in items"
      :key="policy.url"
      :href="policy.url"
      :image="policy.image"
      :image-alt="policy.imageAlt"
      :title="policy.title"
      :category="getCategoryLabel(policy.category)"
      :status="policy.status"
      :description="policy.summary || policy.description"
    />
  </div>
  <p v-else class="nm-policy-empty">No policies match this search.</p>
</CollectionSearch>
