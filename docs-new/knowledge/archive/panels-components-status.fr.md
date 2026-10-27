# Panels, composants, SDUI et lifecycle

Date : 2026-10-27. Statut : première tranche verticale intégrée, pas encore production grade. `feluqa::ui` valide un schéma SDUI versionné, rend des tables accessibles, formulaires, champs et listes de choix à tags fixes, et échappe les valeurs/options. `feluqa::panel` enregistre les permissions system/business et les contrats de ressources, puis rend tables et formulaires selon les grants. Numerimondes branche ces rendus aux vues `.view.rs` compilées de `/admin/customers` et des pages Core users, rôles, modules, connexions, migrations, audit et tenants via `TrustedHtml`, réservé au HTML produit par Feluqa. `feluqa::live` signe snapshots et vérifie les actions; `feluqa::module` gère les modules statiques. Numerimondes relie Axum, cookies/CSRF, comptes/rôles, modules statiques, connexions nommées, migrations, audit et CRUD CRM. Les tests HTTP SQLite vérifient les formulaires CRM et Core visibles, les choix de rôle délégables, le préremplissage courant, les colonnes Core, la séparation des permissions et les accès refusés. Le test HTTP/PostgreSQL 16 couvre également la création et l'affectation de rôles après cette intégration. Restent les adaptateurs CRUD génériques SeaORM, les actions resource-driven pour les autres mutations Core, la modification/désactivation/suppression des tenants, l'audit métier complet, l'activation dynamique, le transport navigateur Live et le replay partagé.

Le panel système est une capacité Feluqa fournie par le crate framework `feluqa-system-panel`. Le système de panels et ses composants sont dans Feluqa; les produits n'en fournissent pas une copie. Le produit configure des instances avec son `service_provider.rs`, puis ses modules Feluqa y enregistrent resources et pages. `feluqa.toml` sélectionne ce provider Rust compilé statiquement. Feluqa embarque et sert certains bundles CSS/JS issus de l'adaptation Webkernel/Filament, mais **le système de thèmes Filament et son catalogue de composants ne sont pas importés entièrement**. Un bundle compilé n'apporte ni les providers de thèmes, ni l'intégralité des Blade views/components, comportements Livewire ni leur API Rust. L'API actuelle est un port partiel. Le site public Numerimondes garde encore ses routes et vues MVC; il n'est pas encore une instance de panel public enregistrée dans le catalogue.

## Modèle cible des panels et des unités métier

Un **panel** est une surface Feluqa cohérente, créée/configurée avec le système de panels fourni par Feluqa : le site public est une instance de panel; Feluqa Core `/system` est fourni par le framework; l'ERP `/admin` est une autre instance. Un panel possède un provider, un chemin, une navigation, des règles d'authentification/ACL, des clusters et des déclarations de resources/pages/widgets. Un module Feluqa s'enregistre dans l'instance de panel concernée; il ne porte pas une implémentation de panel séparée.

Une **resource** déclare ses champs, colonnes, policies et opérations. Feluqa lui fournit les pages CRUD standard; une resource peut également fournir des pages personnalisées ou des widgets. Les resources peuvent appartenir à un cluster de navigation ou être explicitement non groupées. Le développeur doit pouvoir rattacher une resource à un cluster par une déclaration légère (attribut/derive ou builder), sans écrire toute la navigation à la main.

Une **page** est déclarée par un type Rust dédié. Elle peut sélectionner une vue `.view.rs`, composer des fragments de schéma/formulaire ou fournir une page métier complète. Elle peut placer des widgets dans son contenu. Les vues utilisateur ne déclarent pas `html/head/body` : le shell et le layout viennent du panel Feluqa.

Les routes spécialisées restent possibles : une unité métier peut déclarer une route vers une vue ou un handler/controller, avec middleware explicite. L'accès public est explicite; une route protégée doit exiger l'authentification puis appliquer une policy. L'ACL d'un resource ou d'une page ne remplace jamais le contrôle d'accès dans un handler personnalisé.

