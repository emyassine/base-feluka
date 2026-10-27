# Feluqa Web : architecture et expérience de développement

Statut au 2026-10-27 : première tranche MVC et panels intégrée dans Numerimondes. Le framework a un registre de ressources validées; la CRM démontre des grants d'opération, de champ et de fiche à partir d'un contrat `Resource`, avec tables SDUI filtrées et formulaires create/update générés depuis ce contrat dans la vue `.view.rs` compilée. Les listes Core des utilisateurs, rôles, modules, connexions, migrations et audit utilisent aussi des ressources `system.*` et la table SDUI commune. Le CLI génère un starter Web avec vues compilées et les pages/actions Core de setup, auth, utilisateurs, rôles, modules liés, connexions nommées, migrations et audit; le test du starter construit le routeur et vérifie un refus d'autorisation sous SQLite. Les adaptateurs CRUD génériques, l'architecture entreprise complète et le scaffold compilable contre les artefacts publiés restent à livrer.

## Réponse directe

Le profil Web est une capacité de l'écosystème Feluqa, pas une plateforme séparée. Numerimondes est déjà un produit Feluqa; selon le périmètre, un produit peut être un seul Feluqa module livrable isolément ou une plateforme qui compose plusieurs Feluqa modules. Numerimondes ERP est ce second cas. La compilation Rust change le cycle de développement, pas le modèle mental : routes, contrôleurs, services métier, migrations et vues restent des concepts adaptés.

**Feluqa n'est pas encore le framework entreprise visé.** Numerimondes possède un chemin MVC utilisable : routes Feluqa/Axum, contrôleurs et services, vues `.view.rs` compilées, Core `/system` (setup/login/logout, utilisateurs, rôles, tenants, modules statiques, connexions, migrations, audit) et un CRUD CRM initial sous `/admin`. Le projet actuel conserve `src/app/` et `src/modules/`; c'est une organisation transitoire, pas la structure produit retenue. L'architecture cible range le code par surface et capacité métier, sans boîtes génériques `app/` et `modules/`; voir [Project layout](PROJECT_LAYOUT.md). Le panel migrations affiche le statut par module/connexion et applique uniquement la paire choisie; le runner sélectionne la variante compatible avec le dialecte configuré. Les tests Core et HTTP Numerimondes valident les parcours actuellement intégrés sous SQLite; les tests PostgreSQL sont conditionnés par `FELUQA_TEST_POSTGRES_URL`. SeaORM fournit les pools nommés; un build script compile les migrations déclarées par les unités métier Feluqa. Restent notamment les CRUD resource-driven génériques, l'activation dynamique, Live navigateur, les workflows ERP complets et le déploiement/restauration.

## Ce que l'utilisateur doit obtenir

- `feluqa new prod` crée une application complète avec le profil choisi, sa configuration, ses routes, contrôleurs, modèles, services, vues, modules et tests d'exemple.
- `feluqa dev` surveille les sources, recompile les vues et le binaire, puis redémarre proprement l'application. Rust ne devient pas interprété; la boucle de développement automatise les compilations.
- Une application peut démarrer avec SQLite et déclarer ensuite PostgreSQL ou plusieurs connexions nommées sans changer les contrats métier de ses modules.
- Feluqa fournit le panel system et les primitives de panels. Un produit Feluqa configure ses instances de panels, puis ses modules métier y enregistrent resources/pages; le site public est lui aussi une instance de panel. Ces surfaces partagent identité, ACL, composants, vues, stockage et services.
- Le même modèle/service métier peut être appelé par une route HTML, une API, une commande CLI ou une action Live, toujours avec autorisation et validation côté serveur.

## MVC Feluqa

| Élément | Rôle attendu | Règle |
|---|---|---|
| Routes | Associer méthode + chemin + middleware à une action de contrôleur | Chaque site, panel ou module déclare ses routes dans son propre `routes.rs`; `routes/web.rs` assemble uniquement les routeurs et ajoute les couches globales. Vérification des collisions au démarrage. |
| Contrôleurs | Adapter HTTP à l'application : valider l'enveloppe de requête, appeler policy/service, choisir réponse ou vue | Pas de SQL, de règle ERP ni de logique métier dans le contrôleur. |
| Modèles | Représenter les objets métier et leurs opérations de persistance/requêtes | Pas de dépendance au protocole HTTP ni au rendu. Les DTO d'entrée/sortie restent explicites. |
| Services | Exécuter les cas d'usage et transactions métier | Source commune pour le web, l'API, la CLI et Live. |
| Policies | Autoriser une action sur un sujet, tenant et objet | Refus par défaut; masquer un lien dans la vue n'est jamais une autorisation. |
| Vues | Présenter les données avec les fichiers compilés `.view.rs` | Typées à la compilation; rendu HTML échappé par défaut. Le mode dev recompile après modification. |
| Migrations | Faire évoluer le schéma d'une base de données | Versionnées par module et par dialecte; exécution explicite, traçable et propre à chaque connexion. |

