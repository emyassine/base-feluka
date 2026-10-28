# Add a panel resource and page

## Use the panel system Feluqa provides

Feluqa owns the panel framework, System panel, shared shell and component
assets. A module registers its resources and pages with Feluqa panel instances;
it does not ship a separate panel framework. A module can contribute an
administration panel, a public website panel, or both.

The existing `.view.rs` catalog includes `x-feluqa::button` and
`x-feluqa::field`. They are legacy server-rendered components and still use
legacy panel implementation-derived classes; they are not the target component API. New panel UI
work follows the [Feluqa UI component contract](../../knowledge/architecture/feluqa-ui.en.md),
which is still being implemented. Do not treat the source move as a completed
panel migration.

## Resources

A resource describes a business record, its fields and columns, operations,
and access policy. The intended short declaration gives a module standard
list/create/view/edit CRUD pages, schema-driven forms, tables, navigation and
permission checks. A resource can be assigned to a navigation cluster or left
unclustered. It may also add custom pages and widgets.

## Pages and widgets

Use a page for a dashboard, workflow or content surface that does not fit
standard CRUD. A page may use compiled `.view.rs` fragments, SDUI schemas and
widgets. User views provide page content; Feluqa owns the document shell and
panel layout.

Schema-backed dashboard widgets can be registered with
`PanelBuilder::widget` / `widgets`. Each `PanelWidget` has a stable ID, an
optional permission, sort order, column span/start and a versioned `UiDocument`.
`PanelCatalog::render_widgets` filters by permission and returns escaped HTML
using the current panel grid contract adapted from Webkernel's renderer.
The current Feluqa Core and Numerimondes dashboard controllers render the
registered panel widget collection into their dashboard slot after page access
and widget permissions are checked. Other panel hosts must authorize the page
and place this output themselves. Automatic page header/footer and resource
widget slots are still in progress.

## What is implemented

The current panel registry validates page/resource paths and permissions.
Implementation status and remaining gaps are tracked in the dedicated
[panel port inventory](../reference/../for-developers/panels-resources-and-pages.en.md).

Next: [store data and run migrations](data-and-migrations.en.md).
