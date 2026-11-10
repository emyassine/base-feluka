<template>
  <div
    ref="rootRef"
    class="ndc-dropdown"
    :class="[placementClass, widthClass, { 'ndc-dropdown--open': isOpen }]"
    @keydown.escape.stop.prevent="close"
  >
    <div class="ndc-dropdown__trigger" @click.stop="toggle">
      <slot name="trigger" :open="isOpen" :toggle="toggle">
        <NDCButton variant="outline" size="sm" icon="ChevronDown">
          {{ triggerLabel }}
        </NDCButton>
      </slot>
    </div>

    <div v-show="isOpen" ref="menuRef" class="ndc-dropdown__menu" :style="menuStyle" role="menu" @click.stop>
      <slot>
        <div class="ndc-dropdown__list">
          <component
            v-for="(item, i) in items"
            :key="item.id ?? `item-${i}`"
            :is="item.tag ?? (item.href ? 'a' : 'button')"
            class="ndc-dropdown__item"
            :class="[
              item.color ? `ndc-dropdown__item--${item.color}` : 'ndc-dropdown__item--gray',
              item.disabled ? 'ndc-dropdown__item--disabled' : '',
            ]"
            :href="item.href"
            :type="item.tag === 'button' || (!item.tag && !item.href) ? 'button' : undefined"
            :disabled="item.disabled && (item.tag === 'button' || (!item.tag && !item.href))"
            role="menuitem"
            @click="handleItemClick(item, $event)"
          >
            <span v-if="item.image" class="ndc-dropdown__item-image">
              <img :src="item.image" :alt="item.label" loading="lazy" />
            </span>

            <span v-if="item.icon" class="ndc-dropdown__item-icon" :class="iconColorClass(item)">
              <component :is="resolveIcon(item.icon)" />
            </span>

            <span class="ndc-dropdown__item-label">
              {{ item.label }}
            </span>

            <span v-if="item.badge != null" class="ndc-dropdown__item-badge" :class="badgeColorClass(item)">
              {{ item.badge }}
            </span>
          </component>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import * as lucideIcons from 'lucide-vue-next';
import NDCButton from './NDCButton.vue';

type DropdownColor = 'gray' | 'danger' | 'info' | 'primary' | 'success' | 'warning';

type DropdownItem = {
  id?: string | number;
  label: string;
  href?: string;
  tag?: string;
  color?: DropdownColor;
  icon?: string | any;
  iconColor?: DropdownColor;
  image?: string;
  badge?: string | number;
  badgeColor?: DropdownColor;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
};

const props = withDefaults(
  defineProps<{
    items?: DropdownItem[];
    placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
    width?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';
    maxHeight?: string;
    triggerLabel?: string;
  }>(),
  {
    items: () => [],
    placement: 'bottom-end',
    width: 'sm',
    triggerLabel: 'More actions',
  }
);

const isOpen = ref(false);
const rootRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

const placementClass = computed(() => `ndc-dropdown--${props.placement}`);
const widthClass = computed(() => `ndc-dropdown--w-${props.width}`);
const menuStyle = computed(() => ({
  maxHeight: props.maxHeight || undefined,
}));

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const close = () => {
  isOpen.value = false;
};

const onClickOutside = (event: MouseEvent) => {
  const target = event.target as Node | null;
  if (!target) return;
  if (rootRef.value?.contains(target)) return;
  close();
};

const onWindowBlur = () => {
  close();
};

onMounted(() => {
  document.addEventListener('click', onClickOutside);
  window.addEventListener('blur', onWindowBlur);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside);
  window.removeEventListener('blur', onWindowBlur);
});

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

function resolveIcon(icon: any) {
  if (!icon) return undefined;
  if (typeof icon === 'string') {
    const key = toPascalCase(icon);
    return (lucideIcons as Record<string, any>)[key] || undefined;
  }
  return icon;
}

