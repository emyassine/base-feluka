<template>
  <section class="nm-slider" v-bind="$attrs">
    <section
      v-if="headline || subheading"
      class="hero-header"
      style="padding: 3rem 0 2.5rem; display: flex; flex-direction: column; align-items: center; text-align: center"
    >
      <p v-if="eyebrow" class="eyebrow">
        {{ eyebrow }}
      </p>

      <h1 class="hero_title" style="font-weight: 400; color: inherit; margin-bottom: 1rem">
        <slot name="title">
          <span v-html="headline"></span>
        </slot>
      </h1>

      <p v-if="subheading" class="subtitle" style="margin-top: 0 !important">
        {{ subheading }}
      </p>
    </section>

    <div class="nm-slider__inner" @mouseenter="pauseAutoplay" @mouseleave="resumeAutoplay">
      <template v-for="(it, idx) in normalizedItems" :key="it.__key">
        <input
          class="nm-slider__radio"
          type="radio"
          :name="name"
          :id="radioId(idx)"
          :checked="idx === currentIndex"
          @change="handleUserInteraction(idx)"
        />
      </template>

      <div class="cards" :style="cardsVars">
        <label v-for="(it, idx) in normalizedItems" :key="it.__key" class="card" :for="radioId(idx)">
          <div class="card__media">
            <video
              v-if="it.media?.type === 'video'"
              class="card__video"
              :src="it.media.src"
              :poster="it.media.poster"
              :preload="it.media.preload || 'metadata'"
              :autoplay="!!it.media.autoplay"
              :muted="it.media.muted !== false"
              :loop="it.media.loop !== false"
              :playsinline="it.media.playsinline !== false"
            />
            <img
              v-else
              class="card__img"
              :src="it.media?.src"
              :alt="it.media?.alt || it.title || 'card'"
              :loading="it.media?.loading || 'lazy'"
              :decoding="it.media?.decoding || 'async'"
            />
          </div>

          <div v-if="it.caption" class="card__caption">
            {{ it.caption }}
          </div>
        </label>
      </div>

      <div class="player" v-if="activeItem">
        <div class="upper-part">
          <div class="play-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" class="play-svg" focusable="false">
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          </div>

          <div class="info-area" :style="infoVars">
            <div v-for="(it, idx) in normalizedItems" :key="it.__key" class="info-row">
              <div class="title">{{ it.title }}</div>
              <div class="sub-line">
                <div class="subtitle">{{ it.subtitle }}</div>
                <div v-if="it.time" class="time">{{ it.time }}</div>
              </div>
            </div>
          </div>

          <div class="player-cta" v-if="activeItem.primaryHref && activeItem.primaryText">
            <NDCButton
              :href="activeItem.primaryHref"
              variant="pure-blackwhite"
              :icon="activeItem.primaryIcon"
              :icon-position="activeItem.primaryIconPosition || 'right'"
              :size="buttonSize"
              scaleOnHover="true"
              :pill="true"
              style="opacity: inherit !important"
            >
              {{ activeItem.primaryText }}
            </NDCButton>
          </div>
        </div>

        <div class="progress-bar" aria-hidden="true">
          <span class="progress" :style="progressVars"></span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  name: { type: String, default: 'nm-slider' },
  initialIndex: { type: Number, default: 0 },

  eyebrow: { type: String, default: '' },
  headline: { type: String, default: '' },
  headlineDim: { type: String, default: '≠' },
  headlineAfter: { type: String, default: '' },
  subheading: { type: String, default: '' },

  buttonSize: { type: String, default: 'md' },

  items: {
    type: Array,
    default: () => [],
  },

  cardAspect: { type: String, default: '16 / 9' },
  cardWidth: { type: String, default: '70%' },
  spread: { type: Number, default: 40 },

  bgA: { type: String, default: '#c394f8' },
  bgB: { type: String, default: '#428aa6' },
  accentA: { type: String, default: '#2992dc' },
  accentB: { type: String, default: '#1fe0ff' },

  progressDefault: { type: Number, default: 60 },

  autoplay: { type: Boolean, default: true },
  autoplayInterval: { type: Number, default: 1000 },
  initialAnimation: { type: Boolean, default: true },
  initialAnimationDelay: { type: Number, default: 300 },
});

