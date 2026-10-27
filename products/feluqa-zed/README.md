# Feluqa Views for Zed

Proprietary editor support for Feluqa's compiled `.view.rs` language. The extension includes HTML/template highlighting and Rust injections; compiler diagnostics and rust-analyzer semantics remain provided by the Feluqa build.

## Install locally

From the repository root, run:

```sh
./products/feluqa-zed/install-dev.sh
```

The script builds a temporary grammar Git repository from the checked-in Tree-sitter product, pins its actual commit in a generated extension manifest under `target/`, then opens Zed's development-extension installer on that package. No remote repository or revision is fabricated. Commit and distribution of the private extension remain a separate deployment decision.

The grammar source and queries live in `products/tree-sitter-feluqa-view/`; edit there, regenerate through the script, then use **Install Dev Extension** in Zed.
