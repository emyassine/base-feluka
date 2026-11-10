<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useData, useRoute } from 'vitepress';

const { site } = useData();
const route = useRoute();
const manifest = ref<{ locales?: Record<string, string[]> } | null>(null);

onMounted(async () => {
  try {
    const base = site.value.base || '/';
    const url = base.endsWith('/') ? `${base}_manifest.json` : `${base}/_manifest.json`;
    const res = await fetch(url);
    if (res.ok) {
      manifest.value = await res.json();
    }
  } catch {
    manifest.value = null;
  }
});

const localeKeys = computed(() => Object.keys(site.value.locales || {}));
const rawPath = computed(() => stripTrailingSlash(normalize(route.path)));
const profilesList = computed(() => ((site.value.themeConfig as any)?.profilesList || []) as string[]);
const defaultProfile = computed(() => ((site.value.themeConfig as any)?.defaultProfile || null) as string | null);
const currentProfile = computed(() => detectProfile(rawPath.value));
const currentLocale = computed(() => detectLocale(rawPath.value));

function getThemeI18n() {
  return (site.value.themeConfig as any)?.i18nMessages || {};
}

function getDefaultLocale() {
  return ((site.value.themeConfig as any)?.defaultLocale || 'en').toLowerCase();
}

function getBundle(locale: string | null) {
  const messages = getThemeI18n();
  const fallback = getDefaultLocale();
  return messages[locale || ''] || messages[fallback] || {};
}

function normalize(path: string): string {
  if (!path.startsWith('/')) return `/${path}`;
  return path;
}

function stripTrailingSlash(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, '') : '/';
}

function detectProfile(path: string): string | null {
  const parts = stripTrailingSlash(path).split('/').filter(Boolean);
  const candidate = parts[0] || null;
  if (candidate && profilesList.value.includes(candidate) && candidate !== defaultProfile.value) {
    return candidate;
  }
  return null;
}

function detectLocale(path: string): string | null {
  const parts = stripTrailingSlash(path).split('/').filter(Boolean);
  if (!parts.length) return null;
  const maybeProfile = parts[0];
  const maybeLocale = parts[1];
  if (maybeProfile && profilesList.value.includes(maybeProfile) && maybeLocale) {
    if (localeKeys.value.includes(maybeLocale)) return maybeLocale;
  }
  const first = parts[0];
  if (localeKeys.value.includes(first)) return first;
  return null;
}

