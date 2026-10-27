CREATE TABLE feluqa_core_users (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    is_active SMALLINT NOT NULL DEFAULT 1,
    auth_version BIGINT NOT NULL DEFAULT 0,
    created_at_epoch BIGINT NOT NULL,
    updated_at_epoch BIGINT NOT NULL
);

CREATE TABLE feluqa_core_roles (
    id BIGSERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    is_system SMALLINT NOT NULL DEFAULT 0,
    created_at_epoch BIGINT NOT NULL
);

CREATE TABLE feluqa_core_permissions (
    id BIGSERIAL PRIMARY KEY,
    role_id BIGINT NOT NULL,
    permission TEXT NOT NULL,
    UNIQUE (role_id, permission),
    FOREIGN KEY (role_id) REFERENCES feluqa_core_roles(id) ON DELETE CASCADE
);

CREATE TABLE feluqa_core_user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    assigned_at_epoch BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES feluqa_core_users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES feluqa_core_roles(id) ON DELETE CASCADE
);

CREATE TABLE feluqa_core_sessions (
    id TEXT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    csrf_hash TEXT NOT NULL,
    auth_version BIGINT NOT NULL,
    expires_at_epoch BIGINT NOT NULL,
    created_at_epoch BIGINT NOT NULL,
    last_seen_at_epoch BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES feluqa_core_users(id) ON DELETE CASCADE
);

CREATE INDEX feluqa_core_sessions_expiry_idx ON feluqa_core_sessions(expires_at_epoch);
CREATE INDEX feluqa_core_sessions_user_idx ON feluqa_core_sessions(user_id);

CREATE TABLE feluqa_core_audit_events (
    id BIGSERIAL PRIMARY KEY,
    actor_user_id BIGINT,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    record_key TEXT,
    outcome TEXT NOT NULL,
    request_id TEXT,
    occurred_at_epoch BIGINT NOT NULL,
    FOREIGN KEY (actor_user_id) REFERENCES feluqa_core_users(id) ON DELETE SET NULL
);

CREATE INDEX feluqa_core_audit_time_idx ON feluqa_core_audit_events(occurred_at_epoch);
CREATE INDEX feluqa_core_audit_actor_idx ON feluqa_core_audit_events(actor_user_id);

CREATE TABLE feluqa_core_settings (
    setting_key TEXT PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at_epoch BIGINT NOT NULL
);

INSERT INTO feluqa_core_settings (setting_key, setting_value, updated_at_epoch)
VALUES ('bootstrap_state', 'pending', 0);
