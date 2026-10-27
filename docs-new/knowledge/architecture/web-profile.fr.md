# Feluqa Web : architecture et expérience de développement

Statut au 2026-10-27 : première tranche MVC et panels intégrée dans Numerimondes. Le framework a un registre de ressources validées; la CRM démontre des grants d'opération, de champ et de fiche à partir d'un contrat `Resource`, avec tables SDUI filtrées et formulaires create/update générés depuis ce contrat dans la vue `.view.rs` compilée. Les listes Core des utilisateurs, rôles, modules, connexions, migrations et audit utilisent aussi des ressources `system.*` et la table SDUI commune. Le CLI génère un starter Web avec vues compilées et les pages/actions Core de setup, auth, utilisateurs, rôles, modules liés, connexions nommées, migrations et audit; le test du starter construit le routeur et vérifie un refus d'autorisation sous SQLite. Les adaptateurs CRUD génériques, l'architecture entreprise complète et le scaffold compilable contre les artefacts publiés restent à livrer.

## Réponse directe

Feluqa est la plateforme installée sur les serveurs. Les développeurs créent des modules Feluqa installables sur cette plateforme; HRM et Numerimondes sont des exemples de tels modules/produits. Un module peut être simple ou composer plusieurs domaines métier sous `business/`, comme Numerimondes. L'administrateur installe et configure les modules pour un domaine depuis le panel System, selon sa licence et ses permissions. La compilation Rust change le cycle de développement, pas le modèle mental : routes, contrôleurs, services métier, migrations et vues restent des concepts adaptés.

**Feluqa n'est pas encore le framework entreprise visé.** Numerimondes possède un chemin MVC utilisable : routes Feluqa/Axum, contrôleurs et services, vues `.view.rs` compilées, Core `/system` (setup/login/logout, utilisateurs, rôles, tenants, modules statiques, connexions, migrations, audit) et un CRUD CRM initial sous `/admin`. Le projet actuel conserve `src/app/` et `src/modules/`; ces dossiers sont transitoires dans l'arbre actuel. Le layout recommandé range le code par surface et capacité métier, mais les dossiers génériques restent un choix valide quand ils servent le projet; voir [Project layout](platform-module-layout.en.md). Le panel migrations affiche le statut par module/connexion et applique uniquement la paire choisie; le runner sélectionne la variante compatible avec le dialecte configuré. Les tests Core et HTTP Numerimondes valident les parcours actuellement intégrés sous SQLite; les tests PostgreSQL sont conditionnés par `FELUQA_TEST_POSTGRES_URL`. SeaORM fournit les pools nommés; un build script compile les migrations déclarées par les unités métier Feluqa. Restent notamment les CRUD resource-driven génériques, l'activation dynamique, Live navigateur, les workflows ERP complets et le déploiement/restauration.

## Ce que l'utilisateur doit obtenir

- `feluqa new prod` crée un module Feluqa avec sa configuration, ses routes, services, vues et tests d'exemple; le produit développé est destiné à être installé sur une plateforme Feluqa.
- `feluqa dev` surveille les sources, recompile les vues et le binaire, puis redémarre proprement l'application. Rust ne devient pas interprété; la boucle de développement automatise les compilations.
- La plateforme hôte fournit le runtime et les connexions. Un module peut déclarer SQLite/PostgreSQL et des connexions nommées compatibles sans embarquer son propre serveur Feluqa.
- Feluqa inclut le panel System et les primitives de panels. Les opérateurs gèrent l'installation de la plateforme et activent/configurent les modules par domaine dans System. Un module enregistre ses panel contributions, resources et pages auprès des instances Feluqa; le site public fourni par un module peut aussi être une instance de panel. Ces surfaces partagent identité, ACL, composants, vues, stockage et services.
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

## Où se trouvent le panel et les modules ?

Feluqa est installé sur le serveur et fournit le panel **System**. Depuis ce
panel, l'opérateur autorisé choisit le domaine, installe un module Feluqa,
configure sa licence/capacités et lui accorde les permissions disponibles. Le
module expose ensuite ses fonctionnalités sur ce domaine. Cette installation
dynamique et l'application effective des licences ne sont pas encore livrées.

