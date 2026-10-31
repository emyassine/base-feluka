import { readFileSync } from 'node:fs'
import { basename } from 'node:path'
import { CONCERNS } from './registry.mjs'
import { ConfigError } from './errors.mjs'
import { ErrorCollector } from './errors.mjs'

function json(path, siteDir) {
  try { return JSON.parse(readFileSync(path, 'utf8')) }
  catch (error) { throw new ConfigError(path.slice(siteDir.length + 1), '', `Invalid JSON: ${error.message}`) }
}

function distance(left, right) {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row]
    for (let column = 1; column <= right.length; column += 1) current[column] = Math.min(current[column - 1] + 1, previous[column] + 1, previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1))
    previous = current
  }
  return previous[right.length]
}

const owners = Object.fromEntries(Object.entries(CONCERNS).flatMap(([concern, keys]) => keys.map((key) => [key, concern])))
function suggestion(value, choices) {
  const nearest = choices.map((choice) => [choice, distance(value, choice)]).sort((left, right) => left[1] - right[1])[0]
  return nearest?.[1] <= 2 ? nearest[0] : undefined
}

export function assembleConfig(layout, discovered, options = {}) {
  const model = {}
  const targets = {}
  const sources = []
  const collector = new ErrorCollector()
  const seen = new Map()
  for (const path of discovered.concerns) {
    const name = basename(path).replace(/^spmpst\./, '').replace(/\.json$/, '')
    if (!(name in CONCERNS)) { collector.add(path, '', `Unknown concern: ${name}${suggestion(name, Object.keys(CONCERNS)) ? `; did you mean "${suggestion(name, Object.keys(CONCERNS))}"?` : ''}`); continue }
    let value
    try { value = json(path, layout.siteDir) }
    catch (error) { collector.add(error.file, error.pointer, error.message.replace(` (${error.file}${error.pointer || ''})`, '')); continue }
    sources.push(path)
    for (const key of Object.keys(value)) {
      if (key === '$schema') continue
      if (!CONCERNS[name].includes(key)) {
        const owner = owners[key]
        const likely = suggestion(key, Object.keys(owners))
        collector.add(path, `#/${key}`, owner ? `"${key}" belongs in spmpst.${owner}.json, not in spmpst.${name}.json` : `Unknown key "${key}"${likely ? `; did you mean "${likely}"?` : ''}`)
        continue
      }
      const previousOwner = seen.get(key)
      if (previousOwner) { collector.add(path, `#/${key}`, `Key "${key}" is already defined in ${previousOwner}`); continue }
      seen.set(key, path)
      model[key] = value[key]
    }
  }
  for (const [name, keys] of Object.entries(CONCERNS)) {
    if (name === 'definitions' || name === 'lang') {
      const path = discovered.concerns.find((item) => basename(item) === `spmpst.${name}.json`)
      if (!path) collector.add(`.site/spmpst.${name}.json`, '', 'Required concern file is missing')
    }
  }
  const fallback = model.fallbackLanguage ?? model.languages?.[0]
  model.locales = {}
  for (const path of discovered.locales) {
    const name = basename(path).replace(/\.locale\.json$/, '')
    try { model.locales[name] = json(path, layout.siteDir) }
    catch (error) { collector.add(error.file, error.pointer, error.message.replace(` (${error.file}${error.pointer || ''})`, '')); continue }
    if (model.locales[name] && typeof model.locales[name] !== 'object') collector.add(path, '', 'Locale bundle must be an object')
    sources.push(path)
  }
  model.publicFiles = {}
  for (const path of discovered.publicFiles) {
    model.publicFiles[basename(path)] = readFileSync(path, 'utf8')
    sources.push(path)
  }
  for (const path of discovered.targets) {
    const name = basename(path).replace(/\.target\.config\.json$/, '')
    targets[name] = json(path, layout.siteDir)
    sources.push(path)
  }
  if (!Array.isArray(model.languages) || model.languages.length === 0 || model.languages.some((language) => typeof language !== 'string' || !/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(language)) || new Set(model.languages).size !== model.languages.length) {
    collector.add('.site/spmpst.lang.json', '#/languages', 'languages must be a non-empty array of unique locale codes')
  }
  for (const language of model.languages ?? []) if (!model.locales[language]) collector.add(`.site/locales/${language}.locale.json`, '', 'Locale bundle is required for each configured language')
  for (const language of Object.keys(model.locales)) if (!(model.languages ?? []).includes(language)) collector.warn(`.site/locales/${language}.locale.json`, '', 'Locale bundle is not listed in lang.languages')
  if (model.languages?.length && !model.languages.includes(fallback)) collector.add('.site/spmpst.lang.json', '#/fallbackLanguage', 'fallbackLanguage must be listed in languages')
  const guidePaths = new Set((model.subguides ?? []).map((guide) => guide.path))
  const collectionIds = new Set((model.collections ?? []).map((collection) => collection.id))
  const visitItems = (items, pointer = '#/items') => {
    if (!Array.isArray(items)) return
    items.forEach((item, index) => {
      const itemPointer = `${pointer}/${index}`
      if (typeof item.guide === 'string' && !guidePaths.has(item.guide)) collector.add('.site/spmpst.topbar.json', `${itemPointer}/guide`, `Unknown guide reference: ${item.guide}`)
      if (typeof item.collection === 'string' && !collectionIds.has(item.collection)) collector.add('.site/spmpst.topbar.json', `${itemPointer}/collection`, `Unknown collection reference: ${item.collection}`)
      visitItems(item.items, `${itemPointer}/items`)
    })
  }
  visitItems(model.items)
  const seoLocales = model.locales && Object.fromEntries(Object.entries(model.locales).map(([language, bundle]) => [language, bundle?.seo ?? {}]))
  for (const [language, localeSeo] of Object.entries(seoLocales ?? {})) {
    if (Object.keys(localeSeo).length && !(model.languages ?? []).includes(language)) {
      collector.add(`.site/locales/${language}.locale.json`, '#/seo', `SEO locale is not listed in lang.languages: ${language}`)
    }
    if (!(localeSeo.quickLinks?.length || localeSeo.faq?.length)) continue
    for (const key of ['pageTitle', 'pageNavTitle', 'description']) {
      if (typeof localeSeo[key] !== 'string' || !localeSeo[key].trim()) collector.add(`.site/locales/${language}.locale.json`, `#/seo/${key}`, `${key} is required when an SEO page has quick links or FAQ entries`)
    }
    if (localeSeo.quickLinks?.length && (typeof localeSeo.quickLinksTitle !== 'string' || !localeSeo.quickLinksTitle.trim())) collector.add(`.site/locales/${language}.locale.json`, '#/seo/quickLinksTitle', 'quickLinksTitle is required when quickLinks are configured')
    if (localeSeo.faq?.length && (typeof localeSeo.faqTitle !== 'string' || !localeSeo.faqTitle.trim())) collector.add(`.site/locales/${language}.locale.json`, '#/seo/faqTitle', 'faqTitle is required when FAQ entries are configured')
  }
  for (const [concern, langs] of [['topbar items', model.items], ['collections', model.collections], ['guides', model.subguides]]) {
    const inspect = (value, pointer = '') => {
      if (!value || typeof value !== 'object') return
      for (const [key, child] of Object.entries(value)) {
        if (child && typeof child === 'object' && !Array.isArray(child) && Object.keys(child).some((name) => (model.languages ?? []).includes(name))) {
          const missing = (model.languages ?? []).filter((language) => !(language in child))
          if (missing.length) {
            const message = `${concern} localized value${pointer}/${key} is missing: ${missing.join(', ')}`
            if (options.strictI18n) collector.add('.site', `${pointer}/${key}`, message)
            else collector.warn('.site', `${pointer}/${key}`, message)
          }
        } else inspect(child, `${pointer}/${key}`)
      }
    }
    inspect(langs)
  }
  collector.throwIfAny()
  return { model, targets, sources, warnings: collector.warnings.map((warning) => warning.message), defaultLanguage: fallback }
}
