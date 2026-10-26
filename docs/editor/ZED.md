# Produit Zed — Feluqa Views

Date : 2026-10-26. Statut : spécification et backlog. L'extension et la grammaire ne sont pas encore implémentées. Leur version de langage suit [le contrat Views](../views/LANGUAGE.md).

## Emplacement prévu

```text
products/feluqa-zed/
├── extension.toml
├── README.md
└── languages/feluqa_view/
    ├── config.toml
    ├── highlights.scm
    ├── injections.scm
    ├── brackets.scm
    ├── indents.scm
    └── outline.scm
products/tree-sitter-feluqa-view/
├── grammar.js
├── tree-sitter.json
├── src/                  # parser généré; scanner externe si nécessaire
├── queries/
└── test/corpus/
```

La grammaire est un outil réutilisable par d'autres éditeurs. Elle ne devient pas une dépendance obligatoire du serveur web. Les requêtes communes ont une source unique; l'extension les embarque via une étape de packaging contrôlée. Ne pas créer de faux manifests publiables avec une URL ou un SHA inventé.

## Intégration Zed

Zed associe une langue via `languages/<langue>/config.toml`. La configuration cible est :

```toml
name = "Feluqa Views"
grammar = "feluqa_view"
path_suffixes = ["view.rs"]
```

`path_suffixes` attend des suffixes, pas des globs. `file_types` appartient aux réglages utilisateur. Vérifier dans Zed que `home.view.rs` sélectionne Feluqa Views et que `main.rs` reste Rust. [Documentation officielle des langues](https://zed.dev/docs/extensions/languages).

`extension.toml` déclare ID `feluqa-views`, nom, version, `schema_version`, auteur El Moumen Yassine et `[grammars.feluqa_view]` avec dépôt et révision Git immuable. Le dépôt réel reste à choisir; en développement Zed permet une URL locale `file://`. Prévoir l'export du sous-dossier de grammaire vers une racine Git consommable par Zed; ne pas supposer que la racine de ce monorepo est une grammaire. Valider la distribution privée et ses accès avant de promettre une installation distante. Pas de publication publique implicite pour ce logiciel propriétaire. [Enregistrement d'une grammaire](https://zed.dev/docs/extensions/languages).

Une extension ne fournissant que grammaire et requêtes n'a pas besoin de crate Rust d'extension. Installer localement via **Install Dev Extension** et inspecter Zed.log; figer la version de Zed utilisée pour la validation. Les grammaires sont compilées avec wasi-sdk, dont Zed peut gérer le téléchargement. Les besoins réseau de ce flux éditeur sont distincts des builds de production Feluqa. [Développement d'extensions](https://zed.dev/docs/extensions/developing-extensions).

## Arbre, coloration et injections

Nœuds cibles : `document`, `html_element`, `component`, `slot`, `static_attribute`, `bound_attribute`, `escaped_expression`, `raw_expression`, `rust_block`, `conditional`, `loop`, `include`, `layout`, `section`, `template_comment`. Leurs noms exacts doivent être gelés avec la première grammaire; les fichiers `.scm` ne doivent jamais référencer de nœuds absents de `node-types.json`.

- `highlights.scm` : directives, balises HTML/composants, délimiteurs, attributs, commentaires et texte.
- `injections.scm` : Rust dans les corps de `@rs` et expressions, HTML dans les régions adaptées; CSS/JS dans les éléments concernés si ces régions sont prises en charge. Délimiteurs exclus des captures d'injection.
- `brackets.scm`, `indents.scm`, `outline.scm` : paires, indentation et navigation dans layouts, sections et composants.
- La coloration injectée ne fournit pas à elle seule la résolution de types ou l'autocomplétion rust-analyzer. Un futur LSP Feluqa utilisera documents Rust virtuels et source maps; c'est un lot distinct.

La grammaire doit accepter les constructions incomplètes pendant la saisie et reprendre après une erreur sans colorer le reste du fichier comme du Rust. Un lexer/scanner conscient des chaînes, raw strings et commentaires Rust est nécessaire pour les frontières de langage. Les règles de séquence, choix et précédence et les scanners externes sont décrits par [Tree-sitter](https://tree-sitter.github.io/tree-sitter/creating-parsers/2-the-grammar-dsl.html).

Le compilateur Feluqa reste l'autorité sémantique. Tree-sitter fournit un arbre incrémental pour l'édition. Les deux implémentations partagent des fixtures et une version de syntaxe; une nouvelle directive doit faire évoluer ensemble contrat, parseur, grammaire, requêtes et exemples.

## Livraison et acceptation

1. Grammaire de texte/HTML, échos, commentaires et `@rs`; corpus valide/incomplet/erroné.
2. Blocs conditionnels, boucles, includes, layouts, composants et slots selon les lots du compilateur.
3. Requêtes chargées sans erreur; génération du parser reproductible, dépendances d'outillage verrouillées.
4. Installation locale réelle dans Zed; vérification de `.view.rs` versus `.rs`, saisie incrémentale, Rust injecté, Unicode, HTML/CSS contenant `@`, et délimiteurs dans chaînes/commentaires.
5. Parité sur le corpus de langage; aucun nœud inconnu dans les queries, aucune capture traversant les limites d'un bloc Rust.
6. Paquet d'extension privé documenté; une publication externe demande une décision explicite de distribution et de licence.

L'extension ne doit être annoncée fonctionnelle qu'après installation et contrôle dans Zed. Un `config.toml` et un `highlights.scm` seuls ne suffisent pas.
