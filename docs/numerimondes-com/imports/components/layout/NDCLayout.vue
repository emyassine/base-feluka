<template>
  <div class="home-no-doc">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  requestAnimationFrame(() => {
    const home = document.querySelector('.VPHome');
    if (!home) return;

    const doc = home.querySelector('.vp-doc');
    if (!doc) return;

    // remove vp-doc wrapper but keep its children
    const parent = doc.parentNode;
    while (doc.firstChild) {
      parent?.insertBefore(doc.firstChild, doc);
    }
    doc.remove();
  });
});
</script>

<style scoped>
.home-no-doc {
  width: 100%;
}
</style>
