<script setup lang="ts">
import './home.css'

withDefaults(
  defineProps<{
    kicker: string
    title: string[]
    accentIndex?: number
    copy: string
    bullets?: string[]
    linkLabel?: string
    linkHref?: string
  }>(),
  {
    accentIndex: 1,
    bullets: () => [],
  },
)
</script>

<template>
  <section class="fh-section fh-local" aria-labelledby="fh-local-title">
    <div class="fh-container">
      <header class="fh-local__head">
        <div>
          <p class="fh-kicker">{{ kicker }}</p>
          <h2 id="fh-local-title" class="fh-display fh-display--section">
            <span
              v-for="(line, index) in title"
              :key="line"
              class="fh-display__line"
              :class="{ 'fh-accent': index === accentIndex }"
            >{{ line }}</span>
          </h2>
        </div>
        <div class="fh-local__aside">
          <p class="fh-local__copy">{{ copy }}</p>
          <ul v-if="bullets.length" class="fh-bullets">
            <li v-for="bullet in bullets" :key="bullet">{{ bullet }}</li>
          </ul>
        </div>
      </header>
    </div>

    <div class="fh-container fh-local__stage">
      <a v-if="linkLabel && linkHref" class="fh-link" :href="linkHref">
        {{ linkLabel }}
        <span aria-hidden="true">→</span>
      </a>
    </div>
  </section>
</template>
