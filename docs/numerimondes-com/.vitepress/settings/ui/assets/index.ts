/// <reference types="vite/client" />

const JS_MODULES = import.meta.glob(
  [
    '/imports/js/**/*.js',
    '/imports/js/**/*.mjs',
    '/imports/js/**/*.ts',
    '/imports/js/**/*.mts',
    '../../../../imports/js/**/*.js',
    '../../../../imports/js/**/*.mjs',
    '../../../../imports/js/**/*.ts',
    '../../../../imports/js/**/*.mts',
    '../../../imports/js/**/*.js',
    '../../../imports/js/**/*.mjs',
    '../../../imports/js/**/*.ts',
    '../../../imports/js/**/*.mts',
    '../../imports/js/**/*.js',
    '../../imports/js/**/*.mjs',
    '../../imports/js/**/*.ts',
    '../../imports/js/**/*.mts',
    '!/imports/js/**/_*/**',
    '!/imports/js/**/_*',
    '!../../../../imports/js/**/_*/**',
    '!../../../../imports/js/**/_*',
    '!../../../imports/js/**/_*/**',
    '!../../../imports/js/**/_*',
    '!../../imports/js/**/_*/**',
    '!../../imports/js/**/_*',
  ],
  { eager: true }
);

const getOrderKey = (path: string): [number, string] => {
  const match = path.match(/\/imports\/css\/([^/]+)\//);
  const folder = match?.[1] || '';
  const numMatch = folder.match(/^(\d+)_/);
  const group = numMatch ? Number(numMatch[1]) : Number.POSITIVE_INFINITY;
  return [group, folder];
};

export async function loadAllAssets(): Promise<void> {
  const modules = import.meta.glob([
    '/imports/css/**/*.css',
    '../../../../imports/css/**/*.css',
    '../../../imports/css/**/*.css',
    '../../imports/css/**/*.css',
    '!/imports/css/_legacy/**',
    '!/imports/css/**/_*/**',
    '!/imports/css/**/_*',
    '!../../../../imports/css/_legacy/**',
    '!../../../../imports/css/**/_*/**',
    '!../../../../imports/css/**/_*',
    '!../../../imports/css/_legacy/**',
    '!../../../imports/css/**/_*/**',
    '!../../../imports/css/**/_*',
    '!../../imports/css/_legacy/**',
    '!../../imports/css/**/_*/**',
    '!../../imports/css/**/_*',
  ]);
  const keys = Object.keys(modules).sort((a, b) => {
    const [ga, fa] = getOrderKey(a);
    const [gb, fb] = getOrderKey(b);
    if (ga !== gb) return ga - gb;
    if (fa !== fb) return fa.localeCompare(fb);
    return a.localeCompare(b);
  });

  for (const key of keys) {
    await modules[key]();
  }

  void JS_MODULES;

  if (typeof window !== 'undefined') {
    const cssCount = keys.length;
    const jsCount = Object.keys(JS_MODULES).length;
    console.info('[assets] CSS matched:', cssCount, 'JS matched:', jsCount);
  }
}
