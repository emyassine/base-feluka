export type OptionalStorageCategory = 'offline' | 'other'
export type StorageCategory = 'necessary' | OptionalStorageCategory

export interface StorageConsent {
  version: 1
  offline: boolean
  other: boolean
  updatedAt: string
}

export interface BrowserStorageEntry {
  kind: 'cookie' | 'localStorage' | 'sessionStorage' | 'indexedDB' | 'cache' | 'serviceWorker'
  /** Friendly label for the UI; internal browser keys are deliberately not exposed. */
  label: string
  category: StorageCategory
  required: boolean
  descriptionKey: string
  internalName: string
}

export const CONSENT_COOKIE = 'spmpst-consent'
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180
const NECESSARY_KEYS: Record<string, string> = {
  'vitepress-theme-appearance': 'theme',
  'spmpst-currency': 'currency',
  'nm-marketplace-currency': 'currency',
  'nm-brief': 'marketplace-basket',
  'nm-reviews': 'marketplace-reviews',
}
const OFFLINE_DATABASES = new Set(['nm-orientation-catalogs'])

const deniedConsent = (): StorageConsent => ({ version: 1, offline: false, other: false, updatedAt: '' })

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const prefix = `${name}=`
  const value = document.cookie.split(';').map((entry) => entry.trim()).find((entry) => entry.startsWith(prefix))
  return value ? value.slice(prefix.length) : null
}

export function getStorageConsent(): StorageConsent | null {
  const value = readCookie(CONSENT_COOKIE)
  if (!value) return null
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<StorageConsent>
    if (parsed.version !== 1) return null
    return { ...deniedConsent(), offline: parsed.offline === true, other: parsed.other === true, updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '' }
  } catch { return null }
}

export function allowsOptionalStorage(category: OptionalStorageCategory): boolean {
  return getStorageConsent()?.[category] === true
}

