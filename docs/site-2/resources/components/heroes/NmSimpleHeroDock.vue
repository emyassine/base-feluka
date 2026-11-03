<script lang="ts">
export interface DockItem {
  /** Stable key. Also the name of the optional `icon-<id>` slot override. Falls back to the index. */
  id?: string
  label: string
  mobileLabel?: string
  /** Built-in icon name, icon resource URL, image URL, or icon component. */
  icon?: string | (() => unknown)
  /** Tile color. Defaults to the brand gradient for built-in icons. */
  color?: string
  /** Pill on the top-right corner, e.g. "Soon". */
  badge?: string
  /** Highlight dot below this item. */
  active?: boolean
  href?: string
  external?: boolean
  onClick?: () => void
  className?: string
}

export interface DockGroup {
  id?: string
  label: string
  items: DockItem[]
  /** Item indexes after which a divider is drawn. */
  separators?: number[]
  /** Index of the item highlighted with the dot below it, for this tab. */
  indicatorIndex?: number
}
</script>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  /** Single dock, no tabs. */
  items?: DockItem[]
  /** One tab per group. No tab bar when there is only one group. */
  groups?: DockGroup[]
  /** Initial tab: group id, group label or index. */
  defaultGroup?: string | number
  label?: string
  className?: string
  /** Pointer distance (px) over which the magnification fades out. */
  distance?: number
  panelHeight?: number
  baseItemSize?: number
  mobileItemSize?: number
  magnification?: number
  /** Single-dock mode only. */
  separators?: number[]
  /** Single-dock mode only. */
  indicatorIndex?: number
  radius?: string | number
  panelRadius?: string | number
}>(), {
  items: () => [],
  groups: () => [],
  label: 'Explore Numerimondes',
  className: '',
  distance: 150,
  panelHeight: 68,
  baseItemSize: 50,
  mobileItemSize: 60,
  magnification: 70,
  separators: () => [],
  radius: 'calc(var(--radius-lg) * 1.2)',
  panelRadius: '19px',
})

const emit = defineEmits<{
  change: [id: string, index: number]
  select: [item: DockItem, index: number]
}>()

/* ------------------------------------------------------------------ */
/* Built-in icons                                                      */
/* ------------------------------------------------------------------ */
const iconPaths: Record<string, string> = {
  briefcase: 'M3.5 8.5h17v11h-17z M8 8.5V5h8v3.5 M3.5 13h17 M10 13v2h4v-2',
  server: 'M4 4.5h16v6H4z M4 13.5h16v6H4z M7 7.5h.01 M7 16.5h.01 M11 7.5h6 M11 16.5h6',
  sparkles: 'm12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z M5 14l.6 1.4L7 16l-1.4.6L5 18l-.6-1.4L3 16l1.4-.6L5 14z',
  building: 'M4 21V5l8-2v18 M12 9h8v12 M7 7h1 M7 11h1 M7 15h1 M15 12h2 M15 16h2 M2 21h20',
  home: 'm3 10 9-7 9 7 M5 9v12h14V9 M9 21v-7h6v7',
  archive: 'M4 4h16v4H4z M5 8v12h14V8 M9 12h6',
  profile: 'M20 21a8 8 0 0 0-16 0 M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  settings: 'M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.1h-2.6v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H6.4v-2.6h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.1H15v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.1V14h-.1a1.7 1.7 0 0 0-1.5 1z',
  link: 'M10 13.5 8.5 15a3.5 3.5 0 0 1-5-5l3-3a3.5 3.5 0 0 1 5 0 M14 10.5l1.5-1.5a3.5 3.5 0 0 1 5 5l-3 3a3.5 3.5 0 0 1-5 0 M8.5 12h7',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z',
  mail: 'M4 5.5h16v13H4z M4 7l8 6 8-6',
  phone: 'M6 3.5h3l1.5 4-2 1.3a11 11 0 0 0 5.7 5.7l1.3-2 4 1.5v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4 5.5a2 2 0 0 1 2-2z',
  code: 'm8 8-4 4 4 4 M16 8l4 4-4 4 M13.5 5l-3 14',
  users: 'M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20 M10 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z M20 20v-1.5a3.5 3.5 0 0 0-2.5-3.3 M15.5 5.2a3.5 3.5 0 0 1 0 6.6',
  file: 'M6 3h8l4 4v14H6z M14 3v4h4 M9 12h6 M9 16h6',
  book: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z M5 17a3 3 0 0 1 3-3h11',
  shield: 'M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6l8-3z',
  chart: 'M4 20V4 M4 20h16 M8 16v-4 M12 16V8 M16 16v-6',
  package: 'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z M4 7.5l8 4.5 8-4.5 M12 12v9',
  layers: 'm12 3 9 5-9 5-9-5 9-5z M3 12.5l9 5 9-5',
}

