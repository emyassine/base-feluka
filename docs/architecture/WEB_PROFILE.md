# Feluqa Web : architecture et expérience de développement

Statut au 2026-10-27 : première tranche MVC et panels intégrée dans Numerimondes. Le framework a un registre de ressources validées; la CRM démontre des grants d'opération, de champ et de fiche à partir d'un contrat `Resource`, avec tables SDUI filtrées et formulaires create/update générés depuis ce contrat dans la vue `.view.rs` compilée. Les listes Core des utilisateurs, rôles, modules, connexions, migrations et audit utilisent aussi des ressources `system.*` et la table SDUI commune. Le CLI génère un starter Web avec vues compilées et les pages/actions Core de setup, auth, utilisateurs, rôles, modules liés, connexions nommées, migrations et audit; le test du starter construit le routeur et vérifie un refus d'autorisation sous SQLite. Les adaptateurs CRUD génériques, l'architecture entreprise complète et le scaffold compilable contre les artefacts publiés restent à livrer.

## Réponse directe

Le profil Web cible est un framework **MVC modulaire**, avec un panneau d'administration intégré à la plateforme et une application ERP construite avec les mêmes conventions. La compilation Rust change le cycle de développement, pas le modèle mental : routes, contrôleurs, modèles, services métier, migrations et vues restent des concepts adaptés.

**Feluqa n'est pas encore le framework entreprise visé.** Numerimondes possède un chemin MVC utilisable : routes Feluqa/Axum, contrôleurs et services, vues `.view.rs` compilées, Core `/system` (setup/login/logout, utilisateurs, rôles, tenants, modules statiques, connexions, migrations, audit) et un CRUD CRM initial paginé sous `/admin`. Le panel migrations affiche le statut par module/connexion et applique uniquement la paire choisie; le runner sélectionne la variante compatible avec le dialecte configuré. Le starter `feluqa new` expose ces pages Core et les opérations de comptes/rôles ainsi que le provisioning et le lifecycle initial des tenants; la suspension/réactivation est protégée par permission et CSRF, révoque les sessions et avance la génération d'authentification pour invalider même les sessions créées lors d'une course avec la suspension. Les adaptateurs CRUD génériques restent à livrer. Les tests Core et HTTP Numerimondes valident provisioning, suspension/réactivation, CSRF, permissions, sessions et opérations de migration ciblées sous SQLite; les tests PostgreSQL sont conditionnés par `FELUQA_TEST_POSTGRES_URL`, absent de l'environnement de développement actuel. SeaORM fournit les pools nommés; un build script compile les migrations déclarées dans chaque `modules/*/module.toml`. À l'extérieur du monorepo, le registre privé ne contient pas encore les versions actuelles requises. Restent notamment la publication privée, suppression des tenants, activation des modules, Live navigateur, les workflows ERP plus larges et le déploiement/restauration.

## Ce que l'utilisateur doit obtenir

- `feluqa new prod` crée une application complète avec le profil choisi, sa configuration, ses routes, contrôleurs, modèles, services, vues, modules et tests d'exemple.
- `feluqa dev` surveille les sources, recompile les vues et le binaire, puis redémarre proprement l'application. Rust ne devient pas interprété; la boucle de développement automatise les compilations.
- Une application peut démarrer avec SQLite et déclarer ensuite PostgreSQL ou plusieurs connexions nommées sans changer les contrats métier de ses modules.
- Les modules de plateforme fournissent le Core système. Les modules métier composent un ERP et un site web partageant auth, politiques, composants, vues, stockage et services.
- Le même modèle/service métier peut être appelé par une route HTML, une API, une commande CLI ou une action Live, toujours avec autorisation et validation côté serveur.

## MVC Feluqa

| Élément | Rôle attendu | Règle |
|---|---|---|
| Routes | Associer méthode + chemin + middleware à une action de contrôleur | Déclarations statiques dans `routes/web.rs`, `routes/api.rs` et `routes/console.rs`; vérification des collisions au build ou au démarrage. |
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

1. **Feluqa Core**, panneau système livré par le framework à chaque application Web. Cible initiale : `/system`. Il gère identité, rôles/permissions, configuration, état des modules, connexions, migrations et journal d'audit. Il ne reçoit pas automatiquement une autorité sur les autres applications ou serveurs.
2. **Panel métier**, assemblé par les modules de l'application sous `/admin` par défaut. Il expose les ressources ERP autorisées : clients, catalogue, commandes, factures, stocks, etc. La CRM Numerimondes démontre des grants par opération, champ et fiche. Le contrat déclaratif générique existe; ses adaptateurs de persistance, vues/formulaires et assemblage restent à construire et ne devront jamais contourner les règles métier.

Le site public et les panneaux vivent dans la même application et peuvent partager le même binaire, mais routes, layouts, navigation et permissions restent explicitement séparés. Un projet de site vitrine peut désactiver le panel métier. Le Core système reste une capacité du profil Web, activable et configurée selon le mode de déploiement.

## Modules ERP et bases de données

L'identité Core inclut `tenant_id`; les migrations additives ajoutent l'état et une génération d'authentification par tenant. Le bootstrap place le premier administrateur dans `default`; les comptes et rôles créés héritent du tenant de l'acteur. La session validée transmet ce tenant au `Principal`. Les listes Core filtrent par tenant, et CRM applique toujours la portée tenant côté SQL. `/system/tenants` permet de créer un tenant avec son premier administrateur, puis de le suspendre ou le réactiver. La suspension bloque login, authentification et résolution de permissions et révoque les sessions en transaction. La génération avancée invalide aussi tout jeton qui aurait été inséré pendant une course avec la suspension; une réactivation ne restaure donc aucune session précédente. `default` et le tenant de l'acteur ne peuvent pas être suspendus. La suppression et la vérification PostgreSQL restent à faire.

