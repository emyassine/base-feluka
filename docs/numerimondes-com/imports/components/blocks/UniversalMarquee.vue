<!-- /docs/default/theme/components/sections/UniversalMarquee.vue -->
<template>
  <section
    ref="rootRef"
    :class="['universal-marquee', rootClass]"
    :style="[computedRootStyle, customStyles]"
    v-bind="{ ...rootAttrs, ...attrs }"
  >
    <!-- Header -->
    <slot name="header">
      <div
        v-if="eyebrow || title || subtitle || hasActions"
        :class="['marquee-header', headerAlignClass, headerClass]"
        :style="headerStyle"
      >
        <div class="marquee-header__content">
          <span v-if="eyebrow" :class="['eyebrow', eyebrowClass]" :style="{ ...eyebrowStyle, marginBottom: '0' }">
            {{ eyebrow }}
          </span>

          <h2 v-if="title" :class="['marquee-title', titleClass]" :style="{ ...titleStyle, paddingTop: '0' }">
            {{ title }}
          </h2>

          <p v-if="subtitle" class="subtitle" v-html="subtitle"></p>
        </div>

        <div
          v-if="hasActions"
          :class="['marquee-header__actions', actionsAlignClass, actionsClass]"
          :style="actionsStyle"
        >
          <slot name="actions">
            <NDCButton
              v-for="(action, i) in resolvedActions"
              :key="`action-${i}`"
              :class="[actionsButtonClass, action.buttonClass]"
              :style="[actionsButtonStyle, action.buttonStyle]"
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
          </slot>
        </div>
      </div>
    </slot>

    <!-- Rows -->
    <div
      v-for="(row, rowIndex) in computedRows"
      :key="`row-${rowIndex}`"
      :class="['marquee-row no-container', rowClass, row.class]"
      :style="[getRowStyle(row), row.style]"
      :role="row.ariaHidden ? 'presentation' : undefined"
      :aria-hidden="row.ariaHidden"
      v-bind="row.attrs"
    >
      <div :class="['marquee-track', trackClass, row.trackClass]" :style="[getTrackStyle(row), row.trackStyle]">
        <template v-for="dup in 2" :key="`dup-${rowIndex}-${dup}`">
          <ul
            :class="['marquee-list', listClass, row.listClass]"
            :style="[listStyle, row.listStyle]"
            :aria-hidden="dup === 2 ? 'true' : undefined"
          >
            <li
              v-for="(item, i) in getRepeatedItems(rowIndex)"
              :key="`${rowIndex}-${dup}-${i}`"
              :class="['marquee-item', itemClass, row.itemClass, item.class]"
              :style="[getItemStyle(), item.style]"
              v-bind="item.attrs"
            >
              <slot name="item" :item="item" :index="i" :row="rowIndex">
                <NDCButton
                  :class="[buttonClass, item.buttonClass, 'opacity-80-on-hover-100']"
                  :style="[buttonStyle, item.buttonStyle]"
                  :tag="item.tag"
                  :href="item.href"
                  :variant="item.variant ?? 'blackwhite'"
                  :size="item.size"
                  :rounded="item.rounded"
                  :pill="item.pill ?? true"
                  :block="item.block"
                  :disabled="item.disabled"
                  :icon="item.icon"
                  :icon-position="item.iconPosition"
                  :type="item.type"
                  v-bind="item.buttonAttrs"
                >
                  {{ item.title }}
                </NDCButton>
              </slot>
            </li>
          </ul>
        </template>
      </div>
    </div>

    <slot name="footer"></slot>
  </section>

  <!-- Hidden measurement list (base items only, same exact markup as visible items) -->
  <ul ref="measureRef" class="marquee-measure" aria-hidden="true">
    <li v-for="(item, i) in normalizedItems" :key="`m-${i}`" class="marquee-item" :style="[getItemStyle(), item.style]">
      <NDCButton
        :class="[buttonClass, item.buttonClass]"
        :style="[buttonStyle, item.buttonStyle]"
        tag="span"
        :href="item.href"
        :variant="item.variant ?? 'blackwhite'"
        :size="item.size"
        :rounded="item.rounded"
        :pill="item.pill ?? true"
        :block="item.block"
        :disabled="item.disabled"
        :icon="item.icon"
        :icon-position="item.iconPosition"
        :type="item.type"
        :tabindex="-1"
        aria-hidden="true"
        v-bind="item.buttonAttrs"
      >
        {{ item.title }}
      </NDCButton>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick, useAttrs } from 'vue';
import NDCButton from '../base/NDCButton.vue';

defineOptions({ inheritAttrs: false });
const attrs = useAttrs();

