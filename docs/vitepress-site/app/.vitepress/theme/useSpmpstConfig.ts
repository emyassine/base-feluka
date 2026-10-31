import { computed, type ComputedRef } from 'vue'
import { useData } from 'vitepress'
import siteContent from '@generated/site-content.json'

type ConfigObject = Record<string, unknown>

function localize(value: unknown, language: string, defaultLanguage: string, languages: string[]): unknown {
  if (Array.isArray(value)) return value.map((entry) => localize(entry, language, defaultLanguage, languages))
  if (!value || typeof value !== 'object') return value

  const entries = Object.entries(value)
  if (entries.length > 0 && entries.every(([key, entry]) => languages.includes(key) && typeof entry === 'string')) {
    const localized = value as Record<string, string>
    return localized[language] ?? localized[defaultLanguage] ?? entries[0][1]
  }

  return Object.fromEntries(entries.map(([key, entry]) => [key, localize(entry, language, defaultLanguage, languages)]))
}

/** Read and localize any site-level SPMPST config path from a Vue component. */
export function useSpmpstConfig<T = unknown>(path: string): ComputedRef<T> {
  const { lang, frontmatter } = useData()
  return computed(() => {
    const content = siteContent as {
      spmpstConfig: ConfigObject
      defaultLanguage: string
      languages: string[]
    }
    const requestedLanguage = String(frontmatter.value.requestedLanguage ?? lang.value).toLowerCase()
    const language = content.languages.find((item) => item.toLowerCase() === requestedLanguage)
      ?? content.languages.find((item) => requestedLanguage.startsWith(`${item.toLowerCase()}-`))
      ?? content.defaultLanguage
    const value = path.split('.').filter(Boolean).reduce<unknown>((current, segment) => {
      if (!current || typeof current !== 'object' || !(segment in current)) {
        throw new Error(`Unknown SPMPST config path: ${path}`)
      }
      return (current as ConfigObject)[segment]
    }, content.spmpstConfig)
    return localize(value, language, content.defaultLanguage, content.languages) as T
  })
}
