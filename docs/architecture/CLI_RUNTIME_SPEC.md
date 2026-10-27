# Feluqa CLI et runtime : spécification

Statut : cible produit approuvée le 2026-10-27; implémentation partielle. Le CLI et le runtime font partie du même produit, mais le CLI reste un binaire installable indépendant de l'emplacement du checkout.

## Détection du contexte et frontières

Une application Feluqa valide possède un `feluqa.toml`, un `Cargo.toml` de package, un `src/main.rs` et une configuration lisible. La détection part du répertoire courant et remonte ses ancêtres. Une application trouvée est prioritaire même si elle est membre du monorepo. Le manifeste et la configuration sont lus comme TOML typé; le nom de package Cargo est l'identité d'exécution, le nom public vient de `feluqa.toml`.

Dans une application valide, `feluqa dev` suffit : pas de nom, de cible Cargo ni de chemin de manifeste à fournir. `dev`, `build`, `check`, `test`, `migrate`, `seed` et `make <thing>` sont des commandes de contexte app; hors d'une application elles échouent avant toute commande enfant ou mutation. Seules les opérations globales restent disponibles partout : `help`, `--version`, `new`, `list` depuis un workspace Feluqa et `update` lorsque le canal de distribution sera implémenté. Les opérations qui désignent explicitement une app restent traçables : `feluqa migrate <app>` et `feluqa seed <app> <id>` sont acceptées depuis la racine d'un workspace Feluqa, jamais depuis un répertoire arbitraire.

La CLI n'utilise pas le chemin `CARGO_MANIFEST_DIR` du binaire installé pour rechercher une application, aucun scan de `products/` n'a lieu lorsqu'on se trouve déjà dans une app, et les erreurs nomment le contexte absent et la commande autorisée.

## Commandes publiques

| Commande | Contexte | Contrat |
|---|---|---|
| `feluqa new <name> [--profile web]` | Global | Crée dans le répertoire courant une app compilable et complète; `web` est le profil livré en premier. |
| `feluqa dev` | App | Prépare la config dev, compile les vues et lance le serveur; aucune sélection supplémentaire n'est requise. |
| `feluqa build` | App | Produit le binaire optimisé sans démarrer le serveur. |
| `feluqa check` / `feluqa test` | App | Vérifie le package courant et son comportement. |
| `feluqa migrate` | App | Applique seulement les migrations enregistrées du profil et de la connexion configurée; le serveur n'est pas lancé. |
| `feluqa migrate <app>` | Racine workspace | Même opération pour le package nommé dans ce workspace. Production et développement utilisent la même commande; le profil détermine config et secrets. |
| `feluqa seed <id>` | App | Exécute exactement le seeder explicitement enregistré par cet ID. Les données ne sont jamais incorporées aux migrations. |
| `feluqa seed <app> <id>` | Racine workspace | Forme explicite pour l'opérateur de workspace; ne résout jamais une app arbitraire hors workspace. |
| `feluqa make migration <name>` | App | Crée des fichiers de migration distincts pour chaque dialecte déclaré, avec préfixe temporel ordonné et création atomique sans collision. |
| `feluqa make panel <name>` | App | Crée la déclaration, permissions, route et vue compilée d'un panel avec le namespace system/business requis. |
| `feluqa make controller|model|service|module <name>` | App | Chaque cible est traitée par son propre fichier de commande; génération sous les dossiers canoniques et inscription explicite au module lorsque nécessaire. |
| `feluqa list`, `feluqa --version`, `feluqa help` | Global | Inventaire du workspace, version ou aide sans toucher aux données d'une app. |

Les mots de commande sont stables, lisibles et proches de l'anglais naturel. Les arguments app ne sont pas des noms Cargo à mémoriser. `feluqa make migration <name>` est la forme de commande prise en charge. Chaque commande et chaque générateur possède son propre fichier Rust.

## Structure de projet générée

```text
my_site/
├── Cargo.toml
├── feluqa.toml
├── config/
│   ├── app.toml
│   ├── app.development.toml
│   ├── app.staging.toml
│   ├── app.production.toml
│   └── database.toml
├── src/
│   ├── main.rs
│   ├── routes/{web.rs,api.rs,console.rs}
│   ├── app/{controllers,models,services}/
│   └── modules/<module>/{module.toml,controllers.rs,models/,services,policies.rs,seeders/,migrations/,views/}
├── resources/views/{layouts,pages,components}/**/*.view.rs # shared site views
├── public/assets/
├── storage/{cache,logs,sessions}/
├── tests/
└── build.rs
```

`storage/` est modifiable par l'utilisateur du service, exclu du document root, avec droits POSIX restrictifs. Les secrets de production viennent de l'environnement ou du gestionnaire de secrets, jamais des fichiers commités. Les seeders sont du code versionné dans `src/modules/<module>/seeders/` et possèdent des IDs stables distincts des IDs de migration.

