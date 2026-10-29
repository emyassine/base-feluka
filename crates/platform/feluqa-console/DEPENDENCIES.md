# Dependencies

Package: `feluqa-console` 0.1.1  
Workspace MSRV declaration: Rust 1.88
Review date: 2026-10-27

This crate provides the runtime-neutral command registry and the optional
standard-library terminal and source-discovery capabilities. Feature
boundaries matter: default `std` enables terminal interaction, while `build`
enables recursive command source discovery and its Rust syntax parser.

## Direct dependencies

| Dependency | Activated by | Why it is used | Review notes |
|---|---|---|---|
| `inventory` 0.3 | Always | Collects statically linked command and host descriptors from product crates without maintaining a central command list. | Rust-native compile-time registration; locked version 0.3.25. Upstream declares Rust 1.68 and MIT OR Apache-2.0. Verify that linker/platform behavior remains acceptable on each supported target. |
| `feluqa-console-macros` 0.1.0 | Always | Implements `#[feluqa::command]` and profile registry attributes used by the public console API. | First-party workspace crate, built and versioned together. Its direct parser/codegen dependencies are recorded in its own `DEPENDENCIES.md`. |
| `crossterm` 0.29 | Optional, `std` | Cross-platform terminal events, raw mode and cursor/terminal control for interactive prompts. | Defaults are disabled; only `events` and `windows` are selected. Locked version 0.29.0 declares Rust 1.63 and MIT. Event APIs are documented by [Crossterm](https://docs.rs/crossterm/0.29.0/crossterm/event/index.html). It brings platform event and terminal support that must remain behind `std`. |
| `signal-hook` 0.3 | Optional, `std` | Safely records SIGINT/SIGTERM while the synchronous selector is in raw terminal mode so it can restore terminal state and return the conventional exit status. | Locked version 0.3.18, Apache-2.0 OR MIT. The selector uses the flag registration API, not complex work in a signal handler; see [signal-hook flag registration](https://docs.rs/signal-hook/0.3.18/signal_hook/flag/fn.register.html). There is no declared MSRV in the locked manifest. Unix signals are target-specific; other platforms require their supported termination behavior to be checked. |
| `syn` 2 | Optional, `build` | Parses Rust source while the build helper discovers annotated command files; runtime command dispatch does not parse source. | Defaults/features are inherited from the workspace declaration (`full`). Locked version 2.0.119 declares Rust 1.71 and MIT OR Apache-2.0. This is build-time-only and may be a significant compile-time dependency. |

`std` does not depend on Tokio. `tokio` is deliberately absent from the
dependency list; async command execution remains a future opt-in runtime
adapter. The source parser is also feature-gated and is not required by
products that do not enable `console-build`.

## Maturity and supply-chain checks

The versions above were read from the locked workspace dependency graph and
vendored package manifests. The crate APIs are established Rust ecosystem
libraries, but this is not a security audit or a claim about upstream incident
response. The selected dependency features and direct tree were inspected with
`cargo tree -p feluqa-console -e features`; Crossterm's event path includes
`mio`, `parking_lot`, `rustix`, and `signal-hook-mio`. This terminal support is
feature-gated, but the transitive footprint is not trivial and should be
rechecked if the prompt implementation changes. Lockfile resolution is
committed in the root `Cargo.lock`.

Checks performed on 2026-10-27: `cargo tree -e features`, `cargo check -p
feluqa-console --all-targets --locked`, `cargo check -p feluqa-console
--no-default-features --locked`, `cargo clippy -p feluqa-console --all-targets
--locked -- -D warnings`, `cargo test -p feluqa-console --locked`, `cargo build
-p feluqa-cli --bins --locked`, and `cargo fmt --all --check`. The crate test
command succeeds, but this crate currently contains zero unit and doc tests.
No advisory or license-policy scanner is installed in the current Cargo
toolchain: `cargo audit` and `cargo deny` are unavailable. No full target
matrix, provenance attestation, independent source audit or offline
reproducibility test is claimed here. Update this record whenever versions,
features or the runtime boundary change.

For the policy all first-party packages follow, see
[dependency review policy](../../../docs-new/technical/06.governance-and-policy/01.dependencies.en.md).
