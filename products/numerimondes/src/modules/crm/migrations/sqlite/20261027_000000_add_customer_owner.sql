ALTER TABLE crm_customers
ADD COLUMN owner_user_id INTEGER REFERENCES feluqa_core_users(id) ON DELETE SET NULL;
