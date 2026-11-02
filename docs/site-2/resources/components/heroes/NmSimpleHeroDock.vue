<script setup lang="ts">
import { onBeforeUnmount, ref, type VNode } from 'vue'

interface DockItem {
  label: string
  mobileLabel?: string
  icon?: string | (() => VNode)
  href?: string
  onClick?: () => void
  className?: string
  hoverColor?: 'primary' | 'gray' | 'info' | 'success' | 'warning' | 'danger' | 'dark'
}

const props = withDefaults(defineProps<{
  items: DockItem[]
  label?: string
  className?: string
  distance?: number
  panelHeight?: number
  baseItemSize?: number
  mobileItemSize?: number
  magnification?: number
  separators?: number[]
  indicatorIndex?: number
  radius?: string | number
  panelRadius?: string | number
}>(), {
  label: 'Explore Numerimondes',
  className: '',
  distance: 180,
  panelHeight: 68,
  baseItemSize: 50,
  mobileItemSize: 64,
  magnification: 70,
  separators: () => [],
  radius: 'calc(var(--radius-lg) * 1.2)',
  panelRadius: '19px',
})

const itemElements: Array<HTMLElement | null> = []
const pointerX = ref<number | null>(null)
let frame = 0

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
}

function setItemElement(element: Element | null, index: number) {
  itemElements[index] = element instanceof HTMLElement ? element : null
}

function handlePointerMove(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => { pointerX.value = event.clientX })
}

function handlePointerLeave() {
  cancelAnimationFrame(frame)
  pointerX.value = null
}

function focusItem(index: number) {
  const bounds = itemElements[index]?.getBoundingClientRect()
  pointerX.value = bounds ? bounds.left + props.baseItemSize / 2 : null
}

function moveFocus(event: KeyboardEvent, index: number) {
  const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
  if (!direction || !props.items.length) return
  event.preventDefault()
  const next = (index + direction + props.items.length) % props.items.length
  itemElements[next]?.focus()
}

function itemSize(index: number) {
  const element = itemElements[index]
  if (pointerX.value === null || !element || props.distance <= 0) return props.baseItemSize
  const bounds = element.getBoundingClientRect()
  const center = bounds.left + props.baseItemSize / 2
  const influence = Math.max(0, 1 - Math.abs(pointerX.value - center) / props.distance)
  return props.baseItemSize + (props.magnification - props.baseItemSize) * influence
}

function activate(item: DockItem) {
  item.onClick?.()
}

function itemHoverStyle(item: DockItem) {
  const colors: Record<NonNullable<DockItem['hoverColor']>, string> = {
    primary: 'var(--vp-c-brand-1)',
    gray: 'var(--vp-c-bg-alt)',
    info: 'var(--vp-c-tip-1)',
    success: 'var(--vp-c-success-1)',
    warning: 'var(--vp-c-warning-1)',
    danger: 'var(--vp-c-danger-1)',
    dark: '#18181b',
  }
  const selected = item.hoverColor ? colors[item.hoverColor] : undefined
  return selected ? { '--nm-dock-hover-background': selected } : undefined
}

onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>

