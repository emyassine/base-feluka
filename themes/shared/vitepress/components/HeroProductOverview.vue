<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
interface HeroTarget {
  /** Short name shown in the rail, e.g. "Workstation". */
  label: string
  /** One line shown on the visual while this target is active. */
  caption: string
  /** Screenshot of the product running on this target. */
  image: string
  alt: string
}

const props = defineProps<{
  title: string
  lead: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
  targets: HeroTarget[]
  points: Array<{ title: string; description: string; icon?: string }>
}>()

// ---------------------------------------------------------------------------
// Stage depth: the pointer drives CSS variables read by the visual, the ghost
// layers and the spotlight. Mouse only, one write per frame.
// ---------------------------------------------------------------------------
const stage = ref<HTMLElement | null>(null)
const frame = ref<HTMLElement | null>(null)
let raf = 0

function setVars(mx: number, my: number, px: number, py: number) {
  const el = stage.value
  if (!el) return
  el.style.setProperty('--mx', `${mx}%`)
  el.style.setProperty('--my', `${my}%`)
  el.style.setProperty('--px', px.toFixed(3))
  el.style.setProperty('--py', py.toFixed(3))
}

function onPointerMove(e: PointerEvent) {
  const el = frame.value
  if (!el || e.pointerType !== 'mouse') return
  const rect = el.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => setVars(x * 100, y * 100, (x - 0.5) * 2, (y - 0.5) * 2))
}

function onPointerLeave() {
  cancelAnimationFrame(raf)
  setVars(50, 50, 0, 0)
}

// ---------------------------------------------------------------------------
// Target tabs. The CSS progress bar is the clock: when it ends, the next target
// becomes active. Hovering the rail or the visual pauses the bar, hence the
// cycle. Clicking or using the arrow keys selects a target directly.
// ---------------------------------------------------------------------------
const active = ref(0)
const tabEls: HTMLElement[] = []

function select(index: number) {
  active.value = (index + props.targets.length) % props.targets.length
}

function advance() {
  select(active.value + 1)
}

function onTabKeydown(e: KeyboardEvent) {
  const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
  if (step === 0) return
  e.preventDefault()
  select(active.value + step)
  tabEls[active.value]?.focus()
}

onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <section class="hero docs-home__hero relative isolate pt-40 pb-28 md:pt-48 lg:pt-60 lg:pb-40">
    <!-- Blueprint grid. Starts below the navbar so it never shows through the logo. -->
    <div class="hero-grid pointer-events-none absolute inset-x-0 z-0 h-[520px] lg:h-[680px]" aria-hidden="true"></div>

    <div class="docs-home__rays pointer-events-none absolute inset-x-0 top-0 z-0 h-[440px] overflow-hidden md:h-[500px] lg:h-[600px]" aria-hidden="true">
      <DecorativeRays
        :speed="2.5"
        ray-color1="var(--vp-c-brand-1)"
        ray-color2="var(--vp-c-brand-2)"
        :intensity="2"
        :spread="2"
        origin="top-right"
        :tilt="0"
        :saturation="1.5"
        :blend="0.75"
        :falloff="1.6"
        :opacity="0.48"
      />
    </div>

    <div class="container relative z-10 flex flex-col justify-between gap-20 md:gap-24 lg:flex-row lg:gap-32">
      <div class="box-border min-w-0 flex-1">
        <h1
          class="docs-home__hero-title hero-rise text-foreground max-w-xl text-balance !text-3xl !leading-[1.1] !font-semibold !tracking-[-0.03em] md:!text-4xl lg:!text-5xl"
          style="--d: 0ms"
        >
          {{ title }}
        </h1>
        <p
          class="docs-home__hero-lead hero-rise text-muted-foreground mt-8 max-w-md text-base !leading-relaxed md:mt-9 md:text-lg"
          style="--d: 90ms"
        >
          {{ lead }}
        </p>
        <div class="hero-rise mt-12 flex flex-wrap items-center gap-3 md:mt-14 md:gap-4 lg:flex-nowrap" style="--d: 180ms">
          <Button tag="a" :href="primaryHref" color="primary" class="hero-cta hero-cta--primary">{{ primaryLabel }}</Button>
          <Button tag="a" :href="secondaryHref" color="gray" outlined icon-position="after" class="hero-cta hero-cta--secondary">
            {{ secondaryLabel }}
            <template #icon><svg class="hero-cta__arrow size-4 shrink-0" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></template>
          </Button>
        </div>
      </div>

      <div class="relative box-border flex min-w-0 flex-1 flex-col justify-center pt-14 lg:pt-0">
        <div class="hero-line-v absolute top-0 left-0 hidden h-full w-px bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(180deg,transparent,black_25%,black_75%,transparent)] text-muted-foreground/70 lg:block" aria-hidden="true"></div>
        <div class="absolute top-0 left-0 block h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)] text-muted-foreground/70 lg:hidden" aria-hidden="true"></div>
        <div class="space-y-10 lg:space-y-12 lg:pl-16">
          <div
            v-for="(point, i) in points"
            :key="point.title"
            class="hero-point hero-rise group flex gap-4 lg:gap-5"
            :style="{ '--d': `${260 + i * 80}ms` }"
          >
            <span v-if="point.icon" class="hero-point__icon text-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center lg:size-6">
              <img :src="point.icon" alt="" class="size-full object-contain" />
            </span>
            <div>
              <h2 class="hero-point__title text-foreground !text-base !font-semibold !leading-6">{{ point.title }}</h2>
              <p class="hero-point__desc text-muted-foreground mt-1.5 max-w-sm text-sm leading-relaxed">{{ point.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stage: one screenshot per target, with two ghost layers fanning out beneath -->
    <div class="relative z-10 mt-28 max-lg:ml-6 max-lg:h-[550px] max-lg:overflow-hidden md:mt-36 lg:container lg:mt-44">
      <div ref="stage" class="hero-stage relative lg:pb-14">
        <div class="hero-glow pointer-events-none absolute -inset-x-6 top-10 -bottom-6 -z-10 max-lg:hidden" aria-hidden="true"></div>

        <div class="relative max-lg:h-full">
          <div class="hero-layer hero-layer--2 pointer-events-none absolute inset-0 rounded-2xl max-lg:hidden" aria-hidden="true"></div>
          <div class="hero-layer hero-layer--1 pointer-events-none absolute inset-0 rounded-2xl max-lg:hidden" aria-hidden="true"></div>

          <div
            ref="frame"
            class="hero-frame relative h-[420px] w-full overflow-hidden rounded-2xl max-lg:h-full max-lg:rounded-tr-none md:h-[560px] lg:h-[793px]"
            role="tabpanel"
            :aria-labelledby="`hero-tab-${active}`"
            @pointermove="onPointerMove"
            @pointerleave="onPointerLeave"
          >
            <div class="hero-frame__stack absolute inset-0">
              <img
                v-for="(target, i) in targets"
                :key="target.label"
                :src="target.image"
                :alt="target.alt"
                :loading="i === 0 ? 'eager' : 'lazy'"
                :aria-hidden="i !== active"
                class="hero-shot"
                :class="{ 'is-active': i === active }"
              />
            </div>

            <div class="hero-frame__spot pointer-events-none absolute inset-0" aria-hidden="true"></div>
            <div class="hero-frame__edge pointer-events-none absolute inset-0 rounded-[inherit]" aria-hidden="true"></div>

            <div class="hero-caption-stack pointer-events-none absolute bottom-4 left-4 md:bottom-6 md:left-6 lg:bottom-8 lg:left-8" aria-live="polite">
              <p
                v-for="(target, i) in targets"
                :key="target.label"
                class="hero-caption"
                :class="{ 'is-active': i === active }"
                :aria-hidden="i !== active"
              >
                <span class="hero-caption__dot" aria-hidden="true"></span>
                {{ target.caption }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Target tabs -->
    <div class="relative z-10 mt-16 max-lg:mx-6 md:mt-20 lg:container lg:mt-12">
      <div class="hero-rail-wrap relative">
        <span class="hero-rail__corner hero-rail__corner--tl" aria-hidden="true"></span>
        <span class="hero-rail__corner hero-rail__corner--tr" aria-hidden="true"></span>
        <span class="hero-rail__corner hero-rail__corner--bl" aria-hidden="true"></span>
        <span class="hero-rail__corner hero-rail__corner--br" aria-hidden="true"></span>

        <div class="hero-rail" role="tablist" aria-label="Application targets" :style="{ '--n': targets.length }">
          <button
            v-for="(target, i) in targets"
            :id="`hero-tab-${i}`"
            :key="target.label"
            :ref="(el) => { if (el) tabEls[i] = el as HTMLElement }"
            type="button"
            role="tab"
            class="hero-rail__cell"
            :class="{ 'is-active': i === active }"
            :aria-selected="i === active"
            :tabindex="i === active ? 0 : -1"
            @click="select(i)"
            @keydown="onTabKeydown"
          >
            <span class="hero-rail__dot" aria-hidden="true"></span>
            <span class="hero-rail__label">{{ target.label }}</span>
            <span v-if="i === active" class="hero-rail__bar" aria-hidden="true" @animationend="advance"></span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ---------- Background grid ---------- */
.hero-grid {
  top: var(--vp-nav-height);
  background-image:
    linear-gradient(to right, var(--vp-c-divider) 1px, transparent 1px),
    linear-gradient(to bottom, var(--vp-c-divider) 1px, transparent 1px);
  background-size: 64px 64px;
  background-position: center top;
  opacity: 0.45;
  mask-image: radial-gradient(ellipse 60% 45% at 30% 50%, #000 0%, transparent 100%);
}

/* ---------- Entrance sequence ---------- */
.hero-rise {
  animation: hero-rise 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  animation-delay: var(--d, 0ms);
}

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translate3d(0, 14px, 0);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}

.hero-line-v {
  animation: hero-draw 1.1s cubic-bezier(0.2, 0.7, 0.2, 1) 0.2s both;
  transform-origin: top;
}

@keyframes hero-draw {
  from { transform: scaleY(0); opacity: 0; }
  to { transform: scaleY(1); opacity: 1; }
}

/* ---------- Buttons ---------- */
.hero-cta {
  transition:
    transform 0.25s cubic-bezier(0.2, 0.7, 0.2, 1),
    box-shadow 0.25s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
  will-change: transform;
}

.hero-cta:hover {
  transform: translateY(-1px);
}

.hero-cta:active {
  transform: translateY(0) scale(0.98);
  transition-duration: 0.08s;
}

.hero-cta:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 3px;
}

.hero-cta--primary:hover {
  box-shadow:
    0 1px 0 0 rgb(255 255 255 / 0.18) inset,
    0 10px 28px -8px color-mix(in srgb, var(--vp-c-brand-1) 70%, transparent);
}

.hero-cta--secondary:hover {
  border-color: var(--vp-c-text-3);
}

.hero-cta__arrow {
  transition: transform 0.3s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.hero-cta:hover .hero-cta__arrow {
  transform: translateX(3px);
}

/* ---------- Key points ---------- */
.hero-point {
  transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.hero-point:hover {
  transform: translateX(4px);
}

.hero-point__icon {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hero-point:hover .hero-point__icon {
  transform: scale(1.12) rotate(-4deg);
}

.hero-point__desc {
  transition: color 0.2s ease;
}

.hero-point:hover .hero-point__desc {
  color: var(--vp-c-text-1);
}

/* ---------- Stage ---------- */
.hero-stage {
  --mx: 50%;
  --my: 50%;
  --px: 0;
  --py: 0;
}

.hero-glow {
  background: linear-gradient(115deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  filter: blur(72px);
  opacity: 0.22;
  border-radius: 2rem;
}

html.dark .hero-glow {
  opacity: 0.3;
}

/* Ghost layers: collapsed behind the visual, they fan out as it scrolls into view */
.hero-layer {
  border: 1px dashed color-mix(in srgb, var(--vp-c-text-3) 55%, transparent);
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--vp-c-brand-1) 9%, var(--vp-c-bg)),
    color-mix(in srgb, var(--vp-c-brand-2) 4%, var(--vp-c-bg))
  );
  transform-origin: top center;
  transition: translate 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
  animation: hero-layer-fan linear both;
  animation-timeline: view();
  animation-range: entry 20% cover 45%;
}

.hero-layer--1 {
  --y: 24px;
  --s: 0.965;
  translate: calc(var(--px) * 4px) calc(var(--py) * 3px);
}

.hero-layer--2 {
  --y: 48px;
  --s: 0.93;
  opacity: 0.7;
  translate: calc(var(--px) * 8px) calc(var(--py) * 6px);
}

@keyframes hero-layer-fan {
  from {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 0;
  }
  to {
    transform: translate3d(0, var(--y), 0) scale(var(--s));
    opacity: 1;
  }
}

/* ---------- Visual ---------- */
.hero-frame {
  background: var(--vp-c-bg-soft);
  box-shadow:
    0 0 0 1px rgb(0 0 0 / 0.05),
    0 2px 4px rgb(0 0 0 / 0.04),
    0 12px 24px -6px rgb(0 0 0 / 0.08),
    0 48px 96px -24px rgb(0 0 0 / 0.22);
  animation: hero-frame-in linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 55%;
}

html.dark .hero-frame {
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 0.08),
    0 12px 24px -6px rgb(0 0 0 / 0.5),
    0 48px 96px -24px rgb(0 0 0 / 0.7);
}

@keyframes hero-frame-in {
  from {
    opacity: 0.4;
    transform: translate3d(0, 28px, 0) scale(0.975);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* Parallax lives on the stack, the crossfade lives on each screenshot */
.hero-frame__stack {
  transform: scale(1.025) translate3d(calc(var(--px) * -6px), calc(var(--py) * -6px), 0);
  transition: transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
  will-change: transform;
}

.hero-shot {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: left top;
  opacity: 0;
  transform: scale(1.015);
  transition:
    opacity 0.6s ease,
    transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.hero-shot.is-active {
  opacity: 1;
  transform: none;
}

.hero-frame__spot {
  background: radial-gradient(520px circle at var(--mx) var(--my), rgb(255 255 255 / 0.16), transparent 45%);
  mix-blend-mode: soft-light;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.hero-frame:hover .hero-frame__spot {
  opacity: 1;
}

.hero-frame__edge {
  box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.35), inset 0 0 0 1px rgb(255 255 255 / 0.06);
}

/* Caption pill: all captions share one grid cell and crossfade */
.hero-caption-stack {
  display: grid;
}

.hero-caption {
  grid-area: 1 / 1;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  align-self: end;
  justify-self: start;
  margin: 0;
  padding: 0.5rem 0.875rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 9999px;
  background: color-mix(in srgb, var(--vp-c-bg) 78%, transparent);
  backdrop-filter: blur(12px);
  color: var(--vp-c-text-1);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.2;
  opacity: 0;
  transform: translate3d(0, 6px, 0);
  transition:
    opacity 0.4s ease,
    transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.hero-caption.is-active {
  opacity: 1;
  transform: none;
  transition-delay: 0.15s;
}

.hero-caption__dot {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-brand-1) 20%, transparent);
}

/* ---------- Target tabs ---------- */
.hero-rail {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.875rem;
  background: var(--vp-c-divider);
  animation: hero-rail-in linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

@media (min-width: 640px) {
  .hero-rail {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .hero-rail {
    grid-template-columns: repeat(var(--n), minmax(0, 1fr));
  }
}

@keyframes hero-rail-in {
  from {
    opacity: 0;
    transform: translate3d(0, 16px, 0);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

/* Corner markers, as on the Laravel logo strip */
.hero-rail__corner {
  position: absolute;
  z-index: 1;
  width: 6px;
  height: 6px;
  background: var(--vp-c-brand-1);
  pointer-events: none;
}

.hero-rail__corner--tl { top: -3px; left: -3px; }
.hero-rail__corner--tr { top: -3px; right: -3px; }
.hero-rail__corner--bl { bottom: -3px; left: -3px; }
.hero-rail__corner--br { bottom: -3px; right: -3px; }

.hero-rail__cell {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.375rem 1.5rem;
  border: 0;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-3);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.25s ease, color 0.25s ease;
}

.hero-rail__cell:hover {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.hero-rail__cell:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: -2px;
}

.hero-rail__cell.is-active {
  color: var(--vp-c-text-1);
}

.hero-rail__label {
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.005em;
}

.hero-rail__dot {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 9999px;
  background: var(--vp-c-text-3);
  transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hero-rail__cell.is-active .hero-rail__dot {
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--vp-c-brand-1) 18%, transparent);
  transform: scale(1.15);
}

.hero-rail__bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  transform-origin: left;
  animation: hero-rail-progress 4500ms linear forwards;
}

/* Pause the cycle while the visitor is reading the rail or looking at the visual */
.hero-rail:hover .hero-rail__bar,
.hero:has(.hero-frame:hover) .hero-rail__bar {
  animation-play-state: paused;
}

@keyframes hero-rail-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

/* ---------- Reduced motion ---------- */
@media (prefers-reduced-motion: reduce) {
  .hero-rise,
  .hero-line-v,
  .hero-frame,
  .hero-layer,
  .hero-rail {
    animation: none;
  }

  .hero-layer--1,
  .hero-layer--2 {
    transform: translate3d(0, var(--y), 0) scale(var(--s));
  }

  .hero-rail__bar {
    animation: none;
    transform: none;
  }

  .hero-cta,
  .hero-cta__arrow,
  .hero-point,
  .hero-point__icon,
  .hero-layer,
  .hero-frame__stack,
  .hero-shot,
  .hero-caption,
  .hero-frame__spot {
    transition: none;
    translate: none;
  }

  .hero-frame__stack {
    transform: none;
  }

  .hero-frame__spot {
    display: none;
  }
}
</style>
