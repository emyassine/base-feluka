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
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { tabsKey } from '../tabs/tabs-context'

const props = withDefaults(defineProps<{
  /** Single dock, no tabs. */
  items?: DockItem[]
  /** Render the items without the dock panel chrome. */
  bare?: boolean
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
  bare: false,
  groups: () => [],
  label: 'Explore',
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
const tabsId = `feluqa-dock-tabs-${useId()}`

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

function selectGroupId(id: string) {
  const index = groupList.value.findIndex(group => group.id === id)
  if (index >= 0) selectGroup(index)
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
  const slots = dock.querySelectorAll<HTMLElement>('.feluqa-dock__slot')
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
  const nextOffsets = extras.map((extra) => {
    const shift = running + extra / 2 - total / 2
    running += extra
    return Math.round(shift * 10) / 10
  })
  offsets.value = nextOffsets
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
  const elements = dockEl.value?.querySelectorAll<HTMLElement>('.feluqa-dock__item')
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
let pendingNavigation: { index: number; href: string; external: boolean; timer: number } | null = null

const itemKey = (item: DockItem, index: number) => item.id ?? String(index)
const isActive = (group: ResolvedGroup, item: DockItem, index: number) =>
  item.active === true || group.indicatorIndex === index

function tileStyle(item: DockItem) {
  const style: Record<string, string> = {}
  if (item.color) style['--tile'] = item.color
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

function finishBounce(index: number) {
  if (!pendingNavigation || pendingNavigation.index !== index) {
    if (bouncing.value === index) bouncing.value = null
    return
  }

  const navigation = pendingNavigation
  pendingNavigation = null
  window.clearTimeout(navigation.timer)
  bouncing.value = null

  if (navigation.external) {
    window.open(navigation.href, '_blank', 'noopener,noreferrer')
  } else {
    window.location.assign(navigation.href)
  }
}

function activate(event: MouseEvent, item: DockItem, index: number) {
  // Keep native modified clicks (new tab/window, middle click) intact.
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    item.onClick?.()
    emit('select', item, index)
    return
  }

  if (item.href) event.preventDefault()
  item.onClick?.()
  emit('select', item, index)
  bouncing.value = index

  if (!item.href) return

  if (pendingNavigation) window.clearTimeout(pendingNavigation.timer)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    pendingNavigation = { index, href: item.href, external: item.external === true, timer: 0 }
    finishBounce(index)
    return
  }

  const timer = window.setTimeout(() => finishBounce(index), 700)
  pendingNavigation = { index, href: item.href, external: item.external === true, timer }
}

const toCss = (value: string | number) => (typeof value === 'number' ? `${value}px` : value)

const rootStyle = computed(() => ({
  '--feluqa-base': `${props.baseItemSize}px`,
  '--feluqa-mobile': `${props.mobileItemSize}px`,
  '--feluqa-pad-x': `${Math.max(12, (props.magnification - props.baseItemSize) * 0.6)}px`,
  '--feluqa-pad-x-hover': `${Math.max(24, (props.magnification - props.baseItemSize) * 0.6 + 12)}px`,
  '--feluqa-panel-min': `${props.panelHeight}px`,
  '--feluqa-radius': toCss(props.radius),
  '--feluqa-panel-radius': toCss(props.panelRadius),
}))
</script>

<template>
  <div class="feluqa-dock feluqa-simple-hero-dock" :class="[props.className, { 'feluqa-dock--bare': props.bare }]" :style="rootStyle">
    <Tabs
      v-if="showTabs"
      :id="tabsId"
      :model-value="activeGroup.id"
      :label="props.label"
      align="center"
      preset="rounded"
      @update:model-value="selectGroupId"
    >
      <TabsItem
        v-for="group in groupList"
        :key="group.id"
        :value="group.id"
      >{{ group.label }}</TabsItem>
    </Tabs>

    <div
      class="feluqa-dock__stage"
      :role="showTabs ? 'tabpanel' : undefined"
      :id="showTabs ? `${tabsId}-panel-${tabsKey(activeGroup.id)}` : undefined"
      :aria-labelledby="showTabs ? `${tabsId}-tab-${tabsKey(activeGroup.id)}` : undefined"
      :aria-label="showTabs ? activeGroup.label : undefined"
    >
      <Transition name="feluqa-dock-swap" mode="out-in">
        <div :key="activeGroup.id" class="feluqa-dock__scroller">
          <div
            ref="dockEl"
            class="feluqa-dock__panel"
            :class="{ 'is-magnifying': scales.length > 0 }"
            role="toolbar"
            :aria-label="activeGroup.label"
            @pointerenter="onPointerEnter"
            @pointermove="onPointerMove"
            @pointerleave="onPointerLeave"
          >
            <template v-for="(item, index) in activeGroup.items" :key="itemKey(item, index)">
              <div class="feluqa-dock__slot" :style="slotStyle(index)">
                <component
                  :is="item.href ? 'a' : 'button'"
                  class="feluqa-dock__item"
                  :class="itemClasses(item)"
                  :href="item.href"
                  :type="item.href ? undefined : 'button'"
                  :target="item.href && item.external ? '_blank' : undefined"
                  :rel="item.href && item.external ? 'noopener noreferrer' : undefined"
                  :aria-label="item.label"
                  :aria-current="isActive(activeGroup, item, index) ? 'true' : undefined"
                  draggable="false"
                  @click="activate($event, item, index)"
                  @focus="onItemFocus($event, index)"
                  @blur="compute(null)"
                  @keydown="onItemKeydown($event, index)"
                >
                  <span
                    class="feluqa-dock__tile"
                    :class="{
                      'is-bouncing': bouncing === index,
                      'is-image-background': iconMode(item) === 'image',
                    }"
                    :style="tileStyle(item)"
                    @animationend="finishBounce(index)"
                  >
                    <!-- One tile: artwork is its background; icons sit centered on it. -->
                    <slot :name="`icon-${itemKey(item, index)}`" :item="item">
                      <span
                        v-if="iconMode(item) === 'image' && typeof item.icon === 'string'"
                        class="feluqa-dock__image-wrap"
                        aria-hidden="true"
                      >
                        <img class="feluqa-dock__image" :src="item.icon" alt="" draggable="false" decoding="async" />
                      </span>
                      <component
                        :is="item.icon"
                        v-if="iconMode(item) === 'component'"
                        class="feluqa-dock__custom-icon"
                        aria-hidden="true"
                      />
                      <svg
                        v-else-if="iconMode(item) === 'builtin'"
                        class="feluqa-dock__icon"
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
                        class="feluqa-dock__symbol"
                        :src="item.icon as string"
                        alt=""
                        draggable="false"
                        decoding="async"
                      />
                    </slot>
                  </span>
                  <span v-if="item.badge" class="feluqa-dock__badge">{{ item.badge }}</span>
                </component>

                <span class="feluqa-dock__tooltip" aria-hidden="true">{{ item.label }}</span>
                <span class="feluqa-dock__label" aria-hidden="true">{{ item.mobileLabel ?? item.label }}</span>
                <span v-if="isActive(activeGroup, item, index)" class="feluqa-dock__indicator" aria-hidden="true"></span>
              </div>
              <span
                v-if="activeGroup.separators.includes(index)"
                class="feluqa-dock__divider"
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
.feluqa-dock {
  --feluqa-size: var(--feluqa-base, 50px);
  --feluqa-icon-size: clamp(1.35rem, calc(var(--feluqa-size) * 0.54), 1.9rem);
  --feluqa-label-h: 0px;
  --feluqa-gap: 8px;
  display: flex;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  flex-direction: column;
  align-items: center;
  pointer-events: auto;
}

/* ---------------------------------------------------------------- */
/* Stage and panel                                                   */
/* ---------------------------------------------------------------- */
.feluqa-dock__stage {
  display: flex;
  width: 100%;
  min-width: 0;
  justify-content: center;
  overflow: visible;
}

.feluqa-dock__scroller {
  display: flex;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 0 0.25rem 0.5rem;
}

.feluqa-dock__panel {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex: 0 0 auto;
  align-items: flex-end;
  gap: var(--feluqa-gap);
  margin-inline: auto;
  min-height: max(var(--feluqa-panel-min, 68px), calc(var(--feluqa-size) + var(--feluqa-label-h) + 28px + 2px));
  padding: 0.75rem var(--feluqa-pad-x, 0.75rem) 1rem;
  border: 1px solid rgb(255 255 255 / 0.34);
  border-radius: var(--feluqa-panel-radius, 19px);
  background:
    linear-gradient(145deg, rgb(255 255 255 / 0.24), rgb(255 255 255 / 0.04) 48%, rgb(255 255 255 / 0.1)),
    color-mix(in srgb, var(--feluqa-surface) 38%, transparent);
  box-shadow:
    0 8px 28px rgb(0 0 0 / 0.3),
    inset 0 1px 0 rgb(255 255 255 / 0.42),
    inset 0 -1px 0 rgb(255 255 255 / 0.1);
  -webkit-backdrop-filter: blur(30px) saturate(1.35);
  backdrop-filter: blur(30px) saturate(1.35);
}
:global(.feluqa-effect-hero--light) .feluqa-dock__panel {
  border-color: rgb(255 255 255 / 0.82);
  background: linear-gradient(145deg, rgb(255 255 255 / 0.94), rgb(241 245 249 / 0.9));
  box-shadow: 0 12px 32px rgb(15 23 42 / 0.24), inset 0 1px 0 #fff, inset 0 -1px 0 rgb(148 163 184 / 0.18);
  -webkit-backdrop-filter: blur(18px) saturate(1.1);
  backdrop-filter: blur(18px) saturate(1.1);
}
.feluqa-dock__panel.is-magnifying {
  --feluqa-pad-x: var(--feluqa-pad-x-hover, 24px);
}

/* Keep the dock items and interactions while omitting the surrounding panel. */
.feluqa-dock--bare .feluqa-dock__scroller {
  padding: 0;
}
.feluqa-dock--bare .feluqa-dock__panel {
  min-height: 0;
  padding: 0.25rem;
  border: 0;
  border-radius: 0;
  background: none;
  box-shadow: none;
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
}

/* ---------------------------------------------------------------- */
/* Slot: fixed size, so the layout never reflows                     */
/* ---------------------------------------------------------------- */
.feluqa-dock__slot {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  width: var(--feluqa-size);
  flex-direction: column;
  align-items: center;
  transform: translate3d(var(--tx, 0px), 0, 0);
  transition: transform 90ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.feluqa-dock__item {
  position: relative;
  display: block;
  box-sizing: border-box;
  width: var(--feluqa-size);
  height: var(--feluqa-size);
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  background: none;
  color: var(--feluqa-on-brand);
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
.feluqa-dock__item,
.feluqa-dock__item:hover,
.feluqa-dock__item:focus-visible { color: var(--feluqa-on-brand) !important; }

.feluqa-dock__tile {
  position: relative;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 0.24);
  border-radius: var(--feluqa-radius, calc(var(--radius-lg) * 1.2));
  background-color: var(--feluqa-brand);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: linear-gradient(145deg, color-mix(in srgb, var(--feluqa-brand) 58%, white), var(--feluqa-brand));
  box-shadow: 0 4px 9px rgb(0 0 0 / 0.2), inset 0 1px 0 rgb(255 255 255 / 0.3);
  transition: filter 80ms ease;
}
.feluqa-dock__tile.is-image-background {
  --r: 50%;
  --_r: clamp(0%, var(--r) / 2, 25%);
  --_v: calc(var(--_r) * (1 - sqrt(2) / 4));
  --_p: calc(var(--_v) - var(--_r) / 2);

  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  overflow: hidden;
  border-radius: 26%;
  clip-path: shape(
    from var(--_v) var(--_p),
    curve to 50% 0 with var(--_r) 0,
    curve to calc(100% - var(--_v)) var(--_p) with calc(100% - var(--_r)) 0,
    curve to calc(100% - var(--_p)) var(--_v) with calc(100% - 2 * var(--_p)) calc(2 * var(--_p)),
    curve to 100% 50% with 100% var(--_r),
    curve to calc(100% - var(--_p)) calc(100% - var(--_v)) with 100% calc(100% - var(--_r)),
    curve to calc(100% - var(--_v)) calc(100% - var(--_p)) with calc(100% - 2 * var(--_p)) calc(100% - 2 * var(--_p)),
    curve to 50% 100% with calc(100% - var(--_r)) 100%,
    curve to var(--_v) calc(100% - var(--_p)) with var(--_r) 100%,
    curve to var(--_p) calc(100% - var(--_v)) with calc(2 * var(--_p)) calc(100% - 2 * var(--_p)),
    curve to 0 50% with 0 calc(100% - var(--_r)),
    curve to var(--_p) var(--_v) with 0 var(--_r),
    curve to var(--_v) var(--_p) with calc(2 * var(--_p)) calc(2 * var(--_p))
  );
}
.feluqa-dock__image-wrap {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.feluqa-dock__image {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  object-fit: contain;
}
.feluqa-dock__item.tone--server .feluqa-dock__tile { background-image: linear-gradient(145deg, var(--feluqa-brand), var(--feluqa-brand-secondary)); }
.feluqa-dock__item.tone--sparkles .feluqa-dock__tile { background-image: linear-gradient(145deg, color-mix(in srgb, var(--feluqa-brand) 38%, white), color-mix(in srgb, var(--feluqa-brand) 76%, white)); }
.feluqa-dock__item.tone--building .feluqa-dock__tile { background-image: linear-gradient(145deg, var(--feluqa-brand-secondary), var(--feluqa-brand-tertiary)); }
.feluqa-dock__item.has-color .feluqa-dock__tile { background-image: linear-gradient(145deg, color-mix(in srgb, var(--tile) 62%, white), var(--tile)); }

.feluqa-dock__item:focus-visible .feluqa-dock__tile {
  outline: 2px solid var(--feluqa-brand);
  outline-offset: 3px;
}

/* Keep artwork colors stable; hover only scales/fades the icon below. */
.feluqa-dock__item:active .feluqa-dock__tile { filter: brightness(0.78); }

.feluqa-dock__icon,
.feluqa-dock__custom-icon {
  width: var(--feluqa-icon-size);
  height: var(--feluqa-icon-size);
  flex: 0 0 auto;
}
.feluqa-dock__icon { stroke: var(--feluqa-on-brand); }
.feluqa-dock :deep(.feluqa-dock__custom-icon) {
  color: var(--feluqa-on-brand) !important;
}
.feluqa-dock__symbol {
  display: block;
  width: var(--feluqa-icon-size);
  height: var(--feluqa-icon-size);
  filter: brightness(0) invert(1);
  pointer-events: none;
  -webkit-user-drag: none;
}

@media (hover: hover) {
  .feluqa-dock__slot:hover .feluqa-dock__icon,
  .feluqa-dock__slot:hover .feluqa-dock__custom-icon,
  .feluqa-dock__slot:hover .feluqa-dock__symbol {
    transform: scale(0.9);
    opacity: 0.75;
  }
  .feluqa-dock__slot:hover .feluqa-dock__icon,
  .feluqa-dock__slot:hover .feluqa-dock__custom-icon { transform: scale(0.9); }
}

/* ---- bounce when launched ---- */
.feluqa-dock__tile.is-bouncing { animation: feluqa-dock-bounce 640ms cubic-bezier(0.28, 0.84, 0.42, 1) 1; }
@keyframes feluqa-dock-bounce {
  0%, 100% { transform: translateY(0); }
  30% { transform: translateY(calc(var(--feluqa-size) * -0.42)); }
  55% { transform: translateY(0); }
  75% { transform: translateY(calc(var(--feluqa-size) * -0.14)); }
  90% { transform: translateY(0); }
}

/* ---- badge ---- */
.feluqa-dock__badge {
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
.feluqa-dock__tooltip {
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
  transform: translate(-50%, calc(4px - (var(--s, 1) - 1) * var(--feluqa-size)));
  transition: opacity 120ms ease, transform 120ms ease;
}
.feluqa-dock__tooltip::after {
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
  .feluqa-dock__slot:hover .feluqa-dock__tooltip {
    opacity: 1;
    transform: translate(-50%, calc(0px - (var(--s, 1) - 1) * var(--feluqa-size)));
  }
}
.feluqa-dock__slot:has(.feluqa-dock__item:focus-visible) .feluqa-dock__tooltip {
  opacity: 1;
  transform: translate(-50%, calc(0px - (var(--s, 1) - 1) * var(--feluqa-size)));
}

/* ---------------------------------------------------------------- */
/* Mobile label, highlight dot, divider                              */
/* ---------------------------------------------------------------- */
.feluqa-dock__label { display: none; }

.feluqa-dock__indicator {
  position: absolute;
  bottom: -0.7rem;
  left: 50%;
  width: 0.3rem;
  height: 0.3rem;
  transform: translateX(-50%);
  border-radius: 50%;
  background: var(--feluqa-brand);
  box-shadow: 0 0 8px color-mix(in srgb, var(--feluqa-brand) 55%, transparent);
  pointer-events: none;
}

.feluqa-dock__divider {
  width: 1px;
  height: calc(var(--feluqa-size) * 0.9);
  flex: 0 0 1px;
  align-self: flex-end;
  margin-inline: 0.15rem;
  margin-bottom: calc(var(--feluqa-size) * 0.05 + var(--feluqa-label-h));
  background: var(--feluqa-text-primary);
  opacity: 0.2;
  transform: translate3d(var(--tx, 0px), 0, 0);
  transition: transform 90ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* ---------------------------------------------------------------- */
/* Group swap                                                        */
/* ---------------------------------------------------------------- */
.feluqa-dock-swap-enter-active,
.feluqa-dock-swap-leave-active { transition: opacity 140ms ease, transform 140ms ease; }
.feluqa-dock-swap-enter-from,
.feluqa-dock-swap-leave-to { opacity: 0; transform: translateY(6px); }

/* ---------------------------------------------------------------- */
/* Mobile: sizes are driven by CSS variables only                    */
/* ---------------------------------------------------------------- */
@media (max-width: 640px) {
  .feluqa-dock {
    --feluqa-size: var(--feluqa-mobile, 60px);
    --feluqa-label-h: 1rem;
    --feluqa-gap: 0.55rem;
  }

  .feluqa-dock__scroller {
    padding: 0.25rem 0.25rem 1rem;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-x: contain;
  }
  .feluqa-dock__scroller::-webkit-scrollbar { display: none; }

  .feluqa-dock__panel { padding: 0.75rem 0.75rem 1rem; }

  .feluqa-dock__tooltip { display: none; }

  .feluqa-dock__label {
    display: block;
    width: calc(var(--feluqa-size) + 0.5rem);
    height: 0.75rem;
    margin-top: 0.3rem;
    overflow: hidden;
    color: var(--feluqa-text-primary);
    font-size: 0.625rem;
    font-weight: 600;
    line-height: 0.75rem;
    opacity: 0.9;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .feluqa-dock__indicator { bottom: -0.8rem; }
}

@media (prefers-reduced-motion: reduce) {
  .feluqa-dock__slot,
  .feluqa-dock__item,
  .feluqa-dock__tile,
  .feluqa-dock__divider,
  .feluqa-dock__tooltip,
  .feluqa-dock-swap-enter-active,
  .feluqa-dock-swap-leave-active { transition: none; }
  .feluqa-dock__tile.is-bouncing { animation: none; }
}
</style>
