<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'
import { useData } from 'vitepress'
import siteContent from '@generated/site-content.json'

type TextValue = string | Record<string, string>
type TopbarActionItem = {
  label: TextValue
  link: string | Record<string, string>
  icon?: string
  external?: boolean
  target?: string
  rel?: string
}

type TopbarAction = {
  label: TextValue
  link?: string | Record<string, string>
  color?: 'primary' | 'gray' | 'info' | 'success' | 'warning' | 'danger' | 'dark' | 'secondary'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  outlined?: boolean
  external?: boolean
  icon?: string
  mobile?: {
    color?: 'primary' | 'gray' | 'info' | 'success' | 'warning' | 'danger' | 'dark' | 'secondary'
    icon?: string
    tooltip?: string
  }
  items?: TopbarActionItem[]
}

const props = withDefaults(defineProps<{
  mode?: 'navbar' | 'screen' | 'all'
}>(), {
  mode: 'all',
})

const { lang } = useData()
const closeScreen = inject<() => void>('close-screen', () => {})
const actions = (siteContent as typeof siteContent & { topbarActions?: TopbarAction[] }).topbarActions ?? []

const isCompact = ref(false)
const hasMoreMenu = ref(false)
let compactViewport: MediaQueryList | undefined

const activeDropdown = ref<number | null>(null)
const dropdownRoot = ref<HTMLElement | null>(null)
const mobileOpenState = ref<Record<number, boolean>>({})

// Initialize mobile groups as open by default so links are easily accessible
for (let i = 0; i < actions.length; i++) {
  mobileOpenState.value[i] = true
}

const updateCompact = () => { isCompact.value = compactViewport?.matches ?? false }

function toggleDropdown(index: number) {
  activeDropdown.value = activeDropdown.value === index ? null : index
}

function closeDropdowns() {
  activeDropdown.value = null
}

function toggleMobileAction(index: number) {
  mobileOpenState.value[index] = !mobileOpenState.value[index]
}

function onDocumentClick(event: MouseEvent) {
  if (dropdownRoot.value && !dropdownRoot.value.contains(event.target as Node)) {
    closeDropdowns()
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closeDropdowns()
}

onMounted(() => {
  hasMoreMenu.value = Boolean(document.querySelector('.VPNavBarExtra .VPMenu'))
  compactViewport = window.matchMedia('(max-width: 1279px)')
  compactViewport.addEventListener('change', updateCompact)
  updateCompact()

  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  compactViewport?.removeEventListener('change', updateCompact)
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})

const language = computed(() => lang.value.toLowerCase().split('-')[0])
const localized = (value: TextValue | undefined) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[language.value] ?? value.en ?? Object.values(value)[0] ?? ''
}

const href = (item: { link?: string | Record<string, string> }) => {
  if (!item.link) return '/'
  if (typeof item.link === 'string') return item.link
  return item.link[language.value] ?? item.link.en ?? Object.values(item.link)[0] ?? '/'
}

const isExternal = (item: { external?: boolean; link?: string | Record<string, string> }) => {
  return item.external ?? /^(?:https?:)?\/\//i.test(href(item))
}

function onMobileLinkClick() {
  closeScreen?.()
}

function iconMask(iconUrl?: string) {
  if (!iconUrl) return {}
  return {
    maskImage: `url('${iconUrl}')`,
    WebkitMaskImage: `url('${iconUrl}')`,
  }
}
</script>

