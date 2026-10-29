import { defineComponent, h } from 'vue'
import { useData } from 'vitepress'

const strings = {
  en: {
    exploring: 'This page describes an area that is still being explored.',
    validated: 'The information on this page has been validated.',
    fallbackTitle: 'Language availability',
    lastModified: 'Last updated',
  },
  fr: {
    exploring: 'Cette page décrit un sujet encore à l’étude.',
    validated: 'Les informations de cette page ont été vérifiées.',
    fallbackTitle: 'Disponibilité linguistique',
    lastModified: 'Dernière mise à jour',
  },
} as const

function languageFor(value: unknown): 'en' | 'fr' {
  return String(value ?? 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en'
}

export const DocumentationNotice = defineComponent({
  name: 'DocumentationNotice',
  props: { notices: { type: Object, default: () => ({}) } },
  setup(props) {
    const { frontmatter, lang } = useData()
    return () => {
      const metadata = frontmatter.value as Record<string, unknown>
      const language = languageFor(metadata.requestedLanguage ?? lang.value)
      const messages = strings[language]
      const configured = (props.notices as Record<string, Record<string, string>>)[language] ?? {}
      const fallbackNotice = typeof metadata.languageFallbackNotice === 'string' ? metadata.languageFallbackNotice : ''
      const status = String(metadata.status ?? '').toLowerCase()
      const statusMessage = status === 'exploring'
        ? configured.exploring ?? messages.exploring
        : ['validated', 'verified', 'complete', 'completed'].includes(status)
          ? configured.validated ?? messages.validated
          : ''
      if (!fallbackNotice && !statusMessage) return null
      return h('div', { class: 'FeluqaDocumentationNotices', 'aria-live': 'polite' }, [
        fallbackNotice ? h('div', { class: 'FeluqaDocumentationNotices__fallback', role: 'note' }, [
          h('strong', configured.fallbackTitle ?? messages.fallbackTitle), h('p', fallbackNotice),
        ]) : null,
        statusMessage ? h('div', {
          class: ['FeluqaDocumentationNotices__status', status === 'exploring' ? 'is-exploring' : 'is-validated'],
          role: status === 'exploring' ? 'status' : 'note',
        }, statusMessage) : null,
      ])
    }
  },
})

export const DocumentationLastModified = defineComponent({
  name: 'DocumentationLastModified',
  setup() {
    const { frontmatter, lang } = useData()
    return () => {
      const value = frontmatter.value.lastmod ?? frontmatter.value.lastModified
      if (!value) return null
      const date = new Date(String(value))
      if (Number.isNaN(date.getTime())) return null
      const locale = languageFor(lang.value) === 'fr' ? 'fr-FR' : 'en-US'
      const label = languageFor(lang.value) === 'fr' ? strings.fr.lastModified : strings.en.lastModified
      return h('p', { class: 'FeluqaLastModified' }, [
        h('span', { 'aria-hidden': 'true' }, '◷'),
        `${label} : `,
        h('time', { datetime: date.toISOString() }, new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date)),
      ])
    }
  },
})