/** Icons that have their own brand gradient (the original Numerimondes look). */
const TONE_NAMES = ['briefcase', 'server', 'sparkles', 'building']

/** Image sources: absolute/relative URLs, data URIs, or the build-time '@spmpst::icon::' prefix. */
const SOURCE_PATTERN = /^(@|https?:|\/|data:|blob:)|\.(svg|png|jpe?g|webp|avif|gif)(\?.*)?$/i
/** Sources that are monochrome symbols, drawn white on a tile. */
const GLYPH_PATTERN = /^@spmpst::icon::|\.svg(\?.*)?(#.*)?$|^data:image\/svg/i

type IconMode = 'component' | 'builtin' | 'symbol' | 'image'

function iconMode(item: DockItem): IconMode {
  if (typeof item.icon === 'function') return 'component'
  const icon = item.icon
  if (!icon) return 'builtin'
  if (icon in iconPaths) return 'builtin'
  if (GLYPH_PATTERN.test(icon)) return 'symbol'
  return SOURCE_PATTERN.test(icon) ? 'image' : 'builtin'
}

function builtinPath(item: DockItem): string {
  const name = typeof item.icon === 'string' ? item.icon : ''
  return iconPaths[name] ?? iconPaths.link
}

/** Brand gradient name: the built-in icon name, or a known name found in the image source. */
function toneOf(item: DockItem): string {
  if (typeof item.icon !== 'string') return ''
  if (TONE_NAMES.includes(item.icon)) return item.icon
  return TONE_NAMES.find(name => item.icon!.toLowerCase().includes(name)) ?? ''
}

/* ------------------------------------------------------------------ */
/* Groups and tabs                                                     */
/* ------------------------------------------------------------------ */
interface ResolvedGroup {
  id: string
  label: string
  items: DockItem[]
  separators: number[]
  indicatorIndex?: number
}

const groupList = computed<ResolvedGroup[]>(() => {
  if (props.groups.length) {
    return props.groups.map((group, index) => ({
      id: group.id ?? `group-${index}`,
      label: group.label,
      items: group.items,
      separators: group.separators ?? [],
      indicatorIndex: group.indicatorIndex,
    }))
  }
  return [{
    id: 'default',
    label: props.label,
    items: props.items,
    separators: props.separators,
    indicatorIndex: props.indicatorIndex,
  }]
})

function resolveInitialIndex(): number {
  const list = groupList.value
  const wanted = props.defaultGroup
  if (typeof wanted === 'number') return Math.min(Math.max(0, wanted), list.length - 1)
  if (typeof wanted === 'string') {
    const found = list.findIndex(group => group.id === wanted || group.label === wanted)
    return found >= 0 ? found : 0
  }
  return 0
}

const activeIndex = ref(resolveInitialIndex())
const activeGroup = computed(() => groupList.value[Math.min(activeIndex.value, groupList.value.length - 1)])
const showTabs = computed(() => groupList.value.length > 1)
const tabsEl = ref<HTMLElement | null>(null)

watch(() => groupList.value.length, (length) => {
  if (activeIndex.value > length - 1) activeIndex.value = Math.max(0, length - 1)
})

function selectGroup(index: number) {
  if (index === activeIndex.value) return
  resetMagnification()
  bouncing.value = null
  activeIndex.value = index
  emit('change', groupList.value[index].id, index)
}

function onTabKeydown(event: KeyboardEvent) {
  const total = groupList.value.length
  let next = activeIndex.value
  if (event.key === 'ArrowRight') next = (next + 1) % total
  else if (event.key === 'ArrowLeft') next = (next - 1 + total) % total
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = total - 1
  else return
  event.preventDefault()
  selectGroup(next)
  tabsEl.value?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus()
}

/* ------------------------------------------------------------------ */
/* Magnification: transforms only, so the layout never moves           */
/* ------------------------------------------------------------------ */
const dockEl = ref<HTMLElement | null>(null)
const scales = ref<number[]>([])
const offsets = ref<number[]>([])
const canMagnify = ref(false)

let centers: number[] = []
let slotSize = 0
let frame = 0
let mediaQuery: MediaQueryList | null = null

function measure() {
  const dock = dockEl.value
  if (!dock) {
    centers = []
    return
  }
  const slots = dock.querySelectorAll<HTMLElement>('.nm-dock__slot')
  centers = Array.from(slots, slot => slot.offsetLeft + slot.offsetWidth / 2)
  slotSize = slots[0]?.offsetWidth || props.baseItemSize
}

function compute(x: number | null) {
  if (x === null || !centers.length) {
    if (scales.value.length) {
      scales.value = []
      offsets.value = []
    }
    return
  }
  const peak = Math.max(1, props.magnification / props.baseItemSize)
  const reach = Math.max(1, props.distance)
  const nextScales = centers.map((center) => {
    const ratio = Math.min(1, Math.abs(x - center) / reach)
    return 1 + (peak - 1) * ((Math.cos(Math.PI * ratio) + 1) / 2)
  })
  const extras = nextScales.map(scale => (scale - 1) * slotSize)
  const total = extras.reduce((sum, value) => sum + value, 0)
  let running = 0
  offsets.value = extras.map((extra) => {
    const shift = running + extra / 2 - total / 2
    running += extra
    return Math.round(shift * 10) / 10
  })
  scales.value = nextScales.map(scale => Math.round(scale * 1000) / 1000)
}

function resetMagnification() {
  cancelAnimationFrame(frame)
  centers = []
  compute(null)
}

function onPointerEnter(event: PointerEvent) {
  if (!canMagnify.value || event.pointerType !== 'mouse') return
  measure()
}

function onPointerMove(event: PointerEvent) {
  const dock = dockEl.value
  if (!canMagnify.value || event.pointerType !== 'mouse' || !dock) return
  if (!centers.length) measure()
  const x = event.clientX - dock.getBoundingClientRect().left - dock.clientLeft
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => compute(x))
}

