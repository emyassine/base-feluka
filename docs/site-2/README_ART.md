---
name: visual-direction
description: Reusable art direction and production workflow for website and editorial images, optional hover videos, image assets and attribution.
---

# Visual direction

A reusable, brand-agnostic art direction and production skill for websites and editorial products. Apply it in any repository or framework. Always inspect the active project's content model, visual identity, asset conventions, licenses and component architecture. For Numerimondes projects, also read [`README_ART_NUMERIMONDES.md`](README_ART_NUMERIMONDES.md).

This skill is written for coding agents. Follow the workflow, but adapt choices to the page, audience, visual identity and actual components. Never assume one brand's paths, palette, fonts, or image style apply elsewhere.

---

## 1. Brand essentials

Before visual work, locate the active brand guide, official logo, image palette, typography, and any owner-provided photography, drawings or art direction. Treat those source files and written brand rules as authoritative. Never redraw, distort or ask a model to invent a logo. Use approved fonts only when the project defines them; otherwise do not invent a typography system for raster artwork.

Read owner-provided visual references as authored work. Preserve their intent and ask before making a material transformation. Use signature materials or motifs only where the active brand guide calls for them; do not apply one visual motif to every page.


## 2. Core principle: one idea, one image, one reader

Every visual answers: **What is this page about, in one glance, for the person who will read it?**

Preferred sources, chosen by subject fit and rights:

1. A real, permitted visual source: the owner's own photograph or drawing, an artwork, object, place or photograph with known provenance and usable rights.
2. A real source with a restrained, rights-compliant intervention, if the treatment clarifies the idea.
3. An original illustration, still life or rendered scene when it explains an explicitly conceptual subject.
4. A wholly generated scene only when no suitable real source fits and generation can meet the required quality bar.
5. A short ambient video loop only when motion adds meaning (section 8).

AI is a production tool, not the default source. Do not present a composite or generated image as documentary evidence, or fabricate events, client evidence, results, testimonials or identifiable people.

## 2A. Audience, stance and tone

Decide who the image speaks for: the organization, a client or partner, or a neutral explainer. Follow the active brand guide and the page's actual claims. State what the reader should understand and feel in one second. The feeling and visual register should suit the subject, audience and brand; do not impose corporate polish on unrelated brands or subjects.

For sensitive subjects, keep the image respectful and accurate. Do not portray people as vulnerable or distressed unless the subject specifically requires it and the depiction is handled responsibly. Avoid sensational imagery, stereotypes, misleading security cues, or visuals that imply facts the page does not establish.

**First-glance test (mandatory).** Describe the finished image in one plain sentence as a stranger with no context would. What would they guess the page is about, and how would they feel? If the guess is wrong or ambiguous, or the impression conflicts with the page or brand, reject it.

Literal keyword matching is not subject fit. Translate what the page actually says into an image that clarifies its meaning; do not illustrate a keyword with an unrelated object or person.

## 3. Subject-fit rule (mandatory before any research or generation)

Before choosing or creating a visual:

1. Read the **entire page**: frontmatter (`title`, `summary`, `description`, `tags`, `category`, status, any image/video metadata) and the full body. Note the topic, audience, specific claims and tone.
2. Write **one sentence**: "This image fits this page because ___." The sentence must refer to the page's actual content, not to the fame, beauty or novelty of the image.
3. If the sentence is weak, vague or generic, do **not** generate. Research a better source or clarify the concept with the owner.

Hard rules:
- Never choose an artwork because it is famous or memorable.
- Never alter or extend a recognizable masterwork with AI (no outpainting, no re-lighting, no added figures or objects). If a source does not fit the card's crop, choose another crop or another source. Altering a famous painting reads as careless and undermines trust.
- Never copy a metaphor from an example, another site or another card onto an unrelated page. A well-known sculpture picked only because it looked striking on some other page is a wrong match.
- Never reuse one picture for unrelated topics.
- Match the metaphor to the subject. Examples of sound mappings:
  - Account or CRM privacy: correspondence, ledgers, sealed records, keys, a protected vessel, a threshold.
  - Pricing or commercial terms: a balanced exchange, scales of forms, weighed materials.
  - Security reporting: a narrow seam of light in a dark form, a lock mechanism, a signal.
  - Partner terms: two forms on a bridge, joined structures, a handshake-free symbol of shared responsibility.
  - Automated access: layered planes, gates, a controlled opening.
  - Website storage and cookies: a small container, a drawer, a jar with separated contents.
  - Draft or not-yet-final policy: unfinished forms, visible structure, scaffolding, open edges.
