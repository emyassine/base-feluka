<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title: string
  closeLabel?: string
  fixedHeader?: boolean
  fixedFooter?: boolean
}>(), {
  closeLabel: 'Close dialog',
  fixedHeader: false,
  fixedFooter: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const dialog = ref<HTMLDialogElement | null>(null)

function syncDialog(isOpen: boolean) {
  const element = dialog.value
  if (!element) return
  if (isOpen && !element.open) element.showModal()
  if (!isOpen && element.open) element.close()
}

function close() {
  if (dialog.value?.open) dialog.value.close()
  else emit('update:modelValue', false)
}

function onClose() {
  emit('update:modelValue', false)
  emit('close')
}

function onBackdropClick(event: MouseEvent) {
  if (event.target === dialog.value) close()
}

watch(() => props.modelValue, syncDialog, { flush: 'post' })
onMounted(() => syncDialog(props.modelValue))
onBeforeUnmount(() => {
  if (dialog.value?.open) dialog.value.close()
})
</script>

<template>
  <dialog
    ref="dialog"
    class="reusable-modal"
    :class="{
      'reusable-modal--fixed-header': fixedHeader,
      'reusable-modal--fixed-footer': fixedFooter,
    }"
    :aria-label="title"
    @click="onBackdropClick"
    @close="onClose"
  >
    <div class="reusable-modal__panel">
      <header v-if="title || $slots.header" class="reusable-modal__header">
        <slot name="header">
          <h2 class="reusable-modal__title">{{ title }}</h2>
        </slot>
        <button class="reusable-modal__close" type="button" :aria-label="closeLabel" @click="close">×</button>
      </header>
      <section class="reusable-modal__body">
        <slot />
      </section>
      <footer v-if="$slots.footer" class="reusable-modal__footer">
        <slot name="footer" />
      </footer>
    </div>
  </dialog>
</template>

<style scoped>
.reusable-modal {
  width: min(34rem, calc(100vw - 2rem));
  max-width: none;
  max-height: min(42rem, calc(100dvh - 2rem));
  padding: 0;
  overflow: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 1rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: 0 1.5rem 5rem rgb(0 0 0 / 24%);
}

.reusable-modal::backdrop { background: rgb(10 16 27 / 62%); backdrop-filter: blur(3px); }
.reusable-modal__panel { display: flex; min-height: 0; flex-direction: column; }
.reusable-modal__header, .reusable-modal__footer { z-index: 1; display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; background: var(--vp-c-bg); }
.reusable-modal--fixed-header .reusable-modal__header { position: sticky; top: 0; border-bottom: 1px solid var(--vp-c-divider); }
.reusable-modal--fixed-footer .reusable-modal__footer { position: sticky; bottom: 0; border-top: 1px solid var(--vp-c-divider); }
.reusable-modal__title { margin: 0; color: inherit; font-size: 1.15rem; line-height: 1.35; }
.reusable-modal__close { display: grid; width: 2.25rem; height: 2.25rem; flex: 0 0 auto; place-items: center; margin-left: auto; border: 1px solid var(--vp-c-divider); border-radius: 999px; background: transparent; color: inherit; font: inherit; font-size: 1.4rem; line-height: 1; cursor: pointer; }
.reusable-modal__body { padding: 1.25rem; }
.reusable-modal__footer { justify-content: flex-end; flex-wrap: wrap; }

@media (prefers-reduced-motion: no-preference) {
  .reusable-modal[open] { animation: reusable-modal-in 140ms ease-out; }
  @keyframes reusable-modal-in { from { opacity: 0; transform: translateY(.35rem) scale(.99); } to { opacity: 1; transform: none; } }
}
</style>
