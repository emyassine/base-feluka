// SEO/frontmatter defaults used to backfill missing fields in source .md.
// This is intentionally simple; replace placeholders as needed.

const nowIso = () => new Date().toISOString().slice(0, 10);

const fake = {
  title: (fallback = 'Untitled') => fallback,
  description: (fallback = 'TODO: add description') => fallback,
  pageClass: () => 'page',
  image: () => '/og-default.png',
  keywords: () => ['TODO', 'keywords'],
};

export const seoDefaults = {
  titleTemplate: true,
  navbar: true,
  sidebar: true,
  aside: true,
  outline: 2,
  lastUpdated: true,
  editLink: true,
  footer: true,
  pageClass: fake.pageClass(),
  isHome: false,
  head: desc => [
    ['meta', { name: 'description', content: desc }],
    ['meta', { name: 'keywords', content: fake.keywords().join(', ') }],
  ],
  i18n: {
    title: fake.title,
    description: fake.description,
    image: fake.image,
    date: nowIso,
  },
  docMeta: {
    docTitle: (title = '') => title,
    docSubTitle: (desc = '') => desc,
    thumbnail: () => undefined,
    tags: () => [],
    audience: () => [],
    type: () => undefined,
    icon: () => undefined,
    image: () => undefined,
    draft: () => false,
    order: () => undefined,
    group: () => undefined,
  },
};

export const seoFake = fake;