Le développeur d'un module enregistre ses resources/pages auprès du système de
panels déjà fourni par Feluqa. Il peut déclarer un panel métier, un panel de
site public ou les deux; il n'implémente pas une plateforme ni un shell
d'administration indépendant. `/admin` est une convention pour le panel ERP.
La CRM Numerimondes démontre des grants par opération, champ et fiche, mais les
adaptateurs CRUD génériques, vues/formulaires complets et l'assemblage complet
restent à construire.

Les panels partagent runtime, identité et composants Feluqa tout en gardant
routes, layouts, navigation et permissions séparés. Les routes publiques sont
explicitement publiques; les opérations protégées revérifient l'ACL côté
serveur.

## Modules Feluqa et base partagée

Un **module Feluqa** est un paquet installé sur la plateforme (CRM, finance, HRM, Numerimondes, etc.). Un module peut être simple ou composer plusieurs domaines métier sous `business/`. Une **feature** est une capacité plus ciblée (par exemple les contacts ou le pipeline d'un CRM) et ne devient pas automatiquement un module installable. Un **module Rust** désigne uniquement une unité du langage déclarée avec `mod` ou `pub mod`; il peut implémenter une partie d'un module Feluqa, mais les notions sont distinctes. Les dossiers et noms Rust ne définissent pas le cycle de vie d'installation Feluqa.

Les modules d'un même produit Numerimondes activé sur un domaine partagent par défaut la base applicative via la connexion `default`. Les modules propriétaires de tables gardent leurs migrations dans leur dossier, mais ne reçoivent pas chacun une base isolée. Les connexions nommées restent possibles pour une base héritée, un entrepôt analytique ou un système externe. Les migrations ont une variante par dialecte supporté (`migrations/sqlite`, `migrations/postgresql`); ce découpage ne signifie pas une base par module.

Un module Feluqa se déclare par son manifest/provider, puis s'enregistre auprès du runtime et du système de panels déjà fournis par Feluqa. Ses resources/pages sont exposées selon licence, configuration de domaine et ACL. Une déclaration doit rester courte : Feluqa fournit les pages CRUD standard, le rendu de schéma, la navigation, les policies par opération et les points d'extension. Le développeur ajoute des contrôleurs/services/routes spécifiques uniquement quand le workflow métier sort du CRUD standard.

L'identité Core inclut `tenant_id`; les migrations additives ajoutent l'état et une génération d'authentification par tenant. Le bootstrap place le premier administrateur dans `default`; les comptes et rôles créés héritent du tenant de l'acteur. La session validée transmet ce tenant au `Principal`. Les listes Core filtrent par tenant, et CRM applique toujours la portée tenant côté SQL. `/system/tenants` permet de créer un tenant avec son premier administrateur, puis de le suspendre ou le réactiver. La suspension bloque login, authentification et résolution de permissions et révoque les sessions en transaction. La génération avancée invalide aussi tout jeton qui aurait été inséré pendant une course avec la suspension; une réactivation ne restaure donc aucune session précédente. `default` et le tenant de l'acteur ne peuvent pas être suspendus. La suppression et la vérification PostgreSQL restent à faire.

Chaque module Feluqa porte ses migrations dans son propre dossier. La même identité de migration doit exister pour chaque backend supporté. La crate d'un module installable est une bibliothèque, pas un second serveur Feluqa. Les deux formes de source — un module unique et un produit composé comme Numerimondes avec plusieurs domaines sous `business/` ou un autre dossier choisi — sont décrites dans [Project layout](platform-module-layout.en.md). Les layouts recommandés évitent les dossiers génériques `src/app/` et `src/modules/`, mais un développeur peut les garder s'ils conviennent à son projet; chaque `.rs` reste du code Rust ordinaire.

Le contrat d'une migration est commun, son SQL peut être propre au dialecte. `module.toml` déclare l'identifiant Feluqa, les dialectes SQL (`supported_databases`) et les connexions utilisées; la connexion `default` est celle de la base applicative partagée par l'ERP. `feluqa::database::build_support::generate_migration_registry` compare les identifiants des variantes, embarque les fichiers SQL et produit le registre des migrations. Le runner applique la variante de dialecte au pool explicitement choisi. Une unité métier ne reçoit pas implicitement sa propre base. Le build échoue si un dialecte déclaré manque son dossier ou si les identifiants divergent. Les migrations Rust ne sont pas encore prises en charge par ce registre.

Configuration cible : une connexion `default` partagée par les modules ERP, plus des connexions nommées (`analytics`, `legacy`, etc.) uniquement lorsque l'intégration l'exige. Le gestionnaire possède un pool par connexion; transactions, migrations et requêtes sont explicitement liées à une connexion. Une requête métier ne bascule jamais silencieusement de base.

Le runner de migrations maintient l'historique par base et par module avec identifiant, checksum, horodatage et état. Il fournit `status` et `run`; `run` sérialise les démarrages concurrents par module (mise à jour d'une ligne verrouillée dans SQLite, `FOR UPDATE` sous PostgreSQL) et refuse un historique qui contient une migration absente ou modifiée dans le binaire. Une stratégie de retour arrière vérifiée reste à construire. Les changements destructifs utilisent des migrations expand/contract; un downgrade ne restaure pas magiquement des données supprimées. Le support multi-base signifie compatibilité vérifiée, pas une promesse que toutes les fonctions SQL sont identiques.

