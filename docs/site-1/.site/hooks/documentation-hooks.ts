import { defineComponent, h, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData } from 'vitepress'

export const menuTemplates = {
  'mega.cards': { layout: 'cards' },
  'mega.columns': { layout: 'columns' },
  'mega.featured': { layout: 'featured' },
  'mega.events': { layout: 'events' },
  'mega.background': { layout: 'background' },
  'mega.background-icon': { layout: 'background' },
} as const

export const menuTemplateComponent = 'MegaMenu'

const strings = {
  en: {
    exploringTitle: 'Under exploration',
    exploring: 'This page presents ideas or proposals that are still under discussion and subject to change.',
    validatedTitle: 'Validated',
    validated: 'The information on this page has been verified and reflects the current state of the project.',
    fallbackTitle: 'Language availability',
    lastModified: 'Last updated',
    dismiss: 'Dismiss notice',
  },
  fr: {
    exploringTitle: "En cours d'exploration",
    exploring: "Cette page présente des idées ou des propositions encore à l'étude et susceptibles d'évoluer.",
    validatedTitle: 'Validé',
    validated: 'Les informations contenues sur cette page ont été vérifiées et reflètent l’état actuel du projet.',
    fallbackTitle: 'Disponibilité des langues',
    lastModified: 'Dernière mise à jour',
    dismiss: 'Fermer la notification',
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
    const dismissed = ref(false)
    let timer: ReturnType<typeof setTimeout> | undefined
    onMounted(() => {
      const settings = frontmatter.value.notice as Record<string, unknown> | undefined
      const delay = Number(settings?.autoDismissMs ?? 0)
      if (Number.isFinite(delay) && delay > 0) timer = setTimeout(() => { dismissed.value = true }, delay)
    })
    onBeforeUnmount(() => { if (timer) clearTimeout(timer) })
    return () => {
      const metadata = frontmatter.value as Record<string, unknown>
      const language = languageFor(metadata.requestedLanguage ?? lang.value)
      const messages = strings[language]
      const configured = (props.notices as Record<string, Record<string, string>>)[language] ?? {}
      const settings = metadata.notice && typeof metadata.notice === 'object'
        ? metadata.notice as Record<string, unknown>
        : {}
      if (dismissed.value) return null
      const fallbackNotice = typeof metadata.languageFallbackNotice === 'string' ? metadata.languageFallbackNotice : ''
      const status = String(metadata.status ?? '').toLowerCase()
      const statusMessage = status === 'exploring'
        ? configured.exploring ?? messages.exploring
        : ['validated', 'verified', 'complete', 'completed'].includes(status)
          ? configured.validated ?? messages.validated
          : ''
      if (!fallbackNotice && !statusMessage) return null
      const statusTitle = status === 'exploring'
        ? configured.exploringTitle ?? messages.exploringTitle
        : configured.validatedTitle ?? messages.validatedTitle
      const icon = (kind: 'info' | 'warning' | 'check') => h('svg', {
        class: 'FeluqaDocumentationNotices__icon', viewBox: '0 0 24 24', fill: 'none',
        stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        'aria-hidden': 'true', focusable: 'false',
      }, kind === 'check'
        ? [h('circle', { cx: '12', cy: '12', r: '10' }), h('path', { d: 'm8 12 2.5 2.5L16.5 9' })]
        : kind === 'warning'
          ? [h('path', { d: 'M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z' }), h('path', { d: 'M12 9v4' }), h('path', { d: 'M12 17h.01' })]
          : [h('circle', { cx: '12', cy: '12', r: '10' }), h('path', { d: 'M12 16v-4' }), h('path', { d: 'M12 8h.01' })])
      const dismissButton = () => h('button', {
        class: 'FeluqaDocumentationNotices__dismiss', type: 'button',
        'aria-label': configured.dismiss ?? messages.dismiss,
        onClick: () => { dismissed.value = true },
      }, [h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'aria-hidden': 'true' }, [h('path', { d: 'm18 6-12 12M6 6l12 12' })])])
      const buildNotice = (kind: 'fallback' | 'status') => {
        const isFallback = kind === 'fallback'
        const compact = settings.compact === true || (!isFallback && status === 'validated' && settings.compact !== false)
        const collapsible = settings.collapsible === true
        const dismissible = settings.dismissible === true || Number(settings.autoDismissMs) > 0
        const heading = isFallback ? configured.fallbackTitle ?? messages.fallbackTitle : statusTitle
        const message = isFallback ? fallbackNotice : statusMessage
        const iconKind: 'info' | 'warning' | 'check' = isFallback ? 'info' : status === 'exploring' ? 'warning' : 'check'
        const content = [
          icon(iconKind),
          h('div', { class: 'FeluqaDocumentationNotices__content' }, [
            compact ? h('strong', { class: 'FeluqaDocumentationNotices__compact-label' }, message) : null,
            !compact && !collapsible ? h('strong', heading) : null,
            compact ? null : h('p', message),
          ]),
          dismissible ? dismissButton() : null,
        ]
        const classes = [
          `FeluqaDocumentationNotices__${kind}`,
          !isFallback ? status === 'exploring' ? 'is-exploring' : 'is-validated' : '',
          settings.subtle === true ? 'is-subtle' : '',
          compact ? 'is-compact' : '',
        ]
        if (!collapsible) return h('div', { class: classes, role: status === 'exploring' && !isFallback ? 'status' : 'note' }, content)
        return h('details', { class: [...classes, 'is-collapsible', dismissible ? 'has-dismiss' : ''] }, [
          h('summary', [icon(iconKind), h('span', heading)]),
          dismissible ? dismissButton() : null,
          h('div', { class: 'FeluqaDocumentationNotices__expanded' }, [h('p', message)]),
        ])
      }
      return h('div', { class: 'FeluqaDocumentationNotices', 'aria-live': 'polite' }, [
        fallbackNotice ? buildNotice('fallback') : null,
        statusMessage ? buildNotice('status') : null,
      ])
    }
  },
})

export const DocumentationLastModified = defineComponent({
  name: 'DocumentationLastModified',
  props: { lastUpdated: { type: Object, default: () => ({}) } },
  setup(props) {
    const { frontmatter, lang } = useData()
    return () => {
      const configured = props.lastUpdated as Record<string, unknown>
      if (configured.enabled === false) return null
      const value = frontmatter.value.lastmod ?? frontmatter.value.lastModified
      if (!value) return null
      const date = new Date(String(value))
      if (Number.isNaN(date.getTime())) return null
      const locale = languageFor(lang.value) === 'fr' ? 'fr-FR' : 'en-US'
      const language = languageFor(lang.value)
      const labels = configured.label as Record<string, unknown> | undefined
      const label = typeof labels?.[language] === 'string'
        ? labels[language] as string
        : language === 'fr' ? strings.fr.lastModified : strings.en.lastModified
      return h('p', { class: 'FeluqaLastModified' }, [
        h('span', { class: 'FeluqaLastModified__icon', 'aria-hidden': 'true' }),
        `${label} : `,
        h('time', { datetime: date.toISOString() }, new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date)),
      ])
    }
  },
})
