<script setup lang="ts">
withDefaults(defineProps<{
  tag?: 'button' | 'a'; href?: string; type?: 'button' | 'submit' | 'reset';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'gray' | 'info' | 'success' | 'warning' | 'danger' | 'dark';
  outlined?: boolean; iconPosition?: 'before' | 'after'; tooltip?: string;
  badge?: string | number; badgeColor?: 'primary' | 'gray' | 'info' | 'success' | 'warning' | 'danger';
}>(), { tag: 'button', type: 'button', size: 'md', color: 'primary', iconPosition: 'before', badgeColor: 'primary' });
</script>

<template>
  <component :is="tag" :href="tag === 'a' ? href : undefined" :type="tag === 'button' ? type : undefined"
    :title="tooltip" :class="['feluqa-button', `size-${size}`, `color-${color}`, { outlined }]">
    <span v-if="$slots.icon && iconPosition === 'before'" class="button-icon"><slot name="icon" /></span>
    <span class="button-content"><slot /></span>
    <span v-if="$slots.icon && iconPosition === 'after'" class="button-icon"><slot name="icon" /></span>
    <span v-if="$slots.badge || badge !== undefined" :class="['button-badge', `badge-${badgeColor}`]"><slot name="badge">{{ badge }}</slot></span>
  </component>
</template>

<style scoped>
.feluqa-button { position:relative; display:inline-flex; align-items:center; justify-content:center; gap:.5rem; border:1px solid transparent; border-radius:.5rem; white-space:nowrap; font-weight:600; line-height:1; text-decoration:none; cursor:pointer; transition:background-color .18s,color .18s,border-color .18s,opacity .18s; }
.feluqa-button:focus-visible { outline:2px solid var(--vp-c-brand-1); outline-offset:2px; }
.size-xs { min-height:1.75rem; padding:.35rem .55rem; font-size:.75rem; }.size-sm { min-height:2rem; padding:.45rem .75rem; font-size:.8125rem; }.size-md { min-height:2.25rem; padding:.5rem 1rem; font-size:.875rem; }.size-lg { min-height:2.75rem; padding:.7rem 1.25rem; font-size:1rem; }.size-xl { min-height:3.25rem; padding:.85rem 1.5rem; font-size:1.125rem; }
.color-primary { background:var(--vp-c-brand-1); color:var(--vp-c-white)!important; }.color-primary:hover { opacity:.88; }
.color-gray { background:var(--vp-c-bg-soft); color:var(--vp-c-text-1)!important; border-color:var(--vp-c-divider); }.color-gray:hover { background:var(--vp-c-bg-mute); }
.color-info,.color-success,.color-warning,.color-danger { background:var(--vp-c-brand-1); color:var(--vp-c-white)!important; }
.color-dark { background:#18181b; color:#fff!important; border-color:rgb(255 255 255 / .28); }
.color-dark:hover { background:#27272a; }
.outlined { background:transparent; color:var(--vp-c-text-1)!important; border-color:currentColor; }
.color-primary.outlined { color:var(--vp-c-brand-1)!important; }.color-gray.outlined { border-color:var(--vp-c-divider); }
.button-icon { display:inline-flex; width:1em; height:1em; align-items:center; justify-content:center; }.button-badge { border-radius:999px; padding:.2rem .4rem; font-size:.7em; background:rgb(255 255 255 / .2); }
</style>
