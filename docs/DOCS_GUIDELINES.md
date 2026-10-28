# Documentation guidelines

Write Feluqa documentation for people who need to make a decision or complete
a task. Keep it direct, readable and easy to translate.

The house style is [README_Voice_And_Tone.en.md](../README_Voice_And_Tone.en.md).
Follow its linked Google Developer Documentation Style Guide pages on [global
audiences](https://developers.google.com/style/translation),
[accessibility](https://developers.google.com/style/accessibility),
[inclusive language](https://developers.google.com/style/inclusive-documentation),
[jargon](https://developers.google.com/style/jargon),
[punctuation](https://developers.google.com/style/periods#exclamation-points),
[abbreviations](https://developers.google.com/style/abbreviations#dont-use), and
the [word list](https://developers.google.com/style/word-list). Use RFC 2119
keywords only for requirements.

## Write for readers

- Put the purpose and current status near the start.
- Use short sentences, active voice, familiar words and consistent names.
- Address the reader directly when giving instructions.
- Explain an uncommon technical term the first time you use it, or link to a
  clear definition.
- Avoid idioms, metaphors, slang, unexplained abbreviations and exclamation marks.
  Write “for example” instead of “e.g.”
- Use descriptive headings and links. A link should make sense on its own.
- Use headings in order, starting with one page title. Use numbered steps for
  procedures and tables for information readers need to compare.
- Include text alternatives for images. Do not put information only in an image.
- Prefer examples that readers from different backgrounds can understand.

## Keep the documentation organized

| Directory | Use it for |
|---|---|
| `01.introduction/` | Platform overview, product intent and roadmap entry point |
| `02.architecture/` | Workspace, compilation, runtime and UI contracts |
| `03.for-developers/` | Module authoring, routes, data, permissions and testing |
| `04.for-organizations/` | Availability, modules, licensing, data and security |
| `05.reference/` | CLI, editor, Rust, visual QA and view-language references |
| `06.governance-and-policy/` | Dependencies, proprietary distribution, updates and migration records |
| `07.research-and-notes/` | Experiments, source notes and measured results |
| `roadmap/` | Planned work, dependencies and acceptance criteria |
| `decisions/` | Accepted decisions and choices that remain open |

English is the normative language. A translated page should use the same number
and slug as its English source. Keep repository and product README files, legal
notices, and benchmark evidence with their owners.

## Name and order pages

Name documentation pages `<two-digit-number>.<kebab-case-name>.<language>.md`.
Use `00.index.en.md` as the documentation entry point. The required
`DOCS_GUIDELINES.md` filename is an exception. JSON manifests and other support
files do not use the page naming pattern.

Use unique whole numbers within each directory. When you insert a page, renumber
later pages and update their links. Do not use decimal numbering.

## Show status and authority

- `[Delivered]` means the feature exists and its stated behavior has evidence.
- `[Target]` means Feluqa has selected the direction, but has not necessarily
  delivered it.
- `[Exploring]` means the idea still needs evaluation or a decision.

The owner-designated [Monorepo Architecture](02.architecture/01.monorepo-architecture.en.md),
[Product Document](01.introduction/02.intent.en.md), and
[Compilation requirements](02.architecture/02.compilation-and-targets.en.md)
set the architecture, product and compilation direction. They take precedence
over conflicting pages and older decision records. Follow the
[index of accepted decisions](decisions/03.accepted-decisions.en.md).
Use [the open-decision register](decisions/01.pending-decisions.en.md) only for
choices those sources leave unresolved.

A selected target is not proof that a feature has shipped. Describe current
behavior with implementation evidence and link to the
[current baseline](01.introduction/01.platform-overview.en.md).

## Maintain decisions and historical sources

Record a new decision with its status, reason, consequences and acceptance
criteria. When the owner decides an open question, add it to accepted decisions,
update the affected chapters and remove it from the open register.

Preserve source blocks that serve as historical evidence. Do not rewrite their
content while claiming to preserve the original. Put current status and
corrections before the source block and make its authority clear.

When English changes, update its French translation or state that translation
work remains. Keep historical task identifiers tied to their source language
until you have a reviewed mapping.

## Check the result

Check page names, headings, local links, link text and index navigation. For the
migration record, compare retained text with its original source. Keep the raw
M0 reports, samples and hashes unchanged. A documentation update does not prove
runtime, security, browser or release acceptance.
