<script setup lang="ts">
import { computed, onUnmounted, ref, type CSSProperties } from 'vue'

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type ButtonColor = 'primary' | 'gray' | 'info' | 'success' | 'warning' | 'danger' | 'dark'
type ButtonVariant = ButtonColor | 'secondary'
type ThemeIconColor = string | readonly [light: string, dark: string] | { light?: string; dark?: string }

const props = withDefaults(defineProps<{
  tag?: 'button' | 'a'
  href?: string
  label?: string
  icon?: string
  iconColor?: ThemeIconColor
  wrap?: boolean
  type?: 'button' | 'submit' | 'reset'
  size?: ButtonSize
  color?: ButtonVariant
  variant?: ButtonVariant
  outlined?: boolean
  iconPosition?: 'before' | 'after'
  tooltip?: string
  badge?: string | number
  badgeColor?: Exclude<ButtonColor, 'dark'>
  radius?: number
  tint?: string
  tintOpacity?: number
  blur?: number
  textColor?: string
  lineColor?: string
  baseColor?: string
  intensity?: number
  shineSize?: number
  shineFade?: number
  thickness?: number
  speed?: number
  followMouse?: boolean
  proximity?: number
  autoAnimate?: boolean
  disabled?: boolean
}>(), {
  tag: 'button', type: 'button', size: 'md', color: 'primary', iconPosition: 'before', badgeColor: 'primary',
  tint: '#ffffff', tintOpacity: 0, blur: 0,
  intensity: 1, shineSize: 10, shineFade: 40, thickness: 1, speed: 0.35,
  followMouse: false, proximity: 250, autoAnimate: true, disabled: false, wrap: false,
})

const shineAngle = ref(0)
const shineOpacity = ref(0)
const isHovered = ref(false)
const selectedVariant = computed(() => props.variant ?? props.color)
const buttonColor = computed(() => selectedVariant.value === 'secondary' ? 'gray' : selectedVariant.value)
const buttonOutlined = computed(() => props.outlined || selectedVariant.value === 'secondary')
let animationFrame = 0
let previousFrame = 0
const iconStyle = computed<CSSProperties>(() => ({
  '--button-icon-src': props.icon ? `url(\"${props.icon}\")` : undefined,
  ...(typeof props.iconColor === 'string'
    ? { '--button-icon-color-light': props.iconColor, '--button-icon-color-dark': props.iconColor }
    : Array.isArray(props.iconColor)
      ? { '--button-icon-color-light': props.iconColor[0], '--button-icon-color-dark': props.iconColor[1] }
      : { '--button-icon-color-light': props.iconColor?.light, '--button-icon-color-dark': props.iconColor?.dark }),
}) as CSSProperties)
const style = computed(() => ({
  ...(props.radius === undefined ? {} : { '--button-radius': `${Math.max(0, props.radius)}px` }),
  '--button-tint': props.tint,
  '--button-tint-opacity': `${Math.min(1, Math.max(0, props.tintOpacity)) * 100}%`,
  '--button-blur': `${Math.max(0, props.blur)}px`,
  ...(props.textColor ? { '--button-text': props.textColor } : {}),
  '--button-line': props.lineColor ?? (buttonColor.value === 'gray' || buttonOutlined.value ? 'var(--feluqa-brand)' : 'var(--feluqa-on-brand)'),
  ...(props.baseColor ? { '--button-base': props.baseColor } : {}),
  '--button-intensity': String(Math.max(0, props.intensity)),
  '--button-shine-size': `${Math.min(180, Math.max(0, props.shineSize))}deg`,
  '--button-shine-fade': `${Math.min(180, Math.max(0, props.shineFade))}deg`,
  '--button-thickness': `${Math.max(0.5, props.thickness)}px`,
  '--button-shine-angle': `${shineAngle.value}deg`,
  '--button-shine-opacity': String(shineOpacity.value),
}) as CSSProperties)

function followPointer(event: PointerEvent) {
  if (!props.followMouse || props.disabled || event.pointerType === 'touch') return
  const button = event.currentTarget as HTMLElement
  const bounds = button.getBoundingClientRect()
  const x = event.clientX - bounds.left - bounds.width / 2
  const y = event.clientY - bounds.top - bounds.height / 2
  const distance = Math.hypot(x, y)
  shineAngle.value = Math.atan2(y, x) * (180 / Math.PI) + 90
  shineOpacity.value = Math.max(0, Math.min(1, 1 - distance / Math.max(1, props.proximity)))
}

