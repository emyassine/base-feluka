# Numerimondes visual direction

This is a reusable art-direction and image-production skill for Numerimondes websites and editorial products. Apply it to articles, capabilities, legal notices, projects and other cards, regardless of repository, framework or site structure. Inspect the active project to discover its asset conventions and component architecture; do not assume a particular directory or URL pattern.

## Core card principle

Build the card around a **real visual source** when it suits the story: an artwork, sculpture, object, place or photograph with a known and permitted source. A still image remains visible by default. For selected cards, a short, muted video may take over the image area on pointer hover and add a small amount of motion. Use the still image as the video's poster and fallback; on touch devices or when motion is unavailable or reduced, keep the still image. This optional still-to-motion transition is a defining part of the reference. Do not add video to every card.

Treat AI as a supporting production tool, not the default source of the whole visual. Start from real art or a real photographed subject, then use compositing, retouching, animation or restrained AI-assisted transformation to make the metaphor. The Thinker-and-strawberry example suggests this kind of recognizable real-art anchor with an unexpected conceptual intervention. The supplied HTML cannot establish how that image was made, so use it as a visual direction, not proof of provenance or permission. Confirm usage rights for source art and photography; do not use Sequoia's image or video files in Numerimondes content.

## Subject-fit rule: read the page before choosing art

Before researching, selecting or creating a visual, read the **full page**, including its frontmatter and body. Use the title, `summary`, `description`, `tags`, category, audience and the page's actual claims to understand what the image must communicate. Do not choose an artwork just because it is memorable, famous or resembles a visual from a reference site. The image must make sense for this specific page and its readers.

Write down the connection between the subject and the proposed image in one clear sentence before producing it. If that connection is weak, choose a better source or pause to define the concept. A visual can be beautiful and still be wrong for the page.

**Do not repeat this mismatch:** Rodin's *The Thinker* was selected for an Account and CRM Privacy notice only because it appeared in the Sequoia example. That was not a sound subject match. Never transfer an image metaphor from a reference example to an unrelated page. For a page about account and CRM privacy, look first for a real artwork or source image about correspondence, personal records, confidential information or protected access; use another subject only when the page itself establishes a clear connection.

## Reference analysis

The supplied Sequoia card markup shows a square image acting as the cover and video poster. For some cards, a short video is layered in the same image area and reveals motion on hover. A dark gradient supports overlaid category, title and author text. The supplied examples use more than one visual treatment:

- Real, tactile objects arranged to express an idea, such as wooden chess pieces for stages in a startup.
- Surreal or composite imagery, such as a recognizable classical sculpture placed in an unexpected scene.
- Minimal, atmospheric 3D imagery, such as a thin metal form floating above a stone surface.
- Short, muted, looping video that extends the cover image through restrained movement, shown on hover.

The supplied stills are roughly 920 by 920 pixels. The two supplied video files are muted H.264 loops of about five and six seconds, with a still image used as each video's poster. The examples feel editorial and idea-led. They use one strong visual metaphor, simple composition, texture, deliberate light and a clear focal subject. Their variety is part of the reference; every image does not need the same medium or palette.

The HTML exposes image and video URLs, dimensions, card text and playback settings. It does not establish whether an image was photographed, composited, rendered or generated with AI. Treat the Thinker-and-strawberry example as a surreal composite reference; do not claim a specific production method without reliable provenance.

Use Sequoia as inspiration for the editorial approach only. Do not copy or hotlink its images, videos, layout assets or brand elements.

## Numerimondes art direction

Create original editorial visuals that make the subject understandable at a glance. When the story benefits from it, begin with a real artwork or real-world visual source and build a concrete, memorable metaphor around it. Prefer meaningful images over generic stock photography, decorative gradients or literal icon illustrations. A wholly generated scene can be appropriate when it serves the idea; it is one available technique, not the default for every image.

Possible treatments include:

- A carefully lit photograph of a real object, person, workspace or place when it adds useful context.
- A real artwork or photographed object combined with a restrained surreal detail to make an abstract idea visible.
- A tactile 3D still life using a small number of materials and forms.
- A short ambient video loop when motion adds meaning, not just movement.