MVC décrit les frontières, pas l'obligation d'utiliser Active Record. Pour Feluqa, garder les contrôleurs minces et les cas d'usage dans les services facilite le partage entre interfaces et évite que le modèle ORM devienne toute l'application.

### Écriture des routes

Les commandes du CLI et les routes ont une déclaration par fichier/route, mais l'API Rust actuelle construit explicitement le routeur. La forme exécutable aujourd'hui est `Route::<État>::new()` suivie de méthodes chaînées; les contrôleurs peuvent être des fonctions ou des méthodes associées passées directement comme handler :

```rust
#![no_implicit_prelude]

use feluqa::prelude::*;
use feluqa::core::service::CoreStore;
use feluqa::web::{Route, RouteError};

pub fn register_routes(core: CoreStore) -> Result<Router<AppState>, RouteError> {
    let public = Route::<AppState>::new()
        .redirect("/old-path", "/new-path", StatusCode::MOVED_PERMANENTLY)
        .get("/users/{id}", UserController::show)
        .name("users.show")?
        .finish();

    let admin = Route::<AppState>::new().group("/admin", |routes| {
        routes
            .get("/dashboard", AdminController::index)
            .name("admin.dashboard")
            .map(|routes| routes.authenticated(core))
    })?.finish();

    Ok(public.merge(admin))
}
```

Le builder explicite permet à Rust de vérifier chaque handler et son état partagé à la compilation. La façade statique `Route::get(...)` de l'exemple Laravel n'est pas encore une API Feluqa; ne pas la recopier dans une application. `redirect` conserve le statut 3xx demandé et les noms sont validés à l'enregistrement.

## Où se trouve le panneau ?

Il y a deux surfaces qui doivent rester distinctes, mais qui utilisent les mêmes composants et contrats :

1. **Feluqa Core**, panel système et capacité de la plateforme Feluqa, fourni par le framework. Le produit configure son instance, avec `/system` comme chemin initial. Il gère identité, rôles/permissions, configuration, état des modules, connexions, migrations et journal d'audit. Il ne reçoit pas automatiquement une autorité sur d'autres produits ou serveurs.
2. **Panels métier/site**, instances configurées avec les primitives Feluqa. Les modules Feluqa enregistrent leurs resources/pages dans l'instance choisie; `/admin` est le chemin ERP par défaut et le site public est aussi une instance de panel. La CRM Numerimondes démontre des grants par opération, champ et fiche. Le contrat déclaratif générique existe; ses adaptateurs de persistance, vues/formulaires et assemblage restent à construire et ne devront jamais contourner les règles métier.

Les instances de panels et les modules composés vivent dans le produit Feluqa et peuvent partager le même binaire, mais routes, layouts, navigation et permissions restent explicitement séparés. Un produit de site vitrine peut n'inclure qu'un module, désactiver l'instance métier ERP et configurer son site public avec les primitives de panel Feluqa. Le Core système fait partie de Feluqa; son instance et son chemin sont configurés selon le profil de déploiement.

## Modules ERP et base partagée

