<template>
  <div class="nm-triptych" role="img" :aria-label="alt || 'Numerimondes technology and consulting'">
    <span>Strategy</span><span>Engineering</span><span>Operations</span>
  </div>
</template>
<script setup>
defineProps({ alt: String })
</script>
