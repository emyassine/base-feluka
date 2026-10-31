---
sidebarTitle: "Nadim CLI"
icon: "@spmpst::icon::terminal"
title: "Nadim CLI"
description: "A personal command-line product for focused everyday workflows."
summary: "Introduces Nadim CLI as a Feluqa product with its own personal command profile, and explains its current relationship to the shared Feluqa console package."
date: 2026-10-31
lastmod: 2026-10-31
status: "Exploring"
tags: [nadim, products, cli]
draft: false
author:
  name: "El Moumen Yassine"
  url: "https://numerimondes.com"
  linkedin: "https://www.linkedin.com/in/elmoumenyassine"
  email: "yassine@numerimondes.com"
---
# Nadim CLI

Nadim is a personal command-line product built with Feluqa. It has its own
console profile for personal commands and a separate product identity from the
Feluqa developer CLI.

The current profile provides help and version commands. Its command set is
intended to grow around Nadim's own workflows, with each command maintained in
the product's command directory.

Nadim currently shares the `feluqa-cli` Cargo package and console executable.
Select its profile with:

```sh
feluqa --profile nadim --help
feluqa --profile nadim --version
```

The profile is a working product foundation; it is not yet distributed as a
separate executable. Its product page and documentation can grow independently
as Nadim's audience and capabilities take shape.

**Distribution:** Nadim currently shares the repository's proprietary source
and package. A separate distribution model has not been announced.
