<template>
  <nav
    ref="root"
    class="floating-topbar"
    :class="{ 'floating-topbar--bordered': props.showBorder, 'is-menu-open': menuOpen }"
    :aria-label="props.navigationLabel"
    @keydown.esc="closeMenu"
  >
    <a class="floating-topbar__identity" :href="props.homeHref" :style="props.titleStyle" :class="props.titleClass">
      <img v-if="props.logo" class="floating-topbar__logo" :src="props.logo" :alt="props.logoAlt || props.title" />
      <span v-html="props.title"></span>
    </a>
    <div class="floating-topbar__links">
      <a v-for="link in props.links" :key="link.href" :href="link.href" :style="link.style" :class="link.class" v-html="link.title"></a>
    </div>
    <button class="floating-topbar__toggle" type="button" :aria-expanded="menuOpen" :aria-label="props.menuLabel" :aria-controls="menuId" @click="toggleMenu">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></svg>
    </button>
    <div :id="menuId" class="floating-topbar__menu" :class="{ 'is-open': menuOpen }" role="menu" :aria-hidden="!menuOpen">
      <a v-for="link in props.links" :key="link.href" :href="link.href" role="menuitem" :style="link.style" :class="link.class" @click="closeMenu" v-html="link.title"></a>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  logo?: string
  logoAlt?: string
  homeHref?: string
  titleStyle?: string
  titleClass?: string
  links: Array<{ title: string; href: string; style?: string; class?: string }>
  showBorder?: boolean
  navigationLabel?: string
  menuLabel?: string
}>(), {
  homeHref: '/',
  showBorder: true,
  navigationLabel: 'Primary navigation',
  menuLabel: 'Open navigation menu',
})

const root = ref<HTMLElement | null>(null)
const menuOpen = ref(false)
const menuId = `floating-topbar-menu-${useId()}`

function closeMenu(): void {
  menuOpen.value = false
}

function toggleMenu(): void {
  menuOpen.value = !menuOpen.value
}

function onDocumentPointerDown(event: PointerEvent): void {
  if (event.target instanceof Node && !root.value?.contains(event.target)) closeMenu()
}

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown))
</script>

<style scoped>
.floating-topbar {
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
  box-sizing: border-box;
  height: 42px;
  padding: 0.25rem 0.4rem;
  border: 1px solid rgb(255 255 255 / 34%);
  border-radius: calc(var(--radius-lg) * 1.2);
  color: var(--vp-c-text-1);
  background:
    linear-gradient(145deg, rgb(255 255 255 / 24%), rgb(255 255 255 / 4%) 48%, rgb(255 255 255 / 10%)),
    color-mix(in srgb, var(--vp-c-bg) 38%, transparent);
  box-shadow:
    0 8px 28px rgb(0 0 0 / 30%),
    inset 0 1px 0 rgb(255 255 255 / 42%),
    inset 0 -1px 0 rgb(255 255 255 / 10%);
  -webkit-backdrop-filter: blur(90px) saturate(1.35);
  backdrop-filter: blur(30px) saturate(1.35);
}

.floating-topbar--bordered {
  border-color: rgb(255 255 255 / 42%);
}

:global(:root:not(.dark)) .floating-topbar {
  border-color: rgb(255 255 255 / 82%);
  background: linear-gradient(145deg, rgb(255 255 255 / 94%), rgb(241 245 249 / 90%));
  box-shadow:
    0 12px 32px rgb(15 23 42 / 24%),
    inset 0 1px 0 #fff,
    inset 0 -1px 0 rgb(148 163 184 / 18%);
  -webkit-backdrop-filter: blur(18px) saturate(1.1);
  backdrop-filter: blur(18px) saturate(1.1);
}

.floating-topbar__identity {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
  height: 32px;
  overflow: hidden;
  padding: 0 0.75rem 0 0.4rem;
  border-inline-end: 1px solid rgb(255 255 255 / 24%);
  color: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.015em;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
}

.floating-topbar__identity span {
  overflow: hidden;
  text-overflow: ellipsis;
}

.floating-topbar__logo {
  display: block;
  width: auto;
  max-width: 136px;
  height: 22px;
  object-fit: contain;
}

.floating-topbar__links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 0;
}

.floating-topbar__links::-webkit-scrollbar {
  display: none;
}

.floating-topbar__links a {
  display: inline-flex;
  flex: none;
  align-items: center;
  height: 32px;
  padding: 0 0.65rem;
  border-radius: var(--radius-md);
  color: var(--vp-c-text-1);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.015em;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
}

.floating-topbar__toggle {
  display: none;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: var(--radius-md);
  color: var(--vp-c-text-1);
  background: transparent;
  cursor: pointer;
}

.floating-topbar__toggle svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.floating-topbar__menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  z-index: 30;
  display: none;
  min-width: 200px;
  max-width: calc(100vw - 2rem);
  padding: 0.35rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-lg);
  background: var(--vp-c-bg);
  box-shadow: 0 12px 32px rgb(0 0 0 / 18%);
}

.floating-topbar__menu.is-open {
  display: grid;
}

.floating-topbar__menu a {
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 0 0.75rem;
  border-radius: var(--radius-md);
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  line-height: 1.2;
  text-decoration: none;
}

.floating-topbar__menu a:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-default-soft);
}

.floating-topbar__links a:hover,
.floating-topbar__identity:hover {
  color: var(--vp-c-brand-1);
  background: rgb(255 255 255 / 16%);
}

.floating-topbar__identity:hover,
.floating-topbar__identity:focus-visible {
  border-start-start-radius: calc(var(--radius-lg) * 1.2);
  border-end-start-radius: calc(var(--radius-lg) * 1.2);
  border-start-end-radius: 0;
  border-end-end-radius: 0;
}

:global(:root:not(.dark)) .floating-topbar__identity {
  border-inline-end-color: var(--vp-c-divider);
}

:global(:root:not(.dark)) .floating-topbar__links a:hover,
:global(:root:not(.dark)) .floating-topbar__identity:hover {
  background: rgb(15 23 42 / 6%);
}

@media (max-width: 680px) {
  .floating-topbar {
    top: calc(var(--vp-nav-height, 64px) + 0.5rem);
    max-width: 100%;
    margin-block: 0.75rem 1.5rem;
    padding: 0.25rem 0.35rem;
    gap: 0.15rem;
  }

  .floating-topbar__identity {
    max-width: calc(100vw - 4.5rem);
    padding: 0 0.55rem 0 0.35rem;
    font-size: 0.78rem;
  }

  .floating-topbar__links a {
    padding: 0 0.45rem;
    font-size: 0.66rem;
  }
}

@media (max-width: 767px) {
  .floating-topbar__links {
    display: none;
  }

  .floating-topbar__toggle {
    display: flex;
  }
}
</style>
