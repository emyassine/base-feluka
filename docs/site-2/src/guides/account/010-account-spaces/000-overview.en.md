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


# Accès aux espaces dédiés

Sélectionnez votre profil pour accéder à votre espace d’authentification.

<br>

<CardsModern
  :cards="[
    {
      meta: 'Votre espace projet',
      title: 'Espace client',
      description: 'Retrouvez vos projets, vos factures, vos livrables et le support.',
      icon: 'user-round',
      image: '/images/home/showcase-capabilities/digital-after.jpg',
      actions: [
        { label: 'Déjà utilisateur ? Connexion', href: 'https://numerimondes.com/account/connect/authentication/login', icon: 'circle-user-round', color: 'gray', external: true },
        { label: 'Créer un compte', href: 'https://numerimondes.com/account/connect/authentication/register', icon: 'user-plus', external: true }
      ]
    },
    {
      meta: 'Accès équipe',
      title: 'Administration',
      description: 'L’espace de travail des équipes et des intervenants Numerimondes.',
      icon: 'shield-check',
      image: '/images/home/showcase-capabilities/operations-after.jpg',
      actions: [
        { label: 'Connexion équipe', href: 'https://numerimondes.com/account/connect/admin/authentication', icon: 'arrow-up-right', iconPosition: 'after', color: 'gray', external: true }
      ]
    }
  ]"
/>
