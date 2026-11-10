<template>
  <figure class="nds-img" v-bind="rootAttrs">
    <button
      v-if="zoomable"
      ref="triggerRef"
      class="nds-img__trigger"
      type="button"
      :aria-label="zoomLabel"
      :style="ratioStyle"
      @click="open"
    >
      <img
        class="nds-img__media"
        :src="src"
        :alt="alt"
        :loading="loading"
        :decoding="decoding"
        :fetchpriority="fetchPriority"
        :style="ratioStyle"
        :width="width"
        :height="height"
        draggable="false"
      />

      <span class="nds-img__hint" aria-hidden="true">
        <component :is="icon('ZoomIn')" class="nds-img__hint-icon" />
        <span class="nds-img__hint-text">Zoom</span>
      </span>
    </button>

    <img
      v-else
      class="nds-img__media"
      :src="src"
      :alt="alt"
      :loading="loading"
      :decoding="decoding"
      :fetchpriority="fetchPriority"
      :style="ratioStyle"
      :width="width"
      :height="height"
      draggable="false"
    />

    <figcaption v-if="caption" :id="captionId" class="nds-img__caption">
      {{ caption }}
    </figcaption>

    <Teleport to="body">
      <Transition name="nds-overlay">
        <div
          v-if="isOpen"
          class="nds-img__overlay"
          role="dialog"
          aria-modal="true"
          :aria-label="zoomLabel"
          :aria-describedby="caption ? captionId : undefined"
          @click.self="close"
        >
          <div ref="dialogRef" class="nds-img__dialog" tabindex="-1">
            <div class="nds-img__frame">
              <div
                ref="viewportRef"
                class="nds-img__viewport"
                :class="{
                  'is-zoomed': scale > props.minZoom,
                  'is-dragging': isDragging,
                }"
                :style="aspectStyle"
                @wheel.prevent="onWheel"
                @dblclick="onDoubleClick"
                @pointerdown.prevent="onPointerDown"
                @pointermove.prevent="onPointerMove"
                @pointerup="onPointerUp"
                @pointercancel="onPointerUp"
              >
                <img
                  ref="zoomedImgRef"
                  class="nds-img__zoomed"
                  :src="src"
                  :alt="alt"
                  :style="zoomedStyle"
                  :fetchpriority="fetchPriority"
                  draggable="false"
                  @load="onImageLoad"
                />
              </div>

              <Transition name="nds-caption">
                <p v-if="caption" class="nds-img__caption nds-img__caption--overlay">
                  {{ caption }}
                </p>
              </Transition>
            </div>

            <div
              class="nds-img__toolbar"
              :class="`nds-img__toolbar--${props.toolbarPosition}`"
              @pointerdown.stop
              @pointermove.stop
              @pointerup.stop
            >
              <div class="nds-img__toolbar-group">
                <button
                  class="nds-img__pill"
                  type="button"
                  aria-label="Zoom out"
                  :disabled="scale <= props.minZoom"
                  @click="zoomOut()"
                >
                  <component :is="icon('ZoomOut')" class="nds-img__pill-icon" />
                  <span class="nds-img__pill-text">Zoom out</span>
                </button>

                <span class="nds-img__scale-label">{{ scaleLabel }}</span>

                <button
                  class="nds-img__pill"
                  type="button"
                  aria-label="Zoom in"
                  :disabled="scale >= effectiveMaxZoom"
                  @click="zoomIn()"
                >
                  <component :is="icon('ZoomIn')" class="nds-img__pill-icon" />
                  <span class="nds-img__pill-text">Zoom in</span>
                </button>
              </div>

              <div class="nds-img__toolbar-group">
                <button
                  class="nds-img__pill"
                  type="button"
                  aria-label="Reset zoom"
                  :disabled="scale === props.minZoom"
                  @click="resetZoom"
                >
                  <component :is="icon('RotateCcw')" class="nds-img__pill-icon" />
                  <span class="nds-img__pill-text">Reset</span>
                </button>

                <button
                  v-if="fullscreenEnabled"
                  class="nds-img__pill"
                  type="button"
                  :aria-label="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'"
                  @click="toggleFullscreen"
                >
                  <component :is="icon(isFullscreen ? 'Minimize2' : 'Maximize2')" class="nds-img__pill-icon" />
                  <span class="nds-img__pill-text">
                    {{ isFullscreen ? 'Exit' : 'Fullscreen' }}
                  </span>
                </button>

                <button
                  ref="closeBtnRef"
                  class="nds-img__pill nds-img__pill--close"
                  type="button"
                  aria-label="Close"
                  @click="close"
                >
                  <component :is="icon('X')" class="nds-img__pill-icon" />
                  <span class="nds-img__pill-text">Close</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </figure>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';
