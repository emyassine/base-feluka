<script setup lang="ts">
import './home.css'

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
    image: string
    imageAlt: string
    imageCaption?: string
    imageWidth?: number
    imageHeight?: number
    windowLabel?: string
  }>(),
  {
    status: '',
    accentIndex: 1,
    facts: () => [],
    imageWidth: 1600,
    imageHeight: 900,
    windowLabel: '',
  },
)
</script>

<template>
  <section class="fh-hero" aria-labelledby="fh-hero-title">
    <div class="fh-container">
      <div class="fh-hero__meta">
        <p class="fh-eyebrow">
          <span class="fh-eyebrow__dot" aria-hidden="true"></span>
          <VbShinyText
            :text="eyebrow"
            color="var(--fh-muted)"
            shine-color="var(--fh-accent)"
            :speed="6"
            :spread="100"
          />
        </p>
        <p v-if="status" class="fh-hero__state">{{ status }}</p>
      </div>

      <h1 id="fh-hero-title" class="fh-display">
        <VbBlurText
          v-for="(line, index) in title"
          :key="line"
          as="span"
          :text="line"
          :class-name="`fh-display__line${index === accentIndex ? ' fh-accent' : ''}`"
          :delay="60"
          :step-duration="0.5"
          animate-by="words"
        />
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

    <div class="fh-container fh-hero__stage">
      <VbGlareHover
        width="100%"
        height="auto"
        background="transparent"
        border-color="transparent"
        border-radius="16px"
        glare-color="#ffffff"
        :glare-opacity="0.14"
        :glare-size="170"
        :transition-duration="900"
      >
        <figure class="fh-shot">
          <div class="fh-shot__bar" aria-hidden="true">
            <span class="fh-shot__dots"><i></i><i></i><i></i></span>
            <span v-if="windowLabel" class="fh-shot__url">{{ windowLabel }}</span>
          </div>
          <img
            :src="image"
            :alt="imageAlt"
            :width="imageWidth"
            :height="imageHeight"
            fetchpriority="high"
            decoding="async"
          />
          <figcaption v-if="imageCaption" class="fh-shot__caption">{{ imageCaption }}</figcaption>
        </figure>
      </VbGlareHover>
    </div>
  </section>
</template>
