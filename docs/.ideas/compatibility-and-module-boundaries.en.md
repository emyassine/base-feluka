# Ideas and considerations: compatibility and module boundaries

This is a working note, not a settled architecture decision. It records where
Feluqa may benefit from stable interfaces and how those interfaces relate to
module independence.

## Where compatibility matters

Compatibility is most valuable where another party, process, saved artifact,
or deployed application depends on Feluqa. Internal Rust APIs can remain easier
to change while the framework is evolving.

- **Module metadata and package format:** version manifests, identifiers,
  declared capabilities, permissions, dependencies, and compatibility ranges.
- **Core services:** documented contracts for identity, authorization, audit,
  configuration, storage, and lifecycle operations that modules consume.
- **Data formats:** durable configuration, schemas, migrations, and exported
  data need explicit versions and upgrade rules.
- **Developer and operator interfaces:** CLI behavior, build configuration,
  generated project structure, runtime configuration, and deployment commands
  become dependencies for users and automation.
- **Cross-language integration:** when a real non-Rust consumer appears, expose
  the needed capability through a narrow interface such as a C ABI, a local
  protocol, or a network API. Avoid maintaining bindings for hypothetical
  consumers.

## Could a module be an independent application?

Yes. A module could be built and deployed as its own process or application,
then communicate with Feluqa Core through a versioned contract. That is a
coherent model, especially when modules need different languages, dependencies,
release cycles, or isolation boundaries.

An ABI is one possible boundary, but it specifically describes binary-level
calling conventions. A C ABI can help a Rust host load native libraries, but
it does not by itself provide process isolation, safe unloading, portability
across operating systems, or a complete module lifecycle. ABI-based plugins
also couple host and plugin to compatible platform and binary details.

For independently running modules, a protocol is often a better fit: local IPC
for modules on the same machine, or HTTP/RPC for remote deployments. A module
can then be written in another language without sharing the Core's process or
toolchain. A WebAssembly component could be another option where portable,
constrained execution is important, subject to a deliberate host API and
runtime choice.

These options can coexist, but each has costs. In-process ABI plugins are fast
and direct, but share a failure and security boundary. Separate processes add
deployment and communication work, while making isolation and independent
upgrades more practical. A network protocol can work across machines, but
requires authentication, authorization, versioning, and failure handling.

## What is Core for?

If modules own their own business behavior and can be complete applications,
Core should provide shared platform capabilities rather than dictate each
module's internal design. Candidate responsibilities include:

- identity, authentication, authorization, and tenant context;
- audit events and platform-wide policy enforcement;
- module discovery, declared capabilities, compatibility checks, and lifecycle;
- shared configuration, secret references, and operational health;
- optional common UI, navigation, and integration conventions.

The Core should not become a mandatory bottleneck for every business operation.
A module may own its database and internal workflows, while using Core services
where it needs shared identity, policy, audit, or discovery. The boundary should
make those dependencies explicit. If Core provides no capabilities that
independent applications need, it may be only a packaging convention; that
would be a reason to simplify the platform rather than preserve an empty
"core" layer.

## A practical direction to investigate

Keep Rust as Feluqa's primary implementation language for now. Define
language-neutral schemas and protocol contracts for externally consumed
capabilities, and keep internal crate APIs free to evolve. Start by specifying
one representative module-to-Core interaction, including identity, permission
checks, errors, version negotiation, and offline behavior. Then compare a
statically linked Rust module, an in-process ABI plugin, and a separate local
service against that real use case before committing to a general plugin
architecture.

No stable module ABI, remote module protocol, or cross-language SDK is
established by this note. The module lifecycle, local-first requirements, and
security boundaries remain design inputs for that decision.