- A visual can be beautiful and still be wrong for the page.

Sensitive subjects (privacy, security, legal, recruitment, personal data): keep the image calm, abstract or symbolic. No fear imagery, no hackers in hoodies, no padlock clichés unless they add real meaning, no depictions of identifiable private individuals.

---

## 4. Rights, provenance and honesty

Before using any real source:

- Confirm the license or permission. Prefer public-domain or open-access collections from museums and libraries, openly licensed archives, the project owner's own photography, or commissioned work. For anything else, check the exact license terms.
- Preserve required attribution. Never strip credit that the license requires.
- Record provenance for every asset in a sidecar note or in the project's existing metadata system: source URL, creator, date, license, any modification (crop, composite, AI-assisted edit), tool used, and the date it was added. Provenance must also state the **stance** (who the image speaks for), the **fit sentence**, and the **first-glance result** from section 2A. A provenance entry that only lists the source is incomplete.
- Never copy, hotlink or re-use another publisher's images, videos, layout assets or brand elements as the active site's content. Other sites can inspire general approaches, never supply unlicensed assets.
- Do not claim a production method that you cannot verify. Describe images as "composite", "AI-assisted", "photograph" or "rendered" only if you know it.
- Respect cultural and religious heritage (including Moroccan, Amazigh, Arab and Mediterranean craft and art). Credit it, do not caricature it, do not use sacred objects as decoration.
- If rights are unclear, **stop and ask**. Do not use the image.

### Realism, originality and attribution (mandatory)

- When a page benefits from documentary photography, search for a real photograph before generating an image. Inspect the actual image at full size; search-result descriptions are not enough. Verify that its subject, context, crop and rights fit this page.
- If generation is the right choice, aim for a photograph that could plausibly have been made by a skilled photographer: believable optics, exposure, lighting, perspective, materials, imperfections and context. Avoid the polished, weightless, symmetrical look of generic AI renders. Do not claim that generated work is indistinguishable from photography; inspect it critically and reject visible synthetic artifacts.
- Never imitate a living artist's or photographer's distinctive style, recreate a copyrighted composition, or use another publisher's image as a production input without permission. References may guide general qualities such as light or composition, never reproduce protected expression. Do not remove watermarks or credits.
- Record every third-party artwork or photograph in the active site's attribution registry and show required credits together in the site's Brand Kit → Resources → Attributions section. Keep a source link, creator, title, license, changes and local asset path. The site's brand-specific guide defines the registry path and rendering mechanism.
- Attribution requirements still apply when a license does not legally require a credit; record provenance consistently. For CC BY-SA or similar share-alike sources, check what the adaptation requires before publishing.
- Do not use a real artwork merely because it is famous. Confirm rights for the exact reproduction and edition; never use AI to extend or alter recognizable art.

---

## 5. Visual language and quality bar

Overall feel: editorial, idea-led, poetic, restrained, tactile. One strong focal subject, simple composition, deliberate light, real texture, generous negative space.

Do:
- One metaphor per image. The subject must read clearly at thumbnail size (about 160 px).
- Use a small number of materials and forms.
- Keep a coherent but not identical palette across a collection. A set may share lighting and calm tonality; individual images may vary in medium and color.
- Use the active brand palette when it helps; let a real source's natural colors remain when documentary fidelity matters.
- Leave breathing room where text overlays will sit.

Do not:
- Bake text, logos, watermarks, numbers, UI mock-ups or signatures into AI-generated images. AI text is unreliable. Add any text later as a separate real layer using an approved project font.
- Produce six-fingered hands, melted faces, impossible objects, garbled lettering or plastic-looking surfaces. Inspect at 100 percent zoom before accepting an image.
- Fill the frame with clutter, neon glow, generic "AI gradient" swirls, floating dashboards, robots, brains, circuit boards, glowing globes or handshake clichés.
- Use silk by reflex.
- Show real brands, trademarks or copyrighted characters.

---

## 6. Formats by use

Always read the active project's components to confirm actual crops before producing assets. Defaults when nothing else is defined:

