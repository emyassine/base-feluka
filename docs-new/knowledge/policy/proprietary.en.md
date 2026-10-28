# Proprietary software and private registry

Feluqa framework crates and first-party modules are proprietary. The
repository's `LICENSE` is the default notice. Do not publish packages to
crates.io or another public registry without an explicit distribution decision.

The monorepo configures the private `feluqa` Cargo registry. Store credentials
in Cargo's credential store or an approved environment secret. Never commit
tokens, credentials, or a token-bearing Cargo configuration.

Third-party assets and code retain their own notices and licenses. Preserve
those notices when packaging the platform or its modules.

For canonical remote endpoints and the required CLI/platform update behavior,
see the [update and release policy](updates.en.md). Endpoint URLs live in
`feluqa-definitions::RemoteLink`.
