# Feluqa Floating Subnav - Complete Implementation Plan

## Objective
For the **company guide**, the floating subnav must display **ONLY**:
```
Company | — | How We Work | Founder | Business and HR Leaders | — | Our Brand
```

### Must NOT display:
- Numerimondes (site title appearing in subnav)
- Logo, Colors, Type, Photos, Icons, Attributions (pages from brand subfolder)
- Contact
- Duplicates (Company appearing twice)

---

## File Structure & Required Changes

### 1. `docs/site-2/.site/spmpst.definitions.json`
**Status: OK** - Already has global floatingSubnav config:
```json
{
  "site": {
    "name": "Numerimondes",
    "description": "...",
    "floatingSubnav": {
      "layouts": ["home"],
      "exclude": ["/"]
    }
  },
  "subguides": [...]
}
```

---

### 2. `docs/site-2/src/guides/company/spmpst.subheader.json`
**ACTION: CREATE THIS FILE**
```json
{
  "exclude": [
    "/company/brand/*",
    "/company/contact"
  ],
  "include": [
    "separator",
    {
      "label": {
        "en": "Our Brand",
        "fr": "Notre Marque"
      },
      "path": "/company/brand/logo"
    }
  ]
}
```

**Logic Explanation:**
- Automatically includes ALL pages directly in company/ root folder
- `exclude`: Removes pages matching patterns (supports `*` wildcards)
- `include`: Adds custom entries after automatic ones (supports `"separator"` and custom links)

---

### 3. `docs/vitepress-site/app/scripts/preparation/content-stage.mjs`
**ACTION: MODIFY - Add subheader config support**

#### STEP 1: After guide configs are loaded (around line 134)
Add code to load `spmpst.subheader.json` files:
```javascript
// Load spmpst.subheader.json for each guide
const guideSubheaderConfigs = new Map()
for (const guide of config.subguides) {
  const subheaderPath = resolve(sourceRoot, guide.path, 'spmpst.subheader.json')
  if (existsSync(subheaderPath)) {
    try {
      const subheaderConfig = JSON.parse(await readFile(subheaderPath, 'utf8'))
      guideSubheaderConfigs.set(guide.path, subheaderConfig)
    } catch (error) {
      console.warn(`Failed to load subheader config for guide ${guide.path}: ${error.message}`)
    }
  }
}
```

#### STEP 2: Create buildSubheaderLinks function (after the above code)
```javascript
// Build subheader links according to config (automatic + include/exclude rules)
const buildSubheaderLinks = (guidePath, language, guideEntryPage) => {
  const subheaderConfig = guideSubheaderConfigs.get(guidePath)
  const langPrefix = localePrefix(language, defaultLanguage, prefixDefaultLanguage).join('/')
  const langPathPrefix = langPrefix ? `/${langPrefix}` : ''
  
  const guide = config.subguides.find(g => g.path === guidePath)
  const guideLabel = guide?.labels?.[language] || guide?.label || guidePath
  const guideHomeHref = localizedGuideHome(guide, language)
  
  // Get all pages for this guide
  let allGuidePages = localizedPages
    .filter((candidate) => candidate.guide?.path === guidePath && candidate.language === language)
    .map(({ title, route, sidebarTitle }) => {
      const isGuideEntryPage = route === guideHomeHref
      const pageTitleFinal = isGuideEntryPage ? guideLabel : (sidebarTitle || title)
      return { title: pageTitleFinal, href: route }
    })
  
  // Apply exclude rules (with wildcard support)
  if (subheaderConfig?.exclude) {
    const excludedRoutes = new Set()
    subheaderConfig.exclude.forEach(pattern => {
      if (pattern.includes('*')) {
        const prefix = pattern.replace(/\*$/, '')
        allGuidePages.forEach(page => {
          if (page.href.startsWith(prefix)) {
            excludedRoutes.add(page.href)
          }
        })
      } else {
        excludedRoutes.add(langPathPrefix + pattern)
      }
    })
    allGuidePages = allGuidePages.filter(page => !excludedRoutes.has(page.href))
  }
  
  // Apply include rules (adds custom links and separators)
  if (subheaderConfig?.include) {
    subheaderConfig.include.forEach(item => {
      if (item === 'separator') {
        allGuidePages.push({ type: 'separator' })
      } else {
        const label = item.label?.[language] ?? item.label?.en ?? item.label ?? item.path
        let href = item.path
        if (href?.startsWith('/')) {
          href = `${langPathPrefix}${href}`
        } else {
          href = `${langPathPrefix}/${guidePath}/${item.path}`
        }
        allGuidePages.push({ title: label, href, type: 'custom', custom: true })
      }
    })
  }
  
  return allGuidePages
}
```

#### STEP 3: Replace the floating subnav generation loop (originally around line 482)
**REMOVE the first loop** that iterates over `localizedPages` and **ONLY KEEP** the guide-based loop, modified like this:

**BEFORE (DELETE THIS):**
```javascript
for (const page of localizedPages) {
  // ... generates per-page floating subnav
}

for (const guide of config.subguides) {
  // ... generates per-guide-home floating subnav
}
```

