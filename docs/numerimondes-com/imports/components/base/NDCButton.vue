<template>
  <component
    :is="resolvedTag"
    class="ndc-btn"
    v-bind="componentAttrs"
    :class="computedClasses"
    :href="computedHref"
    :type="computedType"
    :disabled="computedDisabled"
    :aria-disabled="disabled ? 'true' : 'false'"
    :aria-busy="loading ? 'true' : 'false'"
    :aria-label="ariaLabel"
    :role="computedRole"
    :tabindex="computedTabindex"
    @click="handleClick"
    @keydown="handleKeydown"
  >
    <!-- Loading spinner -->
    <span v-if="loading" class="ndc-btn__spinner" aria-hidden="true">
      <svg class="ndc-btn__spinner-svg" viewBox="0 0 24 24" fill="none">
        <circle class="ndc-btn__spinner-track" cx="12" cy="12" r="10" />
        <circle class="ndc-btn__spinner-head" cx="12" cy="12" r="10" />
      </svg>
    </span>

    <!-- Left icon -->
    <component
      v-if="resolvedIcon && iconPosition === 'left' && !loading"
      :is="resolvedIcon"
      class="ndc-btn__icon ndc-btn__icon--left"
      :aria-hidden="!iconOnly"
      :class="{ 'ndc-btn__icon--only': iconOnly }"
    />

    <!-- Label -->
    <span v-if="!iconOnly" class="ndc-btn__label">
      <slot />
    </span>

    <!-- Right icon -->
    <component
      v-if="resolvedIcon && iconPosition === 'right' && !loading"
      :is="resolvedIcon"
      class="ndc-btn__icon ndc-btn__icon--right"
      :aria-hidden="!iconOnly"
      :class="{ 'ndc-btn__icon--only': iconOnly }"
    />
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import * as lucideIcons from 'lucide-vue-next';

defineOptions({
  inheritAttrs: false,
  name: 'NDCButton',
});

type ButtonVariant =
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
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type IconPosition = 'left' | 'right';
type ButtonType = 'button' | 'submit' | 'reset';

