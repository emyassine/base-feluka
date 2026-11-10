<template>
  <footer class="ndc-footer" role="contentinfo">
    <!-- ── Main grid ─────────────────────────────────────────── -->
    <div class="ndc-footer__inner">
      <!-- Brand -->
      <div class="ndc-footer__brand">
        <a :href="withBase('/')" class="ndc-footer__brand-link" :aria-label="siteTitle + ' — accueil'">
          <div class="">
            <img v-if="logo" :src="withBase(logo)" :alt="siteTitle" loading="lazy" width="30" height="30" />
            <span v-else class="ndc-footer__logo-letter">N</span>
          </div>
          <span class="ndc-footer__site-name">{{ siteTitle }}</span>
        </a>

        <p v-if="siteDesc" class="ndc-footer__desc">{{ siteDesc }}</p>

        <!-- Social -->
        <div v-if="socialLinks.length" class="ndc-footer__social" :aria-label="t('footer.social', 'Réseaux sociaux')">
          <a
            v-for="social in socialLinks"
            :key="social.icon"
            :href="social.link"
            class="ndc-footer__social-link"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="social.icon"
          >
            <component :is="getSocialIcon(social.icon)" :size="15" aria-hidden="true" />
          </a>
        </div>
      </div>

      <!-- Nav columns -->
      <nav v-if="menuGroups.length" class="ndc-footer__nav" aria-label="Navigation du pied de page">
        <div v-for="group in menuGroups" :key="group.label" class="ndc-footer__col">
          <p class="ndc-footer__col-title">{{ group.label }}</p>
          <ul class="ndc-footer__col-list" role="list">
            <li v-for="item in group.items" :key="item.link">
              <a class="ndc-footer__link" :href="withBase(item.link)">
                <component :is="ChevronRight" :size="11" class="ndc-footer__link-icon" aria-hidden="true" />
                {{ item.text }}
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <!-- ── Divider ────────────────────────────────────────────── -->
    <div class="ndc-footer__divider" aria-hidden="true" />

    <!-- ── Bottom bar ─────────────────────────────────────────── -->
    <div class="ndc-footer__bottom">
      <p class="ndc-footer__copy">
        <component :is="Copyright" :size="12" aria-hidden="true" />
        {{ year }} {{ siteTitle }}. Tous droits réservés.

      <nav v-if="legalLinks.length" class="ndc-footer__legal" style="padding-left:2rem;" :aria-label="t('footer.legal', 'Legal Links')">
        <template v-for="(item, index) in legalLinks" :key="`${item.key}-${item.link}`">
          <template v-if="item.items?.length">
            <NDCDropdown
              :items="item.items.map(child => ({ label: t(child.key, child.key), href: withBase(child.link) }))"
              placement="bottom-end"
              width="sm"
            >
              <template #trigger>
                <button type="button" class="ndc-footer__legal-link">
                  {{ t(item.key, item.key) }}
                </button>
              </template>
            </NDCDropdown>
          </template>
          <template v-else>
            <a
              class="ndc-footer__legal-link"
              :href="withBase(item.link)"
              :target="item.external ? '_blank' : undefined"
              :rel="item.external ? 'noopener noreferrer' : undefined"
            >
              {{ t(item.key, item.key) }}
            </a>
          </template>
          <span v-if="index < legalLinks.length - 1" class="ndc-footer__dot" aria-hidden="true" />
        </template>
      </nav>
      </p>

      <p class="ndc-footer__locale">
        <component :is="Globe" :size="12" aria-hidden="true" />
        {{ localeLabel }}
      </p>
    </div>

    <!-- ── Wordmark ───────────────────────────────────────────── -->
    <div
      ref="wordmarkRef"
      class="ndc-footer__wordmark"
      style="padding-top: 1rem; padding-bottom: 2rem"
      aria-hidden="true"
    >
      <template v-if="siteTitleParts">
      <span class="ndc-footer__wordmark-ink">
            <span class="ndc-footer__wordmark-part ndc-footer__wordmark-part--left">
                {{ siteTitleParts.parts[0] }}
            </span>
        <span class="ndc-footer__wordmark-part ndc-footer__wordmark-part--right">
          {{ siteTitleParts.parts[1] }}.
        </span>
      </span>
      </template>
      <template v-else>
        <span class="ndc-footer__wordmark-ink">
            {{ siteTitle }}.
        </span>
      </template>
    </div>
  </footer>
