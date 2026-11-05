<template>
  <nav
    class="brand-kit-topbar"
    :class="{ 'brand-kit-topbar--bordered': props.showBorder }"
    aria-label="Brand Kit navigation"
  >
    <a class="brand-kit-topbar__brand" href="/brand-kit/our-brand" :style="props.brandStyle" :class="props.brandClass" v-html="props.brand"></a>
    <div class="brand-kit-topbar__links">
      <a v-for="group in props.groups" :key="group.href" :href="group.href" :style="group.style" :class="group.class" v-html="group.title"></a>
    </div>
  </nav>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  brand: string
  brandStyle?: string
  brandClass?: string
  groups: Array<{ title: string; href: string; style?: string; class?: string }>
  showBorder?: boolean
}>(), {
  showBorder: true,
})
</script>

<style scoped>
.brand-kit-topbar {
  position: sticky;
  z-index: 20;
  top: calc(var(--vp-nav-height, 64px) + 0.75rem);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  width: max-content;
  max-width: calc(100% - 1rem);
  min-width: 0;
  margin: 1.25rem auto 2rem;
  padding: 0.45rem 0.6rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 19px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  box-shadow: 0 8px 28px color-mix(in srgb, var(--vp-c-text-1) 14%, transparent), inset 0 1px 0 color-mix(in srgb, var(--vp-c-text-1) 5%, transparent);
}

.brand-kit-topbar--bordered {
  border-color: var(--vp-c-divider);
}

.brand-kit-topbar__brand {
  flex: none;
  padding: 0.6rem 0.85rem 0.6rem 0.5rem;
  border-right: 1px solid var(--vp-c-divider);
  color: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-decoration: none;
  white-space: nowrap;
}

.brand-kit-topbar__links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 0.1rem;
}

.brand-kit-topbar__links::-webkit-scrollbar {
  display: none;
}

.brand-kit-topbar__links a {
  flex: none;
  padding: 0.6rem 0.65rem;
  border-radius: 999px;
  color: var(--vp-c-text-2);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.015em;
  text-decoration: none;
  white-space: nowrap;
}

.brand-kit-topbar__links a:hover,
.brand-kit-topbar__brand:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

@media (max-width: 680px) {
  .brand-kit-topbar {
    top: calc(var(--vp-nav-height, 64px) + 0.5rem);
    max-width: 100%;
    margin-block: 0.75rem 1.5rem;
    padding: 0.35rem 0.45rem;
    gap: 0.15rem;
  }

  .brand-kit-topbar__brand {
    padding: 0.5rem 0.55rem 0.5rem 0.35rem;
    font-size: 0.78rem;
  }

  .brand-kit-topbar__links a {
    padding: 0.5rem 0.45rem;
    font-size: 0.66rem;
  }
}
</style>