function startHoverAnimation() {
  isHovered.value = true
  if (!props.autoAnimate || props.disabled || animationFrame || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  previousFrame = 0
  const animate = (time: number) => {
    if (!isHovered.value) return
    if (previousFrame) shineAngle.value = (shineAngle.value + (time - previousFrame) * props.speed * 0.36) % 360
    previousFrame = time
    animationFrame = requestAnimationFrame(animate)
  }
  animationFrame = requestAnimationFrame(animate)
}

function leavePointer() {
  isHovered.value = false
  shineOpacity.value = 0
  previousFrame = 0
  cancelAnimationFrame(animationFrame)
  animationFrame = 0
  shineAngle.value = 0
}

function preventDisabledLink(event: MouseEvent) {
  if (!props.disabled || props.tag !== 'a') return
  event.preventDefault()
  event.stopImmediatePropagation()
}

onUnmounted(() => cancelAnimationFrame(animationFrame))
</script>

<template>
  <a
    v-if="tag === 'a'"
    :href="!disabled ? href : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
    :tabindex="disabled ? -1 : undefined"
    :title="tooltip"
    :style="style"
    :class="[
      'feluqa-button', 'no-icon', `size-${size}`, `color-${buttonColor}`,
      { outlined: buttonOutlined, 'is-disabled': disabled, 'is-hovered': isHovered, 'is-auto-animated': autoAnimate, 'has-text-color': Boolean(textColor), 'wrap-label': wrap },
    ]"
    @pointerenter="startHoverAnimation"
    @pointermove="followPointer"
    @pointerleave="leavePointer"
    @click="preventDisabledLink"
  >
    <span v-if="(icon || $slots.icon) && iconPosition === 'before'" class="button-icon">
      <slot name="icon"><span v-if="icon" class="button-icon-image" :style="iconStyle" aria-hidden="true" /></slot>
    </span>
    <span class="button-content"><slot>{{ label || 'Get Started' }}</slot></span>
    <span v-if="(icon || $slots.icon) && iconPosition === 'after'" class="button-icon">
      <slot name="icon"><span v-if="icon" class="button-icon-image" :style="iconStyle" aria-hidden="true" /></slot>
    </span>
    <span v-if="$slots.badge || badge !== undefined" :class="['button-badge', `badge-${badgeColor}`]"><slot name="badge">{{ badge }}</slot></span>
  </a>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    :aria-disabled="disabled ? 'true' : undefined"
    :title="tooltip"
    :style="style"
    :class="[
      'feluqa-button', 'no-icon', `size-${size}`, `color-${buttonColor}`,
      { outlined: buttonOutlined, 'is-disabled': disabled, 'is-hovered': isHovered, 'is-auto-animated': autoAnimate, 'has-text-color': Boolean(textColor), 'wrap-label': wrap },
    ]"
    @pointerenter="startHoverAnimation"
    @pointermove="followPointer"
    @pointerleave="leavePointer"
    @click="preventDisabledLink"
  >
    <span v-if="(icon || $slots.icon) && iconPosition === 'before'" class="button-icon">
      <slot name="icon"><span v-if="icon" class="button-icon-image" :style="iconStyle" aria-hidden="true" /></slot>
    </span>
    <span class="button-content"><slot>{{ label || 'Get Started' }}</slot></span>
    <span v-if="(icon || $slots.icon) && iconPosition === 'after'" class="button-icon">
      <slot name="icon"><span v-if="icon" class="button-icon-image" :style="iconStyle" aria-hidden="true" /></slot>
    </span>
    <span v-if="$slots.badge || badge !== undefined" :class="['button-badge', `badge-${badgeColor}`]"><slot name="badge">{{ badge }}</slot></span>
  </button>
</template>

