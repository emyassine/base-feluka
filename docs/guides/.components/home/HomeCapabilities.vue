<script setup lang="ts">
import HomeStatus from './HomeStatus.vue'
import './home.css'

interface CapabilityItem {
  index: string
  title: string
  description: string
  tone: 'implemented' | 'partial' | 'target' | 'exploring'
  status: string
  tags: string[]
}

defineProps<{
  kicker: string
  title: string
  copy?: string
  image: string
  imageAlt: string
  imageCaption?: string
  imageWidth?: number
  imageHeight?: number
  items: CapabilityItem[]
}>()
</script>

<template>
  <section class="fh-section fh-capabilities" aria-labelledby="fh-capabilities-title">
    <div class="fh-container">
      <header class="fh-head">
        <p class="fh-kicker">{{ kicker }}</p>
        <h2 id="fh-capabilities-title" class="fh-heading">{{ title }}</h2>
        <p v-if="copy" class="fh-head__copy">{{ copy }}</p>
      </header>

      <div class="fh-capabilities__body">
        <figure class="fh-figure">
          <img
            :src="image"
            :alt="imageAlt"
            :width="imageWidth ?? 1200"
            :height="imageHeight ?? 1100"
            loading="lazy"
            decoding="async"
          />
          <figcaption v-if="imageCaption" class="fh-figure__caption">{{ imageCaption }}</figcaption>
        </figure>

        <ol class="fh-index">
          <li v-for="item in items" :key="item.index" class="fh-index__row">
            <span class="fh-index__number" aria-hidden="true">{{ item.index }}</span>
            <div class="fh-index__content">
              <div class="fh-index__top">
                <h3 class="fh-index__title">{{ item.title }}</h3>
                <HomeStatus :tone="item.tone" :label="item.status" />
              </div>
              <p class="fh-index__copy">{{ item.description }}</p>
              <ul v-if="item.tags.length" class="fh-tags" :aria-label="item.title">
                <li v-for="tag in item.tags" :key="tag">{{ tag }}</li>
              </ul>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
