---
title: "New Structure"
sidebarTitle: "New Structure"
icon: "sparkles"
---

# NEW_STRUCTURE — Webkernel is PHP. Laravel is the panel host.

**Status:** working note (not an ADD).
**Date:** 2026-08-19
**Owner:** Yassine
**If this becomes law:** promote a slim version into `software/codebase/docs/decisions/add/`. Do not let this file become a second constitution.

This file exists because the frustration is real, the impulse to “take Laravel + Livewire + Filament + Alpine and rebuild Webkernel from scratch” is understandable, and doing that as a rewrite would destroy the product you already have.

The job here is to name what you actually own, what you actually rent, what the 11 000 files really are, and which new structure gives you control **without** spending two years reimplementing Illuminate poorly.

---

## 0. The sentence that upset you

Taylor Otwell, 2026-08-19, on X:

> PHP is an implementation detail of Laravel.

For Laravel Inc. that sentence is a product claim: the brand is Laravel, the language is interchangeable.

For Webkernel that sentence is inverted and wrong.

| Laravel Inc. | Webkernel (ADD-0002, ADD-0004) |
| --- | --- |
| Product = Laravel | Product = a sovereign PHP platform operators can own |
| PHP is a detail | PHP is the foundation |
| Filament/Livewire are the ecosystem | Filament/Livewire are the **operator UI** |
| Apps are Laravel apps | Hosts are Webkernel hosts that currently boot through Illuminate |

You already named the application `Webkernel` in `confighttps://www.numerimondes.com/app.php`. You already subclass `Illuminate\Foundation\Application` as `Webkernel\WebApp`. You already expose `webapp()` instead of `auth()`. You already 304 public markdown **before** `bootstraphttps://www.numerimondes.com/app.php`.

The identity is half-extracted. The boot path is not. That mismatch is what drives you crazy — not the absence of a kernel.

**Target sentence (the one this structure is for):**

> Laravel is an implementation detail of the **operator plane**. PHP is the implementation of Webkernel.

Not: “rewrite Laravel.”
Not: “stay Laravel forever.”
This: **three planes, one product.**

---

## 1. What Claude got right, and what it missed

Claude’s method is correct: inventory first, then decide. Claude’s options table is generic and does not describe this tree.

### Right

- This is an architectural-clarity crisis, not a mood.
- PHP is not a detail here. Laravel is the tool.
- The useful question is ally vs enemy **inside** Laravel, not “leave Laravel tonight.”

### Wrong or incomplete on *this* repo

| Claude said | This tree actually |
| --- | --- |
| No native ETag | Public MD already has ETag + 304 **before Laravel boot** (`public/index.php` → `md_http_revalidate.php`). Lifecycle assets also send ETag (`Webkernel\Paths\Assets`). |
| 11k files loaded for no reason | `node_modules` has **11 046 files**. Composer has **201 packages**. `third_party` has **20 341 PHP files**. Your `software/` has **~715 PHP files**. Disk ≠ runtime. |
| Hello world is slow because Laravel is heavy | Hello world is slow because a **cache miss** still renders `DynamicMdPage extends Filament\Pages\Page` — a Livewire full-page component — and package discovery registers Filament, Livewire, Shield, Octane, Sanctum, imagery, onboarding, bookstore, … on every miss. |
| Options: prune / Octane / Symfony / PHP-PSR / rewrite | Octane is **already** a `codebase` dependency. You already have a PHP-native router (`Webkernel\Paths\Router`) and a PHP-native 304 path. Symfony is already inside Laravel (HttpFoundation, Console, Process). A from-scratch kernel is not option 5 — it is what you **started** and did not finish. |

Do not run Claude’s “Étape 2 questionnaire” as if the answers were unknown. They are in the tree. See §4.

---

## 2. Measured inventory (this host, 2026-08-19)

Numbers from this working copy. Re-measure before any prune PR.

### Disk

| Tree | Size | Files |
| --- | --- | --- |
| `third_party/` (Composer vendor-dir) | 358 M | 20 341 `*.php` |
| `node_modules/` | 141 M | **11 046 files** ← the “11k” |
| `software/` (first-party PHP you write) | 52 M (incl. 6400 imagery SVGs) | ~715 `*.php` |

### Composer

