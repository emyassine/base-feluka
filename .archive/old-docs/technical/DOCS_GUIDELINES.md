# Documentation guidelines

Feluqa's main framework documentation lives in [`docs-new/`](../00.index.en.md). Write for application developers first. Keep pages short, task-focused and clear about what works in the current checkout.

## Page rules

- Start every page with one H1 title.
- Use the numbered navigation structure and filenames already in `docs-new/`.
- Put the reader's task and the current behavior first.
- Use short paragraphs, active voice and familiar words. Explain technical terms when they first appear.
- Add a Mermaid diagram only when it makes the system easier to understand.
- Record settled behavior in the guide that explains it.
- Put unfinished implementation work in `docs-new/999-roadmap/`, grouped into concern-specific folders with one action or major change per file. Keep root and concern indexes navigational; each task owns its scope, prerequisites and acceptance. Link to other tasks and contracts instead of repeating their requirements.
- Keep crate API details beside the crate. Link to them from global docs only when useful.
- Follow [`README_Voice_And_Tone.en.md`](../../README_Voice_And_Tone.en.md) and its linked Google Developer Documentation Style Guide pages.

## Status

Describe implemented behavior from the current code. A selected architecture is the framework contract, but it does not prove every target or feature is already built. Put concrete implementation gaps in the roadmap. Do not label a settled product requirement as an open decision.

## Legacy material

`docs-new/technical/` contains detailed technical references and migrated source material. The `docs-new/00.index.en.md` page is the entry point for all Feluqa documentation. Preserve benchmark reports and third-party notices.
