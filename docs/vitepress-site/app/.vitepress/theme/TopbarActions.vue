<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useData } from 'vitepress'
import siteContent from '@generated/site-content.json'

type TextValue = string | Record<string, string>
type TopbarAction = {
  label: TextValue
  link: string | Record<string, string>
  color?: 'primary' | 'gray' | 'info' | 'success' | 'warning' | 'danger' | 'dark' | 'secondary'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  outlined?: boolean
  external?: boolean
  mobile?: { color?: 'primary' | 'gray' | 'info' | 'success' | 'warning' | 'danger' | 'dark' | 'secondary'; icon?: string; tooltip?: string }
}

const { lang } = useData()
const actions = (siteContent as typeof siteContent & { topbarActions?: TopbarAction[] }).topbarActions ?? []
const isMobile = ref(false)
let mobileViewport: MediaQueryList | undefined
const updateViewport = () => { isMobile.value = mobileViewport?.matches ?? false }
onMounted(() => {
  mobileViewport = window.matchMedia('(max-width: 767px)')
  updateViewport()
  mobileViewport.addEventListener('change', updateViewport)
})
onUnmounted(() => mobileViewport?.removeEventListener('change', updateViewport))
const language = computed(() => lang.value.toLowerCase().split('-')[0])
const localized = (value: TextValue) => typeof value === 'string'
  ? value
  : value[language.value] ?? value.en ?? Object.values(value)[0] ?? ''
const href = (action: TopbarAction) => typeof action.link === 'string'
  ? action.link
  : action.link[language.value] ?? action.link.en ?? Object.values(action.link)[0] ?? '/'

const isExternal = (action: TopbarAction) => action.external ?? /^(?:https?:)?\/\//i.test(href(action))
</script>

<template>
  <template v-for="(action, index) in actions" :key="`${href(action)}-${index}`">
    <FeluqaButton
      v-if="!isMobile || !action.mobile"
      tag="a"
      :href="href(action)"
      :label="localized(action.label)"
      :color="action.color ?? 'primary'"
      :size="action.size ?? 'sm'"
      :outlined="action.outlined ?? false"
      :target="isExternal(action) ? '_blank' : undefined"
      :rel="isExternal(action) ? 'noopener noreferrer' : undefined"
      :style="{ marginInlineStart: '0.75rem' }"
    />
    <div v-else class="VPNavBarSearch search">
      <div>
        <a
          class="DocSearch DocSearch-Button"
          :href="href(action)"
          :title="action.mobile.tooltip"
          :aria-label="action.mobile.tooltip ?? localized(action.label)"
          :target="isExternal(action) ? '_blank' : undefined"
          :rel="isExternal(action) ? 'noopener noreferrer' : undefined"
        >
          <span class="DocSearch-Button-Container">
            <span
              class="vp-icon DocSearch-Search-Icon"
              :style="{ '--icon': `url('${action.mobile.icon ?? ''}')` }"
              aria-hidden="true"
            />
          </span>
        </a>
      </div>
    </div>
  </template>
</template>
