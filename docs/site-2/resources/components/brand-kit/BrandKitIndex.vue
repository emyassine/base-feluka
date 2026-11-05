<template>
  <section id="brand-kit-index" class="brand-kit-index" aria-labelledby="brand-kit-index-title">
    <header class="brand-kit-index__header">
      <h2 id="brand-kit-index-title">{{ title }}</h2>
      <span>({{ itemCount }})</span>
    </header>

    <div class="brand-kit-index__groups">
      <section v-for="group in groups" :key="group.title" class="brand-kit-index__group">
        <header class="brand-kit-index__group-header">
          <span>{{ group.number }}</span>
          <a :href="group.href">{{ group.title }}</a>
        </header>
        <ol>
          <li v-for="item in group.items" :key="item.number">
            <a :href="group.href">
              <span>{{ item.number }}</span>
              <span>{{ item.title }}</span>
            </a>
          </li>
        </ol>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
interface IndexItem {
  number: string
  title: string
}

interface IndexGroup {
  number: string
  title: string
  href: string
  items: IndexItem[]
}

const props = defineProps<{
  title: string
  groups: IndexGroup[]
}>()

const itemCount = props.groups.reduce((total, group) => total + group.items.length, 0)
</script>

<style scoped>
.brand-kit-index {
  margin: 0;
  padding: clamp(3.5rem, 9cqw, 8rem) 0;
}

.brand-kit-index__header {
  display: flex;
  align-items: baseline;
  gap: 0.7rem;
  margin-bottom: clamp(2rem, 4cqw, 3rem);
}

.brand-kit-index__header h2 {
  margin: 0;
  font-size: clamp(2rem, 5.5cqw, 5rem);
  font-weight: 500;
  letter-spacing: -0.06em;
  line-height: 0.95;
}

.brand-kit-index__header > span,
.brand-kit-index__group-header > span {
  color: var(--brand-kit-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
}

.brand-kit-index__groups {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: clamp(1.5rem, 5cqw, 5rem);
}

.brand-kit-index__group {
  min-width: 0;
  padding: 1.1rem 0 1.4rem;
  border-top: 1px solid var(--brand-kit-line);
}

.brand-kit-index__group-header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 0.9rem;
}

.brand-kit-index__group-header a {
  color: var(--brand-kit-text);
  font-size: 1.05rem;
  text-decoration: none;
}

.brand-kit-index__group ol {
  display: grid;
  gap: 0.2rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.brand-kit-index__group li a {
  display: grid;
  grid-template-columns: 3.5rem minmax(0, 1fr);
  gap: 0.5rem;
  padding: 0.4rem 0;
  color: var(--brand-kit-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  line-height: 1.4;
  text-decoration: none;
  text-transform: uppercase;
}

.brand-kit-index__group a:hover {
  color: var(--vp-c-brand-1);
}

@container (max-width: 680px) {
  .brand-kit-index__groups {
    grid-template-columns: 1fr;
  }
}
</style>
