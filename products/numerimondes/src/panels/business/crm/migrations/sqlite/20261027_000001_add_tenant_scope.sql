-- SQLite requires a NULL default when adding a REFERENCES column with foreign
-- keys enabled. Backfill existing CRM rows and use triggers to preserve the
-- required tenant invariant for future inserts and updates.
ALTER TABLE crm_customers
ADD COLUMN tenant_id INTEGER REFERENCES feluqa_core_tenants(id) ON DELETE RESTRICT;

UPDATE crm_customers
SET tenant_id = 1
WHERE tenant_id IS NULL;

CREATE TRIGGER crm_customers_tenant_required_insert
BEFORE INSERT ON crm_customers
WHEN NEW.tenant_id IS NULL
BEGIN
    SELECT RAISE(ABORT, 'crm_customers.tenant_id is required');
END;

CREATE TRIGGER crm_customers_tenant_required_update
BEFORE UPDATE OF tenant_id ON crm_customers
WHEN NEW.tenant_id IS NULL
BEGIN
    SELECT RAISE(ABORT, 'crm_customers.tenant_id is required');
END;

CREATE INDEX crm_customers_tenant_owner_idx
ON crm_customers(tenant_id, owner_user_id, id);
