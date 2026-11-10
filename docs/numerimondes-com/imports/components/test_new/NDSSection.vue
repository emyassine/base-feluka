<template>
  <section :class="sectionClasses" :style="sectionStyle" v-bind="rootAttrs">
    <div v-if="hasHeader" :class="headerClasses">
      <div class="nds-section__head">
        <span v-if="eyebrow" class="nds-section__eyebrow">{{ eyebrow }}</span>

        <div class="nds-section__title-row">
          <component v-if="resolvedIcon" :is="resolvedIcon" class="nds-section__icon" aria-hidden="true" />
          <h2 v-if="title" class="nds-section__title">{{ title }}</h2>
        </div>

        <p v-if="description" class="nds-section__description">{{ description }}</p>
      </div>

      <div v-if="hasHeaderActions" class="nds-section__header-actions">
        <NDCButton
          v-for="(action, i) in resolvedHeaderActions"
          :key="`header-action-${i}`"
          :class="action.buttonClass"
          :style="action.buttonStyle"
          :tag="action.tag"
          :href="action.href"
          :variant="action.variant ?? 'blackwhite'"
          :size="action.size ?? 'md'"
          :rounded="action.rounded"
          :pill="action.pill ?? true"
          :block="action.block"
          :disabled="action.disabled"
          :icon="action.icon"
          :icon-position="action.iconPosition ?? 'right'"
          :type="action.type"
          v-bind="action.buttonAttrs"
        >
          {{ action.label }}
        </NDCButton>
      </div>
    </div>

    <div :class="bodyClasses" :style="bodyStyle">
      <div v-if="isCollapsible" class="nds-section__collapse">
        <button
          class="nds-section__collapse-btn"
          type="button"
          :aria-expanded="isOpen ? 'true' : 'false'"
          :aria-controls="collapseId"
          @click="toggle"
        >
          <span class="nds-section__collapse-label">
            <span v-if="title">{{ title }}</span>
            <span v-else>Section</span>
          </span>

          <span class="nds-section__collapse-icon" aria-hidden="true">
            <component :is="ChevronDownIcon" />
          </span>
        </button>
      </div>

      <div
        :id="collapseId"
        ref="contentRef"
        class="nds-section__content"
        :data-open="String(isOpen)"
        :style="contentStyle"
        @transitionend="onContentTransitionEnd"
      >
        <div ref="contentInnerRef" class="nds-section__content-inner">
          <div class="nds-section__slot">
            <slot />
          </div>

          <footer v-if="hasFooterActions" class="nds-section__footer">
            <div class="nds-section__footer-actions">
              <NDCButton
                v-for="(action, i) in resolvedFooterActions"
                :key="`footer-action-${i}`"
                :class="action.buttonClass"
                :style="action.buttonStyle"
                :tag="action.tag"
                :href="action.href"
                :variant="action.variant ?? 'secondary'"
                :size="action.size ?? 'md'"
                :rounded="action.rounded"
                :pill="action.pill ?? false"
                :block="action.block"
                :disabled="action.disabled"
                :icon="action.icon"
                :icon-position="action.iconPosition ?? 'right'"
                :type="action.type"
                v-bind="action.buttonAttrs"
              >
                {{ action.label }}
              </NDCButton>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, useAttrs } from 'vue';
import * as lucideIcons from 'lucide-vue-next';

defineOptions({ inheritAttrs: false, name: 'NDSSection' });

type IconLike = string | any;

type HeaderAction = {
  label: string;
  icon?: IconLike;
  iconPosition?: 'left' | 'right';
  href?: string;
  tag?: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'danger'
    | 'success'
    | 'warning'
    | 'blackwhite'
    | 'pure-blackwhite'
    | 'pure-gray';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: boolean;
  pill?: boolean;
  block?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  buttonClass?: string;
  buttonStyle?: Record<string, any>;
  buttonAttrs?: Record<string, any>;
};

type AsideMode = boolean;

const props = withDefaults(
  defineProps<{
    // Content
    eyebrow?: string;
    title?: string;
    description?: string;
    icon?: IconLike;

    // Layout
    aside?: AsideMode; // Filament-like "aside" header left / card right
    compact?: boolean;
    secondary?: boolean;

    // Collapsible
    collapsible?: boolean;
    collapsed?: boolean;
    persistCollapsed?: boolean;
    id?: string;

    // Grid helper (optional, just sets CSS vars you can use inside)
    columns?: 1 | 2 | 3 | 4;

    // Header / footer actions
    afterHeader?: HeaderAction[];
    footer?: HeaderAction[];

    // Root envelope
    rootClass?: string | any[] | Record<string, any>;
    rootStyle?: Record<string, any>;
    customStyles?: Record<string, any>;
  }>(),
  {
    aside: false,
    compact: false,
    secondary: false,
    collapsible: false,
    collapsed: false,
    persistCollapsed: false,
    columns: 1,
  }
);

const attrs = useAttrs();
const rootAttrs = computed(() => attrs);

