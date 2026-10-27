# Feluqa View Tree-sitter grammar

This product defines the editor grammar for Feluqa `.view.rs` templates. A file
contains HTML markup, Feluqa template directives, and trusted Rust expressions
that are compiled with the application.

## Supported syntax

- HTML elements, void/self-closing elements, attributes and quoted values
- HTML entities, comments, doctypes, and script/style content
- `{{ expression }}` escaped output and `{!! expression !!}` raw output
- Rust expressions in bound attributes such as `:title="page.title"`
- `@rs` blocks, `@if` / `@elseif` / `@else`, and `@foreach`
- `@include`, `@extends`, `@section`, `@yield`, and `<x-...>` components
- `@@` for a literal at-sign and `{{-- ... --}}` template comments

The grammar is registered as `feluqa_view`; the Zed extension recognizes the
compound `.view.rs` suffix. Rust highlighting is supplied by the extension's
injection query. The external scanner protects closing markers inside Rust
strings, raw strings, character literals, and comments.

## Generate

Run `npm run generate` from this directory. Generated parser files are checked
in so the Zed extension can package the grammar without a runtime dependency on
the reference checkout.

Rust inside a view is developer-authored source, not a sandbox. The framework's
view compiler remains responsible for validating and compiling templates.
