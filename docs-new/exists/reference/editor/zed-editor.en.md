# Zed editor integration

Feluqa Views use `.view.rs` files. The Feluqa Zed extension provides file
recognition, Tree-sitter parsing, syntax highlighting and Rust injections.
The grammar and editor queries live in `products/tree-sitter-feluqa-view/` and
`products/feluqa-zed/`.

The local extension-generation script builds a development extension under
`target/`. Install it through Zed's **Install Dev Extension** flow, then check
that `.view.rs` uses Feluqa Views while ordinary `.rs` files still use Rust.
The extension has not yet been validated interactively in a pinned Zed build;
syntax highlighting also does not provide rust-analyzer semantics for template
expressions.

See the [view language](../views/view-language.en.md) and the
[Tree-sitter porting tasks](../../../_todo/views/webkernel-view-compatibility.en.md).