| Kind | Count |
| --- | --- |
| Installed packages (`composer show`) | 201 |
| Discovered Laravel packages (`bootstrap/cache/packages.php`) | 38 |
| Host `require` (production identity) | `webkernel/{codebase,i18n,imagery,onboarding,plugin-mdsite}` + `numerimondes/{bookstore-manager,numerimondes-website}` |
| Host `require-dev` | pest, pint, rector, boost, pail, pao, faker, mockery, collision, phpstorm-stubs, pretty-routes |

Host `composer.json` does **not** require `laravel/framework` or `filament/filament` directly. Those enter through `webkernel/codebase` (and then every other package repeats them).

### Heaviest `third_party/` (disk)

| Path | Size | Mostly |
| --- | --- | --- |
| `jetbrains/` | 113 M | **dev** stubs |
| `phpstan/` | 48 M | **dev** |
| `laravel/` | 41 M | framework + octane + … |
| `filament/` | 39 M / **4 623 PHP** | operator UI |
| `rector/` | 25 M / **3 151 PHP** | **dev** |
| `livewire/` | 12 M / 355 PHP | panel runtime |
| `fakerphp/` | 12 M | **dev** |
| `symfony/` | 9.8 M / 1 213 PHP | HttpFoundation, Console, Process, … |
| `phpunit/` | 8.8 M / 1 311 PHP | **dev** |
| `nesbot/` | 5.8 M / 921 PHP | Carbon + locale data |
| `blade-ui-kit/` | 5.3 M | Heroicons |

Roughly **half of vendor disk is tools you do not boot on a public GET** (JetBrains stubs, PHPStan, Rector, PHPUnit, Pest, Faker). The other half is the real tax: Filament + Laravel + Livewire + Carbon + Symfony.

### Discovered providers that boot with the app

From `bootstrap/cache/packages.php` (abridged into jobs):