</template>

<script setup lang="ts">
    import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
    import * as lucideIcons from 'lucide-vue-next';
    import {
      Github,
      Twitter,
      Linkedin,
      Youtube,
      Instagram,
      Facebook,
      MessageCircle,
      Rss,
      Globe,
      Link,
      ChevronRight,
      Copyright,
    } from 'lucide-vue-next';
    import { useData, useRoute, withBase } from 'vitepress';
    import NDCDropdown from '../base/NDCDropdown.vue';
    import type { SiteTitleParts } from '../../../.vitepress/utils/branding';
    import { formatLocaleDisplay, getRuntimeRegionHint } from '../../../.vitepress/settings/geoloc';
    import { translateKey } from '../../../.vitepress/utils/i18n';

    /* ── Types ───────────────────────────────────────────────────── */
    type NavItem = {
      text?: string;
      link?: string;
      items?: NavItem[];
    };

    type SidebarItem = {
      text?: string;
      link?: string;
      items?: SidebarItem[];
      base?: string;
    };

    type SocialLink = {
      icon: string;
      link: string;
    };

    type FooterLink = {
      key: string;
      link: string;
      external?: boolean;
      group?: string;
      items?: FooterLink[];
    };

    /* ── VitePress ───────────────────────────────────────────────── */
    const { theme, site, lang } = useData();
    const route = useRoute();

    /* ── Social icon map ─────────────────────────────────────────── */
    const socialIconMap: Record<string, any> = {
      github: Github,
      x: Twitter,
      twitter: Twitter,
      linkedin: Linkedin,
      youtube: Youtube,
      instagram: Instagram,
      facebook: Facebook,
      discord: MessageCircle,
      mastodon: Globe,
      rss: Rss,
    };

    const getSocialIcon = (icon: string) => socialIconMap[icon.toLowerCase()] ?? Link;

    /* ── Sidebar helpers ─────────────────────────────────────────── */
    const sidebarConfig = computed(() => theme.value?.sidebar);

    const normalizePath = (value: string): string => {
      if (!value) return '/';
      const cleaned = value.replace(/\\/g, '/').replace(/\/+$/, '');
      return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
    };

    const extractSidebarLinks = (items: SidebarItem[]): { text: string; link: string }[] => {
      const out: { text: string; link: string }[] = [];
      for (const item of items) {
        if (item?.items?.length) {
          for (const child of item.items) {
            if (child?.text && child?.link) out.push({ text: child.text, link: child.link });
          }
          continue;
        }
        if (item?.text && item?.link) out.push({ text: item.text, link: item.link });
      }
      return out;
    };

    const resolveSidebarForLink = (link?: string): SidebarItem[] => {
      if (!link) return [];
      const raw = sidebarConfig.value;
      if (!raw) return [];
      if (Array.isArray(raw)) return raw as SidebarItem[];
      const map = raw as Record<string, SidebarItem[] | { items?: SidebarItem[] }>;
      const keys = Object.keys(map).sort((a, b) => b.length - a.length);
      const target = normalizePath(link);
      const key = keys.find(prefix => target.startsWith(normalizePath(prefix)));
      if (!key) return [];
      const entry = map[key];
      if (Array.isArray(entry)) return entry as SidebarItem[];
      if (entry && Array.isArray((entry as any).items)) return (entry as any).items as SidebarItem[];
      return [];
    };

    /* ── Menu groups ─────────────────────────────────────────────── */
    const navItems = computed<NavItem[]>(() => (Array.isArray(theme.value?.nav) ? theme.value.nav : []));

    const menuGroups = computed(() => {
      const out: { label: string; items: { text: string; link: string }[] }[] = [];
      for (const item of navItems.value) {
        const label = item?.text || '';
        let items: { text: string; link: string }[] = [];
        if (Array.isArray(item?.items) && item.items.length) {
          items = item.items
            .filter(child => child?.text && child?.link)
            .map(child => ({ text: child.text as string, link: child.link as string }));
        } else if (item?.link) {
          items = extractSidebarLinks(resolveSidebarForLink(item.link));
        }
        if (!items.length && item?.text && item?.link) {
          items = [{ text: item.text, link: item.link }];
        }
        if (label && items.length) out.push({ label, items });
      }
      return out;
    });

    /* ── Meta ────────────────────────────────────────────────────── */
    const siteTitle = computed(() => site.value?.title || 'Numerimondes');
    const siteDesc = computed(() => site.value?.description || '');
    const logo = computed(() => theme.value?.logo || '');
    const socialLinks = computed<SocialLink[]>(() =>
      Array.isArray(theme.value?.socialLinks) ? theme.value.socialLinks : []
    );
    const defaultLocale = computed(() => {
      const fromTheme = (theme.value as any)?.defaultLocale;
      if (typeof fromTheme === 'string' && fromTheme) return fromTheme.toLowerCase();
      const fromSite = (site.value as any)?.defaultLocale;
      if (typeof fromSite === 'string' && fromSite) return fromSite.toLowerCase();
      const lang = (site.value?.lang || '').split('-')[0];
      return lang || 'en';
    });
    const localeKeys = computed(() => Object.keys(site.value?.locales || {}));
    const currentLocale = computed(() => {
      const fromLang = (lang.value || '').split('-')[0];
      if (fromLang && localeKeys.value.includes(fromLang)) return fromLang;
      const parts = (route.path || '').split('/').filter(Boolean);
      const candidate = parts[0];
      if (candidate && localeKeys.value.includes(candidate)) return candidate;
      return defaultLocale.value;
    });
    const i18nMessages = computed(() => (theme.value as any)?.i18nMessages || {});
    const t = (key: string, fallbackText?: string) =>
      translateKey(i18nMessages.value, currentLocale.value, defaultLocale.value, key, fallbackText);
    const siteTitleParts = computed<SiteTitleParts | null>(() => {
      const raw = (theme.value as any)?.siteTitleParts;
      if (!raw) return null;
      if (typeof raw.full === 'string' && Array.isArray(raw.parts) && raw.parts.length >= 2) {
        return { full: raw.full, parts: [raw.parts[0], raw.parts[1]] };
      }
      if (Array.isArray(raw) && raw.length >= 2) {
        return { full: siteTitle.value, parts: [raw[0], raw[1]] };
      }
      return null;
    });
    const legalLinks = computed<FooterLink[]>(() => {
      const raw = (theme.value as any)?.footerLinks || (site.value as any)?.themeConfig?.footerLinks || {};
      if (Array.isArray(raw)) return raw;
      if (raw && typeof raw === 'object') {
        return raw[currentLocale.value] || raw[defaultLocale.value] || raw.en || raw.fr || [];
      }
      return [];
    });
    const localeLabel = computed(() => {
      const regionHint = getRuntimeRegionHint();
      return formatLocaleDisplay({
        locale: currentLocale.value,
        uiLocale: currentLocale.value,
        regionHint,
      }).label;
    });
    const year = new Date().getFullYear();

    const wordmarkRef = ref<HTMLElement | null>(null);

    const setWordmarkPoint = (event: MouseEvent) => {
      const container = wordmarkRef.value;
      if (!container) return;
      const ink = container.querySelector('.ndc-footer__wordmark-ink') as HTMLElement | null;
      if (!ink) return;
      const rect = ink.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      ink.style.setProperty('--wm-x', `${x}px`);
      ink.style.setProperty('--wm-y', `${y}px`);
      ink.classList.add('ndc-footer__wordmark--active');
    };

    const clearWordmarkPoint = () => {
      const container = wordmarkRef.value;
      if (!container) return;
      const ink = container.querySelector('.ndc-footer__wordmark-ink') as HTMLElement | null;
      if (!ink) return;
      ink.classList.remove('ndc-footer__wordmark--active');
    };

    onMounted(() => {
      const el = wordmarkRef.value;
      if (!el) return;
      el.addEventListener('mousemove', setWordmarkPoint);
      el.addEventListener('mouseleave', clearWordmarkPoint);
    });

    onBeforeUnmount(() => {
      const el = wordmarkRef.value;
      if (!el) return;
      el.removeEventListener('mousemove', setWordmarkPoint);
      el.removeEventListener('mouseleave', clearWordmarkPoint);
    });
