<script setup lang="ts">
import { computed } from 'vue'
import { localizeReactAssets } from './react-home-assets'
import hero from './react-blocks/hero.html?raw'
import components from './react-blocks/components.html?raw'
import markup from './react-blocks/markup.html?raw'
import interactivity from './react-blocks/interactivity.html?raw'
import framework from './react-blocks/framework.html?raw'
import platforms from './react-blocks/platforms.html?raw'
import updates from './react-blocks/updates.html?raw'
import community from './react-blocks/community.html?raw'

const blocks = { hero, components, markup, interactivity, framework, platforms, updates, community }
type BlockName = keyof typeof blocks

const props = defineProps<{
  block: BlockName
  title?: string
  lead?: string
  detail?: string
}>()

function escapeText(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
}

function replaceElementContent(html: string, tag: string, replacement: string, from = 0, last = false): string {
  const opening = `<${tag}`
  const start = last ? html.lastIndexOf(opening) : html.indexOf(opening, from)
  if (start < 0) return html
  const contentStart = html.indexOf('>', start) + 1
  const contentEnd = html.indexOf(`</${tag}>`, contentStart)
  if (contentStart === 0 || contentEnd < 0) return html
  const lines = escapeText(replacement).split('\n').join('<br />')
  return html.slice(0, contentStart) + lines + html.slice(contentEnd)
}

const html = computed(() => {
  let content = blocks[props.block]
  const heading = props.block === 'hero' ? 'h1' : 'h2'
  if (props.title !== undefined) content = replaceElementContent(content, heading, props.title)
  if (props.lead !== undefined) {
    const headingEnd = content.indexOf(`</${heading}>`)
    content = replaceElementContent(content, 'p', props.lead, headingEnd < 0 ? 0 : headingEnd + heading.length + 3)
  }
  if (props.detail !== undefined) content = replaceElementContent(content, 'p', props.detail, 0, true)
  return localizeReactAssets(content)
})
</script>

<template>
  <div class="react-home-block" v-html="html" />
</template>
