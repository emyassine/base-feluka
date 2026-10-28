CREATE TABLE feluqa_core_tenants (
    id BIGSERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    created_at_epoch BIGINT NOT NULL
);

INSERT INTO feluqa_core_tenants (id, slug, display_name, created_at_epoch)
VALUES (1, 'default', 'Default tenant', 0);

ALTER TABLE feluqa_core_users
ADD COLUMN tenant_id BIGINT NOT NULL DEFAULT 1
REFERENCES feluqa_core_tenants(id) ON DELETE RESTRICT;

ALTER TABLE feluqa_core_roles
ADD COLUMN tenant_id BIGINT NOT NULL DEFAULT 1
REFERENCES feluqa_core_tenants(id) ON DELETE RESTRICT;

CREATE INDEX feluqa_core_roles_tenant_idx ON feluqa_core_roles(tenant_id, id);

ALTER TABLE feluqa_core_audit_events
ADD COLUMN tenant_id BIGINT NOT NULL DEFAULT 1
REFERENCES feluqa_core_tenants(id) ON DELETE RESTRICT;

CREATE INDEX feluqa_core_audit_tenant_time_idx
ON feluqa_core_audit_events(tenant_id, occurred_at_epoch, id);

CREATE INDEX feluqa_core_users_tenant_idx ON feluqa_core_users(tenant_id, id);

SELECT setval(pg_get_serial_sequence('feluqa_core_tenants', 'id'), 1, true);
