<script setup lang="ts">
import registry from '../../.site/spmpst.images-attributions.json'

const images = registry.images
</script>

<template>
  <section aria-labelledby="image-attributions">
    <h2 id="image-attributions">Attributions</h2>
    <p>Credits for third-party images used across the site.</p>
    <ul>
      <li v-for="image in images" :key="image.path">
        <a :href="image.path"><strong>{{ image.title }}</strong></a>
        <span> — {{ image.creator }}. </span>
        <a :href="image.source" rel="noreferrer">Source</a>
        <span> · </span>
        <a :href="image.licenseUrl" rel="noreferrer">{{ image.license }}</a>
        <span v-if="image.changes"> · {{ image.changes }}</span>
      </li>
    </ul>
  </section>
</template>
