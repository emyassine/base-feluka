<template>
  <div ref="root" class="dropdown-menu" @keydown.esc="closeMenu">
    <slot
      name="trigger"
      :toggle="toggleMenu"
      :close="closeMenu"
      :open="menuOpen"
      :menu-id="menuId"
        :menu-label="props.menuLabel"
    >
      <button
        class="dropdown-menu__toggle"
        :class="{ 'dropdown-menu__toggle--mobile': props.triggerMode === 'mobile' }"
        type="button"
        :aria-expanded="menuOpen"
        :aria-label="props.menuLabel"
        :aria-controls="menuId"
        @click="toggleMenu"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="5" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="19" cy="12" r="1.5" />
        </svg>
      </button>
    </slot>

    <div
      :id="menuId"
      class="dropdown-menu__menu"
      :class="{ 'is-open': menuOpen }"
      role="menu"
      :aria-hidden="!menuOpen"
    >
      <a
        v-for="link in props.links"
        :key="link.href"
        :href="link.href"
        role="menuitem"
        :style="link.style"
        :class="link.class"
        @click="closeMenu"
        v-html="link.title"
      ></a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId } from 'vue'

const props = withDefaults(defineProps<{
  links?: Array<{ title: string; href: string; style?: string; class?: string }>
  menuLabel?: string
  triggerMode?: 'always' | 'mobile'
}>(), {
  links: () => [],
  menuLabel: 'Open menu',
  triggerMode: 'always',
})

const root = ref<HTMLElement | null>(null)
const menuOpen = ref(false)
const menuId = `dropdown-menu-${useId()}`

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
.dropdown-menu {
  display: contents;
}

.dropdown-menu__toggle {
  display: inline-flex;
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

.dropdown-menu__toggle svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.dropdown-menu__menu {
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

.dropdown-menu__menu.is-open {
  display: grid;
}

.dropdown-menu__menu a {
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

.dropdown-menu__menu a:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-default-soft);
}

.dropdown-menu__toggle--mobile {
  display: none;
}

@media (max-width: 767px) {
  .dropdown-menu__toggle--mobile {
    display: flex;
  }
}
</style>
