# One module for web and workstation products

## Product goal

Feluqa itself is the application framework across web, workstation, mobile and
the [constrained/embedded profiles already described in the platform vision](../../knowledge/architecture/platform-vision-decisions.en.md).
It must own the module model, UI/component system, configuration, storage
contracts, identity, permissions, networking and build orchestration. Product
developers should use Feluqa namespaces and tools instead of adopting a
different application framework for each surface.

A business module should be composable into more than one Feluqa product from
the same domain and application codebase:

- A hosted web application, which can combine a public website with business
  administration.
- A standalone workstation application for an organization that does not
  need a hosted website or central server to run its daily work.
- Optionally, access from other computers and mobile devices through a local
  peer network or a routed network connection.

The module owns its domain rules and workflows. Each Feluqa product supplies
the appropriate Feluqa UI, persistence and connection adapters. Product
selection must not fork or duplicate module business rules. Shared libraries
that do not need allocation, an operating system or a network should remain
`no_std` and usable by constrained targets; web and workstation-specific
adapters sit at their respective boundaries.

## Representative bookstore scenario

Use one bookstore module for a public library/bookstore serving college
students. In web deployment, it may expose a public catalogue and customer
workflows while staff use administration screens for books, sales and stock.
In workstation deployment, staff use the same module locally to manage the
business without requiring the public website. If more than one device is
needed, a laptop or mobile device may open its own authorized session against
the workstation or another configured host.

This is a target scenario, not an implemented capability.

## Architecture questions to resolve

1. Define the shared module contract: domain/application services, migrations,
   permissions, resources, jobs and events, independent of a web process or a
   desktop window.
2. Define product adapters: web routes and browser panels; workstation window,
   local configuration and user-owned storage; and the network listener/client
   used for additional devices.
3. Specify database topology per mode. A workstation may use a local database
   and local credentials; hosted web may use a configured server database and
   pooled connections. Connection settings, secrets, migrations, backup and
   restore must follow the selected mode without changing module rules.
4. Decide whether multi-device operation is client/server to the workstation,
   peer-to-peer, routed through a configured host, or supports more than one
   topology. Do not describe these as interchangeable: they have different
   discovery, trust, availability and network requirements.
5. Specify identity and authorization for local and remote sessions, device
   enrollment/revocation, transport security, audit records and data ownership.
6. Define offline behavior and data movement: what is available without a
   connection, whether remote devices may write, how changes are synchronized,
   how concurrent edits/conflicts are resolved, and what happens after a
   device is lost or restored from backup.
7. Prototype one bookstore workflow on both web and workstation from a single
   module source tree. Add a second device only after security, synchronization
   and recovery behavior have explicit acceptance evidence.
8. Define how the Feluqa UI/component system is authored once and rendered on
   web, workstation and mobile, including capability differences, navigation,
   input/accessibility behavior, asset delivery and server/client boundaries.
   Do not expose third-party framework namespaces as product APIs.

## Non-goals for the first architecture spike

- Choosing a desktop UI framework by assumption.
- Treating a database file shared over a network filesystem as safe multi-user
  synchronization.
- Claiming peer-to-peer support merely because a desktop process can bind a
  network port.
- Duplicating business validation in separate web and desktop implementations.

## Acceptance evidence

- One module source tree builds into a hosted web product and a standalone
  workstation product.
- The web product can combine public and administrative surfaces; the
  workstation product can run its required business workflow without the
  hosted website.
- Each mode documents its database connections, local state, secrets,
  migrations, backup and restore behavior.
- A second device can be enrolled and revoked, open an authorized session, and
  exercise a documented workflow through the chosen network topology.
- Offline behavior, concurrent writes, conflict outcomes, audit history and
  recovery are tested and documented before multi-device use is called
  production-ready.
