const RESOURCE_REFERENCE = /^@spmpst::(icon|flag|media)::([\p{L}\p{N}][\p{L}\p{N}._/-]*)$/u

/** Parse a portable logical resource identifier without resolving it to a file. */
export function parseResourceReference(value) {
  if (typeof value !== 'string') return null
  const match = value.match(RESOURCE_REFERENCE)
  if (!match || match[2].includes('//') || match[2].split('/').some((part) => part === '.' || part === '..')) return null
  return { kind: match[1], id: match[2].normalize('NFC') }
}

export function resourceReference(kind, id) {
  const reference = `@spmpst::${kind}::${id}`
  if (!parseResourceReference(reference)) throw new TypeError(`Invalid SPMPST resource reference: ${reference}`)
  return reference
}

/** Replace references in JSON-like data through a resolver supplied by an adapter. */
export function resolveResourceReferences(value, resolver) {
  if (typeof value === 'string') return parseResourceReference(value) ? resolver(parseResourceReference(value)) : value
  if (Array.isArray(value)) return value.map((entry) => resolveResourceReferences(entry, resolver))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, resolveResourceReferences(entry, resolver)]))
  }
  return value
}
