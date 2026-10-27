# Produit Zed — Feluqa Views

Date : 2026-10-26. Statut : grammaire Tree-sitter, parser généré, corpus initial, requêtes Zed et script de génération d’une extension locale implémentés. L’installation et la vérification dans l’éditeur restent à faire. Leur version de langage suit [le contrat Views](../views/LANGUAGE.md).

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

La grammaire est un outil réutilisable par d'autres éditeurs. Elle n’est pas une dépendance du serveur web. Les sources sont sous `products/tree-sitter-feluqa-view`; les requêtes embarquées sous `products/feluqa-zed/languages/feluqa_view`. Leur duplication contrôlée dans l’extension est actuellement manuelle. Ne pas créer de faux manifests publiables avec une URL ou un SHA inventé.

## Intégration Zed

Zed associe une langue via `languages/<langue>/config.toml`. La configuration cible est :

```toml
name = "Feluqa Views"
grammar = "feluqa_view"
path_suffixes = ["view.rs"]
```

`path_suffixes` attend des suffixes, pas des globs. `file_types` appartient aux réglages utilisateur. Vérifier dans Zed que `home.view.rs` sélectionne Feluqa Views et que `main.rs` reste Rust. [Documentation officielle des langues](https://zed.dev/docs/extensions/languages).

`extension.toml` déclare ID `feluqa-views`, nom, version, `schema_version`, auteur El Moumen Yassine et `[grammars.feluqa_view]` avec dépôt et révision Git immuable. Le dépôt réel reste à choisir; en développement Zed permet une URL locale `file://`. Prévoir l'export du sous-dossier de grammaire vers une racine Git consommable par Zed; ne pas supposer que la racine de ce monorepo est une grammaire. Valider la distribution privée et ses accès avant de promettre une installation distante. Pas de publication publique implicite pour ce logiciel propriétaire. [Enregistrement d'une grammaire](https://zed.dev/docs/extensions/languages).

Une extension ne fournissant que grammaire et requêtes n'a pas besoin de crate Rust d'extension. `products/feluqa-zed/install-dev.sh` génère le parser, crée un dépôt local de grammaire avec son vrai commit, assemble l’extension sous `target/`, puis ouvre ce dossier dans Zed. Dans l’éditeur, utiliser **Install Dev Extension** et sélectionner ce dossier. L’installation et l’inspection de Zed.log restent à effectuer; figer la version de Zed lors de cette validation. Les grammaires sont compilées avec wasi-sdk, dont Zed peut gérer le téléchargement. Les besoins réseau de ce flux éditeur sont distincts des builds de production Feluqa. [Développement d'extensions](https://zed.dev/docs/extensions/developing-extensions).

## Arbre, coloration et injections

Nœuds cibles : `document`, `html_element`, `component`, `slot`, `static_attribute`, `bound_attribute`, `escaped_expression`, `raw_expression`, `rust_block`, `conditional`, `loop`, `include`, `layout`, `section`, `template_comment`. Leurs noms exacts doivent être gelés avec la première grammaire; les fichiers `.scm` ne doivent jamais référencer de nœuds absents de `node-types.json`.

- `highlights.scm` : directives, balises HTML/composants, délimiteurs, attributs, commentaires et texte.
- `injections.scm` : Rust dans les corps de `@rs` et expressions, HTML dans les régions adaptées; CSS/JS dans les éléments concernés si ces régions sont prises en charge. Délimiteurs exclus des captures d'injection.
- `brackets.scm`, `indents.scm`, `outline.scm` : paires, indentation et navigation dans layouts, sections et composants.
- La coloration injectée ne fournit pas à elle seule la résolution de types ou l'autocomplétion rust-analyzer. Un futur LSP Feluqa utilisera documents Rust virtuels et source maps; c'est un lot distinct.

La grammaire doit accepter les constructions incomplètes pendant la saisie et reprendre après une erreur sans colorer le reste du fichier comme du Rust. Un lexer/scanner conscient des chaînes, raw strings et commentaires Rust est nécessaire pour les frontières de langage. Les règles de séquence, choix et précédence et les scanners externes sont décrits par [Tree-sitter](https://tree-sitter.github.io/tree-sitter/creating-parsers/2-the-grammar-dsl.html).

Le compilateur Feluqa reste l'autorité sémantique. Tree-sitter fournit un arbre incrémental pour l'édition. Les deux implémentations partagent des fixtures et une version de syntaxe; une nouvelle directive doit faire évoluer ensemble contrat, parseur, grammaire, requêtes et exemples.

## Livraison et acceptation

1. **Fait :** grammaire HTML/template, échos, commentaires, blocs Rust, directives, layouts, composants et slots; parser généré et tests Tree-sitter initiaux.
2. **Fait :** requêtes Zed pour coloration et injections Rust; paquet local reproductible avec commit de grammaire calculé.
3. **À vérifier dans Zed :** installation dev, sélection `.view.rs` sans intercepter `.rs`, saisie incrémentale, Rust injecté, Unicode, CSS contenant `@` et délimiteurs dans chaînes/commentaires.
4. **À compléter :** corpus partagé compilateur/Tree-sitter, fichiers d’indentation/navigateur, davantage de cas incomplets et affichage des diagnostics.
5. Paquet d’extension privé documenté; une publication externe demande une décision explicite de distribution et de licence.

L'extension ne doit être annoncée fonctionnelle qu'après installation et contrôle dans Zed. Un `config.toml` et un `highlights.scm` seuls ne suffisent pas.