const hasHeader = computed(
  () => !!(props.eyebrow || props.title || props.description || props.icon || (props.afterHeader?.length ?? 0) > 0)
);
const resolvedHeaderActions = computed(() => (Array.isArray(props.afterHeader) ? props.afterHeader : []));
const resolvedFooterActions = computed(() => (Array.isArray(props.footer) ? props.footer : []));
const hasHeaderActions = computed(() => resolvedHeaderActions.value.length > 0);
const hasFooterActions = computed(() => resolvedFooterActions.value.length > 0);

function normalizeIconName(input: string): string {
  return input.replace(/^lucide:/i, '').trim();
}
function toPascalCase(input: string): string {
  return normalizeIconName(input)
    .replace(/[_\s-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

const resolvedIcon = computed(() => {
  if (!props.icon) return null;

  if (typeof props.icon === 'string') {
    const raw = normalizeIconName(props.icon);
    const direct = (lucideIcons as any)[raw];
    if (direct) return direct;

    const pascal = toPascalCase(raw);
    return (lucideIcons as any)[pascal] || null;
  }

  return props.icon;
});

const ChevronDownIcon = (lucideIcons as any).ChevronDown;

// Collapsible state
const isCollapsible = computed(() => !!props.collapsible);
const collapseId = computed(() => `nds-section-${props.id ?? slugify(props.title ?? 'section')}`);
const storageKey = computed(() => `nds:section:collapsed:${props.id ?? slugify(props.title ?? 'section')}`);

const isOpen = ref(true);
const contentRef = ref<HTMLElement | null>(null);
const contentInnerRef = ref<HTMLElement | null>(null);
const contentHeight = ref('0px');
const contentOpacity = ref(0);
const contentDuration = ref('260ms');
const prefersReducedMotion = ref(false);
const readyForAnimation = ref(false);
const wantsAutoHeight = ref(false);
let resizeObserver: ResizeObserver | null = null;

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function readPersisted(): boolean | null {
  if (!props.persistCollapsed) return null;
  try {
    const raw = localStorage.getItem(storageKey.value);
    if (raw === null) return null;
    return raw === '1';
  } catch {
    return null;
  }
}

function writePersisted(collapsed: boolean) {
  if (!props.persistCollapsed) return;
  try {
    localStorage.setItem(storageKey.value, collapsed ? '1' : '0');
  } catch {
    // ignore
  }
}

function setFromProps() {
  const persisted = readPersisted();
  const collapsed = persisted ?? !!props.collapsed;
  isOpen.value = !collapsed;
}

function toggle() {
  if (!isCollapsible.value) return;
  isOpen.value = !isOpen.value;
  writePersisted(!isOpen.value);
}

function setTransitionDuration(animate: boolean) {
  const duration = prefersReducedMotion.value || !animate ? 0 : 280;
  contentDuration.value = `${duration}ms`;
  return duration;
}

function syncHeight(animate: boolean, toAuto: boolean) {
  const inner = contentInnerRef.value;
  if (!inner) return;
  const duration = setTransitionDuration(animate);
  const height = inner.scrollHeight;
  if (isOpen.value) {
    contentHeight.value = `${height}px`;
    contentOpacity.value = 1;
    if (toAuto) {
      if (duration === 0) contentHeight.value = 'auto';
      else wantsAutoHeight.value = true;
    }
  } else {
    contentHeight.value = '0px';
    contentOpacity.value = 0;
  }
}

function animateClose() {
  const inner = contentInnerRef.value;
  if (!inner) return;
  setTransitionDuration(true);
  if (contentHeight.value === 'auto') {
    contentHeight.value = `${inner.scrollHeight}px`;
    void inner.offsetHeight;
  }
  contentHeight.value = '0px';
  contentOpacity.value = 0;
}

function animateOpen() {
  const inner = contentInnerRef.value;
  if (!inner) return;
  setTransitionDuration(true);
  contentHeight.value = `${inner.scrollHeight}px`;
  contentOpacity.value = 1;
  wantsAutoHeight.value = !prefersReducedMotion.value;
  if (prefersReducedMotion.value) contentHeight.value = 'auto';
}

function onContentTransitionEnd(event: TransitionEvent) {
  if (event.propertyName !== 'height') return;
  if (isOpen.value && wantsAutoHeight.value) {
    contentHeight.value = 'auto';
    wantsAutoHeight.value = false;
  }
}

onMounted(() => {
  if (typeof window !== 'undefined' && 'matchMedia' in window) {
    prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  setFromProps();
  requestAnimationFrame(() => {
    syncHeight(false, true);
    readyForAnimation.value = true;
  });
  if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => {
      if (isOpen.value && contentHeight.value !== 'auto') syncHeight(false, false);
    });
    if (contentInnerRef.value) resizeObserver.observe(contentInnerRef.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});

watch(
  () => [props.collapsed, props.persistCollapsed, props.id, props.title] as const,
  () => {
    setFromProps();
    if (readyForAnimation.value) syncHeight(false, true);
  }
);

watch(
  () => isOpen.value,
  open => {
    if (!readyForAnimation.value) return;
    if (open) animateOpen();
    else animateClose();
  }
);

// Classes / styles
const sectionClasses = computed(() => [
  'nds_section',
  {
    'nds-section--aside': !!props.aside,
    'nds-section--compact': !!props.compact,
    'nds-section--secondary': !!props.secondary,
    'nds-section--collapsible': !!props.collapsible,
  },
  props.rootClass,
]);

const headerClasses = computed(() => ['nds-section__header']);

const bodyClasses = computed(() => ['nds-section__body']);

const sectionStyle = computed(() => [
  props.rootStyle ?? {},
  props.customStyles ?? {},
  { '--nds-section-columns': String(props.columns ?? 1) },
]);

const bodyStyle = computed(() => ({}));

const contentStyle = computed(() => ({
  height: isCollapsible.value ? contentHeight.value : 'var(--nds-section-content-h, auto)',
  opacity: isCollapsible.value ? contentOpacity.value : 1,
  '--nds-section-content-duration': isCollapsible.value ? contentDuration.value : '0ms',
}));
</script>

<style scoped>
/* Uses global design tokens:
   --nds-section-radius
   --nds-section-inner-radius
   --nds-section-pad
   --nds-section-border
   --nds-section-bg
   --nds-section-bg-secondary
   --nds-section-shadow
   --nds-section-gap
   --nds-section-head-w
   --nds-section-muted
   --nds-section-title
*/

.nds_section {
  --_radius: var(--nds-section-radius);
  --_inner-radius: var(--nds-section-inner-radius);
  --_pad: var(--nds-section-pad);
  --_gap: var(--nds-section-gap);
  --_border: var(--nds-section-border);
  --_bg: var(--nds-section-bg);
  --_bg-secondary: var(--nds-section-bg-secondary);
  --_shadow: var(--nds-section-shadow);
  --_muted: var(--nds-section-muted);
  --_title: var(--nds-section-title);
  --_head-w: var(--nds-section-head-w);

  margin: 28px 0;
}

.nds-section__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--_gap);
  margin-bottom: 14px;
}

.nds-section__head {
  min-width: 0;
}

.nds-section__eyebrow {
  display: inline-flex;
  align-items: center;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--_muted);
  font-weight: 700;
}

.nds-section__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.nds-section__icon {
  width: 18px;
  height: 18px;
  flex: none;
  opacity: 0.9;
}

.nds-section__title {
  margin: 0;
  font-size: 22px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--_title);
}