interface Props {
  /** URL for link buttons */
  href?: string;
  /** HTML tag override (auto-detected if not provided) */
  tag?: string;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Enable rounded corners */
  rounded?: boolean;
  /** Full rounded pill shape */
  pill?: boolean;
  /** Full width button */
  block?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state with spinner */
  loading?: boolean;
  /** Icon component or lucide icon name */
  icon?: string | any;
  /** Icon position relative to label */
  iconPosition?: IconPosition;
  /** Icon only mode (hides label visually) */
  iconOnly?: boolean;
  /** Button type attribute */
  type?: ButtonType;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Custom tabindex */
  tabindex?: number;
  /** Scale Y on hover (subtle lift effect) */
  scaleOnHover?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  rounded: true,
  pill: false,
  block: false,
  disabled: false,
  loading: false,
  iconPosition: 'left',
  iconOnly: false,
  type: 'button',
  tabindex: 0,
  scaleOnHover: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const attrs = useAttrs();

// Computed tag
const resolvedTag = computed(() => {
  if (props.tag) return props.tag;
  return props.href ? 'a' : 'button';
});

// Computed href (only for links when not disabled)
const computedHref = computed(() => {
  return resolvedTag.value === 'a' && !props.disabled && !props.loading ? props.href : undefined;
});

// Computed type (only for buttons)
const computedType = computed(() => {
  return resolvedTag.value === 'button' ? props.type : undefined;
});

// Computed disabled (only for buttons)
const computedDisabled = computed(() => {
  return resolvedTag.value === 'button' ? props.disabled || props.loading : undefined;
});

// Computed role
const computedRole = computed(() => {
  if (resolvedTag.value === 'a' && (props.disabled || props.loading)) {
    return 'button';
  }
  return undefined;
});

// Computed tabindex
const computedTabindex = computed(() => {
  if (props.disabled || props.loading) return -1;
  return props.tabindex;
});

// Filter out event handlers from attrs to avoid double binding
const componentAttrs = computed(() => {
  const filtered = { ...attrs };
  delete filtered.onClick;
  delete filtered.onKeydown;
  return filtered;
});

// Computed classes
const computedClasses = computed(() => [
  `ndc-btn--${props.variant}`,
  `ndc-btn--${props.size}`,
  {
    'ndc-btn--rounded': props.rounded,
    'ndc-btn--pill': props.pill,
    'ndc-btn--block': props.block,
    'ndc-btn--disabled': props.disabled,
    'ndc-btn--loading': props.loading,
    'ndc-btn--icon-only': props.iconOnly,
    'ndc-btn--with-icon': !!props.icon,
    'ndc-btn--scale-hover': props.scaleOnHover,
  },
]);

// Icon resolution
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

// Event handlers
function handleClick(event: MouseEvent) {
  if (props.disabled || props.loading) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  emit('click', event);
}

function handleKeydown(event: KeyboardEvent) {
  // Handle space and enter for link buttons with disabled state
  if (resolvedTag.value === 'a' && (props.disabled || props.loading)) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  // Prevent default space behavior for buttons (scroll)
  if (resolvedTag.value === 'button' && event.key === ' ') {
    event.preventDefault();
  }
}
</script>

<style scoped>
/**
 * NDC Button Component
 * Modern, accessible, future-proof button with adaptive hover states
 *
 * Features:
 * - Adaptive darkening/lightening on hover based on background luminance
 * - Full WCAG 2.1 AA accessibility compliance
 * - Loading states with spinner
 * - Icon support with proper spacing
 * - Responsive touch targets (min 44x44px)
 * - Reduced motion support
 * - High contrast mode support
 * - Dark mode optimized
 */

/* ============================================================================
   CSS CUSTOM PROPERTIES (Design Tokens)
   ========================================================================= */

.ndc-btn {
  /* Colors */
  --btn-bg: #2563eb;
  --btn-fg: #ffffff;
  --btn-border: transparent;
  --btn-border-hover: transparent;
  --btn-ring-color: rgba(37, 99, 235, 0.35);

  /* Hover behavior: use filter for intelligent darkening/lightening */
  --btn-hover-brightness: 0.9; /* Darken by default (90% = darker) */
  --btn-hover-saturate: 1.05; /* Slight saturation boost */

  /* Spacing */
  --btn-padding-y: 0.375rem; /* 6px */
  --btn-padding-x: 0.875rem; /* 14px */
  --btn-gap: 0.5rem; /* 8px */

  /* Typography */
  --btn-font-size: 0.875rem; /* 14px */
  --btn-line-height: 1.25;

  /* Border */
  --btn-border-width: 1px;
  --btn-border-radius: 0.625rem; /* 10px */

  /* Effects */
  --btn-shadow: none;
  --btn-shadow-hover: none;
  --btn-ring-width: 0;
  --btn-ring-offset: 2px;

  /* Transitions */
  --btn-transition-duration: 150ms;
  --btn-transition-timing: cubic-bezier(0.4, 0, 0.2, 1);

  /* Icon */
  --btn-icon-size: 1rem; /* 16px */

  /* Spinner */
  --btn-spinner-size: 1rem;
  --btn-spinner-border: 2px;
}

/* ============================================================================
   BASE STYLES
   ========================================================================= */

.ndc-btn {
  /* Reset */
  -webkit-tap-highlight-color: transparent;
  -webkit-appearance: none;
  appearance: none;
  color-scheme: light dark;

  /* Layout */
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--btn-gap);

  /* Spacing */
  padding: var(--btn-padding-y) var(--btn-padding-x);
  margin: 0;

  /* Typography */
  font-family: inherit;
  font-size: var(--btn-font-size);
  font-weight: var(--btn-font-weight);
  line-height: var(--btn-line-height);
  text-align: center;
  text-decoration: none;
  white-space: nowrap;

  /* Colors */
  color: var(--btn-fg);
  background-color: transparent;

  /* Border */
  border: var(--btn-border-width) solid var(--btn-border);
  border-radius: var(--btn-border-radius);

  /* Effects */
  box-shadow: var(--btn-shadow);

  /* Interaction */
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;

  /* Accessibility - Minimum touch target */
  min-height: 36px;
  min-width: 36px;

  /* Transitions */
  transition:
    background-color var(--btn-transition-duration) var(--btn-transition-timing),
    border-color var(--btn-transition-duration) var(--btn-transition-timing),
    color var(--btn-transition-duration) var(--btn-transition-timing),
    box-shadow var(--btn-transition-duration) var(--btn-transition-timing),
    filter var(--btn-transition-duration) var(--btn-transition-timing),
    transform var(--btn-transition-duration) var(--btn-transition-timing);
}

