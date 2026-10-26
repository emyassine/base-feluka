# Panels, composants, SDUI et lifecycle

Date : 2026-10-26. Statut : contrat cible; aucune de ces couches n'est encore considérée livrée. Ce document précise A4/D-0006 de DECISIONS.md et l'ordre de réalisation de la roadmap.

## Responsabilités et dépendances

```text
services métier + politiques + données
                ↓
schémas UI typés/versionnés → composants → vues .view.rs → HTML
                ↑                               ↑
       panels et ressources              actions Live autorisées
```

Les bibliothèques prévues sont `_crates/feluqa-ui`, `feluqa-panel`, `feluqa-live`, `feluqa-auth`, `feluqa-data` et `feluqa-module`, exposées par la façade `feluqa::...`. Les créer lorsque leur premier contrat fonctionne, pas comme coquilles vides. Les produits restent sous `products/` : CLI, Numerimondes, extension Zed et tout futur exécutable de contrôle de plateforme.

Le Core panel est une capacité embarquée dans une application web Feluqa et fonctionne sans module tiers. Son UI utilise les mêmes composants et schémas que les applications. Un gestionnaire de serveur global est un produit optionnel ultérieur avec son propre périmètre d'autorité.

## Trois périmètres d'accès

| Périmètre | Responsabilité | Frontière |
|---|---|---|
| Plateforme | Installations, processus, domaines, limites et déploiements | Autorité dédiée; aucune élévation depuis une session d'application. |
| Core / système de l'application | Utilisateurs, rôles, réglages, audit, état des modules et opérations de maintenance | Routes et politiques explicitement enregistrées; refuse l'accès par défaut. |
| Panel métier / site | Pages, contenu, médias, collections et workflows métier | Accès limité à l'application, tenant et objets autorisés. |

Routes cibles proposées : `/system` pour le Core local, `/admin` pour le panel métier; préfixes configurables et collisions refusées au boot. Authentification, session, CSRF, autorisation et services sont partagés avec API et CLI. Masquer un bouton ne protège jamais l'action correspondante.

## Contrats à implémenter

| Contrat | Contenu et invariants |
|---|---|
| Panel | ID stable, préfixe, guard/policies, navigation, pages, ressources, assets; validation des doublons avant écoute HTTP. |
| Resource | Schéma de données, service applicatif, policy, liste, formulaire, actions; le navigateur ne reçoit pas d'accès direct au stockage. |
| UI schema | Nœuds versionnés, props typées, clés stables, composition/slots, erreurs de validation; représentation Serde pour SDUI. Aucun pointeur de fonction ou Rust arbitraire dans le JSON client. |
| Form | Champs, groupes, erreurs par champ, validation serveur, soumission idempotente lorsque nécessaire, état dirty/loading; CSRF et contrôle d'accès serveur. |
| Table | Pagination, filtres/tri autorisés, sélection, actions; limites de lignes et contrôle par enregistrement. |
| Action | Nom stable, entrée typée, identité/tenant, validation, policy, transaction, résultat et événement d'audit. CLI/API/panel appellent le même service. |
| Component | Props et slots déclarés, attributs contrôlés, accessibilité, rendu compilé; mêmes primitives dans Core et sites. |

Catalogue v1 : page/layout, navigation, section/card, texte, bouton/lien, input, textarea, select, checkbox, formulaire/erreurs, table/pagination, badge, alerte, état vide. Ensuite : modal accessible, notifications, onglets, upload et widgets. États obligatoires : normal, vide, chargement, erreur, accès refusé; focus clavier, labels et erreurs associées aux champs.

## Live : contrat avant transport

Préférence v1 : actions HTTP nommées et snapshots signés, à confirmer par le premier cas réel. Toute action revalide session, CSRF, schéma, tenant et policy. Signer un état n'assure pas sa confidentialité; ne jamais y inclure de secrets. Prévoir expiration, rejeu, ordre des réponses concurrentes et état obsolète.

Le serveur renvoie le fragment concerné; le client conserve focus, sélection et saisie pendant le remplacement du DOM. Fallback HTML/formulaire pour les opérations de base. SSE est destiné aux notifications serveur; ce n'est pas une autorisation de mutation. Reconnexion, backpressure, limites et arrêt propre font partie du contrat. Le choix de bibliothèque de mise à jour DOM reste à évaluer et à tracer dans les décisions.

## Lifecycle

Bibliothèques liées : déclaration → validation des dépendances/config/routes/vues → initialisation → prêt → arrêt/drainage. Ordre déterministe, cleanup en cas d'échec partiel, aucune boucle de découverte à chaque requête. Les migrations sont une étape explicite de livraison, pas une écriture implicite au premier rendu.

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