Dans Feluqa, **module Feluqa** désigne une unité métier enregistrée (CRM, finance, inventory, procurement, etc.). Un produit peut consister en un seul de ces modules ou en composer plusieurs; le cas multimodule les groupe sous `business/`. Une unité peut contenir des sous-domaines ou features. Une **feature** est une capacité plus ciblée (par exemple les contacts ou le pipeline commercial d'un CRM) et ne devient pas automatiquement une unité de déploiement. Un **module Rust** désigne uniquement une unité du langage et du compilateur, déclarée avec `mod` ou `pub mod`; il peut implémenter une partie d'un module Feluqa, mais les deux notions ne sont pas synonymes. Les dossiers et noms Rust sont des choix d'implémentation; ils ne définissent pas le cycle de vie Feluqa.

Le produit ERP Numerimondes utilise par défaut une base applicative partagée par ses modules Feluqa. Les modules propriétaires de tables gardent leurs migrations dans leur dossier et leurs politiques/services, mais lisent et écrivent via la même connexion `default`; ne pas créer une base isolée par module. Les connexions nommées restent disponibles pour intégrer une base héritée, un entrepôt analytique ou un système externe lorsque le besoin le justifie. Les migrations contiennent une variante par dialecte supporté (`migrations/sqlite`, `migrations/postgresql`); ce découpage assure la compatibilité de SQL, il ne signifie pas que chaque module possède une base distincte.

Une unité métier Feluqa se déclare dans un provider, s'enregistre dans le panel choisi et expose ses ressources/pages sous les ACL. Une déclaration doit rester courte : Feluqa fournit les pages CRUD standard, le rendu de schéma, la navigation, les policies par opération et les points d'extension. Le développeur ajoute des contrôleurs/services/routes spécifiques uniquement quand le workflow métier sort du CRUD standard.

L'identité Core inclut `tenant_id`; les migrations additives ajoutent l'état et une génération d'authentification par tenant. Le bootstrap place le premier administrateur dans `default`; les comptes et rôles créés héritent du tenant de l'acteur. La session validée transmet ce tenant au `Principal`. Les listes Core filtrent par tenant, et CRM applique toujours la portée tenant côté SQL. `/system/tenants` permet de créer un tenant avec son premier administrateur, puis de le suspendre ou le réactiver. La suspension bloque login, authentification et résolution de permissions et révoque les sessions en transaction. La génération avancée invalide aussi tout jeton qui aurait été inséré pendant une course avec la suspension; une réactivation ne restaure donc aucune session précédente. `default` et le tenant de l'acteur ne peuvent pas être suspendus. La suppression et la vérification PostgreSQL restent à faire.

Chaque module Feluqa porte ses migrations dans son propre dossier. La même identité de migration doit exister pour chaque backend supporté. L'architecture cible exprime la propriété par domaine, sans dossiers génériques `src/app/` et `src/modules/` :

```text
products/numerimondes/
├── src/
│   ├── main.rs
│   ├── service_provider.rs        # Composition root unique
│   ├── routes/web.rs              # Assemblage global et middlewares globaux
│   ├── website/                   # Panel site public (pages & routes publiques)
│   ├── system/                    # Intégration Core spécifique à l'application
│   └── business/                  # Modules Métier Feluqa (ERP)
│       ├── crm/                   # Module Feluqa : CRM
│       │   ├── module.toml        # Déclaration du module & dialectes SQL
│       │   ├── panel.rs           # Enregistrement du Panel CRM (Resources, Pages, Clusters)
│       │   ├── routes.rs          # Routes personnalisées d'exception (si nécessaire)
│       │   ├── resources/         # Contacts, Companies, Opportunities...
│       │   ├── features/          # Sous-capacités métier fines
│       │   ├── services.rs        # Cas d'usage réutilisables
│       │   ├── policies.rs        # Règles d'accès (ACL)
│       │   └── migrations/{sqlite,postgresql}/
│       └── finance/               # Module Feluqa : Finance (Même DB par défaut)
├── resources/views/               # Layouts et composants de vues partagés
├── config/database.toml
├── public/
├── database/seeders/              # Seeders globaux (les seeders de modules restent dans leurs modules)
├── tests/
└── storage/
```

The tree is a target convention, not a claim that Numerimondes has already been refactored. Its current `src/app/` and `src/modules/` are transitional. Directory names such as `business/crm/` express Feluqa ownership; every `.rs` source remains an ordinary Rust module in Rust's namespace.

Le contrat d'une migration est commun, son SQL peut être propre au dialecte. `module.toml` déclare l'identifiant Feluqa, les dialectes SQL (`supported_databases`) et les connexions utilisées; la connexion `default` est celle de la base applicative partagée par l'ERP. `feluqa::database::build_support::generate_migration_registry` compare les identifiants des variantes, embarque les fichiers SQL et produit le registre des migrations. Le runner applique la variante de dialecte au pool explicitement choisi. Une unité métier ne reçoit pas implicitement sa propre base. Le build échoue si un dialecte déclaré manque son dossier ou si les identifiants divergent. Les migrations Rust ne sont pas encore prises en charge par ce registre.

Configuration cible : une connexion `default` partagée par les modules ERP, plus des connexions nommées (`analytics`, `legacy`, etc.) uniquement lorsque l'intégration l'exige. Le gestionnaire possède un pool par connexion; transactions, migrations et requêtes sont explicitement liées à une connexion. Une requête métier ne bascule jamais silencieusement de base.

Le runner de migrations maintient l'historique par base et par module avec identifiant, checksum, horodatage et état. Il fournit `status` et `run`; `run` sérialise les démarrages concurrents par module (mise à jour d'une ligne verrouillée dans SQLite, `FOR UPDATE` sous PostgreSQL) et refuse un historique qui contient une migration absente ou modifiée dans le binaire. Une stratégie de retour arrière vérifiée reste à construire. Les changements destructifs utilisent des migrations expand/contract; un downgrade ne restaure pas magiquement des données supprimées. Le support multi-base signifie compatibilité vérifiée, pas une promesse que toutes les fonctions SQL sont identiques.