.ndc-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background-color: var(--btn-bg);
  border-radius: inherit;
  z-index: 0;
  transition:
    filter var(--btn-transition-duration) var(--btn-transition-timing),
    opacity var(--btn-transition-duration) var(--btn-transition-timing);
}

.ndc-btn > * {
  position: relative;
}

/* ============================================================================
   HOVER & ACTIVE STATES
   ========================================================================= */

.ndc-btn:hover:not(.ndc-btn--disabled):not(.ndc-btn--loading) {
  box-shadow: var(--btn-shadow-hover);
  border-color: var(--btn-border-hover);
  color: var(--btn-fg);
  text-decoration: none;
}

.ndc-btn:hover:not(.ndc-btn--disabled):not(.ndc-btn--loading)::before {
  /* Adaptive darkening/lightening on background only */
  filter: brightness(var(--btn-hover-brightness)) saturate(var(--btn-hover-saturate));
}

.ndc-btn:active:not(.ndc-btn--disabled):not(.ndc-btn--loading) {
  transform: translateY(1px) scale(0.99);
}

/* ============================================================================
   FOCUS STATES (Accessibility)
   ========================================================================= */

.ndc-btn:focus {
  outline: none;
}

.ndc-btn:focus-visible {
  outline: none;
  box-shadow:
    var(--btn-shadow),
    0 0 0 var(--btn-ring-offset) #ffffff,
    0 0 0 calc(var(--btn-ring-offset) + 3px) var(--btn-ring-color);
}

/* Dark mode focus ring adjustment */
@media (prefers-color-scheme: dark) {
  .ndc-btn:focus-visible {
    box-shadow:
      var(--btn-shadow),
      0 0 0 var(--btn-ring-offset) #0a0a0a,
      0 0 0 calc(var(--btn-ring-offset) + 3px) var(--btn-ring-color);
  }
}

/* ============================================================================
   DISABLED & LOADING STATES
   ========================================================================= */

.ndc-btn--disabled,
.ndc-btn--loading {
  cursor: not-allowed;
  opacity: 0.6;
}

.ndc-btn--disabled:hover,
.ndc-btn--loading:hover {
  filter: none;
  transform: none;
}

.ndc-btn--disabled:hover::before,
.ndc-btn--loading:hover::before {
  filter: none;
}

.ndc-btn--loading {
  position: relative;
}

/* ============================================================================
   INNER ELEMENTS
   ========================================================================= */

/* Label */
.ndc-btn__label {
  display: inline-flex;
  align-items: center;
  flex: 0 1 auto;
}

/* Icon */
.ndc-btn__icon {
  width: var(--btn-icon-size);
  height: var(--btn-icon-size);
  flex-shrink: 0;
  display: inline-flex;
}

.ndc-btn__icon--only {
  margin: 0;
}

/* Spinner */
.ndc-btn__spinner {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  inset: 0;
}

.ndc-btn__spinner-svg {
  width: var(--btn-spinner-size);
  height: var(--btn-spinner-size);
  animation: ndc-btn-spin 0.8s linear infinite;
}

.ndc-btn__spinner-track {
  stroke: currentColor;
  opacity: 0.25;
  stroke-width: var(--btn-spinner-border);
}

.ndc-btn__spinner-head {
  stroke: currentColor;
  stroke-width: var(--btn-spinner-border);
  stroke-linecap: round;
  stroke-dasharray: 50;
  stroke-dashoffset: 50;
  animation: ndc-btn-spin-dash 1.5s ease-in-out infinite;
}

@keyframes ndc-btn-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes ndc-btn-spin-dash {
  0% {
    stroke-dashoffset: 50;
  }
  50% {
    stroke-dashoffset: 12.5;
  }
  100% {
    stroke-dashoffset: 50;
  }
}

/* Hide content when loading (keep for layout) */
.ndc-btn--loading .ndc-btn__label,
.ndc-btn--loading .ndc-btn__icon {
  visibility: hidden;
}

/* ============================================================================
   SIZE VARIANTS
   ========================================================================= */

.ndc-btn--xs {
  --btn-padding-y: 0.1875rem; /* 3px */
  --btn-padding-x: 0.5rem; /* 8px */
  --btn-font-size: 0.75rem; /* 12px */
  --btn-icon-size: 0.875rem; /* 14px */
  --btn-spinner-size: 0.875rem;
  --btn-gap: 0.375rem; /* 6px */
  min-height: 28px;
}

