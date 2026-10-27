ALTER TABLE feluqa_core_tenants
ADD COLUMN is_active SMALLINT NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1));

ALTER TABLE feluqa_core_tenants
ADD COLUMN auth_version BIGINT NOT NULL DEFAULT 0;

ALTER TABLE feluqa_core_sessions
ADD COLUMN tenant_auth_version BIGINT NOT NULL DEFAULT 0;