export function saveStorageConsent(value: Pick<StorageConsent, 'offline' | 'other'>): StorageConsent {
  const consent: StorageConsent = { version: 1, ...value, updatedAt: new Date().toISOString() }
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`
  window.dispatchEvent(new CustomEvent('spmpst-storage-consent-change', { detail: consent }))
  return consent
}

export function readManagedStorage(key: string): string | null {
  try { return window.localStorage.getItem(key) } catch { return null }
}
export function writeManagedStorage(key: string, value: string): boolean {
  try { window.localStorage.setItem(key, value); return true } catch { return false }
}
export function readOptionalStorage(key: string, category: OptionalStorageCategory): string | null {
  if (!allowsOptionalStorage(category)) return null
  try { return window.localStorage.getItem(key) } catch { return null }
}
export function writeOptionalStorage(key: string, value: string, category: OptionalStorageCategory): boolean {
  if (!allowsOptionalStorage(category)) return false
  try { window.localStorage.setItem(key, value); return true } catch { return false }
}
export function storageCategoryForKey(key: string): StorageCategory {
  if (Object.hasOwn(NECESSARY_KEYS, key)) return 'necessary'
  return key === 'nm-orientation-catalogs' ? 'offline' : 'other'
}

export async function clearOptionalStorage(category: OptionalStorageCategory): Promise<void> {
  try {
    const keys = Array.from({ length: window.localStorage.length }, (_, index) => window.localStorage.key(index)).filter((key): key is string => key !== null)
    for (const key of keys) if (storageCategoryForKey(key) === category) window.localStorage.removeItem(key)
  } catch { /* browser storage may be unavailable */ }
  const entries = await getBrowserStorageInventory()
  for (const item of entries) if (item.category === category) await removeBrowserStorageEntry(item)
  if (category === 'offline') for (const name of OFFLINE_DATABASES) {
    await removeBrowserStorageEntry({ kind: 'indexedDB', internalName: name, label: 'Offline catalogue', category, required: false, descriptionKey: 'offline-catalogue' })
  }
}

function entry(kind: BrowserStorageEntry['kind'], internalName: string, category: StorageCategory, label: string, descriptionKey: string): BrowserStorageEntry {
  return { kind, internalName, category, label, descriptionKey, required: category === 'necessary' }
}

export async function getBrowserStorageInventory(): Promise<BrowserStorageEntry[]> {
  const entries: BrowserStorageEntry[] = []
  try {
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.trim().split('=', 1)[0]
      if (name) entries.push(entry('cookie', name, name === CONSENT_COOKIE ? 'necessary' : 'other', name === CONSENT_COOKIE ? 'Consent choice' : 'Site cookie', name === CONSENT_COOKIE ? 'consent' : 'site-cookie'))
    }
  } catch { /* cookie access may be unavailable */ }
  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const name = window.localStorage.key(index)
      if (!name) continue
      const key = NECESSARY_KEYS[name]
      const category = storageCategoryForKey(name)
      entries.push(entry('localStorage', name, category, key ? ({ theme: 'Theme choice', currency: 'Currency choice', 'marketplace-basket': 'Marketplace basket', 'marketplace-reviews': 'Marketplace reviews' } as Record<string, string>)[key] : category === 'offline' ? 'Offline catalogue' : 'Site setting', key ?? category))
    }
  } catch { /* local storage may be unavailable */ }
  try {
    for (let index = 0; index < window.sessionStorage.length; index += 1) {
      const name = window.sessionStorage.key(index)
      if (name) entries.push(entry('sessionStorage', name, 'other', 'Temporary site data', 'other'))
    }
  } catch { /* session storage may be unavailable */ }
  try {
    const databases = await indexedDB.databases()
    for (const database of databases) if (database.name) {
      const category = OFFLINE_DATABASES.has(database.name) ? 'offline' : 'other'
      entries.push(entry('indexedDB', database.name, category, category === 'offline' ? 'Offline catalogue' : 'Site database', category === 'offline' ? 'offline-catalogue' : 'other'))
    }
  } catch { /* database enumeration is not supported in every browser */ }
  try {
    if ('caches' in window) for (const name of await window.caches.keys()) {
      const category = name.startsWith('spmpst-pwa-') ? 'offline' : 'other'
      entries.push(entry('cache', name, category, category === 'offline' ? 'Offline site content' : 'Cached site files', category === 'offline' ? 'pwa-offline' : 'other'))
    }
  } catch { /* Cache Storage may be unavailable */ }
  try {
    const registrations = await navigator.serviceWorker?.getRegistrations()
    for (const registration of registrations ?? []) {
      const script = registration.active?.scriptURL || registration.waiting?.scriptURL || registration.installing?.scriptURL || ''
      const isPwaWorker = script && new URL(script).pathname.endsWith('/service-worker.js')
      entries.push(entry('serviceWorker', registration.scope, isPwaWorker ? 'offline' : 'other', isPwaWorker ? 'Offline site support' : 'Background site worker', isPwaWorker ? 'pwa-offline' : 'other'))
    }
  } catch { /* Service Workers may be unavailable */ }
  return entries.sort((left, right) => left.kind.localeCompare(right.kind) || left.label.localeCompare(right.label))
}

export async function removeBrowserStorageEntry(item: BrowserStorageEntry): Promise<void> {
  if (item.required) return
  const detail = { kind: item.kind, name: item.internalName }
  window.dispatchEvent(new CustomEvent('spmpst-storage-removing', { detail }))
  if (item.kind === 'cookie') {
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${encodeURIComponent(item.internalName)}=; Max-Age=0; Path=/; SameSite=Lax${secure}`
  } else if (item.kind === 'localStorage') { try { window.localStorage.removeItem(item.internalName) } catch { /* unavailable */ } }
  else if (item.kind === 'sessionStorage') { try { window.sessionStorage.removeItem(item.internalName) } catch { /* unavailable */ } }
  else if (item.kind === 'indexedDB') await new Promise<void>((resolve) => {
    try { const request = indexedDB.deleteDatabase(item.internalName); request.onsuccess = request.onerror = request.onblocked = () => resolve() } catch { resolve() }
  })
  else if (item.kind === 'cache') { try { await window.caches.delete(item.internalName) } catch { /* unavailable */ } }
  else if (item.kind === 'serviceWorker') {
    try { const regs = await navigator.serviceWorker?.getRegistrations(); await regs?.find((reg) => reg.scope === item.internalName)?.unregister() } catch { /* unavailable */ }
  }
  window.dispatchEvent(new CustomEvent('spmpst-storage-removed', { detail }))
}
