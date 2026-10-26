# Livraison du framework Feluqa

Date : 2026-10-26. Ce plan remplace l'ordre de livraison contradictoire de la roadmap initiale : les vues, composants et schémas SDUI doivent précéder le Core panel qui les consomme. Le jalon historique M4 ne doit donc plus être interprété comme « attendre après M1 pour avoir des composants ». Le transport Live avancé peut venir ensuite.

## État observé

| Domaine | Réellement présent | Travail restant |
|---|---|---|
| Organisation | `_crates/` workspace/lock, `products/`, `docs/`, `target/` | CI reproductible, politique de versions et MSRV démontré |
| CLI | Binaire `feluqa`, help/list/dev/build/check, découverte de projets | Parsing TOML réel, résolution correcte depuis l'app courante, erreurs d'arguments, génération, installation hors checkout, watcher, start |
| Vues | Texte et `{{ nom }}`; génération Rust depuis `.view` à plat | Toute la grammaire `.view.rs`, AST, source maps, includes, layouts, composants |
| Site | Numerimondes `/` et `/about`, assets, timings distincts | Parité Webkernel vérifiée, autres pages, formulaire, déploiement |
| Panels/SDUI/Live | Décisions et exigences | Contrats, moteur et UI à implémenter |
| Zed/Tree-sitter | Spécification | Grammaire, requêtes, installation réelle et validation |
| Lifecycle | Intention d'architecture | Registre de services, boot/shutdown, staging, activation, rollback |

Le prototype actuel n'est pas enterprise grade. La structure de dossiers et des crates publiées ne prouvent ni stabilité d'API, ni sécurité des panels, ni qualité d'exploitation.

## Lots ordonnés

Estimations en jours-personne pour un ingénieur Rust expérimenté, incluant revue, tests et documentation. Fourchettes de cadrage à recalibrer après le lot F1; elles ne sont ni un devis ni des dates promises. L'accès Hestia et la disponibilité des intervenants peuvent ajouter du délai calendaire.

| ID | Lot et dépendances | Effort | Preuve exigée |
|---|---|---:|---|
| F0 | Inventaire Webkernel, fixtures, contrat de langage et erreurs, audit CLI/MSRV | 3–5 JP | Matrice des directives/composants réellement utilisés, lacunes explicites, fixtures versionnées |
| F1 | Compilateur `.view.rs` : lexer/AST, `@rs`, expressions, conditions/boucles, includes/layouts, source maps; après F0 | 10–16 JP | Exemples compilés, diagnostics positionnés, erreurs de Rust remontées à la vue, builds dev/release équivalents |
| F2 | Tree-sitter + produit Zed; démarre après contrat F0, évolue avec F1/F3 | 6–10 JP | Parser et queries validés, extension installée dans Zed, suffixes et injections vérifiés |
| F3 | Props, composants/slots, attributs, catalogue UI et schéma SDUI; après F1 | 12–20 JP | Même schéma construit depuis Rust et Serde, composants accessibles, tests d'échappement/composition |
| F4 | Services data/auth/policies/sessions/audit et Core panel + panel métier; après F3 | 15–25 JP | Login/logout, accès refusé, CRUD d'une collection/pages, autorisations objet/tenant, audit; zéro module tiers requis |
| F5 | Actions Live, client de mise à jour DOM, état signé et concurrence; après F4 | 10–18 JP | Formulaire/table dynamique, focus conservé, refus CSRF/rejeu/état obsolète, limites de charge |
| F6 | Sites et CLI livrables : new app, dev watcher, build/start, assets/storage, Hestia; première tranche après F1, panel après F4 | 8–14 JP | Numerimondes et second site sur même version, projet généré hors monorepo, déploiement et rollback démontrés |
| F7 | Lifecycle et modules installables : registre local puis ABI, signatures/capacités et activation; après F4 | 12–20 JP | Échec de boot propre, staging/activation atomique, refus module incompatible, rollback et stratégie de données |
| F8 | Exploitation entreprise : sauvegarde/restauration, migrations, quotas, observabilité et upgrades; après F4/F6 | 10–18 JP | Restauration sur instance neuve, isolation POSIX, runbooks et exercices d'incident |
| F9 | Durcissement transversal, compatibilité, fuzzing, sécurité et charge; finalisation après F5/F7/F8 | 15–25 JP | Critères enterprise du contrat panels satisfaits, écarts publiés, candidat de release reproductible |
| | **Total périmètre décrit** | **101–171 JP** | **Plateforme web avec panels, Live et lifecycle, sous réserve des gates** |