</script>

<style scoped>
/* ── Tokens ──────────────────────────────────────────────────── */
.ndc-footer {
  --f-bg: var(--vp-c-bg-soft);
  --f-border: color-mix(in srgb, var(--vp-c-divider) 60%, transparent);
  --f-muted: var(--vp-c-text-3);
  --f-sub: var(--vp-c-text-2);
  --f-text: var(--vp-c-text-1);
  --f-accent: var(--vp-c-brand-1);
  --f-accent-soft: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  --f-max: var(--vp-layout-max-width, 1280px);
  --f-px: 32px;
  --f-radius: 10px;

  border-top: 1px solid var(--f-border);
  background: var(--f-bg);
  color: var(--f-sub);
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
}

/* ── Inner ───────────────────────────────────────────────────── */
.ndc-footer__inner {
  max-width: var(--f-max);
  width: 100%;
  margin: 0 auto;
  padding: 3rem var(--f-px) 2.5rem;
  display: flex;
  gap: 3rem;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  box-sizing: border-box;
}

/* ── Brand ───────────────────────────────────────────────────── */
.ndc-footer__brand {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 240px;
  flex-shrink: 0;
  box-sizing: border-box;
}

.ndc-footer__brand-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  width: fit-content;
}

.ndc-footer__logo {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--f-radius);
  background: color-mix(in srgb, var(--f-text) 7%, transparent);
  border: 1px solid var(--f-border);
  flex-shrink: 0;
  transition: background 0.18s;
  overflow: hidden;
}

