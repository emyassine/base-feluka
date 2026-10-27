#![no_implicit_prelude]
#![deny(unsafe_code)]

use crate::app::services::panel::PanelState;
use crate::axum::extract::OriginalUri;
use crate::feluqa;
use crate::std::convert::From;
use crate::std::format;
use crate::std::iter::IntoIterator;
use crate::std::iter::Iterator;
use crate::std::matches;
use crate::std::option::Option;
use crate::std::option::Option::{None, Some};
use crate::std::result::Result;
use crate::std::result::Result::{Err, Ok};
use crate::std::string::String;
use crate::std::string::ToString;
use crate::std::time::{SystemTime, UNIX_EPOCH};
use crate::std::vec::Vec;
use crate::subtle::ConstantTimeEq;
use crate::views;
use feluqa::auth::{Permission, PermissionSetAuthorizer, Principal};
use feluqa::core::entities::audit_event;
use feluqa::core::service::SessionIdentity;
use feluqa::core::store::SecretToken;
use feluqa::database::MigrationRunner;
use feluqa::database::orm::{ColumnTrait, EntityTrait, QueryFilter, QueryOrder, QuerySelect};
use feluqa::prelude::*;

mod authentication;
pub use self::authentication::*;
mod dashboard;
pub use self::dashboard::*;
mod live;
pub use self::live::*;
mod users;
pub use self::users::*;
mod roles;
pub use self::roles::*;
mod operations;
pub use self::operations::*;

mod live_support;
use self::live_support::*;
mod rendering;
pub(crate) use self::rendering::render_dashboard;
use self::rendering::*;
mod access;
pub(crate) use self::access::protected_customer_page;
pub(crate) use self::access::protected_registered_page;
pub(crate) use self::access::registered_panel_navigation;
use self::access::*;
mod security;
pub(crate) use self::security::session_csrf_valid;
use self::security::*;

const LOGIN_CSRF_COOKIE: &str = "feluqa_login_csrf";
const SESSION_COOKIE: &str = "feluqa_session";
const CSRF_COOKIE: &str = "feluqa_csrf";

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct LoginForm {
    csrf_token: String,
    email: String,
    password: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct SetupForm {
    csrf_token: String,
    display_name: String,
    email: String,
    password: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct CsrfForm {
    csrf_token: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct CreateTenantForm {
    csrf_token: String,
    slug: String,
    display_name: String,
    owner_name: String,
    owner_email: String,
    owner_password: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct SetTenantActiveForm {
    csrf_token: String,
    tenant_id: i64,
    active: bool,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct CreateUserForm {
    csrf_token: String,
    display_name: String,
    email: String,
    password: String,
    role_id: i64,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct SetUserActiveForm {
    csrf_token: String,
    user_id: i64,
    active: bool,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct SetUserRoleForm {
    csrf_token: String,
    user_id: i64,
    role_id: i64,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct UpdateUserRoleForm {
    csrf_token: String,
    id: i64,
    role_id: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct LiveSnapshotQuery {
    revision: u64,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct CreateRoleForm {
    csrf_token: String,
    slug: String,
    display_name: String,
    permissions: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub(crate) struct UpdateRoleForm {
    csrf_token: String,
    id: i64,
    permissions: String,
}

#[cfg(test)]
mod tests {
    use super::{cookie, cookie_value};
    use crate::axum::http::header::COOKIE;
    use crate::axum::http::{HeaderMap, HeaderValue};
    use crate::std::assert;
    use crate::std::assert_eq;
    use crate::std::option::Option::None;

    #[test]
    fn production_cookies_are_secure_and_csrf_cookie_is_script_readable() {
        let session = cookie_value("feluqa_session", "token", true, true, 28_800);
        assert!(session.contains("; HttpOnly"));
        assert!(session.contains("; Secure"));
        assert!(session.contains("; SameSite=Strict"));

        let csrf = cookie_value("feluqa_csrf", "token", false, true, 28_800);
        assert!(csrf.contains("; Secure"));
        assert!(csrf.contains("; SameSite=Strict"));
        assert!(!csrf.contains("HttpOnly"));
    }

    #[test]
    fn duplicate_cookie_names_are_rejected() {
        let mut headers = HeaderMap::new();
        headers.insert(
            COOKIE,
            HeaderValue::from_static("feluqa_session=first; feluqa_session=second"),
        );
        assert_eq!(cookie(&headers, "feluqa_session"), None);
    }
}
