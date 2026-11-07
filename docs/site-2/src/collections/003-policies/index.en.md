---
sidebarTitle: "Policies"
title: "Policies | Numerimondes"
icon: "@spmpst::icon::scale"
description: "The boundaries and commitments that shape Numerimondes services, client work, and partnerships."
summary: "Policies explain what Numerimondes offers, what it does not offer, and the terms that need to be agreed."
image: "/images/policies/policy-boundaries.webp"
imageAlt: "Slate, pale ceramic, glass, metal and amber resin planes meet along one etched line."
status: "Ready for review"
---

<h1 style="display:none;">Policies</h1>

:::: info About our policies

Policies are formal rules and guiding principles that define our boundaries.

Their primary goal is to serve our clients and partners first. They clarify:

- what we offer,
- what falls outside our scope,
- the conditions under which we work
- and the conditions under which we make decisions.


::: details Direct benefits of the policies

We make our policies explicit and accessible to:

- **Set clear expectations:** Help clients, partners, and team members understand their responsibilities, the standards we uphold, and what they can expect when working with us.
- **Promote consistency and fairness:** Establish common principles, encourage fair treatment, reduce ambiguity, and support alignment with applicable laws and professional standards.
- **Manage risk:** Provide a structured approach to identifying, assessing, and addressing operational, legal, financial, and reputational risks.
- **Support informed decisions:** Give everyone involved a clear framework for responsible, consistent decisions while allowing appropriate autonomy and professional judgment.
:::
<small>Draft policies are marked clearly and should not be treated as established commitments yet.</small>
::::

<img src="/images/policies/policy-boundaries.webp" alt="Slate, pale ceramic, glass, metal and amber resin planes meet along one etched line.">

<CollectionSearch collection-id="policies" v-slot="{ items, query, setQuery, categories, selectedCategory, setCategory, sort, setSort, getCategoryLabel }">
  <CollectionFilterBar
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
    <ProductSummaryCard
      v-for="policy in items"
      :key="policy.url"
      :href="policy.url"
      :image="policy.image"
      :image-alt="policy.imageAlt"
      :video="policy.video"
      :title="policy.title"
      :category="getCategoryLabel(policy.category)"
      :status="policy.status"
      :description="policy.summary || policy.description"
    />
  </div>
  <p v-else class="nm-policy-empty">No policies match this search.</p>
</CollectionSearch>
