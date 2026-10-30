export function isDefaultLanguage(language, fallbackLanguage) {
  return language.toLowerCase() === fallbackLanguage.toLowerCase()
}

export function localePrefix(language, fallbackLanguage, prefixDefaultLanguage, options = {}) {
  if (isDefaultLanguage(language, fallbackLanguage) && !prefixDefaultLanguage) return []
  return [options.lowercase ? language.toLowerCase() : language]
}