Les profils SPA/mobile/desktop/jeux/temps réel restent dans l'écosystème et font l'objet de plans séparés. La haute disponibilité multi-nœuds, SSO complet/passkeys, marketplace et certification de sûreté ne sont pas inclus dans ce total. Les exigences A4 restent suivies : chaque capacité non livrée apparaît dans les écarts de release.

## Première tranche à exécuter

- [ ] F0-01 : inventorier les fichiers Webkernel sources `.view.php` (pas les caches), usages dans Numerimondes et panels; tableau syntaxe → support prévu → fixture.
- [ ] F0-02 : versionner corpus de syntaxe et erreurs; préciser règles des expressions, props, imports et slots avec exemples positifs/négatifs.
- [ ] F1-01 : lexer/AST avec spans et diagnostics; tests des chaînes/raw strings/commentaires Rust et blocs imbriqués.
- [ ] F1-02 : génération du Rust typé pour `@rs`, échos, `@if`, `@foreach`; compilation d'un exemple complet sous les lints explicites.
- [ ] F1-03 : registre, includes, layouts, cycles et graphe d'invalidation; migration atomique `.view` → `.view.rs`, build script et générateur compris.
- [ ] F2-01 : grammaire Tree-sitter sur le même corpus; product Zed avec queries réellement compatibles avec les nœuds générés.
- [ ] F3-01 : composants namespacés, props, slots et attributs; remplacer header/footer répétés de Numerimondes par composition réelle.
- [ ] F6-01 : installer la CLI et créer/compiler/lancer un site dans un dossier neuf hors checkout; aucune dépendance au chemin de compilation de la CLI.

## Deux jalons produits distincts

**Premier site livrable** : parité visuelle approuvée avec Webkernel, layout partagé, pages utiles, formulaire validé côté serveur si nécessaire, assets et configuration emballés, erreurs 404/500, logs/timings, démarrage et arrêt, déploiement Hestia et retour arrière. Peut sortir avant les panels complets; ne pas annoncer alors l'ensemble enterprise comme disponible.

**Framework avec panels** : Core embarqué et panel métier construits sur les mêmes composants/SDUI; deux applications utilisatrices; auth/policies/audit; données/migrations; CLI indépendante du checkout; reprise après incident. Live et modules franchissent ensuite leurs gates propres avant de figer leur API stable.

## Preuves et suivi

Chaque lot tient une entrée : statut (`à faire`, `en cours`, `bloqué`, `livré`), fichiers/commit, vérifications exécutées et résultats, limites, migration et estimation révisée. « Livré » exige le critère de sortie, pas seulement un fichier ou une compilation réussie.

Commandes Cargo depuis la racine : utiliser `--manifest-path _crates/Cargo.toml`. Pour F1/F3, ajouter tests de contrat et compile-fail pertinents; pour F2, génération/test Tree-sitter et contrôle Zed; pour F4+, tests d'intégration et de refus. Aucun test de charge sur une installation de production par défaut.

Références : [langage](../views/LANGUAGE.md), [panels et critères enterprise](../architecture/PANELS_COMPONENTS.md), [Zed](../editor/ZED.md), [standards Rust](../standards/RUST_CODING_STANDARD.md), [décisions historiques](../architecture/DECISIONS.md).
