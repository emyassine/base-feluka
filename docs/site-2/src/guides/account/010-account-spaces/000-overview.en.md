---
title: "Account access | Numerimondes"
sidebarTitle: "Overview"
icon: "@spmpst::icon::circle-user-round"
description: "Choose your Numerimondes account space."
lang: en
status: "ready-for-review"
js-events:
  - uncollapse-sidebar
---


# Choose your account space

Select your profile to access the right sign-in area.

<br>

<FeatureCardGrid
  class="no--account-spaces-cards"
  :cards="[
    {
      meta: 'Client project space',
      title: 'Client space',
      description: 'Access your projects, <span class=silky-i>invoices</span>, deliverables and support.',
      icon: 'user-round',
      image: '/images/accounts/world-1-1280.webp',
      actions: [
        { label: 'Already a client? Sign in', href: 'https://numerimondes.com/account/connect/authentication/login', icon: 'circle-user-round', color: 'gray', external: true },
        { label: 'Create an account', tooltip: 'Create an account', iconOnly: true, href: 'https://numerimondes.com/account/connect/authentication/register', icon: 'user-plus', external: true }
      ]
    },
    {
      meta: 'Team access',
      title: 'Administration',
      description: 'The workspace for Numerimondes team members and <span class=silky-i>collaborators</span>.',
      icon: 'shield-check',
      image: '/images/accounts/world-2-1280.webp',
      actions: [
        { label: 'Team sign in', href: 'https://numerimondes.com/account/connect/admin/authentication', icon: 'arrow-up-right', iconPosition: 'after', color: 'gray', external: true }
      ]
    }
  ]"
/>

Account use is governed by the [Account Access and Workspace Use Policy](/policies/account-access). Read the [Account and CRM Privacy Notice](/legal/account-and-crm-privacy) to understand how account information is handled.