export interface MarqueeItem {
  title: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  href?: string;
  tag?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'blackwhite';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  pill?: boolean;
  block?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  buttonClass?: string;
  buttonStyle?: Record<string, any>;
  buttonAttrs?: Record<string, any>;
  class?: string;
  style?: Record<string, any>;
  attrs?: Record<string, any>;
}

export interface MarqueeAction {
  label: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  href?: string;
  tag?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'blackwhite';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  pill?: boolean;
  block?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  buttonClass?: string;
  buttonStyle?: Record<string, any>;
  buttonAttrs?: Record<string, any>;
}

export interface MarqueeRow {
  speed?: number; // 0..100
  direction?: 'left' | 'right';
  class?: string;
  style?: Record<string, any>;
  trackClass?: string;
  trackStyle?: Record<string, any>;
  listClass?: string;
  listStyle?: Record<string, any>;
  itemClass?: string;
  fade?: boolean;
  fadeColor?: string;
  fadeStart?: number; // %
  fadeEnd?: number; // %
  ariaHidden?: boolean;
  attrs?: Record<string, any>;
}

export interface FadeConfig {
  enabled?: boolean;
  color?: string;
  start?: number;
  end?: number;
}

const props = withDefaults(
  defineProps<{
    items?: MarqueeItem[];

    // Header
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    headerAlign?: 'center' | 'left';

    // Actions
    actions?: MarqueeAction[];
    actionsAlign?: 'left' | 'right';
    actionsClass?: string;
    actionsStyle?: Record<string, any>;
    actionsButtonClass?: string;
    actionsButtonStyle?: Record<string, any>;

    // Legacy actions
    buttonLabel1?: string;
    buttonLabel2?: string;
    buttonIcon1?: string;
    buttonIcon2?: string;
    buttonIconPosition1?: 'left' | 'right';
    buttonIconPosition2?: 'left' | 'right';
    buttonHref1?: string;
    buttonHref2?: string;
    buttonVariant1?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'blackwhite';
    buttonVariant2?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'blackwhite';
    buttonSize1?: 'sm' | 'md' | 'lg';
    buttonSize2?: 'sm' | 'md' | 'lg';

    headerClass?: string;
    headerStyle?: Record<string, any>;
    eyebrowClass?: string;
    eyebrowStyle?: Record<string, any>;
    titleClass?: string;
    titleStyle?: Record<string, any>;

    // Root
    rootClass?: string;
    rootStyle?: Record<string, any>;
    rootAttrs?: Record<string, any>;
    customStyles?: Record<string, any>;

    // Rows
    rows?: MarqueeRow[];
    rowCount?: number;

    // Shuffle items per row
    shuffle?: boolean;

    // Defaults
    speed?: number; // 0..100
    direction?: 'left' | 'right';

    // Dimensions
    itemHeight?: number;
    gap?: number;
    rowGap?: number;
    padX?: number;

    // Fade
    fade?: boolean | FadeConfig;

    // Class injection
    rowClass?: string;
    trackClass?: string;
    listClass?: string;
    itemClass?: string;
    buttonClass?: string;

    // Style injection
    listStyle?: Record<string, any>;
    buttonStyle?: Record<string, any>;

    // Background
    bgImage?: string;
    bgColor?: string;
    bgGradient?: string;
  }>(),
  {
    speed: 42,
    direction: 'left',
    itemHeight: 56,
    gap: 16,
    rowGap: 16,
    padX: 0,
    rowCount: 1,
    shuffle: true,
    fade: true,
  }
);

const normalizedItems = computed(() => (props.items?.length ? props.items : []));
const repeatCount = ref(1);

const resolvedActions = computed<MarqueeAction[]>(() => {
  if (props.actions?.length) return props.actions;
  const out: MarqueeAction[] = [];
  if (props.buttonLabel1) {
    out.push({
      label: props.buttonLabel1,
      icon: props.buttonIcon1,
      iconPosition: props.buttonIconPosition1,
      href: props.buttonHref1,
      variant: props.buttonVariant1,
      size: props.buttonSize1,
    });
  }
  if (props.buttonLabel2) {
    out.push({
      label: props.buttonLabel2,
      icon: props.buttonIcon2,
      iconPosition: props.buttonIconPosition2,
      href: props.buttonHref2,
      variant: props.buttonVariant2,
      size: props.buttonSize2,
    });
  }
  return out;
});

const hasActions = computed(() => resolvedActions.value.length > 0);
const headerAlignClass = computed(() => ((props.headerAlign ?? 'center') === 'left' ? 'is-left' : 'is-center'));
const actionsAlignClass = computed(() =>
  (props.actionsAlign ?? 'right') === 'left' ? 'actions-left' : 'actions-right'
);

