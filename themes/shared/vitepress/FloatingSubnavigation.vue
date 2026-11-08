<template>
  <nav
    ref="navRef"
    class="floating-subnav"
    :class="{ 'is-compact': isCompact }"
    :aria-label="props.navigationLabel"
  >
    <a
      ref="identityRef"
      class="floating-subnav__identity"
      :href="props.homeHref"
      :aria-current="isHomePage ? 'page' : undefined"
    >
      <span v-if="hasLogo" class="floating-subnav__logo" :style="logoContainerStyle">
        <img class="floating-subnav__logo-light" :src="logoLightSrc" :alt="props.logoAlt || ''" :style="props.logoExtraStyle" />
        <img class="floating-subnav__logo-dark" :src="logoDarkSrc" :alt="props.logoAlt || ''" :style="props.logoExtraStyle" />
      </span>
      <span class="floating-subnav__collapse floating-subnav__collapse--title">
        <span class="floating-subnav__collapse-inner">
          <span class="floating-subnav__title">{{ props.title }}</span>
        </span>
      </span>
    </a>

    <!-- Inline links (hidden in compact mode) -->
    <div class="floating-subnav__collapse floating-subnav__collapse--links">
      <div class="floating-subnav__collapse-inner floating-subnav__links-inner">
        <span class="floating-subnav__divider" aria-hidden="true" />
        <div class="floating-subnav__links">
          <template v-for="link in visibleLinks">
            <div v-if="link.type === 'separator'" :key="link.type" class="floating-subnav__separator" aria-hidden="true" />
            <a
              v-else
              :key="link.href"
              class="floating-subnav__link"
              :href="link.href"
              :aria-current="isCurrentPage(link.href) ? 'page' : undefined"
            >
              {{ link.title }}
            </a>
          </template>
        </div>
      </div>
    </div>

    <!-- "More" menu: overflow links, or every link when compact -->
    <div ref="moreRef" class="floating-subnav__more">
      <div class="floating-subnav__collapse floating-subnav__collapse--more" :data-open="showMore">
        <div class="floating-subnav__collapse-inner">
          <button
            type="button"
            class="floating-subnav__more-button"
            :aria-expanded="menuOpen"
            aria-controls="floating-subnav-menu"
            :aria-label="props.menuLabel"
            :tabindex="showMore ? 0 : -1"
            @click="menuOpen = !menuOpen"
          >
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
              <path d="M3.5 6.25 8 10.75l4.5-4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <Transition name="floating-subnav-menu">
        <ul v-if="menuOpen && showMore" id="floating-subnav-menu" class="floating-subnav__menu">
          <template v-for="link in menuLinks">
            <li v-if="link.type !== 'separator'" :key="link.href">
              <a
                class="floating-subnav__menu-link"
                :href="link.href"
                :aria-current="isCurrentPage(link.href) ? 'page' : undefined"
                @click="menuOpen = false"
              >
                {{ link.title }}
              </a>
            </li>
            <li v-else :key="link.type" class="floating-subnav__menu-separator" aria-hidden="true" />
          </template>
        </ul>
      </Transition>
    </div>

    <!-- Mobile menu (below 768px) -->
    <DropdownMenu :links="dropdownMenuLinks" :menu-label="props.menuLabel" trigger-mode="mobile" />

    <!-- Invisible measuring layer used to compute overflow -->
    <div class="floating-subnav__ghost" aria-hidden="true">
      <span v-for="link in ghostLinks" :key="link.href" ref="ghostRefs" class="floating-subnav__link">
        {{ link.title }}
      </span>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const props = withDefaults(defineProps<{
  title: string
  homeHref: string
  homePageHref?: string
  links: Array<{ title: string; href: string; type?: string; custom?: boolean }>
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

const MOBILE_BREAKPOINT = 767
const COMPACT_ENTER_Y = 80
const SCROLL_DELTA = 4
// Layout constants (px) used for the overflow computation.
const NAV_CHROME = 20
const LINK_GAP = 4
const DIVIDER_WIDTH = 12
const MORE_WIDTH = 36

const route = useRoute()

const navRef = ref<HTMLElement | null>(null)
const identityRef = ref<HTMLElement | null>(null)
const moreRef = ref<HTMLElement | null>(null)
const ghostRefs = ref<HTMLElement[]>([])

const isCompact = ref(false)
const menuOpen = ref(false)
const visibleCount = ref(props.links.length)

const hasLogo = computed(() => Boolean(props.logoMiniLight || props.logoMiniDark || props.logoLight || props.logoDark))
const logoLightSrc = computed(() => props.logoMiniLight || props.logoLight || props.logoMiniDark || props.logoDark)
const logoDarkSrc = computed(() => props.logoMiniDark || props.logoDark || props.logoMiniLight || props.logoLight)
const logoContainerStyle = computed(() => ({
  height: props.logoHeight || '1.5rem',
  maxWidth: props.logoWidth,
}))

const isHomePage = computed(() => [props.homeHref, props.homePageHref]
  .filter((path): path is string => Boolean(path))
  .some((path) => normalizePath(route.path) === normalizePath(path)))

const visibleLinks = computed(() => props.links.slice(0, visibleCount.value))
const overflowLinks = computed(() => props.links.slice(visibleCount.value))
const showMore = computed(() => isCompact.value || overflowLinks.value.length > 0)
const menuLinks = computed(() => (isCompact.value ? props.links : overflowLinks.value))
const ghostLinks = computed(() => props.links.filter((link) => link.type !== 'separator'))
const dropdownMenuLinks = computed(() => props.links.filter((link) => link.type !== 'separator'))

function normalizePath(path: string): string {
  return path.replace(/\/+$/, '') || '/'
}

function isCurrentPage(href: string): boolean {
  return normalizePath(route.path) === normalizePath(href)
}

/* ---------- Overflow ---------- */

let identityFullWidth = 0

function measure() {
  const nav = navRef.value
  if (!nav || window.innerWidth <= MOBILE_BREAKPOINT) {
    visibleCount.value = props.links.length
    return
  }

  if (!isCompact.value && identityRef.value) {
    identityFullWidth = identityRef.value.getBoundingClientRect().width
  }

  const parentWidth = nav.parentElement?.clientWidth ?? window.innerWidth
  const available = parentWidth - 16 - NAV_CHROME - identityFullWidth - DIVIDER_WIDTH
  const widths = ghostRefs.value.map((el) => el.getBoundingClientRect().width)

  let used = 0
  let count = 0
  for (let i = 0; i < widths.length; i++) {
    const next = used + widths[i] + (count > 0 ? LINK_GAP : 0)
    const hasRemaining = widths.length - (i + 1) > 0
    const reserve = hasRemaining ? MORE_WIDTH : 0
    if (next + reserve > available) break
    used = next
    count++
  }
  visibleCount.value = count
}

/* ---------- Scroll (Apple-style compact mode) ---------- */

let lastY = 0
let ticking = false

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    ticking = false
    if (menuOpen.value) return
    const y = Math.max(window.scrollY, 0)
    const delta = y - lastY
    if (y < COMPACT_ENTER_Y) {
      isCompact.value = false
    } else if (delta > SCROLL_DELTA) {
      isCompact.value = true
    } else if (delta < -SCROLL_DELTA) {
      isCompact.value = false
    }
    lastY = y
  })
}

