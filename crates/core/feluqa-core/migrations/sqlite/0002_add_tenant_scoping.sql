CREATE TABLE feluqa_core_tenants (
    id INTEGER PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    created_at_epoch BIGINT NOT NULL
);

INSERT INTO feluqa_core_tenants (id, slug, display_name, created_at_epoch)
VALUES (1, 'default', 'Default tenant', 0);

-- SQLite permits an added REFERENCES column only with a NULL default while
-- foreign-key enforcement is enabled. Backfill existing Core rows immediately;
-- triggers below preserve NOT NULL semantics for all future writes.
ALTER TABLE feluqa_core_users
ADD COLUMN tenant_id INTEGER REFERENCES feluqa_core_tenants(id) ON DELETE RESTRICT;
UPDATE feluqa_core_users SET tenant_id = 1 WHERE tenant_id IS NULL;

CREATE TRIGGER feluqa_core_users_tenant_required_insert
BEFORE INSERT ON feluqa_core_users
WHEN NEW.tenant_id IS NULL
BEGIN
    SELECT RAISE(ABORT, 'feluqa_core_users.tenant_id is required');
END;

CREATE TRIGGER feluqa_core_users_tenant_required_update
BEFORE UPDATE OF tenant_id ON feluqa_core_users
WHEN NEW.tenant_id IS NULL
BEGIN
    SELECT RAISE(ABORT, 'feluqa_core_users.tenant_id is required');
END;

ALTER TABLE feluqa_core_roles
ADD COLUMN tenant_id INTEGER REFERENCES feluqa_core_tenants(id) ON DELETE RESTRICT;
UPDATE feluqa_core_roles SET tenant_id = 1 WHERE tenant_id IS NULL;

CREATE TRIGGER feluqa_core_roles_tenant_required_insert
BEFORE INSERT ON feluqa_core_roles
WHEN NEW.tenant_id IS NULL
BEGIN
    SELECT RAISE(ABORT, 'feluqa_core_roles.tenant_id is required');
END;

CREATE TRIGGER feluqa_core_roles_tenant_required_update
BEFORE UPDATE OF tenant_id ON feluqa_core_roles
WHEN NEW.tenant_id IS NULL
BEGIN
    SELECT RAISE(ABORT, 'feluqa_core_roles.tenant_id is required');
END;

CREATE INDEX feluqa_core_roles_tenant_idx ON feluqa_core_roles(tenant_id, id);

ALTER TABLE feluqa_core_audit_events
ADD COLUMN tenant_id INTEGER REFERENCES feluqa_core_tenants(id) ON DELETE RESTRICT;
UPDATE feluqa_core_audit_events SET tenant_id = 1 WHERE tenant_id IS NULL;

CREATE TRIGGER feluqa_core_audit_tenant_required_insert
BEFORE INSERT ON feluqa_core_audit_events
WHEN NEW.tenant_id IS NULL
BEGIN
    SELECT RAISE(ABORT, 'feluqa_core_audit_events.tenant_id is required');
END;

CREATE TRIGGER feluqa_core_audit_tenant_required_update
BEFORE UPDATE OF tenant_id ON feluqa_core_audit_events
WHEN NEW.tenant_id IS NULL
BEGIN
    SELECT RAISE(ABORT, 'feluqa_core_audit_events.tenant_id is required');
END;

CREATE INDEX feluqa_core_audit_tenant_time_idx
ON feluqa_core_audit_events(tenant_id, occurred_at_epoch, id);

CREATE INDEX feluqa_core_users_tenant_idx ON feluqa_core_users(tenant_id, id);
