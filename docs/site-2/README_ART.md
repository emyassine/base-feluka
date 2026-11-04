---
name: numerimondes-visual-direction
description: Art direction and image-production rules for every Numerimondes visual: collection cards (articles, policies, legal notices, capabilities, projects), page heroes and backgrounds, Open Graph and social images, optional hover-video loops, and image text overlays. Use whenever an image, poster, video, OG image, background or visual card must be chosen, created, edited, integrated or reviewed for a Numerimondes site or editorial product, in any repository or framework.
---

# Numerimondes visual direction

A reusable art-direction and production skill for all Numerimondes websites and editorial products. It is project-agnostic: always inspect the active repository to discover its content model, asset conventions and component architecture. Never assume a directory, URL pattern, frontmatter field name or framework.

This skill is written for coding agents. Follow the steps in order, do not skip the checks, and report what you actually did. When a rule says "stop and ask", stop and ask; do not guess.

---

## 1. Brand essentials

**Who Numerimondes is.** An independent consulting and solutions company (Numerimondes SARL AU, headquartered in Casablanca, Morocco). It explores opportunities, develops ideas, designs practical solutions and assembles the expertise needed to deliver projects. Tone: independent, curious, practical, premium, calm. Never loud, never "tech-bro", never stock-corporate.

**Tagline spirit.** "Possibility becomes valuable through execution." Images should make an idea tangible and credible, not decorative.

**Maning of our Logo (read this carefully; never redraw it from memory. We usually dont use the logo in the images but the meaning may be important).**
- A **noble stone**: a regular hexagon with a horizontal flat base and a horizontal flat top (points left and right).
- The hexagon is **divided by a curved arc (a half-circle-like cut)**: the left part is near-black, the right part is a light slate blue-grey.
- To its right sits a **bold near-black chevron / arrow** (">") with angled cut ends, pointing right and away from the stone.
- Meaning: a noble stone (value, rarity, craft) set in motion toward execution.
- Palette of the logo: near-black, slate blue-grey, soft off-white background.
- Use the official logo file from the project. Never regenerate, trace, recolor, distort or approximate the logo with AI. Never ask an image model to draw it.
- If a visual needs a logo, place the real asset in a separate layer with clear space equal to at least the height of one hexagon edge on all sides.

**Brand material: silk.** Silk (flowing, folded, translucent, softly lit fabric) is the brand's signature material. It is **available, not mandatory**. Numerimondes is not a factory that stamps one look onto everything. Use silk as an occasional signature (for example brand pages, hero backgrounds, some OG images, the odd card), and aim for most visuals to come from **art and poetic imagery tied to the page's subject**. If several consecutive visuals in a set use silk, the next one should not.

**Typography (local fonts).** Premium serif family "Romie":
- `Romie-Bold.woff2`
- `Romie-Medium.woff2`
- `Romie-MediumItalic.woff2`

Find where they live in the active project (search for `Romie`). Use them for any typography in generated assets (OG images, posters, text overlays). Use Bold for titles, Medium for secondary text, Medium Italic for accents, quotes or category labels. Do not substitute another font silently; if the files cannot be found, stop and ask.

---

## 2. Core principle: one idea, one image, one reader

Every visual answers a single question: **"What is this page about, in one glance, for the person who will read it?"**

Preferred sources, in this order of consideration (choose by fit, not by habit):

1. A **real, permitted visual source**: an artwork, sculpture, object, place, document or photograph with known provenance and usable rights.
2. A **real source plus a restrained intervention**: compositing, retouching, a surreal or poetic detail, a lighting change, or a small animation that makes the metaphor visible.
3. A **tactile still life or sculptural 3D scene**: a few forms and materials (glass, stone, ceramic, metal, paper, thread, silk) arranged as a metaphor. This is the existing visual language of many Numerimondes cards, for example translucent glass forms in amber, cobalt, forest green, terracotta and coral, with one narrow accent such as a thread, a seam or a threshold.
4. A **wholly generated scene** only when the idea is explicitly conceptual and no real source fits.
5. A **short ambient video loop** only when motion adds meaning (see section 8).