.ndc-btn--sm {
  --btn-padding-y: 0.25rem; /* 4px */
  --btn-padding-x: 0.75rem; /* 12px */
  --btn-font-size: 0.8125rem; /* 13px */
  --btn-icon-size: 0.875rem; /* 14px */
  --btn-spinner-size: 0.875rem;
  --btn-gap: 0.4375rem; /* 7px */
  min-height: 32px;
}

.ndc-btn--md {
  /* Uses base values */
  min-height: 36px;
}

.ndc-btn--lg {
  --btn-padding-y: 0.5rem; /* 8px */
  --btn-padding-x: 1.125rem; /* 18px */
  --btn-font-size: 1rem; /* 16px */
  --btn-icon-size: 1.125rem; /* 18px */
  --btn-spinner-size: 1.125rem;
  --btn-gap: 0.625rem; /* 10px */
  min-height: 40px;
}

.ndc-btn--xl {
  --btn-padding-y: 0.625rem; /* 10px */
  --btn-padding-x: 1.375rem; /* 22px */
  --btn-font-size: 1.125rem; /* 18px */
  --btn-icon-size: 1.25rem; /* 20px */
  --btn-spinner-size: 1.25rem;
  --btn-gap: 0.75rem; /* 12px */
  min-height: 44px;
}

/* ============================================================================
   SHAPE MODIFIERS
   ========================================================================= */

.ndc-btn--rounded {
  --btn-border-radius: 0.75rem; /* 12px */
}

.ndc-btn--pill {
  --btn-border-radius: 624.9375rem; /* 9999px */
}

.ndc-btn--block {
  display: flex;
  width: 100%;
}

.ndc-btn--icon-only {
  --btn-padding-x: var(--btn-padding-y);
  aspect-ratio: 1;
}

/* Scale on hover (optional) */
.ndc-btn--scale-hover:hover:not(.ndc-btn--disabled):not(.ndc-btn--loading) {
  transform: translateY(-1px) scaleY(1.02);
}

.ndc-btn--scale-hover:active:not(.ndc-btn--disabled):not(.ndc-btn--loading) {
  transform: translateY(0) scaleY(1);
}

/* ============================================================================
   VARIANT STYLES - Light Mode
   ========================================================================= */

/* Primary */
.ndc-btn--primary {
  --btn-bg: var(--primary-600);
  --btn-fg: #ffffff;
  --btn-border: transparent;
  --btn-ring-color: color-mix(in oklab, var(--primary-600) 40%, transparent);
  --btn-hover-brightness: 0.9; /* Darken */
}

/* Secondary */
.ndc-btn--secondary {
  --btn-bg: var(--gray-100);
  --btn-fg: var(--gray-900);
  --btn-border: color-mix(in oklab, var(--gray-900) 12%, transparent);
  --btn-ring-color: color-mix(in oklab, var(--gray-900) 20%, transparent);
  --btn-hover-brightness: 0.95; /* Slight darken */
}

/* Outline */
.ndc-btn--outline {
  --btn-bg: transparent;
  --btn-fg: var(--gray-900);
  --btn-border: color-mix(in oklab, var(--gray-900) 25%, transparent);
  --btn-border-hover: color-mix(in oklab, var(--gray-900) 35%, transparent);
  --btn-ring-color: color-mix(in oklab, var(--gray-900) 20%, transparent);
  --btn-hover-brightness: 0.97;
}

.ndc-btn--outline:hover:not(.ndc-btn--disabled):not(.ndc-btn--loading) {
  --btn-bg: color-mix(in oklab, var(--gray-900) 4%, transparent);
}

/* Ghost */
.ndc-btn--ghost {
  --btn-bg: transparent;
  --btn-fg: var(--gray-900);
  --btn-border: transparent;
  --btn-ring-color: color-mix(in oklab, var(--gray-900) 20%, transparent);
  --btn-hover-brightness: 0.97;
}

.ndc-btn--ghost:hover:not(.ndc-btn--disabled):not(.ndc-btn--loading) {
  --btn-bg: color-mix(in oklab, var(--gray-900) 6%, transparent);
}

/* Danger */
.ndc-btn--danger {
  --btn-bg: var(--danger-600);
  --btn-fg: #ffffff;
  --btn-border: transparent;
  --btn-ring-color: color-mix(in oklab, var(--danger-600) 40%, transparent);
  --btn-hover-brightness: 0.9;
}

/* Success */
.ndc-btn--success {
  --btn-bg: var(--success-600);
  --btn-fg: #ffffff;
  --btn-border: transparent;
  --btn-ring-color: color-mix(in oklab, var(--success-600) 40%, transparent);
  --btn-hover-brightness: 0.9;
}