<template>
  <div class="nm-simple-hero-dock__outer" :style="{ '--nm-dock-panel-height': `${props.panelHeight}px`, '--nm-dock-base-item-size': `${props.baseItemSize}px`, '--nm-dock-mobile-item-size': `${props.mobileItemSize}px` }">
    <div
      class="nm-simple-hero-dock"
      :class="props.className"
      :style="{
        '--nm-dock-panel-height': `${props.panelHeight}px`,
        '--nm-dock-base-item-size': `${props.baseItemSize}px`,
        '--nm-dock-mobile-item-size': `${props.mobileItemSize}px`,
        '--nm-dock-radius': typeof props.radius === 'number' ? `${props.radius}px` : props.radius,
        '--nm-dock-panel-radius': typeof props.panelRadius === 'number' ? `${props.panelRadius}px` : props.panelRadius,
      }"
      role="toolbar"
      :aria-label="props.label"
      @pointermove="handlePointerMove"
      @pointerleave="handlePointerLeave"
    >
      <template v-for="(item, index) in props.items" :key="`${item.label}-${index}`">
        <component
          :is="item.href ? 'a' : 'button'"
          :ref="element => setItemElement(element as Element | null, index)"
          class="nm-simple-hero-dock__item"
          :class="[item.className, typeof item.icon === 'string' ? `icon--${item.icon}` : '', { 'has-hover-color': item.hoverColor }]"
          :href="item.href"
          :type="item.href ? undefined : 'button'"
          :aria-label="item.label"
          :title="item.label"
          :style="[
            { width: `${itemSize(index)}px`, height: `${itemSize(index)}px` },
            itemHoverStyle(item),
          ]"
          @click="activate(item)"
          @focus="focusItem(index)"
          @blur="pointerX = null"
          @keydown="moveFocus($event, index)"
        >
          <component :is="item.icon" v-if="typeof item.icon === 'function'" class="nm-simple-hero-dock__custom-icon" aria-hidden="true" />
          <svg v-else class="nm-simple-hero-dock__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path :d="iconPaths[item.icon ?? 'link'] ?? iconPaths.link" />
          </svg>
          <span class="nm-simple-hero-dock__tooltip" role="tooltip">
            <span class="nm-simple-hero-dock__desktop-label">{{ item.label }}</span>
            <span class="nm-simple-hero-dock__mobile-label">{{ item.mobileLabel ?? item.label }}</span>
          </span>
          <span v-if="props.indicatorIndex === index" class="nm-simple-hero-dock__indicator" aria-hidden="true"></span>
        </component>
        <span v-if="props.separators.includes(index)" class="nm-simple-hero-dock__divider" aria-hidden="true"></span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.nm-simple-hero-dock__outer {
  display: flex;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  height: max(var(--nm-dock-panel-height), calc(var(--nm-dock-base-item-size) + 1.75rem + 2px));
  align-items: center;
  justify-content: center;
  margin-inline: 0.5rem;
  overflow: visible;
}

.nm-simple-hero-dock {
  position: relative;
  box-sizing: border-box;
  display: flex;
  height: max(var(--nm-dock-panel-height, 68px), calc(var(--nm-dock-base-item-size, 50px) + 1.75rem + 2px));
  max-width: 100%;
  align-items: flex-end;
  gap: 0.5rem;
  overflow: visible;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--nm-dock-panel-radius, 19px);
  padding: 0.75rem 0.75rem 1rem;
  background: color-mix(in srgb, var(--vp-c-bg) 48%, transparent);
  box-shadow: 0 8px 28px rgb(0 0 0 / 0.3);
  -webkit-backdrop-filter: blur(30px) saturate(1.25);
  backdrop-filter: blur(30px) saturate(1.25);
}

.nm-simple-hero-dock__item {
  position: relative;
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(255 255 255 / 0.24);
  border-radius: var(--nm-dock-radius, calc(var(--radius-lg) * 1.2));
  background: linear-gradient(145deg, color-mix(in srgb, var(--vp-c-brand-1) 58%, white), var(--vp-c-brand-1));
  box-shadow: 0 4px 9px rgb(0 0 0 / 0.2), inset 0 1px 0 rgb(255 255 255 / 0.3);
  color: var(--vp-c-white);
  cursor: pointer;
  outline: none;
  text-decoration: none;
  transform-origin: center bottom;
  transition: width 150ms cubic-bezier(0.25, 1, 0.5, 1), height 150ms cubic-bezier(0.25, 1, 0.5, 1), background-color 180ms ease, color 180ms ease, transform 150ms ease;
}

.nm-simple-hero-dock__item.icon--server { background: linear-gradient(145deg, var(--vp-c-brand-1), var(--vp-c-brand-2)); }
.nm-simple-hero-dock__item.icon--sparkles { background: linear-gradient(145deg, color-mix(in srgb, var(--vp-c-brand-1) 38%, white), color-mix(in srgb, var(--vp-c-brand-1) 76%, white)); }
.nm-simple-hero-dock__item.icon--building { background: linear-gradient(145deg, var(--vp-c-brand-2), var(--vp-c-brand-3)); }

.nm-simple-hero-dock__item:active { transform: translateY(-8px) scale(0.97); }

.nm-simple-hero-dock__divider {
  width: 1px;
  height: 48px;
  flex: 0 0 1px;
  margin-inline: 0.25rem;
  background: var(--vp-c-text-1);
  opacity: 0.2;
}