**Expérience développeur cible :** déclarer provider, resources, pages, clusters et routes spécifiques; laisser Feluqa connecter navigation, layout, ACL, CRUD, formulaires, tables, widgets, thèmes et assets. Garder dans l'application les règles métier qui sont propres à son organisation. Les API `.pages()` et `.resources()` sont déjà des points d'entrée du builder; clusters, pages typées complètes, widgets et le catalogue Filament complet restent à implémenter.

### Vocabulaire sans ambiguïté

| Terme | Sens Feluqa |
|---|---|
| module Feluqa | Paquet installable sur la plateforme (par exemple HRM ou Numerimondes) avec manifest/provider, permissions et panel contributions. |
| module métier | Domaine au sein d'un module Feluqa composé (par exemple CRM ou finance sous `business/`); son installation séparée dépend du packaging. |
| feature | Capacité fonctionnelle d'un module métier, par exemple contacts ou opportunités dans le CRM. Une feature n'est pas automatiquement installable. |
| module Rust | Unité du langage déclarée par `mod`/`pub mod`, compilée dans un crate. Toujours dire « module Rust » pour ce sens. Un module Feluqa est souvent réalisé avec plusieurs modules Rust. |
| panel | Surface utilisateur enregistrant navigation, resources, pages, widgets, auth, ACL et routes. Le site public compte aussi comme panel. |

Le layout recommandé pour Numerimondes range le code par domaine/surface (`website/`, `business/crm/`, `business/finance/`) ou tout autre découpage qui exprime la propriété, au lieu de boîtes génériques `src/app/` et `src/modules/`. Ces dernières restent possibles si le développeur les juge utiles, mais ne sont pas recommandées par défaut. Le projet actuel reste transitoire; voir [Project layout](../architecture/platform-module-layout.en.md).

## Responsabilités et dépendances

```text
services métier + politiques + données
                ↓
schémas UI typés/versionnés → composants → vues .view.rs → HTML
                ↑                               ↑
       panels et ressources              actions Live autorisées
```

Les crates `_crates/feluqa-ui`, `feluqa-panel`, `feluqa-live`, `feluqa-auth`, `feluqa-module`, `feluqa-core` et `feluqa-database` ont maintenant des contrats exécutables dans la façade `feluqa::...`. Le socle données utilise SeaORM 1.1.20, des pools SQLite/PostgreSQL nommés, et des migrations embarquées avec historique/checksum par module et dialecte. Numerimondes fournit la première variante CRM de migration pour SQLite et PostgreSQL. `feluqa-core` persiste l'identité, rôles/grants, sessions et audit; le cycle bootstrap/login/logout passe ses tests d'intégration SQLite. Numerimondes intègre les routes HTTP, l'administration des comptes et rôles, l'affectation de rôle avec révocation des sessions, puis un premier scope CRM par propriétaire et grants indépendants par champ. Les tableaux `/system/users`, `/system/roles`, `/system/tenants`, `/system/modules`, `/system/connections`, `/system/migrations` et `/system/audit` sont des ressources Core rendues par le même renderer SDUI que le CRM; les formulaires create/update `/system/roles` sont aussi générés depuis `system.roles`. L'application des migrations reste une action POST protégée par session et CSRF. La migration et le cloisonnement des utilisateurs, rôles, audits et fiches au tenant de session passent sous SQLite; la modification/désactivation/suppression des tenants et sa validation PostgreSQL restent à faire, comme les adaptateurs CRUD génériques, les formulaires resources des autres actions Core et le catalogue accessible. Les crates auth/UI/panel/module sont `no_std` avec `alloc`; la façade expose des profils de features séparés pour limiter les dépendances de runtime. Les produits restent sous `products/` : CLI, Numerimondes, extension Zed et tout futur exécutable de contrôle de plateforme.

