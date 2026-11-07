# Shared component source

This directory holds reusable Vue components and assets consumed by the documentation sites. The site host discovers components from the roots configured in `spmpst.workspace.json`; a site does not own or duplicate this source tree.

## Naming and ownership

Use names that describe the component's role and expected content, such as `ProfileSummary`, `CurrencySelector`, `FloatingSubnavigation`, and `HeroOne`. Keep site, company, framework, and renderer names out of identifiers unless they are part of the component's actual domain. Keep implementation helpers beside the component that owns them, in an `*Include/` directory.

Organize components by domain and responsibility. Keep reusable controls separate from page compositions, brand-guide content, and domain-specific workflows. A component under `home/` or `brand/` describes its domain; it does not identify a particular site.

## Multiple frontend targets

The Feluqa UI direction defines semantic, versioned UI data and target-specific renderers. A stable UI role or schema node is the contract; Vue, native, and other renderers provide implementations of that contract. Platform implementations must be selected through renderer/provider registration, not by putting platform names or source paths into application-facing component identifiers.

This directory currently contains Vue implementations for the documentation sites. It is not yet the completed cross-platform component catalogue, and no native implementation is implied by a Vue component's name. The versioned Feluqa UI schema and the renderer catalogue remain the source of truth for cross-target behavior; see the interface architecture and research guide before adding that integration.

## Host integration

The host receives component roots, styles, and scripts through `docs/vitepress-site/spmpst.workspace.json`. Preparation discovers components and generates the import/registration module from those roots. Theme code consumes that generated registry instead of importing components from repository-relative paths. Keep this boundary injectable so a different workspace can provide its own roots and implementations.