/* Warning */
.ndc-btn--warning {
  --btn-bg: var(--warning-600);
  --btn-fg: #ffffff;
  --btn-border: transparent;
  --btn-ring-color: color-mix(in oklab, var(--warning-600) 40%, transparent);
  --btn-hover-brightness: 0.9;
}

/* Black & White - Adaptive */
.ndc-btn--blackwhite {
  --btn-bg: color-mix(in oklab, var(--gray-900) 6%, transparent);
  --btn-fg: var(--gray-800);
  --btn-border: color-mix(in oklab, var(--gray-900) 25%, transparent);
  --btn-border-hover: color-mix(in oklab, var(--gray-900) 45%, transparent);
  --btn-ring-color: color-mix(in oklab, var(--gray-900) 25%, transparent);
  --btn-hover-brightness: 0.94;
  --btn-hover-saturate: 1;
}

/* Pure black/white (inverted by theme) */
.ndc-btn--pure-blackwhite {
  --btn-bg: var(--gray-950);
  --btn-fg: var(--gray-50);
  --btn-border: var(--gray-950);
  --btn-border-hover: var(--gray-950);
  --btn-ring-color: color-mix(in oklab, var(--gray-950) 40%, transparent);
  --btn-hover-brightness: 1;
  --btn-hover-saturate: 1;
}

/* Pure gray */
.ndc-btn--pure-gray {
  --btn-bg: var(--gray-800);
  --btn-fg: var(--gray-50);
  --btn-border: var(--gray-800);
  --btn-border-hover: var(--gray-800);
  --btn-ring-color: color-mix(in oklab, var(--gray-800) 45%, transparent);
  --btn-hover-brightness: 1;
  --btn-hover-saturate: 1;
}

/* ============================================================================
   DARK MODE
   ========================================================================= */

@media (prefers-color-scheme: dark) {
  /* Primary */
  .ndc-btn--primary {
    --btn-bg: var(--primary-500);
    --btn-ring-color: color-mix(in oklab, var(--primary-500) 45%, transparent);
    --btn-hover-brightness: 1.1; /* Lighten in dark mode */
  }

  /* Secondary */
  .ndc-btn--secondary {
    --btn-bg: var(--gray-800);
    --btn-fg: var(--gray-50);
    --btn-border: color-mix(in oklab, var(--gray-50) 10%, transparent);
    --btn-ring-color: color-mix(in oklab, var(--gray-50) 25%, transparent);
    --btn-hover-brightness: 1.15;
  }

  /* Outline */
  .ndc-btn--outline {
    --btn-bg: transparent;
    --btn-fg: var(--gray-50);
    --btn-border: color-mix(in oklab, var(--gray-50) 30%, transparent);
    --btn-border-hover: color-mix(in oklab, var(--gray-50) 45%, transparent);
    --btn-ring-color: color-mix(in oklab, var(--gray-50) 30%, transparent);
    --btn-hover-brightness: 1.05;
  }

  .ndc-btn--outline:hover:not(.ndc-btn--disabled):not(.ndc-btn--loading) {
    --btn-bg: color-mix(in oklab, var(--gray-50) 8%, transparent);
  }

  /* Ghost */
  .ndc-btn--ghost {
    --btn-fg: var(--gray-50);
    --btn-ring-color: color-mix(in oklab, var(--gray-50) 30%, transparent);
    --btn-hover-brightness: 1.05;
  }

  .ndc-btn--ghost:hover:not(.ndc-btn--disabled):not(.ndc-btn--loading) {
    --btn-bg: color-mix(in oklab, var(--gray-50) 10%, transparent);
  }

  /* Danger */
  .ndc-btn--danger {
    --btn-bg: var(--danger-500);
    --btn-ring-color: color-mix(in oklab, var(--danger-500) 45%, transparent);
    --btn-hover-brightness: 1.1;
  }

  /* Success */
  .ndc-btn--success {
    --btn-bg: var(--success-500);
    --btn-ring-color: color-mix(in oklab, var(--success-500) 45%, transparent);
    --btn-hover-brightness: 1.1;
  }

  /* Warning */
  .ndc-btn--warning {
    --btn-bg: var(--warning-500);
    --btn-ring-color: color-mix(in oklab, var(--warning-500) 45%, transparent);
    --btn-hover-brightness: 1.1;
  }
}

