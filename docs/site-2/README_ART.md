# Numerimondes visual direction

This file is the working art direction and image-production guide for `site-2`. Use it whenever creating, selecting or integrating images for articles, capabilities, legal notices, projects and other editorial cards.

## Reference analysis

The supplied Sequoia card markup shows a square image acting as the cover and poster for an optional short video. A dark gradient supports overlaid category, title and author text. The supplied examples use more than one visual treatment:

- Real, tactile objects arranged to express an idea, such as wooden chess pieces for stages in a startup.
- Surreal or composite imagery, such as a recognizable classical sculpture placed in an unexpected scene.
- Minimal, atmospheric 3D imagery, such as a thin metal form floating above a stone surface.
- Short, muted, looping video that extends the cover image through restrained movement.

The supplied stills are roughly 920 by 920 pixels. The two supplied video files are muted H.264 loops of about five and six seconds, with a still image used as each video's poster. The examples feel editorial and idea-led. They use one strong visual metaphor, simple composition, texture, deliberate light and a clear focal subject. Their variety is part of the reference; every image does not need the same medium or palette.

The HTML exposes image and video URLs, dimensions, card text and playback settings. It does not establish whether an image was photographed, composited, rendered or generated with AI. Treat the Thinker-and-strawberry example as a surreal composite reference; do not claim a specific production method without reliable provenance.

Use Sequoia as inspiration for the editorial approach only. Do not copy or hotlink its images, videos, layout assets or brand elements.

## Numerimondes art direction

Create original editorial visuals that make the subject of an article or capability understandable at a glance. Prefer a concrete, memorable image or visual metaphor over generic business stock photography, decorative gradients or literal icon illustrations.

Possible treatments include:

- A carefully lit photograph of a real object, person, workspace or place when it adds useful context.
- A photographed object combined with a restrained surreal detail to make an abstract idea visible.
- A tactile 3D still life using a small number of materials and forms.
- A short ambient video loop when motion adds meaning, not just movement.

Use real source material when the image makes a factual claim about a person, place, product, equipment or event. Confirm that the source can be used and preserve its attribution or license requirements. AI generation can help create conceptual scenes or transform a supplied, permitted reference, but must not be presented as documentary evidence. Keep recognizable subjects respectful and avoid fabricating real events, company evidence or customer results.

Give each article its own visual concept. A set may share composition, lighting or a restrained palette, but should not reuse one picture for unrelated topics. Match the crop to the component: collection cards commonly benefit from a square, subject-centered composition with room for overlays. Check that the subject remains clear at thumbnail size and in both light and dark site themes.

For video cards, use a short, quiet loop with no audio, `muted`, `playsinline`, and a representative poster image. Motion should remain secondary to the image and text. Keep a static image fallback so the card remains useful when video is unavailable or reduced motion is preferred. Do not add video to every card by default.

## Image generation and integration workflow

1. Read the article or page and define one visual idea before writing a prompt. Decide whether the subject calls for a real source image, a conceptual generated image, a composite or video.
2. Generate images **one at a time whenever practical**. Do not produce a large batch of unrelated images before reviewing any result. This lets the image be seen and adjusted as work progresses.
3. When using the image-generation tool, record the generated file path in the working notes or command output. The output path must be available for integration; never leave a site-referenced asset only in the generator's private output folder.
4. Copy the selected image into the project under `docs/site-2/public/images/`, using a descriptive, stable filename. Keep the generated original outside the project if it is useful as a source; do not overwrite an existing asset without an explicit request.
5. Integrate the image into the relevant page or card immediately. For collection entries, set the frontmatter `image` and a concise, accurate `imageAlt`. Confirm that the referenced file exists.
6. Preview the integrated result at the actual card or page crop, then continue to the next image. Report the image and project path so the user can follow the work as it progresses.

If generation is not needed, use an original photograph or a properly licensed source. Do not fetch Sequoia media into the project for use as Numerimondes content.

## Asset and accessibility checks

- Use a descriptive local filename and a project-local path such as `/images/articles/topic-name.jpg`.
- Compress images for the web and choose dimensions appropriate to the displayed crop.
- Write alt text that describes meaningful image content without repeating the card title. If an image is purely decorative and the component supports it, use empty alt text.
- Confirm image paths and inspect the final crop, contrast and text legibility before calling an image integrated.
- Keep the editorial image separate from any video file and provide a poster image for video playback.
