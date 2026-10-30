<template>
  <div class="docs-home">
    <div class="docs-home__top"><slot name="top" /></div>
    <slot name="middle" />
    <div class="docs-home__bottom"><slot name="bottom" /></div>
    <slot name="footer" />
  </div>
</template>