function iconColorClass(item: DropdownItem) {
  return item.iconColor ? `ndc-dropdown__item-icon--${item.iconColor}` : '';
}

function badgeColorClass(item: DropdownItem) {
  return item.badgeColor ? `ndc-dropdown__item-badge--${item.badgeColor}` : '';
}

function handleItemClick(item: DropdownItem, event: MouseEvent) {
  if (item.disabled) {
    event.preventDefault();
    return;
  }
  item.onClick?.(event);
  close();
}
</script>

<style scoped>
/* ==========================================================================
   NDC Dropdown
   ========================================================================== */

.ndc-dropdown {
  position: relative;
  display: inline-flex;
  align-items: center;
  --ndc-dropdown-bg: color-mix(in srgb, var(--vp-c-bg-soft) 100%, transparent);
  --ndc-dropdown-border: color-mix(in srgb, var(--vp-c-divider) 70%, transparent);
  --ndc-dropdown-shadow: 0 20px 40px color-mix(in srgb, var(--vp-c-black) 18%, transparent);
  --ndc-dropdown-hover: color-mix(in srgb, var(--vp-c-text-1) 6%, transparent);
  --ndc-dropdown-badge-bg: color-mix(in srgb, var(--vp-c-text-1) 8%, transparent);
  --ndc-dropdown-badge-text: var(--vp-c-text-1);
}

.ndc-dropdown__trigger {
  display: inline-flex;
}

.ndc-dropdown__menu {
  position: absolute;
  z-index: 40;
  margin-top: 8px;
  min-width: 200px;
  border-radius: 12px;
  border: 1px solid var(--ndc-dropdown-border);
  background: var(--ndc-dropdown-bg);
  box-shadow: var(--ndc-dropdown-shadow);
  padding: 6px;
  overflow-y: auto;
}

.ndc-dropdown__list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ndc-dropdown__item {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 0.88rem;
  line-height: 1.15;
  text-align: left;
  cursor: pointer;
  text-decoration: none;
  color: var(--ndc-dropdown-item, var(--vp-c-text-1));
}

.ndc-dropdown__item:hover {
  background: var(--ndc-dropdown-hover);
}

.ndc-dropdown__item--disabled,
.ndc-dropdown__item--disabled:hover {
  opacity: 0.5;
  cursor: not-allowed;
  background: transparent;
}

