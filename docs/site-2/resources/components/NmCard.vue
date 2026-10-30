<template>
  <article class="nm-card">
    <div v-if="icon" class="nm-card__icon" aria-hidden="true">{{ iconGlyph }}</div>
    <div class="nm-card__body">
      <h3 v-if="$slots.heading || title" class="nm-card__title"><slot name="heading">{{ title }}</slot></h3>
      <p v-if="$slots.description || description" class="nm-card__description"><slot name="description">{{ description }}</slot></p>
      <slot />
    </div>
  </article>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ title: String, description: String, icon: String, color: String })
const iconGlyph = computed(() => props.icon?.replace(/^heroicon-[os]-/, '').replaceAll('-', ' ') ?? '')
</script>