Le panel System/Core fait partie de la plateforme Feluqa et ne dépend d'aucun module installable. Il est destiné à administrer les domaines de l'installation, installer/configurer les modules et appliquer licence et permissions avant d'exposer leurs capacités. La gestion actuelle couvre une première tranche d'administration; l'installation dynamique, les licences par domaine et le lifecycle complet des modules restent à construire.

## Trois périmètres d'accès

| Périmètre | Responsabilité | Frontière |
|---|---|---|
| Feluqa Platform/System | Domaines, installation/configuration des modules, compatibilité, licences, état des services | Autorité de l'installation; les mutations exigent les grants plateforme appropriés. Le lifecycle dynamique reste à implémenter. |
| Identité et sécurité du domaine | Utilisateurs, rôles, réglages, audit et maintenance disponibles au domaine | Session liée au domaine et permissions refusées par défaut. |
| Panel enregistré par un module | Pages, resources, médias et workflows métier | Accès borné aux capacités licenciées, au domaine et aux objets autorisés. |

Routes cibles proposées : `/system` pour le Core local, `/admin` pour le panel métier; préfixes configurables et collisions refusées au boot. Authentification, session, CSRF, autorisation et services sont partagés avec API et CLI. Masquer un bouton ne protège jamais l'action correspondante.

## Contrats à compléter

### Contrat de ressource v1

`feluqa::panel::Resource` décrit un identifiant, une route, le périmètre system/business, une permission d'administration optionnelle, les opérations disponibles, les permissions read/write et les métadonnées d'input fixes de chaque champ. `ResourceRegistry` valide les permissions et namespaces au démarrage, résout par ID ou chemin et refuse les collisions entre ressources. `PanelCatalog` rassemble ce registre et celui des pages puis refuse aussi les collisions entre les deux types de route. Sa méthode `authorize_resource` résout une ressource enregistrée, vérifie l'opération et retourne ensemble la portée fiche et les champs autorisés. Le CRM l'utilise pour filtrer ses lignes et formulaires; `/system/users` l'utilise pour autoriser la liste Core et rendre ses colonnes depuis `system.users`. `Resource::render_table` n'émet que les colonnes lisibles. `Resource::render_form_with_options` n'émet que les inputs modifiables, échappe les choix fournis et ne préremplit que les valeurs lisibles; le renderer choisit méthode POST, action locale, CSRF, ID de fiche, type et contraintes depuis le descripteur. Les handlers doivent toujours revérifier CSRF, autorisation, portée et validation serveur. Les rendus CRM/Core vont dans les vues compilées par `TrustedHtml`, exclusivement depuis la sortie du renderer. Les formulaires de création et de modification `/system/roles` et ceux de création/affectation de rôle dans `/system/users` sont construits depuis leurs ressources; les options de rôle sont filtrées par la politique de délégation Core, les champs disponibles/requis diffèrent selon l'opération, les rôles systèmes n'exposent pas d'éditeur, et les ID HTML des champs sont uniques par fiche. Les autres mutations Core restent des handlers audités dédiés. Les tests vérifient ressources refusées, préremplissage selon read grant, action/ID/CSRF, escaping des choix/textarea, tables Core, forms roles/users et portée HTTP. Les adaptateurs CRUD SeaORM génériques et les actions des autres ressources Core restent à faire.

```rust
pub const CUSTOMERS: Resource = Resource {
    id: "crm.customers",
    title: "Customers",
    path: "/admin/customers",
    kind: PanelKind::Business,
    manage_permission: Some("business.erp.manage"),
    record_access_permission: Some("business.crm.customers.records.all"),
    actions: CUSTOMER_ACTIONS,
    fields: CUSTOMER_FIELDS,
};

let mut catalog = PanelCatalog::default();
catalog.register_resource(CUSTOMERS)?;
```

### UI schema v1 livré

