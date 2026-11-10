export function titleCase(value: string): string {
  return value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function createHash(input: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha1').update(input).digest('hex').slice(0, 12);
}
