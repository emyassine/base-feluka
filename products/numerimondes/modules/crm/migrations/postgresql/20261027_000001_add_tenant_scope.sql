ALTER TABLE crm_customers
ADD COLUMN tenant_id BIGINT NOT NULL DEFAULT 1
REFERENCES feluqa_core_tenants(id) ON DELETE RESTRICT;

CREATE INDEX crm_customers_tenant_owner_idx
ON crm_customers(tenant_id, owner_user_id, id);
