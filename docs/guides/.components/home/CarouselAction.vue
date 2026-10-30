<script setup lang="ts">
defineProps<{ href: string; label: string }>();
</script>

<template>
  <a :href="href" class="carousel-action">
    {{ label }}
    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10" /></svg>
  </a>
</template>

<style scoped>
.carousel-action { display:inline-flex; min-height:2.75rem; align-items:center; justify-content:center; gap:.5rem; border:1px solid rgb(255 255 255 / .3); border-radius:9999px; background:rgb(0 0 0 / .58); padding:.75rem 1.75rem; color:white; font-size:.875rem; font-weight:600; text-decoration:none; box-shadow:0 12px 24px rgb(0 0 0 / .25); backdrop-filter:blur(12px); transition:background-color .2s; }
.carousel-action:hover { background:rgb(0 0 0 / .78); }
</style>
