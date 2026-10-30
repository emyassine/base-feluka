<script setup lang="ts">
import './react-home.css'
</script>

<template>
  <div class="react-home font-text font-medium antialiased text-lg bg-wash dark:bg-wash-dark text-secondary dark:text-secondary-dark leading-base">
    <slot />
  </div>
</template>

<style>
.react-home {
  overflow-x: hidden;
  isolation: isolate;
  background: #fff;
  color: #404756;
  -webkit-font-smoothing: antialiased;
}

.react-home img { max-width: none; }
.react-home a { cursor: pointer; }
</style>
