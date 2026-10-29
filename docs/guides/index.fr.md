---
sidebarTitle: "Accueil"
title: "Feluqa"
description: "Documentation développeur de Feluqa pour les applications, modules et contributeurs de la plateforme. Un espace de noms unifié pour le web, les postes de travail, le mobile, les API et les systèmes temps réel."
layout: home
markdownStyles: false
pageClass: feluqa-home
---

<HomeHero
  eyebrow="Aperçu de la plateforme"
  status="En développement actif"
  :title="['Un espace de noms.', 'Chaque runtime.']"
  :accent-index="1"
  lead="Feluqa est une plateforme d’applications Rust pour les équipes qui livrent des applications web, des postes de travail autonomes, des clients mobiles, des API et des systèmes temps réel à partir d’une seule base de code, d’un modèle de permissions et d’un SDK."
  :actions="[
    { label: 'Commencer', href: '/fr/get-started/' },
    { label: 'Lire l’architecture', href: '/fr/get-started/introduction/architecture-overview' }
  ]"
  :facts="[
    { label: 'Espace de travail Rust' },
    { label: 'SQLite et PostgreSQL' },
    { label: 'Local-first', suffix: 'cible' }
  ]"
  image="/home/hero-product.jpg"
  image-alt="Aperçu du panneau de contrôle Feluqa montrant les commandes, le stock et l’activité Live."
  image-caption="Panneau de contrôle · aperçu illustratif"
  :image-width="1600"
  :image-height="900"
  window-label="bookstore.feluqa.local / operations / orders"
/>

<HomeRuntimes
  label="Profils d’exécution"
  :items="[
    { name: 'Serveur', tone: 'partial', status: 'Partiel' },
    { name: 'Poste de travail', tone: 'target', status: 'Cible' },
    { name: 'Client mobile', tone: 'target', status: 'Cible' },
    { name: 'Embarqué · no_std', tone: 'exploring', status: 'Exploration' }
  ]"
  note="Un SDK, des profils d’exécution séparés. Le statut reflète ce dépôt, pas une garantie de version."
/>

<HomeCapabilities
  kicker="Socle"
  title="Un socle vérifiable, pas une promesse à croire."
  copy="Le dépôt actuel fournit certaines fondations du framework. Chaque ligne indique son statut d’implémentation : le travail prévu n’est jamais présenté comme livré."
  image="/home/module-surfaces.jpg"
  image-alt="Surfaces web, poste de travail et mobile composées à partir de contrats de modules Feluqa partagés."
  image-caption="Une surface de contrats · trois profils d’exécution"
  :image-width="1200"
  :image-height="1100"
  :items="[
    {
      index: '01',
      title: 'Composition à la compilation',
      description: 'Les panneaux, ressources, permissions et routes sont déclarés par attributs puis collectés par le scanner. Aucun registre manuel, aucune chaîne magique.',
      tone: 'partial',
      status: 'Partiel',
      tags: ['attributs', 'scanner', 'routes']
    },
    {
      index: '02',
      title: 'Un modèle de permissions',
      description: 'Les principaux liés au tenant, les rôles et les délégations sont appliqués par le serveur, indépendamment de ce que l’interface choisit d’afficher.',
      tone: 'partial',
      status: 'Partiel',
      tags: ['tenants', 'RBAC', 'audit']
    },
    {
      index: '03',
      title: 'Actions Live typées',
      description: 'La diffusion Live valide l’entrée typée, la session et le CSRF, l’autorisation, le travail borné et la politique de rejeu avant d’exécuter un handler.',
      tone: 'partial',
      status: 'Partiel',
      tags: ['typé', 'signé', 'rejeu']
    },
    {
      index: '04',
      title: 'Panneaux pilotés par schéma',
      description: 'Les panneaux et ressources sont rendus à partir d’un schéma d’interface versionné. La présentation reste déclarative ; les services gardent la logique métier.',
      tone: 'partial',
      status: 'Partiel',
      tags: ['SDUI', 'panneaux', 'ressources']
    },
    {
      index: '05',
      title: 'SQLite et PostgreSQL',
      description: 'Pools de connexions nommés, modèles SeaORM et migrations dialectales intégrées avec empreintes. SQLite pour les installations locales, PostgreSQL pour les déploiements hébergés.',
      tone: 'implemented',
      status: 'Implémenté',
      tags: ['SeaORM', 'migrations', 'pools']
    },
    {
      index: '06',
      title: 'Déploiement local-first',
      description: 'Un hôte local est prévu pour servir les clients à proximité sans Internet, avec des assets embarqués et une persistance SQLite. La synchronisation déconnectée reste à concevoir.',
      tone: 'target',
      status: 'Cible',
      tags: ['hors ligne', 'hôte local', 'sync']
    }
  ]"
/>

