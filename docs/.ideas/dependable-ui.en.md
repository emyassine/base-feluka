## A portable UI library: `dependable-ui`

Another compatibility question is whether Feluqa's UI components can be
reusable across plain HTML, Vue, Feluqa, and PHP/Laravel applications. The
working goal is **define the design and component contract once, then provide
small host-specific integrations**.

One possible package family:

```text
dependable-ui/
├── tokens/       # colors, spacing, typography, themes
├── styles/       # shared CSS and component classes
├── assets/       # icons, fonts, and static files
├── schemas/      # versioned, framework-neutral component descriptions
├── behaviors/    # interaction and accessibility rules
└── packages/
    ├── html/     # markup patterns and optional JavaScript
    ├── vue/      # Vue components
    ├── rust/     # Feluqa integration
    └── laravel/  # PHP/Laravel rendering helpers
```

Component families could include actions, forms, infolists, notifications,
query builders, tables, and widgets. These names describe reusable UI
capabilities; they need not map one-to-one to directories in the final package.

The portable source can include design tokens, CSS, icons, schemas, and
framework-neutral behavioral requirements. Host packages translate those
definitions into the native model of each environment: HTML markup, Vue props
and events, Laravel rendering helpers, or Feluqa's UI component system. A
shared form-field definition, for example, could specify its label, help text,
input kind, validation state, disabled state, and accessibility relationships.

The integrations can share appearance and behavior without having identical
APIs or sharing one implementation. Vue, PHP, and Feluqa have different
rendering models and lifecycles. Calling the library "100% portable" would
hide those differences; the more practical goal is one canonical design system
and component contract with small, predictable adapters.

Two possible sources of truth deserve exploration:

1. **Schemas as the canonical source.** Define component structure, properties,
   states, and accessibility requirements in versioned schemas; render or
   generate host-specific adapters from them.
2. **Web assets as the canonical source.** Treat HTML/CSS/JavaScript as the
   reference implementation; let Vue, Laravel, and Feluqa wrap or invoke it.

Feluqa's existing UI-schema direction may make the first option a natural fit,
but it should be tested against real components. A useful small experiment is
to define a button or form field once and show how the same definition is
rendered in plain HTML, Vue, Laravel, and Feluqa. Compare how much code must be
duplicated, how native each integration feels, and how accessibility and
versioning are kept consistent.

This is an idea, not a settled package architecture. The desired promise is
reuse of design, assets, contracts, and behavior—not the claim that one source
file can directly implement every framework's components.