`feluqa::ui::UiDocument` utilise `schema_version = 1` et un arbre Serde fermé composé de texte, composants `{key, name, props, children}` et actions `{key, label, action, permission}`. La validation refuse les versions inconnues, les clés de nœud dupliquées, les noms invalides, les propriétés événementielles/HTML dangereuses, les documents au-dessus de 1 MiB, une profondeur excessive et les arbres de plus de 10 000 nœuds. Le JSON transporte des noms/données, jamais du Rust ni des pointeurs de fonction. Le renderer couvre douze composants fixes, dont une table accessible, un formulaire POST local et des inputs labelisés; les props ne sont pas encore définies par un catalogue extensible et typé par composant.

```json
{
  "schema_version": 1,
  "root": [{
    "kind": "component",
    "key": "settings-page",
    "name": "feluqa::section",
    "props": {"title": "Settings"},
    "children": [{"kind": "text", "value": "Account settings"}]
  }]
}
```

### Permissions et panels livrés

Un `Principal` ne porte que les permissions explicitement accordées par un code serveur de confiance. Les identifiants sont exacts, sans joker. Le registre refuse les collisions de chemins. Numerimondes expose `/system/setup`, `/system/login`, `/system/logout`, `/system`, `/system/users`, `/system/users/role`, `/system/roles`, `/system/roles/update`, `/system/modules`, `/system/connections`, `/system/migrations`, `/system/audit`, `/system/tenants`, `/admin` et `/admin/customers`. Création et remplacement des grants d'un rôle exigent session, CSRF et autorité de délégation; la modification refuse les rôles système, rejette les grants dupliqués et écrit l'audit avec la transaction. L'affectation d'un rôle vérifie que l'acteur peut déléguer chaque grant de ce rôle, révoque toutes les sessions existantes et journalise l'opération. La création de compte applique le même contrôle avant le hachage coûteux du mot de passe et le revérifie dans la transaction. `business.erp.manage` autorise la délégation des permissions métier, sans ouvrir les permissions système. Le catalogue partage désormais `authorize_resource`, qui retourne l'action autorisée, la portée (`OwnedBy`/`All`) et les champs lisibles/modifiables. Les handlers CRM se basent sur cette décision; le service module applique le filtre de portée dans ses requêtes SeaORM et n'expose que les champs autorisés. Les grants CRM sont distincts par opération et par champ. Les tests HTTP SQLite vérifient le cloisonnement inter-tenant des listes et mutations `/system` et CRM, y compris le grant « toutes les fiches » borné au tenant; les tests du contrat couvrent aussi l'accès propriétaire et l'override gestionnaire. `/system/tenants` permet au superadministrateur plateforme de lister et créer un tenant avec son premier administrateur; le service Core impose le grant plateforme et une transaction. La modification/désactivation/suppression et les preuves PostgreSQL correspondantes restent à faire. Ce niveau d’intégration ne qualifie pas encore le panel d'enterprise grade.

### Actions Live livrées

La bibliothèque HMAC-SHA-256 signe des claims de snapshot incluant sujet, tenant, session, action, permission, CSRF, nonce, révision et expiration; le token est authentifié, pas chiffré. Le dispatch vérifie les bindings et permissions, consomme le nonce avant l’exécution et désérialise l’entrée dans le type Rust de l’action. Le `ReplayGuard` mémoire est borné, mono-processus et destiné au développement/tests. Une production multi-instance doit fournir un stockage atomique partagé avec expiration et une session/cookie sûre. Le serveur doit limiter le body HTTP avant de désérialiser son JSON; les limites Live s’appliquent en plus.

### Lifecycle statique livré

Le runtime accepte des implémentations Rust liées statiquement, valide IDs/dépendances/cycles avant d’appeler les hooks, démarre en ordre topologique déterministe, et nettoie l’échec partiel puis les modules précédents en ordre inverse. Il ne charge aucun fichier, crate ou module téléchargé et ne fournit ni signature, isolation, migration, staging ou rollback de données.

### Features et profils de compilation

