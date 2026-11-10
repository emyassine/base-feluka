<template>
  <div class="base-tabs">
    <div class="base-tabs__nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="base-tabs__btn"
        :class="{ active: tab.id === activeId }"
        type="button"
        @click="setActive(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="base-tabs__panel">
      <slot :active="activeId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

defineOptions({ name: 'BaseTabs' });

type Tab = { id: string; label: string };

type Props = {
  tabs: Tab[];
  modelValue?: string;
};

const props = defineProps<Props>();
const emit = defineEmits<{ 'update:modelValue': [string] }>();

const activeId = ref(props.modelValue || props.tabs[0]?.id);

watch(
  () => props.modelValue,
  value => {
    if (value) activeId.value = value;
  }
);

function setActive(id: string) {
  activeId.value = id;
  emit('update:modelValue', id);
}
</script>

<style scoped>
.base-tabs {
  display: grid;
  gap: 12px;
}

.base-tabs__nav {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.base-tabs__btn {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(15, 22, 30, 0.65);
  color: #9fb2c7;
  border-radius: 10px;
  padding: 8px 14px;
  cursor: pointer;
}

.base-tabs__btn.active {
  background: rgba(240, 97, 42, 0.2);
  color: #ffb08a;
  border-color: rgba(240, 97, 42, 0.35);
}

.base-tabs__panel {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
  background: rgba(12, 17, 23, 0.6);
}
</style>
