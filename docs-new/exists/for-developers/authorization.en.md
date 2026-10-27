# Authorize users and actions

## Treat authorization as server behavior

Panel navigation and UI visibility help users find available features; they
never protect an endpoint. Every route, resource operation, field and record
must be authorized again on the server.

Feluqa's current authorization model uses exact grants and a `Principal`
bound to a session and tenant. Resource authorization can return the operation
allowed, record scope, and readable/writable fields. Resource handlers must
apply record ownership and field grants to database queries and form rendering.

## Protect custom handlers

For a custom route or action, validate the session and CSRF token for a
state-changing request, resolve the caller's grants, apply tenant and record
scope in the service/query, validate input, then record sensitive changes in
the audit log. Return a denial when any check fails. Do not trust IDs, hidden
fields, client snapshots or a link being absent from navigation.

## Separate authority scopes

Platform operators manage the Feluqa installation. Domain administrators
manage only the domain capabilities granted to them. Business users receive
module-specific access. A domain administrator must not become server-level
authority.

Current tests cover CSRF, role delegation, session revocation, tenant
isolation, record ownership and field-level CRM access. Full resource-driven
actions and dynamic module entitlement/license checks remain work in progress.
