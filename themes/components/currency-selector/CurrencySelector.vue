<script setup lang="ts">
defineProps<{
  modelValue: string
  options: Array<{ value: string; label?: string }>
  label: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <label class="currency-selector">
    <span>{{ label }}</span>
    <select
      :value="modelValue"
      :aria-label="label"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label ?? option.value }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.currency-selector { display: inline-flex; align-items: center; gap: .4rem; white-space: nowrap; }
.currency-selector select { min-height: 32px; padding-inline: .45rem; font: inherit; cursor: pointer; }
.currency-selector select:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
</style>
