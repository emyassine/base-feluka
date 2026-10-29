---
icon: "scroll-text"
title: "Release Notes"
description: "Feluqa's versioning scheme, support policy, Rust requirements, and release notes."
summary: "Explains Feluqa's versioning scheme before and after 1.0, the absence of an announced release cadence or support periods, and how release-specific Rust MSRV requirements should be interpreted. It distinguishes the current 0.2.0 workspace baseline from a published release or verified support promise."
date: 2026-10-29
lastmod: 2026-10-29
weight: 1
status: "Exploring"
tags: [feluqa, release-notes, versioning]
draft: true
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# Release Notes

Each major documentation version has its own release notes. This page records
the versioning scheme, support policy, Rust version requirements, and changes
for the Feluqa release line covered by this documentation.

- [Versioning Scheme](#versioning-scheme)
- [Support Policy](#support-policy)
- [Rust Version Requirements](#rust-version-requirements)
- [Current Development Baseline](#current-development-baseline)

## Versioning Scheme

Feluqa packages use [Semantic Versioning](https://semver.org/) and Cargo
version constraints (`MAJOR.MINOR.PATCH`). Before 1.0, minor releases may
include breaking changes while the public APIs are being established. Starting
with 1.0, major releases may include breaking changes; minor releases add
backward-compatible functionality, and patch releases contain compatible
fixes.

Feluqa has not announced a release cadence. Do not infer a schedule from the
numbering scheme.

When depending on Feluqa packages, choose a version constraint that matches the
compatibility you need. Before 1.0, a constraint such as `0.2` stays within
that minor line under Cargo's caret rules. For a stable major release, a
constraint such as `^1.0` permits compatible minor and patch updates. Review
the release notes and upgrade guidance before moving to a line that may contain
breaking changes.

## Support Policy

Feluqa has not announced bug-fix or security-support periods. Release and
support dates will be added here once they are established. The table below
will list published releases; development versions do not imply a support
commitment.

| Version | Rust requirement | Release | Bug fixes until | Security fixes until |
| --- | --- | --- | --- | --- |
| `0.2.0` workspace development baseline | `1.88` | Development version; no release date recorded | Not applicable | Not applicable |

The `0.2.0` row describes the current workspace manifest. It is not a
published release and carries no support commitment.

## Rust Version Requirements

Each release entry will state the minimum supported Rust version (MSRV) for
that release. The MSRV is the minimum compiler version the release promises to
support; it is not necessarily the latest stable Rust version.

The workspace currently declares Rust 1.88 as its baseline. This is a manifest
declaration for the development tree, not a verified release-wide MSRV
promise. Check package-specific requirements and use the release-specific
requirement when one is published.

## Current Development Baseline

The workspace manifest currently sets the exact version `0.2.0` and Rust
`1.88` as its baseline. This documentation line covers package versions
`<=1.0.0`. Cargo's package `version` field stores one exact version; a range
such as `<=1.0.0` belongs in a dependency requirement, not in that field. The
current version describes the repository's development configuration, not a
published release or a support commitment. The release cadence, verified
release-wide MSRV, and support periods remain to be established.
