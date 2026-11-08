# Feluqa UI

A Vue component library organized by role under `src/`. Reusable components are framework-agnostic at the API boundary; host-specific integration lives in the optional `adapters/vitepress/` entrypoint. Site-owned Numerimondes components live in `docs/site-2/resources/components/`.

The React.dev homepage snapshot is retained under `src/third-party/react-home/` with its source assets and required notices. It is an isolated compatibility/demo artifact, not part of the default library entrypoint.

Import public APIs through `@feluqa/ui` or its `package.json` subpath exports. CSS is available under `@feluqa/ui/styles/*`. Third-party asset and font terms are recorded in `THIRD_PARTY_NOTICES.txt` and adjacent font license files.
