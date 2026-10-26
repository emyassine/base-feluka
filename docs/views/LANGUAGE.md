# Feluqa Views — contrat v1

Date : 2026-10-26. Statut : cible acceptée pour l'implémentation, pas une description des capacités actuelles. Le moteur livré ne reconnaît encore que texte et substitutions nommées dans des fichiers `.view`.

## Format et compilation

Le format canonique est **`.view.rs`**, inspiré des vues Webkernel/Blade : HTML, directives `@...`, expressions Rust et composants. Ce fichier est un langage de template, pas un module Rust directement accepté par rustc. Il reste sous `resources/views/`; le compilateur génère des modules Rust sous `OUT_DIR`. Aucun `mod` ne doit charger directement le template.

Les vues appartiennent explicitement à une application, une bibliothèque ou un module. Chaque propriétaire enregistre une racine et un namespace, par exemple `app::pages.home` ou `feluqa::layouts.panel`. Le registre résout ces noms à la construction; pas de scan des modules à chaque requête. Les surcharges sont explicites, les doublons ambigus sont des erreurs.

Le futur pipeline est : découverte déclarée → lexer avec positions → AST → résolution des includes/layouts/composants → validation des expressions Rust → génération Rust → rustc. Les fonctions de rendu reçoivent un contexte typé, des props et un writer. Serde sert aux schémas/configurations et aux frontières réseau; il ne remplace pas le typage du rendu par une map de chaînes.

## Syntaxe cible

Les exemples suivants sont des spécifications, pas des fichiers actuellement exécutables.

```text
@extends("app::layouts.main")
@section("content")
    @rs
        let heading = page.title.trim();
    @endrs

    <x-feluqa::section :title="heading">
        <x-slot name="actions">
            <x-feluqa::button href="/contact">Contact</x-feluqa::button>
        </x-slot>
        @include("app::partials.intro", intro = &page.intro)
        @if (!page.items.is_empty())
            @foreach (item in &page.items)
                <p>{{ item.label }}</p>
            @endforeach
        @else
            <p>Aucun élément.</p>
        @endif
    </x-feluqa::section>
@endsection
```

| Construction | Contrat v1 |
|---|---|
| `{{ expression }}` | Expression Rust typée, sortie texte échappée HTML. |
| `{!! expression !!}` | Accepte seulement un type `TrustedHtml`; conversion depuis une chaîne arbitraire interdite par défaut. |
| `{{-- commentaire --}}` | Commentaire de template absent de la sortie. |
| `@@` | Caractère `@` littéral. Les adresses e-mail et le CSS `@media` restent du texte; seules les directives réservées sont reconnues. |
| `@rs` / `@endrs` | Instructions Rust locales compilées; variables visibles dans la portée lexicale englobante qui suit le bloc. |
| `@if (condition)` / `@elseif (...)` / `@else` / `@endif` | Conditions booléennes Rust, blocs correctement imbriqués. |
| `@foreach (pattern in iterable)` / `@endforeach` | Itération Rust; pas de `$` ni de syntaxe PHP `as`. Pas de consommation anticipée d'un itérateur pour calculer sa longueur. |
| `@include("namespace::name", prop = expr)` | Vue statiquement connue, props explicitement transmises et typées; aucune copie implicite de toutes les variables parentes. |
| `@extends("namespace::layout")` | Un parent statique par vue, cycles interdits. |
| `@section("name")` / `@endsection`, `@yield("name")` | Sections déclarées et points d'insertion; section absente vide sauf déclaration requise par le layout. |
| `<x-namespace::component ... />` | Composant nommé à la compilation, props typées et attributs HTML séparés. |
| `<x-slot name="name">...</x-slot>` | Slot nommé dans la portée du parent; contenu hors slot = slot par défaut. |

V1.1 : `@forelse/@empty/@endforelse`, métadonnées de boucle sans forcer le comptage, `@push/@stack`, `@once`, Markdown, directives de présentation `@auth/@guest/@can`, hooks différés et variants. Chaque ajout exige une grammaire et des tests; aucune directive inconnue ne doit être silencieusement interprétée comme du Rust.

## Rust embarqué et délimiteurs

`@rs` contient du code de développeur de confiance, avec les droits du processus. Ce n'est pas un bac à sable. Les utilisateurs du panel éditent des données, du Markdown assaini ou des schémas autorisés; ils ne soumettent pas du Rust à compiler.

