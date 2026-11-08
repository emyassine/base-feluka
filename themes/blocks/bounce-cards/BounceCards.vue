<script setup lang="ts">
import type { CSSProperties } from 'vue'

interface BounceCardsProps {
  className?: string
  images?: string[]
  alts?: string[]
  containerWidth?: number | string
  containerHeight?: number | string
  animationDelay?: number
  animationStagger?: number
  easeType?: string
  transformStyles?: string[]
  mobileTransformStyles?: string[]
  enableHover?: boolean
  hoverPush?: string
  cardWidth?: string
  cardHeight?: string
  aspectRatio?: string
  expandedWidth?: string
  expandedHeight?: string
  mobileExpandedWidth?: string
  mobileExpandedHeight?: string
  expandedZIndex?: number
  overflowMode?: 'visible' | 'hidden' | 'auto'
  customStyles?: Record<string, string | number>
}

const props = withDefaults(defineProps<BounceCardsProps>(), {
  className: '',
  images: () => [],
  alts: () => [],
  containerWidth: 640,
  containerHeight: 360,
  animationDelay: 0.15,
  animationStagger: 0.07,
  easeType: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
  transformStyles: () => [],
  mobileTransformStyles: () => [],
  enableHover: true,
  hoverPush: '180px',
  cardWidth: '180px',
  aspectRatio: '1:1',
  expandedWidth: '100%',
  expandedHeight: '100%',
  mobileExpandedWidth: '94%',
  mobileExpandedHeight: '88%',
  expandedZIndex: 30,
  overflowMode: 'visible',
  customStyles: () => ({}),
})

function dimension(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}

function cssAspectRatio(value: string): string {
  return value.replace(':', ' / ')
}

function rootStyle(): CSSProperties {
  return {
    width: dimension(props.containerWidth),
    height: dimension(props.containerHeight),
    '--bounce-hover-push': props.hoverPush,
    '--bounce-card-width': props.cardWidth,
    '--bounce-card-height': props.cardHeight,
    '--bounce-aspect-ratio': cssAspectRatio(props.aspectRatio),
    '--bounce-expanded-width': props.expandedWidth,
    '--bounce-expanded-height': props.expandedHeight,
    '--bounce-mobile-expanded-width': props.mobileExpandedWidth,
    '--bounce-mobile-expanded-height': props.mobileExpandedHeight,
    '--bounce-expanded-z': props.expandedZIndex,
    '--bounce-overflow': props.overflowMode,
    '--bounce-easing': props.easeType,
    ...props.customStyles,
  } as CSSProperties
}

function cardStyle(index: number): CSSProperties {
  const center = (props.images.length - 1) / 2
  const position = index - center
  const step = Math.min(110, 320 / Math.max(1, center))
  const angle = center === 0 ? 0 : -position / center * 12
  const defaultTransform = `rotate(${angle}deg) translate(${position * step}px, 0)`
  const mobileStep = center === 0 ? 0 : 29 / center
  const mobileAngle = center === 0 ? 0 : -position / center * 9
  const defaultMobileTransform = `rotate(${mobileAngle}deg) translate(${position * mobileStep}vw, 0)`

  return {
    '--bounce-transform': props.transformStyles[index] ?? defaultTransform,
    '--bounce-mobile-transform': props.mobileTransformStyles[index]
      ?? (props.transformStyles[index] ? props.transformStyles[index] : defaultMobileTransform),
    '--bounce-delay': `${props.animationDelay + index * props.animationStagger}s`,
  } as CSSProperties
}
</script>

<template>
  <div
    :class="['bounce-cards', className, { 'bounce-cards--hover': enableHover }]"
    :style="rootStyle()"
  >
    <label
      v-for="(src, index) in images"
      :key="`${src}-${index}`"
      class="bounce-cards__card"
      :style="cardStyle(index)"
    >
      <input
        class="bounce-cards__toggle"
        type="checkbox"
        :aria-label="`Toggle focus for image ${index + 1}`"
      >
      <img :src="src" :alt="alts[index] ?? `Expand image ${index + 1}`" draggable="false">
    </label>
  </div>
</template>

<style scoped>
.bounce-cards {
  position: relative;
  max-width: 100%;
  margin-inline: auto;
  overflow: var(--bounce-overflow, visible);
  isolation: isolate;
}