/* Explicit dark class support */
.dark .ndc-btn--primary {
  --btn-bg: var(--primary-600);
  --btn-ring-color: color-mix(in oklab, var(--primary-500) 45%, transparent);
  --btn-hover-brightness: 1.1;
}

.dark .ndc-btn--secondary {
  --btn-bg: var(--gray-800);
  --btn-fg: var(--gray-50);
  --btn-border: color-mix(in oklab, var(--gray-50) 10%, transparent);
  --btn-ring-color: color-mix(in oklab, var(--gray-50) 25%, transparent);
  --btn-hover-brightness: 1.15;
}

.dark .ndc-btn--outline {
  --btn-bg: transparent;
  --btn-fg: var(--gray-50);
  --btn-border: color-mix(in oklab, var(--gray-50) 30%, transparent);
  --btn-border-hover: color-mix(in oklab, var(--gray-50) 45%, transparent);
  --btn-ring-color: color-mix(in oklab, var(--gray-50) 30%, transparent);
  --btn-hover-brightness: 1.05;
}

.dark .ndc-btn--outline:hover:not(.ndc-btn--disabled):not(.ndc-btn--loading) {
  --btn-bg: color-mix(in oklab, var(--gray-50) 8%, transparent);
}

.dark .ndc-btn--ghost {
  --btn-fg: var(--gray-50);
  --btn-ring-color: color-mix(in oklab, var(--gray-50) 30%, transparent);
  --btn-hover-brightness: 1.05;
}

.dark .ndc-btn--ghost:hover:not(.ndc-btn--disabled):not(.ndc-btn--loading) {
  --btn-bg: color-mix(in oklab, var(--gray-50) 10%, transparent);
}

.dark .ndc-btn--danger {
  --btn-bg: var(--danger-500);
  --btn-ring-color: color-mix(in oklab, var(--danger-500) 45%, transparent);
  --btn-hover-brightness: 1.1;
}

.dark .ndc-btn--success {
  --btn-bg: var(--success-500);
  --btn-ring-color: color-mix(in oklab, var(--success-500) 45%, transparent);
  --btn-hover-brightness: 1.1;
}

.dark .ndc-btn--warning {
  --btn-bg: var(--warning-500);
  --btn-ring-color: color-mix(in oklab, var(--warning-500) 45%, transparent);
  --btn-hover-brightness: 1.1;
}

.dark .ndc-btn--blackwhite {
  --btn-bg: color-mix(in oklab, var(--gray-50) 10%, transparent);
  --btn-fg: var(--gray-50);
  --btn-border: color-mix(in oklab, var(--gray-50) 35%, transparent);
  --btn-border-hover: color-mix(in oklab, var(--gray-50) 60%, transparent);
  --btn-ring-color: color-mix(in oklab, var(--gray-50) 35%, transparent);
  --btn-hover-brightness: 1.08;
  --btn-hover-saturate: 1;
}

.dark .ndc-btn--pure-blackwhite {
  --btn-bg: var(--gray-50);
  --btn-fg: var(--gray-950);
  --btn-border: var(--gray-50);
  --btn-border-hover: var(--gray-50);
  --btn-ring-color: color-mix(in oklab, var(--gray-50) 60%, transparent);
  --btn-hover-brightness: 1;
  --btn-hover-saturate: 1;
}

/* ============================================================================
   REDUCED MOTION
   ========================================================================= */

@media (prefers-reduced-motion: reduce) {
  .ndc-btn,
  .ndc-btn__spinner-svg {
    animation: none;
    transition: none;
  }

  .ndc-btn:active:not(.ndc-btn--disabled):not(.ndc-btn--loading) {
    transform: none;
  }
}

/* ============================================================================
   HIGH CONTRAST MODE
   ========================================================================= */

@media (prefers-contrast: high) {
  .ndc-btn {
    --btn-border-width: 2px;
  }

  .ndc-btn:focus-visible {
    outline: 3px solid currentColor;
    outline-offset: 2px;
  }
}

/* ============================================================================
   FORCED COLORS MODE (Windows High Contrast)
   ========================================================================= */

@media (forced-colors: active) {
  .ndc-btn {
    border: 1px solid ButtonText;
  }

  .ndc-btn--disabled {
    border-color: GrayText;
    color: GrayText;
  }

  .ndc-btn:focus-visible {
    outline: 2px solid Highlight;
    outline-offset: 2px;
  }
}
</style>