import * as lucideIcons from 'lucide-vue-next';

defineOptions({ inheritAttrs: false, name: 'NDSImg' });

type Point = { x: number; y: number };

interface TrackedPointer {
  id: number;
  current: Point;
}

const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    caption?: string;
    zoomable?: boolean;
    loading?: 'lazy' | 'eager';
    decoding?: 'async' | 'auto' | 'sync';
    width?: string | number;
    height?: string | number;
    zoomLabel?: string;
    minZoom?: number;
    maxZoom?: number;
    zoomStep?: number;
    fullscreen?: boolean;
    toolbarPosition?: 'top' | 'bottom';
    maxZoomMobile?: number;
    fetchPriority?: 'high' | 'low' | 'auto';
    ratio?: string;
  }>(),
  {
    alt: '',
    caption: '',
    zoomable: true,
    loading: 'eager',
    decoding: 'async',
    zoomLabel: 'Image zoom',
    minZoom: 1,
    maxZoom: 5,
    zoomStep: 0.25,
    fullscreen: true,
    toolbarPosition: 'bottom',
    maxZoomMobile: 5,
    fetchPriority: 'high',
    ratio: '',
  }
);

const attrs = useAttrs();
const rootAttrs = computed(() => attrs);

const isOpen = ref(false);
const isFullscreen = ref(false);
const isDragging = ref(false);
const aspectRatio = ref<string>('');
const viewportWidth = ref(0);

const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);

const activePointers = ref<TrackedPointer[]>([]);
const prevMidpoint = ref<Point>({ x: 0, y: 0 });
const pinchOrigin = ref({ distance: 0, scale: 1, midpoint: { x: 0, y: 0 } });

const viewportRef = ref<HTMLElement | null>(null);
const zoomedImgRef = ref<HTMLImageElement | null>(null);
const dialogRef = ref<HTMLElement | null>(null);

const triggerRef = ref<HTMLButtonElement | null>(null);
const closeBtnRef = ref<HTMLButtonElement | null>(null);

const captionId = `nds-img-caption-${Math.random().toString(36).slice(2, 10)}`;

const fullscreenEnabled = computed(() => props.fullscreen && typeof document !== 'undefined');
const effectiveMaxZoom = computed(() => {
  if (viewportWidth.value > 0 && viewportWidth.value <= 900) {
    return props.maxZoomMobile ?? props.maxZoom;
  }
  return props.maxZoom;
});

const scaleLabel = computed(() => `${Math.round(scale.value * 100)}%`);

function icon(name: string) {
  return (lucideIcons as any)[name] || (lucideIcons as any).CircleHelp;
}