.ndc-footer__brand-link:hover .ndc-footer__logo {
  background: var(--f-accent-soft);
}

.ndc-footer__logo img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.ndc-footer__logo-letter {
  font-size: 1rem;
  font-weight: 700;
  color: var(--f-text);
  letter-spacing: -0.03em;
  line-height: 1;
}

.ndc-footer__site-name {
  font-size: 0.9rem;
  color: var(--f-text);
  letter-spacing: -0.02em;
  line-height: 1;
}

.ndc-footer__site-name--split {
  display: inline-flex;
  gap: 6px;
}

.ndc-footer__site-name-part {
  display: inline-block;
}

.ndc-footer__desc {
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--f-sub);
  margin: 0;
}

/* ── Social ──────────────────────────────────────────────────── */
.ndc-footer__social {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ndc-footer__social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: var(--f-sub);
  background: color-mix(in srgb, var(--f-text) 5%, transparent);
  border: 1px solid var(--f-border);
  text-decoration: none;
  transition:
    color 0.15s,
    background 0.15s,
    border-color 0.15s,
    transform 0.15s;
}

.ndc-footer__social-link:hover {
  color: var(--f-text);
  background: var(--f-accent-soft);
  border-color: color-mix(in srgb, var(--f-accent) 30%, transparent);
  transform: translateY(-2px);
}

/* ── Nav ─────────────────────────────────────────────────────── */
.ndc-footer__nav {
  display: flex;
  gap: 2rem 3rem;
  flex-wrap: wrap;
  align-items: flex-start;
  flex: 1;
  min-width: 0;
  justify-content: flex-end;
}

.ndc-footer__col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 120px;
}

.ndc-footer__col-title {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--f-text);
  margin: 0 0 2px;
}

.ndc-footer__col-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ndc-footer__link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: var(--f-sub);
  text-decoration: none;
  line-height: 1.4;
  transition:
    color 0.14s,
    gap 0.14s;
}

.ndc-footer__link:hover {
  color: var(--f-text);
  gap: 6px;
}

.ndc-footer__link-icon {
  flex-shrink: 0;
  transition: opacity 0.14s;
}


/* ── Divider ─────────────────────────────────────────────────── */
.ndc-footer__divider {
  max-width: var(--f-max);
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--f-px);
  border-top: 1px solid var(--f-border);
  box-sizing: border-box;
}

/* ── Bottom ──────────────────────────────────────────────────── */
.ndc-footer__bottom {
  max-width: var(--f-max);
  width: 100%;
  margin: 0 auto;
  padding: 1rem var(--f-px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 16px;
  box-sizing: border-box;
}

.ndc-footer__copy {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: var(--f-muted);
  margin: 0;
  white-space: nowrap;
}

.ndc-footer__legal {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.ndc-footer__legal-link {
  font-size: 0.8rem;
  color: var(--f-muted);
  text-decoration: none;
  transition: color 0.14s;
  white-space: nowrap;
}

.ndc-footer__legal-link:hover {
  color: var(--f-text);
}

.ndc-footer__dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--f-border);
  display: inline-block;
  flex-shrink: 0;
}