## Migrations et seeders

Les migrations portent un identifiant temporel monotone et un slug, par exemple `1782495300123456789_add_customer_status`. L'horodatage n'est pas à lui seul une garantie d'unicité : chaque fichier est créé avec `create_new` atomique; en cas de collision, le générateur réserve un suffixe par la même opération exclusive. Un groupe de migration contient une variante SQL pour chaque backend déclaré par le module : SQLite, PostgreSQL et MySQL à mesure que chaque adaptateur est livré.

Les variantes sont intégrées au build et au registre compilé du module. La base stocke les migrations appliquées, leurs checksums et leur connexion nommée; une divergence de checksum bloque l'application. Le générateur met à jour le registre build-time sans exécuter SQL pendant le build. `migrate` est explicite en staging/production. En développement, `feluqa dev` peut appliquer automatiquement les migrations enregistrées, avec un message clair. Une migration échouée arrête la commande et identifie le module, le dialecte et l'ID.

Les seeders ne sont pas des migrations. `seed <id>` sélectionne un seeder inscrit, qui utilise le service du module et sa transaction; aucun fichier arbitraire, nom de type Rust fourni au runtime ou code téléchargé n'est exécuté. Les seeders de démonstration exigent un ID explicite. Les commandes de panel appellent les mêmes services autorisés que le CLI et ne contournent pas les policies.

## Configuration et profils d'exécution

`feluqa.toml` identifie l'application et le profil cible, puis configure l'environnement par défaut. Les fichiers existants `config/app.staging.toml` et `config/app.production.toml` surchargent des champs par fusion TOML; `FELUQA_ENV` choisit l'overlay et `FELUQA_SECURE_COOKIES` surcharge le réglage cookie. Les fichiers sont désérialisés par Serde et les champs inconnus sont refusés. Les overlays `app.toml` commun et `app.development.toml`, le schéma générique `FELUQA__SECTION__KEY` et la gestion de secrets restent à faire. `config/database.toml` permet plusieurs connexions nommées et des URLs `url_env`.

Le profil cible reste indépendant de l'environnement de déploiement. Les features de runtime restent derrière la façade `feluqa::...`; Tokio/Axum et SeaORM sont confinés au profil web. Les contrats partagés peuvent rester `no_std`. Le framework préfère les abstractions minces sur les dépendances établies et n'ajoute ni runtime parallèle ni ORM propriétaire sans benchmark et besoin démontré. SQLite et PostgreSQL sont les backends compilés et déclarés aujourd'hui. MySQL est une cible future et ne doit pas être annoncée comme prise en charge avant pilote driver, migrations et tests d'intégration.

## Budget de performance et protocole de mesure

Les objectifs produits sont des budgets à démontrer, pas des garanties implicites dues à Rust :

- pages métier dynamiques : moins de 10 ms de temps serveur chaud, pool déjà établi, validation/policy, requête DB et rendu inclus;
- contenu statique : moins de 50 µs de traitement serveur chaud par fichier depuis un cache OS chaud, sans inclure le RTT réseau;
- publication des résultats médiane, p95 et p99, avec matériel, OS, build/revision, taille de réponse, concurrence, cache, connexion DB (chaude/froide), nombre d'échantillons et instrumentation précisés;
- ouvrir un pool, démarrer un process, compiler, traverser le réseau ou attendre un stockage froid est mesuré séparément et ne doit pas être masqué dans « réponse ».

Un seuil non atteint reste visible dans les rapports. L'agent ne modifie pas les seuils pour faire passer un benchmark; il optimise le chemin fautif, refait la mesure et met à jour la décision. Les microbenchmarks ne remplacent pas les mesures end-to-end sur un hôte représentatif.

## État d'implémentation

Le binaire actuel détecte un manifeste TOML d'application avant le workspace, refuse les opérations app hors contexte, fournit `new/dev/build/check/test/migrate/seed`, réservations de migrations sans collision et des starters `make <thing>`. `feluqa dev` surveille périodiquement les sources de l'app et les crates locales, conserve l'ancien serveur pendant la compilation et le remplace après succès; Numerimondes gère l'arrêt SIGTERM avec Axum graceful shutdown. Les tests vérifient le fingerprint et la résolution du binaire, mais pas encore le cycle de processus complet. Le scaffold `new` compile depuis le workspace; l'installation autonome reste en attente de la publication privée des versions actuelles, ainsi que les commandes d'exploitation complémentaires et l'auto-enregistrement des fichiers de migrations. Numerimondes a des routes Core/ERP testées avec comptes/rôles, CRUD CRM audité, pages de connexions/modules/migrations/audit et exécution de migrations; les modules restent statiques. Ce document est un contrat de travail, pas une déclaration d'achèvement. L'état prouvé et les gates de sortie restent suivis dans [la feuille de livraison](../planning/ENTERPRISE_DELIVERY.md).
