<script setup lang="ts">
import { computed, provide, ref, useId } from 'vue'
import { tabsContextKey, tabsKey, type TabsAlignment, type TabsContext, type TabsMode, type TabsPreset } from './tabs-context'

const props = withDefaults(defineProps<{
  /** Accessible name for the tablist or navigation landmark. */
  label?: string
  /** The selected panel key in switch mode. Supports v-model. */
  modelValue?: string
  /** Initial selected panel key when modelValue is not controlled. */
  defaultValue?: string
  /** switch renders accessible tabs and panels; navigation renders links/buttons only. */
  mode?: TabsMode
  /** Visual treatment; headless keeps semantics and layout while leaving appearance to the caller. */
  preset?: TabsPreset
  /** Horizontal alignment of the triggers. */
  align?: TabsAlignment
  /** Optional stable id prefix for tab and panel relationships. */
  id?: string
  /** Extra class applied to the trigger row. */
  listClass?: string
}>(), {
  label: 'Content tabs',
  mode: 'switch',
  preset: 'default',
  align: 'start',
  listClass: '',
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
defineOptions({ inheritAttrs: false })
const generatedId = useId()
const internalValue = ref(props.defaultValue)
const activeValue = computed(() => props.modelValue ?? internalValue.value)
const mode = computed(() => props.mode)
const preset = computed(() => props.preset)
const id = computed(() => props.id || `xmqrre3s1-${generatedId}`)

function select(value: string): void {
  if (props.mode !== 'switch') return
  internalValue.value = value
  emit('update:modelValue', value)
}

function isActive(value: string): boolean {
  return activeValue.value === value
}

function tabId(value: string): string {
  return `${id.value}-tab-${tabsKey(value)}`
}

function panelId(value: string): string {
  return `${id.value}-panel-${tabsKey(value)}`
}

provide(tabsContextKey, {
  get id() { return id.value },
  mode,
  preset,
  activeValue,
  select,
  isActive,
  tabId,
  panelId,
} satisfies TabsContext)

function onKeydown(event: KeyboardEvent): void {
  if (props.mode !== 'switch' || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  const list = event.currentTarget
  if (!(list instanceof HTMLElement)) return
  const tabs = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'))
  if (!tabs.length) return
  const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement)
  const nextIndex = event.key === 'Home'
    ? 0
    : event.key === 'End'
      ? tabs.length - 1
      : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
  event.preventDefault()
  tabs[nextIndex]?.focus()
  tabs[nextIndex]?.click()
}
</script>

<template>
  <div class="xmqrre3s1" :class="$attrs.class" :data-mode="mode" :data-align="align" :data-preset="preset">
    <nav v-if="mode === 'navigation'" class="xmqrre3s1__list" :class="listClass" :aria-label="label">
      <slot />
    </nav>
    <div
      v-else
      class="xmqrre3s1__list"
      :class="listClass"
      role="tablist"
      aria-orientation="horizontal"
      :aria-label="label"
      @keydown="onKeydown"
    >
      <slot />
    </div>
    <div v-if="mode === 'switch' && $slots.panels" class="xmqrre3s1__panels">
      <slot name="panels" />
    </div>
  </div>
</template>

<style scoped>
.xmqrre3s1 { min-width: 0; }
.xmqrre3s1__list {
  display: flex;
  align-items: center;
  gap: .25rem;
  width: 100%;
}
.xmqrre3s1[data-align='start'] .xmqrre3s1__list { justify-content: flex-start; }
.xmqrre3s1[data-align='center'] .xmqrre3s1__list { justify-content: center; }
.xmqrre3s1[data-align='end'] .xmqrre3s1__list { justify-content: flex-end; }
.xmqrre3s1[data-align='stretch'] .xmqrre3s1__list > * { flex: 1 1 0; }
.xmqrre3s1__panels { min-width: 0; }

.xmqrre3s1[data-preset='rounded'] .xmqrre3s1__list {
  width: max-content;
  max-width: 100%;
  gap: 2px;
  margin: 0 auto .5rem;
  padding: 3px;
  overflow-x: auto;
  scrollbar-width: none;
  border: 1px solid rgb(255 255 255 / .3);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface) 38%, transparent);
  box-shadow: 0 4px 16px rgb(0 0 0 / .18), inset 0 1px 0 rgb(255 255 255 / .3);
  -webkit-backdrop-filter: blur(24px) saturate(1.35);
  backdrop-filter: blur(24px) saturate(1.35);
}
.xmqrre3s1[data-preset='rounded'][data-align='start'] .xmqrre3s1__list { margin-inline: 0 auto; }
.xmqrre3s1[data-preset='rounded'][data-align='end'] .xmqrre3s1__list { margin-inline: auto 0; }
.xmqrre3s1[data-preset='rounded'] .xmqrre3s1__list::-webkit-scrollbar { display: none; }
.xmqrre3s1[data-preset='rounded'] .xmqrre3s1__list > * { flex: 0 0 auto; }
.xmqrre3s1[data-preset='rounded'][data-align='stretch'] .xmqrre3s1__list { width: 100%; }
.xmqrre3s1[data-preset='rounded'][data-align='stretch'] .xmqrre3s1__list > * { flex: 1 1 0; }
:global(.x6u7xzhs0--light) .xmqrre3s1[data-preset='rounded'] .xmqrre3s1__list {
  border-color: rgb(148 163 184 / .4);
  background: rgb(255 255 255 / .82);
  box-shadow: 0 6px 20px rgb(15 23 42 / .14), inset 0 1px 0 rgb(255 255 255 / .9);
  -webkit-backdrop-filter: blur(18px) saturate(1.15);
  backdrop-filter: blur(18px) saturate(1.15);
}
</style>
