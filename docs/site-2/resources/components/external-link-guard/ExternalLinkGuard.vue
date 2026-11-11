<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import ReusableModal from '../reusable-modal/ReusableModal.vue'

const { lang, frontmatter } = useData()
const open = ref(false)
const destination = ref('')
const destinationHost = ref('')
const opensNewTab = ref(false)

const copy = () => {
  const requested = String(frontmatter.value.requestedLanguage || lang.value || 'en').toLowerCase()
  if (requested.startsWith('fr')) {
    return {
      title: 'Vous quittez Numerimondes',
      message: 'Vous allez ouvrir un site externe. Il est géré séparément et peut appliquer ses propres règles de confidentialité et de sécurité.',
      host: 'Site de destination',
      stay: 'Rester sur ce site',
      continue: 'Continuer vers le site',
      close: 'Fermer la fenêtre de dialogue',
    }
  }
  return {
    title: 'You are leaving Numerimondes',
    message: 'You are about to open an external website. It is operated separately and may have its own privacy and security practices.',
    host: 'Destination website',
    stay: 'Stay on this site',
    continue: 'Continue to website',
    close: 'Close dialog',
  }
}

function onLinkActivation(event: MouseEvent) {
  if (event.defaultPrevented || event.altKey || (event.type === 'click' && event.button !== 0) || (event.type === 'auxclick' && event.button !== 1)) return
  if (!(event.target instanceof Element)) return

  const anchor = event.target.closest<HTMLAnchorElement>('a[href]')
  if (!anchor || anchor.hasAttribute('download') || anchor.dataset.externalConfirm === 'false') return

  let url: URL
  try {
    url = new URL(anchor.href, window.location.href)
  } catch {
    return
  }

  if (!['http:', 'https:'].includes(url.protocol) || url.origin === window.location.origin) return

  event.preventDefault()
  destination.value = url.href
  destinationHost.value = url.host
  opensNewTab.value = anchor.target.toLowerCase() === '_blank' || event.type === 'auxclick' || event.metaKey || event.ctrlKey || event.shiftKey
  open.value = true
}

function continueToDestination() {
  const url = destination.value
  if (!url) return

  open.value = false
  if (opensNewTab.value) window.open(url, '_blank', 'noopener,noreferrer')
  else window.location.assign(url)
}

onMounted(() => {
  document.addEventListener('click', onLinkActivation, true)
  document.addEventListener('auxclick', onLinkActivation, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onLinkActivation, true)
  document.removeEventListener('auxclick', onLinkActivation, true)
})
</script>

<template>
  <ReusableModal
    v-model="open"
    :title="copy().title"
    :close-label="copy().close"
    fixed-header
    fixed-footer
  >
    <p>{{ copy().message }}</p>
    <p class="external-link-guard__host"><strong>{{ copy().host }}:</strong> {{ destinationHost }}</p>
    <template #footer>
      <button class="external-link-guard__button external-link-guard__button--quiet" type="button" @click="open = false">{{ copy().stay }}</button>
      <button class="external-link-guard__button external-link-guard__button--primary" type="button" @click="continueToDestination">{{ copy().continue }}</button>
    </template>
  </ReusableModal>
</template>

<style scoped>
.external-link-guard__host { overflow-wrap: anywhere; }
.external-link-guard__button { min-height: 2.75rem; padding: .65rem 1rem; border: 1px solid var(--vp-c-divider); border-radius: .65rem; background: transparent; color: var(--vp-c-text-1); font: inherit; font-weight: 650; cursor: pointer; }
.external-link-guard__button:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
.external-link-guard__button--primary { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-1); color: var(--vp-c-white); }
</style>