La façade `feluqa` expose `web` par défaut, et des features `spa`, `mobile`, `desktop`, `game` et `realtime`; le consommateur choisit `default-features = false` pour sortir du profil web. `feluqa-auth`, `feluqa-ui`, `feluqa-panel`, `feluqa-module` et la façade compilent `no_std` avec `alloc`; `feluqa-live` cible actuellement `std`. Le build `realtime` sans features web valide uniquement la compilation hôte, pas le support d’une carte, d’un RTOS, de délais stricts ou d’une certification.

| Contrat | Contenu et invariants |
|---|---|
| Panel | ID stable, préfixe, guard/policies, navigation, pages, ressources, assets; validation des doublons avant écoute HTTP. |
| Resource | Schéma de données, service applicatif, policy, liste, formulaire, actions; le navigateur ne reçoit pas d'accès direct au stockage. |
| UI schema | Nœuds versionnés, props typées, clés stables, composition/slots, erreurs de validation; représentation Serde pour SDUI. Aucun pointeur de fonction ou Rust arbitraire dans le JSON client. Le validateur livré impose version, clés stables sans doublons, limites profondeur/taille, IDs namespacés et noms de propriétés non exécutables. Le renderer HTML serveur ne produit que des tags fixes et échappe le texte/attributs; il vérifie l’URL des liens et refuse les actions sans snapshot Live. Le catalogue de props est encore réduit et n’est pas une UI complète accessible/designée. |
| Form | Champs, groupes, erreurs par champ, validation serveur, soumission idempotente lorsque nécessaire, état dirty/loading; CSRF et contrôle d'accès serveur. |
| Table | Pagination, filtres/tri autorisés, sélection, actions; limites de lignes et contrôle par enregistrement. |
| Action | Nom stable, entrée typée, identité/tenant, validation, policy, transaction, résultat et événement d'audit. CLI/API/panel appellent le même service. |
| Component | Props et slots déclarés, attributs contrôlés, accessibilité, rendu compilé; mêmes primitives dans Core et sites. |

Catalogue v1 : page/layout, navigation, section/card, texte, bouton/lien, input, textarea, select, checkbox, formulaire/erreurs, table/pagination, badge, alerte, état vide. Ensuite : modal accessible, notifications, onglets, upload et widgets. États obligatoires : normal, vide, chargement, erreur, accès refusé; focus clavier, labels et erreurs associées aux champs.

## Live : contrat avant transport

Préférence v1 : actions HTTP nommées et snapshots signés. `LiveRuntime` émet un snapshot court uniquement pour une action enregistrée dont l'acteur a la permission exacte, puis lie le dispatch à l'identité, la session et au CSRF validés par l'hôte. Numerimondes fournit les endpoints authentifiés `GET /live/snapshots/{action}` et `POST /live/actions`; la requête navigateur ne transporte pas de session. Le dispatch vérifie signature HMAC, action/permission/sujet/session/tenant/CSRF/révision, prévalide le débordement de révision avant de consommer le nonce ou d'appeler l'action, puis désérialise une entrée typée. L'aller-retour HTTP, l'action typée, le refus CSRF et le rejeu passent sous SQLite et PostgreSQL. Le replay reste borné et mémoire locale : Live est activé seulement en development, et le chargeur refuse son activation en staging/production avant la disponibilité d'un replay partagé atomique. Le dashboard Core Numerimondes a un client DOM minimal sans dépendance pour l'action ping : fetch same-origin, CSRF dans l'en-tête, révision conservée et sortie écrite avec `textContent`. La réconciliation de composants et le maintien du focus restent à intégrer. Signer un état n'assure pas sa confidentialité; ne jamais y inclure de secrets. Prévoir expiration, ordre des réponses concurrentes et état obsolète.

Le serveur renverra le fragment concerné; le futur client devra conserver focus, sélection et saisie pendant le remplacement du DOM. Fallback HTML/formulaire pour les opérations de base. SSE est destiné aux notifications serveur; ce n'est pas une autorisation de mutation. Reconnexion, backpressure, limites et arrêt propre font partie du contrat. Le choix de bibliothèque de mise à jour DOM reste à évaluer et à tracer dans les décisions.