const currentIndex = ref(props.initialIndex);
const isPaused = ref(false);
let intervalId = null;

const normalizedItems = computed(() => {
  return (props.items || []).map((it, idx) => ({
    __key: it?.id ?? `${idx}`,
    id: it?.id ?? `${idx}`,
    title: it?.title ?? '',
    subtitle: it?.subtitle ?? '',
    time: it?.time ?? '',
    caption: it?.caption ?? '',
    progress: typeof it?.progress === 'number' ? it.progress : null,

    primaryHref: it?.primaryHref,
    primaryText: it?.primaryText,
    primaryIcon: it?.primaryIcon,
    primaryIconPosition: it?.primaryIconPosition,

    media: {
      type: it?.media?.type === 'video' ? 'video' : 'image',
      src: it?.media?.src ?? '',
      alt: it?.media?.alt ?? '',
      poster: it?.media?.poster,
      preload: it?.media?.preload,
      loading: it?.media?.loading,
      decoding: it?.media?.decoding,
      autoplay: it?.media?.autoplay,
      muted: it?.media?.muted,
      loop: it?.media?.loop,
      playsinline: it?.media?.playsinline,
    },
  }));
});

function clampIndex(i) {
  const n = normalizedItems.value.length || 1;
  if (Number.isNaN(i)) return 0;
  return Math.max(0, Math.min(n - 1, i));
}

const activeItem = computed(() => normalizedItems.value[clampIndex(currentIndex.value)] || null);

function radioId(idx) {
  return `${props.name}-item-${idx + 1}`;
}

function next() {
  if (isPaused.value || !props.autoplay) return;
  currentIndex.value = (currentIndex.value + 1) % normalizedItems.value.length;
}

function startAutoplay() {
  if (props.autoplay) {
    stopAutoplay(); // ensure no multiple intervals
    intervalId = setInterval(next, props.autoplayInterval);
  }
}

function stopAutoplay() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function handleUserInteraction(idx) {
  currentIndex.value = idx;
  stopAutoplay();
}

function pauseAutoplay() {
  if (props.autoplay) {
    isPaused.value = true;
  }
}

function resumeAutoplay() {
  if (props.autoplay) {
    isPaused.value = false;
  }
}

onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  stopAutoplay();
});

const cardsVars = computed(() => ({
  '--nm-card-aspect': props.cardAspect,
  '--nm-card-width': props.cardWidth,
  '--nm-spread': `${props.spread}%`,
  '--nm-count': `${normalizedItems.value.length}`,
}));

const infoVars = computed(() => ({
  '--nm-info-step': '40px',
  '--nm-initial-index': `${clampIndex(currentIndex.value)}`,
}));

const progressVars = computed(() => {
  const p = activeItem.value?.progress ?? props.progressDefault;
  const width = `${Math.max(0, Math.min(100, p))}%`;
  return { width };
});
</script>

<style scoped>
.nm-slider,
.nm-slider * {
  box-sizing: border-box;
}

.nm-slider {
  --bg-a: #c394f8;
  --bg-b: #428aa6;

  --accent-a: #2992dc;
  --accent-b: #1fe0ff;

  --radius: 12px;
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.18);

  width: min(920px, 100%);
  margin: 0 auto;
  padding: 22px 14px;
  border-radius: calc(var(--radius) + 6px);
}

.nm-slider__inner {
  position: relative;
}

.nm-slider__radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.hero-header {
  text-align: center;
  margin: 0 auto 18px;
  max-width: 70ch;
}

