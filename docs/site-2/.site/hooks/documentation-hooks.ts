import { defineComponent } from 'vue'
import './accent-text'
import './click-particles'
import './inline-image-preview'

export const menuTemplates = {
  'mega.cards': { layout: 'cards' },
  'mega.columns': { layout: 'columns' },
  'mega.featured': { layout: 'featured' },
  'mega.events': { layout: 'events' },
  'mega.background': { layout: 'background' },
  'mega.background-icon': { layout: 'background' },
} as const

export const menuTemplateComponent = 'MegaMenu'

export const DocumentationNotice = defineComponent({
  name: 'DocumentationNotice',
  setup: () => () => null,
})

export const DocumentationLastModified = defineComponent({
  name: 'DocumentationLastModified',
  setup: () => () => null,
})