function onPointerLeave() {
  cancelAnimationFrame(frame)
  compute(null)
}

/** Mouse focus (a click) never magnifies. Only keyboard focus does. */
function onItemFocus(event: FocusEvent, index: number) {
  if (!canMagnify.value) return
  let keyboard = false
  try { keyboard = (event.target as HTMLElement).matches(':focus-visible') } catch { keyboard = false }
  if (!keyboard) return
  measure()
  compute(centers[index] ?? null)
}

function onItemKeydown(event: KeyboardEvent, index: number) {
  const elements = dockEl.value?.querySelectorAll<HTMLElement>('.nm-dock__item')
  if (!elements?.length) return
  let next = index
  if (event.key === 'ArrowRight') next = (index + 1) % elements.length
  else if (event.key === 'ArrowLeft') next = (index - 1 + elements.length) % elements.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = elements.length - 1
  else return
  event.preventDefault()
  elements[next].focus()
}

function slotStyle(index: number) {
  return { '--s': scales.value[index] ?? 1, '--tx': `${offsets.value[index] ?? 0}px` }
}

/** A divider rides on the edge of the item before it, so it never overlaps a magnified neighbor. */
function dividerStyle(index: number) {
  const scale = scales.value[index] ?? 1
  const shift = (offsets.value[index] ?? 0) + ((scale - 1) * (slotSize || props.baseItemSize)) / 2
  return { '--tx': `${Math.round(shift * 10) / 10}px` }
}

function onMediaChange() {
  canMagnify.value = !!mediaQuery?.matches
  resetMagnification()
}

function onWindowResize() {
  centers = []
}

onMounted(() => {
  mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 641px) and (prefers-reduced-motion: no-preference)')
  canMagnify.value = mediaQuery.matches
  mediaQuery.addEventListener('change', onMediaChange)
  window.addEventListener('resize', onWindowResize, { passive: true })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  mediaQuery?.removeEventListener('change', onMediaChange)
  window.removeEventListener('resize', onWindowResize)
})