function titleFromPath(path: string): string {
  const clean = stripTrailingSlash(path);
  if (clean === '/') return 'Home';
  const parts = clean.split('/').filter(Boolean);
  const last = parts[parts.length - 1] || 'Home';
  return decodeURIComponent(last)
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function bestMatchForLocale(
  targetLocale: string,
  relPath: string,
  pages: string[],
  profilePrefix: string | null
): string | null {
  const parts = relPath.split('/').filter(Boolean);
  for (let i = parts.length; i >= 0; i -= 1) {
    const sub = `/${parts.slice(0, i).join('/')}`;
    const prefix = profilePrefix ? `/${profilePrefix}` : '';
    const candidate = sub === '/' ? `${prefix}/${targetLocale}/` : `${prefix}/${targetLocale}${sub}`;
    if (pages.includes(candidate) || pages.includes(stripTrailingSlash(candidate))) {
      return candidate.endsWith('/') ? candidate : `${candidate}/`;
    }
  }
  return null;
}

function getLanguageName(targetLocale: string, uiLocale: string | null) {
  const uiBundle = getBundle(uiLocale);
  const names = uiBundle.languageNames || {};
  return names[targetLocale] || site.value.locales?.[targetLocale]?.label || targetLocale.toUpperCase();
}

const suggestions = computed(() => {
  const current = currentLocale.value;
  const profilePrefix = currentProfile.value;
  const pages =
    manifest.value?.locales?.[current || '']?.map(p => stripTrailingSlash(p)) ||
    (site.value.pages || []).map(p => stripTrailingSlash(p));

  const results: Array<{ link: string; label: string }> = [];
  const localesToTry = localeKeys.value.filter(l => l !== current);

  if (current) {
    const prefixPattern = profilePrefix ? `^/${profilePrefix}` : '';
    const rel = stripTrailingSlash(rawPath.value.replace(new RegExp(`${prefixPattern}/${current}(/|$)`), '/'));
    for (const locale of localesToTry) {
      const localePages = manifest.value?.locales?.[locale]?.map(p => stripTrailingSlash(p)) || pages;
      const match = bestMatchForLocale(locale, rel, localePages, profilePrefix);
      if (match) {
        const localeLabel = getLanguageName(locale, current);
        results.push({ link: match, label: `${titleFromPath(match)} (${localeLabel})` });
      }
    }
  }

  if (!results.length) {
    for (const locale of localesToTry) {
      const localePages = manifest.value?.locales?.[locale]?.map(p => stripTrailingSlash(p)) || pages;
      const match = bestMatchForLocale(locale, rawPath.value, localePages, profilePrefix);
      if (match) {
        const localeLabel = getLanguageName(locale, current);
        results.push({ link: match, label: `${titleFromPath(match)} (${localeLabel})` });
      }
    }
  }

  return results.slice(0, 9);
});

const isLanguageUnavailable = computed(() => Boolean(currentLocale.value) && suggestions.value.length > 0);

function formatMessage(template: string, params: Record<string, string>) {
  return Object.keys(params).reduce((out, key) => out.replace(new RegExp(`\\{${key}\\}`, 'g'), params[key]), template);
}

const notFoundText = computed(() => {
  const locale = currentLocale.value;
  const bundle = getBundle(locale);
  const fallbackNotFound = {
    code: '404',
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist or has been moved.',
  };
  const fallbackUnavailable = {
    code: '406',
    title: 'Unavailable',
    message: "This page isn't available in {language}.",
  };
  const selected = isLanguageUnavailable.value
    ? bundle.languageUnavailable || fallbackUnavailable
    : bundle.notFound || fallbackNotFound;
  const language = locale ? getLanguageName(locale, locale) : '';

  return {
    code: selected.code || (isLanguageUnavailable.value ? '406' : '404'),
    title: selected.title || (isLanguageUnavailable.value ? 'Unavailable' : 'Page Not Found'),
    message: formatMessage(
      selected.message || (isLanguageUnavailable.value ? fallbackUnavailable.message : fallbackNotFound.message),
      { language }
    ),
  };
});

const suggestionsTitle = computed(() => {
  const locale = currentLocale.value;
  const bundle = getBundle(locale);
  const fallback = {
    availableIn: 'Available in:',
    didYouMean: 'You might be looking for:',
  };
  const selected = bundle.suggestions || fallback;
  return isLanguageUnavailable.value
    ? selected.availableIn || fallback.availableIn
    : selected.didYouMean || fallback.didYouMean;
});
</script>

<template>
  <div class="vp-doc dp-not-found">
    <div class="VPContent" style="text-align: center">
      <div class="NotFound">
        <p class="code">{{ notFoundText.code }}</p>
        <h1 class="title">{{ notFoundText.title }}</h1>
        <p class="quote">{{ notFoundText.message }}</p>

        <div class="not-found-button-group">
          <a class="not-found-button" href="/" aria-label="go to home">Home</a>

          <div id="local-search">
            <a
              class="not-found-button"
              style="cursor: pointer; user-select: none"
              onclick="document.querySelector('.DocSearch-Button').click()"
            >
              Search
            </a>
          </div>
        </div>

        <div v-if="suggestions.length" class="suggestions">
          <p class="suggestions-title">
            {{ suggestionsTitle }}
            <span v-for="(item, index) in suggestions" :key="item.link">
              <a :href="item.link" class="suggestion-link">{{ item.label }}</a>
              <span v-if="index < suggestions.length - 1">, </span>
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Buttons */
.not-found-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: 1px solid var(--vp-c-brand-1);
  border-radius: 16px;
  padding: 6px 16px;
  text-decoration: none;
  line-height: 1.2;

  white-space: nowrap; /* keep each label on one line */
}

/*
Responsive group:
- Default: We try to keep them on ONE line if they fit (no forced wrap)
- Mobile: avoid big vertical gaps; wrap only if necessary with small spacing
*/
.not-found-button-group {
  display: flex;
  justify-content: center;
  align-items: center;

  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
}

@media (max-width: 600px) {
  .not-found-button-group {
    gap: 10px;
    margin-top: 10px;
  }
}

.dp-not-found {
  padding: 64px 24px 96px;
  min-height: calc(100vh - var(--vp-nav-height));
  display: flex;
  align-items: center;
  justify-content: center;
}

.code {
  line-height: 1;
  font-size: 64px;
  font-weight: 700;
  background: linear-gradient(120deg, var(--vp-c-brand-1) 30%, var(--vp-c-brand-2));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
}

.suggestions-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
}

.suggestion-link {
  color: var(--vp-c-brand-1);
  transition: all 0.25s;
}

.suggestion-link:hover {
  color: var(--vp-c-brand-2);
}
</style>
