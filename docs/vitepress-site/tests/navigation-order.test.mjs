import test from 'node:test'
import assert from 'node:assert/strict'
import { sortNavigationEntries } from '../navigation-order.mjs'

test('sorts numeric prefixes numerically across mixed files and folders', () => {
  const entries = [
    { name: '10.reference.md', kind: 'file' },
    { name: '2.installation', kind: 'directory' },
    { name: '1.introduction', kind: 'directory' },
    { name: '2.quickstart.md', kind: 'file' },
  ]
  assert.deepEqual(sortNavigationEntries(entries).map(({ name }) => name), [
    '1.introduction', '2.installation', '2.quickstart.md', '10.reference.md',
  ])
})

test('uses original numbered filesystem names after generated prefixes are stripped', () => {
  const entries = [{ name: 'reference' }, { name: 'installation' }, { name: 'introduction' }]
  const sourceNames = {
    reference: '10.reference',
    installation: '2.installation',
    introduction: '1.introduction',
  }
  assert.deepEqual(sortNavigationEntries(entries, sourceNames).map(({ name }) => name), [
    'introduction', 'installation', 'reference',
  ])
})

test('places unnumbered entries after numbered entries and sorts ties deterministically', () => {
  const entries = [{ name: 'zeta.md' }, { name: '2.zulu.md' }, { name: '2.alpha.md' }, { name: '10.md' }]
  assert.deepEqual(sortNavigationEntries(entries).map(({ name }) => name), [
    '2.alpha.md', '2.zulu.md', '10.md', 'zeta.md',
  ])
})
