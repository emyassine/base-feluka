<template>
  <div class="nm-concepts">
    <label class="nm-concepts__search">Search concepts <input v-model="query" type="search" autocomplete="off" placeholder="Search concepts…" /></label>
    <section v-for="(items, family) in groups" :key="family" class="nm-concepts__family">
      <h2>{{ family }}</h2>
      <div class="nm-concepts__grid"><a v-for="item in items" :key="item.url" :href="item.url" class="nm-concepts__card"><strong>{{ item.title }}</strong><span>{{ item.summary }}</span></a></div>
    </section>
    <p v-if="!Object.keys(groups).length" role="status">No concepts match this search.</p>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue'
import concepts from './concepts.json'
const query = ref('')
const groups = computed(() => {
  const q = query.value.trim().toLocaleLowerCase()
  const result = {}
  for (const item of concepts) {
    if (q && !`${item.family} ${item.title} ${item.summary}`.toLocaleLowerCase().includes(q)) continue
    ;(result[item.family] ||= []).push(item)
  }
  return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)).map(([family, items]) => [family, items.sort((a,b) => a.title.localeCompare(b.title))]))
})
</script>