.ndc-footer__locale {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  color: var(--f-muted);
  margin: 0;
  white-space: nowrap;
}

/* ── Wordmark ────────────────────────────────────────────────── */
.ndc-footer__wordmark {
  width: 100%;
  margin-top: 1rem;
  padding: 0 var(--f-px);
  text-align: center;
  font-size: clamp(60px, 14vw, 220px);
  letter-spacing: -0.05em;
  line-height: 0.85;

  user-select: none;
  pointer-events: auto;
  overflow: hidden;
  display: block;
  white-space: nowrap;
  box-sizing: border-box;
  position: relative;
  isolation: isolate;

  --wm-base: color-mix(in srgb, var(--vp-c-text-1) 6%, transparent);
  --wm-glow: transparent;
}

.ndc-footer__wordmark-ink {
  display: inline-block;

  --wm-bg:
    radial-gradient(
      240px 240px at var(--wm-x, -999px) var(--wm-y, -999px),
      var(--wm-glow),
      transparent 70%
    ),
    linear-gradient(var(--wm-base), var(--wm-base));
  background: var(--wm-bg);

  color: transparent;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  background-repeat: no-repeat;
}

.ndc-footer__wordmark--active {
  --wm-glow: color-mix(in srgb, var(--f-accent) 70%, transparent);
}

.ndc-footer__wordmark-part {
  display: inline;
  white-space: nowrap;
}

.ndc-footer__wordmark-sup {
  font-size: 0.65em;
  vertical-align: super;
  display: inline-block;

  color: transparent !important;
  -webkit-text-fill-color: transparent !important;
  -webkit-background-clip: text;
  background-clip: text;
  background: var(--wm-bg);
}


/* ── Responsive 960px ────────────────────────────────────────── */
@media (max-width: 960px) {
  .ndc-footer__inner {
    flex-direction: column;
    gap: 2.5rem;
    padding-top: 2.5rem;
    padding-bottom: 2rem;
  }

  .ndc-footer__brand {
    width: 100%;
  }

  .ndc-footer__nav {
    justify-content: flex-start;
    gap: 1.75rem 2.5rem;
    width: 100%;
  }
}

/* ── Responsive 640px ────────────────────────────────────────── */
@media (max-width: 640px) {
  .ndc-footer__inner {
    padding: 2rem 20px 1.5rem;
  }

  .ndc-footer__nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.5rem 1rem;
  }

  .ndc-footer__bottom {
    padding: 0.9rem 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .ndc-footer__wordmark {
    text-align: left;
    padding: 0 20px;
    font-size: clamp(48px, 18vw, 120px);
    white-space: normal;
  }

  .ndc-footer__wordmark-part {
    display: block;
  }

  .ndc-footer__wordmark-part--left {
    text-align: left;
  }

  .ndc-footer__wordmark-part--right {
    text-align: right;
  }

  .ndc-footer__site-name--split {
    display: block;
    line-height: 1.1;
  }

  .ndc-footer__site-name-part {
    display: block;
  }

  .ndc-footer__site-name-part--left {
    text-align: left;
  }

  .ndc-footer__site-name-part--right {
    text-align: right;
  }
}

/* ── Dark mode ───────────────────────────────────────────────── */
.dark .ndc-footer__logo {
  background: color-mix(in srgb, var(--f-text) 9%, transparent);
}

.dark .ndc-footer__social-link {
  background: color-mix(in srgb, var(--f-text) 7%, transparent);
}

.dark .ndc-footer {
  --f-bg: var(--nds-bg-dark-color, var(--vp-c-bg-soft));
  --f-border: color-mix(in srgb, var(--vp-c-divider) 60%, transparent);
  --f-muted: var(--vp-c-text-3);
  --f-sub: var(--vp-c-text-2);
  --f-text: var(--vp-c-text-1);
  --f-accent: var(--vp-c-brand-1);
  --f-accent-soft: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
}
</style>