AI is a production tool, not the default source. Prefer meaningful images over generic stock photography, decorative gradients or literal icons. Do not present a composite or generated image as documentary evidence, and never fabricate real events, client evidence, customer results, testimonials or identifiable real people.

---

## 3. Subject-fit rule (mandatory before any research or generation)

Before choosing or creating a visual:

1. Read the **entire page**: frontmatter (`title`, `summary`, `description`, `tags`, `category`, status, any image/video metadata) and the full body. Note the topic, audience, specific claims and tone.
2. Write **one sentence**: "This image fits this page because ___." The sentence must refer to the page's actual content, not to the fame, beauty or novelty of the image.
3. If the sentence is weak, vague or generic, do **not** generate. Research a better source or clarify the concept with the owner.

Hard rules:
- Never choose an artwork because it is famous or memorable.
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
- Record provenance for every asset in a sidecar note or in the project's existing metadata system: source URL, creator, date, license, any modification (crop, composite, AI-assisted edit), tool used, and the date it was added.
- Never copy, hotlink or re-use another company's images, videos, layout assets or brand elements as Numerimondes content. Other sites can inspire an approach, never supply assets.
- Do not claim a production method that you cannot verify. Describe images as "composite", "AI-assisted", "photograph" or "rendered" only if you know it.
- Respect cultural and religious heritage (including Moroccan, Amazigh, Arab and Mediterranean craft and art). Credit it, do not caricature it, do not use sacred objects as decoration.
- If rights are unclear, **stop and ask**. Do not use the image.

---

## 5. Visual language and quality bar

Overall feel: editorial, idea-led, poetic, restrained, tactile. One strong focal subject, simple composition, deliberate light, real texture, generous negative space.

Do:
- One metaphor per image. The subject must read clearly at thumbnail size (about 160 px).
- Use a small number of materials and forms.
- Keep a coherent but not identical palette across a collection. A set may share lighting and calm tonality; individual images may vary in medium and color.
- Use the logo's neutrals (near-black, slate blue-grey, soft off-white) as a stabilizing base when it helps, with one accent color per image (amber, cobalt, coral, vermilion, terracotta, forest green, ochre are all already part of the site language).
- Leave breathing room where text overlays will sit.

Do not:
- Bake text, logos, watermarks, numbers, UI mock-ups or signatures into AI-generated images. AI text is unreliable. Add any text later as a separate real layer using Romie.
- Produce six-fingered hands, melted faces, impossible objects, garbled lettering or plastic-looking surfaces. Inspect at 100 percent zoom before accepting an image.
- Fill the frame with clutter, neon glow, generic "AI gradient" swirls, floating dashboards, robots, brains, circuit boards, glowing globes or handshake clichés.
- Use silk by reflex.
- Show real brands, trademarks or copyrighted characters.

---

## 6. Formats by use

Always read the active project's components to confirm actual crops before producing assets. Defaults when nothing else is defined:

| Use | Aspect ratio | Master size | Notes |
|---|---|---|---|
| Collection card cover (articles, policies, legal notices, capabilities, projects) | 1:1 | 2048 x 2048 | Subject centered, space for gradient and overlaid text. Web renditions around 920 to 1200 px, plus smaller sizes for responsive sets. |
| Page hero / banner | 16:9 or 21:9 | 3200 px wide | Keep focal subject within the central safe area so it survives responsive crops. |
| Page or section background | Wide, tileable or soft | As needed | Low contrast, no focal clutter, must stay readable under text in both themes. |
| Open Graph / social share | 1.91:1 (1200 x 630 px delivered; produce master at 2400 x 1260) | | Keep important content inside the central 80 percent. Title text in Romie Bold, set as a real layer. Add the real logo as a separate layer. Must be legible at 600 x 315 px. |
| Square social | 1:1 | 1080 x 1080 or higher | Same rules as OG. |
| Poster | Project-defined | | Confirm before producing. |

