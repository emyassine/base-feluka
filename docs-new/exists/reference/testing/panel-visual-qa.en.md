# Panel visual QA

The system panel must be checked in a browser because its legacy panel implementation-derived stylesheet hides the main content until a browser runtime reveals it. Rust route tests alone cannot catch that failure.

Run from the repository root:

```sh
./scripts/capture-system-panel.sh /tmp/feluqa-system-panel.png
```

The script runs the authenticated HTTP integration flow, captures the rendered `/system/connections` and `/system/users` responses, serves them with the framework's CSS and JavaScript assets, and takes Firefox screenshots of connections in light/dark and mobile layouts and Users in light/dark. The mobile capture uses a capture-only stylesheet to hold the drawer open after the shell script initializes; it is a layout snapshot, not a click-interaction test. Verify the sidebar, active route, page heading, tables, account forms, dark colors, and mobile drawer. It does not start or stop a development server.

The output paths are the requested PNG plus `.dark.png`, `.mobile.png`, `.users.png`, and `.users.dark.png` variants.
