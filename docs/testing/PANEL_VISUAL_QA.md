# Panel visual QA

The system panel must be checked in a browser because its Filament-derived stylesheet hides the main content until a browser runtime reveals it. Rust route tests alone cannot catch that failure.

Run from the repository root:

```sh
./scripts/capture-system-panel.sh /tmp/feluqa-system-panel.png
```

The script runs the authenticated HTTP integration flow, captures the rendered `/system/connections` response, serves it with the framework's CSS and JavaScript assets, and takes Firefox screenshots for the default theme, dark theme, and a 390 px mobile viewport. The mobile capture uses a capture-only stylesheet to hold the drawer open after the shell script initializes; it is a layout snapshot, not a click-interaction test. Verify the sidebar, active route, page heading, searchable database connection table, dark colors, and mobile drawer. It does not start or stop the Numerimondes development server.

The output paths are the requested PNG plus `.dark.png` and `.mobile.png` variants.