<HomeCompose
  kicker="Composition"
  title="Composer, pas configurer."
  copy="Un produit compose des applications ; une application compose des modules. La portabilité vient de contrats partagés, pas de l’obligation de faire converger tous les runtimes."
  code-label="librairie · src/orders.rs"
  :code="[
    { text: '// déclaré une fois, composé par le scanner', tone: 'comment' },
    { text: '#[panel(path = &#34;bookstore&#34;)]', tone: 'attribute' },
    { text: `#[resource(Book, scope = tenant)]`, tone: 'attribute' },
    { text: '#[gate(role = &#34;clerk&#34;)]', tone: 'attribute' },
    { text: 'fn create_order(input: OrderInput) -> Result<Order> {', tone: 'function' },
    { text: '    orders.create(input).await', tone: 'plain' },
    { text: '}', tone: 'plain' }
  ]"
  code-foot="scanner · routes · permissions · manifests"
  :stages="[
    { index: '01', title: 'Produit', description: 'La solution utilisée, avec son public et son mode de déploiement.', chips: ['Librairie'] },
    { index: '02', title: 'Applications', description: 'Des programmes déployables pour un rôle cible, construits avec les modules nécessaires.', chips: ['Web', 'Poste de travail'] },
    { index: '03', title: 'Modules', description: 'Des capacités métier autonomes, avec leur version et leurs permissions.', chips: ['Ventes', 'Stock'] },
    { index: '04', title: 'Contrats', description: 'Un espace de noms pour les panneaux, ressources, permissions, l’audit et le stockage.', chips: ['feluqa'] }
  ]"
  note="C’est le modèle cible. Le dépôt actuel est un consommateur de développement composé statiquement ; l’installation dynamique de modules reste planifiée."
  link-label="Lire la vue d’architecture"
  link-href="/fr/get-started/introduction/architecture-overview"
/>

<HomeLocalFirst
  kicker="Local-first"
  :title="['Pensé pour la salle,', 'pas seulement pour le cloud.']"
  :accent-index="1"
  copy="Feluqa est conçu pour les déploiements hébergés et les environnements déconnectés : un hôte local, des clients à proximité, des assets embarqués et un stockage SQLite. Un site sensible ne devrait pas dépendre d’un service externe pour ouvrir l’application."
  :bullets="[
    'Assets d’interface et polices embarqués',
    'SQLite comme choix local proposé',
    'Aucun service externe requis',
    'Synchronisation déconnectée et conflits encore à concevoir'
  ]"
  image="/home/local-first.jpg"
  image-alt="Un hôte local servant un navigateur, un poste de travail, un mobile et des capteurs de terrain."
  image-caption="Runtime local-first · architecture cible"
  :image-width="1400"
  :image-height="1000"
  link-label="Lire les guides de déploiement"
  link-href="/fr/get-started/"
/>

<HomeSteps
  kicker="Démarrer"
  title="Du domaine à l’application."
  copy="Commencez avec les fondations documentées, puis suivez les guides à mesure que la plateforme évolue. Les commandes ci-dessous montrent la boucle de développement prévue."
  :steps="[
    { index: '01', title: 'Décrire le domaine', description: 'Modélisez les concepts métier, les modules et les permissions nécessaires à votre application.' },
    { index: '02', title: 'Composer l’application', description: 'Choisissez les modules et les profils cibles. Les contrats partagés gardent le comportement portable.' },
    { index: '03', title: 'Lancer en local', description: 'Développez avec SQLite, puis déployez la même application sur un serveur hébergé.' }
  ]"
  terminal-label="librairie — feluqa dev"
  :terminal="[
    { text: '$ feluqa new bookstore', tone: 'prompt' },
    { text: '  feluqa.toml créé', tone: 'dim' },
    { text: '  src/main.rs créé', tone: 'dim' },
    { text: '$ cd bookstore', tone: 'prompt' },
    { text: '$ feluqa dev', tone: 'prompt' },
    { text: '  compilation du workspace …', tone: 'dim' },
    { text: '  application des migrations …', tone: 'dim' },
    { text: '  écoute sur http://127.0.0.1:8080', tone: 'ok' }
  ]"
  :actions="[
    { label: 'Installer Feluqa', href: '/fr/get-started/installation/' },
    { label: 'Suivre le guide de première application', href: '/fr/learn/create-your-first-application' }
  ]"
/>

<HomeCta
  kicker="Commencer ici"
  :title="['Partez de l’existant.', 'Suivez la suite.']"
  :accent-index="1"
  copy="Feluqa est en développement actif. Les guides distinguent les fondations implémentées des conceptions cibles, pour adopter ce qui est prêt et planifier le reste."
  primary-label="Ouvrir les guides"
  primary-href="/fr/get-started/"
  secondary-label="Lire les internes"
  secondary-href="/fr/feluqa-internals/"
  :legend="[
    { tone: 'implemented', label: 'Implémenté', description: 'disponible dans la base' },
    { tone: 'partial', label: 'Partiel', description: 'les fondations existent' },
    { tone: 'target', label: 'Cible', description: 'conception validée' },
    { tone: 'exploring', label: 'Exploration', description: 'peut évoluer' }
  ]"
  note="Statut de la documentation · révisé en octobre 2026"
/>