.nds-section__description {
  margin: 8px 0 0;
  color: var(--_muted);
  font-size: 14px;
  line-height: 1.55;
  max-width: 70ch;
}

.nds-section__header-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.nds-section__body {
  background: var(--_bg);
  border: 1px solid var(--_border);
  border-radius: var(--_radius);
  box-shadow: var(--_shadow);
  overflow: hidden;
}

.nds-section--secondary .nds-section__body {
  background: var(--_bg-secondary);
}

.nds-section--compact .nds-section__body {
  --_pad: 14px;
  --_radius: 16px;
  --_inner-radius: 14px;
}

.nds-section__collapse {
  border-bottom: 1px solid color-mix(in srgb, var(--_border) 80%, transparent);
}

.nds-section__collapse-btn {
  width: 100%;
  border: 0;
  background: transparent;
  color: inherit;
  padding: 14px var(--_pad);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  text-align: left;
}

.nds-section__collapse-btn:hover {
  background: color-mix(in srgb, var(--vp-c-text-1) 4%, transparent);
}

.nds-section__collapse-label {
  font-weight: 700;
  letter-spacing: -0.01em;
}

.nds-section__collapse-icon {
  width: 18px;
  height: 18px;
  display: inline-flex;
  transition: transform 180ms ease;
  opacity: 0.9;
}

.nds-section__content {
  height: auto;
  min-height: var(--nds-section-content-min-h, auto);
  overflow: hidden;
  transition:
    height var(--nds-section-content-duration, 260ms) cubic-bezier(0.2, 0.9, 0.1, 1),
    opacity var(--nds-section-content-duration, 260ms) ease;
}

.nds-section__content-inner {
  display: block;
  height: 100%;
  min-height: inherit;
}

.nds-section__slot {
  padding: var(--_pad);
  border-radius: var(--_inner-radius);
  box-sizing: border-box;
}

.nds-section__footer {
  border-top: 1px solid color-mix(in srgb, var(--_border) 80%, transparent);
  padding: 14px var(--_pad);
}

.nds-section__footer-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.nds-section--aside {
  display: grid;
  grid-template-columns: minmax(0, var(--_head-w)) minmax(0, 1fr);
  gap: var(--_gap);
  align-items: start;
}

.nds-section--aside .nds-section__header {
  grid-column: 1;
  margin-bottom: 0;
  position: sticky;
  top: 88px;
}

.nds-section--aside .nds-section__body {
  grid-column: 2;
}

@media (max-width: 900px) {
  .nds-section--aside {
    grid-template-columns: 1fr;
  }
  .nds-section--aside .nds-section__header {
    position: static;
  }
}

@media (max-width: 720px) {
  .nds-section__header {
    flex-direction: column;
    align-items: stretch;
  }
  .nds-section__header-actions {
    justify-content: flex-start;
  }
}
</style>