| Use | Aspect ratio | Master size | Notes |
|---|---|---|---|
| Collection card cover (articles, policies, legal notices, capabilities, projects) | Component-defined | 2048 px or higher | Follow the actual card crop and leave overlay space only when the component places text on the image. Optimize responsive renditions for display size. |
| Page hero / banner | 16:9 or 21:9 | 3200 px wide | Keep focal subject within the central safe area so it survives responsive crops. |
| Page or section background | Wide, tileable or soft | As needed | Low contrast, no focal clutter, must stay readable under text in both themes. |
| Open Graph / social share | 1.91:1 (1200 x 630 px delivered; produce master at 2400 x 1260) | | Keep important content inside the central 80 percent. Render title text as a real layer using an approved font. Add the real logo as a separate layer when appropriate. Must be legible at 600 x 315 px. |
| Square social | 1:1 | 1080 x 1080 or higher | Same rules as OG. |
| Poster | Project-defined | | Confirm before producing. |

For OG images specifically:
- Compose them from a real layout (HTML/SVG/Canvas template or the project's OG generator) so text is crisp and uses the approved font. Do not ask an image model to render the title.
- Background art may be the page's card visual, a material field allowed by the brand guide, or an image tied to the page.
- Check contrast between text and background (WCAG AA or better for large text) and test with the longest title in the collection.
- Provide a version that works on dark and light social surfaces; avoid pure white edges that vanish on light feeds.

Keep the source or master at the highest practical quality. Create optimized web renditions for the actual display sizes. Never upscale a small image and call it a master.

---

## 7. Production workflow

1. **Discover the project.** Find the content model (frontmatter fields for image, alt, video, poster), the asset directories, the card and hero components, the build or image pipeline, the OG generator if any, approved fonts and logo. Note existing visuals in the same collection so the new one belongs to the set without duplicating it.
2. **Read the full page.** Frontmatter and body (section 3).
3. **Write the fit sentence** (section 3). If it is weak, stop.
4. **Choose the source and treatment** (section 2). Confirm rights (section 4).
5. **Decide whether the card gets motion** (section 8). Default: no.
6. **Produce one asset at a time.** Review each result before starting the next. Never batch-generate a large set and pick afterwards. When using AI, give it a permitted real reference whenever one exists, state the subject, materials, light, camera and mood, and exclude text, logos and watermarks. Prefer the repository owner's own drawings and photographs when provided and relevant; treat them as authored material and do not distort their meaning.
7. **Review at real size** (section 10). Reject and redo rather than patch a weak image.
8. **Move the selected files** from any generator output folder into the project's established asset location with descriptive, stable filenames. Never leave a site-referenced asset only in a tool's private output folder. Do not overwrite an existing asset unless explicitly asked.
9. **Integrate** using the project's own conventions: frontmatter fields, component props, accurate alt text. Confirm every referenced path exists.
10. **Preview** the still card, the hover state (if any), the mobile and reduced-motion fallback, light and dark themes, and the OG preview, at the actual crop.
11. **Report** the final file paths, source and license, the fit sentence, what was verified and anything left undone.

Descriptive filename pattern (adapt to project convention): `{collection}-{page-slug}-{short-concept}-{variant}.{ext}`, lowercase, hyphenated, no spaces, no version suffixes like "final2".

For tool-specific prompts, local paths, palette, languages and brand-specific art direction, read the companion guide for the active brand. Never assume this skill's own example paths or one brand's look apply elsewhere.

---

## 8. Optional hover-video cards

The still image is always the default. Video is an enhancement for selected cards only.

Rules:
- Add video only when motion adds meaning (light moving across a surface, a slow camera move, one small object action). Never add video to every card, and never for decoration.
- Length: about 5 to 6 seconds, seamless loop, **no audio track**, one restrained action.
- Behavior: still image at rest. On pointer hover **and** on keyboard focus, reveal and play the video over the same image area. Pause and reset when the interaction ends.
- Attributes: `muted`, `playsinline`, `loop`, `preload="none"` (or equivalent lazy behavior), and the cover still as `poster`.
- Do not download any card video when the page opens. Load or start it only upon hover or focus.
- Touch devices, `prefers-reduced-motion: reduce`, playback failure or missing file: show the still only. Nothing should break or flash.
- Encoding: compact H.264 MP4 (with WebM added only if the project already supports it), sized for the displayed crop, with a crisp poster. Balance file size, sharpness and start time on representative desktop and mobile connections. If the video makes the page heavy or slow, drop it.
- Keep the video file separate from the editorial image, and always provide the poster.

Shared card components:
- Support video as an **optional capability**. Keep the default image-only API and behavior unchanged; accept optional `video` and `poster` inputs.
- Do not hardcode any site's asset directory, frontmatter field names or URLs into a reusable component. Connect them through the owning site's content and asset conventions.
- Ensure accessible behavior: the card stays keyboard-operable, video is hidden from assistive technology (it duplicates the still), and no information is conveyed only by motion.

---

## 9. Performance, formats and accessibility

Performance:
- Use responsive sources (`srcset`/`sizes` or the framework's image component) where supported.
- Use modern formats (AVIF or WebP with a fallback if the project requires) without visibly sacrificing detail.
- Lazy-load below-the-fold images. Do not lazy-load the main above-the-fold image (the likely LCP element); give it explicit width and height to avoid layout shift.
- Typical targets: card renditions as light as possible while sharp at their display size; OG images under roughly 300 KB when possible, and well within platform limits.

Accessibility:
- Write alt text that describes the **meaningful visual content** in one clear sentence, without repeating the card title and without keyword stuffing. Describe the visible subject and its meaning accurately; do not infer details the image does not show.
- If an image is purely decorative and the component supports it, use an empty `alt=""`.
- Check text legibility on every overlay (gradient scrims, contrast ratio) in both light and dark themes.
- Never convey meaning through color alone.

---

## 10. Review checklist (every asset, before calling it done)

- [ ] Full page (frontmatter and body) was read; fit sentence written and still true.
- [ ] Stance chosen for the active brand / client empowered / neutral and target feeling stated; no vulnerability, bills, debt, anxiety or period-drama cues.
- [ ] First-glance test passed: a stranger's one-sentence description matches the page topic and the target feeling.
- [ ] Looks corporate and premium, at the level of a respected technology or consulting publisher.
- [ ] No AI alteration or outpainting of a recognizable masterwork.
- [ ] Source, license and attribution confirmed and recorded.
- [ ] No baked-in text, logo, watermark or garbled glyphs; the real logo was never redrawn.
- [ ] No anatomical, physical or material artifacts at 100 percent zoom.
- [ ] Readable at thumbnail size; subject centered with room for overlays.
- [ ] Not a duplicate or near-duplicate of another card, and not by reflexively reusing the same motif.
- [ ] Correct aspect ratio and crop for the actual component; safe areas respected.
- [ ] Renditions generated; file sizes reasonable; format supported by the project.
- [ ] File lives in the project's asset location; the path in content/frontmatter resolves; no files left only in a generator's output folder.
- [ ] Alt text is accurate and does not repeat the title.
- [ ] Contrast and legibility pass in light and dark themes.
- [ ] Video (if any): 5 to 6 seconds, muted, looping, not preloaded, poster present, hover and focus work, reduced-motion and touch show the still, failure falls back gracefully.
- [ ] OG image (if any): text rendered as a real layer in the project-approved typeface, legible at 600 x 315, central safe area respected, tested with the longest title.
- [ ] Final report lists paths, provenance and anything that needs the owner's decision.

---

## 11. When to stop and ask the owner

Stop and ask rather than guess when:
- The page's subject is ambiguous or the fit sentence is weak.
- Rights or provenance of a source are unclear.
- The project-approved font or official logo file cannot be located.
- The request would require showing real people, real client names, real results or real incidents.
- A change would overwrite or replace an existing approved visual.
- The component does not support a needed capability (video, srcset) and adding it would change a shared API.
- A page is a draft, and it is unclear whether its visual should signal draft or ready status.
- The stance (brand, client or neutral) is not obvious from the page.
- The first-glance test fails twice in a row for the same page.

When asking, batch **all** open questions into a single message with a recommended default for each, so the owner can answer once.

---

## 12. Reporting format

At the end of each task, report briefly:

1. Page(s) covered and the fit sentence for each.
2. Source and license (or "generated from scratch" / "AI-assisted from reference X").
3. Final file paths (still, video, poster, OG) and where they are referenced.
4. Checks performed from section 10 and any that could not be performed.
5. Open questions or follow-ups.

Do not claim an image is integrated until the referenced file exists and the crop has been inspected.
