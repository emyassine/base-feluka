## Les trois niveaux

1. **Workspace source de Feluqa** : le dépôt qui développe le framework.
2. **Workspace développeur** : un dépôt qui utilise Feluqa et peut gérer un ou plusieurs modules. Il peut être un monorepo, mais ce n’est pas le monorepo du framework.
3. **Package Feluqa** : une crate du framework ou un module développé avec lui.

Le `.feluqa/workspace.toml` identifie le rôle du workspace.
L’attribut identifie les packages qui doivent avoir un `feluqa.toml`.

### Workspace du framework Feluqa

À la racine du dépôt, dans `.feluqa/workspace.toml` :

```toml
[workspace]
kind = "framework"
name = "feluqa"
crates = "crates"
products = "products"
tools = "tools"
git = "https://github.com/emyassine/base-feluka.git"
```

### Workspace d’un développeur

À la racine de son dépôt, même s’il gère plusieurs modules :

```toml
[workspace]
kind = "developer"
modules = ["modules/*"]
```

Ce dépôt peut aussi contenir d’autres dossiers; il n’a pas à adopter les chemins `crates/` et `products/` de Feluqa.

### Package du framework

Dans un item de la crate, par exemple `crates/core/feluqa-core/src/lib.rs` :

```rust
#[feluqa(kind = "crate")]
pub struct FeluqaPackage;
```

Son `feluqa.toml` est à côté du `Cargo.toml` de `feluqa-core`.

### Package module

Dans `modules/inventory/src/main.rs` :

```rust
#[feluqa(kind = "module")]
fn main() {}
```

Son `feluqa.toml` est à côté du `Cargo.toml` du module.

`tools/feluqa-build` n’utilise aucun de ces deux kinds et n’a donc pas besoin de l’attribut.

## Vérification à la compilation

L’attribut peut appeler un validateur au moment de la compilation. Ce validateur lit `feluqa.toml` à la racine du package, vérifie son contenu imbriqué et contrôle les relations entre les champs. `syn` sert à lire `kind`; il faut un parseur TOML et une validation dédiée pour le fichier.

Je garderais `version` dans Cargo. Le champ `git` du workspace peut désigner le dépôt source. Je ne garderais `tree = "1.x.x"` que si on définit exactement ce que `tree` signifie pour l’outil de split. La compilation de `feluqa-build` seule ne nécessite pas `feluqa.toml`; le contrôle s’applique aux packages marqués `crate` ou `module`.
