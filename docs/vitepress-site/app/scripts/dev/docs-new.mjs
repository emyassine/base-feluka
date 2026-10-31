import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveLayout } from '../spmpst/layout.mjs'

const siteDirectory = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const layout = resolveLayout(siteDirectory)
const [kind, ...args] = process.argv.slice(2)
const fail = (message) => { process.stderr.write(`${message}\n`); process.exit(1) }
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const readJson = async (path) => JSON.parse(await readFile(path, 'utf8'))
const writeJson = async (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`)
const humanize = (value) => value.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
const languages = (await readJson(join(layout.siteDir, 'spmpst.lang.json'))).languages
const fallback = (await readJson(join(layout.siteDir, 'spmpst.lang.json'))).fallbackLanguage ?? languages[0]

if (kind === 'locale') {
  const [language] = args
  if (!/^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(language ?? '')) fail('Usage: docs:new locale <language-code>')
  const langPath = join(layout.siteDir, 'spmpst.lang.json')
  const lang = await readJson(langPath)
  if (lang.languages.includes(language)) fail(`Language already exists: ${language}`)
  const localePath = join(layout.siteDir, `locales/${language}.locale.json`)
  try { await readFile(localePath); fail(`Locale bundle already exists: ${localePath}`) } catch (error) { if (error.code !== 'ENOENT') throw error }
  const source = await readJson(join(layout.siteDir, `locales/${fallback}.locale.json`))
  source.language.label = language
  source.$schema = '../schema/locale.schema.json'
  lang.languages.push(language)
  await writeJson(langPath, lang)
  await writeJson(localePath, source)
  for (const file of ['spmpst.topbar.json', 'spmpst.collections.json', 'spmpst.definitions.json']) {
    const path = join(layout.siteDir, file)
    const value = await readJson(path)
    const translate = (node) => {
      if (!node || typeof node !== 'object') return
      for (const child of Object.values(node)) {
        if (child && typeof child === 'object' && !Array.isArray(child) && fallback in child && Object.values(child).every((text) => typeof text === 'string')) child[language] = child[fallback]
        else translate(child)
      }
    }
    translate(value)
    await writeJson(path, value)
  }
  process.stdout.write(`Created ${localePath}; review copied fallback-language strings.\n`)
} else if (kind === 'guide') {
  const [id] = args
  if (!slugPattern.test(id ?? '')) fail('Usage: docs:new guide <lowercase-slug>')
  const definitionsPath = join(layout.siteDir, 'spmpst.definitions.json')
  const definitions = await readJson(definitionsPath)
  if (definitions.subguides.some((guide) => guide.path === id)) fail(`Guide already registered: ${id}`)
  const directory = join(layout.guidesDir, id)
  await mkdir(directory, { recursive: false })
  definitions.subguides.push({ path: id, label: humanize(id), labels: Object.fromEntries(languages.map((language) => [language, humanize(id)])), uri: { base: `/${id}/` } })
  await writeJson(definitionsPath, definitions)
  await writeJson(join(directory, 'spmpst.guide.json'), { title: humanize(id), favicon: '', showSiteTitle: false })
  await writeFile(join(directory, `index.${fallback}.md`), `---\ntitle: ${JSON.stringify(humanize(id))}\nsidebarTitle: ${JSON.stringify(humanize(id))}\nicon: book-open\n---\n\n# ${humanize(id)}\n\nAdd guide content here.\n`)
  process.stdout.write(`Created and registered guide ${id}. Add a translated index page and configure its sidebar.\n`)
} else if (kind === 'collection') {
  const [id] = args
  if (!slugPattern.test(id ?? '')) fail('Usage: docs:new collection <lowercase-slug>')
  const configPath = join(layout.siteDir, 'spmpst.collections.json')
  const config = await readJson(configPath)
  if (config.collections.some((collection) => collection.id === id)) fail(`Collection already registered: ${id}`)
  const directory = join(layout.collectionsDir, id)
  await mkdir(directory, { recursive: false })
  config.collections.push({ id, dir: id, layout: 'article', indexLayout: 'list', title: Object.fromEntries(languages.map((language) => [language, humanize(id)])), description: Object.fromEntries(languages.map((language) => [language, ''])) })
  await writeJson(configPath, config)
  await writeJson(join(directory, 'spmpst.category.json'), { categories: [] })
  await writeFile(join(directory, `001-first-article.${fallback}.md`), `---\ntitle: First article\nsidebarTitle: First article\nicon: book-open\ndate: ${new Date().toISOString().slice(0, 10)}\n---\n\nAdd article content here.\n`)
  process.stdout.write(`Created and registered collection ${id}. Add localized metadata before publishing.\n`)
} else if (kind === 'section') {
  const [guide, section] = args
  if (!slugPattern.test(guide ?? '') || !slugPattern.test(section ?? '')) fail('Usage: docs:new section <guide-slug> <section-slug>')
  const guideDirectory = join(layout.guidesDir, guide)
  const directory = join(guideDirectory, `010-${section}`)
  await mkdir(directory, { recursive: false })
  await writeJson(join(directory, 'spmpst.sidebar.json'), { labels: Object.fromEntries(languages.map((language) => [language, humanize(section)])), icon: 'lucide/book-open' })
  await writeFile(join(directory, `index.${fallback}.md`), `---\ntitle: ${JSON.stringify(humanize(section))}\nsidebarTitle: ${JSON.stringify(humanize(section))}\nicon: book-open\n---\n\n# ${humanize(section)}\n`)
  process.stdout.write(`Created section ${guide}/${section}.\n`)
} else fail('Usage: docs:new <locale|guide|collection|section> …')
