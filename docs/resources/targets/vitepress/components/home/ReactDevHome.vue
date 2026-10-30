<script setup lang="ts">
</script>

<template>
  <div class="react-home">
    <slot />
  </div>
</template>

<style>
.react-home {
  overflow-x: hidden;
  isolation: isolate;
  background: #fff;
  color: #404756;
  font-family: 'Optimistic Text', ui-sans-serif, system-ui, sans-serif;
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

html.dark .react-home { background: #1c1e21; color: #bfc3c9; }

.react-home img { max-width: none; }
.react-home a { cursor: pointer; }
</style>