/* ------------------------------------------------------------------ */
/* Items                                                               */
/* ------------------------------------------------------------------ */
const bouncing = ref<number | null>(null)

const itemKey = (item: DockItem, index: number) => item.id ?? String(index)
const isActive = (group: ResolvedGroup, item: DockItem, index: number) =>
  item.active === true || group.indicatorIndex === index

function tileStyle(item: DockItem) {
  const style: Record<string, string> = {}
  if (item.color) style['--tile'] = item.color
  if (iconMode(item) === 'image' && typeof item.icon === 'string') {
    const escaped = item.icon.replace(/[\\"\n\r]/g, character => `\\${character}`)
    style.backgroundImage = `url("${escaped}")`
  }
  return style
}

function itemClasses(item: DockItem) {
  const tone = toneOf(item)
  return [
    tone ? `tone--${tone}` : '',
    item.color ? 'has-color' : '',
    item.className,
  ]
}

function activate(item: DockItem, index: number) {
  item.onClick?.()
  emit('select', item, index)
  bouncing.value = index
}

const toCss = (value: string | number) => (typeof value === 'number' ? `${value}px` : value)

const rootStyle = computed(() => ({
  '--nm-base': `${props.baseItemSize}px`,
  '--nm-mobile': `${props.mobileItemSize}px`,
  '--nm-rise': `${Math.max(0, props.magnification - props.baseItemSize)}px`,
  '--nm-pad-x': `${Math.max(12, (props.magnification - props.baseItemSize) * 0.6)}px`,
  '--nm-panel-min': `${props.panelHeight}px`,
  '--nm-radius': toCss(props.radius),
  '--nm-panel-radius': toCss(props.panelRadius),
}))
</script>

<template>
  <div class="nm-dock nm-simple-hero-dock" :class="props.className" :style="rootStyle">
    <div
      v-if="showTabs"
      ref="tabsEl"
      class="nm-dock__tabs"
      role="tablist"
      :aria-label="props.label"
      @keydown="onTabKeydown"
    >
      <button
        v-for="(group, i) in groupList"
        :key="group.id"
        type="button"
        role="tab"
        class="nm-dock__tab"
        :class="{ 'is-active': i === activeIndex }"
        :aria-selected="i === activeIndex"
        :tabindex="i === activeIndex ? 0 : -1"
        @click="selectGroup(i)"
      >{{ group.label }}</button>
    </div>

    <div class="nm-dock__stage" :role="showTabs ? 'tabpanel' : undefined" :aria-label="showTabs ? activeGroup.label : undefined">
      <Transition name="nm-dock-swap" mode="out-in">
        <div :key="activeGroup.id" class="nm-dock__scroller">
          <div
            ref="dockEl"
            class="nm-dock__panel"
            role="toolbar"
            :aria-label="activeGroup.label"
            @pointerenter="onPointerEnter"
            @pointermove="onPointerMove"
            @pointerleave="onPointerLeave"
          >
            <template v-for="(item, index) in activeGroup.items" :key="itemKey(item, index)">
              <div class="nm-dock__slot" :style="slotStyle(index)">
                <component
                  :is="item.href ? 'a' : 'button'"
                  class="nm-dock__item"
                  :class="itemClasses(item)"
                  :style="tileStyle(item)"
                  :href="item.href"
                  :type="item.href ? undefined : 'button'"
                  :target="item.href && item.external ? '_blank' : undefined"
                  :rel="item.href && item.external ? 'noopener noreferrer' : undefined"
                  :aria-label="item.label"
                  :aria-current="isActive(activeGroup, item, index) ? 'true' : undefined"
                  draggable="false"
                  @click="activate(item, index)"
                  @focus="onItemFocus($event, index)"
                  @blur="compute(null)"
                  @keydown="onItemKeydown($event, index)"
                >
                  <span
                    class="nm-dock__tile"
                    :class="{ 'is-bouncing': bouncing === index }"
                    @animationend="bouncing = null"
                  >
                    <!-- One tile: artwork is its background; icons sit centered on it. -->
                    <slot :name="`icon-${itemKey(item, index)}`" :item="item">
                      <component
                        :is="item.icon"
                        v-if="iconMode(item) === 'component'"
                        class="nm-dock__custom-icon"
                        aria-hidden="true"
                      />
                      <svg
                        v-else-if="iconMode(item) === 'builtin'"
                        class="nm-dock__icon"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.65"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                      >
                        <path :d="builtinPath(item)" />
                      </svg>
                      <img
                        v-else-if="iconMode(item) === 'symbol'"
                        class="nm-dock__symbol"
                        :src="item.icon as string"
                        alt=""
                        draggable="false"
                        decoding="async"
                      />
                    </slot>
                  </span>
                  <span v-if="item.badge" class="nm-dock__badge">{{ item.badge }}</span>
                </component>

                <span class="nm-dock__tooltip" aria-hidden="true">{{ item.label }}</span>
                <span class="nm-dock__label" aria-hidden="true">{{ item.mobileLabel ?? item.label }}</span>
                <span v-if="isActive(activeGroup, item, index)" class="nm-dock__indicator" aria-hidden="true"></span>
              </div>
              <span
                v-if="activeGroup.separators.includes(index)"
                class="nm-dock__divider"
                :style="dividerStyle(index)"
                aria-hidden="true"
              ></span>
            </template>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.nm-dock {
  --nm-size: var(--nm-base, 50px);
  --nm-icon-size: clamp(1.35rem, calc(var(--nm-size) * 0.54), 1.9rem);
  --nm-label-h: 0px;
  --nm-gap: 8px;
  display: flex;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  flex-direction: column;
  align-items: center;
  pointer-events: auto;
}

/* ---------------------------------------------------------------- */
/* Tabs                                                              */
/* ---------------------------------------------------------------- */
.nm-dock__tabs {
  display: flex;
  max-width: 100%;
  gap: 2px;
  margin-bottom: 0.5rem;
  padding: 3px;
  overflow-x: auto;
  scrollbar-width: none;
  border: 1px solid rgb(255 255 255 / 0.3);
  border-radius: 999px;
  background: color-mix(in srgb, var(--vp-c-bg) 38%, transparent);
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.18), inset 0 1px 0 rgb(255 255 255 / 0.3);
  -webkit-backdrop-filter: blur(24px) saturate(1.35);
  backdrop-filter: blur(24px) saturate(1.35);
}
.nm-dock__tabs::-webkit-scrollbar { display: none; }

.nm-dock__tab {
  flex: 0 0 auto;
  min-height: 1.75rem;
  padding: 0.25rem 0.9rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 160ms ease, color 160ms ease;
}
.nm-dock__tab.is-active { background: var(--vp-c-brand-1); color: var(--vp-c-white); }
.nm-dock__tab:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
@media (hover: hover) {
  .nm-dock__tab:not(.is-active):hover { background: color-mix(in srgb, var(--vp-c-text-1) 10%, transparent); }
}

/* ---------------------------------------------------------------- */
/* Stage and panel                                                   */
/* ---------------------------------------------------------------- */
.nm-dock__stage {
  display: flex;
  width: 100%;
  min-width: 0;
  justify-content: center;
  overflow: visible;
}

.nm-dock__scroller {
  display: flex;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  /* Reserve the space magnified icons grow into, so the page never shifts. */
  padding: var(--nm-rise, 0px) 0.25rem 0.5rem;
}

.nm-dock__panel {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex: 0 0 auto;
  align-items: flex-end;
  gap: var(--nm-gap);
  margin-inline: auto;
  min-height: max(var(--nm-panel-min, 68px), calc(var(--nm-size) + var(--nm-label-h) + 28px + 2px));
  padding: 0.75rem var(--nm-pad-x, 0.75rem) 1rem;
  border: 1px solid rgb(255 255 255 / 0.34);
  border-radius: var(--nm-panel-radius, 19px);
  background:
    linear-gradient(145deg, rgb(255 255 255 / 0.24), rgb(255 255 255 / 0.04) 48%, rgb(255 255 255 / 0.1)),
    color-mix(in srgb, var(--vp-c-bg) 38%, transparent);
  box-shadow:
    0 8px 28px rgb(0 0 0 / 0.3),
    inset 0 1px 0 rgb(255 255 255 / 0.42),
    inset 0 -1px 0 rgb(255 255 255 / 0.1);
  -webkit-backdrop-filter: blur(30px) saturate(1.35);
  backdrop-filter: blur(30px) saturate(1.35);
}

/* ---------------------------------------------------------------- */
/* Slot: fixed size, so the layout never reflows                     */
/* ---------------------------------------------------------------- */
.nm-dock__slot {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  width: var(--nm-size);
  flex-direction: column;
  align-items: center;
  transform: translate3d(var(--tx, 0px), 0, 0);
  transition: transform 90ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.nm-dock__item {
  position: relative;
  display: block;
  box-sizing: border-box;
  width: var(--nm-size);
  height: var(--nm-size);
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  background: none;
  color: var(--vp-c-white);
  cursor: pointer;
  outline: none;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  user-select: none;
  transform: scale(var(--s, 1));
  transform-origin: 50% 100%;
  transition: transform 90ms cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform;
}
.nm-dock__item,
.nm-dock__item:hover,
.nm-dock__item:focus-visible { color: var(--vp-c-white) !important; }

.nm-dock__tile {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 0.24);
  border-radius: var(--nm-radius, calc(var(--radius-lg) * 1.2));
  background-color: var(--vp-c-brand-1);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: linear-gradient(145deg, color-mix(in srgb, var(--vp-c-brand-1) 58%, white), var(--vp-c-brand-1));
  box-shadow: 0 4px 9px rgb(0 0 0 / 0.2), inset 0 1px 0 rgb(255 255 255 / 0.3);
  transition: filter 80ms ease;
}
.nm-dock__item.tone--server .nm-dock__tile { background-image: linear-gradient(145deg, var(--vp-c-brand-1), var(--vp-c-brand-2)); }
.nm-dock__item.tone--sparkles .nm-dock__tile { background-image: linear-gradient(145deg, color-mix(in srgb, var(--vp-c-brand-1) 38%, white), color-mix(in srgb, var(--vp-c-brand-1) 76%, white)); }
.nm-dock__item.tone--building .nm-dock__tile { background-image: linear-gradient(145deg, var(--vp-c-brand-2), var(--vp-c-brand-3)); }
.nm-dock__item.has-color .nm-dock__tile { background-image: linear-gradient(145deg, color-mix(in srgb, var(--tile) 62%, white), var(--tile)); }

.nm-dock__item:focus-visible .nm-dock__tile {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

/* Keep artwork colors stable; hover only scales/fades the icon below. */
.nm-dock__item:active .nm-dock__tile { filter: brightness(0.78); }

.nm-dock__icon,
.nm-dock__custom-icon {
  width: var(--nm-icon-size);
  height: var(--nm-icon-size);
  flex: 0 0 auto;
}
.nm-dock__icon { stroke: var(--vp-c-white); }
.nm-dock :deep(.nm-dock__custom-icon) {
  color: var(--vp-c-white) !important;
}
.nm-dock__symbol {
  display: block;
  width: var(--nm-icon-size);
  height: var(--nm-icon-size);
  filter: brightness(0) invert(1);
  pointer-events: none;
  -webkit-user-drag: none;
}

@media (hover: hover) {
  .nm-dock__slot:hover .nm-dock__icon,
  .nm-dock__slot:hover .nm-dock__custom-icon,
  .nm-dock__slot:hover .nm-dock__symbol {
    transform: scale(0.9);
    opacity: 0.75;
  }
  .nm-dock__slot:hover .nm-dock__icon,
  .nm-dock__slot:hover .nm-dock__custom-icon { transform: scale(0.9); }
}

/* ---- bounce when launched ---- */
.nm-dock__tile.is-bouncing { animation: nm-dock-bounce 640ms cubic-bezier(0.28, 0.84, 0.42, 1) 1; }
@keyframes nm-dock-bounce {
  0%, 100% { transform: translateY(0); }
  30% { transform: translateY(calc(var(--nm-size) * -0.42)); }
  55% { transform: translateY(0); }
  75% { transform: translateY(calc(var(--nm-size) * -0.14)); }
  90% { transform: translateY(0); }
}

/* ---- badge ---- */
.nm-dock__badge {
  position: absolute;
  top: -4px;
  right: -6px;
  z-index: 1;
  padding: 1px 5px;
  border-radius: 999px;
  background: #ff3b30;
  box-shadow: 0 0 0 1.5px rgb(255 255 255 / 0.9), 0 1px 4px rgb(0 0 0 / 0.35);
  color: #fff;
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.35;
  text-transform: uppercase;
  pointer-events: none;
}

/* ---------------------------------------------------------------- */
/* Tooltip with arrow (desktop)                                      */
/* ---------------------------------------------------------------- */
.nm-dock__tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  z-index: 5;
  width: max-content;
  max-width: 14rem;
  margin-bottom: 12px;
  padding: 0.3rem 0.65rem;
  border: 1px solid rgb(255 255 255 / 0.2);
  border-radius: 8px;
  background: rgb(0 0 0 / 0.58);
  box-shadow: 0 5px 15px rgb(0 0 0 / 0.25);
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
  color: rgb(255 255 255 / 0.95);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.25;
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, calc(4px - (var(--s, 1) - 1) * var(--nm-size)));
  transition: opacity 120ms ease, transform 120ms ease;
}
.nm-dock__tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -6px;
  border-top: 6px solid rgb(0 0 0 / 0.58);
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
}

