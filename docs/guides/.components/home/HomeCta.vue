<script setup lang="ts">
import HomeStatus from './HomeStatus.vue'
import './home.css'

interface LegendItem {
  tone: 'implemented' | 'partial' | 'target' | 'exploring'
  label: string
  description: string
}

withDefaults(
  defineProps<{
    kicker: string
    title: string[]
    accentIndex?: number
    copy: string
    primaryLabel: string
    primaryHref: string
    secondaryLabel?: string
    secondaryHref?: string
    legend?: LegendItem[]
    note?: string
  }>(),
  {
    accentIndex: 1,
    legend: () => [],
  },
)
</script>

<template>
  <section class="fh-section fh-cta" aria-labelledby="fh-cta-title">
    <div class="fh-container">
      <div class="fh-cta__card">
        <div class="fh-cta__inner">
          <p class="fh-kicker fh-kicker--onDark">{{ kicker }}</p>
          <h2 id="fh-cta-title" class="fh-display fh-display--cta">
            <span
              v-for="(line, index) in title"
              :key="line"
              class="fh-display__line"
              :class="{ 'fh-accent': index === accentIndex }"
            >{{ line }}</span>
          </h2>
          <p class="fh-cta__copy">{{ copy }}</p>

          <div class="fh-actions">
            <a class="fh-button fh-button--primary" :href="primaryHref">
              {{ primaryLabel }}
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </a>
            <a v-if="secondaryLabel && secondaryHref" class="fh-button fh-button--onDark" :href="secondaryHref">
              {{ secondaryLabel }}
            </a>
          </div>

          <dl v-if="legend.length" class="fh-legend">
            <div v-for="entry in legend" :key="entry.label" class="fh-legend__item">
              <dt><HomeStatus :tone="entry.tone" :label="entry.label" /></dt>
              <dd>{{ entry.description }}</dd>
            </div>
          </dl>

          <p v-if="note" class="fh-cta__note">{{ note }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