/* ---------- Menu ---------- */

function onPointerDown(event: PointerEvent) {
  if (menuOpen.value && moreRef.value && !moreRef.value.contains(event.target as Node)) {
    menuOpen.value = false
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') menuOpen.value = false
}

let resizeObserver: ResizeObserver | undefined

onMounted(() => {
  lastY = window.scrollY
  measure()
  document.fonts?.ready.then(measure)

  resizeObserver = new ResizeObserver(measure)
  if (navRef.value?.parentElement) resizeObserver.observe(navRef.value.parentElement)
  if (identityRef.value) resizeObserver.observe(identityRef.value)

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', measure, { passive: true })
  document.addEventListener('pointerdown', onPointerDown)
  document.addEventListener('keydown', onKeydown)
  onScroll()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', measure)
  document.removeEventListener('pointerdown', onPointerDown)
  document.removeEventListener('keydown', onKeydown)
})

watch(() => [props.links, props.title], () => nextTick(measure), { deep: true })
watch(() => route.path, () => { menuOpen.value = false })
watch(showMore, (value) => { if (!value) menuOpen.value = false })
</script>

<style>
.floating-subnav {
  --fs-bg: rgb(255 255 255 / 72%);
  --fs-border: rgb(15 23 42 / 8%);
  --fs-shadow:
    0 1px 2px rgb(15 23 42 / 6%),
    0 10px 24px -8px rgb(15 23 42 / 14%);
  --fs-highlight: inset 0 1px 0 rgb(255 255 255 / 80%);
  --fs-hover: rgb(15 23 42 / 7%);
  --fs-active: rgb(15 23 42 / 10%);
  --fs-divider: rgb(15 23 42 / 14%);
  --fs-blur: blur(20px) saturate(1.8);
  --fs-ease: cubic-bezier(0.32, 0.72, 0, 1);
  --fs-duration: 0.45s;

  position: fixed;
  z-index: 10;
  top: calc(var(--vp-nav-height, 64px) + 0.75rem);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  max-width: calc(100% - 1rem);
  height: 42px;
  min-width: 0;
  margin: 0;
  padding: 0.25rem 0.4rem;
  box-sizing: border-box;
  border: 1px solid var(--fs-border);
  border-radius: calc(var(--radius-lg) * 1.2);
  color: var(--vp-c-text-1);
  background: var(--fs-bg);
  box-shadow: var(--fs-shadow), var(--fs-highlight);
  -webkit-backdrop-filter: var(--fs-blur);
  backdrop-filter: var(--fs-blur);
}

html.dark .floating-subnav {
  --fs-bg: rgb(24 24 27 / 60%);
  --fs-border: rgb(255 255 255 / 10%);
  --fs-shadow:
    0 0 0 1px rgb(0 0 0 / 20%),
    0 14px 32px -10px rgb(0 0 0 / 55%);
  --fs-highlight: inset 0 1px 0 rgb(255 255 255 / 6%);
  --fs-hover: rgb(255 255 255 / 7%);
  --fs-active: rgb(255 255 255 / 11%);
  --fs-divider: rgb(255 255 255 / 14%);
  --fs-blur: blur(24px) saturate(1.6);
}

/* ---------- Collapsible blocks (animate 1fr <-> 0fr) ---------- */

.floating-subnav__collapse {
  display: grid;
  grid-template-columns: 1fr;
  min-width: 0;
  opacity: 1;
  transition:
    grid-template-columns var(--fs-duration) var(--fs-ease),
    opacity 0.25s ease;
}

.floating-subnav__collapse-inner {
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
}

.floating-subnav.is-compact .floating-subnav__collapse--title,
.floating-subnav.is-compact .floating-subnav__collapse--links,
.floating-subnav__collapse--more[data-open='false'] {
  grid-template-columns: 0fr;
  opacity: 0;
  pointer-events: none;
}

/* ---------- Identity ---------- */

.floating-subnav__identity {
  display: inline-flex;
  flex: none;
  align-items: center;
  height: 32px;
  padding-inline: 0.4rem 0.75rem;
  border-start-start-radius: var(--radius-lg);
  border-end-start-radius: var(--radius-lg);
  border-start-end-radius: var(--radius-md);
  border-end-end-radius: var(--radius-md);
  color: inherit;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.015em;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    padding var(--fs-duration) var(--fs-ease);
}

.floating-subnav.is-compact .floating-subnav__identity {
  padding-inline-end: 0.4rem;
}

.floating-subnav__logo {
  display: inline-flex;
  flex: none;
  align-items: center;
  margin-inline-end: 0.35rem;
  transition: margin var(--fs-duration) var(--fs-ease);
}

.floating-subnav.is-compact .floating-subnav__logo {
  margin-inline-end: 0;
}

.floating-subnav__logo img {
  display: block;
  width: auto;
  max-width: 136px;
  height: 75%;
  object-fit: contain;
}

.floating-subnav__logo-dark {
  display: none !important;
}

html.dark .floating-subnav__logo-light {
  display: none !important;
}

html.dark .floating-subnav__logo-dark {
  display: block !important;
}

/* ---------- Divider + links ---------- */

.floating-subnav__divider {
  flex: none;
  width: 1px;
  height: 16px;
  margin-inline: 0.25rem 0.35rem;
  background: var(--fs-divider);
}

.floating-subnav__separator {
  flex: none;
  width: 1px;
  height: 16px;
  margin-inline: 0.25rem 0.35rem;
  background: var(--fs-divider);
  align-self: center;
}

.floating-subnav__menu-separator {
  display: flex;
  align-items: center;
  min-height: 40px;
  background: transparent;
}

.floating-subnav__menu-separator::before {
  content: '';
  display: block;
  flex: none;
  width: 1px;
  height: 16px;
  margin-inline: 0.25rem 0.35rem;
  background: var(--fs-divider);
}

.floating-subnav__links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.floating-subnav__link {
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
  transition: background-color 0.2s ease, color 0.2s ease;
}

/* ---------- Hover / active ---------- */

.floating-subnav__identity:hover,
.floating-subnav__identity:focus-visible,
.floating-subnav__links a.floating-subnav__link:hover,
.floating-subnav__more-button:hover,
.floating-subnav__menu-link:hover {
  background: var(--fs-hover);
}

.floating-subnav__identity[aria-current='page'],
.floating-subnav__links a[aria-current='page'],
.floating-subnav__menu-link[aria-current='page'],
.floating-subnav__more-button[aria-expanded='true'] {
  background: var(--fs-active);
}

.floating-subnav__links a:hover,
.floating-subnav__links a[aria-current='page'],
.floating-subnav__menu-link[aria-current='page'] {
  color: var(--vp-c-brand-1);
}

/* ---------- More button + menu ---------- */

.floating-subnav__more {
  position: relative;
  display: flex;
  flex: none;
}

.floating-subnav__more .floating-subnav__collapse-inner {
  padding-inline-start: 0.25rem;
}

.floating-subnav__more-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: var(--radius-md);
  color: var(--vp-c-text-1);
  background: transparent;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.floating-subnav__more-button svg {
  transition: transform 0.3s var(--fs-ease);
}

.floating-subnav__more-button[aria-expanded='true'] svg {
  transform: rotate(180deg);
}

.floating-subnav__menu {
  position: absolute;
  inset-block-start: calc(100% + 0.9rem);
  inset-inline-end: 0;
  min-width: 11rem;
  margin: 0;
  padding: 0.35rem;
  list-style: none;
  border: 1px solid var(--fs-border);
  border-radius: var(--radius-lg);
  background: var(--fs-bg);
  box-shadow: var(--fs-shadow), var(--fs-highlight);
  -webkit-backdrop-filter: var(--fs-blur);
  backdrop-filter: var(--fs-blur);
  transform-origin: top;
}

html.dark .floating-subnav__menu {
  background: rgb(24 24 27 / 82%);
}

:root:not(.dark) .floating-subnav__menu {
  background: rgb(255 255 255 / 86%);
}

.floating-subnav__menu-link {
  display: flex;
  align-items: center;
  height: 34px;
  padding: 0 0.75rem;
  border-radius: var(--radius-md);
  color: var(--vp-c-text-1);
  font-size: 0.78rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.floating-subnav-menu-enter-active,
.floating-subnav-menu-leave-active {
  transition: opacity 0.2s ease, transform 0.3s var(--fs-ease);
}

.floating-subnav-menu-enter-from,
.floating-subnav-menu-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

/* ---------- Measuring layer ---------- */

.floating-subnav__ghost {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  display: flex;
  gap: 0.25rem;
  visibility: hidden;
  pointer-events: none;
  white-space: nowrap;
}

/* ---------- Responsive ---------- */

@media (max-width: 680px) {
  .floating-subnav {
    top: calc(var(--vp-nav-height, 64px) + 0.5rem);
    max-width: calc(100vw - 1rem);
    padding: 0.25rem 0.35rem;
  }

  .floating-subnav__identity {
    max-width: calc(100vw - 4.5rem);
    font-size: 0.78rem;
  }

  .floating-subnav__logo img {
    max-width: 110px;
  }
}

@media (max-width: 767px) {
  .floating-subnav__collapse--links,
  .floating-subnav__more,
  .floating-subnav__ghost {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .floating-subnav *,
  .floating-subnav {
    transition-duration: 0.01ms !important;
  }
}
</style>
