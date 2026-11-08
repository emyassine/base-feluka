<template>
  <div class="nm-concepts">
    <label class="nm-concepts__search">Search concepts <input v-model="query" type="search" autocomplete="off" placeholder="Search concepts…" /></label>
    <section v-for="(items, family) in groups" :key="family" class="nm-concepts__family">
      <h2 v-html="family" />
      <div class="nm-concepts__grid"><a v-for="item in items" :key="item.url" :href="item.url" class="nm-concepts__card"><strong v-html="item.title" /><span v-html="item.summary" /></a></div>
    </section>
    <p v-if="!Object.keys(groups).length" role="status">No concepts match this search.</p>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
const props = defineProps<{ concepts: Array<{ family: string; title: string; summary: string; url: string }> }>()
const query = ref('')
const groups = computed(() => {
  const q = query.value.trim().toLocaleLowerCase()
  const result = {}
  for (const item of props.concepts) {
    if (q && !`${item.family} ${item.title} ${item.summary}`.toLocaleLowerCase().includes(q)) continue
    ;(result[item.family] ||= []).push(item)
  }
  return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)).map(([family, items]) => [family, items.sort((a,b) => a.title.localeCompare(b.title))]))
})
</script>

<style scoped>
.nm-concepts__search {
  display: grid;
  max-width: 32rem;
  gap: 0.5rem;
  margin: 1.5rem 0;
}
.nm-concepts__search input {
  padding: 0.65rem 0.8rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-md);
  background: var(--vp-c-bg);
}
.nm-concepts__family { margin: 2rem 0; }
.nm-concepts__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 0.75rem;
}
.nm-concepts__card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem 1.15rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-md);
  background: var(--vp-c-bg-soft);
  text-decoration: none;
}
.nm-concepts__card span { color: var(--vp-c-text-2); font-size: 0.9rem; }
</style>