const zoomedStyle = computed(() => {
  const x = clampedTranslate(translateX.value, scale.value, 'x');
  const y = clampedTranslate(translateY.value, scale.value, 'y');
  return {
    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale.value})`,
    willChange: 'transform',
  };
});

const ratioStyle = computed(() => {
  const fromProps = props.ratio?.trim();
  const fromDims =
    typeof props.width === 'number' && typeof props.height === 'number' && props.height > 0
      ? `${props.width} / ${props.height}`
      : '';
  const value = fromProps || fromDims;
  return value ? { '--nds-img-ratio': value } : undefined;
});

const aspectStyle = computed(() => ({
  '--nds-img-aspect': aspectRatio.value || '16 / 9',
}));

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function maxTranslate(currentScale: number, axis: 'x' | 'y'): number {
  const viewport = viewportRef.value;
  const img = zoomedImgRef.value;
  if (!viewport || !img) return 0;

  const vW = viewport.offsetWidth;
  const vH = viewport.offsetHeight;

  const nat = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;

  let baseW = vW;
  let baseH = vW / nat;
  if (baseH > vH) {
    baseH = vH;
    baseW = vH * nat;
  }

  const scaledW = baseW * currentScale;
  const scaledH = baseH * currentScale;

  return axis === 'x' ? Math.max(0, (scaledW - vW) / 2) : Math.max(0, (scaledH - vH) / 2);
}

function clampedTranslate(value: number, currentScale: number, axis: 'x' | 'y'): number {
  const max = maxTranslate(currentScale, axis);
  return clamp(value, -max, max);
}

function viewportPoint(clientX: number, clientY: number): Point {
  const rect = viewportRef.value?.getBoundingClientRect();
  if (!rect) return { x: 0, y: 0 };
  return { x: clientX - rect.left, y: clientY - rect.top };
}

function getMidpoint(pointers: TrackedPointer[]): Point {
  if (pointers.length === 1) return pointers[0].current;
  return {
    x: (pointers[0].current.x + pointers[1].current.x) / 2,
    y: (pointers[0].current.y + pointers[1].current.y) / 2,
  };
}

function getDistance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function viewportCenter(): Point {
  const vp = viewportRef.value;
  if (!vp) return { x: 0, y: 0 };
  return { x: vp.offsetWidth / 2, y: vp.offsetHeight / 2 };
}

function applyScale(nextScale: number, originVP: Point): void {
  const clamped = clamp(nextScale, props.minZoom, effectiveMaxZoom.value);
  const ratio = clamped / scale.value;

  const cx = viewportRef.value ? viewportRef.value.offsetWidth / 2 : 0;
  const cy = viewportRef.value ? viewportRef.value.offsetHeight / 2 : 0;

  translateX.value += originVP.x - cx - (originVP.x - cx) * ratio;
  translateY.value += originVP.y - cy - (originVP.y - cy) * ratio;

  scale.value = clamped;

  translateX.value = clampedTranslate(translateX.value, scale.value, 'x');
  translateY.value = clampedTranslate(translateY.value, scale.value, 'y');
}

function zoomIn(origin?: Point): void {
  applyScale(scale.value + props.zoomStep, origin ?? viewportCenter());
}

function zoomOut(origin?: Point): void {
  applyScale(scale.value - props.zoomStep, origin ?? viewportCenter());
}

function resetZoom(): void {
  scale.value = props.minZoom;
  translateX.value = 0;
  translateY.value = 0;
}

function onWheel(event: WheelEvent): void {
  event.preventDefault();
  const origin = viewportPoint(event.clientX, event.clientY);
  const delta = event.deltaMode === 1 ? event.deltaY * 20 : event.deltaY;
  const direction = delta > 0 ? -1 : 1;
  applyScale(scale.value + direction * props.zoomStep, origin);
}

function onDoubleClick(event: MouseEvent): void {
  if (scale.value > props.minZoom) {
    resetZoom();
  } else {
    const origin = viewportPoint(event.clientX, event.clientY);
    applyScale(props.minZoom + props.zoomStep * 4, origin);
  }
}

function onPointerDown(event: PointerEvent): void {
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

  const point = viewportPoint(event.clientX, event.clientY);

  activePointers.value = activePointers.value.filter(p => p.id !== event.pointerId);
  activePointers.value.push({ id: event.pointerId, current: point });

  prevMidpoint.value = getMidpoint(activePointers.value);

  if (activePointers.value.length === 2) {
    const [a, b] = activePointers.value;
    pinchOrigin.value = {
      distance: getDistance(a.current, b.current),
      scale: scale.value,
      midpoint: getMidpoint(activePointers.value),
    };
  }

  isDragging.value = true;
}

function onPointerMove(event: PointerEvent): void {
  const entry = activePointers.value.find(p => p.id === event.pointerId);
  if (!entry) return;

  entry.current = viewportPoint(event.clientX, event.clientY);

  const count = activePointers.value.length;

  if (count === 2) {
    const [a, b] = activePointers.value;
    const currentDist = getDistance(a.current, b.current);
    const scaleFactor = currentDist / pinchOrigin.value.distance;
    const nextScale = pinchOrigin.value.scale * scaleFactor;
    const mid = getMidpoint(activePointers.value);

    const dx = mid.x - prevMidpoint.value.x;
    const dy = mid.y - prevMidpoint.value.y;
    translateX.value += dx;
    translateY.value += dy;

    applyScale(nextScale, mid);
    prevMidpoint.value = mid;
  } else if (count === 1) {
    const mid = getMidpoint(activePointers.value);
    const dx = mid.x - prevMidpoint.value.x;
    const dy = mid.y - prevMidpoint.value.y;

    translateX.value += dx;
    translateY.value += dy;

    translateX.value = clampedTranslate(translateX.value, scale.value, 'x');
    translateY.value = clampedTranslate(translateY.value, scale.value, 'y');

    prevMidpoint.value = mid;
  }
}

function onPointerUp(event: PointerEvent): void {
  activePointers.value = activePointers.value.filter(p => p.id !== event.pointerId);

  if (activePointers.value.length === 0) {
    isDragging.value = false;
  }

  if (activePointers.value.length === 1) {
    prevMidpoint.value = getMidpoint(activePointers.value);
    pinchOrigin.value = {
      distance: 0,
      scale: scale.value,
      midpoint: prevMidpoint.value,
    };
  }

  if (activePointers.value.length === 0) {
    translateX.value = clampedTranslate(translateX.value, scale.value, 'x');
    translateY.value = clampedTranslate(translateY.value, scale.value, 'y');
  }
}

function open(): void {
  if (!props.zoomable) return;
  isOpen.value = true;
}

function close(): void {
  isOpen.value = false;
}

async function toggleFullscreen(): Promise<void> {
  if (!fullscreenEnabled.value) return;
  const el = dialogRef.value;
  if (!el) return;

  if (document.fullscreenElement) {
    await document.exitFullscreen();
  } else {
    await el.requestFullscreen();
  }
}

function onFullscreenChange(): void {
  isFullscreen.value = !!document.fullscreenElement;
}

function onImageLoad(): void {
  const img = zoomedImgRef.value;
  if (img && img.naturalWidth && img.naturalHeight) {
    aspectRatio.value = `${img.naturalWidth} / ${img.naturalHeight}`;
  }
  translateX.value = clampedTranslate(translateX.value, scale.value, 'x');
  translateY.value = clampedTranslate(translateY.value, scale.value, 'y');
}

function onKeydown(event: KeyboardEvent): void {
  if (!isOpen.value) return;
  switch (event.key) {
    case 'Escape':
      close();
      break;
    case '+':
    case '=':
      zoomIn();
      break;
    case '-':
      zoomOut();
      break;
    case '0':
      resetZoom();
      break;
    case 'f':
    case 'F':
      toggleFullscreen();
      break;
    case 'ArrowLeft':
      translateX.value = clampedTranslate(translateX.value - 40, scale.value, 'x');
      break;
    case 'ArrowRight':
      translateX.value = clampedTranslate(translateX.value + 40, scale.value, 'x');
      break;
    case 'ArrowUp':
      translateY.value = clampedTranslate(translateY.value - 40, scale.value, 'y');
      break;
    case 'ArrowDown':
      translateY.value = clampedTranslate(translateY.value + 40, scale.value, 'y');
      break;
  }
}

watch(isOpen, async value => {
  if (typeof document === 'undefined') return;

  if (value) {
    document.body.style.overflow = 'hidden';
    await nextTick();
    resetZoom();
    closeBtnRef.value?.focus();
  } else {
    document.body.style.overflow = '';
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    activePointers.value = [];
    isDragging.value = false;
    await nextTick();
    triggerRef.value?.focus();
  }
});

function onResize(): void {
  viewportWidth.value = window.innerWidth;
}

onMounted(() => {
  if (typeof window === 'undefined') return;
  viewportWidth.value = window.innerWidth;
  window.addEventListener('resize', onResize);
  window.addEventListener('keydown', onKeydown);
  document.addEventListener('fullscreenchange', onFullscreenChange);
});

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return;
  window.removeEventListener('resize', onResize);
  window.removeEventListener('keydown', onKeydown);
  document.removeEventListener('fullscreenchange', onFullscreenChange);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.nds-img {
  --glass-bg: rgba(18, 18, 20, 0.65);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-highlight: rgba(255, 255, 255, 0.06);
  --glass-blur: 28px;
  --glass-saturate: 180%;
  --caption-color: rgba(255, 255, 255, 0.6);
  --easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --easing-out: cubic-bezier(0.16, 1, 0.3, 1);
  display: grid;
  gap: 10px;
  margin: 0;
}

.nds-img__trigger {
  position: relative;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: zoom-in;
  text-align: left;
  display: block;
  border-radius: 14px;
  overflow: hidden;
  width: 100%;
  aspect-ratio: var(--nds-img-ratio, auto);
}

.nds-img__trigger:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

.nds-img__media {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 13px;
  transition:
    transform 0.35s var(--easing-out),
    filter 0.35s ease;
  aspect-ratio: var(--nds-img-ratio, auto);
  object-fit: cover;
}

.nds-img__trigger:hover .nds-img__media {
  transform: scale(1.015);
  filter: brightness(0.9);
}

/* Always visible hint */
.nds-img__hint {
  position: absolute;
  right: 12px;
  bottom: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px 6px 10px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  box-shadow:
    0 1px 0 var(--glass-highlight) inset,
    0 4px 20px rgba(0, 0, 0, 0.3);
  opacity: 1;
  transform: translateY(0);
  transition:
    transform 0.18s var(--easing-out),
    background 0.18s ease,
    border-color 0.18s ease;
  pointer-events: none;
}

.nds-img__trigger:hover .nds-img__hint {
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.14);
}

.nds-img__hint-icon {
  width: 14px;
  height: 14px;
}

.nds-img__caption {
  font-size: 13px;
  line-height: 1.5;
  color: #8a8a8a;
  margin: 0;
}

.nds-overlay-enter-active,
.nds-overlay-leave-active {
  transition: opacity 0.28s ease;
}

.nds-overlay-enter-active .nds-img__dialog,
.nds-overlay-leave-active .nds-img__dialog {
  transition:
    transform 0.32s var(--easing-out),
    opacity 0.28s ease;
}

.nds-overlay-enter-from,
.nds-overlay-leave-to {
  opacity: 0;
}

.nds-overlay-enter-from .nds-img__dialog,
.nds-overlay-leave-to .nds-img__dialog {
  transform: scale(0.94);
  opacity: 0;
}

.nds-caption-enter-active,
.nds-caption-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s var(--easing-out);
}

.nds-caption-enter-from,
.nds-caption-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

.nds-img__overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(6, 6, 8, 0.82);
  backdrop-filter: blur(6px) saturate(140%);
  -webkit-backdrop-filter: blur(6px) saturate(140%);
  display: grid;
  place-items: center;
}

.nds-img__dialog {
  position: relative;
  width: fit-content;
  height: fit-content;
  max-width: 96vw;
  max-height: 94vh;
  padding: 0;
  border-radius: 16px;
  overflow: visible;
  background: rgba(12, 12, 14, 0.88);
  border: 2px solid var(--nds-bg-dark-color);
  box-shadow:
    0 0 0 0.5px rgba(255, 255, 255, 0.04) inset,
    0 32px 80px rgba(0, 0, 0, 0.6),
    0 8px 24px rgba(0, 0, 0, 0.4);
  outline: none;
}

.nds-img__dialog:fullscreen {
  width: 100vw;
  height: 100dvh;
  max-width: 100vw;
  max-height: 100dvh;
  border-radius: 0;
  border: none;
  padding: 0;
}

.nds-img__frame {
  position: relative;
  border-radius: inherit;
  overflow: hidden;
  border: inherit;
  width: min(92vw, 1200px);
  max-width: 92vw;
  max-height: 86vh;
}

.nds-img__dialog:fullscreen .nds-img__frame {
  border-radius: 0;
  border: none;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}

.nds-img__viewport {
  position: relative;
  width: 100%;
  height: 100%;
  aspect-ratio: var(--nds-img-aspect, 16 / 9);
  overflow: hidden;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nds-img__dialog:fullscreen .nds-img__viewport {
  width: 100%;
  height: 100%;
  aspect-ratio: auto;
}

.nds-img__dialog:fullscreen .nds-img__zoomed {
  border-radius: 0;
}

.nds-img__viewport.is-zoomed {
  cursor: grab;
}

.nds-img__viewport.is-dragging {
  cursor: grabbing !important;
}

.nds-img__zoomed {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  transform-origin: center center;
  border-radius: 13px;
  user-select: none;
  -webkit-user-select: none;
  pointer-events: none;
  transition: transform 0.12s var(--easing-out);
  will-change: transform;
}

.nds-img__viewport.is-dragging .nds-img__zoomed {
  transition: none;
}

.nds-img__toolbar {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 999px;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  box-shadow:
    0 1px 0 var(--glass-highlight) inset,
    0 8px 32px rgba(0, 0, 0, 0.45),
    0 2px 8px rgba(0, 0, 0, 0.3);
  opacity: 1;
  transition: transform 0.25s var(--easing-out);
  flex-wrap: nowrap;
  white-space: nowrap;
  max-width: 92vw;
  overflow-x: auto;
  scrollbar-width: none;
}

.nds-img__toolbar-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: nowrap;
}

.nds-img__toolbar--top {
  top: 16px;
  bottom: auto;
}

.nds-img__toolbar--bottom {
  bottom: 16px;
  top: auto;
}

.nds-img__pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.9);
  border-radius: 999px;
  cursor: pointer;
  transition:
    transform 0.12s var(--easing-spring),
    background 0.15s ease,
    border-color 0.15s ease,
    opacity 0.15s ease;
}

.nds-img__pill:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.16);
  transform: scale(1.03);
}

.nds-img__pill:active:not(:disabled) {
  transform: scale(0.97);
}

.nds-img__pill:disabled {
  opacity: 0.4;
  cursor: default;
}

.nds-img__pill:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

.nds-img__pill-icon {
  width: 16px;
  height: 16px;
  flex: none;
}

.nds-img__pill-text {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.nds-img__pill--close {
  color: rgba(255, 120, 120, 0.95);
  border-color: rgba(255, 120, 120, 0.22);
}

.nds-img__pill--close:hover:not(:disabled) {
  background: rgba(255, 60, 60, 0.18);
  border-color: rgba(255, 120, 120, 0.3);
}

.nds-img__scale-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.55);
  min-width: 52px;
  text-align: center;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
  user-select: none;
}

.nds-img__caption--overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 20px 24px 18px;
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--caption-color);
  background: linear-gradient(to top, rgba(8, 8, 10, 0.8) 0%, rgba(8, 8, 10, 0.4) 60%, transparent 100%);
  pointer-events: none;
}

@media (max-width: 720px) {
  .nds-img__toolbar {
    gap: 6px;
    padding: 8px 10px;
    border-radius: 18px;
    flex-wrap: wrap;
    white-space: normal;
  }

  .nds-img__toolbar-group {
    width: 100%;
    justify-content: center;
  }

  .nds-img__pill-text {
    display: none;
  }
}

.nds-img__toolbar::-webkit-scrollbar {
  display: none;
}
</style>