const rootRef = ref<HTMLElement | null>(null);
const measureRef = ref<HTMLElement | null>(null);
let ro: ResizeObserver | null = null;

function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function shuffledItems(items: MarqueeItem[], seed: number) {
  const out = items.slice();
  const rnd = seededRandom(seed);
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function rotate<T>(arr: T[], shift: number) {
  const n = arr.length;
  if (!n) return arr;
  const s = ((shift % n) + n) % n;
  if (!s) return arr.slice();
  return arr.slice(s).concat(arr.slice(0, s));
}

function bestShift(current: MarqueeItem[], prev: MarqueeItem[]) {
  const n = current.length;
  if (!n || prev.length !== n) return 0;
  let best = 0;
  let bestMatches = n + 1;
  for (let shift = 0; shift < n; shift += 1) {
    let matches = 0;
    for (let i = 0; i < n; i += 1) {
      if (current[(i + shift) % n]?.title === prev[i]?.title) matches += 1;
    }
    if (matches < bestMatches) {
      bestMatches = matches;
      best = shift;
      if (bestMatches === 0) break;
    }
  }
  return best;
}

const computedRows = computed<MarqueeRow[]>(() => {
  if (props.rows?.length) return props.rows;
  return Array.from(
    { length: Math.max(1, props.rowCount) },
    (_, i): MarqueeRow => ({
      speed: props.speed,
      direction: i % 2 === 0 ? props.direction : props.direction === 'left' ? 'right' : 'left',
    })
  );
});

const rowItems = computed(() => {
  const items = normalizedItems.value;
  if (!items.length) return [];
  const out: MarqueeItem[][] = [];
  for (let idx = 0; idx < computedRows.value.length; idx += 1) {
    const base = props.shuffle ? shuffledItems(items, idx + 1) : items.slice();
    if (props.shuffle && out.length) {
      const prev = out[out.length - 1];
      const shift = bestShift(base, prev);
      out.push(rotate(base, shift));
    } else {
      out.push(base);
    }
  }
  return out;
});

function getRepeatedItems(rowIndex: number) {
  const base = rowItems.value[rowIndex] ?? [];
  if (!base.length) return [];
  const count = Math.max(1, repeatCount.value);
  const out: MarqueeItem[] = [];
  for (let i = 0; i < count; i += 1) out.push(...base);
  return out;
}

const fadeConfig = computed(() => {
  if (typeof props.fade === 'boolean') {
    return props.fade
      ? { enabled: true, color: '#000', start: 0, end: 8 }
      : { enabled: false, color: '#000', start: 0, end: 8 };
  }
  return {
    enabled: props.fade?.enabled ?? true,
    color: props.fade?.color ?? '#000',
    start: props.fade?.start ?? 0,
    end: props.fade?.end ?? 8,
  };
});

const computedRootStyle = computed(() => {
  const style: Record<string, any> = { ...(props.rootStyle || {}) };
  if (props.bgImage) style.backgroundImage = `url("${props.bgImage}")`;
  if (props.bgColor) style.backgroundColor = props.bgColor;
  if (props.bgGradient) style.backgroundImage = props.bgGradient;
  return style;
});

function getRowStyle(row: MarqueeRow) {
  const style: Record<string, any> = {};

  const padX = props.padX ?? 0;
  const gap = props.gap ?? 10;
  const rowGap = props.rowGap ?? 10;

  style['--pad-x'] = `${padX}px`;
  style['--gap'] = `${gap}px`;
  style['--row-gap'] = `${rowGap}px`;
  style['--item-h'] = `${props.itemHeight ?? 56}px`;

  const fade = row.fade ?? fadeConfig.value.enabled;
  if (fade) {
    const color = row.fadeColor ?? fadeConfig.value.color ?? '#000';
    const start = row.fadeStart ?? fadeConfig.value.start ?? 0;
    const end = row.fadeEnd ?? fadeConfig.value.end ?? 8;

    // Mask on the row container (not the track) to avoid any per-list weirdness.
    style['-webkit-mask-image'] =
      `linear-gradient(90deg, transparent ${start}%, ${color} ${end}%, ${color} ${100 - end}%, transparent ${100 - start}%)`;
    style['mask-image'] =
      `linear-gradient(90deg, transparent ${start}%, ${color} ${end}%, ${color} ${100 - end}%, transparent ${100 - start}%)`;
  }

  return style;
}

function getTrackStyle(row: MarqueeRow) {
  const speed = row.speed ?? props.speed ?? 42;
  const direction = row.direction ?? props.direction ?? 'left';

  const style: Record<string, any> = {
    '--marquee-dir': direction === 'right' ? 'reverse' : 'normal',
  };

  if (speed <= 0) {
    style['--marquee-duration'] = `0s`;
    style.animation = 'none';
  } else {
    const min = 8;
    const max = 240;
    const clamped = Math.max(1, Math.min(100, speed));
    const duration = max - (clamped * (max - min)) / 100;
    style['--marquee-duration'] = `${duration.toFixed(2)}s`;
  }

  return style;
}

function getItemStyle() {
  return {
    '--item-h': `${props.itemHeight ?? 56}px`,
  } as Record<string, any>;
}

async function updateRepeatCount() {
  await nextTick();
  const root = rootRef.value;
  const measure = measureRef.value;
  if (!root || !measure) return;

  const containerWidth = root.clientWidth;
  const baseWidth = measure.scrollWidth;

  if (!containerWidth || !baseWidth) {
    repeatCount.value = 1;
    return;
  }

  // Ensure a single sequence covers the viewport, then we render two sequences for looping.
  repeatCount.value = Math.max(1, Math.ceil(containerWidth / baseWidth) + 1);
}

onMounted(() => {
  updateRepeatCount();
  if (typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => updateRepeatCount());
    if (rootRef.value) ro.observe(rootRef.value);
    if (measureRef.value) ro.observe(measureRef.value);
  } else {
    window.addEventListener('resize', updateRepeatCount);
  }
});

