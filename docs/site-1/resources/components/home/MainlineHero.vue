<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import defaultHeroImage from './assets/hero.webp'
import SideRays from './SideRays.vue'
import FeluqaButton from '../ui/FeluqaButton.vue'

const props = withDefaults(defineProps<{
  title: string
  lead: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel: string
  secondaryHref: string
  heroAlt: string
  heroImage?: string
  points: Array<{ title: string; description: string; icon?: string }>
}>(), {
  heroImage: defaultHeroImage,
})

/**
 * Microinteraction du visuel : spotlight + léger parallaxe qui suivent le curseur.
 * Souris uniquement (pas de tactile), une seule écriture de variables CSS par frame.
 */
const frame = ref<HTMLElement | null>(null)
let raf = 0

function setVars(mx: number, my: number, px: number, py: number) {
  const el = frame.value
  if (!el) return
  el.style.setProperty('--mx', `${mx}%`)
  el.style.setProperty('--my', `${my}%`)
  el.style.setProperty('--px', px.toFixed(3))
  el.style.setProperty('--py', py.toFixed(3))
}

function onPointerMove(e: PointerEvent) {
  const el = frame.value
  if (!el || e.pointerType !== 'mouse') return
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  const y = (e.clientY - r.top) / r.height
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => setVars(x * 100, y * 100, (x - 0.5) * 2, (y - 0.5) * 2))
}

function onPointerLeave() {
  cancelAnimationFrame(raf)
  setVars(50, 50, 0, 0)
}

onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <section class="docs-home__hero relative isolate pt-32 pb-24 md:pt-40 lg:pt-52 lg:pb-36">
    <!-- Grille discrète façon blueprint, dissoute vers les bords -->
    <div class="docs-home__grid pointer-events-none absolute inset-x-0 top-0 z-0 h-[560px] lg:h-[720px]" aria-hidden="true"></div>

    <div class="docs-home__rays pointer-events-none absolute inset-x-0 top-0 z-0 h-[440px] overflow-hidden md:h-[500px] lg:h-[600px]" aria-hidden="true">
      <SideRays
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

    <div class="container relative z-10 flex flex-col justify-between gap-16 md:gap-20 lg:flex-row lg:gap-28">
      <div class="box-border min-w-0 flex-1">
        <h1
          class="docs-home__hero-title hero-rise text-foreground max-w-xl text-balance !text-4xl !leading-[1.05] !font-semibold !tracking-[-0.035em] md:!text-5xl lg:max-w-2xl lg:!text-6xl xl:!text-[4.25rem]"
          style="--d: 0ms"
        >
          {{ title }}
        </h1>
        <p
          class="docs-home__hero-lead hero-rise text-muted-foreground mt-6 max-w-md text-lg !leading-relaxed md:mt-7 md:text-xl"
          style="--d: 90ms"
        >
          {{ lead }}
        </p>
        <div class="hero-rise mt-10 flex flex-wrap items-center gap-3 md:mt-12 md:gap-4 lg:flex-nowrap" style="--d: 180ms">
          <FeluqaButton tag="a" :href="primaryHref" color="primary" class="hero-cta hero-cta--primary">{{ primaryLabel }}</FeluqaButton>
          <FeluqaButton tag="a" :href="secondaryHref" color="gray" outlined icon-position="after" class="hero-cta hero-cta--secondary">
            {{ secondaryLabel }}
            <template #icon><svg class="hero-cta__arrow size-4 shrink-0" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-6-6 6 6-6 6" /></svg></template>
          </FeluqaButton>
        </div>
      </div>

      <div class="relative box-border flex min-w-0 flex-1 flex-col justify-center pt-12 lg:pt-0">
        <div class="hero-line-v absolute top-0 left-0 hidden h-full w-px bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(180deg,transparent,black_25%,black_75%,transparent)] text-muted-foreground/70 lg:block" aria-hidden="true"></div>
        <div class="absolute top-0 left-0 block h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)] text-muted-foreground/70 lg:hidden" aria-hidden="true"></div>
        <div class="space-y-8 lg:space-y-9 lg:pl-14">
          <div
            v-for="(point, i) in points"
            :key="point.title"
            class="hero-point hero-rise group flex gap-4 lg:gap-5"
            :style="{ '--d': `${260 + i * 80}ms` }"
          >
            <span class="hero-point__icon text-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center lg:size-6">
              <img v-if="point.icon" :src="point.icon" alt="" class="size-full object-contain" />
              <svg v-else class="size-full" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle class="hero-point__dot" cx="12" cy="12" r="3"/></svg>
            </span>
            <div>
              <h2 class="hero-point__title text-foreground !text-base !font-semibold !leading-6">{{ point.title }}</h2>
              <p class="hero-point__desc text-muted-foreground mt-1 max-w-sm text-sm leading-relaxed">{{ point.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative z-10 mt-20 max-lg:ml-6 max-lg:h-[550px] max-lg:overflow-hidden md:mt-28 lg:container lg:mt-36">
      <!-- Halo de marque derrière le visuel -->
      <div class="hero-glow pointer-events-none absolute -inset-x-6 top-10 -bottom-6 -z-10 max-lg:hidden" aria-hidden="true"></div>

      <div
        ref="frame"
        class="hero-frame relative h-[420px] w-full overflow-hidden rounded-2xl max-lg:h-full max-lg:rounded-tr-none md:h-[560px] lg:h-[793px]"
        @pointermove="onPointerMove"
        @pointerleave="onPointerLeave"
      >
        <img :src="props.heroImage" :alt="heroAlt" class="hero-frame__img h-full w-full object-cover object-left-top" />
        <!-- Spotlight qui suit le curseur -->
        <div class="hero-frame__spot pointer-events-none absolute inset-0" aria-hidden="true"></div>
        <!-- Liseré interne : donne l'arête « verre » -->
        <div class="hero-frame__edge pointer-events-none absolute inset-0 rounded-[inherit]" aria-hidden="true"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ---------- Grille d'arrière-plan ---------- */
.docs-home__grid {
  background-image:
    linear-gradient(to right, var(--vp-c-divider) 1px, transparent 1px),
    linear-gradient(to bottom, var(--vp-c-divider) 1px, transparent 1px);
  background-size: 64px 64px;
  background-position: center top;
  opacity: 0.45;
  -webkit-mask-image: radial-gradient(ellipse 70% 80% at 30% 0%, #000 0%, transparent 72%);
  mask-image: radial-gradient(ellipse 70% 80% at 30% 0%, #000 0%, transparent 72%);
}

/* ---------- Séquence d'entrée (une seule, orchestrée) ---------- */
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

/* Le trait pointillé se dessine de haut en bas */
.hero-line-v {
  animation: hero-draw 1.1s cubic-bezier(0.2, 0.7, 0.2, 1) 0.2s both;
  transform-origin: top;
}

@keyframes hero-draw {
  from { transform: scaleY(0); opacity: 0; }
  to { transform: scaleY(1); opacity: 1; }
}

/* ---------- Boutons ---------- */
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

/* ---------- Points clés ---------- */
.hero-point {
  transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.hero-point:hover {
  transform: translateX(4px);
}

.hero-point__icon {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease;
}

.hero-point:hover .hero-point__icon {
  transform: scale(1.12) rotate(-4deg);
  color: var(--vp-c-brand-1);
}

.hero-point__dot {
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hero-point:hover .hero-point__dot {
  transform: scale(1.5);
  fill: currentColor;
}

.hero-point__desc {
  transition: color 0.2s ease;
}

.hero-point:hover .hero-point__desc {
  color: var(--vp-c-text-1);
}

/* ---------- Visuel ---------- */
.hero-glow {
  background: linear-gradient(115deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  filter: blur(72px);
  opacity: 0.22;
  border-radius: 2rem;
}

:global(.dark) .hero-glow {
  opacity: 0.3;
}

.hero-frame {
  --mx: 50%;
  --my: 50%;
  --px: 0;
  --py: 0;
  background: var(--vp-c-bg-soft);
  box-shadow:
    0 0 0 1px rgb(0 0 0 / 0.05),
    0 2px 4px rgb(0 0 0 / 0.04),
    0 12px 24px -6px rgb(0 0 0 / 0.08),
    0 48px 96px -24px rgb(0 0 0 / 0.22);
  transition: box-shadow 0.5s ease;
}

:global(.dark) .hero-frame {
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 0.08),
    0 12px 24px -6px rgb(0 0 0 / 0.5),
    0 48px 96px -24px rgb(0 0 0 / 0.7);
}

.hero-frame__img {
  transform: scale(1.025) translate3d(calc(var(--px) * -6px), calc(var(--py) * -6px), 0);
  transition: transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
  will-change: transform;
}

.hero-frame__spot {
  background: radial-gradient(
    520px circle at var(--mx) var(--my),
    rgb(255 255 255 / 0.16),
    transparent 45%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  mix-blend-mode: soft-light;
}

.hero-frame:hover .hero-frame__spot {
  opacity: 1;
}

.hero-frame__edge {
  box-shadow: inset 0 1px 0 0 rgb(255 255 255 / 0.35), inset 0 0 0 1px rgb(255 255 255 / 0.06);
}

/* Révélation du visuel au scroll (amélioration progressive, visible partout sinon) */
@supports (animation-timeline: view()) {
  .hero-frame {
    animation: hero-frame-in linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 55%;
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
}

/* ---------- Accessibilité : mouvement réduit ---------- */
@media (prefers-reduced-motion: reduce) {
  .hero-rise,
  .hero-line-v,
  .hero-frame {
    animation: none !important;
  }

  .hero-cta,
  .hero-cta__arrow,
  .hero-point,
  .hero-point__icon,
  .hero-point__dot,
  .hero-frame__img,
  .hero-frame__spot {
    transition: none !important;
    transform: none !important;
  }

  .hero-frame__spot {
    display: none;
  }
}
</style>
