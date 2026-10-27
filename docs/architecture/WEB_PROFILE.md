# Feluqa Web : architecture et expérience de développement

Statut : architecture cible demandée pour le produit Web. Ce document ne prétend pas que ces capacités existent déjà.

## Réponse directe

Le profil Web cible est un framework **MVC modulaire**, avec un panneau d'administration intégré à la plateforme et une application ERP construite avec les mêmes conventions. La compilation Rust change le cycle de développement, pas le modèle mental : routes, contrôleurs, modèles, services métier, migrations et vues restent des concepts adaptés.

**L'état actuel n'est pas encore ce framework.** Le produit Numerimondes est une petite application web de démonstration avec routes/handlers et vues compilées. Les crates `feluqa-panel`, `feluqa-ui`, `feluqa-auth`, `feluqa-live` et `feluqa-module` exposent des contrats; elles ne livrent pas un écran de panel, un système MVC, une couche de base de données ni un ERP. Aujourd'hui, `/system` et `/admin` n'existent pas comme panneaux utilisables.

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

## Où se trouve le panneau ?

Il y a deux surfaces qui doivent rester distinctes, mais qui utilisent les mêmes composants et contrats :

1. **Feluqa Core**, panneau système livré par le framework à chaque application Web. Cible initiale : `/system`. Il gère identité, rôles/permissions, configuration, état des modules, connexions, migrations et journal d'audit. Il ne reçoit pas automatiquement une autorité sur les autres applications ou serveurs.
2. **Panel métier**, assemblé par les modules de l'application sous `/admin` par défaut. Il expose les ressources ERP autorisées : clients, catalogue, commandes, factures, stocks, etc. Ces écrans ne sont générés qu'à partir de modèles/services/policies déclarés; le CRUD générique ne contourne jamais les règles métier.

Le site public et les panneaux vivent dans la même application et peuvent partager le même binaire, mais routes, layouts, navigation et permissions restent explicitement séparés. Un projet de site vitrine peut désactiver le panel métier. Le Core système reste une capacité du profil Web, activable et configurée selon le mode de déploiement.

## Modules ERP et bases de données

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
│   │   ├── module.rs
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

Le contrat d'une migration est commun, son SQL peut être propre au dialecte. `sqlite/0001_create_customers.sql` et `postgresql/0001_create_customers.sql` ont le même identifiant logique et produisent le même schéma observable. Le framework doit refuser de démarrer les migrations si un backend déclaré manque sa variante. Les migrations Rust sont possibles quand le SQL ne suffit pas, mais elles doivent encore annoncer les dialectes pris en charge et être testées sur chacun.

Configuration cible : une connexion `default` et des connexions nommées (`analytics`, `legacy`, etc.). Les modules déclarent quelles connexions ils consomment et quels dialectes ils supportent. Le gestionnaire possède un pool par connexion; transactions, migrations et requêtes sont explicitement liées à une connexion. Une requête métier ne bascule jamais silencieusement de base.

Le runner de migrations maintient l'historique par base et par module avec identifiant, checksum, horodatage et état. Il fournit `status`, `run` et une stratégie de retour arrière vérifiée. Les changements destructifs utilisent des migrations expand/contract; un downgrade ne restaure pas magiquement des données supprimées. Le support multi-base signifie compatibilité vérifiée, pas une promesse que toutes les fonctions SQL sont identiques.

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

1. **Socle data** : connexions nommées, pilotes SQLite/PostgreSQL, configuration typée, migrations par dialecte et historique par connexion.
2. **Boucle MVC** : routes → contrôleurs → services → modèles → vues compilées, gestion des erreurs, validation et injection des dépendances.
3. **Auth et Core** : identités/sessions, rôles/policies persistants, audit, puis vraies pages système utilisables.
4. **Ressources du panel** : contrats resource/list/form/table/actions, formulaires validés côté serveur et écrans CRUD métier respectant policies et transactions.
5. **ERP Numerimondes** : premier module CRM ou facturation réel, avec migrations SQLite et PostgreSQL, puis déploiement et restauration vérifiés.

Une crate qui compile ou un registre qui accepte une déclaration ne suffit pas à marquer un panneau livré. La preuve est une application neuve qui démarre, migre sa base, authentifie un utilisateur, affiche le Core, refuse un accès interdit, puis réalise un workflow ERP à travers le panel et la route web avec le même service métier.

Le choix précis du crate SQL/ORM et des pilotes sera fixé dans une décision technique après vérification des versions, licences et compatibilités Rust/MSRV. La structure de migration par dialecte et la capacité multi-connexion sont des exigences Feluqa, indépendantes du choix du crate.
