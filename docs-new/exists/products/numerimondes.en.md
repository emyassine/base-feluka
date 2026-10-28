# Numerimondes platform module

This page is the single product-specific guide for the Numerimondes source in
this repository. The general Feluqa guides describe platform behavior and do
not depend on this product.

## Product shape

Numerimondes is a composed Feluqa platform module/source. It groups business
capabilities, currently including CRM, and consumes the panel, identity,
database, view and runtime services provided by Feluqa. The long-term package
boundary is one installable module; today its source is statically composed
into a development executable and cannot be installed dynamically from the
System panel.

The current source tree still contains transitional `src/app/` and
`src/modules/` buckets. The intended direction is domain ownership, with
business modules grouped under `business/` or another developer-chosen path.
Those generic buckets are allowed when useful, but are not the recommended
starting layout.

```text
products/numerimondes/
├── config/                  # application and database profiles
├── resources/views/         # product-owned site and page views
├── public/                  # product-owned public assets
├── src/
│   ├── app/                 # transitional shared controllers/models/services
│   ├── modules/
│   │   ├── business/        # shared ERP dashboard and route integration
│   │   ├── crm/             # CRM module source and dialect migrations
│   │   ├── system/          # Core-facing handlers and routes
│   │   └── live.rs          # product Live action integration
│   ├── routes/              # global route composition
│   └── service_provider.rs  # statically compiled product composition
├── build.rs                 # compiles views and migration registry
├── feluqa.toml              # app identity, provider and module config
├── tests/                   # cross-struct product integration coverage
└── storage/                 # local development state
```

This is a description of the current tree, not a claim that the target layout
or runtime-installable package format is complete.

## Current behavior

- `/` and `/about` serve the public website.
- `/system` integrates account setup/login/logout, user and role operations,
  tenant listing/provisioning, and module, connection, migration and audit
  views. Core mutations use session, CSRF, permission and audit checks.
- `/admin/customers` provides the first CRM CRUD slice, with tenant and record
  ownership plus field-level permission checks.
- The registered CRM module ID is `numerimondes.crm`; its source currently
  resides in `src/modules/crm/`, not under `src/modules/business/`.
- The product uses the `default` database connection for its application data.
  CRM migration variants exist for SQLite and PostgreSQL; named connections
  are reserved for explicit integrations.
- Compiled `.view.rs` templates render its site and panel content. Shared panel
  shell, CSS and JavaScript are owned by Feluqa crates, not copied into this
  product.
- Its development harness is started through the Feluqa CLI from the
  repository workspace. This does not demonstrate dynamic module installation.

These are implementation facts, not an enterprise release qualification.
Deployment, restore and full PostgreSQL HTTP coverage remain open. The product
also does not demonstrate full legacy panel implementation theme/component parity; see the
[panel port status](../reference/../for-developers/panels-resources-and-pages.en.md).

## Run the current development product

From the repository root, enter the product directory before invoking the
CLI so it detects the app context:

```sh
cd products/numerimondes
cargo run --manifest-path ../../_crates/Cargo.toml -p feluqa-cli -- dev
```

Open `http://127.0.0.1:38127/`. The app command detects the product manifest
and configuration. Build the standalone binary with:

```sh
cargo build --manifest-path _crates/Cargo.toml -p numerimondes --release --locked
```

The page's handler timing and the server middleware's `Server-Timing` value
measure different intervals; inspect the response header in browser developer
tools for the latter.
