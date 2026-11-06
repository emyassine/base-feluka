# Floating subnav: company brand context + duplicate fix (2026-11-06)

## Context
Implementation plan: `.agents/plans/20261106-175601-floating-subnav-implementation.md`. Goal: the company guide floating subnav must show only
`Company | — | How We Work | Founder | Business and HR Leaders | — | Our Brand` (EN) / `... | — | Notre Marque` (FR).

## Changes
- `docs/vitepress-site/app/scripts/preparation/content-stage.mjs`
  - Made `exclude` wildcard matching locale-aware (canonical paths) so FR brand pages are not leaked into the EN nav.
  - Reworked the floating-subnav generation loop to handle guided contexts and nested subcontexts (e.g. `company/brand`), plus a root-pages pass.
  - Excluded the guide entry page from its own automatic link list for top-level contexts (fixes the `Company` duplicate).
  - Emit the floating-subnav `home` key for every context (including subcontexts) so pages like `/company/brand/` resolve their subnav.
  - Localized the nested-context home URI base.
- `docs/vitepress-site/app/.vitepress/theme/FloatingSubnav.vue`
  - Filter separators out of ghost (overflow) links and the mobile dropdown menu; add `.floating-subnav__menu-separator` style.
- `docs/site-2/src/guides/company/spmpst.subheader.json` (FR label): custom include label `Our Brand` -> `Notre Marque`.
- `docs/site-2/src/guides/company/030-brand/spmpst.subheader.json` (new): brand subcontext config (empty rules => lists the subcontext pages).

## Verification
- `node --check` on content-stage.mjs: OK.
- `site.mjs prepare --site numerimondes`: OK (64 pages).
- Generated + live dev-server `floating-subnav.json` contain:
  - `/company` -> `How We Work | Founder | Business and HR Leaders | — | Our Brand` (FR: `Notre Marque`), no duplicate.
  - `/company/brand` and `/fr/company/brand` -> brand subcontext nav `Logo | Colors | Type | Photos | Icons | Attributions`, identity `Brand` / `Marque`, home page `/company/brand/logo`.
  - No Numerimondes title, no Logo/Colors/... standalone entries at company level, no Contact.

## Known pre-existing issues (not addressed)
- VitePress build dead links: `/company/about-us/how-we-work` (FR + EN people-organizations pages).
- `docs:check` failures: FR label warnings, missing `spmpst.sidebar.json` for `src/guides/services`.
- No visual/screenshot verification performed.

## Status
Company floating subnav now matches the plan; brand subcontext floating subnav added for `/company/brand/`.
Final steering (2026-11-06): on subcontext pages, the first element of the floating subnav now points to the parent context (identity + home href), e.g. `/company/brand/*` -> `Company` -> `/company/` (FR: `/fr/company/`), followed by the subcontext links (Logo, Colors, ...).