For OG images specifically:
- Compose them from a real layout (HTML/SVG/Canvas template or the project's OG generator) so text is crisp and uses Romie. Do not ask an image model to render the title.
- Background art may be the page's card visual (cropped or extended), a calm silk or material field, or a poetic image tied to the page.
- Check contrast between text and background (WCAG AA or better for large text) and test with the longest title in the collection.
- Provide a version that works on dark and light social surfaces; avoid pure white edges that vanish on light feeds.

Keep the source or master at the highest practical quality. Create optimized web renditions for the actual display sizes. Never upscale a small image and call it a master.

---

## 7. Production workflow

1. **Discover the project.** Find the content model (frontmatter fields for image, alt, video, poster), the asset directories, the card and hero components, the build or image pipeline, the OG generator if any, and where the Romie fonts and the logo live. Note existing visuals in the same collection so the new one belongs to the set without duplicating it.
2. **Read the full page.** Frontmatter and body (section 3).
3. **Write the fit sentence** (section 3). If it is weak, stop.
4. **Choose the source and treatment** (section 2). Confirm rights (section 4).
5. **Decide whether the card gets motion** (section 8). Default: no.
6. **Produce one asset at a time.** Review each result before starting the next. Never batch-generate a large set and pick afterwards. When using AI, give it a permitted real reference whenever one exists, state the subject, materials, light, camera and mood, and exclude text, logos and watermarks.
7. **Review at real size** (section 10). Reject and redo rather than patch a weak image.
8. **Move the selected files** from any generator output folder into the project's established asset location with descriptive, stable filenames. Never leave a site-referenced asset only in a tool's private output folder. Do not overwrite an existing asset unless explicitly asked.
9. **Integrate** using the project's own conventions: frontmatter fields, component props, accurate alt text. Confirm every referenced path exists.
10. **Preview** the still card, the hover state (if any), the mobile and reduced-motion fallback, light and dark themes, and the OG preview, at the actual crop.
11. **Report** the final file paths, source and license, the fit sentence, what was verified and anything left undone.

Descriptive filename pattern (adapt to project convention): `{collection}-{page-slug}-{short-concept}-{variant}.{ext}`, lowercase, hyphenated, no spaces, no version suffixes like "final2".

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
- Write alt text that describes the **meaningful visual content** in one clear sentence, without repeating the card title and without keyword stuffing. Existing site style is a good model: "Amber glass and forest-green forms arranged as a balanced exchange, suggesting value and pricing."
- If an image is purely decorative and the component supports it, use an empty `alt=""`.
- Check text legibility on every overlay (gradient scrims, contrast ratio) in both light and dark themes.
- Never convey meaning through color alone.

---

## 10. Review checklist (every asset, before calling it done)

- [ ] Full page (frontmatter and body) was read; fit sentence written and still true.
- [ ] Source, license and attribution confirmed and recorded.
- [ ] No baked-in text, logo, watermark or garbled glyphs; the real logo was never redrawn.
- [ ] No anatomical, physical or material artifacts at 100 percent zoom.
- [ ] Readable at thumbnail size; subject centered with room for overlays.
- [ ] Not a duplicate or near-duplicate of another card, and not silk by reflex.
- [ ] Correct aspect ratio and crop for the actual component; safe areas respected.
- [ ] Renditions generated; file sizes reasonable; format supported by the project.
- [ ] File lives in the project's asset location; the path in content/frontmatter resolves; no files left only in a generator's output folder.
- [ ] Alt text is accurate and does not repeat the title.
- [ ] Contrast and legibility pass in light and dark themes.
- [ ] Video (if any): 5 to 6 seconds, muted, looping, not preloaded, poster present, hover and focus work, reduced-motion and touch show the still, failure falls back gracefully.
- [ ] OG image (if any): text rendered as a real layer in Romie, legible at 600 x 315, central safe area respected, tested with the longest title.
- [ ] Final report lists paths, provenance and anything that needs the owner's decision.

---

## 11. When to stop and ask the owner

Stop and ask rather than guess when:
- The page's subject is ambiguous or the fit sentence is weak.
- Rights or provenance of a source are unclear.
- The Romie fonts, the official logo file or the asset directory cannot be located.
- The request would require showing real people, real client names, real results or real incidents.
- A change would overwrite or replace an existing approved visual.
- The component does not support a needed capability (video, srcset) and adding it would change a shared API.
- A page is a draft, and it is unclear whether its visual should signal draft or ready status.

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