onBeforeUnmount(() => {
  if (ro) ro.disconnect();
  else window.removeEventListener('resize', updateRepeatCount);
});

watch(normalizedItems, () => updateRepeatCount());
</script>

<style scoped>
.universal-marquee {
  margin-top: 2rem !important;
  padding-top: 1rem !important;
  padding-bottom: 2rem;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

/* Header */
.marquee-header {
  display: flex;
  gap: 2rem;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}
.marquee-header.is-center {
  text-align: center;
}
.marquee-header.is-left {
  text-align: left;
  align-items: flex-start;
}
.marquee-header__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: inherit;
}
.marquee-header.is-left .marquee-header__content {
  align-items: flex-start;
}
.marquee-header__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}
.marquee-header.is-left .marquee-header__actions {
  margin-left: auto;
}
.marquee-header__actions.actions-right {
  justify-content: flex-end;
}
.marquee-header__actions.actions-left {
  justify-content: flex-start;
}
.marquee-title {
  margin: 0 !important;
  font-weight: 400 !important;
  font-size: clamp(28px, 3vw, 44px);
  line-height: 1.15;
}

/* Row: mask lives here (fixes “one item lifted” when transforms differ) */
.marquee-row {
  overflow: hidden;
  width: 100%;
  padding-inline: var(--pad-x, 0px);
}

.marquee-row + .marquee-row {
  margin-top: var(--row-gap, 10px);
}

/* Track: ONLY translate animation here (no skew / no extra transforms) */
.marquee-track {
  display: flex;
  width: max-content;
  animation: universal-marquee var(--marquee-duration, 42s) linear infinite;
  animation-direction: var(--marquee-dir, normal);
  will-change: transform;
  transform: translate3d(0, 0, 0);
}

/* Lists */
.marquee-list {
  display: flex;
  padding-left: 16px !important;
  align-items: stretch;
  gap: var(--gap, 16px);
  padding: 0;
  margin: 0;
  list-style: none;
}

/* Items */
.marquee-item {
  display: flex;
  align-items: stretch;
  align-self: stretch;
  margin: 0 !important;
  padding: 0 !important;
}

.marquee-item :deep(.ui-btn) {
  height: 100% !important;
  min-height: 100% !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center;
  line-height: 1 !important;
  vertical-align: middle !important;

  margin: 0 !important;
  position: relative !important;
  top: 0 !important;
  transform: none !important;
}

.marquee-item :deep(.ui-btn svg),
.marquee-item :deep(.ui-btn .ui-btn__icon),
.marquee-item :deep(.ui-btn .icon) {
  display: block !important;
  margin: 0 !important;
  transform: none !important;
  position: relative !important;
  top: 0 !important;
}

/* Hidden measuring list */
.marquee-measure {
  position: absolute;
  left: -10000px;
  top: -10000px;
  visibility: hidden;
  display: flex;
  align-items: center;
  gap: var(--gap, 16px);
  padding: 0;
  margin: 0;
  list-style: none;
}

@keyframes universal-marquee {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(-50%, 0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
    transform: none;
  }
}

@media (max-width: 720px) {
  .marquee-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .marquee-header__content {
    align-items: flex-start;
  }
  .marquee-header.is-center .marquee-header__content {
    align-items: center;
  }
  .marquee-header__actions {
    justify-content: flex-start;
    margin-left: 0;
  }
  .marquee-header.is-center .marquee-header__actions {
    justify-content: center;
  }
}
</style>
