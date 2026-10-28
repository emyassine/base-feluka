# Macro Crates

This folder contains Rust procedural macros used by Feluqa APIs. Macros turn typed declarations into generated Rust code at compile time. They should validate inputs, produce clear compiler errors and keep generated behavior reproducible.

## Packages in this folder

- `feluqa-console-macros` provides Console command and profile attributes.
- `feluqa-model-derive` provides model-related derives.
- `feluqa-ui-classnames-macros` provides class-name helpers.
- `feluqa-ui-component-macros` supports UI component definitions.
- `feluqa-ui-navigation-macros` supports UI navigation declarations.
- `feluqa-ui-runtime-macros` contains macros used by the UI runtime.
- `feluqa-ui-server-functions-macros` and `feluqa-ui-server-functions-macros-default` support server-function declarations.

Macro crates are separate because they compile and run during the consumer’s build, and often have different dependencies from the runtime code they generate. Keep generated output deterministic and do not make a macro perform runtime work.
