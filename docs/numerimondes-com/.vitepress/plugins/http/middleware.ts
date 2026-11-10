import type { Plugin } from 'vite';

export function redirectRoot(defaultLocale: string): Plugin {
  const baseEnv = process.env.BASE ?? '/';
  const base = baseEnv.endsWith('/') ? baseEnv : `${baseEnv}/`;
  const baseNoSlash = base === '/' ? '/' : base.replace(/\/$/, '');
  const redirectTarget = `${base}${defaultLocale}/`;

  const redirect = (reqUrl: string | undefined, res: any, next: () => void) => {
    if (
      reqUrl === '/' ||
      reqUrl === '/index.html' ||
      reqUrl === base ||
      reqUrl === baseNoSlash ||
      reqUrl === `${base}index.html`
    ) {
      res.statusCode = 302;
      res.setHeader('Location', redirectTarget);
      res.end();
      return;
    }
    next();
  };

  return {
    name: 'redirect-root-to-default-locale',
    configureServer(server) {
      server.middlewares.use((req, res, next) => redirect(req.url, res, next));
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => redirect(req.url, res, next));
    },
  };
}