.nm-simple-hero-dock__indicator {
  position: absolute;
  inset-block-end: -0.7rem;
  inset-inline-start: 50%;
  width: 0.3rem;
  height: 0.3rem;
  transform: translateX(-50%);
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 8px color-mix(in srgb, var(--vp-c-brand-1) 55%, transparent);
}

.nm-simple-hero-dock__item:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.nm-simple-hero-dock__item.has-hover-color:hover,
.nm-simple-hero-dock__item.has-hover-color:focus-visible {
  border-color: var(--nm-dock-hover-background);
  background: var(--nm-dock-hover-background);
}

.nm-simple-hero-dock__icon,
.nm-simple-hero-dock__custom-icon {
  width: 1.75rem;
  height: 1.75rem;
  flex: 0 0 auto;
  transition: transform 150ms cubic-bezier(0.25, 1, 0.5, 1), opacity 150ms ease;
}

@media (hover: hover) {
  .nm-simple-hero-dock__item:hover .nm-simple-hero-dock__icon,
  .nm-simple-hero-dock__item:hover .nm-simple-hero-dock__custom-icon {
    transform: scale(0.9);
    opacity: 0.75;
  }
}

.nm-simple-hero-dock__tooltip {
  position: absolute;
  inset-block-end: calc(100% + 0.55rem);
  inset-inline-start: 50%;
  z-index: 2;
  width: max-content;
  max-width: 12rem;
  transform: translate(-50%, 4px);
  border: 1px solid rgb(255 255 255 / 0.2);
  border-radius: var(--nm-dock-radius, calc(var(--radius-lg) * 1.2));
  padding: 0.3rem 0.55rem;
  background: rgb(0 0 0 / 0.58);
  box-shadow: 0 5px 15px rgb(0 0 0 / 0.25);
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
  color: rgb(255 255 255 / 0.92);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.2;
  opacity: 0;
  pointer-events: none;
  transition: transform 160ms ease, opacity 160ms ease;
}

.nm-simple-hero-dock__item:hover .nm-simple-hero-dock__tooltip,
.nm-simple-hero-dock__item:focus-visible .nm-simple-hero-dock__tooltip {
  transform: translate(-50%, 0);
  opacity: 1;
}

@media (max-width: 640px) {
  .nm-simple-hero-dock__outer {
    height: max(var(--nm-dock-panel-height), calc(var(--nm-dock-mobile-item-size) + 1.75rem + 2px)) !important;
    justify-content: center;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .nm-simple-hero-dock__outer::-webkit-scrollbar { display: none; }
  .nm-simple-hero-dock { width: max-content; max-width: none; height: max(var(--nm-dock-panel-height), calc(var(--nm-dock-mobile-item-size) + 1.75rem + 2px)) !important; gap: 0.55rem; margin-inline: auto; }
  .nm-simple-hero-dock__item { width: var(--nm-dock-mobile-item-size, 64px) !important; height: var(--nm-dock-mobile-item-size, 64px) !important; flex-direction: column; gap: 0.25rem; }
  .nm-simple-hero-dock__icon { width: 1.5rem; height: 1.5rem; }
  .nm-simple-hero-dock__custom-icon { width: 1.5rem; height: 1.5rem; }
  .nm-simple-hero-dock__divider { height: 42px; margin-inline: 0.1rem; }
  .nm-simple-hero-dock__tooltip {
    position: static;
    inset: auto;
    width: auto;
    max-width: 100%;
    transform: none;
    border: 0;
    background: transparent;
    box-shadow: none;
    font-size: 0.625rem;
    line-height: 1.05;
    opacity: 1;
  }
  .nm-simple-hero-dock__tooltip .nm-simple-hero-dock__desktop-label { display: none; }
  .nm-simple-hero-dock__tooltip .nm-simple-hero-dock__mobile-label { display: block; overflow: hidden; max-width: 100%; text-overflow: ellipsis; white-space: nowrap; }
}

.nm-simple-hero-dock__mobile-label { display: none; }

@media (hover: none), (prefers-reduced-motion: reduce) {
  .nm-simple-hero-dock__item { transition: none; }
}
</style>
