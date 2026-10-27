# Proprietary code and private registry

Feluqa framework crates and first-party applications are proprietary. The repository `LICENSE` is the default notice. Do not publish these packages to crates.io or another public registry.

The monorepo defines the `feluqa` sparse registry in `.cargo/config.toml`. Credentials belong in Cargo's credential store (`cargo login --registry feluqa`) or an environment-provided credential. Never commit tokens, credentials, or a token-bearing Cargo config.

Framework packages use `publish = ["feluqa"]` so Cargo refuses publication to other registries. Internal framework dependencies name the same registry and carry a version as well as a workspace path, so a published package resolves its dependencies from Kellnr. Publish dependency crates first, then the facade, then the CLI. Applications use `publish = false`. Private-registry publication is an explicit release action after package review; publication record (2026-10-26): `feluqa-console`, `feluqa-view` and `feluqa` have been published privately through version 0.1.1. That release does not include the CLI or editor products.

The website's fonts, logos, and photographs have separate licenses and source notices. A proprietary repository license does not override those third-party terms.
