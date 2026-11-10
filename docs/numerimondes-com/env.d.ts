declare module '*.json' {
  const value: any;
  export default value;
}

import type { CmsCache, CmsQuery } from './.vitepress/settings/generated/cms/index.ts';

declare global {
  const useCms: (locale?: string) => CmsQuery;
  const $cms: CmsCache;
}

export {};
