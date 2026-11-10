<template>
  <div
    ref="el"
    class="scrollsee"
    :class="{ 'scrollsee--vertical-mobile': verticalOnMobile }"
    :style="computedStyle"
    v-bind="$attrs"
  >
    <video
      v-if="inlineVideoSrc"
      ref="inlineVideoRef"
      class="scrollsee__media"
      :src="inlineVideoSrc"
      :muted="inlineMuted"
      :autoplay="inlineAutoplay"
      :loop="inlineLoop"
      :playsinline="true"
      :controls="inlineControls"
      :poster="poster"
    />
    <button v-if="youtubeUrl" class="scrollsee__overlay" type="button" aria-label="Play video" @click="openModal">
      <svg class="scrollsee__play" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="36" cy="36" r="36" fill="rgba(255, 255, 255, 0.92)" />
        <path d="M30 24L50 36L30 48V24Z" fill="#0b0d12" />
      </svg>
    </button>
  </div>
  <teleport to="body">
    <div v-if="isModalOpen" class="scrollsee__modal" @click.self="closeModal">
      <div class="scrollsee__modal-inner" @click.stop>
        <button class="scrollsee__close" type="button" aria-label="Close" @click="closeModal">✕</button>
        <div class="scrollsee__player">
          <iframe
            v-if="embedUrl"
            :src="embedUrl"
            allowfullscreen
            allow="autoplay; fullscreen; picture-in-picture"
          ></iframe>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, useAttrs } from 'vue';

useAttrs();

const props = defineProps({
  src: { type: String, default: '' },
  youtubeUrl: { type: String, default: '' },
  inlineVideoSrc: { type: String, default: '' },
  inlineMuted: { type: Boolean, default: true },
  inlineAutoplay: { type: Boolean, default: false },
  inlineLoop: { type: Boolean, default: false },
  inlineControls: { type: Boolean, default: false },
  poster: { type: String, default: '' },
  scaleFrom: { type: Number, default: 0.6 },
  scaleTo: { type: Number, default: 1.8 },
  smoothing: { type: Number, default: 0 },
  verticalOnMobile: { type: Boolean, default: false },
  exponent: { type: Number, default: 1 },
});

const el = ref(null);
const isModalOpen = ref(false);
const target = ref(0);
const current = ref(0);
const isVisible = ref(false);
const elementHeight = ref(0);

const MIN_TOP_MARGIN_REM = 0.25;
const MAX_TOP_MARGIN_REM = 3;
const BASE_BOTTOM_MARGIN_REM = 2.5;

const computedStyle = computed(() => {
  const easedProgress = Math.pow(current.value, props.exponent);
  const scale = props.scaleFrom + (props.scaleTo - props.scaleFrom) * easedProgress;

  const overflowTop = Math.max(0, ((scale - 1) * elementHeight.value) / 2);
  const overflowBottom = Math.max(0, ((scale - 1) * elementHeight.value) / 2);

  const topMargin = MIN_TOP_MARGIN_REM + (MAX_TOP_MARGIN_REM - MIN_TOP_MARGIN_REM) * easedProgress;
  const safeTop = Math.ceil(overflowTop + 8);
  const safeBottom = Math.ceil(overflowBottom + 8);

  return {
    backgroundImage: props.src ? `url("${props.src}")` : undefined,
    transform: `scale(${scale})`,
    paddingTop: `calc(${topMargin}rem + ${safeTop}px)`,
    marginBottom: `calc(${BASE_BOTTOM_MARGIN_REM}rem + ${safeBottom}px)`,
  };
});

let raf = 0;
let io = null;
let ro = null;

const clamp01 = x => Math.max(0, Math.min(1, x));

function updateElementHeight() {
  if (!el.value) return;
  elementHeight.value = el.value.offsetHeight || 0;
}

function computeTargetProgress() {
  if (!el.value) return 0;
  const rect = el.value.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  const start = vh * 0.8;
  const end = -rect.height * 0.2;
  const total = start - end;
  const currentPos = start - rect.top;
  return clamp01(currentPos / total);
}

function tick() {
  if (!isVisible.value) return;

  target.value = computeTargetProgress();
  const delta = target.value - current.value;
  const responsiveness = Math.max(0.25, clamp01(props.smoothing));

  if (Math.abs(delta) < 0.001) {
    current.value = target.value;
  } else {
    const adjustedResponsiveness = delta > 0 ? responsiveness * 1.2 : responsiveness;
    current.value += delta * adjustedResponsiveness;
  }

  raf = requestAnimationFrame(tick);
}

function start() {
  isVisible.value = true;
  if (!raf) raf = requestAnimationFrame(tick);
}

function stop() {
  isVisible.value = false;
  if (raf) {
    cancelAnimationFrame(raf);
    raf = 0;
  }
}

const embedUrl = computed(() => {
  if (!props.youtubeUrl) return '';
  return props.youtubeUrl.replace('watch?v=', 'embed/').replace('youtube.com/', 'www.youtube.com/');
});

function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

onMounted(() => {
  if (typeof window === 'undefined') return;

  updateElementHeight();

  io = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting) start();
      else stop();
    },
    {
      root: null,
      threshold: 0,
      rootMargin: '200px 0px 200px 0px',
    }
  );

  if (el.value) {
    io.observe(el.value);
    target.value = computeTargetProgress();
    current.value = target.value;

    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => updateElementHeight());
      ro.observe(el.value);
    } else {
      window.addEventListener('resize', updateElementHeight);
    }
  }
});

onBeforeUnmount(() => {
  if (io) io.disconnect();
  if (ro) ro.disconnect();
  else if (typeof window !== 'undefined') window.removeEventListener('resize', updateElementHeight);
  stop();
});
</script>

<style scoped>
.scrollsee {
  width: min(92vw, 678px);
  aspect-ratio: 16 / 9;
  margin: 0 auto;
  position: relative;
  transform-origin: center center;
  will-change: transform;
  border-radius: 9.5px;
  overflow: hidden;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.3s ease;
}

.scrollsee:hover {
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
}

@media (max-width: 768px) {
  .scrollsee {
    aspect-ratio: 1 / 1;
    width: min(85vw, 400px);
    border-radius: 16px;
  }

  .scrollsee--vertical-mobile {
    aspect-ratio: 9 / 16;
  }
}

.scrollsee__media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.scrollsee__overlay {
  position: absolute;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at center, rgba(0, 0, 0, 0.3), transparent 70%);
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;
}

.scrollsee__overlay:hover {
  background: radial-gradient(circle at center, rgba(0, 0, 0, 0.4), transparent 70%);
}

.scrollsee__play {
  width: 72px;
  height: 72px;
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.2));
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scrollsee__overlay:hover .scrollsee__play {
  transform: scale(1.08);
}

.scrollsee__overlay:hover .scrollsee__play circle {
  fill: rgba(255, 255, 255, 0.95);
}

@media (max-width: 768px) {
  .scrollsee__play {
    width: 64px;
    height: 64px;
  }
}

.scrollsee__modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  z-index: 31;
  padding: 24px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.scrollsee__modal-inner {
  width: min(92vw, 980px);
  background: #0b0d12;
  border-radius: 20px;
  padding: 16px;
  position: relative;
  animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.scrollsee__close {
  position: absolute;
  top: -12px;
  right: -12px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  color: #0b0d12;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  z-index: 32;
  font-size: 18px;
  font-weight: 500;
  display: grid;
  place-items: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.scrollsee__close:hover {
  background: #fff;
  transform: scale(1.1);
}

.scrollsee__player {
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}

.scrollsee__player iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
