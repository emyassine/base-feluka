import fs from 'node:fs';
import path from 'node:path';
import type { CmsCache } from '../generated/cms';
import { buildSidebarsFromMenu } from './sidebars';

type SidebarMap = Record<string, unknown>;

export function buildSidebar(): SidebarMap {
  const cachePath = path.join(process.cwd(), '.vitepress', 'cache', 'gen', 'cms-cache.json');
  const cache = (fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : {}) as CmsCache;

  return buildSidebarsFromMenu(cache) as unknown as SidebarMap;
}
