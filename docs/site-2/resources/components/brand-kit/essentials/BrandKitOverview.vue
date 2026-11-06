<template>
  <section class="overview" aria-label="Overview">
    <article
      v-for="(section, sectionIndex) in overviewSections"
      :key="section.id || `overview-section-${sectionIndex}`"
      class="overview-section scroll-reveal"
      :class="{ 'overview-section--bordered': section.showBorder }"
      :style="{ gridTemplateColumns: section.columns.length === 1 ? 'minmax(0, 1fr)' : 'repeat(' + section.columns.length + ', minmax(0, 1fr))' }"
    >
      <div
        v-for="(column, columnIndex) in section.columns"
        :key="column.id || `overview-column-${sectionIndex}-${columnIndex}`"
        class="overview-column"
        :style="{ gridColumn: section.columns.length === 1 ? '1 / -1' : undefined }"
      >
        <p v-if="column.label" class="overview-label" :style="column.labelStyle" :class="column.labelClass" v-html="column.label"></p>
        <h2 v-if="column.title" :id="`brand-kit-overview-title-${sectionIndex}-${columnIndex}`" :style="column.titleStyle" :class="column.titleClass" v-html="column.title"></h2>
        <p v-if="column.tagline" class="overview-tagline" :style="column.taglineStyle" :class="column.taglineClass" v-html="column.tagline"></p>
        <p v-if="column.description" class="overview-description" :style="column.descriptionStyle" :class="column.descriptionClass" v-html="column.description"></p>
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
