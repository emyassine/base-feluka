<template>
  <nav
    class="brand-kit-topbar"
    :class="{ 'brand-kit-topbar--bordered': props.showBorder }"
    aria-label="Brand Kit navigation"
  >
    <a class="brand-kit-topbar__brand" href="/brand-kit/our-brand">{{ props.brand }}</a>
    <div class="brand-kit-topbar__links">
      <a v-for="group in props.groups" :key="group.href" :href="group.href">{{ group.title }}</a>
    </div>
  </nav>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  brand: string
  groups: Array<{ title: string; href: string }>
  showBorder?: boolean
}>(), {
  showBorder: true,
})
</script>

<style scoped>
.brand-kit-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0.9rem 0;
  color: var(--vp-c-text-1);
}

.brand-kit-topbar--bordered {
  border-bottom: 1px solid var(--vp-c-divider);
}

.brand-kit-topbar__brand {
  flex: none;
  color: inherit;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-decoration: none;
}

.brand-kit-topbar__links {
  display: flex;
  align-items: center;
  gap: clamp(0.8rem, 2.2cqw, 1.8rem);
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.brand-kit-topbar__links::-webkit-scrollbar {
  display: none;
}

.brand-kit-topbar__links a {
  flex: none;
  color: var(--vp-c-text-2);
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  text-decoration: none;
  text-transform: uppercase;
}

.brand-kit-topbar__links a:hover,
.brand-kit-topbar__brand:hover {
  color: var(--vp-c-brand-1);
}
</style>
