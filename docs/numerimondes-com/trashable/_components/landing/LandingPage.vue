<template>
  <div class="lp-wrapper">
    <div class="lp-container">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'LandingPage' });
</script>

<style scoped>
.lp-wrapper {
  width: 100%;
  margin: 0 auto;
}

.lp-container {
  margin-top: auto;
  padding-top: 64px;
}
</style>