.bounce-cards__card {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--bounce-card-width, 180px);
  height: var(--bounce-card-height, auto);
  aspect-ratio: var(--bounce-aspect-ratio, 1 / 1);
  overflow: hidden;
  border: 6px solid var(--surface, #fff);
  outline: 1px solid var(--page-gutter);
  outline-offset: 1px;
  border-radius: var(--radius-md);
  background: var(--surface-soft, #f6f6f7);
  box-shadow: 0 8px 24px rgb(0 0 0 / 18%);
  translate: -50% -50%;
  transform: var(--bounce-transform, none);
  transform-origin: center;
  z-index: 1;
  opacity: 1;
  animation:
    bounce-cards-enter 760ms var(--bounce-easing, ease-out) var(--bounce-delay, 0s) both,
    bounce-cards-float 2.8s ease-in-out calc(var(--bounce-delay, 0s) + 760ms) infinite;
  transition:
    transform var(--bounce-return-duration, 760ms) var(--bounce-return-easing, cubic-bezier(.22, 1.25, .36, 1)),
    translate var(--bounce-hover-duration, 520ms) var(--bounce-hover-easing, cubic-bezier(.2, .8, .2, 1)),
    scale var(--bounce-hover-duration, 520ms) var(--bounce-hover-easing, cubic-bezier(.2, .8, .2, 1)),
    width 360ms cubic-bezier(.2, .75, .25, 1),
    height 360ms cubic-bezier(.2, .75, .25, 1),
    top 360ms cubic-bezier(.2, .75, .25, 1),
    left 360ms cubic-bezier(.2, .75, .25, 1),
    border-radius 360ms ease,
    box-shadow 260ms ease;
}

.bounce-cards__toggle {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.bounce-cards__card:has(> .bounce-cards__toggle:focus-visible) {
  outline: 3px solid var(--brand);
  outline-offset: 4px;
}

.bounce-cards__card img {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  object-position: center;
  object-fit: cover;
  pointer-events: none;
}

.bounce-cards__card:has(> .bounce-cards__toggle:checked) {
  top: 50%;
  left: 50%;
  width: var(--bounce-expanded-width, 100%);
  height: var(--bounce-expanded-height, 100%);
  max-width: none;
  transform: translate(-50%, -50%);
  translate: 0 0;
  z-index: var(--bounce-expanded-z, 30);
  border-radius: var(--radius-md);
  box-shadow: 0 18px 60px rgb(0 0 0 / 38%);
  opacity: 1;
  scale: 1;
}

@media (hover: hover) {
.bounce-cards--hover:not(:has(.bounce-cards__toggle:checked)):has(.bounce-cards__card:hover) .bounce-cards__card:hover ~ .bounce-cards__card {
  translate: calc(-50% + var(--bounce-hover-push, 180px)) -50%;
}
.bounce-cards--hover:not(:has(.bounce-cards__toggle:checked)):has(.bounce-cards__card:hover) .bounce-cards__card:has(~ .bounce-cards__card:hover) {
  translate: calc(-50% - var(--bounce-hover-push, 180px)) -50%;
}

.bounce-cards--hover:not(:has(.bounce-cards__toggle:checked)) .bounce-cards__card:hover {
  z-index: 5;
  scale: 1.07;
  box-shadow: 0 18px 42px rgb(0 0 0 / 32%);
}
}

@media (hover: none) and (pointer: coarse) {
  .bounce-cards--hover:not(:has(.bounce-cards__toggle:checked)):has(.bounce-cards__card:active)
    .bounce-cards__card:active ~ .bounce-cards__card {
    translate: calc(-50% + var(--bounce-hover-push, 180px)) -50%;
  }

  .bounce-cards--hover:not(:has(.bounce-cards__toggle:checked)):has(.bounce-cards__card:active)
    .bounce-cards__card:has(~ .bounce-cards__card:active) {
    translate: calc(-50% - var(--bounce-hover-push, 180px)) -50%;
  }

  .bounce-cards--hover:not(:has(.bounce-cards__toggle:checked)) .bounce-cards__card:active {
    z-index: 5;
    scale: 1.04;
  }
}

@keyframes bounce-cards-enter {
  0% { opacity: 0; scale: .58; }
  58% { opacity: 1; scale: 1.12; }
  74% { scale: .94; }
  88% { scale: 1.035; }
  100% { opacity: 1; scale: 1; }
}

@keyframes bounce-cards-float {
  0%, 100% { margin-top: 0; }
  50% { margin-top: -8px; }
}

@media (prefers-reduced-motion: reduce) {
  .bounce-cards__card {
    animation-duration: 1ms;
    transition-duration: 1ms;
  }

  .bounce-cards__toggle {
    animation: none;
  }
}

@media (max-width: 600px) {
  .bounce-cards__card:not(:has(> .bounce-cards__toggle:checked)) {
    width: min(var(--bounce-card-width, 180px), 38vw);
  }

  .bounce-cards__card { transform: var(--bounce-mobile-transform, var(--bounce-transform, none)); }

  .bounce-cards__card:has(> .bounce-cards__toggle:checked) {
    width: var(--bounce-mobile-expanded-width, 94%);
    height: var(--bounce-mobile-expanded-height, 88%);
    transform: translate(-50%, -50%);
  }
}
</style>
