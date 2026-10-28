# Feluqa Platform — Monorepo Architecture & Development Setup

## 1. Vision & Architecture Overview

**Feluqa** is a single proprietary ecosystem and unified namespace across web, SPAs, mobile, desktop, games, APIs, and real-time systems.

While tooling, schemas, and core abstractions are shared, execution runtimes retain distinct **Target Profiles** to respect their specific latency, memory, scheduling, and standard library (`std` vs `no_std`) constraints.

```
+-------------------------------------------------------------------------+
|                              Feluqa SDK                                 |
|         (Macros, Derived Schemas, Auto-UI, Definitions)                 |
+-------------------------------------------------------------------------+
|                          System & Application                           |
|      (Control Panel, Module Registry, Auth, Notifications, Database)    |
+-------------------------------------------------------------------------+
|                     Target Profiles & Runtimes                          |
|  [ Server / API ]  |  [ Web / SPA ]  |  [ Desktop ]  |  [ Mobile / Embedded ]
+-------------------------------------------------------------------------+
|                           Core & Primitives                             |
|          (Feluqa Core Primitives, `no_std` Engine, Shared Types)        |
+-------------------------------------------------------------------------+
```

### Key Architectural Constraints
1. **Platform vs. Modules:** Feluqa is the host runtime and platform. Developers author installable **Feluqa Modules** against this platform.
2. **Profile-Driven Compilation:** Platform capabilities adapt dynamically using Rust target cfg checks (`#[cfg(target_os = "...")]`) and feature flags rather than hardcoded numbered directory paths.
3. **Rust `mod` vs Package Boundary:** A Rust `mod` is purely a language namespace. Package/crate boundaries define operational target profiles, API visibility, and dynamic loading limits.

---

## 2. Directory Structure Blueprint

To maintain clean code hygiene and scalability without relying on brittle numbered folders (e.g., `_0_...`, `_1_...`), the repository is structured into functional domain sub-directories inside `crates/`.

```text
feluqa/
├── Cargo.toml                   # Virtual workspace root
├── Cargo.lock
├── docs/                        # Architecture documentation
├── crates/
│   ├── core/                    # Low-level primitives & platform core
│   │   ├── feluqa-core          # Standard primitives, memory & scheduling
│   │   ├── feluqa-definitions   # Common domain traits, schemas & interfaces
│   │   └── feluqa-nostd         # Minimal `no_std` core for IoT / Embedded targets
│   │
│   ├── macros/                  # Procedural macros & derive crates
│   │   ├── feluqa-model-derive
│   │   ├── feluqa-console-macros
│   │   ├── feluqa-ui-macros
│   │   └── feluqa-server-fn-macros
│   │
│   ├── ui/                      # Unified UI engine & rendering targets
│   │   ├── feluqa-ui-core       # Reactive engine, state, & virtual tree
│   │   ├── feluqa-ui-components # Built-in components & card elements
│   │   ├── feluqa-ui-dom        # Web / DOM renderer target
│   │   ├── feluqa-ui-native     # Desktop / Mobile native bindings target
│   │   └── feluqa-view          # High-level UI composition layer
│   │
│   ├── services/                # Platform subsystems & business domains
│   │   ├── feluqa-auth          # Identity & access control
│   │   ├── feluqa-database      # Persistence abstraction
│   │   ├── feluqa-imagery       # Media processing pipelines
│   │   ├── feluqa-live          # Real-time WebSocket/WebTransport messaging
│   │   └── feluqa-notifications # Messaging & alert router
│   │
│   ├── platform/                # Platform host & management engines
│   │   ├── feluqa-module        # Dynamic module loading & SDK hooks
│   │   ├── feluqa-console       # System CLI & dev console
│   │   ├── feluqa-panel         # Built-in System Control Panel UI
│   │   └── feluqa-system-panel  # Host operator & administration views
│   │
│   └── runtimes/                # Executable binary entrypoints & runtime profiles
│       ├── feluqa-server        # First priority: Server runtime target
│       ├── feluqa-desktop       # Desktop runtime target (Tauri/Wry/Raw)
│       ├── feluqa-mobile        # Mobile runtime target (Android/iOS)
│       └── feluqa-embedded      # IoT / Microcontroller runtime target
```

---

## 3. Core Cargo Workspace Setup

Root `Cargo.toml` using Cargo's virtual workspace with central dependency management (`[workspace.dependencies]`):

```toml
[workspace]
resolver = "2"
members = [
    "crates/core/*",
    "crates/macros/*",
    "crates/ui/*",
    "crates/services/*",
    "crates/platform/*",
    "crates/runtimes/*",
]

[workspace.dependencies]
# Core dependencies
serde = { version = "1.0", default-features = false, features = ["alloc"] }
tokio = { version = "1.0", features = ["full"] }
async-trait = "0.1"

# Internal Crate Inheritance
feluqa-core = { path = "crates/core/feluqa-core" }
feluqa-definitions = { path = "crates/core/feluqa-definitions" }
feluqa-ui-core = { path = "crates/ui/feluqa-ui-core" }
feluqa-module = { path = "crates/platform/feluqa-module" }

[profile.release]
opt-level = 3
lto = true
codegen-units = 1
panic = "abort"

[profile.dev]
opt-level = 1
```

---

## 4. Target Profiles & Constraints Strategy

Target capabilities are decoupled from filesystem folder names using standard Rust `cfg` conditions and Cargo feature trees:

| Target Profile | Constraints | Primary Dependencies | Target Environments |
| :--- | :--- | :--- | :--- |
| **`no_std` Core** | `no_std`, Zero allocation capability | `core`, `alloc` | IoT, Satellites, Embedded |
| **Common Core** | Standard library available | `std`, `serde` | All non-embedded runtimes |
| **Async Service** | High throughput, IO bound | `tokio`, `hyper`, `sqlx` | Server, API Gateways |
| **Web / SPA** | Single-threaded DOM target | `wasm-bindgen`, `web-sys` | Browsers, PWA |
| **Desktop Native** | Multi-window, native system calls | `winit`, `raw-window-handle` | macOS, Linux, Windows |
| **Mobile** | Power/Battery constrained, Touch target | `android_activity`, `objc2` | iOS, Android |

---

## 5. Development Workflow & Commands

### Build Targets Individually
```bash
# Build the core server runtime (Priority #1)
cargo build -p feluqa-server

# Build the Web Assembly UI target
cargo build -p feluqa-ui-dom --target wasm32-unknown-unknown

# Check no_std compatibility for embedded crates
cargo check -p feluqa-nostd --target thumbv7em-none-eabihf --no-default-features
```

### Module Authoring Guidelines
Developers building installable modules interact exclusively with `feluqa-definitions` and `feluqa-module` SDK interfaces:

```rust
use feluqa_module::prelude::*;

#[feluqa_module(id = "org.feluqa.billing", version = "1.0.0")]
pub struct BillingModule;

impl FeluqaModule for BillingModule {
    fn on_load(&mut self, ctx: &mut ModuleContext) -> Result<(), ModuleError> {
        ctx.register_route("/billing", billing_handler);
        Ok(())
    }
}
```