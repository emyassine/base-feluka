# For module developers

Feluqa supplies the platform runtime, System panel, panel framework and shared
security contracts. A module declares business capabilities and registers
them with Feluqa; it does not ship a second server or a copy of the panel.

Recommended path:

1. [Develop a Feluqa module](develop-a-module.en.md)
2. [Add a panel resource and page](panels-resources-and-pages.en.md)
3. [Store data and run migrations](data-and-migrations.en.md)
4. [Authorize users and actions](authorization.en.md)
5. [Write views and components](views-and-components.en.md)
6. [Add custom routes](custom-routes.en.md) when CRUD is not enough
7. [Test and release a module](testing-and-release.en.md)

The runtime currently composes modules statically into a compiled product.
System-panel installation, domain-scoped activation and license enforcement
are target capabilities, not shipped functionality. See [the module lifecycle
status](../reference/panels/filament-port-status.en.md).
