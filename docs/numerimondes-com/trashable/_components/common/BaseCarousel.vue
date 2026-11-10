<template>
  <div class="base-carousel">
    <div class="base-carousel__track" ref="track">
      <slot />
    </div>
    <div class="base-carousel__controls" v-if="showControls">
      <button class="base-carousel__btn" type="button" @click="scrollPrev">Prev</button>
      <button class="base-carousel__btn" type="button" @click="scrollNext">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineOptions({ name: 'BaseCarousel' });

type Props = {
  showControls?: boolean;
  snap?: boolean;
};

withDefaults(defineProps<Props>(), {
  showControls: true,
  snap: true,
});

const track = ref<HTMLDivElement | null>(null);

function scrollNext() {
  if (!track.value) return;
  track.value.scrollBy({ left: track.value.clientWidth * 0.9, behavior: 'smooth' });
}

function scrollPrev() {
  if (!track.value) return;
  track.value.scrollBy({ left: -track.value.clientWidth * 0.9, behavior: 'smooth' });
}
</script>

<style scoped>
.base-carousel {
  display: grid;
  gap: 14px;
}

.base-carousel__track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(220px, 1fr);
  gap: 16px;
  overflow-x: auto;
  padding-bottom: 10px;
  scroll-snap-type: x mandatory;
}

.base-carousel__track ::v-deep(*) {
  scroll-snap-align: start;
}

.base-carousel__controls {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.base-carousel__btn {
  background: rgba(15, 22, 30, 0.7);
  color: #e8eef6;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 6px 12px;
  cursor: pointer;
}
</style>