Chaque module porte ses migrations dans son propre dossier. La même identité de migration doit exister pour chaque backend supporté :

```text
products/numerimondes/
├── routes/
│   ├── web.rs
│   ├── api.rs
│   └── console.rs
├── app/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   └── policies/
├── modules/
│   ├── crm/
│   │   ├── module.toml      # supported_databases + database_connections
│   │   ├── routes/web.rs
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── services/
│   │   ├── policies/
│   │   ├── views/
│   │   └── migrations/
│   │       ├── sqlite/0001_create_customers.sql
│   │       └── postgresql/0001_create_customers.sql
│   └── invoicing/
│       └── ...
├── resources/views/
├── config/database.toml
└── public/
```

Le contrat d'une migration est commun, son SQL peut être propre au dialecte. `module.toml` déclare l'identifiant, les dialectes SQL (`supported_databases`) et les pools nommés consommés (`database_connections`, par défaut `default`); `feluqa::database::build_support::generate_migration_registry` compare les identifiants des variantes, embarque les fichiers SQL et produit le registre des migrations. Le runner vérifie tous les pools déclarés et leur dialecte avant la première écriture, puis applique la variante adaptée à chaque pool. `feluqa make migration` crée les variantes déclarées et initialise le manifeste si nécessaire. Le build échoue si un backend déclaré manque son dossier ou si les identifiants divergent. Les migrations Rust ne sont pas encore prises en charge par ce registre.

Configuration cible : une connexion `default` et des connexions nommées (`analytics`, `legacy`, etc.). Les modules déclarent quelles connexions ils consomment et quels dialectes ils supportent. Le gestionnaire possède un pool par connexion; transactions, migrations et requêtes sont explicitement liées à une connexion. Une requête métier ne bascule jamais silencieusement de base.

Le runner de migrations maintient l'historique par base et par module avec identifiant, checksum, horodatage et état. Il fournit `status` et `run`; `run` sérialise les démarrages concurrents par module (mise à jour d'une ligne verrouillée dans SQLite, `FOR UPDATE` sous PostgreSQL) et refuse un historique qui contient une migration absente ou modifiée dans le binaire. Une stratégie de retour arrière vérifiée reste à construire. Les changements destructifs utilisent des migrations expand/contract; un downgrade ne restaure pas magiquement des données supprimées. Le support multi-base signifie compatibilité vérifiée, pas une promesse que toutes les fonctions SQL sont identiques.

## Scaffold visé

```text
routes/web.rs             # routes HTML du produit
routes/api.rs             # API, si activée
routes/console.rs         # commandes de l'application
app/controllers/          # adaptateurs minces
app/models/               # modèles et accès aux données
app/services/             # cas d'usage/transactions
app/policies/             # autorisations
modules/                  # modules verticaux (ERP ou plateforme)
resources/views/          # .view.rs compilés
database/migrations/      # migrations propres à l'application
config/app.toml
config/database.toml
public/
storage/
```

Convention d'écriture : le développeur compose des modules avec des noms Rust explicites. Le build compile vues, routes et migrations embarquées dans le binaire lorsque nécessaire. En développement, `feluqa dev` surveille, recompile et redémarre. Pas de code PHP, pas d'évaluation de Rust arbitraire au runtime.

## Ordre de réalisation et critère de vérité

1. **Socle data** : pools nommés, migrations compilées par module/dialecte, historique/checksum, verrouillage concurrent SQLite/PostgreSQL et refus des migrations retirées/modifiées. L'auto-registre partagé est intégré au build Numerimondes; `feluqa new` doit encore appeler ce même build support dans son scaffold.
2. **Boucle MVC** : routes → contrôleurs → services → modèles → vues compilées sont présentes dans Numerimondes; générateurs et conventions doivent encore fonctionner dans une application neuve et la validation/gestion d'erreurs doit être unifiée.
3. **Auth et Core** : setup/login/logout, sessions, rôles/grants, provisioning et suspension/réactivation des tenants sont intégrés. Reste la suppression tenant, les protections multi-instance et le durcissement production.
4. **Ressources du panel** : le CRUD CRM initial est transactionnel et audité; le catalogue générique list/form/table/actions et l'assemblage des ressources par module restent à construire.
5. **ERP Numerimondes** : CRM est le premier module métier; commandes, factures, stock, tests de migration de données en production, déploiement et restauration restent à réaliser.

Une crate qui compile ou un registre qui accepte une déclaration ne suffit pas à marquer un panneau livré. La preuve est une application neuve qui démarre, migre sa base, authentifie un utilisateur, affiche le Core, refuse un accès interdit, puis réalise un workflow ERP à travers le panel et la route web avec le même service métier.

Décision de socle : SeaORM 1.1.20 sur Tokio, avec SQLx 0.8.6, SQLite et PostgreSQL. Cette version garde le MSRV du workspace à Rust 1.85; les manifests publiés de [SeaORM 2.0.4](https://docs.rs/crate/sea-orm/2.0.4) et [SQLx 0.9.0](https://docs.rs/crate/sqlx/0.9.0) demandent Rust 1.94 et ne sont donc pas retenus tant que le MSRV reste 1.85. Le runner Feluqa conserve le format demandé `migrations/{sqlite,postgresql}` au lieu d'imposer les migrations écrites en Rust proposées par SeaORM. SeaORM documente ses [pilotes sélectionnables](https://www.sea-ql.org/SeaORM/docs/install-and-config/database-and-async-runtime/) et son [système de migrations](https://www.sea-ql.org/SeaORM/docs/1.1.x/migration/running-migration/); Feluqa ajoute la variante SQL vérifiée par module.