<template>
  <!-- Desktop & Tablet Topbar View -->
  <div v-if="mode !== 'screen'" ref="dropdownRoot" class="topbar-actions">
    <template v-for="(action, index) in actions" :key="`desktop-action-${index}`">
      <!-- Dropdown button -->
      <div
        v-if="action.items && action.items.length"
        class="topbar-action-dropdown"
        @mouseenter="activeDropdown = index"
        @mouseleave="activeDropdown = null"
      >
        <FeluqaButton
          tag="button"
          type="button"
          :tooltip="isCompact ? action.mobile?.tooltip ?? localized(action.label) : undefined"
          :icon="isCompact ? action.mobile?.icon ?? action.icon : action.icon"
          class="topbar-action-button"
          :color="isCompact ? action.mobile?.color ?? action.color ?? 'primary' : action.color ?? 'primary'"
          :size="isCompact ? 'xs' : action.size ?? 'sm'"
          :outlined="action.outlined ?? false"
          :aria-expanded="activeDropdown === index"
          :aria-haspopup="true"
          @click.stop="toggleDropdown(index)"
        >
          <template #default>
            <span v-if="!isCompact">{{ localized(action.label) }}</span>
            <span class="topbar-action-caret" :class="{ 'is-open': activeDropdown === index }" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="13" height="13">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </template>
        </FeluqaButton>

        <div
          v-show="activeDropdown === index"
          class="topbar-action-dropdown-menu VPMenu"
          role="menu"
        >
          <a
            v-for="(subItem, subIndex) in action.items"
            :key="`desktop-sub-${subIndex}`"
            :href="href(subItem)"
            :target="isExternal(subItem) ? '_blank' : undefined"
            :rel="isExternal(subItem) ? 'noopener noreferrer' : undefined"
            class="topbar-dropdown-item"
            role="menuitem"
            @click="closeDropdowns"
          >
            <span
              v-if="subItem.icon"
              class="topbar-item-icon"
              :style="iconMask(subItem.icon)"
              aria-hidden="true"
            />
            <span class="topbar-item-text">{{ localized(subItem.label) }}</span>
          </a>
        </div>
      </div>

      <!-- Single link button -->
      <FeluqaButton
        v-else
        tag="a"
        :href="href(action)"
        :tooltip="isCompact ? action.mobile?.tooltip ?? localized(action.label) : undefined"
        :icon="isCompact ? action.mobile?.icon ?? action.icon : action.icon"
        class="topbar-action-button"
        :color="isCompact ? action.mobile?.color ?? action.color ?? 'primary' : action.color ?? 'primary'"
        :size="isCompact ? 'xs' : action.size ?? 'sm'"
        :outlined="action.outlined ?? false"
        :target="isExternal(action) ? '_blank' : undefined"
        :rel="isExternal(action) ? 'noopener noreferrer' : undefined"
        :aria-label="localized(action.label)"
      >
        <template #default><span v-if="!isCompact">{{ localized(action.label) }}</span></template>
      </FeluqaButton>
    </template>
  </div>

  <!-- Teleport to .VPNavBarExtra .VPMenu (Tablet overflow) -->
  <Teleport v-if="mode !== 'screen' && hasMoreMenu && actions.length" defer to=".VPNavBarExtra .VPMenu">
    <div
      v-for="(action, index) in actions"
      :key="`more-${index}`"
      class="group topbar-action-menu"
    >
      <template v-if="action.items && action.items.length">
        <p class="topbar-action-extra-title">
          <span
            v-if="action.icon"
            class="topbar-item-icon"
            :style="iconMask(action.icon)"
            aria-hidden="true"
          />
          <span>{{ localized(action.label) }}</span>
        </p>
        <a
          v-for="(subItem, subIndex) in action.items"
          :key="`more-sub-${subIndex}`"
          :href="href(subItem)"
          :target="isExternal(subItem) ? '_blank' : undefined"
          :rel="isExternal(subItem) ? 'noopener noreferrer' : undefined"
          class="topbar-action-extra-link"
        >
          <span
            v-if="subItem.icon"
            class="topbar-item-icon"
            :style="iconMask(subItem.icon)"
            aria-hidden="true"
          />
          <span>{{ localized(subItem.label) }}</span>
        </a>
      </template>
      <template v-else>
        <FeluqaButton
          tag="a"
          :href="href(action)"
          :aria-label="localized(action.label)"
          :icon="action.icon"
          :size="'xs'"
          :color="action.color ?? 'primary'"
          :outlined="action.outlined ?? false"
          :target="isExternal(action) ? '_blank' : undefined"
          :rel="isExternal(action) ? 'noopener noreferrer' : undefined"
        >
          {{ localized(action.label) }}
        </FeluqaButton>
      </template>
    </div>
  </Teleport>

  <!-- Mobile Screen Drawer View (Inside VPNavScreen) -->
  <div v-if="mode !== 'navbar' && actions.length" class="topbar-actions-screen">
    <template v-for="(action, index) in actions" :key="`screen-action-${index}`">
      <!-- Dropdown action in mobile drawer -->
      <div v-if="action.items && action.items.length" class="screen-action-group">
        <button
          type="button"
          class="screen-action-trigger"
          :class="{ 'is-open': mobileOpenState[index] }"
          :aria-expanded="mobileOpenState[index]"
          @click="toggleMobileAction(index)"
        >
          <span class="screen-action-title">
            <span
              v-if="action.mobile?.icon ?? action.icon"
              class="topbar-item-icon"
              :style="iconMask(action.mobile?.icon ?? action.icon)"
              aria-hidden="true"
            />
            <span>{{ localized(action.label) }}</span>
          </span>
          <span class="screen-action-caret" :class="{ 'is-open': mobileOpenState[index] }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="16" height="16">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
        </button>
        <div v-show="mobileOpenState[index]" class="screen-action-items">
          <a
            v-for="(subItem, subIndex) in action.items"
            :key="`screen-sub-${subIndex}`"
            :href="href(subItem)"
            :target="isExternal(subItem) ? '_blank' : undefined"
            :rel="isExternal(subItem) ? 'noopener noreferrer' : undefined"
            class="screen-action-link"
            @click="onMobileLinkClick"
          >
            <span
              v-if="subItem.icon"
              class="topbar-item-icon"
              :style="iconMask(subItem.icon)"
              aria-hidden="true"
            />
            <span>{{ localized(subItem.label) }}</span>
          </a>
        </div>
      </div>

      <!-- Single button action in mobile drawer -->
      <div v-else class="screen-single-action">
        <FeluqaButton
          tag="a"
          :href="href(action)"
          :icon="action.mobile?.icon ?? action.icon"
          :color="action.mobile?.color ?? action.color ?? 'primary'"
          :size="'sm'"
          :outlined="action.outlined ?? false"
          :target="isExternal(action) ? '_blank' : undefined"
          :rel="isExternal(action) ? 'noopener noreferrer' : undefined"
          class="screen-single-btn"
          @click="onMobileLinkClick"
        >
          {{ localized(action.label) }}
        </FeluqaButton>
      </div>
    </template>
  </div>
