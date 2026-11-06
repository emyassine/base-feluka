<template>
  <nav class="floating-subnav" :aria-label="props.navigationLabel">
    <a
      class="floating-subnav__identity"
      :href="props.homeHref"
      :aria-current="isHomePage ? 'page' : undefined"
    >
      <span v-if="props.logoMiniLight || props.logoMiniDark || props.logoLight || props.logoDark" class="floating-subnav__logo" :style="logoContainerStyle">
        <img class="floating-subnav__logo-light" :src="props.logoMiniLight || props.logoLight || props.logoMiniDark || props.logoDark" :alt="props.logoAlt || ''" :style="props.logoExtraStyle" />
        <img class="floating-subnav__logo-dark" :src="props.logoMiniDark || props.logoDark || props.logoMiniLight || props.logoLight" :alt="props.logoAlt || ''" :style="props.logoExtraStyle" />
      </span>
      <span>{{ props.title }}</span>
    </a>
    <div class="floating-subnav__links">
      <a v-for="link in props.links" :key="link.href" :href="link.href" :aria-current="isCurrentPage(link.href) ? 'page' : undefined">
        {{ link.title }}
      </a>
    </div>
    <DropdownMenu :links="props.links" :menu-label="props.menuLabel" trigger-mode="mobile" />
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'

const props = withDefaults(defineProps<{
  title: string
  homeHref: string
  homePageHref?: string
  links: Array<{ title: string; href: string }>
  logoLight?: string
  logoDark?: string
  logoMiniLight?: string
  logoMiniDark?: string
  logoAlt?: string
  logoWidth?: string
  logoHeight?: string
  logoExtraStyle?: string
  navigationLabel?: string
  menuLabel?: string
}>(), {
  navigationLabel: 'Section navigation',
  menuLabel: 'Open section navigation',
})

const route = useRoute()
const logoContainerStyle = {
  height: props.logoHeight || '1.5rem',
  maxWidth: props.logoWidth,
}
const isHomePage = computed(() => [props.homeHref, props.homePageHref]
  .filter((path): path is string => Boolean(path))
  .some((path) => normalizePath(route.path) === normalizePath(path)))

function normalizePath(path: string): string {
  return path.replace(/\/+$/, '') || '/'
}

function isCurrentPage(href: string): boolean {
  return normalizePath(route.path) === normalizePath(href)
}
</script>

<style scoped>
.floating-subnav {
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

:global(:root:not(.dark)) .floating-subnav {
  border-color: rgb(255 255 255 / 82%);
  background: linear-gradient(145deg, rgb(255 255 255 / 94%), rgb(241 245 249 / 90%));
  box-shadow:
    0 12px 32px rgb(15 23 42 / 24%),
    inset 0 1px 0 #fff,
    inset 0 -1px 0 rgb(148 163 184 / 18%);
  -webkit-backdrop-filter: blur(18px) saturate(1.1);
  backdrop-filter: blur(18px) saturate(1.1);
}

.floating-subnav__identity {
  display: inline-flex;
  flex: none;
  align-items: center;
  min-width: 0;
  height: 32px;
  overflow: hidden;
  padding: 0 0.75rem 0 0.4rem;
  border-inline-end: 1px solid color-mix(in srgb, var(--vp-c-text-1) 38%, var(--vp-c-bg));
  color: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.015em;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
}

.floating-subnav__logo {
  display: inline-flex;
  flex: none;
  align-items: center;
  margin-inline-end: 0.35rem;
}

.floating-subnav__logo img {
  display: block;
  width: auto;
  max-width: 136px;
  height: 100%;
  object-fit: contain;
}

.floating-subnav__logo-dark {
  display: none !important;
}

:global(.dark) .floating-subnav__logo-light {
  display: none !important;
}

:global(.dark) .floating-subnav__logo-dark {
  display: block !important;
}

.floating-subnav__links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 0;
}

.floating-subnav__links::-webkit-scrollbar {
  display: none;
}

.floating-subnav__links a {
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

.floating-subnav__links a:hover,
.floating-subnav__links a[aria-current='page'],
.floating-subnav__identity:hover {
  color: var(--vp-c-brand-1);
  background: rgb(255 255 255 / 16%);
}

:global(:root:not(.dark)) .floating-subnav__links a:hover,
:global(:root:not(.dark)) .floating-subnav__links a[aria-current='page'],
:global(:root:not(.dark)) .floating-subnav__identity:hover {
  background: rgb(15 23 42 / 6%);
}

@media (max-width: 680px) {
  .floating-subnav {
    top: calc(var(--vp-nav-height, 64px) + 0.5rem);
    max-width: 100%;
    margin-block: 0.75rem 1.5rem;
    padding: 0.25rem 0.35rem;
    gap: 0.15rem;
  }

  .floating-subnav__identity {
    max-width: calc(100vw - 4.5rem);
    padding: 0 0.55rem 0 0.35rem;
    font-size: 0.78rem;
  }

  .floating-subnav__logo img {
    max-width: 110px;
  }

  .floating-subnav__links a {
    padding: 0 0.45rem;
    font-size: 0.66rem;
  }
}

@media (max-width: 767px) {
  .floating-subnav__links {
    display: none;
  }
}
</style>
