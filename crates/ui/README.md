# UI Crates

UI packages define how products describe, compose and render screens. The selected architecture separates reusable UI meaning from each platform’s rendering details.

## Headless means

The headless layer owns UI state, events, routing and a semantic description of the screen. It does not draw pixels or depend on one operating system’s widget toolkit. A renderer consumes that description and connects user input back to the shared state.

For example, the shared layer can describe a form with labeled fields and a submit action. A web renderer can produce HTML and accessibility attributes; a native shell can map the same meaning to native controls. The interaction and data rules stay reusable while each renderer follows its platform’s conventions.

## Current packages

This checkout has versioned UI schemas in `feluqa-ui`, a separate `feluqa-ui-reactivity` package, the compiled `.view.rs` engine in `feluqa-view`, UI components and macros, and web-oriented runtime/DOM packages. These are the current implementation boundaries; they are not yet the final single headless-core-plus-renderers design.

The complete semantic tree, target-neutral renderer contract and native shell adapters remain future work. Do not describe SwiftUI, Compose, GTK, Qt or WinUI integration as delivered. The web profile is the first target. For its current behavior, see the [web profile guide](../../docs-new/technical/02.architecture/07.web-profile.en.md) and [view language reference](../../docs-new/technical/05.reference/05.view-language.en.md).

Keep business authorization and data access in server services. UI schemas describe presentation; hiding a control is never an authorization check.
