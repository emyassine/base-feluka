# Feluqa View language

Feluqa View files use the `.view.rs` suffix. They are HTML templates containing
trusted Rust expressions and blocks; they compile into the consuming product
at build time. They are not PHP files or runtime scripts.

The current language contract includes escaped `{{ expression }}` output,
trusted HTML values, `@rs` / `@endrs`, conditionals, loops, includes,
layouts, sections, namespaced components and slots. Rust blocks are trusted
developer code and must never be accepted from panel users.

Escape output by default. Use typed trusted HTML only for framework-rendered
markup. Local links and form actions must be validated; URL attributes use
`SafeUrl`. JavaScript and CSS interpolation are not supported without dedicated
encoders. Production templates are compiled; development recompiles changed
views and reports source errors.

The panel shell and document boilerplate belong to Feluqa. Panel page templates
should supply page content, not their own `<html>`, `<head>` or `<body>`.

The compiler and Tree-sitter grammar still need a shared conformance corpus.
See the [developer view guide](../../for-developers/views-and-components.en.md)
and [Webkernel conversion inventory](../../../_todo/views/webkernel-view-compatibility.en.md).
