# Panels, composants, SDUI et lifecycle

Date : 2026-10-26. Statut : premières fondations en code. `feluqa::ui` valide un schéma SDUI versionné et rend un catalogue HTML sûr de base; `feluqa::panel` enregistre des routes/pages et sépare les permissions system/business; `feluqa::auth` fournit les identifiants de permission; `feluqa::live` signe les snapshots et vérifie l’accès/rejeu des actions; `feluqa::module` gère l’ordre et l’arrêt des modules statiquement enregistrés. Le moteur Views compile les layouts/composants de Numerimondes. Il manque encore le rendu HTML des schémas, l’intégration aux routes de production, les sessions/roles/audit, le transport navigateur, le stockage de replay partagé et le chargement dynamique. Ce document précise A4/D-0006 de DECISIONS.md et l'ordre de réalisation.

## Responsabilités et dépendances

```text
services métier + politiques + données
                ↓
schémas UI typés/versionnés → composants → vues .view.rs → HTML
                ↑                               ↑
       panels et ressources              actions Live autorisées
```

Les crates `_crates/feluqa-ui`, `feluqa-panel`, `feluqa-live`, `feluqa-auth` et `feluqa-module` ont maintenant des contrats exécutables dans la façade `feluqa::...`. `feluqa-data` et la bibliothèque/catalogue de composants restent à créer après leur premier contrat. Les crates auth/UI/panel/module sont `no_std` avec `alloc`; la façade expose des profils de features séparés pour limiter les dépendances de runtime. Les produits restent sous `products/` : CLI, Numerimondes, extension Zed et tout futur exécutable de contrôle de plateforme.

Le Core panel est une capacité embarquée dans une application web Feluqa et fonctionne sans module tiers. Son UI utilise les mêmes composants et schémas que les applications. Un gestionnaire de serveur global est un produit optionnel ultérieur avec son propre périmètre d'autorité.

## Trois périmètres d'accès

| Périmètre | Responsabilité | Frontière |
|---|---|---|
| Plateforme | Installations, processus, domaines, limites et déploiements | Autorité dédiée; aucune élévation depuis une session d'application. |
| Core / système de l'application | Utilisateurs, rôles, réglages, audit, état des modules et opérations de maintenance | Routes et politiques explicitement enregistrées; refuse l'accès par défaut. |
| Panel métier / site | Pages, contenu, médias, collections et workflows métier | Accès limité à l'application, tenant et objets autorisés. |

Routes cibles proposées : `/system` pour le Core local, `/admin` pour le panel métier; préfixes configurables et collisions refusées au boot. Authentification, session, CSRF, autorisation et services sont partagés avec API et CLI. Masquer un bouton ne protège jamais l'action correspondante.

## Contrats à compléter

### UI schema v1 livré

`feluqa::ui::UiDocument` utilise `schema_version = 1` et un arbre Serde fermé composé de texte, composants `{key, name, props, children}` et actions `{key, label, action, permission}`. La validation refuse les versions inconnues, les clés de nœud dupliquées, les noms invalides, les propriétés événementielles/HTML dangereuses, les documents au-dessus de 1 MiB, une profondeur excessive et les arbres de plus de 10 000 nœuds. Le JSON transporte des noms/données, jamais du Rust ni des pointeurs de fonction. Les composants déclarés n’ont pas encore de renderer partagé ni de catalogue de props validées par composant.

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

Un `Principal` ne porte que les permissions explicitement accordées par un code serveur de confiance. Les identifiants sont exacts, sans joker. Les panels `System` n’acceptent que `system.*`, les panels `Business` que `business.*`; les actions déclarées dans le schéma doivent respecter le même périmètre. Le registre refuse les collisions de chemins avant toute mutation. Ces types ne réalisent pas eux-mêmes login, cookie/session, résolution rôle→permissions, autorisation tenant/record, audit persistant ou intégration Axum.

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

Préférence v1 : actions HTTP nommées et snapshots signés, à confirmer par le premier cas réel. Toute action revalide session, CSRF, schéma, tenant et policy. Le dispatch livré vérifie signature HMAC, action/permission/sujet/session/tenant/CSRF/révision, consomme un nonce via une interface ReplayGuard atomique et désérialise une entrée typée; il n’émet pas encore les snapshots ni ne fournit transport, session ou stockage distribué. La seule implémentation de replay livrée est bornée et mémoire locale. Signer un état n'assure pas sa confidentialité; ne jamais y inclure de secrets. Prévoir expiration, rejeu, ordre des réponses concurrentes et état obsolète.

Le serveur renvoie le fragment concerné; le client conserve focus, sélection et saisie pendant le remplacement du DOM. Fallback HTML/formulaire pour les opérations de base. SSE est destiné aux notifications serveur; ce n'est pas une autorisation de mutation. Reconnexion, backpressure, limites et arrêt propre font partie du contrat. Le choix de bibliothèque de mise à jour DOM reste à évaluer et à tracer dans les décisions.

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