Les imports sont déclarés explicitement dans le contrat de vue ou dans le code Rust propriétaire. Le code généré conserve `#![no_implicit_prelude]` et les lints du projet. Les blocs `@rs` servent à préparer la présentation; accès DB, autorisation et effets métier appartiennent aux services.

Le lexer doit distinguer chaînes normales, raw strings Rust `r#"..."#`, caractères, lifetimes et commentaires Rust imbriqués. `@endrs`, `}}` ou `)` à l'intérieur d'une chaîne/commentaire ne ferme pas la construction. Les expressions et parenthèses s'équilibrent. Un découpage par simple regex ou `find("}}")` est insuffisant. `syn`/`proc-macro2` sont à évaluer pour les fragments Rust, après verrouillage des versions et compatibilité MSRV.

## Composants, slots et sécurité du rendu

- Les props obligatoires, types, valeurs par défaut et slots acceptés sont déclarés côté Rust. Props inconnues : erreur, sauf attributs HTML explicitement admis.
- `title="texte"` est statique; `:title="page.title"` est une expression. Les attributs booléens sont sérialisés selon HTML, les classes fusionnées de façon déterministe, sans doublons d'attributs.
- Un `AttributeBag` sérialise et échappe les valeurs. Les URLs ont une politique de schémas; les attributs d'événement arbitraires et les contextes JS/CSS ne sont pas sécurisés par le seul échappement HTML. Interpolation dans ces contextes interdite en v1 sans encodeur dédié.
- Chaque slot s'évalue dans un contexte lexical défini; sa cardinalité d'évaluation est documentée. Aucun marqueur de substitution interne ne doit apparaître dans le HTML final.
- Résolution confinée aux racines enregistrées; pas de traversée `../`, pas de nom de vue dérivé librement d'une requête. Cycles et profondeur maximale signalés avec la chaîne des dépendances.
- Les caches de compilation contiennent du code/AST. Le cache HTML exige une politique séparée tenant compte de l'utilisateur, tenant, locale et autorisations; pas de gel des décisions d'accès dans une vue précompilée.

## Développement et production

Production : compilation obligatoire; le binaire embarque les vues compilées et n'a besoin ni de rustc ni des sources de templates pour servir. Un bundle de déploiement inclut séparément les assets publics et la configuration nécessaires.

Développement v1 : `feluqa dev` observe le graphe des sources et dépendances, recompile puis redémarre proprement. Une erreur conserve le dernier processus valide et affiche fichier, ligne, colonne et extrait. Mesurer le délai réel, sans promettre un rechargement inférieur à une seconde avant mesure.

Un moteur de développement interprété peut être étudié pour un sous-ensemble déclaratif. Il doit partager AST et corpus de rendu avec le compilateur; il ne peut pas exécuter arbitrairement `@rs` sans compilateur ou runtime supplémentaire. La compilation native reste le chemin de référence pour cette syntaxe.

## Migration Webkernel et état courant

Référence inspectée : `AGENTS_VIEWS.md`, `system-panel/resources/views/home.view.php` et `website-panel/resources/views/pages.view.php` du checkout Webkernel. Ils établissent notamment les composants namespacés, props dynamiques, auth/policies, includes/layouts et composition de formulaires. La similarité de syntaxe ne constitue pas une compatibilité automatique PHP/Rust.

Le lot initial doit inventorier les directives réellement utilisées dans les sources Webkernel, exclure ses caches générés, puis classer chaque occurrence : v1, v1.1, conversion manuelle, rejet explicite. Remplacer `@php/@endphp` par `@rs/@endrs` implique de porter le code PHP, pas de renommer les délimiteurs seulement.

Migration actuelle à réaliser ensemble : renommer `home.view` et `about.view` → `.view.rs`; traiter le suffixe complet plutôt que `Path::file_stem`; découverte récursive déterministe sous racines déclarées; IDs stables pour sous-dossiers; invalidation des includes/slots/layouts; source maps; mise à jour du générateur CLI et des exemples. Aucun fichier ne doit être renommé seul si le build ne sait pas encore le charger.

Acceptation : corpus couvrant imbrication, includes cycliques, props manquantes, Unicode, délimiteurs dans chaînes/commentaires, XSS, défauts de slots et parité HTML debug/release. Un exemple contenant `@rs`, layout, include et composant doit réellement compiler avant de déclarer cette syntaxe livrée.
