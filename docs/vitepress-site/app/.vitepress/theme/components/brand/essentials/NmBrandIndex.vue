<template>
  <section id="nm-brand-index" class="nm-brand-index" aria-labelledby="nm-brand-index-title">
    <header class="nm-brand-index__header">
      <h2 id="nm-brand-index-title" :style="props.titleStyle" :class="props.titleClass" v-html="props.title"></h2>
      <span>({{ itemCount }})</span>
    </header>

    <div :class="`nm-brand-index__groups nm-brand-index__groups--${props.columns}`">
      <section v-for="group in props.groups" :key="group.title" class="nm-brand-index__group">
        <header class="nm-brand-index__group-header">
          <span>{{ group.number }}</span>
          <a :href="group.href" :style="group.titleStyle" :class="group.titleClass" v-html="group.title"></a>
        </header>
        <ol>
          <li v-for="item in group.items" :key="item.number">
            <a :href="item.href || group.href">
              <span>{{ item.number }}</span>
              <span :style="item.titleStyle" :class="item.titleClass" v-html="item.title"></span>
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
  href?: string
  titleStyle?: string
  titleClass?: string
}

interface IndexGroup {
  number: string
  title: string
  titleStyle?: string
  titleClass?: string
  href: string
  items: IndexItem[]
}

const props = withDefaults(defineProps<{
  title: string
  titleStyle?: string
  titleClass?: string
  groups: IndexGroup[]
  columns?: 1 | 2 | 3 | 4
}>(), {
  columns: 2,
})

const itemCount = props.groups.reduce((total, group) => total + group.items.length, 0)
</script>

<style scoped>
.nm-brand-index {
  margin: 0;
  padding: clamp(3.5rem, 9cqw, 8rem) 0;
}

.nm-brand-index__header {
  display: flex;
  align-items: baseline;
  gap: 0.7rem;
  margin-bottom: clamp(2rem, 4cqw, 3rem);
}

.nm-brand-index__header h2 {
  margin: 0;
  font-size: clamp(2rem, 5.5cqw, 5rem);
  font-weight: 500;
  letter-spacing: -0.06em;
  line-height: 0.95;
}

.nm-brand-index__header > span,
.nm-brand-index__group-header > span {
  color: var(--nm-brand-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
}

.nm-brand-index__groups {
  display: grid;
  column-gap: clamp(1.5rem, 5cqw, 5rem);
}

.nm-brand-index__groups--1 {
  grid-template-columns: minmax(0, 1fr);
}

.nm-brand-index__groups--2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.nm-brand-index__groups--3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.nm-brand-index__groups--4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.nm-brand-index__group {
  min-width: 0;
  padding: 1.1rem 0 1.4rem;
  border-top: 1px solid var(--nm-brand-line);
}

.nm-brand-index__group-header {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 0.9rem;
}

.nm-brand-index__group-header a {
  color: var(--nm-brand-text);
  font-size: 1.05rem;
  text-decoration: none;
}

.nm-brand-index__group ol {
  display: grid;
  gap: 0.2rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.nm-brand-index__group li a {
  display: grid;
  grid-template-columns: 3.5rem minmax(0, 1fr);
  gap: 0.5rem;
  padding: 0.4rem 0;
  color: var(--nm-brand-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  line-height: 1.4;
  text-decoration: none;
  text-transform: uppercase;
}

.nm-brand-index__group a:hover {
  color: var(--vp-c-brand-1);
}

@container (max-width: 680px) {
  .nm-brand-index__groups--2,
  .nm-brand-index__groups--3,
  .nm-brand-index__groups--4 {
    grid-template-columns: 1fr;
  }
}

@container (min-width: 681px) and (max-width: 960px) {
  .nm-brand-index__groups--3,
  .nm-brand-index__groups--4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
