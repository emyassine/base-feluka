---
sidebarTitle: "Website storage"
title: "Website Cookies and Browser Storage Policy | Numerimondes"
icon: "@spmpst::icon::cookie"
description: "How the Numerimondes public site uses necessary and optional browser storage."
summary: "Theme, currency and marketplace storage are necessary; optional storage is controlled in the site manager."
status: "Draft"
category: "website-use"
tags: [cookies, browser-storage, privacy, website]
image: "/images/policies/website-storage-choice.webp"
imageAlt: "Translucent glass discs sit in a divided ceramic tray, with one amber disc outside an empty slot."
---

# Website cookies and browser storage policy

<img src="/images/policies/website-storage-choice.webp" alt="Translucent glass discs sit in a divided ceramic tray, with one amber disc outside an empty slot.">

## Scope

This policy covers browser storage used by the Numerimondes public website at the site URL shown in its **Manage cookies** dialog. It does not govern storage used by other sites or services. The account and CRM service has its own privacy notice and authentication functions; this website manager cannot inspect cookies marked `HttpOnly` or storage on another origin.

## Necessary storage

The site keeps the following storage available without asking for optional consent:

- the selected light, dark or system theme;
- the currency used to display prices;
- a local marketplace shortlist and reviews;
- the choice that controls optional storage.

These items support features the visitor chooses to use. They are not used for analytics, advertising or behavioral tracking. The manager shows them as checked and disabled because they cannot be switched off there. Clearing site data in the browser can still remove them.

The page language follows its URL. The site does not save a language preference in browser storage.

## Optional storage and choices

Visitors can allow or reject offline website storage, downloaded catalogues and other optional browser storage. When offline storage is allowed, the PWA service worker caches visited public pages and static files for offline use. It does not cache account or API routes or responses marked private or no-store. The worker is registered only after the visitor allows offline storage. The manager offers **Reject optional**, **Save choices** and **Allow optional storage** actions. A choice is saved in a first-party consent cookie for up to 180 days so the site can apply the optional-storage settings on later visits.

Rejecting or revoking offline storage unregisters the PWA service worker and deletes its site cache, as well as removing related catalogue data the site can identify. Rejecting or revoking another optional category removes its related entries. Visitors can also remove detected optional entries individually from the manager. Removal may reset a feature or require a catalogue download again.

## Detection limits

The manager reports browser storage it can inspect for the current site, including readable cookies, local and session storage, IndexedDB, Cache Storage and service-worker registrations when the browser exposes them. Browser protections can prevent inspection or removal of some items. In particular, page scripts cannot read `HttpOnly` cookies, and this site cannot enumerate storage belonging to another origin.

The site does not use this manager as a substitute for account security controls. Account sign-in and CRM session handling are governed by the account service and the [account and CRM privacy notice](/legal/account-and-crm-privacy).