When using real source material, confirm that the artwork, photograph or object reference can be used and preserve attribution or license requirements. AI generation can help extend or transform a supplied, permitted reference, create a surreal intervention, or produce a supporting motion study. A wholly generated image is acceptable for an explicitly conceptual scene. Do not present a composite or generated image as documentary evidence. Keep recognizable subjects respectful and avoid fabricating real events, company evidence or customer results.

Give each article its own visual concept. A set may share composition, lighting or a restrained palette, but should not reuse one picture for unrelated topics. Match the crop to the component: collection cards commonly benefit from a square, subject-centered composition with room for overlays. Check that the subject remains clear at thumbnail size and in both light and dark site themes.

For selected video cards, create a short, quiet loop (the supplied examples run about five to six seconds) with no audio. Show the still image at rest, then reveal or play the video on pointer hover or keyboard focus. Set `muted`, `playsinline`, and `loop`; use the cover still as the video's `poster`. Keep a static image fallback on touch devices and when video is unavailable or reduced motion is preferred. Motion should extend the visual source through one restrained action (for example, light shifting, a slow camera move or a small object movement). Do not autoplay motion for every card at rest or add video where it contributes no meaning.

Shared card components should support this as an **optional capability** where the product needs it. Keep the default image-only API and behavior intact; accept a video source and poster as optional inputs. Load or start the video only when the user hovers or focuses a card, pause it when interaction ends, and respect reduced-motion preferences. Keep the component useful on touch screens and when video playback fails. Avoid hardcoding a particular site's asset directory, frontmatter field names or URLs into a reusable component; connect them through the owning site's content and asset conventions.

## Quality and loading performance

Keep the source artwork or master image at high quality, then create optimized web renditions for the actual display sizes. Use responsive image sources where the site supports them, modern image formats when compatible, and lazy loading for below-the-fold cards. Do not trade away visible detail through excessive compression.

Treat video as an enhancement: use a compact, efficiently encoded file, avoid downloading it before interaction, and do not load all card videos when the page opens. Use a crisp poster image so the page looks complete before video starts. Balance file size, sharpness, start time and motion quality on representative desktop and mobile connections; prefer the static image when video would make the page slow or heavy.

## Image generation and integration workflow

1. Read the complete article or page, including frontmatter fields such as title, `summary`, `description`, `tags`, category and any image/video metadata, as well as the body. Note the topic, audience, claims and tone.
2. Write one sentence explaining why the proposed real artwork or source photograph fits this page. Confirm rights and provenance. If the fit is not clear, do not generate yet; research a better source or clarify the concept.
3. Define any visual intervention and decide whether the card needs motion. Keep the still as the default card image and plan a five-to-six-second hover loop only when movement adds meaning.
4. Generate or edit assets **one at a time whenever practical**. Use the real, permitted source as a reference when using AI. Do not produce a large batch before reviewing any result; show the selected result as the work progresses.
5. Record the generated file path in working notes or command output so it can be integrated. Never leave a site-referenced asset only in the generator's private output folder.
6. Move selected stills and videos into the active project's established asset location, using descriptive, stable filenames. Keep source and output paths identifiable; do not assume a directory or URL pattern and do not overwrite an existing asset without an explicit request.
7. Integrate the still into the relevant page or card using that project's content conventions and accurate alt text. For optional hover video, connect the video and poster through the shared card component's supported inputs. Confirm every referenced file exists.
8. Preview the still card, hover transition and mobile/static fallback at the actual crop before continuing to the next visual. Report the image and project path so the user can follow the work as it progresses.

If generation is not needed, use an original photograph or a properly licensed source. Do not fetch Sequoia media into the project for use as Numerimondes content.

## Asset and accessibility checks

- Use a descriptive local filename and follow the active project's asset-path conventions.
- Compress images for the web and choose dimensions appropriate to the displayed crop.
- Write alt text that describes meaningful image content without repeating the card title. If an image is purely decorative and the component supports it, use empty alt text.
- Confirm image paths and inspect the final crop, contrast and text legibility before calling an image integrated.
- Keep the editorial image separate from any video file and provide a poster image for video playback.
