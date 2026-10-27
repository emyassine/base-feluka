# Modules, domains and licensing

## What a module means

A Feluqa module is an installable package for the Feluqa platform. It may
provide a focused capability such as HRM, or a larger composed product. A
larger module source may organize business areas under
`business/` or another folder chosen by its developer. Those folders describe
ownership; the package manifest defines the installable unit.

## Domain configuration

The intended operator workflow is to install a compatible module, select the
domain where it should run, configure its settings, and grant the permitted
capabilities. A domain must only see module features covered by its license
and access policy. Users then authenticate through the platform and receive
the grants allowed for their account and domain.

## Licensing and permissions are separate

- **License** determines which module or commercial capabilities the domain
  may use.
- **Permission/ACL** determines which authenticated users may invoke an
  available capability or act on a particular record or field.
- A visible navigation link is not an authorization check. The server must
  enforce both entitlement and user permission for every protected action.

## Current implementation status

The domain-level package lifecycle and license enforcement are not implemented
end to end. Current shipped capabilities and limitations are listed once in
the [platform capability table](platform-overview.en.md#what-is-available-now);
remaining implementation tasks are in the [delivery plan](../../_todo/enterprise-delivery.en.md).

For package and source structure, see [develop a Feluqa module](../for-developers/develop-a-module.en.md).
