# Numerimondes image direction

Brand-specific companion to the reusable art workflow in [`README_ART.md`](README_ART.md). Apply both documents for Numerimondes work. This file records local decisions and conventions; discover the active site paths and component behavior before applying them in another repository.

## Positioning in one paragraph

Numerimondes is an independent consulting and solutions company based in Casablanca. Its visuals must feel **premium, credible and corporate-grade, and also creative, poetic and alive**. "Corporate" here means precise, confident and trustworthy. It does **not** mean grey, generic or boring. The benchmark is the best editorial and research publishers: images with a point of view, refined light and material, and polished motion. A stock-looking image is a failure.

## Meaning of the logo (informs the art, rarely appears in it)

We usually do not place the logo inside images. Its meaning matters and should quietly shape the work.

- A **noble stone**: a hexagon with flat top and base, cut by a clean curved arc. Left part near-black, right part light slate blue-grey.
- A bold near-black **chevron** to its right, pointing forward.
- Meaning: rare, refined value (the stone), precision and craft (the clean cut), and forward momentum from idea to execution (the arrow).
- Visual translation: faceted forms, crystal, glass and stone; light cutting through or revealed by a precise edge; a single clean curve against a straight line; calm contrast of dark and pale slate; movement that proceeds in one direction with purpose.
- Never redraw, trace, recolor or ask a model to generate the logo. When a layout needs it (for example an OG image), use the official file as a separate layer.

## Stance by collection (decide before producing)

| Collection | Default stance | Target feeling |
|---|---|---|
| Policies | Numerimondes in a position of competence and care | Order, rigor, calm authority |
| Legal notices | Numerimondes as a responsible steward | Trust, transparency, control |
| Capabilities, projects | Capability and momentum; client in control | Confidence, ambition, clarity |
| Articles (practical guides) | Neutral explainer, with craft | Clarity, curiosity |
| Brand and home pages | Numerimondes as the independent expert | Premium, curious, precise |

Never show readers or clients as vulnerable, worried or in difficulty. Never use a "neutral" stance as an excuse for a bland image on a policy or legal page.

## Creative standard (non-negotiable)

Follow the concept exploration process in `README_ART.md` section 2B for every image: write the page's claim, three distinct concepts, run the cliché check and the ambition tests, then choose.

**Numerimondes-specific bans** (in addition to the generic cliché list): card readers, badge scanners, doors and corridors, concrete walls used as "security", padlocks and keys, shields, servers, dashboards, "person looking at a document", bills, and any period genre painting used for a modern topic. A photo that is merely free and technically fine but literal and flat (for example a badge reader on a concrete wall used for an access page) fails the interest test and must not ship.

**Preferred territory for Numerimondes** (use case by case, vary technique across a collection):
- Light and optics as protagonist: a beam of light passing a precisely cut aperture, refraction through a faceted noble stone, caustics, diffraction, interference. This ties directly to the logo's stone and to the owner's physics background.
- Real art or a real photograph, given a precise authored intervention, when it serves the claim and the license allows.
- Material and macro studies: stone, glass, metal, ceramic, textile, paper, ink.
- Scientific and technical imagery treated as art: instruments, specimens, engraving or herbarium aesthetics.
- Silk as a signature material, used sparingly. It is available, not mandatory, and must not be repeated across consecutive cards.
- Moroccan and Maghrebi art and craft (zellige, calligraphy, architecture, textiles), when it genuinely fits the subject, represented accurately and credited to the specific work and maker. Do not use it as decorative appropriation or when unrelated to the page.
- Motion design (see below) on conceptually rich pages.

## Motion

Motion is a signature of this brand, not a rarity. The still is the resting state and the fallback; the loop extends the idea.

- Prefer motion on flagship, conceptually rich and featured pages first, then extend across collections where it adds meaning. Aim for a meaningful share of cards over time, never autoplay at rest.
- Each loop: 5 to 6 seconds, seamless, muted, one purposeful action (for example light sweeping across a faceted surface, a beam that passes only when an aperture aligns, ink resolving into form, a slow camera move through layered artwork).
- Follow all technical and fallback rules in `README_ART.md` section 8. Hover or focus triggers playback; touch and reduced motion keep the still; do not preload.
- Use the lightest technique that reaches the bar: layered 2.5D parallax, headless-rendered shader or canvas, Blender renders for glass and light, or code-driven motion for backgrounds.

## Audience and image direction

The owner studies physics and science and has experience in drawing and photography. Treat visual critique as informed art direction. Do not settle for merely plausible composition: check photographic realism, optics, exposure, natural surface detail, perspective and context at full size. Reject sterile AI sheen, implausible construction, generic stock staging and any image whose meaning is only apparent after reading its caption.

Prefer the owner's own photography and drawings when relevant, followed by rights-cleared documentary photographs and art with clear provenance, followed by original authored creations (photographic, rendered, coded or illustrated). A fully AI-generated image is acceptable when it passes the ambition tests and the realism checks; it is not the first choice and is never a shortcut.

Never plagiarize or copy an image, composition, distinctive style or identifiable visual treatment from another company, photographer or artist. Do not imitate living artists. Use references to understand subject matter or general properties such as lighting; create an original composition. Do not use AI to extend, outpaint or "fix" a recognizable work to fit a crop. Authored, credited transformations of public-domain works are allowed under `README_ART.md` section 2C when they are the idea. Verify exact reproduction rights, record creator and source, and provide attribution even when a license makes credit optional. If rights or provenance are uncertain, do not publish the asset.

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

