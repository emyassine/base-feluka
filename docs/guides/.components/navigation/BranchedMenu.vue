<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, type CSSProperties } from 'vue'

export interface BranchedMenuChild {
  value: string
  label: string
  icon?: string
}

export interface BranchedMenuItem {
  label: string
  value?: string
  icon?: string
  children?: BranchedMenuChild[]
}

interface BranchedMenuProps {
  items?: BranchedMenuItem[]
  defaultOpen?: number | number[]
  defaultActive?: string
  color?: string
  accentColor?: string
  lineColor?: string
  width?: number
  rowHeight?: number
  indent?: number
  trunk?: number
  radius?: number
  lineWidth?: number
  fontSize?: number
  drawDuration?: number
  foldDuration?: number
  className?: string
}

const PAD = 6
const MARK = 16
const toSet = (value: number | number[]) => new Set(Array.isArray(value) ? value : value >= 0 ? [value] : [])

const props = withDefaults(defineProps<BranchedMenuProps>(), {
  items: () => [],
  defaultOpen: 0,
  defaultActive: '',
  color: '#f5f5f5',
  accentColor: '#f5f5f5',
  lineColor: '#3f3f46',
  width: 240,
  rowHeight: 36,
  indent: 40,
  trunk: 14,
  radius: 10,
  lineWidth: 1.5,
  fontSize: 14,
  drawDuration: 400,
  foldDuration: 300,
  className: '',
})

const emit = defineEmits<{
  select: [value: string, item: BranchedMenuChild | BranchedMenuItem]
  toggle: [index: number, open: boolean]
}>()

const menuItems = computed(() => props.items)
const open = ref(toSet(props.defaultOpen))
const active = ref(props.defaultActive || (
  menuItems.value.find((item, index) => item.children && toSet(props.defaultOpen).has(index))?.children?.[0]?.value ?? ''
))
const navRef = ref<HTMLElement | null>(null)
const markerRef = ref<HTMLSpanElement | null>(null)
const heads: (HTMLButtonElement | null)[] = []
let resizeObserver: ResizeObserver | null = null

const activeSection = computed(() => menuItems.value.findIndex((item) => item.children?.some((child) => child.value === active.value)))
const markerShown = computed(() => activeSection.value >= 0 && open.value.has(activeSection.value))

function placeMarker(animate: boolean): void {
  const marker = markerRef.value
  const heading = heads[activeSection.value]
  if (!marker) return
  if (!animate) marker.style.transition = 'none'
  if (markerShown.value && heading) marker.style.top = `${heading.offsetTop + (heading.offsetHeight - MARK) / 2}px`
  marker.toggleAttribute('data-on', Boolean(markerShown.value && heading))
  if (!animate) {
    void marker.offsetHeight
    marker.style.transition = ''
  }
}

function bindMarker(): void {
  resizeObserver?.disconnect()
  placeMarker(true)
  let first = true
  resizeObserver = new ResizeObserver(() => {
    if (first) { first = false; return }
    placeMarker(false)
  })
  if (navRef.value) resizeObserver.observe(navRef.value)
}

onMounted(bindMarker)
onUnmounted(() => resizeObserver?.disconnect())
watch(() => [activeSection.value, markerShown.value, menuItems.value, props.fontSize, props.rowHeight], bindMarker, { flush: 'post' })

function select(value: string, item: BranchedMenuChild | BranchedMenuItem): void {
  active.value = value
  emit('select', value, item)
}

function toggle(index: number): void {
  const next = new Set(open.value)
  const isOpen = !next.has(index)
  if (isOpen) next.add(index)
  else next.delete(index)
  open.value = next
  emit('toggle', index, isOpen)
}

const radius = computed(() => Math.min(props.radius, props.rowHeight / 2 - 2))
const endX = computed(() => props.indent - 8)
const rowY = (index: number) => PAD + index * props.rowHeight + props.rowHeight / 2
const branchPath = (index: number) => `M ${props.trunk} ${rowY(index) - radius.value} A ${radius.value} ${radius.value} 0 0 0 ${props.trunk + radius.value} ${rowY(index)} H ${endX.value}`
const reachPath = (index: number) => `M ${props.trunk} 0 V ${rowY(index) - radius.value} A ${radius.value} ${radius.value} 0 0 0 ${props.trunk + radius.value} ${rowY(index)} H ${endX.value}`
const pathLength = (index: number) => rowY(index) - radius.value + (Math.PI * radius.value) / 2 + (endX.value - props.trunk - radius.value)
const trunkPath = (count: number) => `M ${props.trunk} 0 V ${rowY(count - 1) - radius.value}`
const navStyle = computed(() => ({
  '--bm-w': `${props.width}px`,
  '--bm-ink': props.color,
  '--bm-accent': props.accentColor,
  '--bm-line': props.lineColor,
  '--bm-font': `${props.fontSize}px`,
  '--bm-row': `${props.rowHeight}px`,
  '--bm-indent': `${props.indent}px`,
  '--bm-line-w': props.lineWidth,
  '--bm-draw': `${props.drawDuration}ms`,
  '--bm-fold': `${props.foldDuration}ms`,
}) as CSSProperties)
const iconStyle = (icon?: string) => icon ? ({ '--bm-icon': `url("${icon}")` } as CSSProperties) : undefined
</script>

