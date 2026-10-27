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