No single official hexadecimal palette for images is declared in the CSS. The main SVG logo also contains a broader set of colors, so sample neither it nor UI tokens as a fixed image palette. Use the actual logo file; let source material and subject determine image colors, with the logo's near-black and slate blue-grey as a quiet anchor when it helps, and one accent per image.

Typography for any rendered text layer (for example OG images): `Romie-Bold.woff2` for titles, `Romie-Medium.woff2` for secondary text, `Romie-MediumItalic.woff2` for accents. Find them in the repository before use. Never substitute another font silently.

For this site, public assets live under `docs/site-2/public/`; content uses root-relative public URLs such as `/images/legal/example.webp`. Confirm the actual component crop and optimize a local copy for it. Do not reuse a rigid filename convention in other sites.

Do not put text in images for this brand direction, including English, French, Arabic and decorative pseudo-writing. Keep titles, labels and translations as accessible page text. Do not assume the site is English-only: avoid baked-in language so future French and Arabic/RTL support remains possible. OG images are the exception only because their text is a separate real layer rendered with Romie.

## Central image resources and attribution

The Brand Kit guide is in `src/guides/brand-kit/`. Its Attributions page renders image credits from `.site/spmpst.images-attributions.json`; add or update the registry entry when integrating externally sourced artwork or photography. Preserve the linked license and name any crop or other modification.

The registry is a provenance record, not a substitute for checking license terms. Project-created photographs and generated assets should also have source and method information recorded, while only third-party assets need a rights attribution. Keep attribution data accurate when an image is replaced or removed.

## Image generation and production with Codex

Decide the concept first (`README_ART.md` section 2B). Use image generation, rendering or coding tools only when a suitable real photograph or artwork cannot deliver the concept at the required quality.

- Prompt one clearly described image at a time. Specify a plausible camera position, lens perspective, exposure, depth of field, natural light direction, material texture, scene context and restrained editorial color. Avoid over-polished studio renders, symmetry for its own sake, fake documentary details, illegible typography, logos, UI, watermarks and distinctive imitation of an existing artist or photograph.
- If a suitable reference is provided by the owner or is licensed for the intended transformation, use it to ground materials, light or composition without copying protected expression. Never feed another publisher's image into an image model as a shortcut to recreating it.
- For motion, prefer authored techniques (layer parallax, headless shader or canvas capture, Blender renders, ffmpeg) over unreviewed AI video. Inspect every frame range for artifacts and loop seams.
- Save the resulting file into the repository's actual public asset directory immediately, inspect it at full size and at its real crop, and review before generating another.
- Record the tool, date, prompt intent, reference provenance, the three concepts considered and any edits in the asset's provenance record.
- If you cannot reach the quality bar with the tools available, stop and report with concept options. Do not ship a safe, literal image.

## Page-specific checks

Read frontmatter (`summary`, `description`, `tags`, status and image fields) and the full page body before choosing an image. For legal, privacy and data-handling pages, express the actual page claims (authorized access, stewardship, retention, accountability) without suggesting that the image depicts Numerimondes' actual infrastructure or practices unless it does.

### Worked example: Account and CRM Privacy Notice

The page's subject is account profile and authentication data, client workspace records, authorized access, audit records, retention and requests. The claim: *only the right person, for the right purpose, can reach the right records, and every access is accountable.*

Do not use: bills, a person reading a letter, a ledger as a keyword pun, a famous thinker, an unrelated historic painting, or a literal access-control object such as a badge reader, door or turnstile. A previous attempt using a badge reader on a concrete wall was flat, grey and generic and was rejected for failing the interest test.

Illustrative concepts that show the level of ambition (derive your own from the page; do not copy these blindly, and do not reuse them on unrelated pages):
1. **A single beam through a faceted stone.** A macro light study of a precisely cut crystal or glass form (the brand's noble stone) in which one ray passes through a narrow aperture only when aligned; the rest of the light is refracted away. Motion: the stone rotates slowly and the beam passes through at one alignment. Stance: precise, controlled, authoritative.
2. **An archive with one drawer lit.** A real or public-domain scientific specimen cabinet or herbarium drawer, ordered and quiet, with a single drawer open and warmly lit. Stance: stewardship, order, accountability. Motion: light slowly reveals the one drawer.
3. **Layered translucent planes with one aperture.** Stacked sheets of glass or paper in slate and amber, with a single cut-out aligned across all layers so light passes in one line. Stance: bounded access by design. Motion: parallax between layers.

Each must still pass the cliché check, first-glance test and interest test, and the alt text must describe what is visible without claiming it depicts real systems.

## Provenance record template

For every asset, record:

- **Asset path** and rendition paths.
- **Page** and **page claim** (one sentence).
- **Stance** and **target feeling**.
- **Three concepts considered** (one line each) and **why the chosen one won**.
- **Fit sentence.**
- **First-glance result** (one-sentence stranger description) and **interest-test result**.
- **Source** (URL, creator, title, institution), **license** and verification date, or "original, created for this page".
- **Technique and tools** (camera, render engine, shader, ffmpeg, image model), **date**, **prompt intent**, **reference provenance**.
- **Modifications** (crop, composite, retouch, AI step, motion build).
- **Motion files** (video, poster, loop length, encoding) if any.
- **Attribution registry entry** added or updated (path in `.site/spmpst.images-attributions.json`) for third-party material.
