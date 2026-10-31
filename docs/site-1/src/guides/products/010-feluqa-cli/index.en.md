---
sidebarTitle: "Feluqa CLI"
icon: "@spmpst::icon::square-terminal"
title: "Feluqa CLI"
description: "The command-line product for developing and operating Feluqa applications."
summary: "Introduces the Feluqa CLI product, its application creation and development commands, and the current web application profile support."
date: 2026-10-31
lastmod: 2026-10-31
status: "Validated"
tags: [feluqa, products, cli]
draft: false
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# Feluqa CLI

Feluqa CLI is the developer and operator command line for Feluqa applications.
It helps create an application, check and build it, run development workflows,
and generate common project resources.

## What it provides

- `feluqa new` creates an application scaffold. The current generator supports
  the web profile.
- `feluqa check`, `build`, `dev`, and `test` support application development.
- `feluqa make` generates resources such as modules, models, migrations,
  services, controllers, panels, and seeders.
- Migration, seeding, listing, and update commands support development and
  operations workflows.

The available command context and supported application capabilities depend on
the command. Complete target runtimes and dynamic installation of modules are
still under development.

**Distribution:** Feluqa CLI currently follows the repository's proprietary
license. Product availability and license terms will be stated here as they
change.

For an introduction to the console and command organization, see
[How a Feluqa CLI Is Structured](/get-started/directory-structure/cli-structure).
