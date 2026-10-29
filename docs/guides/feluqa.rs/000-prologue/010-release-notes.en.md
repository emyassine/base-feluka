---
icon: "scroll-text"
title: "Release Notes"
description: "Feluqa's versioning scheme, support policy, Rust requirements, and release notes."
summary: "Explains Feluqa's versioning scheme before and after 1.0, the absence of an announced release cadence or support periods, and how release-specific Rust compiler requirements will be documented. It identifies the current development baseline without treating it as a published release or support promise."
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
support dates will be added here once they are established. Development
versions do not imply a support commitment.

Each published release will state its minimum supported Rust version (MSRV).
The MSRV is the minimum compiler version the release promises to support; it
is not necessarily the latest stable Rust version.

## Current Development Baseline

Feluqa is currently at `0.2.0`, and its development compiler baseline is
Rust `1.88`. This documentation line covers package versions `<=1.0.0`. Cargo's
package `version` field stores one exact version; a range belongs in a
dependency requirement, not in that field. These development values are not a
published release or a support commitment. The release cadence, verified
release-wide MSRV, and support periods remain to be established.