</template>

<style scoped>
.topbar-actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: .5rem;
}

.topbar-actions:has(> .topbar-currency, > .topbar-action-button, > .topbar-action-dropdown)::before {
  width: 1px;
  height: 24px;
  flex: 0 0 1px;
  margin-inline: 16px 0;
  background: var(--vp-c-divider);
  content: '';
}

.topbar-actions > .topbar-action-button,
.topbar-actions > .topbar-action-dropdown {
  margin-inline-start: .5rem;
}

.topbar-action-menu {
  display: none;
}

.topbar-action-dropdown {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.topbar-action-caret {
  display: inline-flex;
  align-items: center;
  margin-inline-start: 4px;
  transition: transform 0.2s ease;
}

.topbar-action-caret.is-open {
  transform: rotate(180deg);
}

.topbar-action-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 100;
  min-width: 180px;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--radius-md);
  box-shadow: var(--vp-shadow-3);
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.topbar-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  font-family: var(--vp-font-family-body, inherit);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.015em;
  line-height: 1;
  color: var(--vp-c-text-1);
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.2s, color 0.2s;
}

.topbar-dropdown-item:hover {
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-brand-1);
}

.topbar-item-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: currentColor;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  flex-shrink: 0;
}

.topbar-action-extra-title {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  line-height: 28px;
  font-size: 11px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: .05em;
}

.topbar-action-extra-link {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 6px;
  padding: 0 12px;
  line-height: 32px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  text-decoration: none;
  transition: background-color .25s, color .25s;
}

.topbar-action-extra-link:hover {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-default-soft);
}

/* Mobile Screen Drawer */
.topbar-actions-screen {
  padding: 14px 0 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.screen-action-group {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  overflow: hidden;
}

.screen-action-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  background: transparent;
  border: 0;
  border-radius: var(--radius-md);
  font-family: var(--vp-font-family-body, inherit);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.015em;
  line-height: 1;
  color: var(--vp-c-text-1);
  cursor: pointer;
  text-align: left;
}

.screen-action-trigger:hover { background: var(--vp-c-bg-mute); }

.screen-action-trigger:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: -2px; }

.screen-action-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.screen-action-caret {
  display: flex;
  align-items: center;
  color: var(--vp-c-text-2);
  transition: transform 0.2s ease;
}

.screen-action-caret.is-open {
  transform: rotate(180deg);
}

.screen-action-items {
  padding: 4px 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-top: 1px solid var(--vp-c-divider);
}

.screen-action-link {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  font-family: var(--vp-font-family-body, inherit);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.015em;
  line-height: 1;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
}

.screen-action-link:hover {
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-brand-1);
}

.screen-single-btn {
  width: 100%;
  justify-content: center;
}

@media (max-width: 767px) {
  .topbar-actions::before {
    display: none;
  }
}

@media (min-width: 768px) and (max-width: 1099px) {
  .topbar-actions:not(:has(> .topbar-currency))::before {
    display: none;
  }
}
</style>
