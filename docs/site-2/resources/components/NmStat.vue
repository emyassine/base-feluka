<template>
  <div class="nm-stat">
    <span class="nm-stat__label">{{ label }}</span>
    <strong class="nm-stat__value">{{ value }}</strong>
    <span v-if="description" class="nm-stat__description">{{ description }}</span>
  </div>
</template>
<script setup>
defineProps({ label: String, value: String, description: String, color: String, icon: String })
</script>