## Source de module et expérience « less is more »

Un module installable est une crate bibliothèque avec manifest et provider; ce
n'est pas le serveur Feluqa. La source peut décrire un module unique ou un
produit composé, comme Numerimondes avec plusieurs domaines sous `business/`.
Les formes canoniques sont documentées dans [Project layout](platform-module-layout.en.md).
Le développeur déclare les resources, pages, policies et routes spécifiques;
Feluqa génère les opérations CRUD usuelles et connecte ACL, navigation,
schémas, formulaires, tables et panel. Pas de code PHP, pas d'évaluation de
Rust arbitraire au runtime.

## Ordre de réalisation et critère de vérité

1. **Socle data** : pools nommés, migrations compilées par module/dialecte, historique/checksum, verrouillage concurrent SQLite/PostgreSQL et refus des migrations retirées/modifiées. L'auto-registre partagé est intégré au build Numerimondes; `feluqa new` doit encore appeler ce même build support dans son scaffold.
2. **Boucle MVC** : routes → contrôleurs → services → modèles → vues compilées sont présentes dans Numerimondes; générateurs et conventions doivent encore fonctionner dans une application neuve et la validation/gestion d'erreurs doit être unifiée.
3. **Auth et Core** : setup/login/logout, sessions, rôles/grants, provisioning et suspension/réactivation des tenants sont intégrés. Reste la suppression tenant, les protections multi-instance et le durcissement production.
4. **Ressources du panel** : le CRUD CRM initial existe; le catalogue CRUD complet, les clusters, les pages typées extensibles, les widgets et l'assemblage complet par providers restent à construire.
5. **ERP Numerimondes** : CRM est le premier module métier; commandes, factures, stock, tests de migration de données en production, déploiement et restauration restent à réaliser.

Une crate qui compile ou un registre qui accepte une déclaration ne suffit pas à marquer le lifecycle livré. La preuve cible est une installation Feluqa qui installe un module autorisé pour un domaine, valide sa compatibilité/licence, applique ses migrations, configure ses panels, refuse les accès interdits, puis réalise un workflow ERP par le panel et une route spécifique avec le même service métier. L'installation de modules reste à implémenter.

Décision de socle : SeaORM 1.1.20 sur Tokio, avec SQLx 0.8.6, SQLite et PostgreSQL. Cette version garde le MSRV du workspace à Rust 1.85; les manifests publiés de [SeaORM 2.0.4](https://docs.rs/crate/sea-orm/2.0.4) et [SQLx 0.9.0](https://docs.rs/crate/sqlx/0.9.0) demandent Rust 1.94 et ne sont donc pas retenus tant que le MSRV reste 1.85. Le runner Feluqa conserve le format demandé `migrations/{sqlite,postgresql}` au lieu d'imposer les migrations écrites en Rust proposées par SeaORM. SeaORM documente ses [pilotes sélectionnables](https://www.sea-ql.org/SeaORM/docs/install-and-config/database-and-async-runtime/) et son [système de migrations](https://www.sea-ql.org/SeaORM/docs/1.1.x/migration/running-migration/); Feluqa ajoute la variante SQL vérifiée par module.
