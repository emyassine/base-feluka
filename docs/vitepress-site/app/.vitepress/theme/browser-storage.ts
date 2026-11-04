export type OptionalStorageCategory = 'preferences' | 'marketplace' | 'offline' | 'other'

export interface StorageConsent {
  version: 1
  preferences: boolean
  marketplace: boolean
  offline: boolean
  other: boolean
  updatedAt: string
}

export interface BrowserStorageEntry {
  kind: 'cookie' | 'localStorage' | 'sessionStorage' | 'indexedDB' | 'cache' | 'serviceWorker'
  name: string
  category: 'necessary' | OptionalStorageCategory
  required: boolean
}

export const CONSENT_COOKIE = 'spmpst-consent'
const CONSENT_MAX_AGE = 60 * 60 * 24 * 180
const STORAGE_KEYS: Record<string, OptionalStorageCategory> = {
  'vitepress-theme-appearance': 'preferences',
  'spmpst-currency': 'preferences',
  'nm-marketplace-currency': 'preferences',
  'nm-brief': 'marketplace',
  'nm-reviews': 'marketplace',
  'nm-orientation-catalogs': 'offline',
}

const deniedConsent = (): StorageConsent => ({
  version: 1,
  preferences: false,
  marketplace: false,
  offline: false,
  other: false,
  updatedAt: '',
})

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
    return {
      version: 1,
      preferences: parsed.preferences === true,
      marketplace: parsed.marketplace === true,
      offline: parsed.offline === true,
      other: parsed.other === true,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
    }
  } catch {
    return null
  }
}

export function allowsOptionalStorage(category: OptionalStorageCategory): boolean {
  return getStorageConsent()?.[category] === true
}

export function saveStorageConsent(value: Omit<StorageConsent, 'version' | 'updatedAt'>): StorageConsent {
  const consent: StorageConsent = { version: 1, ...value, updatedAt: new Date().toISOString() }
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`
  window.dispatchEvent(new CustomEvent('spmpst-storage-consent-change', { detail: consent }))
  return consent
}

export function readOptionalStorage(key: string, category: OptionalStorageCategory): string | null {
  if (!allowsOptionalStorage(category)) return null
  try { return window.localStorage.getItem(key) } catch { return null }
}

export function writeOptionalStorage(key: string, value: string, category: OptionalStorageCategory): boolean {
  if (!allowsOptionalStorage(category)) return false
  try {
    window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function storageCategoryForKey(key: string): OptionalStorageCategory {
  return STORAGE_KEYS[key] ?? 'other'
}

export async function clearOptionalStorage(category: OptionalStorageCategory): Promise<void> {
  try {
    const keys = Object.keys(window.localStorage)
    for (const key of keys) {
      if (storageCategoryForKey(key) === category) window.localStorage.removeItem(key)
    }
  } catch { /* browser storage may be unavailable */ }

  if (category === 'offline' && typeof indexedDB !== 'undefined') {
    await new Promise<void>((resolve) => {
      try {
        const request = indexedDB.deleteDatabase('nm-orientation-catalogs')
        request.onsuccess = request.onerror = request.onblocked = () => resolve()
      } catch { resolve() }
    })
  }
}

export async function getBrowserStorageInventory(): Promise<BrowserStorageEntry[]> {
  const entries: BrowserStorageEntry[] = []
  try {
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.trim().split('=', 1)[0]
      if (name) entries.push({ kind: 'cookie', name, category: name === CONSENT_COOKIE ? 'necessary' : 'other', required: name === CONSENT_COOKIE })
    }
  } catch { /* cookie access may be unavailable */ }
  try {
    for (let index = 0; index < window.localStorage.length; index += 1) {
      const name = window.localStorage.key(index)
      if (name) entries.push({ kind: 'localStorage', name, category: storageCategoryForKey(name), required: false })
    }
  } catch { /* local storage may be unavailable */ }
  try {
    for (let index = 0; index < window.sessionStorage.length; index += 1) {
      const name = window.sessionStorage.key(index)
      if (name) entries.push({ kind: 'sessionStorage', name, category: 'other', required: false })
    }
  } catch { /* session storage may be unavailable */ }
  try {
    const databases = await indexedDB.databases()
    for (const database of databases) {
      if (database.name) entries.push({ kind: 'indexedDB', name: database.name, category: database.name === 'nm-orientation-catalogs' ? 'offline' : 'other', required: false })
    }
  } catch { /* database enumeration is not supported in every browser */ }
  try {
    if ('caches' in window) for (const name of await window.caches.keys()) entries.push({ kind: 'cache', name, category: 'other', required: false })
  } catch { /* Cache Storage may be unavailable */ }
  try {
    const registrations = await navigator.serviceWorker?.getRegistrations()
    for (const registration of registrations ?? []) entries.push({ kind: 'serviceWorker', name: registration.scope, category: 'other', required: false })
  } catch { /* Service Workers may be unavailable */ }
  return entries.sort((left, right) => left.kind.localeCompare(right.kind) || left.name.localeCompare(right.name))
}

export async function removeBrowserStorageEntry(entry: BrowserStorageEntry): Promise<void> {
  if (entry.required) return
  if (entry.kind === 'cookie') {
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${encodeURIComponent(entry.name)}=; Max-Age=0; Path=/; SameSite=Lax${secure}`
  } else if (entry.kind === 'localStorage') {
    try { window.localStorage.removeItem(entry.name) } catch { /* unavailable */ }
  } else if (entry.kind === 'sessionStorage') {
    try { window.sessionStorage.removeItem(entry.name) } catch { /* unavailable */ }
  } else if (entry.kind === 'indexedDB') {
    await new Promise<void>((resolve) => {
      try {
        const request = indexedDB.deleteDatabase(entry.name)
        request.onsuccess = request.onerror = request.onblocked = () => resolve()
      } catch { resolve() }
    })
  } else if (entry.kind === 'cache') {
    try { await window.caches.delete(entry.name) } catch { /* unavailable */ }
  } else if (entry.kind === 'serviceWorker') {
    try {
      const registrations = await navigator.serviceWorker?.getRegistrations()
      const registration = registrations?.find((candidate) => candidate.scope === entry.name)
      await registration?.unregister()
    } catch { /* unavailable */ }
  }
}
