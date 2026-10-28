# Product intent

Feluqa is one proprietary ecosystem and namespace across web, SPAs, mobile,
desktop, games, APIs and real-time systems. Tooling, schemas and libraries may
be shared; runtimes retain separate target profiles because their latency,
memory and scheduling constraints differ.

Feluqa is the installed platform. Developers build installable Feluqa modules
against it; operators manage those modules for domains through the built-in
System panel. A product source may represent one module or compose several
business domains into one installable module. The module/package boundary is
explicit; a Rust `mod` is only a language-level namespace.

The server profile is the first delivery priority. Dynamic module installation,
license enforcement and domain-scoped activation remain target capabilities,
not delivered guarantees. The detailed architecture is in
[platform/module layout](architecture/platform-module-layout.en.md); current
behavior is documented in [Exists](../exists/index.en.md).

## Release identity

First-party Feluqa products currently take their release version from the
workspace package version so their CLI profiles and platform product display a
consistent version. The release codename is reserved for the 1.0.0 major line;
the 1.0.0 codename is **Feluqa Waterfall**. Do not display that codename before
the 1.0.0 release.