<template>
  <nav ref="navRef" class="branched-menu" :class="className" :style="navStyle">
    <span ref="markerRef" class="branched-menu-marker" aria-hidden="true" />
    <div v-for="(item, index) in menuItems" :key="item.value ?? item.label" class="branched-menu-section">
      <button
        :ref="(element) => (heads[index] = element as HTMLButtonElement | null)"
        type="button"
        class="branched-menu-heading"
        :aria-expanded="item.children ? open.has(index) : undefined"
        :aria-current="!item.children && item.value === active ? 'page' : undefined"
        :data-active="!item.children && item.value === active ? '' : undefined"
        :class="{ 'branched-menu-heading-leaf': !item.children }"
        @click="item.children ? toggle(index) : item.value && select(item.value, item)"
      >
        <span v-if="!item.children && item.icon" class="branched-menu-icon" :style="iconStyle(item.icon)" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </button>
      <div v-if="item.children?.length" v-show="open.has(index)" class="branched-menu-children">
        <div class="branched-menu-branch-list" :style="{ height: `${PAD * 2 + item.children.length * rowHeight}px` }">
          <svg class="branched-menu-lines" :width="indent" :height="PAD * 2 + item.children.length * rowHeight" aria-hidden="true">
            <path class="branched-menu-trunk" :d="trunkPath(item.children.length)" />
            <path v-for="(child, childIndex) in item.children" :key="`branch-${child.value}`" class="branched-menu-branch" :d="branchPath(childIndex)" />
            <path
              v-for="(child, childIndex) in item.children"
              :key="`reach-${child.value}`"
              class="branched-menu-reach"
              :d="reachPath(childIndex)"
              :style="{ strokeDasharray: pathLength(childIndex), strokeDashoffset: child.value === active ? 0 : pathLength(childIndex) }"
            />
          </svg>
          <button
            v-for="child in item.children"
            :key="child.value"
            type="button"
            class="branched-menu-child"
            :aria-current="child.value === active ? 'page' : undefined"
            :data-active="child.value === active ? '' : undefined"
            :tabindex="open.has(index) ? 0 : -1"
            @click="select(child.value, child)"
          >
            <span v-if="child.icon" class="branched-menu-icon" :style="iconStyle(child.icon)" aria-hidden="true" />
            <span class="branched-menu-label">{{ child.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.branched-menu {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: min(var(--bm-w), 100%);
  padding-left: 14px;
  color: var(--bm-ink);
  font-family: inherit;
  font-size: var(--bm-font);
  line-height: 1.2;
}

.branched-menu::before {
  position: absolute;
  top: 8px;
  bottom: 0;
  left: 0;
  width: 1.5px;
  border-radius: 1px;
  background: linear-gradient(to bottom, var(--bm-line), var(--bm-line) 55%, transparent);
  content: '';
}

.branched-menu-marker {
  position: absolute;
  top: -1px;
  left: 0;
  z-index: 1;
  width: 2px;
  height: 16px;
  border-radius: 1px;
  background: var(--bm-accent);
  opacity: 0;
  transition: top 220ms cubic-bezier(.23, 1, .32, 1), opacity 150ms ease;
}

.branched-menu-marker[data-on] { opacity: 1; }
.branched-menu-section { display: flex; flex-direction: column; }

.branched-menu-heading,
.branched-menu-child {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
  margin: 0;
  border: 0;
  background: transparent;
  color: color-mix(in srgb, var(--bm-ink) 55%, transparent);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: color 180ms ease;
}

.branched-menu-heading {
  min-height: var(--bm-row);
  padding: 7px 0;
  font-size: calc(var(--bm-font) + 1px);
  font-weight: 500;
}

.branched-menu-heading-leaf {
  font-size: var(--bm-font);
  font-weight: 400;
}

.branched-menu-heading:hover,
.branched-menu-heading[aria-current],
.branched-menu-heading[aria-expanded="true"] { color: var(--bm-ink); }

.branched-menu-children { overflow: hidden; }
.branched-menu-branch-list { position: relative; box-sizing: border-box; padding: 6px 0; }
.branched-menu-lines { position: absolute; top: 0; left: 0; overflow: visible; pointer-events: none; }
.branched-menu-trunk,
.branched-menu-branch,
.branched-menu-reach { fill: none; stroke-linecap: round; stroke-linejoin: round; stroke-width: var(--bm-line-w); }
.branched-menu-trunk,
.branched-menu-branch { stroke: var(--bm-line); }
.branched-menu-reach {
  stroke: var(--bm-accent);
  transition: stroke-dashoffset var(--bm-draw) cubic-bezier(.23, 1, .32, 1);
}

.branched-menu-child {
  position: relative;
  height: var(--bm-row);
  padding: 0 0 0 var(--bm-indent);
  font-size: calc(var(--bm-font) - 1px);
  line-height: 1.35;
}

.branched-menu-child:hover { color: var(--bm-ink); }
.branched-menu-child[data-active] { color: var(--bm-accent); font-weight: 500; }
.branched-menu-heading-leaf[data-active] { color: var(--bm-accent); font-weight: 500; }
.branched-menu-label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.branched-menu-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  background-color: currentColor;
  -webkit-mask: var(--bm-icon) center / contain no-repeat;
  mask: var(--bm-icon) center / contain no-repeat;
}
</style>