| Job | Packages |
| --- | --- |
| Operator UI | filament/* (10 packages), livewire, livewire/blaze, blade-heroicons, blade-icons, blade-capture-directive |
| Auth / ACL | laravel/sanctum, spatie/laravel-permission, bezhansalleh/filament-shield, filament-plugin-essentials |
| Host / platform | webkernel/codebase (empty providers array — registered from `WebApp::configure`), i18n, imagery, onboarding, plugin-mdsite (**including `CmsPanelProvider`**) |
| Modules | numerimondes/bookstore-manager (4 providers), numerimondes/numerimondes-website (3 providers) |
| Infra already present | laravel/octane, carbon |
| Dev leaking into discover | laravel/boost, laravel/mcp, laravel/pail, laravel/pao, laravel/roster, laravel/tinker, collision, pretty-routes |

That last row is part of the upset. Dev tooling is on the discovered-provider list of a product named Webkernel.

---

## 3. Classes you own vs classes you rent

You asked for a clear vision of classes you use compared to classes in the vendor tree. Start here. This is a **map**, not a complete census.

### 3.1 First-party surface (the kernel you already started)

```text
software/
├── codebase/          WebApp, WebAppApi, Request, Integrity, StdIds,
│                      Parsers (Markdown / YAML), PanelProvider, Tests
├── lifecycle/         Composer plugin, paths, Vite snapshot, Assets ETag,
│                      Webkernel\Paths\Router  ← PHP, no framework
├── i18n/              fast_i18n, locale middleware, Language models
├── imagery/           Filament icon picker (operator-plane library)
├── onboarding/        Filament full-screen wizard
└── plugin-mdsite/     Site / Page / Navigation / Authoring / Rendering /
                       Cms / PublicFront
```

Owned HTTP / host types that already pretend Laravel is an implementation detail:

| Class / entry | What it actually is |
| --- | --- |
| `Webkernel\WebApp` | `extends Illuminate\Foundation\Application`. Snake_case aliases over vendor camelCase. |
| `Webkernel\WebAppApi` | Discover-and-dispatch façade for `webapp()->auth()`, `host()`, `panel()`. |
| `Webkernel\Request` | `extends Illuminate\Http\Request` + short-circuit hooks. Capture still goes through Symfony HttpFoundation. |
| `Webkernel\Paths\Router` | Framework-free dispatcher under `/__webkernel-app/`. Called from `WebApp::configure()`. |
| `Webkernel\Paths\Assets` | Native ETag for package assets. |
| `public/index.php` | 304 for MD **before** `bootstraphttps://www.numerimondes.com/app.php`. Then `(require bootstraphttps://www.numerimondes.com/app.php)->handleRequest(Request::capture())`. |
| `md_http_revalidate.php` | Pure PHP ETag/304. Must stay lockstep with `MdPageConditionalGetMiddleware`. |
| `bootstrap/fast-boot.php` | Autoload / integrity / npm / vite.webapp.ts. Not a request kernel. |

### 3.2 What you rent (and cannot “take” without the host)

Filament 5 **is** Laravel + Livewire + Alpine. You cannot fork Filament onto a homemade kernel without forking Filament. That is the whole constraint.

| You want | You also get |
| --- | --- |
| Filament Pages, Actions, Tables, Forms, Panels | Livewire components, Alpine, Blade, Illuminate Http/Routing/View/Auth/Session/Validation |
| Livewire islands (`DashboardCreateFolder`, …) | Full Livewire service provider on the app |
| Eloquent in bookstore | Query builder, Carbon, collections, pagination |
| `Illuminate\Console\Command` | Artisan / Symfony Console |
| Blade for MD blocks | Blade compiler, view finder, Filament’s view stack if the page is a Filament Page |

### 3.3 Illuminate you actually import in `software/` (observed)

Not a complete list — a **use-shape**:

| Illuminate slice | Used for | Ally / enemy |
| --- | --- | --- |
| `Http\Request` / `Response` / `JsonResponse` / `RedirectResponse` | PublicFront + i18n routes | Ally (or Symfony HttpFoundation under it) |
| `Support\ServiceProvider` | Every package | Enemy **as global discovery**; ally as a register/boot hook |
| `Support\Facades\{Route,View,Event,Auth,Http,Blade,File}` | Glue | Enemy if they leak into domain; ally at the adapter edge |
| `Contracts\Support\Htmlable` | Almost every Filament Page title | Noise from Filament |
| `Contracts\View\View` | Livewire `render()` | Panel plane |
| `Database\Eloquent\Model` | CmsSite/CmsPage, i18n Language, Site Member, Subsite, **bookstore domain** | Ally **in modules that are databases**. Enemy as the page runtime for MD. |
| `Cookie` / `Session` / `CSRF` middleware | `CmsPanelDefinition` | Panel plane — correct |
| `Console\Command` | Warm/purge cache, fetch fonts | Ally |
| `Pagination\*` | MD search | Could be yours |
| `Support\Collection`, `Str`, `HtmlString` | Everywhere | Convenience tax. Do not rebuild Carbon/Collections first. |
| `Foundation\Http\Events\RequestHandled` | ETag on the Laravel miss path | Proof the miss path is still the Laravel kernel |
| `Http\Client` | cache warmer | Fine |

Queue / Mail / Notifications: **almost unused** in `software/`. Three `ShouldQueue` jobs live in `software-modules/module-webkernelphp-com`. Codebase still ships `jobs` / `job_batches` / `failed_jobs` migrations. That is Laravel imposing a shape you barely fill.

### 3.4 Filament / Livewire you actually import

Filament is not “a CRUD admin you might drop.” It is the **operator product** (ADD-0002: no-code default).

In `software/` today:

- **Filament `Page`**: Site CMS workspace pages, settings cluster, page builder, onboarding, **and public** `DynamicMdPage` + `MdSiteSearchPage`.
- **Filament Resources / Tables / Forms**: markdown pages, sites, authoring custom blocks (TipTap), imagery icon picker.
- **Filament Actions + Livewire islands**: `DashboardCreateFolder`, `BuilderTopbarActions`, `SidebarAddFolder` — this is the AGENTS.md pattern, not a Livewire app.
- **Livewire attributes**: `#[On]`, `#[Url]`, `#[Session]`, `#[Validate]`, `WithPagination` on public search.

The architectural bug is not “we use Filament.” The bug is **Filament `Page` is the public renderer.**

```php
// software/plugin-mdsite/src/PublicFront/DynamicMdPage.php
final class DynamicMdPage extends Page   // Filament\Pages\Page
```

`plugin-mdsite/docs/ARCHITECTURE.en.md` already forbids this:

> Public HTTP never loads Filament, TipTap editor runtime, or `Cms/*`.

That sentence is the new structure. It is not implemented on the miss path.

---

## 4. Answers to “what do you actually use?” (from the tree, not vibes)

| Question | Answer in this repo |
| --- | --- |
| Eloquent? | **Yes for modules that are databases** (bookstore: sales, stock, identity). **No as the public page store** (MD is files). CmsSite/CmsPage exist as Filament/Sushi-shaped models, not as the public source of truth. |
| Laravel routing? | Yes for panels and leftover public pages. **Also** `Webkernel\Paths\Router` for `/__webkernel-app/*`. Two routers is a smell and a seed. |
| Container / providers? | Yes. `WebAppApi` already sits on top of it. Replacing it with PHP-DI now is theatre. |
| Blade? | Yes. Block rendering, panel chrome, error pages. Livewire does not replace Blade. |
| Artisan? | Yes. Warm/purge, fonts, installer, integrity. Symfony Console underneath. Keep Artisan until the operator plane stays Laravel. |
| Queue / Jobs? | Barely. Do not rebuild queues. Do not let jobs tables define the kernel. |
| Events / Listeners? | `RequestHandled` for ETag. Onboarding events. Not a domain bus. |
| Filament? | **The operator UI.** Panels, forms, tables, actions, TipTap blocks, onboarding, bookstore boards. Not optional if ADD-0002 still holds. |
| Alpine? | Filament’s. You do not have a separate Alpine app. |
| Octane? | Already required. Not a new option — an unused lever until the public miss path stops being a Filament Page. |

---

## 5. Why hello world is slow (the real sequence)

A public GET today:

```text
public/index.php
  ├─ If If-None-Match: load Composer autoload only
  │     → md_http_revalidate.php
  │         → 304 + exit          ← this is Webkernel. Fast. You already built it.
  │
  └─ Miss / first visit:
        bootstrap/fast-boot.php
        WebApp::configure()       ← Illuminate\Foundation\Application
        Paths\Router::dispatch()  ← only /__webkernel-app/*
        Laravel HTTP kernel
        package providers         ← Filament + Livewire + Shield + modules + …
        DynamicMdPage (Filament Page / Livewire)
        Blade + MD parse
        MdPageConditionalGetMiddleware sets ETag
        HTML
```

So:

- **Repeat visitors with a fresh ETag** already skip Laravel. Native ETag exists. Stop saying it does not.
- **First byte / miss / HTML generation** still pays the full operator stack. That is the hello-world you hate.
- Octane would amortize boot. It would **not** make a Filament Page a hello world. It would make a warm Filament Page cheaper. Different problem.

The 11 000 `node_modules` files are not loaded by PHP. The 20 341 vendor PHP files are not all included. Composer classmap + providers + the Filament page class graph are. Measure that with `LARAVEL_START` + `get_included_files()` on:

| Probe | What it tells you |
| --- | --- |
| `GET /` with matching `If-None-Match` | 304 path budget (should be tiny) |
| `GET /` miss | true hello-world of the **product** |
| `GET /up` | Laravel health without Filament page |
| `GET /site-cms/...` | operator plane (allowed to be heavy) |
| `php artisan about` | CLI boot |

Until those five numbers exist in this file, do not start a rewrite.

---

## 6. The trap of “from scratch”

The fantasy:

> Take Laravel + Livewire + Filament + Alpine and create Webkernel with them from scratch so I control it all.

What that actually means, if you are honest:

1. Reimplement `Application`, HTTP kernel, pipeline, container, config, Blade compiler, translator, session, cookies, validation, hashing, Eloquent (bookstore), console, filesystem.
2. Keep Filament working. Filament will not run on your kernel unless your kernel **is** Laravel’s contracts.
3. Keep Livewire’s checksum/morph/islands protocol.
4. Lose two years of bookstore + Site CMS + i18n + onboarding while you chase `hello world` ms.
5. Still ship Carbon, Symfony HttpFoundation, and a CSS/JS toolchain.

You would not control “all of it.” You would control a worse Laravel, and Filament would still own the operator UI.

**Control is not obtained by owning every class.** Control is obtained by owning the **planes** and the **contracts between them**.

You already practice this in small:

- `webapp()->auth()` not `auth()->user()->name`
- snake_case on Webkernel types, camelCase only on Filament/Livewire forced APIs
- MD on disk as the portable source; TipTap is authoring-time
- 304 before the kernel
- `Paths\Router` with zero Illuminate

The new structure is: **finish that split**, do not start a fourth framework.

---

## 7. The structure (three planes)

```text
                    ┌─────────────────────────────────────┐
                    │            WEBKERNEL                │
                    │     PHP platform, files first       │
                    └─────────────────────────────────────┘
                     /                |                 \
                    /                 |                  \
         ┌─────────▼────────┐  ┌──────▼───────┐  ┌───────▼────────┐
         │  SERVE PLANE     │  │ OPERATOR     │  │  MODULE PLANE  │
         │  public HTTP     │  │ PLANE        │  │  domain apps   │
         │                  │  │ /site-cms    │  │  bookstore …   │
         │  PHP + MD +      │  │ Filament     │  │  Eloquent OK   │
         │  Blade blocks +  │  │ Livewire     │  │  queues OK     │
         │  ETag/disk       │  │ Alpine       │  │  Laravel OK    │
         │                  │  │ Blade        │  │                │
         │  NO Filament     │  │ Laravel host │  │  may use both  │
         │  NO Livewire     │  │              │  │  other planes  │
         │  NO TipTap       │  │              │  │                │
         │  NO Cms/*        │  │              │  │                │
         └─────────┬────────┘  └──────┬───────┘  └───────┬────────┘
                   │                  │                  │
                   └────────────┬─────┴──────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │  HOST CONTRACT        │
                    │  WebApp / webapp()    │
                    │  Request short-circuit│
                    │  Paths\Router         │
                    │  fast-boot / integrity│
                    └───────────────────────┘
```

### Plane A — Serve (the hello world)

**Owns:** resolve host → site → path → load `.md` → render Blade blocks → ETag / disk cache → HTML | MD | RSS | sitemap.

**Must not load:** Filament, Livewire, TipTap, `Cms/*`, Shield, bookstore providers, onboarding wizard.

**Already exists:** `md_http_revalidate.php`, `MdPageConditionalGetMiddleware`, `PageRenderer` / block rendering, disk cache under `bootstrap/cache/webkernel/md-site/`.

**Missing:** miss path is still `DynamicMdPage extends Filament\Pages\Page`.

**End state:** a public miss is PHP + your renderer + Blade. Laravel may still *create* the app for a while (pragmatic), but Filament must not. Later, the miss path should not create `WebApp` at all — same trick as 304, with HTML from disk cache, and a PHP renderer only on cache cold.

### Plane B — Operator (the product you sell to non-developers)

**Owns:** Site CMS, onboarding, imagery picker, bookstore boards, Shield, panels.

**May be heavy.** Operators accept a 200 ms Filament page. Visitors do not.

**Stack:** Laravel + Livewire + Filament + Alpine. This is allowed, named, and isolated.

**Rule:** operator packages register providers only when the request is operator (path prefix, or a dedicated front controller). They do not ride along on `GET /`.

### Plane C — Modules

A module that is a database (bookstore) uses Eloquent, migrations, Filament resources. A module that is a website (`numerimondes-website`) contributes MD content + maybe blocks, and must not pull the operator stack onto the public GET.

Modules **must not** decide the kernel. The kernel decides what a module may touch per plane.

### Host contract (already half-built)

Keep these as the only types a plane is allowed to assume:

1. `webapp()->…` composables (`Auth`, `Host`, `Panel`, later `Site`, `Cache`, `Clock` if needed).
2. `Webkernel\Request` short-circuits (plugins inject, return true if handled).
3. `Webkernel\Paths\Router` for kernel-owned URLs and assets.
4. Filesystem + ETag helpers that do not boot Illuminate.
5. Integrity / fast-boot for install, not for request.

`WebApp extends Application` stays until Plane A no longer needs it. When Plane A is free, `WebApp` can become a **panel host adapter** instead of the process singleton. That is the from-scratch you actually want — and it is an extraction, not a rewrite.

---

## 8. What to do (sequence). What not to do.

### Do not

- Start `software/kernel` as a new Illuminate.
- Replace Eloquent in bookstore to “be pure.”
- Replace Blade.
- Replace Filament as the operator UI in this phase.
- Swap the container for PHP-DI.
- Treat Octane as the architecture.
- Delete Carbon because locale files are fat.
- Write a second constitution. This file stays a working note.

### Do — in order

**P0 — Measure (one afternoon)**
Five probes in §5. Record ms, included files, memory, provider count. Put the table back here. Without it, every later PR is folklore.

**P1 — Stop lying about the public page**
`DynamicMdPage` / `MdSiteSearchPage` must stop extending `Filament\Pages\Page`. Public HTML is a controller + Blade (or a non-Livewire renderer you already have). This is the ARCHITECTURE.en.md contract. This is also the hello-world fix.

Search can stay Livewire **later**, behind `/search`, not on `/`.

**P2 — Split package discovery by plane**
Public GET must not register `CmsPanelProvider`, Filament, Shield, onboarding, bookstore boards, Boost, Pail, Tinker.

Concrete levers (pick one, do not invent three):

- `dont-discover` for operator packages + explicit register from panel providers.
- Two front controllers: `public/index.php` (serve) and `publichttps://www.numerimondes.com/app.php` or `/site-cms` bootstrap (operator).
- Deferred providers gated on path prefix.

Dev packages must not be in `packages.php` for production.

**P3 — One HTML cache, two doors**
304 door already exists. Add a **full-document disk-cache door** in `index.php` (autoload + read cached HTML + ETag, no `WebApp`). Renderer runs only on cold cache. `etag_rerender()` islands stay the exception, fetched over a tiny endpoint (`LiveIslandsController` already exists).

**P4 — Host API grows instead of Facades**
Every new `auth()`, `config()`, `View::` in first-party code is a regression unless it is at a plane-B edge. Prefer `webapp()->…`. Add composables when a concern repeats. Do not add composables for show.

**P5 — Only then: can `WebApp` stop extending `Application`?**
If Plane A is fast and Plane B still needs Laravel, you have the product. If you still want to own HTTP for the panel, you are choosing a multi-year Filament fork. That is a different ADD, and it needs a reason stronger than a tweet.

### Optional parallel (low risk)

- `--no-dev` production installs (drop JetBrains 113 M, Rector, PHPStan, PHPUnit from the *deployed* tree). This does not fix hello world. It fixes the “I am loading 11k for no reason” feeling on disk.
- Keep Octane for Plane B and for CLI workers. Do not use it to hide a Filament public page.

---

## 9. How this maps onto files you already have

| Existing file | Role in the new structure |
| --- | --- |
| `plugin-mdsite/docs/ARCHITECTURE.en.md` | Canonical for Plane A + authoring. **Obey it.** |
| `plugin-mdsite/docs/Product_ARCHITECTURE.md` | Plane B (workspaces, folders). |
| `software/codebase/docs/decisions/add/` | Platform law. This file is not that. |
| `AGENTS.md` | Coding rules while Laravel/Filament remain Plane B. |
| `src/possible-new-structure.md` | Transitional MD plugin inventory. Do not expand. |
| `public/index.php` | Front door of Plane A. Grow the pre-kernel doors. Do not grow Filament here. |
| `bootstraphttps://www.numerimondes.com/app.php` | Plane B (+ current miss path). Should become “operator + modules,” not “the world.” |
| `WebApp` / `WebAppApi` | Host contract. Extract, don’t replace. |
| `Paths\Router` + `Paths\Assets` | Proof Plane A can live without Illuminate. Expand this family, don’t start another. |

---

## 10. Decision (until a later ADD)

1. **Webkernel stays a PHP platform.** Laravel is not the identity.
2. **Filament stays the operator UI** for this phase. That implies Laravel + Livewire + Alpine **on Plane B**.
3. **Public HTTP is not a Filament Page.** That is the non-negotiable structural change.
4. **No from-scratch Illuminate.** Control comes from plane isolation + host contract + pre-kernel doors.
5. **ETag is already native on the 304 path.** Finish the miss path and the disk-cache door so you stop accusing the platform of lacking it.
6. **Bookstore keeps Eloquent.** Different plane, different storage.
7. **Measure before prune.** The 11k is mostly `node_modules`. The runtime tax is providers + `DynamicMdPage`.

The tweet is useful as a reminder, not as a roadmap. Otwell can say PHP is a detail of Laravel. You do not have to build a world where Laravel is the detail of nothing.

You already started the world where Laravel is the detail of the **panel**. Finish that.

---

## 11. Next physical step (when you say go)

1. Write the five-probe table into §5.
2. Open a single PR: public GET no longer extends `Filament\Pages\Page`.
3. Gate operator providers off the public boot.
4. Then talk about whether `WebApp` still needs to be an `Application`.

Until (2) exists, “from scratch” is just pain. After (2), you will know whether you still want to own more.
)
