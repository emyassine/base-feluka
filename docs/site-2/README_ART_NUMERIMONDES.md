# Numerimondes image direction

Brand-specific companion to the reusable art workflow in [`README_ART.md`](README_ART.md). Apply both documents for Numerimondes work. This file records local decisions and conventions; discover the active site paths and component behavior before applying them in another repository.

## Audience and image direction

Numerimondes is an independent consulting and solutions company based in Casablanca. Its visual tone is curious, practical, composed and precise. Prefer the owner's own photography and drawings when relevant. Otherwise start with public-domain and Open Access collections, including museum and library collections and Wikimedia Commons, then check other photography against its exact license and use. Generated images are a last resort for explicitly conceptual subjects. Exclude images with unclear provenance, scraped or rehosted files without rights records, watermark-stripped images, and publisher or competitor assets unless explicit permission is documented.

The owner studies physics and science and has experience in drawing and photography. Treat visual critique as informed art direction. Do not settle for merely plausible composition: check photographic realism, optics, exposure, natural surface detail, perspective and context at full size. Reject sterile AI sheen, implausible construction, generic stock staging and any image whose meaning is only apparent after reading its caption. Prefer a fitting real photograph when one exists and its rights permit use.

Never plagiarize, copy an image, composition, distinctive style, or identifiable visual treatment from another company, photographer or artist. Do not imitate living artists. Use references to understand subject matter or general properties such as lighting; create an original composition. Do not alter recognizable works of art with generative tools. Verify exact reproduction rights, record creator and source, and provide attribution even when a license makes credit optional. If rights or provenance are uncertain, do not publish the asset.

Use art from Morocco and the Maghreb when it genuinely fits the subject. Consider zellige, calligraphy, architecture, textiles and craft case by case; represent cultural context accurately, avoid decorative appropriation, and credit the specific work and maker. Avoid these motifs when they are unrelated to the page.

Draft-page visuals are decided case by case. A page may signal its draft status through unfinished forms when that clarifies status, but do not imply draft status through image alone where readers could mistake the content for published policy.

## Local palette, language and paths

There is no single official hexadecimal image palette in the current site CSS. The UI tokens are interface colors, not a mandate to tint every image:

| CSS token | Light theme | Dark theme |
|---|---|---|
| `--background` | `#fcfdfd` | `#0d1117` |
| `--surface` | `#ffffff` | `#161b22` |
| `--foreground` | `#252a32` | `#f0f6fc` |
| `--accent` | `#252a32` | `#f0f6fc` |
| `--vp-c-brand-1` | `oklch(0.623 0.214 259.815)` | same token |

No single official hexadecimal palette for images is declared in the CSS. The main SVG logo also contains a broader set of colors, so sample neither it nor UI tokens as a fixed image palette. Use the actual logo file; let source material and subject determine image colors, with interface colors only as a light point of reference.

For this site, public assets live under `docs/site-2/public/`; content uses root-relative public URLs such as `/images/legal/example.webp`. Confirm the actual component crop and optimize a local copy for it. Do not reuse a rigid filename convention in other sites.

Do not put text in images for this brand direction. This includes English, French, Arabic and decorative pseudo-writing. Keep titles, labels and translations as accessible page text. Do not assume the site is English-only: avoid baked-in language so future French and Arabic/RTL support remains possible.

## Central image resources and attribution

The Brand Kit guide is in `src/guides/company/040-brand-kit/index.en.md`. It presents the official logo and image resources. All third-party image credits are rendered in its **Resources → Attributions** section from `.site/spmpst.images-attributions.json`; add or update the registry entry as part of integrating any externally sourced artwork or photograph. Do not scatter attribution notes across content pages. Preserve the linked license and name any crop or other modification.

The registry is a provenance record, not a substitute for checking license terms. Project-created photographs and generated assets should also have source/method information recorded, while only third-party assets need a rights attribution. Keep attribution data accurate when an image is replaced or removed.

## Image generation with Codex

Use the available image-generation tool only after deciding that a suitable real photograph or artwork cannot be used. Prompt one clearly described image at a time. Specify a plausible camera position, lens perspective, exposure, depth of field, natural light direction, material texture, scene context and restrained editorial color. Avoid over-polished studio renders, symmetry for its own sake, fake documentary details, illegible typography, logos, UI, watermarks and distinctive imitation of an existing artist or photograph.

If a suitable reference is provided by the owner or is licensed for the intended transformation, use it to ground materials, light or composition without copying protected expression. Never feed another publisher's image into an image model as a shortcut to recreating it. Save the resulting file into the repository's actual public asset directory immediately, inspect it at full size and at its real crop, and review before generating another. Record the tool, date, prompt intent, reference provenance and any edits in the asset's provenance record.

## Page-specific checks

Read frontmatter (`summary`, `description`, `tags`, status and image fields) and the full page body before choosing an image. For legal, privacy and data-handling pages, express the actual page claims—authorized access, stewardship, retention and accountability—without suggesting that the image depicts Numerimondes' actual infrastructure or practices unless it does. A physical access-control image is only a metaphor for authorization; do not imply it demonstrates CRM security.

For the Account and CRM Privacy Notice, the page's subject is account profile and authentication data, client workspace records, authorized access, audit records, retention and requests. Do not use bills, a person reading a letter, a ledger as a keyword pun, a famous thinker, or an unrelated historic painting. The image should be calm, credible and contextually accurate.