<style scoped>
.feluqa-button {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;
  min-height: 2.25rem;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: var(--button-radius, .5rem);
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  cursor: pointer;
  transition: background-color .18s, color .18s, border-color .18s, opacity .18s, box-shadow .2s ease;
}
.feluqa-button:focus-visible { outline: 2px solid var(--feluqa-brand); outline-offset: 2px; }
.feluqa-button.has-text-color { color: var(--button-text)!important; }
.feluqa-button::before,
.feluqa-button::after {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  content: '';
}
.feluqa-button::before {
  inset: 0;
  border: 1px solid color-mix(in srgb, var(--button-base, currentColor), transparent 78%);
  border-radius: inherit;
  background: radial-gradient(140% 180% at 50% 0%, var(--button-tint), transparent 54%);
  opacity: var(--button-tint-opacity);
}
.feluqa-button::after {
  z-index: 2;
  inset: 0;
  padding: var(--button-thickness);
  border-radius: inherit;
  background: conic-gradient(
    from calc(var(--button-shine-angle) - var(--button-shine-size) - var(--button-shine-fade)),
    transparent 0deg,
    color-mix(in srgb, var(--button-line), transparent 65%) var(--button-shine-fade),
    var(--button-line) calc(var(--button-shine-fade) + var(--button-shine-size)),
    color-mix(in srgb, var(--button-line), transparent 5%) calc(var(--button-shine-fade) + var(--button-shine-size) + var(--button-shine-fade)),
    transparent calc(var(--button-shine-fade) + var(--button-shine-size) + var(--button-shine-fade) + 5deg),
    transparent 360deg
  );
  opacity: calc(var(--button-shine-opacity) * var(--button-intensity));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
}
.feluqa-button > span { position: relative; z-index: 1; }
.button-content { white-space: nowrap; }
.wrap-label .button-content { white-space: normal; }
.feluqa-button:hover:not(:disabled):not(.is-disabled) { box-shadow: 0 3px 10px rgb(0 0 0 / .14); }
.feluqa-button.is-hovered::after { filter: drop-shadow(0 0 3px var(--button-line)); }
.feluqa-button.is-hovered.is-auto-animated::after { opacity: var(--button-intensity); }
.size-xs { min-height: 1.75rem; padding: .35rem .55rem; font-size: .75rem; }
.size-sm { min-height: 2rem; padding: .45rem .75rem; font-size: .8125rem; }
.size-md { min-height: 2.25rem; padding: .5rem 1rem; font-size: .875rem; }
.size-lg { min-height: 2.75rem; padding: .7rem 1.25rem; font-size: 1rem; }
.size-xl { min-height: 3.25rem; padding: .85rem 1.5rem; font-size: 1.125rem; }
.color-primary { background: var(--feluqa-brand); color: var(--feluqa-on-brand)!important; }
.color-primary:hover { opacity: .88; }
.color-gray { background: var(--feluqa-surface-soft); color: var(--feluqa-text-primary)!important; border-color: var(--feluqa-border); }
.color-gray:hover {
  background: color-mix(in srgb, var(--feluqa-surface-soft) 93%, var(--feluqa-text-primary));
  border-color: color-mix(in srgb, var(--feluqa-border) 55%, var(--feluqa-text-primary));
}
.color-info,.color-success,.color-warning,.color-danger { background: var(--feluqa-brand); color: var(--feluqa-on-brand)!important; }
.color-dark { background: #18181b; color: #fff!important; border-color: rgb(255 255 255 / .28); }
.color-dark:hover { background: #27272a; }
.outlined { background: transparent; color: var(--feluqa-text-primary)!important; border-color: currentColor; }
.color-primary.outlined { color: var(--feluqa-brand)!important; }
.color-gray.outlined { border-color: var(--feluqa-border); }
.button-icon { display: inline-flex; width: 1em; height: 1em; align-items: center; justify-content: center; }
.button-icon-image { display: inline-block; width: 100%; height: 100%; background-color: var(--button-icon-color-light, currentColor); -webkit-mask: var(--button-icon-src) center / contain no-repeat; mask: var(--button-icon-src) center / contain no-repeat; }
.dark .button-icon-image { background-color: var(--button-icon-color-dark, var(--button-icon-color-light, currentColor)); }
.button-badge { border-radius: 999px; padding: .2rem .4rem; font-size: .7em; background: rgb(255 255 255 / .2); }
.is-disabled { opacity: .55; cursor: not-allowed; }
@media (prefers-reduced-motion: reduce) {
  .feluqa-button { transition: none; }
  .feluqa-button.is-hovered.is-auto-animated::after { opacity: 0; filter: none; }
}
</style>
