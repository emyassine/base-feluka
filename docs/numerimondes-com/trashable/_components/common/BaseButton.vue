<template>
  <div v-if="hasMany" class="actions">
    <div v-for="(btn, i) in buttonsNormalized" :key="btn.key ?? i" class="action">
      <VPButton
        :size="sizeToTheme(btn.size ?? size)"
        :theme="variantToTheme(btn.variant ?? variant)"
        :href="btn.href"
        :text="btn.label ?? ''"
        :tag="btn.tag"
        :target="btn.target"
        :rel="btn.rel"
        :class="{ block: btn.block ?? block }"
        :style="colorToStyle(btn.color ?? color)"
      />
    </div>
  </div>

  <VPButton
    v-else
    :size="sizeToTheme(size)"
    :theme="variantToTheme(variant)"
    :href="href"
    :text="textFromSlot"
    :tag="tag"
    :target="target"
    :rel="rel"
    :class="{ block }"
    :style="colorStyle"
  />
</template>

<script setup lang="ts">
defineOptions({ name: 'BaseButton' });
import { computed, useSlots } from 'vue';
import { VPButton } from 'vitepress/theme';

type ButtonItem = {
  key?: string | number;
  label?: string; // can contain HTML (e.g. "Build<br>now")
  href?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  color?: string;
  type?: 'button' | 'submit' | 'reset';
  slot?: string; // optional slot name override
  tag?: string;
  target?: string;
  rel?: string;
};

type Props = {
  href?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  color?: string;
  type?: 'button' | 'submit' | 'reset';
  tag?: string;
  target?: string;
  rel?: string;

  buttons?: ButtonItem[] | Record<string, ButtonItem | string>;
};

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  block: false,
  type: 'button',
});

const hasMany =
  !!props.buttons && (Array.isArray(props.buttons) ? props.buttons.length > 0 : Object.keys(props.buttons).length > 0);

function sizeToTheme(s: 'sm' | 'md' | 'lg') {
  return s === 'lg' ? 'big' : 'medium';
}

function variantToTheme(v: 'primary' | 'secondary') {
  return v === 'secondary' ? 'alt' : 'brand';
}

function colorToStyle(c?: string) {
  return c && c.trim() ? { background: c, borderColor: c, color: '#fff' } : undefined;
}

const buttonsNormalized = (() => {
  if (!props.buttons) return [];
  if (Array.isArray(props.buttons)) return props.buttons;

  return Object.entries(props.buttons).map(([k, v]) => {
    if (typeof v === 'string') return { key: k, label: v } satisfies ButtonItem;
    return { key: k, ...(v || {}) } satisfies ButtonItem;
  });
})();

const tag = props.tag ?? (props.href ? 'a' : 'button');
const colorStyle = colorToStyle(props.color);
const slots = useSlots();
const textFromSlot = computed(() => {
  const nodes = slots.default?.() ?? [];
  return nodes
    .map(node => {
      if (typeof node.children === 'string') return node.children;
      if (Array.isArray(node.children)) {
        return node.children.map(child => (typeof child === 'string' ? child : '')).join('');
      }
      return '';
    })
    .join('')
    .trim();
});
</script>

<style scoped></style>
