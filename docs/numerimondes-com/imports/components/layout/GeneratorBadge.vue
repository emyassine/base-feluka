<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import * as lucideIcons from 'lucide-vue-next';

type IconName = keyof typeof lucideIcons;

const props = withDefaults(
  defineProps<{
    text?: string;
    link?: string;
    linkText?: string;
    icon?: IconName;
    logo?: string;
    topIcon?: IconName;
  }>(),
  {
    text: 'Made with Generator',
    link: '/generator',
    linkText: 'Open',
    icon: 'ExternalLink',
    logo: '/logo.png',
    topIcon: 'ArrowUp',
  }
);

const BadgeIcon = computed<Component>(() => {
  return (lucideIcons as unknown as Record<string, Component>)[props.icon];
});

const TopIcon = computed<Component>(() => {
  return (lucideIcons as unknown as Record<string, Component>)[props.topIcon];
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<template>
  <gen-badge style="position: fixed; bottom: 1rem; right: 1rem; display: inline-flex; align-items: center; gap: 0.5rem">
    <div
      style="
        display: inline-flex;
        align-items: center;
        min-height: 2.125rem;
        padding: 0.15rem 0.6rem;
        background: #080808;
        border: 1px solid #363636;
        border-radius: 999px;
        color: #fff;
        font-size: 0.875rem;
        font-weight: 500;
        white-space: nowrap;
        transition:
          transform 0.2s ease,
          background 0.2s ease;
      "
      onmouseover="
        this.style.background = '#111';
        this.style.transform = 'translateY(-2px)';
      "
      onmouseout="
        this.style.background = '#080808';
        this.style.transform = 'translateY(0)';
      "
    >
      <img
        v-if="logo"
        :src="logo"
        alt=""
        draggable="false"
        style="width: 18px; height: 18px; margin-right: 0.4rem; border-radius: 50%; object-fit: cover; flex-shrink: 0"
      />

      <span style="margin-right: 0.5rem">
        {{ text }}
      </span>

      <a
        v-if="link"
        :href="link"
        target="_blank"
        rel="noopener"
        style="
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          color: #4a9eff;
          text-decoration: none;
          font-weight: 600;
          white-space: nowrap;
        "
      >
        <span>{{ linkText }}</span>
        <component :is="BadgeIcon" style="width: 14px; height: 14px; flex-shrink: 0; color: #4a9eff" />
      </a>
    </div>

    <button
      type="button"
      aria-label="Return to top"
      @click="scrollToTop"
      style="
        width: 2.125rem;
        height: 2.125rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #080808;
        border: 1px solid #363636;
        border-radius: 999px;
        color: #4a9eff;
        cursor: pointer;
        transition:
          transform 0.2s ease,
          background 0.2s ease;
      "
      onmouseover="
        this.style.background = '#111';
        this.style.transform = 'translateY(-2px)';
      "
      onmouseout="
        this.style.background = '#080808';
        this.style.transform = 'translateY(0)';
      "
    >
      <component :is="TopIcon" style="width: 16px; height: 16px" />
    </button>
  </gen-badge>
</template>
