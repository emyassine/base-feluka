const pathname = typeof window !== 'undefined' ? window.location.pathname : '';

if (typeof window !== 'undefined' && (pathname === '/' || pathname === '')) {
  const siteData = window.__VP_SITE_DATA__?.site || {};
  const localeKeys = siteData.locales ? Object.keys(siteData.locales) : [];
  const langCandidate = typeof siteData.lang === 'string' ? siteData.lang.split('-')[0] : '';
  const defaultLocale = siteData.defaultLocale || langCandidate || localeKeys[0] || 'en';

  window.location.replace(`/${defaultLocale}/`);
}
