# Zed editor integration

This page documents the Feluqa Views language extension for Zed. The
[view-language reference](../views/view-language.en.md) owns the template
syntax and compiler behavior; this page covers editor packaging and
acceptance.

## Source layout

```text
products/feluqa-zed/
├── extension.toml
├── README.md
└── languages/feluqa_view/
    ├── config.toml
    ├── highlights.scm
    ├── injections.scm
    ├── brackets.scm
    ├── indents.scm
    └── outline.scm
products/tree-sitter-feluqa-view/
├── grammar.js
├── tree-sitter.json
├── src/                 # generated parser and optional external scanner
├── queries/
└── test/corpus/
```

The Tree-sitter grammar is editor tooling and is not a web-server dependency.
The local extension generator produces a development bundle under `target/`.
It pins the grammar with a real local commit; do not invent remote repository
URLs or revisions. Public distribution requires an explicit licensing
decision.

The extension manifest uses the stable extension ID `feluqa-views` and a
`[grammars.feluqa_view]` entry. A distributable grammar repository and
immutable revision have not been selected; use the generated local repository
for development. The extension records El Moumen Yassine as its author.

## File detection

The language configuration uses the `.view.rs` suffix:

```toml
name = "Feluqa Views"
grammar = "feluqa_view"
path_suffixes = ["view.rs"]
```

`path_suffixes` contains suffixes, not globs. Verify that `home.view.rs` is
detected as Feluqa Views and that ordinary `main.rs` remains Rust.

## Grammar and queries

The grammar recognizes HTML/template elements, registered components and
slots, static and bound attributes, escaped/trusted expressions, Rust blocks,
conditions, loops, includes, layouts, sections and template comments.
`highlights.scm` colors those nodes; `injections.scm` embeds Rust only in the
Rust expression/block regions. Bracket, indentation and outline queries must
reference node names that exist in the generated `node-types.json`.

The parser should recover from incomplete edits without interpreting the rest
of a file as Rust. Rust string/raw-string/comment boundaries matter for
`@rs`, `}}` and nested delimiters. Highlighting and injection do not provide
Rust name resolution or rust-analyzer diagnostics for template expressions.

The compiler remains the semantic authority. Grammar, compiler and docs should
share fixtures and a versioned language contract; new syntax changes all of
them together.

## Install and verify locally

1. Run `products/feluqa-zed/install-dev.sh` to generate the parser and local
   extension bundle.
2. In Zed, choose **Install Dev Extension** and select the generated extension
   directory under `target/`.
3. Open a `.view.rs` file and check language selection, highlighting, Rust
   injections, brackets and error recovery while editing.
4. Open a normal `.rs` file and verify it still uses Rust language support.
5. Inspect Zed's log if the extension fails to load.

The extension has not yet passed interactive acceptance in a pinned Zed
version. Grammar fixtures and package generation alone do not count as editor
validation. The compiler/editor conversion priorities are tracked in the
[Webkernel conversion plan](../../../_todo/views/webkernel-view-compatibility.en.md).
