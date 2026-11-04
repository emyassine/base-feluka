---
sidebarTitle: "Website crawler controls"
title: "Website Crawler Controls and Status | Feluqa"
icon: "@spmpst::icon::shield-check"
description: "Current repository status of crawler opt-out and content protection controls for the Numerimondes sites."
summary: "Robots and page-level signals are in source; server enforcement and live deployment have not been verified."
lastmod: 2026-11-04
status: "Exploring"
category: "governance"
tags: [website, crawlers, ai, security, status]
---

# Website crawler controls and status

The Numerimondes site sources request that named automated AI crawlers stay away from public pages. These controls express a preference; public pages remain publicly accessible. They do not prevent a crawler that ignores the request, spoofs its identity or receives a page through a user-directed fetch.

## Current status

| Control | Status |
| :--- | :--- |
| Root `robots.txt` rules for named AI crawlers | **Implemented in both site sources; live deployment not verified.** |
| `noai, noimageai` page metadata | **Implemented as voluntary, non-standard signals; crawler support varies.** |
| Copyright metadata and visible footer notice | **Implemented in both site sources.** |
| HTTP `X-Robots-Tag` response header | **Not configured.** No server or CDN deployment configuration is present in this repository. |
| User-agent blocking, WAF bot rules, and request-rate limits | **Not configured.** These require the production hosting or edge provider and must be validated against real traffic. |
| Premium content behind authentication | **Not applicable to the current public documentation and marketing pages.** Do not publish confidential or premium data on public pages. |
| RSS/Atom excerpts | **The site generator currently emits page titles and descriptions, not full page text.** |
| Automated-access terms | **Draft policy added to site-2; legal and operational review is pending.** |

The crawler list includes OpenAI, Anthropic, Google-Extended, Common Crawl and other named agents. [`Google-Extended`](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) is a robots.txt control token, not a separate HTTP user-agent. Google documents it as controlling use for Gemini model training and grounding while leaving ordinary Google Search inclusion unaffected. [OpenAI documents](https://developers.openai.com/api/docs/bots) that `ChatGPT-User` is used for user-initiated fetches and that robots.txt rules may not apply to those requests. [Anthropic lists](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) separate training, search and user-directed crawlers.

`robots.txt` is a voluntary crawler protocol, not access authorization, as [RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html) states. To restrict access to sensitive content, use authentication and server-side authorization. Meta directives such as `noai` and `noimageai` are additional signals, not a guarantee that a crawler will honor the request.

## Next operational step

Before claiming active enforcement, identify the production host/CDN, apply and verify response headers and bot/rate-limit rules there, then inspect live requests and responses. Keep public pages free of credentials, confidential client information and premium datasets.

The separate site-2 [Automated Access and Content Use policy](/policies/automated-access) is still a draft; it is not yet an operative website term.
