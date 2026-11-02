<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'

interface DockItem {
  label: string
  href: string
}

const props = withDefaults(defineProps<{
  items: DockItem[]
  label?: string
}>(), {
  label: 'Explore Numerimondes',
})

const route = useRoute()
const currentPath = computed(() => route.path.replace(/\/+$/, '') || '/')

function isCurrent(href: string) {
  const targetPath = href.split(/[?#]/, 1)[0].replace(/\/+$/, '') || '/'
  return currentPath.value === targetPath || (targetPath !== '/' && currentPath.value.startsWith(`${targetPath}/`))
}
</script>

<template>
  <nav class="nm-simple-hero-dock" :aria-label="props.label">
    <a
      v-for="item in props.items"
      :key="item.href"
      class="nm-simple-hero-dock__item"
      :class="{ 'is-current': isCurrent(item.href) }"
      :href="item.href"
      :aria-current="isCurrent(item.href) ? 'page' : undefined"
    >
      <span class="nm-simple-hero-dock__marker" aria-hidden="true"></span>
      <span>{{ item.label }}</span>
    </a>
  </nav>
</template>

<style scoped>
.nm-simple-hero-dock {
  display: flex;
  width: max-content;
  max-width: 100%;
  align-items: center;
  gap: 0.25rem;
  overflow-x: auto;
  padding: 0.3rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
  background: color-mix(in srgb, var(--vp-c-bg) 76%, transparent);
  box-shadow: var(--vp-shadow-1);
  backdrop-filter: blur(16px);
  scrollbar-width: none;
}

.nm-simple-hero-dock::-webkit-scrollbar { display: none; }

.nm-simple-hero-dock__item {
  display: inline-flex;
  min-height: 2.5rem;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0.55rem 0.85rem;
  border-radius: var(--radius-md);
  color: var(--vp-c-text-2);
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.2;
  text-decoration: none;
  transition: color 180ms ease, background-color 180ms ease;
}

.nm-simple-hero-dock__item:hover {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.nm-simple-hero-dock__item.is-current {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.nm-simple-hero-dock__marker {
  width: 0.4rem;
  height: 0.4rem;
  flex: 0 0 auto;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.55;
}

.is-current .nm-simple-hero-dock__marker { opacity: 1; }

@media (max-width: 640px) {
  .nm-simple-hero-dock { justify-content: flex-start; }
  .nm-simple-hero-dock__item { min-height: 2.25rem; padding-inline: 0.7rem; }
}

@media (prefers-reduced-motion: reduce) {
  .nm-simple-hero-dock__item { transition: none; }
}
</style>