.ndc-dropdown__item-image {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ndc-dropdown__item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ndc-dropdown__item-icon {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}

.ndc-dropdown__item-icon :deep(svg) {
  width: 16px;
  height: 16px;
}

.ndc-dropdown__item-label {
  font-weight: 500;
}

.ndc-dropdown__item-badge {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 999px;
  background: var(--ndc-dropdown-badge-bg);
  color: var(--ndc-dropdown-badge-text);
}

.ndc-dropdown__item--gray {
  --ndc-dropdown-item: var(--vp-c-text-1);
}

.ndc-dropdown__item--primary {
  --ndc-dropdown-item: var(--vp-c-brand-1);
}

.ndc-dropdown__item--success {
  --ndc-dropdown-item: var(--dp-color-accent);
}

.ndc-dropdown__item--warning {
  --ndc-dropdown-item: var(--vp-c-warning-1);
}

.ndc-dropdown__item--danger {
  --ndc-dropdown-item: var(--vp-c-danger-1);
}

.ndc-dropdown__item--info {
  --ndc-dropdown-item: color-mix(in srgb, var(--vp-c-brand-1) 70%, var(--dp-color-accent) 30%);
}

.ndc-dropdown__item-icon--primary {
  color: var(--vp-c-brand-1);
}

.ndc-dropdown__item-icon--success {
  color: var(--dp-color-accent);
}

.ndc-dropdown__item-icon--warning {
  color: var(--vp-c-warning-1);
}

.ndc-dropdown__item-icon--danger {
  color: var(--vp-c-danger-1);
}

.ndc-dropdown__item-icon--info {
  color: color-mix(in srgb, var(--vp-c-brand-1) 70%, var(--dp-color-accent) 30%);
}

.ndc-dropdown__item-badge--primary {
  --ndc-dropdown-badge-text: var(--vp-c-brand-1);
  --ndc-dropdown-badge-bg: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}

.ndc-dropdown__item-badge--success {
  --ndc-dropdown-badge-text: var(--dp-color-accent);
  --ndc-dropdown-badge-bg: color-mix(in srgb, var(--dp-color-accent) 12%, transparent);
}

.ndc-dropdown__item-badge--warning {
  --ndc-dropdown-badge-text: var(--vp-c-warning-1);
  --ndc-dropdown-badge-bg: color-mix(in srgb, var(--vp-c-warning-1) 12%, transparent);
}

.ndc-dropdown__item-badge--danger {
  --ndc-dropdown-badge-text: var(--vp-c-danger-1);
  --ndc-dropdown-badge-bg: color-mix(in srgb, var(--vp-c-danger-1) 12%, transparent);
}

.ndc-dropdown__item-badge--info {
  --ndc-dropdown-badge-text: color-mix(in srgb, var(--vp-c-brand-1) 70%, var(--dp-color-accent) 30%);
  --ndc-dropdown-badge-bg: color-mix(
    in srgb,
    color-mix(in srgb, var(--vp-c-brand-1) 70%, var(--dp-color-accent) 30%) 12%,
    transparent
  );
}

.ndc-dropdown--bottom-start .ndc-dropdown__menu {
  left: 0;
  top: 100%;
}

.ndc-dropdown--bottom-end .ndc-dropdown__menu {
  right: 0;
  top: 100%;
}

.ndc-dropdown--top-start .ndc-dropdown__menu {
  left: 0;
  bottom: 100%;
  margin-top: 0;
  margin-bottom: 8px;
}

.ndc-dropdown--top-end .ndc-dropdown__menu {
  right: 0;
  bottom: 100%;
  margin-top: 0;
  margin-bottom: 8px;
}

.ndc-dropdown--w-xs .ndc-dropdown__menu {
  max-width: 20rem;
}

.ndc-dropdown--w-sm .ndc-dropdown__menu {
  max-width: 24rem;
}

.ndc-dropdown--w-md .ndc-dropdown__menu {
  max-width: 28rem;
}

.ndc-dropdown--w-lg .ndc-dropdown__menu {
  max-width: 32rem;
}

.ndc-dropdown--w-xl .ndc-dropdown__menu {
  max-width: 36rem;
}

.ndc-dropdown--w-2xl .ndc-dropdown__menu {
  max-width: 42rem;
}

.ndc-dropdown--w-3xl .ndc-dropdown__menu {
  max-width: 48rem;
}

.ndc-dropdown--w-4xl .ndc-dropdown__menu {
  max-width: 56rem;
}

.ndc-dropdown--w-5xl .ndc-dropdown__menu {
  max-width: 64rem;
}

.ndc-dropdown--w-6xl .ndc-dropdown__menu {
  max-width: 72rem;
}

.ndc-dropdown--w-7xl .ndc-dropdown__menu {
  max-width: 80rem;
}

@media (prefers-reduced-motion: reduce) {
  .ndc-dropdown__menu {
    transition: none;
  }
}

@media (max-width: 720px) {
  .ndc-dropdown__menu {
    min-width: 180px;
    padding: 5px;
  }
  .ndc-dropdown__item {
    padding: 7px 9px;
    gap: 6px;
    font-size: 0.82rem;
  }
  .ndc-dropdown__item-icon,
  .ndc-dropdown__item-icon :deep(svg) {
    width: 14px;
    height: 14px;
  }
  .ndc-dropdown__item-badge {
    font-size: 0.7rem;
    padding: 2px 5px;
  }
}
</style>
