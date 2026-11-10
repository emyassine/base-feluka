/// <reference types="vite/client" />
import type { App } from 'vue';

function extractComponentName(filePath: string): string {
  const fileName = filePath.split('/').pop() || '';
  return fileName.replace(/\.vue$/, '');
}

export function registerGlobalComponents(app: App): void {
  const modules = import.meta.glob(
    [
      '/imports/components/**/*.vue',
      '../../../../imports/components/**/*.vue',
      '!/imports/components/**/_*/**',
      '!/imports/components/**/_*',
      '!../../../../imports/components/**/_*/**',
      '!../../../../imports/components/**/_*',
    ],
    { eager: true }
  ) as Record<string, { default: any }>;

  for (const [filePath, mod] of Object.entries(modules)) {
    const name = extractComponentName(filePath);
    if (!name) continue;
    app.component(name, mod.default);
  }
}
