<script setup lang="ts">
import { computed, ref, watch, type CSSProperties } from 'vue'

export interface BranchedMenuItem {
  label: string
  value?: string
  icon?: string
  children?: BranchedMenuItem[]
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
  fontSize?: number
  foldDuration?: number
  className?: string
}

defineOptions({ name: 'BranchedMenu' })

const props = withDefaults(defineProps<BranchedMenuProps>(), {
  items: () => [],
  defaultOpen: -1,
  defaultActive: '',
  color: '#f5f5f5',
  accentColor: '#f5f5f5',
  lineColor: '#3f3f46',
  width: 240,
  rowHeight: 36,
  indent: 24,
  fontSize: 14,
  foldDuration: 250,
  className: '',
})

const emit = defineEmits<{
  select: [value: string, item: BranchedMenuItem]
  toggle: [index: number, open: boolean]
}>()

function hasActive(item: BranchedMenuItem): boolean {
  return item.value === props.defaultActive || Boolean(item.children?.some(hasActive))
}

function initialOpen(): Set<number> {
  const indices = Array.isArray(props.defaultOpen)
    ? props.defaultOpen
    : props.defaultOpen >= 0 ? [props.defaultOpen] : []
  return new Set(props.items.flatMap((item, index) =>
    item.children && (indices.includes(index) || hasActive(item)) ? [index] : []
  ))
}

const open = ref(initialOpen())
const openChildren = ref(new Set(props.items.flatMap((item) => item.children?.filter(hasActive).map((child) => child.value ?? child.label) ?? [])))
watch(() => [props.items, props.defaultActive, props.defaultOpen], () => {
  open.value = initialOpen()
  openChildren.value = new Set(props.items.flatMap((item) => item.children?.filter(hasActive).map((child) => child.value ?? child.label) ?? []))
})

function toggle(index: number): void {
  const next = new Set(open.value)
  const isOpen = !next.has(index)
  if (isOpen) next.add(index)
  else next.delete(index)
  open.value = next
  emit('toggle', index, isOpen)
}

function select(item: BranchedMenuItem): void {
  if (item.value) emit('select', item.value, item)
}

function toggleChild(child: BranchedMenuItem): void {
  const key = child.value ?? child.label
  const next = new Set(openChildren.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  openChildren.value = next
}

const style = computed(() => ({
  '--bm-w': `${props.width}px`,
  '--bm-ink': props.color,
  '--bm-accent': props.accentColor,
  '--bm-line': props.lineColor,
  '--bm-font': `${props.fontSize}px`,
  '--bm-row': `${props.rowHeight}px`,
  '--bm-indent': `${props.indent}px`,
  '--bm-fold': `${props.foldDuration}ms`,
}) as CSSProperties)

const iconStyle = (icon?: string) => icon ? ({ '--bm-icon': `url("${icon}")` } as CSSProperties) : undefined
</script>

<template>
  <nav class="branched-menu" :class="className" :style="style">
    <div v-for="(item, index) in items" :key="item.value ?? item.label" class="branch">
      <button
        v-if="item.children?.length"
        type="button"
        class="branch-heading"
        :aria-expanded="open.has(index)"
        :data-active="hasActive(item) || undefined"
        @click="toggle(index)"
      >
        <span>{{ item.label }}</span>
      </button>
      <button
        v-else
        type="button"
        class="branch-heading branch-leaf"
        :aria-current="item.value === defaultActive ? 'page' : undefined"
        :data-active="item.value === defaultActive || undefined"
        @click="select(item)"
      >
        <span v-if="item.icon" class="branched-menu-icon" :style="iconStyle(item.icon)" aria-hidden="true" />
        <span>{{ item.label }}</span>
      </button>

      <div v-if="item.children?.length" v-show="open.has(index)" class="branch-children">
        <div v-for="child in item.children" :key="child.value ?? child.label" class="branch-child">
          <button
            v-if="child.children?.length"
            type="button"
            class="branch-row branch-toggle"
            :aria-expanded="openChildren.has(child.value ?? child.label)"
            :data-active="hasActive(child) || undefined"
            @click="toggleChild(child)"
          >
            <span>{{ child.label }}</span>
          </button>
          <button
            v-else
            type="button"
            class="branch-row"
            :aria-current="child.value === defaultActive ? 'page' : undefined"
            :data-active="child.value === defaultActive || undefined"
            @click="select(child)"
          >
            <span v-if="child.icon" class="branched-menu-icon" :style="iconStyle(child.icon)" aria-hidden="true" />
            <span>{{ child.label }}</span>
          </button>
          <BranchedMenu
            v-if="child.children?.length && openChildren.has(child.value ?? child.label)"
            :items="child.children"
            :default-active="defaultActive"
            :default-open="child.children.findIndex(hasActive)"
            :color="color"
            :accent-color="accentColor"
            :line-color="lineColor"
            :width="width"
            :row-height="rowHeight"
            :indent="indent"
            :font-size="fontSize"
            :fold-duration="foldDuration"
            class-name="branched-menu-nested"
            @select="(value, selected) => emit('select', value, selected)"
          />
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
  line-height: 1.25;
}

.branched-menu::before {
  position: absolute;
  top: 8px;
  bottom: 0;
  left: 0;
  width: 1.5px;
  border-radius: 1px;
  background: linear-gradient(to bottom, var(--bm-line) 0%, var(--bm-line) 55%, transparent 100%);
  content: '';
}

.branch-heading,
.branch-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  min-width: 0;
  border: 0;
  background: transparent;
  color: color-mix(in srgb, var(--bm-ink) 55%, transparent);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: color 180ms ease;
}

.branch-heading {
  min-height: var(--bm-row);
  padding: 7px 0;
  font-size: calc(var(--bm-font) + 1px);
  font-weight: 500;
}

.branch-heading.branch-leaf {
  font-size: calc(var(--bm-font) - 1px);
  font-weight: 400;
}

.branch-row {
  position: relative;
  min-height: var(--bm-row);
  padding: 4px 0 4px 12px;
}

.branch-row:not(.branch-toggle) {
  font-size: calc(var(--bm-font) - 1px);
}

.branch-toggle {
  font-size: var(--bm-font);
}

.branch-row::before {
  position: absolute;
  top: 0;
  left: -12px;
  width: 10px;
  height: 50%;
  border-bottom: 1.5px solid var(--bm-line);
  border-left: 1.5px solid var(--bm-line);
  border-bottom-left-radius: 10px;
  content: '';
}

.branch-heading:hover,
.branch-row:hover,
.branch-heading[data-active],
.branch-row[data-active] {
  color: var(--bm-ink);
}

.branch-row[data-active] {
  color: var(--bm-accent);
  font-weight: 500;
}

.branch-children {
  margin-left: 14px;
  padding: 4px 0 6px 12px;
  border-left: 1.5px solid var(--bm-line);
}

.branch-child {
  position: relative;
}

.branch-child::before {
  position: absolute;
  top: 0;
  left: -12px;
  width: 10px;
  height: 50%;
  border-bottom: 1.5px solid var(--bm-line);
  border-left: 1.5px solid var(--bm-line);
  border-bottom-left-radius: 10px;
  content: '';
}

.branched-menu-nested {
  margin: 0 0 4px 10px;
  padding-left: 10px;
}

.branched-menu-nested::before {
  display: none;
}

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
