<script setup lang="ts">
import './home.css'
import './editorial-template.css'

interface HeroAction {
  label: string
  href: string
}

interface HeroFact {
  label: string
  suffix?: string
}

withDefaults(
  defineProps<{
    eyebrow: string
    status?: string
    title: string[]
    accentIndex?: number
    lead: string
    actions: HeroAction[]
    facts?: HeroFact[]
  }>(),
  {
    status: '',
    accentIndex: 1,
    facts: () => [],
    windowLabel: '',
  },
)

const tiles = [
  [1, 1, 2, 1], [4, 2, 1, 2], [6, 1, 2, 1], [9, 2, 1, 2], [11, 1, 2, 1],
  [14, 2, 2, 1], [17, 1, 1, 2], [20, 2, 2, 1], [23, 1, 2, 1],
  [1, 5, 2, 1], [4, 4, 1, 2], [6, 6, 2, 1], [9, 5, 1, 2], [11, 6, 2, 1],
  [14, 5, 2, 1], [17, 6, 1, 2], [20, 4, 2, 1], [23, 6, 2, 1],
]
</script>

<template>
  <section class="fh-hero" aria-labelledby="fh-hero-title">
    <div class="fh-hero__grid" aria-hidden="true">
      <span
        v-for="([column, row, width, height], index) in tiles"
        :key="index"
        :style="{ gridColumn: `${column} / span ${width}`, gridRow: `${row} / span ${height}` }"
      />
    </div>
    <div class="fh-container fh-hero__content">
      <div class="fh-hero__panel">
      <div class="fh-hero__meta">
        <p class="fh-eyebrow">
          <span class="fh-eyebrow__dot" aria-hidden="true"></span>
          {{ eyebrow }}
        </p>
        <p v-if="status" class="fh-hero__state">{{ status }}</p>
      </div>

      <h1 id="fh-hero-title" class="fh-display">
        <span
          v-for="(line, index) in title"
          :key="line"
          :class="`fh-display__line${index === accentIndex ? ' fh-accent' : ''}`"
        >{{ line }}</span>
      </h1>

      <div class="fh-hero__row">
        <p class="fh-lead">{{ lead }}</p>
        <div class="fh-actions">
          <a
            v-for="(action, index) in actions"
            :key="action.label"
            class="fh-button"
            :class="{ 'fh-button--primary': index === 0 }"
            :href="action.href"
          >
            {{ action.label }}
            <svg v-if="index === 0" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M3 8h9M8.5 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      <ul v-if="facts.length" class="fh-facts">
        <li v-for="fact in facts" :key="fact.label">
          {{ fact.label }}
          <span v-if="fact.suffix" class="fh-facts__tag">{{ fact.suffix }}</span>
        </li>
      </ul>
      </div>
    </div>

  </section>
</template>