**AFTER (KEEP ONLY):**
```javascript
// Generate floating subnav for each guide and apply to ALL pages in that guide
for (const guide of config.subguides) {
  for (const language of config.languages) {
    const guidePages = localizedPages.filter(page => page.guide?.path === guide.path && page.language === language)
    if (guidePages.length === 0) continue
    
    const firstPage = guidePages[0]
    const rules = mergedSubnavRules(siteSubnavRules, guide.floatingSubnav ?? {})
    const homeHref = localizedGuideHome(guide, language)
    const canonicalHome = canonicalPagePath(homeHref)
    const included = rules.include.includes(canonicalHome)
    const excluded = rules.exclude.includes(canonicalHome)
    if (excluded || (!included && !rules.layouts.includes(firstPage.layout))) continue
    
    const links = buildSubheaderLinks(guide.path, language, firstPage)
    const guideKey = generatedGuideKeys.get(guide.path)
    const logo = generatedGuideColors[guideKey] ?? generatedGuideColors.root ?? {}
    
    // Apply same floating subnav to ALL pages in this guide
    for (const page of guidePages) {
      const routeKey = page.route.replace(/\/+$/, '') || '/'
      generatedFloatingSubnav[routeKey] = {
        title: localizedGuideLabel(guide, language),
        homeHref,
        homePageHref: firstPage.route,
        links,
        logoLight: logo.logoLight,
        logoDark: logo.logoDark,
        logoMiniLight: logo.logoMiniLight,
        logoMiniDark: logo.logoMiniDark,
        logoAlt: logo.logoAlt,
        logoWidth: logo.logoWidth,
        logoHeight: logo.logoHeight,
        logoExtraStyle: logo.logoExtraStyle,
        navigationLabel: language.toLowerCase().startsWith('fr') ? 'Navigation de la section' : 'Section navigation',
        menuLabel: language.toLowerCase().startsWith('fr') ? 'Ouvrir la navigation de la section' : 'Open section navigation',
      }
    }
  }
}

// Also handle root pages (pages not in any guide)
for (const page of localizedPages.filter(p => !p.guide)) {
  const rules = mergedSubnavRules(siteSubnavRules, {})
  const included = rules.include.includes(page.canonical)
  const excluded = rules.exclude.includes(page.canonical)
  const enabled = !excluded && (included || rules.layouts.includes(page.layout))
  if (!enabled) continue
  const routeKey = page.route.replace(/\/+$/, '') || '/'
  const logo = generatedGuideColors.root ?? {}
  generatedFloatingSubnav[routeKey] = {
    title: config.site?.name ?? '',
    homeHref: '/',
    homePageHref: page.route,
    links: [],
    logoLight: logo.logoLight,
    logoDark: logo.logoDark,
    logoMiniLight: logo.logoMiniLight,
    logoMiniDark: logo.logoMiniDark,
    logoAlt: logo.logoAlt,
    logoWidth: logo.logoWidth,
    logoHeight: logo.logoHeight,
    logoExtraStyle: logo.logoExtraStyle,
    navigationLabel: page.language.toLowerCase().startsWith('fr') ? 'Navigation de la section' : 'Section navigation',
    menuLabel: page.language.toLowerCase().startsWith('fr') ? 'Ouvrir la navigation de la section' : 'Open section navigation',
  }
}
```

---

### 4. `docs/vitepress-site/app/.vitepress/theme/FloatingSubnav.vue`
**ACTION: MODIFY - Add separator support**

#### Template: Inline links (around line 28-38)
**BEFORE:**
```vue
<div class="floating-subnav__links">
  <a
    v-for="link in visibleLinks"
    :key="link.href"
    class="floating-subnav__link"
    :href="link.href"
    :aria-current="isCurrentPage(link.href) ? 'page' : undefined"
  >
    {{ link.title }}
  </a>
</div>
```

**AFTER:**
```vue
<div class="floating-subnav__links">
  <template v-for="link in visibleLinks">
    <div v-if="link.type === 'separator'" :key="link.type" class="floating-subnav__separator" aria-hidden="true" />
    <a
      v-else
      :key="link.href"
      class="floating-subnav__link"
      :href="link.href"
      :aria-current="isCurrentPage(link.href) ? 'page' : undefined"
    >
      {{ link.title }}
    </a>
  </template>
</div>
```

#### Template: Overflow menu (around line 68-75)
**BEFORE:**
```vue
<li v-for="link in menuLinks" :key="link.href">
  <a
    class="floating-subnav__menu-link"
    :href="link.href"
    :aria-current="isCurrentPage(link.href) ? 'page' : undefined"
    @click="menuOpen = false"
  >
    {{ link.title }}
  </a>
</li>
```

**AFTER:**
```vue
<template v-for="link in menuLinks">
  <li v-if="link.type !== 'separator'" :key="link.href">
    <a
      class="floating-subnav__menu-link"
      :href="link.href"
      :aria-current="isCurrentPage(link.href) ? 'page' : undefined"
      @click="menuOpen = false"
    >
      {{ link.title }}
    </a>
  </li>
  <li v-else :key="link.type" class="floating-subnav__menu-separator" aria-hidden="true" />
</template>
```

#### CSS: Add separator styles (after line 405)
**ADD:**
```css
.floating-subnav__separator {
  flex: none;
  width: 1px;
  height: 16px;
  margin-inline: 0.25rem 0.35rem;
  background: var(--fs-divider);
  align-self: center;
}
```

---

## Summary of Changes

| File | Action | Status |
|------|--------|--------|
| `docs/site-2/.site/spmpst.definitions.json` | Already configured | ✅ |
| `docs/site-2/src/guides/company/spmpst.subheader.json` | Create new file | 📝 |
| `docs/vitepress-site/app/scripts/preparation/content-stage.mjs` | Modify (add subheader support) | 📝 |
| `docs/vitepress-site/app/.vitepress/theme/FloatingSubnav.vue` | Modify (add separator support) | 📝 |

---

## Final Result

✅ **All pages in company guide** (`/company/`, `/company/how-we-work`, `/company/founder`, `/company/business-and-hr-leaders`) will show:
```
Company | — | How We Work | Founder | Business and HR Leaders | — | Our Brand
```

✅ **No duplicates, no unwanted pages, multilingual support, wildcards work**