## Layout cible et expérience « less is more »

```text
src/main.rs
src/service_provider.rs   # panels, modules et providers sélectionnés
src/routes/web.rs         # compose les routes déclarées par leurs owners
src/website/              # site public enregistré comme panel
src/business/crm/         # module Feluqa métier; ressources/pages/features co-localisées
src/business/finance/
resources/views/          # layouts/composants partagés de l'application
database/seeders/         # seeders applicatifs; chaque module peut aussi en posséder
config/app.toml
config/database.toml
public/
storage/
```

Ce layout évite la séparation redondante `app/` contre `modules/`: les dossiers nomment le domaine ou la surface possédée. Les types et fichiers restent des modules Rust; un module Feluqa peut contenir plusieurs modules Rust, sous-modules et features. Convention d'écriture : le développeur déclare l'essentiel; Feluqa découvre/enregistre les ressources et pages déclarées, génère les opérations CRUD standard et fournit l'ACL, les formulaires, tables et shell. Le build compile vues, routes et migrations embarquées dans le binaire lorsque nécessaire. En développement, `feluqa dev` surveille, recompile et redémarre. Pas de code PHP, pas d'évaluation de Rust arbitraire au runtime.

## Ordre de réalisation et critère de vérité

1. **Socle data** : pools nommés, migrations compilées par module/dialecte, historique/checksum, verrouillage concurrent SQLite/PostgreSQL et refus des migrations retirées/modifiées. L'auto-registre partagé est intégré au build Numerimondes; `feluqa new` doit encore appeler ce même build support dans son scaffold.
2. **Boucle MVC** : routes → contrôleurs → services → modèles → vues compilées sont présentes dans Numerimondes; générateurs et conventions doivent encore fonctionner dans une application neuve et la validation/gestion d'erreurs doit être unifiée.
3. **Auth et Core** : setup/login/logout, sessions, rôles/grants, provisioning et suspension/réactivation des tenants sont intégrés. Reste la suppression tenant, les protections multi-instance et le durcissement production.
4. **Ressources du panel** : le CRUD CRM initial existe; le catalogue CRUD complet, les clusters, les pages typées extensibles, les widgets et l'assemblage complet par providers restent à construire.
5. **ERP Numerimondes** : CRM est le premier module métier; commandes, factures, stock, tests de migration de données en production, déploiement et restauration restent à réaliser.

Une crate qui compile ou un registre qui accepte une déclaration ne suffit pas à marquer un panneau livré. La preuve est une application neuve qui démarre, migre sa base, authentifie un utilisateur, affiche le Core, refuse un accès interdit, puis réalise un workflow ERP à travers le panel et la route web avec le même service métier.

Décision de socle : SeaORM 1.1.20 sur Tokio, avec SQLx 0.8.6, SQLite et PostgreSQL. Cette version garde le MSRV du workspace à Rust 1.85; les manifests publiés de [SeaORM 2.0.4](https://docs.rs/crate/sea-orm/2.0.4) et [SQLx 0.9.0](https://docs.rs/crate/sqlx/0.9.0) demandent Rust 1.94 et ne sont donc pas retenus tant que le MSRV reste 1.85. Le runner Feluqa conserve le format demandé `migrations/{sqlite,postgresql}` au lieu d'imposer les migrations écrites en Rust proposées par SeaORM. SeaORM documente ses [pilotes sélectionnables](https://www.sea-ql.org/SeaORM/docs/install-and-config/database-and-async-runtime/) et son [système de migrations](https://www.sea-ql.org/SeaORM/docs/1.1.x/migration/running-migration/); Feluqa ajoute la variante SQL vérifiée par module.