@media (hover: hover) {
  .nm-dock__slot:hover .nm-dock__tooltip {
    opacity: 1;
    transform: translate(-50%, calc(0px - (var(--s, 1) - 1) * var(--nm-size)));
  }
}
.nm-dock__slot:has(.nm-dock__item:focus-visible) .nm-dock__tooltip {
  opacity: 1;
  transform: translate(-50%, calc(0px - (var(--s, 1) - 1) * var(--nm-size)));
}

/* ---------------------------------------------------------------- */
/* Mobile label, highlight dot, divider                              */
/* ---------------------------------------------------------------- */
.nm-dock__label { display: none; }

.nm-dock__indicator {
  position: absolute;
  bottom: -0.7rem;
  left: 50%;
  width: 0.3rem;
  height: 0.3rem;
  transform: translateX(-50%);
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 8px color-mix(in srgb, var(--vp-c-brand-1) 55%, transparent);
  pointer-events: none;
}

.nm-dock__divider {
  width: 1px;
  height: calc(var(--nm-size) * 0.9);
  flex: 0 0 1px;
  align-self: flex-end;
  margin-inline: 0.15rem;
  margin-bottom: calc(var(--nm-size) * 0.05 + var(--nm-label-h));
  background: var(--vp-c-text-1);
  opacity: 0.2;
  transform: translate3d(var(--tx, 0px), 0, 0);
  transition: transform 90ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* ---------------------------------------------------------------- */
/* Group swap                                                        */
/* ---------------------------------------------------------------- */
.nm-dock-swap-enter-active,
.nm-dock-swap-leave-active { transition: opacity 140ms ease, transform 140ms ease; }
.nm-dock-swap-enter-from,
.nm-dock-swap-leave-to { opacity: 0; transform: translateY(6px); }

/* ---------------------------------------------------------------- */
/* Mobile: sizes are driven by CSS variables only                    */
/* ---------------------------------------------------------------- */
@media (max-width: 640px) {
  .nm-dock {
    --nm-size: var(--nm-mobile, 60px);
    --nm-label-h: 1rem;
    --nm-gap: 0.55rem;
  }

  .nm-dock__scroller {
    padding: 0.25rem 0.25rem 1rem;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-x: contain;
  }
  .nm-dock__scroller::-webkit-scrollbar { display: none; }

  .nm-dock__panel { padding: 0.75rem 0.75rem 1rem; }

  .nm-dock__tooltip { display: none; }

  .nm-dock__label {
    display: block;
    width: calc(var(--nm-size) + 0.5rem);
    height: 0.75rem;
    margin-top: 0.3rem;
    overflow: hidden;
    color: var(--vp-c-text-1);
    font-size: 0.625rem;
    font-weight: 600;
    line-height: 0.75rem;
    opacity: 0.9;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .nm-dock__indicator { bottom: -0.8rem; }
}

@media (prefers-reduced-motion: reduce) {
  .nm-dock__slot,
  .nm-dock__item,
  .nm-dock__tile,
  .nm-dock__divider,
  .nm-dock__tooltip,
  .nm-dock__tab,
  .nm-dock-swap-enter-active,
  .nm-dock-swap-leave-active { transition: none; }
  .nm-dock__tile.is-bouncing { animation: none; }
}
</style>
