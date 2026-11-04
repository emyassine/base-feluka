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
  <div class="nm-policy-search" role="search">
    <label class="nm-policy-search__query">
      <span>Search policies</span>
      <input type="search" :value="query" placeholder="Search by title or topic" @input="setQuery" />
    </label>
    <label>
      <span>Category</span>
      <select :value="selectedCategory" @change="setCategory">
        <option value="">All categories</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.label }}</option>
      </select>
    </label>
    <label>
      <span>Sort</span>
      <select :value="sort" @change="setSort">
        <option value="newest">Newest</option>
        <option value="title">Title</option>
        <option value="none">Collection order</option>
      </select>
    </label>
  </div>

  <div v-if="items.length" class="nm-policy-grid">
    <article v-for="policy in items" :key="policy.url" class="nm-policy-card">
      <a class="nm-policy-card__image" :href="policy.url" :aria-label="policy.title">
        <img :src="policy.image" :alt="policy.imageAlt || policy.title" loading="lazy" />
      </a>
      <div class="nm-policy-card__meta">
        <span v-if="policy.category">{{ getCategoryLabel(policy.category) }}</span>
        <span v-if="policy.status" class="nm-policy-card__status">{{ policy.status }}</span>
      </div>
      <h2><a :href="policy.url">{{ policy.title }}</a></h2>
      <p>{{ policy.summary || policy.description }}</p>
      <a class="nm-policy-card__link" :href="policy.url">Read policy <span aria-hidden="true">→</span></a>
    </article>
  </div>
  <p v-else class="nm-policy-empty">No policies match this search.</p>
</CollectionSearch>
