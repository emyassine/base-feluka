<template>
  <section class="brand-kit-overview" aria-label="Overview">
    <article
      v-for="(section, sectionIndex) in overviewSections"
      :key="section.id || `overview-section-${sectionIndex}`"
      class="brand-kit-overview__section"
      :class="{ 'brand-kit-overview__section--bordered': section.showBorder }"
      :style="{ gridTemplateColumns: section.columns.length === 1 ? 'minmax(0, 1fr)' : 'repeat(' + section.columns.length + ', minmax(0, 1fr))' }"
    >
      <div
        v-for="(column, columnIndex) in section.columns"
        :key="column.id || `overview-column-${sectionIndex}-${columnIndex}`"
        class="brand-kit-overview__column"
        :style="{ gridColumn: section.columns.length === 1 ? '1 / -1' : undefined }"
      >
        <p v-if="column.label" class="brand-kit-overview__label" :style="column.labelStyle" :class="column.labelClass" v-html="column.label"></p>
        <h2 v-if="column.title" :id="`brand-kit-overview-title-${sectionIndex}-${columnIndex}`" :style="column.titleStyle" :class="column.titleClass" v-html="column.title"></h2>
        <p v-if="column.tagline" class="brand-kit-overview__tagline" :style="column.taglineStyle" :class="column.taglineClass" v-html="column.tagline"></p>
        <p v-if="column.description" class="brand-kit-overview__description" :style="column.descriptionStyle" :class="column.descriptionClass" v-html="column.description"></p>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type OverviewColumn = {
  id?: string
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
}

type OverviewSection = {
  id?: string
  columns?: OverviewColumn[]
  showBorder?: boolean
} & OverviewColumn

type RenderedSection = {
  id?: string
  columns: OverviewColumn[]
  showBorder: boolean
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

const hasContent = (column: OverviewColumn) => Boolean(
  column.label || column.title || column.tagline || column.description,
)

const overviewSections = computed<RenderedSection[]>(() => {
  if (props.sections?.length) {
    return props.sections.map((section) => {
      const columns = section.columns
        ? section.columns.filter(hasContent)
        : [
            { label: section.label, labelStyle: section.labelStyle, labelClass: section.labelClass, title: section.title, titleStyle: section.titleStyle, titleClass: section.titleClass },
            { tagline: section.tagline, taglineStyle: section.taglineStyle, taglineClass: section.taglineClass, description: section.description, descriptionStyle: section.descriptionStyle, descriptionClass: section.descriptionClass },
          ].filter(hasContent)

      return {
        id: section.id,
        columns,
        showBorder: section.showBorder ?? props.showBorder,
      }
    }).filter((section) => section.columns.length > 0)
  }

  const legacyColumns = [
    { label: props.label, labelStyle: props.labelStyle, labelClass: props.labelClass, title: props.title, titleStyle: props.titleStyle, titleClass: props.titleClass },
    { tagline: props.tagline, taglineStyle: props.taglineStyle, taglineClass: props.taglineClass, description: props.description, descriptionStyle: props.descriptionStyle, descriptionClass: props.descriptionClass },
  ].filter(hasContent)

  return legacyColumns.length
    ? [{ columns: legacyColumns, showBorder: props.showBorder }]
    : []
})
</script>

<style scoped>
.brand-kit-overview {
  margin: 0;
}

.brand-kit-overview__section {
  display: grid;
  align-content: center;
  gap: clamp(2rem, 7cqw, 7rem);
  box-sizing: border-box;
  min-height: 100vh;
  min-height: 100svh;
  margin: 0;
  padding: clamp(3.5rem, 9cqw, 8rem) 0;
  animation: brand-kit-overview-scroll linear both;
  animation-duration: auto;
  animation-timeline: view(block);
  animation-range: cover 0% cover 50%;
}

.brand-kit-overview__section--bordered {
  border-bottom: 1px solid var(--brand-kit-line);
}

.brand-kit-overview__column {
  min-width: 0;
}

.brand-kit-overview__label {
  margin: 0;
  color: var(--brand-kit-muted);
  font-family: var(--vp-font-family-mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.brand-kit-overview__column h2 {
  margin: 0;
  padding-top: 0.7rem;
  font-size: clamp(2rem, 5.5cqw, 5rem);
  font-weight: 500;
  letter-spacing: -0.06em;
  line-height: 0.95;
  overflow-wrap: anywhere;
}

.brand-kit-overview__column > p:not(.brand-kit-overview__label) {
  max-width: 60ch;
  margin: 1rem 0 0;
  color: var(--brand-kit-muted);
  font-size: clamp(0.95rem, 1.25cqw, 1.15rem);
  line-height: 1.7;
}

.brand-kit-overview__column > .brand-kit-overview__tagline {
  color: var(--brand-kit-text);
  font-size: clamp(1.35rem, 2.3cqw, 2rem);
  line-height: 1.15;
}

@container (max-width: 680px) {
  .brand-kit-overview__section {
    grid-template-columns: 1fr !important;
    gap: 1.5rem;
  }
}

@keyframes brand-kit-overview-scroll {
  from { transform: scale(0.75); }
  to { transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .brand-kit-overview__section {
    animation: none;
  }
}
</style>