.headline {
  margin: 0;
  letter-spacing: -0.04em;
  font-size: clamp(28px, 3.4vw, 46px);
  line-height: 1.1;
  font-weight: 500;
  color: color-mix(in srgb, var(--vp-c-text-1, #111) 92%, transparent);
}

.headline .dim {
  opacity: 0.55;
  padding: 0 0.35rem;
}

.subheading {
  margin: 10px auto 0;
  font-size: clamp(14px, 1.3vw, 16px);
  line-height: 1.5;
  color: color-mix(in srgb, var(--vp-c-text-2, #444) 88%, transparent);
  max-width: 62ch;
}

/* Cards */
.cards {
  position: relative;
  width: 100%;
  aspect-ratio: var(--nm-card-aspect, 16 / 9);
  margin: 0 0 16px;
}

.card {
  position: absolute;
  inset: 0;
  width: var(--nm-card-width, 70%);
  height: 100%;
  margin: auto;
  cursor: pointer;
  transform-origin: center;
  transition:
    transform 320ms ease,
    opacity 320ms ease,
    filter 320ms ease;
  will-change: transform, opacity;
  border-radius: var(--radius);
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 10px;
}

.card__media {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: var(--radius);
  overflow: hidden;
}

.card__img,
.card__video {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: var(--radius);
  object-fit: cover;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  transition: box-shadow 320ms ease;
}

.card__caption {
  font-size: 13px;
  line-height: 1.35;
  font-weight: 500;
  color: color-mix(in srgb, var(--vp-c-text-2, #444) 86%, transparent);
  text-align: center;
  padding: 0 10px;
}

/* Positioning logic (pure CSS, scales for any count)
   Uses :has() with computed nth-ids (works in modern browsers).
   We only ship rules for up to 12 items by default. */
</style>

<style>
/* Generated-ish selectors (1..12). If you need more than 12 items, tell me how many and I’ll extend. */

/* Center */
.nm-slider:has(#nm-slider-item-1:checked) .cards > label:nth-child(1),
.nm-slider:has(#nm-slider-item-2:checked) .cards > label:nth-child(2),
.nm-slider:has(#nm-slider-item-3:checked) .cards > label:nth-child(3),
.nm-slider:has(#nm-slider-item-4:checked) .cards > label:nth-child(4),
.nm-slider:has(#nm-slider-item-5:checked) .cards > label:nth-child(5),
.nm-slider:has(#nm-slider-item-6:checked) .cards > label:nth-child(6),
.nm-slider:has(#nm-slider-item-7:checked) .cards > label:nth-child(7),
.nm-slider:has(#nm-slider-item-8:checked) .cards > label:nth-child(8),
.nm-slider:has(#nm-slider-item-9:checked) .cards > label:nth-child(9),
.nm-slider:has(#nm-slider-item-10:checked) .cards > label:nth-child(10),
.nm-slider:has(#nm-slider-item-11:checked) .cards > label:nth-child(11),
.nm-slider:has(#nm-slider-item-12:checked) .cards > label:nth-child(12) {
  transform: translateX(0) scale(1);
  opacity: 1;
  z-index: 2;
}

.nm-slider:has(#nm-slider-item-1:checked) .cards > label:nth-child(1) .card__img,
.nm-slider:has(#nm-slider-item-2:checked) .cards > label:nth-child(2) .card__img,
.nm-slider:has(#nm-slider-item-3:checked) .cards > label:nth-child(3) .card__img,
.nm-slider:has(#nm-slider-item-4:checked) .cards > label:nth-child(4) .card__img,
.nm-slider:has(#nm-slider-item-5:checked) .cards > label:nth-child(5) .card__img,
.nm-slider:has(#nm-slider-item-6:checked) .cards > label:nth-child(6) .card__img,
.nm-slider:has(#nm-slider-item-7:checked) .cards > label:nth-child(7) .card__img,
.nm-slider:has(#nm-slider-item-8:checked) .cards > label:nth-child(8) .card__img,
.nm-slider:has(#nm-slider-item-9:checked) .cards > label:nth-child(9) .card__img,
.nm-slider:has(#nm-slider-item-10:checked) .cards > label:nth-child(10) .card__img,
.nm-slider:has(#nm-slider-item-11:checked) .cards > label:nth-child(11) .card__img,
.nm-slider:has(#nm-slider-item-12:checked) .cards > label:nth-child(12) .card__img,
.nm-slider:has(#nm-slider-item-1:checked) .cards > label:nth-child(1) .card__video,
.nm-slider:has(#nm-slider-item-2:checked) .cards > label:nth-child(2) .card__video,
.nm-slider:has(#nm-slider-item-3:checked) .cards > label:nth-child(3) .card__video,
.nm-slider:has(#nm-slider-item-4:checked) .cards > label:nth-child(4) .card__video,
.nm-slider:has(#nm-slider-item-5:checked) .cards > label:nth-child(5) .card__video,
.nm-slider:has(#nm-slider-item-6:checked) .cards > label:nth-child(6) .card__video,
.nm-slider:has(#nm-slider-item-7:checked) .cards > label:nth-child(7) .card__video,
.nm-slider:has(#nm-slider-item-8:checked) .cards > label:nth-child(8) .card__video,
.nm-slider:has(#nm-slider-item-9:checked) .cards > label:nth-child(9) .card__video,
.nm-slider:has(#nm-slider-item-10:checked) .cards > label:nth-child(10) .card__video,
.nm-slider:has(#nm-slider-item-11:checked) .cards > label:nth-child(11) .card__video,
.nm-slider:has(#nm-slider-item-12:checked) .cards > label:nth-child(12) .card__video {
  box-shadow: var(--shadow);
}

/* Left (previous item) */
.nm-slider:has(#nm-slider-item-1:checked) .cards > label:nth-child(3),
.nm-slider:has(#nm-slider-item-2:checked) .cards > label:nth-child(1),
.nm-slider:has(#nm-slider-item-3:checked) .cards > label:nth-child(2) {
  transform: translateX(calc(-1 * var(--nm-spread, 40%))) scale(0.82);
  opacity: 0.42;
  filter: saturate(0.9);
  z-index: 1;
}

/* Right (next item) */
.nm-slider:has(#nm-slider-item-1:checked) .cards > label:nth-child(2),
.nm-slider:has(#nm-slider-item-2:checked) .cards > label:nth-child(3),
.nm-slider:has(#nm-slider-item-3:checked) .cards > label:nth-child(1) {
  transform: translateX(var(--nm-spread, 40%)) scale(0.82);
  opacity: 0.42;
  filter: saturate(0.9);
  z-index: 1;
}

/* Player */
.player {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  padding: 14px 12px;
  width: min(520px, 100%);
  margin: 0 auto;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
}

.upper-part {
  position: relative;
  display: grid;
  grid-template-columns: 28px 1fr auto;
  gap: 10px;
  align-items: center;
  min-height: 40px;
  overflow: hidden;
  margin-bottom: 12px;
}

.play-icon {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.04);
}

.play-svg {
  width: 20px;
  height: 20px;
  fill: var(--accent-a);
  stroke: var(--accent-a);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition:
    fill 320ms ease,
    stroke 320ms ease;
}

.info-area {
  position: relative;
  height: 40px;
  overflow: hidden;
}

.info-row {
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  color: #2d2a2d;
  font-size: 14px;
  line-height: 18px;
  font-weight: 600;
}

.sub-line {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}

.time {
  font-size: 12px;
  line-height: 16px;
  color: rgba(40, 40, 40, 0.55);
  font-weight: 500;
}

.time {
  margin-left: auto;
  color: rgba(40, 40, 40, 0.45);
}

.player-cta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* Progress */
.progress-bar {
  height: 3px;
  width: 100%;
  background: rgba(41, 146, 220, 0.12);
  border-radius: 999px;
  overflow: hidden;
}

.progress {
  display: block;
  height: 100%;
  background: var(--accent-a);
  border-radius: 999px;
  transition:
    width 320ms ease,
    background 320ms ease;
}

/* Responsive */
@media (max-width: 520px) {
  .cards {
    aspect-ratio: 4 / 3;
  }
  .card {
    width: 84%;
  }
  .upper-part {
    grid-template-columns: 28px 1fr;
    grid-template-rows: auto auto;
  }
  .player-cta {
    grid-column: 1 / -1;
    justify-content: flex-start;
  }
}
</style>
