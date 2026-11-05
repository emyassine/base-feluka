<template>
  <section class="brand-kit-overview" aria-label="Overview">
    <article
      v-for="(section, index) in overviewSections"
      :key="section.id || `${section.label}-${index}`"
      class="brand-kit-overview__section"
      :class="{ 'brand-kit-overview__section--bordered': section.showBorder }"
      :aria-labelledby="`brand-kit-overview-title-${index}`"
    >
      <div>
        <p class="brand-kit-overview__label" :style="section.labelStyle" :class="section.labelClass" v-html="section.label"></p>
        <h2 :id="`brand-kit-overview-title-${index}`" :style="section.titleStyle" :class="section.titleClass" v-html="section.title"></h2>
      </div>
      <div class="brand-kit-overview__copy">
        <p class="brand-kit-overview__tagline" :style="section.taglineStyle" :class="section.taglineClass" v-html="section.tagline"></p>
        <p class="brand-kit-overview__description" :style="section.descriptionStyle" :class="section.descriptionClass" v-html="section.description"></p>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type OverviewSection = {
  id?: string
  label: string
  labelStyle?: string
  labelClass?: string
  title: string
  titleStyle?: string
  titleClass?: string
  tagline: string
  taglineStyle?: string
  taglineClass?: string
  description: string
  descriptionStyle?: string
  descriptionClass?: string
  showBorder?: boolean
}

const props = withDefaults(defineProps<{
  sections?: OverviewSection[]
  label?: string
  labelStyle?: string
  labelClass?: string
  title?: string
  titleStyle?: string
  titleClass?: string
  tagline?: string
  taglineStyle?: string
  taglineClass?: string
  description?: string
  descriptionStyle?: string
  descriptionClass?: string
  showBorder?: boolean
}>(), {
  showBorder: true,
})

const overviewSections = computed<OverviewSection[]>(() => {
  if (props.sections?.length) {
    return props.sections.map((section) => ({
      ...section,
      showBorder: section.showBorder ?? props.showBorder,
    }))
  }

  if (!props.label || !props.title || !props.tagline || !props.description) return []

  return [{
    label: props.label,
    labelStyle: props.labelStyle,
    labelClass: props.labelClass,
    title: props.title,
    titleStyle: props.titleStyle,
    titleClass: props.titleClass,
    tagline: props.tagline,
    taglineStyle: props.taglineStyle,
    taglineClass: props.taglineClass,
    description: props.description,
    descriptionStyle: props.descriptionStyle,
    descriptionClass: props.descriptionClass,
    showBorder: props.showBorder,
  }]
})
</script>

<style scoped>
.brand-kit-overview {
  margin: 0;
}

.brand-kit-overview__section {
  display: grid;
  grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
  gap: clamp(2rem, 7cqw, 7rem);
  margin: 0;
  padding: clamp(3.5rem, 9cqw, 8rem) 0;
}

.brand-kit-overview__section--bordered {
  border-bottom: 1px solid var(--brand-kit-line);
}

.brand-kit-overview__label {
  margin: 0;
  color: var(--brand-kit-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.brand-kit-overview h2 {
  margin-top: 0;
  padding-top: 0.7rem;
  font-size: clamp(2rem, 5.5cqw, 5rem);
  font-weight: 500;
  letter-spacing: -0.06em;
  line-height: 0.95;
  overflow-wrap: anywhere;
}

.brand-kit-overview__copy {
  display: grid;
  align-content: end;
  gap: 1rem;
}

.brand-kit-overview__copy p {
  max-width: 60ch;
  margin: 0;
  color: var(--brand-kit-muted);
  font-size: clamp(0.95rem, 1.25cqw, 1.15rem);
  line-height: 1.7;
}

.brand-kit-overview__copy .brand-kit-overview__tagline {
  color: var(--brand-kit-text);
  font-size: clamp(1.35rem, 2.3cqw, 2rem);
  line-height: 1.15;
}

@container (max-width: 680px) {
  .brand-kit-overview__section {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

</style>
