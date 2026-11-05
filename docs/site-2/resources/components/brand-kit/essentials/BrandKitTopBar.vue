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
  border: 1px solid rgb(255 255 255 / 34%);
  border-radius: 19px;
  color: var(--vp-c-text-1);
  background:
    linear-gradient(145deg, rgb(255 255 255 / 24%), rgb(255 255 255 / 4%) 48%, rgb(255 255 255 / 10%)),
    color-mix(in srgb, var(--vp-c-bg) 38%, transparent);
  box-shadow:
    0 8px 28px rgb(0 0 0 / 30%),
    inset 0 1px 0 rgb(255 255 255 / 42%),
    inset 0 -1px 0 rgb(255 255 255 / 10%);
  -webkit-backdrop-filter: blur(30px) saturate(1.35);
  backdrop-filter: blur(30px) saturate(1.35);
}

.brand-kit-topbar--bordered {
  border-color: rgb(255 255 255 / 42%);
}

:global(:root:not(.dark)) .brand-kit-topbar {
  border-color: rgb(255 255 255 / 82%);
  background: linear-gradient(145deg, rgb(255 255 255 / 94%), rgb(241 245 249 / 90%));
  box-shadow:
    0 12px 32px rgb(15 23 42 / 24%),
    inset 0 1px 0 #fff,
    inset 0 -1px 0 rgb(148 163 184 / 18%);
  -webkit-backdrop-filter: blur(18px) saturate(1.1);
  backdrop-filter: blur(18px) saturate(1.1);
}

.brand-kit-topbar__brand {
  flex: none;
  padding: 0.6rem 0.85rem 0.6rem 0.5rem;
  border-right: 1px solid rgb(255 255 255 / 24%);
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
  background: rgb(255 255 255 / 16%);
}

:global(:root:not(.dark)) .brand-kit-topbar__brand {
  border-right-color: rgb(15 23 42 / 12%);
}

:global(:root:not(.dark)) .brand-kit-topbar__links a:hover,
:global(:root:not(.dark)) .brand-kit-topbar__brand:hover {
  background: rgb(15 23 42 / 6%);
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