## Lifecycle

Le registre livré valide les IDs/dépendances, calcule un ordre topologique déterministe, arrête en ordre inverse et nettoie même le module dont le démarrage a échoué. Bibliothèques liées : déclaration → validation des dépendances/config/routes/vues → initialisation → prêt → arrêt/drainage. Ordre déterministe, cleanup en cas d'échec partiel, aucune boucle de découverte à chaque requête. Les migrations sont une étape explicite de livraison, pas une écriture implicite au premier rendu.

Modules téléchargeables : téléchargement → vérification signature/digest/compatibilité/capacités → staging → migration planifiée → activation atomique → health check → rollback du code en cas d'échec. Le rollback des données exige sa propre stratégie, il ne découle pas du rollback du binaire. WASM et ABI versionnée à prototyper avant exposition à du code tiers. Aucun chargement natif tiers avec les permissions du serveur par défaut.

## Définition vérifiable d'une version enterprise

- Un site Numerimondes et un second site partagent réellement le framework; aucune logique Numerimondes dans les bibliothèques ou le générateur générique.
- Core et panel métier utilisent les mêmes primitives; authentification, sessions, permissions de ressources/champs/enregistrements et isolation des tenants ont des tests de refus et d'accès croisé.
- Migrations, transactions, concurrence, pagination et limites documentées; sauvegarde ET restauration exercées sur un environnement neuf.
- Logs structurés avec corrélation, audit des actions privilégiées, métriques et health/readiness sans secrets. Temps handler, temps total serveur et temps client restent des mesures distinctes.
- Arrêt propre, annulation, timeouts, quotas et pression mémoire contrôlés. Scénarios d'échec DB, disque plein, cache indisponible et dépendance lente documentés et vérifiés.
- Installation sous utilisateur POSIX, stockage confiné, déploiement Hestia reproductible, mise à niveau et retour arrière exercés.
- CI sur compiler/MSRV déclarés, lint, tests de contrats, corpus hostile/fuzzing borné du parseur, audit des dépendances/licences, paquets reproductibles et procédure de correction de vulnérabilités.
- Performance mesurée sur scénario publié, budgets explicitement acceptés; aucune revendication de haute disponibilité ou de certification à partir des seuls microbenchmarks M0.

Ces critères définissent des sorties de lots. Ils ne décrivent pas l'état actuel du prototype.


## Propriété du shell et des assets

Le shell partagé et le composant d'assets sont des vues compilées depuis `feluqa-panel/resources/views/components/` (`<x-feluqa-panel::shell>` et `<x-feluqa-panel::assets>`). Le Core `/system` compile ses pages depuis `feluqa-system-panel/resources/views/`. Ces composants et le système de panels sont fournis par Feluqa; un produit configure ses panel instances puis y enregistre ses pages/resources métier. Les CSS/JS sont intégrés au binaire depuis `feluqa-panel/assets/`; `feluqa::web` expose leurs handlers HTTP. Le scaffold CLI utilise ces mêmes sources framework, il ne génère pas de copie du shell ni des pages Core dans le produit. Les bundles Filament adaptés sont intégrés, mais le port Rust des composants, notifications, tables, formulaires, actions et providers Filament reste en cours; l'intégration des assets ne vaut pas parité fonctionnelle.

`PanelBuilder` enregistre maintenant les options du provider (branding, favicon/logo local, largeur, sidebar/topbar, flux d'authentification et groupes d'éléments de navigation). Les éléments de navigation peuvent porter une permission et sont filtrés par `PanelOptions::visible_navigation`; les handlers doivent encore protéger chaque route séparément. `feluqa-notifications` définit le format de notification camelCase, la validation des actions, statuts/durées et le comportement borné du mailbox; sa persistance liée à la session et son affichage navigateur sont encore à intégrer. Le suivi détaillé des capacités Filament/Webkernel est dans [FILAMENT_PORT_STATUS.md](../../exists/reference/panels/filament-port-status.en.md).
