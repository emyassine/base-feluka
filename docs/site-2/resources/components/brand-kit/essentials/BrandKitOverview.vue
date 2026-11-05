<template>
  <section
    class="brand-kit-overview"
    :class="{ 'brand-kit-overview--bordered': props.showBorder }"
    aria-labelledby="brand-kit-overview-title"
  >
    <div>
      <p class="brand-kit-overview__label" :style="props.labelStyle" :class="props.labelClass" v-html="props.label"></p>
      <h2 id="brand-kit-overview-title" :style="props.titleStyle" :class="props.titleClass" v-html="props.title"></h2>
    </div>
    <div class="brand-kit-overview__copy">
      <p class="brand-kit-overview__tagline" :style="props.taglineStyle" :class="props.taglineClass" v-html="props.tagline"></p>
      <p class="brand-kit-overview__description" :style="props.descriptionStyle" :class="props.descriptionClass" v-html="props.description"></p>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
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
}>(), {
  showBorder: true,
})
</script>

<style scoped>
.brand-kit-overview {
  display: grid;
  grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
  gap: clamp(2rem, 7cqw, 7rem);
  margin: 0;
  padding: clamp(3.5rem, 9cqw, 8rem) 0;
}

.brand-kit-overview--bordered {
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
  margin: 1rem 0 0;
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
  .brand-kit-overview {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
