#[cfg(test)]
mod panel_http_tests {
    use crate::app::services::panel::PanelState;
    use crate::axum::body::{Body, to_bytes};
    use crate::axum::http::header::{CONTENT_TYPE, COOKIE, HOST, ORIGIN, SET_COOKIE};
    use crate::axum::http::{HeaderMap, HeaderValue, Method, Request, StatusCode};
    use crate::feluqa;
    use crate::routes::web;
    use crate::std::assert;
    use crate::std::assert_eq;
    use crate::std::boxed::Box;
    use crate::std::clone::Clone;
    use crate::std::convert::From;
    use crate::std::convert::Into;
    use crate::std::default::Default;
    use crate::std::error::Error;
    use crate::std::format;
    use crate::std::io::Error as IoError;
    use crate::std::iter::IntoIterator;
    use crate::std::iter::Iterator;
    use crate::std::matches;
    use crate::std::option::Option;
    use crate::std::option::Option::{None, Some};
    use crate::std::result::Result;
    use crate::std::result::Result::Err;
    use crate::std::result::Result::Ok;
    use crate::std::string::String;
    use crate::std::string::ToString;
    use crate::tokio;
    use crate::tower::ServiceExt;
    use feluqa::core::entities::{audit_event, permission, role, tenant, user, user_role};
    use feluqa::core::service::CoreStore;
    use feluqa::core::store::hash_password;
    use feluqa::database::orm::EntityTrait;
    use feluqa::database::orm::{ActiveModelTrait, ActiveValue::Set};
    use feluqa::database::{DatabasePools, DatabaseSettings, MigrationRunner};
    use feluqa::panel::{Panel, PanelKind};

    #[tokio::test]
    async fn core_setup_login_csrf_panels_and_logout_work_over_http() -> Result<(), Box<dyn Error>>
    {
        run_core_crm_http("[connections.default]\nurl = \"sqlite::memory:\"\nmax_connections = 1\n")
            .await
    }

    #[tokio::test]
    #[ignore = "requires a disposable PostgreSQL database in FELUQA_TEST_POSTGRES_URL"]
    async fn core_setup_login_csrf_panels_and_crm_access_work_over_postgresql()
    -> Result<(), Box<dyn Error>> {
        run_core_crm_http(
            "[connections.default]\nurl_env = \"FELUQA_TEST_POSTGRES_URL\"\nmax_connections = 4\n",
        )
        .await
    }

    async fn run_core_crm_http(database_settings: &str) -> Result<(), Box<dyn Error>> {
        let settings = DatabaseSettings::from_toml(database_settings)?;
        let databases = DatabasePools::connect(&settings).await?;
        MigrationRunner::run_module(&databases, "default", &feluqa::core::MIGRATIONS).await?;
        MigrationRunner::run_module(
            &databases,
            "default",
            &crate::generated_migrations::crm::MIGRATIONS,
        )
        .await?;
        let mut module_runtime =
            crate::modules::lifecycle_runtime(&[String::from("numerimondes.crm")])?;
        module_runtime.start()?;
        let active_modules = module_runtime.started_modules().to_vec();
        let database = databases.default_connection()?.clone();
        let core = CoreStore::new(database.clone())?;
        let staff_hash = hash_password("regularuserpassword")?;
        user::ActiveModel {
            tenant_id: Set(1),
            email: Set(String::from("staff@numerimondes.com")),
            display_name: Set(String::from("Staff member")),
            password_hash: Set(staff_hash),
            is_active: Set(1),
            auth_version: Set(0),
            created_at_epoch: Set(1),
            updated_at_epoch: Set(1),
            ..Default::default()
        }
        .insert(&database)
        .await?;
        assert!(core.bootstrap_pending().await?);
        assert!(crate::views::generated_views::core_setup("csrf", "notice").is_ok());
        let mut catalog = crate::modules::panel_catalog()?;
        catalog.register_panel(Panel::single_page(
            "reports",
            "Reports",
            "/admin/reports",
            PanelKind::Business,
            "business.erp.manage",
            "Generated <panel> content",
        )?)?;
        let app = web::routes(
            PanelState::new(
                core.clone(),
                database.clone(),
                databases.clone(),
                catalog,
                Some(crate::modules::live::runtime(crate::std::vec![3; 32])?),
                false,
            )
            .with_active_modules(active_modules),
        );

        let panel_css = send(&app, Method::GET, "/assets/feluqa/theme.css", None, "").await?;
        assert_eq!(panel_css.status(), StatusCode::OK);
        assert_eq!(
            panel_css
                .headers()
                .get(CONTENT_TYPE)
                .and_then(|value| value.to_str().ok()),
            Some("text/css; charset=utf-8")
        );
        let adapter_css = send(&app, Method::GET, "/assets/feluqa/panel.css", None, "").await?;
        assert_eq!(adapter_css.status(), StatusCode::OK);
        assert_eq!(
            adapter_css
                .headers()
                .get(CONTENT_TYPE)
                .and_then(|value| value.to_str().ok()),
            Some("text/css; charset=utf-8")
        );
        let panel_js = send(&app, Method::GET, "/assets/feluqa/panel.js", None, "").await?;
        assert_eq!(panel_js.status(), StatusCode::OK);
        let shell_js = send(&app, Method::GET, "/assets/feluqa/shell.js", None, "").await?;
        assert_eq!(shell_js.status(), StatusCode::OK);
        let shell_source = body_text(shell_js).await?;
        assert!(shell_source.contains("classList.toggle('fi-sidebar-open'"));
        assert!(shell_source.contains("querySelectorAll('[data-feluqa-sidebar-close]'"));
        assert!(shell_source.contains("[data-feluqa-table-search]"));
        let language_flag = send(&app, Method::GET, "/assets/feluqa/flags/fr", None, "").await?;
        assert_eq!(language_flag.status(), StatusCode::OK);
        assert_eq!(
            language_flag
                .headers()
                .get(CONTENT_TYPE)
                .and_then(|value| value.to_str().ok()),
            Some("image/svg+xml; charset=utf-8")
        );
        let missing_language_flag =
            send(&app, Method::GET, "/assets/feluqa/flags/xx", None, "").await?;
        assert_eq!(missing_language_flag.status(), StatusCode::NOT_FOUND);
        assert_eq!(
            panel_js
                .headers()
                .get(CONTENT_TYPE)
                .and_then(|value| value.to_str().ok()),
            Some("text/javascript; charset=utf-8")
        );
        let live_js = send(&app, Method::GET, "/assets/feluqa-live.js", None, "").await?;
        assert_eq!(live_js.status(), StatusCode::OK);

        let anonymous_live = send(
            &app,
            Method::GET,
            "/live/snapshots/system::health::ping?revision=0",
            None,
            "",
        )
        .await?;
        assert_eq!(anonymous_live.status(), StatusCode::UNAUTHORIZED);

        let setup_page = send(&app, Method::GET, "/system/setup", None, "").await?;
        assert_eq!(setup_page.status(), StatusCode::OK);
        let setup_csrf_cookie = cookie_pair(&setup_page, "feluqa_login_csrf");
        let setup_html = body_text(setup_page).await?;
        let setup_csrf = hidden_csrf(&setup_html);
        assert_eq!(
            setup_csrf_cookie.split_once('=').map(|pair| pair.1),
            Some(setup_csrf.as_str())
        );

        let setup_body = format!(
            "csrf_token={setup_csrf}&display_name=Yassine&email=owner%40numerimondes.com&password=correcthorse123"
        );
        let setup_result = send(
            &app,
            Method::POST,
            "/system/setup",
            Some(&setup_csrf_cookie),
            &setup_body,
        )
        .await?;
        assert_eq!(setup_result.status(), StatusCode::SEE_OTHER);

        let anonymous = send(&app, Method::GET, "/system", None, "").await?;
        assert_eq!(anonymous.status(), StatusCode::SEE_OTHER);

        let login_page = send(&app, Method::GET, "/system/login", None, "").await?;
        let login_csrf_cookie = cookie_pair(&login_page, "feluqa_login_csrf");
        let login_html = body_text(login_page).await?;
        let login_csrf = hidden_csrf(&login_html);
        let login_body = format!(
            "csrf_token={login_csrf}&email=owner%40numerimondes.com&password=correcthorse123"
        );
        let login_result = send(
            &app,
            Method::POST,
            "/system/login",
            Some(&login_csrf_cookie),
            &login_body,
        )
        .await?;
        assert_eq!(login_result.status(), StatusCode::SEE_OTHER);
        let session_cookie = cookie_pair(&login_result, "feluqa_session");
        let csrf_cookie = cookie_pair(&login_result, "feluqa_csrf");
        assert!(cookie_header(&login_result, "feluqa_session").contains("HttpOnly"));
        let browser_cookies = format!("{session_cookie}; {csrf_cookie}");
        let csrf_value = csrf_cookie.split_once('=').map(|pair| pair.1).unwrap_or("");

        let disabled_crm_app = web::routes(PanelState::new(
            core.clone(),
            database.clone(),
            databases.clone(),
            crate::modules::panel_catalog()?,
            Some(crate::modules::live::runtime(crate::std::vec![4; 32])?),
            false,
        ));
        let disabled_crm = send(
            &disabled_crm_app,
            Method::GET,
            "/admin/customers",
            Some(&browser_cookies),
            "",
        )
        .await?;
        assert_eq!(disabled_crm.status(), StatusCode::NOT_FOUND);

        let snapshot_response = send(
            &app,
            Method::GET,
            "/live/snapshots/system::health::ping?revision=0",
            Some(&browser_cookies),
            "",
        )
        .await?;
        assert_eq!(snapshot_response.status(), StatusCode::OK);
        let snapshot: String = crate::serde_json::from_str(&body_text(snapshot_response).await?)?;
        let action_body = crate::serde_json::json!({
            "snapshot": snapshot,
            "action": "system::health::ping",
            "revision": 0,
            "payload": null,
        })
        .to_string();
        let action_response =
            send_live_action(&app, Some(&browser_cookies), Some(csrf_value), &action_body).await?;
        assert_eq!(action_response.status(), StatusCode::OK);
        assert_eq!(
            body_text(action_response).await?,
            r#"{"value":"pong","revision":1}"#
        );
        let replayed_action =
            send_live_action(&app, Some(&browser_cookies), Some(csrf_value), &action_body).await?;
        assert_eq!(replayed_action.status(), StatusCode::CONFLICT);
        let missing_csrf_action =
            send_live_action(&app, Some(&browser_cookies), None, &action_body).await?;
        assert_eq!(missing_csrf_action.status(), StatusCode::FORBIDDEN);

        let system = send(&app, Method::GET, "/system", Some(&browser_cookies), "").await?;
        assert_eq!(system.status(), StatusCode::OK);
        let system_html = body_text(system).await?;
        assert!(system_html.contains("class=\"fi-sidebar fi-main-sidebar\""));
        assert!(system_html.contains("class=\"fi-logo\">Feluqa Core</span>"));
        assert!(system_html.contains("fi-sidebar-close-overlay"));
        assert!(system_html.contains("fi-sidebar-group-label\">Platform</span>"));
        assert!(system_html.contains("data-feluqa-group-toggle"));
        assert!(system_html.contains("data-feluqa-nav-search"));
        assert!(system_html.contains("class=\"fi-input-wrp\""));
        assert!(system_html.contains("data-feluqa-language-selector"));
        assert!(system_html.contains("fi-sidebar-item-icon"));
        assert!(system_html.contains("<svg"));
        assert!(system_html.contains("data-user-name=\"Yassine\""));
        assert!(system_html.contains("action=\"/system/logout\""));
        assert!(system_html.contains("name=\"csrf_token\""));
        assert!(!system_html.contains("class=\"fi-topbar\""));
        assert!(system_html.contains("href=\"/system/users\""));
        assert!(system_html.contains("data-feluqa-live"));
        assert!(system_html.contains("/live/snapshots/system::health::ping"));
        let language_response = send(
            &app,
            Method::POST,
            "/system/language",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}&locale=fr&return_to=%2Fsystem"),
        )
        .await?;
        assert_eq!(language_response.status(), StatusCode::SEE_OTHER);
        assert!(
            language_response
                .headers()
                .get_all(SET_COOKIE)
                .iter()
                .any(|value| value
                    .to_str()
                    .is_ok_and(|cookie| cookie.contains("feluqa_locale=fr")))
        );
        let invalid_language = send(
            &app,
            Method::POST,
            "/system/language",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}&locale=xx&return_to=%2Fsystem"),
        )
        .await?;
        assert_eq!(invalid_language.status(), StatusCode::BAD_REQUEST);
        assert!(system_html.contains("/assets/feluqa-live.js"));
        assert!(system_html.contains("aria-live=\"polite\""));
        let live_client = send(&app, Method::GET, "/assets/feluqa-live.js", None, "").await?;
        assert_eq!(live_client.status(), StatusCode::OK);
        let live_client_source = body_text(live_client).await?;
        assert!(live_client_source.contains("x-csrf-token"));
        assert!(live_client_source.contains("textContent"));
        assert!(!live_client_source.contains("innerHTML"));
        let business = send(&app, Method::GET, "/admin", Some(&browser_cookies), "").await?;
        assert_eq!(business.status(), StatusCode::OK);
        let business_html = body_text(business).await?;
        assert!(business_html.contains("class=\"fi-sidebar fi-main-sidebar\""));
        assert!(business_html.contains("class=\"fi-logo\">Numerimondes</span>"));
        assert!(business_html.contains("href=\"/admin\""));
        assert!(!business_html.contains("href=\"/admin/customers\""));
        let registered_page = send(
            &app,
            Method::GET,
            "/admin/reports",
            Some(&browser_cookies),
            "",
        )
        .await?;
        assert_eq!(registered_page.status(), StatusCode::OK);
        assert!(
            body_text(registered_page)
                .await?
                .contains("Generated &lt;panel&gt; content")
        );
        for path in [
            "/system/modules",
            "/system/connections",
            "/system/migrations",
            "/system/audit",
        ] {
            let page = send(&app, Method::GET, path, Some(&browser_cookies), "").await?;
            assert_eq!(page.status(), StatusCode::OK, "{path}");
            let html = body_text(page).await?;
            if path == "/system/connections" {
                if let Some(capture_path) = crate::std::env::var_os("FELUQA_UI_CAPTURE") {
                    crate::std::fs::write(capture_path, &html)?;
                }
            }
            assert!(html.contains("<table class=\"fi-ta-table\">"), "{path}");
            assert!(html.contains("data-feluqa-table-search"), "{path}");
            assert!(!html.contains("<pre>"), "{path}");
            match path {
                "/system/modules" => {
                    assert!(html.contains(">Module</span>"));
                    assert!(html.contains("feluqa.core"));
                    assert!(html.contains("numerimondes.crm"));
                    assert!(html.contains("statically linked in this binary"));
                }
                "/system/connections" => {
                    assert!(html.contains(">Database</span>"));
                    assert!(html.contains("default"));
                    assert!(html.contains("SQLite"));
                    assert!(!html.contains("sqlite:"));
                }
                "/system/migrations" => {
                    assert!(html.contains(">Migration</span>"));
                    assert!(html.contains("name=\"csrf_token\""));
                    assert!(html.contains("name=\"module_id\""));
                    assert!(html.contains("name=\"connection\""));
                }
                "/system/audit" => assert!(html.contains(">Outcome</span>")),
                _ => {}
            }
        }
        let tenant_page = send(
            &app,
            Method::GET,
            "/system/tenants",
            Some(&browser_cookies),
            "",
        )
        .await?;
        assert_eq!(tenant_page.status(), StatusCode::OK);
        let tenant_html = body_text(tenant_page).await?;
        assert!(tenant_html.contains("Application tenants"));
        assert!(tenant_html.contains("name=\"slug\" type=\"text\""));
        assert!(tenant_html.contains("name=\"owner_email\" type=\"email\""));
        assert!(tenant_html.contains("name=\"owner_password\" type=\"password\""));
        let bad_tenant_csrf = send(
            &app,
            Method::POST,
            "/system/tenants",
            Some(&browser_cookies),
            "csrf_token=invalid&slug=blocked&display_name=Blocked&owner_name=Blocked+Owner&owner_email=blocked%40tenant.test&owner_password=strong-blocked-password",
        )
        .await?;
        assert_eq!(bad_tenant_csrf.status(), StatusCode::FORBIDDEN);
        let tenant_create = send(
            &app,
            Method::POST,
            "/system/tenants",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}&slug=http-tenant&display_name=HTTP+Tenant&owner_name=Tenant+Owner&owner_email=owner%40http-tenant.test&owner_password=strong-http-tenant-password"),
        )
        .await?;
        assert_eq!(tenant_create.status(), StatusCode::SEE_OTHER);
        let platform_admin = core
            .users(1)
            .await?
            .into_iter()
            .find(|user| user.email == "owner@numerimondes.com")
            .ok_or("platform user missing")?;
        let created_tenant = core
            .tenants(platform_admin.id)
            .await?
            .into_iter()
            .find(|tenant| tenant.slug == "http-tenant")
            .ok_or("HTTP tenant missing after creation")?;
        let tenant_owner = core
            .login("owner@http-tenant.test", "strong-http-tenant-password")
            .await?;
        assert_eq!(tenant_owner.tenant_id, created_tenant.id);
        let tenant_owner_cookies = format!(
            "feluqa_session={}; feluqa_csrf={}",
            tenant_owner.session_token, tenant_owner.csrf_token
        );
        let tenant_owner_denied = send(
            &app,
            Method::GET,
            "/system/tenants",
            Some(&tenant_owner_cookies),
            "",
        )
        .await?;
        assert_eq!(tenant_owner_denied.status(), StatusCode::FORBIDDEN);
        let tenant_owner_cannot_suspend = send(
            &app,
            Method::POST,
            "/system/tenants/status",
            Some(&tenant_owner_cookies),
            &format!(
                "csrf_token={}&tenant_id={}&active=false",
                tenant_owner.csrf_token, created_tenant.id
            ),
        )
        .await?;
        assert_eq!(tenant_owner_cannot_suspend.status(), StatusCode::FORBIDDEN);
        let tenant_management_page = send(
            &app,
            Method::GET,
            "/system/tenants",
            Some(&browser_cookies),
            "",
        )
        .await?;
        let tenant_management_html = body_text(tenant_management_page).await?;
        assert!(tenant_management_html.contains("/system/tenants/status"));
        assert!(tenant_management_html.contains("name=\"active\" value=\"false\""));
        let rejected_tenant_status = send(
            &app,
            Method::POST,
            "/system/tenants/status",
            Some(&browser_cookies),
            &format!(
                "csrf_token=invalid&tenant_id={}&active=false",
                created_tenant.id
            ),
        )
        .await?;
        assert_eq!(rejected_tenant_status.status(), StatusCode::FORBIDDEN);
        let suspended_tenant = send(
            &app,
            Method::POST,
            "/system/tenants/status",
            Some(&browser_cookies),
            &format!(
                "csrf_token={csrf_value}&tenant_id={}&active=false",
                created_tenant.id
            ),
        )
        .await?;
        assert_eq!(suspended_tenant.status(), StatusCode::SEE_OTHER);
        assert!(
            core.authenticate(&tenant_owner.session_token)
                .await?
                .is_none()
        );
        let reactivated_tenant = send(
            &app,
            Method::POST,
            "/system/tenants/status",
            Some(&browser_cookies),
            &format!(
                "csrf_token={csrf_value}&tenant_id={}&active=true",
                created_tenant.id
            ),
        )
        .await?;
        assert_eq!(reactivated_tenant.status(), StatusCode::SEE_OTHER);
        assert!(
            core.authenticate(&tenant_owner.session_token)
                .await?
                .is_none()
        );
        let migration_run = send(
            &app,
            Method::POST,
            "/system/migrations/run",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}&module_id=numerimondes.crm&connection=default"),
        )
        .await?;
        assert_eq!(migration_run.status(), StatusCode::SEE_OTHER);
        let unknown_migration_module = send(
            &app,
            Method::POST,
            "/system/migrations/run",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}&module_id=not.registered&connection=default"),
        )
        .await?;
        assert_eq!(unknown_migration_module.status(), StatusCode::BAD_REQUEST);
        let users = send(
            &app,
            Method::GET,
            "/system/users",
            Some(&browser_cookies),
            "",
        )
        .await?;
        assert_eq!(users.status(), StatusCode::OK);
        let users_html = body_text(users).await?;
        assert!(users_html.contains("<table class=\"fi-ta-table\">"));
        assert!(users_html.contains(">Name</span>"));
        assert!(users_html.contains(">Email</span>"));
        assert!(users_html.contains("Yassine"));
        assert!(users_html.contains("action=\"/system/users\""));
        assert!(users_html.contains("name=\"display_name\" type=\"text\""));
        assert!(users_html.contains("name=\"email\" type=\"email\""));
        assert!(users_html.contains("name=\"password\" type=\"password\""));
        assert!(users_html.contains("name=\"role_id\" required"));
        assert!(users_html.contains("Choose a value"));
        assert!(users_html.contains("action=\"/system/users/update\""));
        assert!(users_html.contains("Change role and revoke sessions"));
        assert!(users_html.contains("selected"));
        assert!(!users_html.contains("<pre>"));
        let roles = send(
            &app,
            Method::GET,
            "/system/roles",
            Some(&browser_cookies),
            "",
        )
        .await?;
        assert_eq!(roles.status(), StatusCode::OK);
        let roles_html = body_text(roles).await?;
        assert!(roles_html.contains("<table class=\"fi-ta-table\">"));
        assert!(roles_html.contains(">Permissions</span>"));
        assert!(roles_html.contains("system.users.read"));
        assert!(roles_html.contains("name=\"slug\" type=\"text\""));
        assert!(roles_html.contains("name=\"display_name\" type=\"text\""));
        assert!(roles_html.contains("name=\"permissions\" required maxlength=\"8192\""));
        assert!(!roles_html.contains("<pre>"));
        let delegated_role_response = send(
            &app,
            Method::POST,
            "/system/roles",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}&slug=role_writer&display_name=Role+Writer&permissions=system.roles.write"),
        )
        .await?;
        assert_eq!(delegated_role_response.status(), StatusCode::SEE_OTHER);
        let role_writer = core
            .roles(1)
            .await?
            .into_iter()
            .find(|role| role.slug == "role_writer")
            .ok_or("delegated role missing")?;
        let roles_after_create = send(
            &app,
            Method::GET,
            "/system/roles",
            Some(&browser_cookies),
            "",
        )
        .await?;
        let roles_after_create_html = body_text(roles_after_create).await?;
        assert!(roles_after_create_html.contains(&format!("<h3>Role #{}</h3>", role_writer.id)));
        assert!(roles_after_create_html.contains("name=\"id\" value=\""));
        assert!(roles_after_create_html.contains("system.roles.write</textarea>"));
        assert!(!roles_after_create_html.contains("name=\"role_id\""));
        let protected_role_id = core
            .roles(1)
            .await?
            .into_iter()
            .find(|role| role.is_system)
            .map(|role| role.id)
            .ok_or("system role missing")?;
        let protected_role_update = send(
            &app,
            Method::POST,
            "/system/roles/update",
            Some(&browser_cookies),
            &format!(
                "csrf_token={csrf_value}&id={protected_role_id}&permissions=system.roles.write"
            ),
        )
        .await?;
        assert_eq!(protected_role_update.status(), StatusCode::BAD_REQUEST);
        let csrf_denied_role_update = send(
            &app,
            Method::POST,
            "/system/roles/update",
            Some(&browser_cookies),
            &format!(
                "csrf_token=invalid&id={}&permissions=system.roles.write",
                role_writer.id
            ),
        )
        .await?;
        assert_eq!(csrf_denied_role_update.status(), StatusCode::FORBIDDEN);
        let update_role = send(
            &app,
            Method::POST,
            "/system/roles/update",
            Some(&browser_cookies),
            &format!(
                "csrf_token={csrf_value}&id={}&permissions=system.roles.write,system.users.read",
                role_writer.id
            ),
        )
        .await?;
        assert_eq!(update_role.status(), StatusCode::SEE_OTHER);
        let updated_role = core
            .roles(1)
            .await?
            .into_iter()
            .find(|role| role.id == role_writer.id)
            .ok_or("updated role missing")?;
        assert_eq!(
            updated_role.permissions,
            ["system.roles.write", "system.users.read"]
        );
        let delegated_user = send(
            &app,
            Method::POST,
            "/system/users",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}&display_name=Role+Writer&email=role-writer%40numerimondes.com&password=delegatedwriterpassword&role_id={}", role_writer.id),
        )
        .await?;
        assert_eq!(delegated_user.status(), StatusCode::SEE_OTHER);
        let delegated_session = core
            .login("role-writer@numerimondes.com", "delegatedwriterpassword")
            .await?;
        let delegated_cookies = format!(
            "feluqa_session={}; feluqa_csrf={}",
            delegated_session.session_token, delegated_session.csrf_token
        );
        let escalated_role = send(
            &app,
            Method::POST,
            "/system/roles",
            Some(&delegated_cookies),
            &format!("csrf_token={}&slug=escalated&display_name=Escalated&permissions=system.users.write", delegated_session.csrf_token),
        )
        .await?;
        assert_eq!(escalated_role.status(), StatusCode::FORBIDDEN);
        let escalated_update = send(
            &app,
            Method::POST,
            "/system/roles/update",
            Some(&delegated_cookies),
            &format!(
                "csrf_token={}&id={}&permissions=system.users.write",
                delegated_session.csrf_token, role_writer.id
            ),
        )
        .await?;
        assert_eq!(escalated_update.status(), StatusCode::FORBIDDEN);
        let after_denied_update = core
            .roles(1)
            .await?
            .into_iter()
            .find(|role| role.id == role_writer.id)
            .ok_or("role disappeared after denied update")?;
        assert_eq!(after_denied_update.permissions, updated_role.permissions);
        let roles = send(
            &app,
            Method::GET,
            "/system/roles",
            Some(&browser_cookies),
            "",
        )
        .await?;
        assert_eq!(roles.status(), StatusCode::OK);
        let create_role = send(
            &app,
            Method::POST,
            "/system/roles",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}&slug=crm_operator&display_name=CRM+Operator&permissions=business.crm.customers.read,business.crm.customers.create,business.crm.customers.update,business.crm.customers.delete,business.crm.customers.fields.name.read,business.crm.customers.fields.email.read,business.crm.customers.fields.name.write,business.crm.customers.fields.email.write"),
        ).await?;
        assert_eq!(create_role.status(), StatusCode::SEE_OTHER);
        let crm_role = core
            .roles(1)
            .await?
            .into_iter()
            .find(|role| role.slug == "crm_operator")
            .ok_or("role missing after creation")?;
        let create_user = send(
            &app,
            Method::POST,
            "/system/users",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}&display_name=CRM+Operator&email=crm%40numerimondes.com&password=customeroperatorpassword&role_id={}", crm_role.id),
        ).await?;
        assert_eq!(create_user.status(), StatusCode::SEE_OTHER);
        let crm_session = core
            .login("crm@numerimondes.com", "customeroperatorpassword")
            .await?;
        let crm_cookies = format!(
            "feluqa_session={}; feluqa_csrf={}",
            crm_session.session_token, crm_session.csrf_token
        );
        let crm_panel = send(
            &app,
            Method::GET,
            "/admin/customers",
            Some(&crm_cookies),
            "",
        )
        .await?;
        assert_eq!(crm_panel.status(), StatusCode::OK);
        let crm_denied_core =
            send(&app, Method::GET, "/system/users", Some(&crm_cookies), "").await?;
        assert_eq!(crm_denied_core.status(), StatusCode::FORBIDDEN);
        let crm_denied_registered_page =
            send(&app, Method::GET, "/admin/reports", Some(&crm_cookies), "").await?;
        assert_eq!(crm_denied_registered_page.status(), StatusCode::FORBIDDEN);
        let crm_create = send(
            &app,
            Method::POST,
            "/admin/customers",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}&name=Acme&email=contact%40acme.example"),
        )
        .await?;
        assert_eq!(crm_create.status(), StatusCode::SEE_OTHER);
        let customer = crate::modules::crm::model::Entity::find()
            .one(&database)
            .await?
            .ok_or_else(|| IoError::other("customer missing"))?;
        let crm_records = send(
            &app,
            Method::GET,
            "/admin/customers",
            Some(&crm_cookies),
            "",
        )
        .await?;
        assert_eq!(crm_records.status(), StatusCode::OK);
        let crm_html = body_text(crm_records).await?;
        assert!(!crm_html.contains("contact@acme.example"));
        assert!(crm_html.contains("action=\"/admin/customers\""));
        assert!(crm_html.contains("name=\"csrf_token\""));
        assert!(crm_html.contains("name=\"name\" type=\"text\""));
        assert!(crm_html.contains("name=\"email\" type=\"email\""));
        let cross_owner_update = send(
            &app,
            Method::POST,
            "/admin/customers/update",
            Some(&crm_cookies),
            &format!(
                "csrf_token={}&id={}&name=Stolen&email=stolen%40example.test",
                crm_session.csrf_token, customer.id
            ),
        )
        .await?;
        assert_eq!(cross_owner_update.status(), StatusCode::NOT_FOUND);
        let unchanged = crate::modules::crm::model::Entity::find_by_id(customer.id)
            .one(&database)
            .await?
            .ok_or_else(|| IoError::other("customer missing after denied update"))?;
        assert_eq!(unchanged.name, "Acme");
        let cross_owner_delete = send(
            &app,
            Method::POST,
            "/admin/customers/delete",
            Some(&crm_cookies),
            &format!("csrf_token={}&id={}", crm_session.csrf_token, customer.id),
        )
        .await?;
        assert_eq!(cross_owner_delete.status(), StatusCode::NOT_FOUND);
        let crm_create_owned = send(
            &app,
            Method::POST,
            "/admin/customers",
            Some(&crm_cookies),
            &format!(
                "csrf_token={}&name=Owned+Customer&email=owned%40example.test",
                crm_session.csrf_token
            ),
        )
        .await?;
        assert_eq!(crm_create_owned.status(), StatusCode::SEE_OTHER);
        let crm_owned = crate::modules::crm::model::Entity::find()
            .all(&database)
            .await?
            .into_iter()
            .find(|record| record.email == "owned@example.test")
            .ok_or_else(|| IoError::other("CRM user's own customer missing"))?;
        let crm_update_owned = send(
            &app,
            Method::POST,
            "/admin/customers/update",
            Some(&crm_cookies),
            &format!(
                "csrf_token={}&id={}&name=Owned+Customer+Updated&email=owned%40example.test",
                crm_session.csrf_token, crm_owned.id
            ),
        )
        .await?;
        assert_eq!(crm_update_owned.status(), StatusCode::SEE_OTHER);
        let field_limited_role = send(
            &app,
            Method::POST,
            "/system/roles",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}&slug=crm_name_editor&display_name=CRM+Name+Editor&permissions=business.crm.customers.read,business.crm.customers.update,business.crm.customers.records.all,business.crm.customers.fields.name.read,business.crm.customers.fields.name.write"),
        )
        .await?;
        assert_eq!(field_limited_role.status(), StatusCode::SEE_OTHER);
        let field_limited_role_id = core
            .roles(1)
            .await?
            .into_iter()
            .find(|role| role.slug == "crm_name_editor")
            .ok_or("field-limited role missing")?
            .id;
        let isolated_tenant = tenant::ActiveModel {
            slug: Set(String::from("isolated-tenant")),
            display_name: Set(String::from("Isolated tenant")),
            created_at_epoch: Set(1),
            ..Default::default()
        }
        .insert(&database)
        .await?;
        let isolated_role = role::ActiveModel {
            tenant_id: Set(isolated_tenant.id),
            slug: Set(String::from("isolated_crm_operator")),
            display_name: Set(String::from("Isolated CRM operator")),
            is_system: Set(0),
            created_at_epoch: Set(1),
            ..Default::default()
        }
        .insert(&database)
        .await?;
        for grant in [
            "business.crm.customers.read",
            "business.crm.customers.update",
            "business.crm.customers.records.all",
            "business.crm.customers.fields.name.read",
            "business.crm.customers.fields.name.write",
        ] {
            permission::ActiveModel {
                role_id: Set(isolated_role.id),
                permission: Set(String::from(grant)),
                ..Default::default()
            }
            .insert(&database)
            .await?;
        }
        let isolated_user = user::ActiveModel {
            tenant_id: Set(isolated_tenant.id),
            email: Set(String::from("isolated@numerimondes.com")),
            display_name: Set(String::from("Isolated tenant operator")),
            password_hash: Set(hash_password("isolateduserpassword")?),
            is_active: Set(1),
            auth_version: Set(0),
            created_at_epoch: Set(1),
            updated_at_epoch: Set(1),
            ..Default::default()
        }
        .insert(&database)
        .await?;
        user_role::ActiveModel {
            user_id: Set(isolated_user.id),
            role_id: Set(isolated_role.id),
            assigned_at_epoch: Set(1),
        }
        .insert(&database)
        .await?;
        assert!(
            core.users(1)
                .await?
                .iter()
                .all(|user| user.id != isolated_user.id)
        );
        assert!(
            core.roles(1)
                .await?
                .iter()
                .all(|role| role.id != isolated_role.id)
        );
        let tenant_owner_id = core
            .users(1)
            .await?
            .into_iter()
            .find(|user| user.email == "owner@numerimondes.com")
            .ok_or("default-tenant owner missing")?
            .id;
        assert!(
            !core
                .set_user_active(isolated_user.id, false, tenant_owner_id)
                .await?
        );
        assert!(
            !core
                .set_user_role(isolated_user.id, field_limited_role_id, tenant_owner_id,)
                .await?
        );
        assert!(
            core.update_role_grants(
                isolated_role.id,
                &[String::from("system.roles.read")],
                tenant_owner_id,
            )
            .await
            .is_err()
        );
        let isolated_session = core
            .login("isolated@numerimondes.com", "isolateduserpassword")
            .await?;
        assert_eq!(isolated_session.tenant_id, isolated_tenant.id);
        let isolated_identity = core
            .authenticate(&isolated_session.session_token)
            .await?
            .ok_or("isolated tenant session missing")?;
        let isolated_cookies = format!(
            "feluqa_session={}; feluqa_csrf={}",
            isolated_session.session_token, isolated_session.csrf_token
        );
        let isolated_customers = send(
            &app,
            Method::GET,
            "/admin/customers",
            Some(&isolated_cookies),
            "",
        )
        .await?;
        assert_eq!(isolated_customers.status(), StatusCode::OK);
        let isolated_html = body_text(isolated_customers).await?;
        assert!(!isolated_html.contains("Acme"));
        assert!(!isolated_html.contains("Owned Customer Updated"));
        let tenant_users = send(
            &app,
            Method::GET,
            "/system/users",
            Some(&browser_cookies),
            "",
        )
        .await?;
        assert_eq!(tenant_users.status(), StatusCode::OK);
        assert!(
            !body_text(tenant_users)
                .await?
                .contains("isolated@numerimondes.com")
        );
        let tenant_roles = send(
            &app,
            Method::GET,
            "/system/roles",
            Some(&browser_cookies),
            "",
        )
        .await?;
        assert_eq!(tenant_roles.status(), StatusCode::OK);
        assert!(
            !body_text(tenant_roles)
                .await?
                .contains("isolated_crm_operator")
        );
        let tenant_audit = send(
            &app,
            Method::GET,
            "/system/audit",
            Some(&browser_cookies),
            "",
        )
        .await?;
        assert_eq!(tenant_audit.status(), StatusCode::OK);
        assert!(
            !body_text(tenant_audit)
                .await?
                .contains(&isolated_identity.session_id)
        );
        let cross_tenant_update = send(
            &app,
            Method::POST,
            "/admin/customers/update",
            Some(&isolated_cookies),
            &format!(
                "csrf_token={}&id={}&name=CrossTenant",
                isolated_session.csrf_token, customer.id
            ),
        )
        .await?;
        assert_eq!(cross_tenant_update.status(), StatusCode::NOT_FOUND);
        let cross_tenant_unchanged = crate::modules::crm::model::Entity::find_by_id(customer.id)
            .one(&database)
            .await?
            .ok_or_else(|| IoError::other("customer missing after cross-tenant update"))?;
        assert_eq!(cross_tenant_unchanged.name, "Acme");
        let role_reassignment = send(
            &app,
            Method::POST,
            "/system/users/update",
            Some(&browser_cookies),
            &format!(
                "csrf_token={csrf_value}&id={}&role_id={field_limited_role_id}",
                delegated_session.user_id
            ),
        )
        .await?;
        assert_eq!(role_reassignment.status(), StatusCode::SEE_OTHER);
        assert!(
            core.authenticate(&delegated_session.session_token)
                .await?
                .is_none()
        );
        let old_role_session = send(
            &app,
            Method::GET,
            "/system/roles",
            Some(&delegated_cookies),
            "",
        )
        .await?;
        assert_eq!(old_role_session.status(), StatusCode::SEE_OTHER);
        let reassigned_grants = core.permissions_for(delegated_session.user_id).await?;
        assert!(
            reassigned_grants
                .iter()
                .any(|grant| grant == "business.crm.customers.fields.name.read")
        );
        assert!(
            !reassigned_grants
                .iter()
                .any(|grant| grant == "system.roles.write")
        );
        let field_limited_user = send(
            &app,
            Method::POST,
            "/system/users",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}&display_name=CRM+Name+Editor&email=name-editor%40numerimondes.com&password=fieldlimitedpassword&role_id={field_limited_role_id}"),
        )
        .await?;
        assert_eq!(field_limited_user.status(), StatusCode::SEE_OTHER);
        let user_manager_role = send(
            &app,
            Method::POST,
            "/system/roles",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}&slug=user_manager&display_name=User+Manager&permissions=system.users.write"),
        )
        .await?;
        assert_eq!(user_manager_role.status(), StatusCode::SEE_OTHER);
        let user_manager_role_id = core
            .roles(1)
            .await?
            .into_iter()
            .find(|role| role.slug == "user_manager")
            .ok_or("user manager role missing")?
            .id;
        let user_manager_user = send(
            &app,
            Method::POST,
            "/system/users",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}&display_name=User+Manager&email=user-manager%40numerimondes.com&password=usermanagerpassword&role_id={user_manager_role_id}"),
        )
        .await?;
        assert_eq!(user_manager_user.status(), StatusCode::SEE_OTHER);
        let user_manager_session = core
            .login("user-manager@numerimondes.com", "usermanagerpassword")
            .await?;
        let user_manager_cookies = format!(
            "feluqa_session={}; feluqa_csrf={}",
            user_manager_session.session_token, user_manager_session.csrf_token
        );
        let denied_admin_creation = send(
            &app,
            Method::POST,
            "/system/users",
            Some(&user_manager_cookies),
            &format!("csrf_token={}&display_name=Escalated&email=escalated%40numerimondes.com&password=escalatedpassword&role_id={protected_role_id}", user_manager_session.csrf_token),
        )
        .await?;
        assert_eq!(denied_admin_creation.status(), StatusCode::FORBIDDEN);
        let denied_role_escalation = send(
            &app,
            Method::POST,
            "/system/users/role",
            Some(&user_manager_cookies),
            &format!(
                "csrf_token={}&user_id={}&role_id={protected_role_id}",
                user_manager_session.csrf_token, delegated_session.user_id
            ),
        )
        .await?;
        assert_eq!(denied_role_escalation.status(), StatusCode::FORBIDDEN);
        assert_eq!(
            core.permissions_for(delegated_session.user_id).await?,
            reassigned_grants
        );
        let field_limited_session = core
            .login("name-editor@numerimondes.com", "fieldlimitedpassword")
            .await?;
        let field_limited_cookies = format!(
            "feluqa_session={}; feluqa_csrf={}",
            field_limited_session.session_token, field_limited_session.csrf_token
        );
        let field_limited_page = send(
            &app,
            Method::GET,
            "/admin/customers",
            Some(&field_limited_cookies),
            "",
        )
        .await?;
        assert_eq!(field_limited_page.status(), StatusCode::OK);
        let field_limited_html = body_text(field_limited_page).await?;
        assert!(field_limited_html.contains("<table class=\"fi-ta-table\">"));
        assert!(field_limited_html.contains(">Name</span>"));
        assert!(!field_limited_html.contains(">Email</span>"));
        assert!(field_limited_html.contains("Owned Customer Updated"));
        assert!(!field_limited_html.contains("owned@example.test"));
        assert!(!field_limited_html.contains("name=\"email\""));
        assert!(field_limited_html.contains("action=\"/admin/customers/update\""));
        assert!(field_limited_html.contains("name=\"id\" value=\""));
        assert!(
            field_limited_html
                .contains("name=\"name\" type=\"text\" value=\"Owned Customer Updated\"")
        );
        assert!(!field_limited_html.contains("Add customer"));
        let denied_field_update = send(
            &app,
            Method::POST,
            "/admin/customers/update",
            Some(&field_limited_cookies),
            &format!(
                "csrf_token={}&id={}&email=changed%40example.test",
                field_limited_session.csrf_token, crm_owned.id
            ),
        )
        .await?;
        assert_eq!(denied_field_update.status(), StatusCode::FORBIDDEN);
        let crm_update = send(
            &app,
            Method::POST,
            "/admin/customers/update",
            Some(&browser_cookies),
            &format!(
                "csrf_token={csrf_value}&id={}&name=Acme+Updated&email=contact%40acme.example",
                customer.id
            ),
        )
        .await?;
        assert_eq!(crm_update.status(), StatusCode::SEE_OTHER);
        let updated = crate::modules::crm::model::Entity::find_by_id(customer.id)
            .one(&database)
            .await?
            .ok_or_else(|| IoError::other("updated customer missing"))?;
        assert_eq!(updated.name, "Acme Updated");
        let crm_delete = send(
            &app,
            Method::POST,
            "/admin/customers/delete",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}&id={}", customer.id),
        )
        .await?;
        assert_eq!(crm_delete.status(), StatusCode::SEE_OTHER);
        let crm_audit = audit_event::Entity::find()
            .all(&database)
            .await?
            .into_iter()
            .filter(|event| event.resource == "business.crm.customers")
            .count();
        assert_eq!(crm_audit, 5, "CRM mutations each append one audit event");

        let staff_session = core
            .login("staff@numerimondes.com", "regularuserpassword")
            .await?;
        let staff_cookies = format!(
            "feluqa_session={}; feluqa_csrf={}",
            staff_session.session_token, staff_session.csrf_token
        );
        let denied_system = send(&app, Method::GET, "/system", Some(&staff_cookies), "").await?;
        assert_eq!(denied_system.status(), StatusCode::FORBIDDEN);
        let denied_users =
            send(&app, Method::GET, "/system/users", Some(&staff_cookies), "").await?;
        assert_eq!(denied_users.status(), StatusCode::FORBIDDEN);
        let denied_roles =
            send(&app, Method::GET, "/system/roles", Some(&staff_cookies), "").await?;
        assert_eq!(denied_roles.status(), StatusCode::FORBIDDEN);
        let denied_audit =
            send(&app, Method::GET, "/system/audit", Some(&staff_cookies), "").await?;
        assert_eq!(denied_audit.status(), StatusCode::FORBIDDEN);
        let denied_admin = send(&app, Method::GET, "/admin", Some(&staff_cookies), "").await?;
        assert_eq!(denied_admin.status(), StatusCode::FORBIDDEN);
        let denied_crm = send(
            &app,
            Method::GET,
            "/admin/customers",
            Some(&staff_cookies),
            "",
        )
        .await?;
        assert_eq!(denied_crm.status(), StatusCode::FORBIDDEN);
        let owner = core
            .users(1)
            .await?
            .into_iter()
            .find(|user| user.email == "owner@numerimondes.com")
            .ok_or_else(|| IoError::other("owner missing"))?;
        assert!(matches!(
            core.set_user_active(owner.id, false, owner.id).await,
            Err(feluqa::core::service::CoreStoreError::UserLifecycleDenied)
        ));
        let self_disable = send(
            &app,
            Method::POST,
            "/system/users/active",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}&user_id={}&active=false", owner.id),
        )
        .await?;
        assert_eq!(self_disable.status(), StatusCode::BAD_REQUEST);
        let staff = core
            .users(1)
            .await?
            .into_iter()
            .find(|user| user.email == "staff@numerimondes.com")
            .ok_or_else(|| IoError::other("staff missing"))?;
        let disable_staff = send(
            &app,
            Method::POST,
            "/system/users/active",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}&user_id={}&active=false", staff.id),
        )
        .await?;
        assert_eq!(disable_staff.status(), StatusCode::SEE_OTHER);
        assert!(
            core.authenticate(&staff_session.session_token)
                .await?
                .is_none()
        );
        assert!(matches!(
            core.login("staff@numerimondes.com", "regularuserpassword")
                .await,
            Err(feluqa::core::service::CoreStoreError::InvalidCredentials)
        ));
        let reactivate_staff = send(
            &app,
            Method::POST,
            "/system/users/active",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}&user_id={}&active=true", staff.id),
        )
        .await?;
        assert_eq!(reactivate_staff.status(), StatusCode::SEE_OTHER);
        assert!(
            core.authenticate(&staff_session.session_token)
                .await?
                .is_none()
        );
        let renewed_staff_session = core
            .login("staff@numerimondes.com", "regularuserpassword")
            .await?;
        assert!(
            core.authenticate(&renewed_staff_session.session_token)
                .await?
                .is_some()
        );

        let rejected_logout = send(
            &app,
            Method::POST,
            "/system/logout",
            Some(&browser_cookies),
            "csrf_token=invalid",
        )
        .await?;
        assert_eq!(rejected_logout.status(), StatusCode::FORBIDDEN);
        let cross_origin_logout = send_with_origin(
            &app,
            Method::POST,
            "/system/logout",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}"),
            "https://attacker.example",
        )
        .await?;
        assert_eq!(cross_origin_logout.status(), StatusCode::FORBIDDEN);
        let logout = send(
            &app,
            Method::POST,
            "/system/logout",
            Some(&browser_cookies),
            &format!("csrf_token={csrf_value}"),
        )
        .await?;
        assert_eq!(logout.status(), StatusCode::SEE_OTHER);
        let revoked = send(&app, Method::GET, "/system", Some(&browser_cookies), "").await?;
        assert_eq!(revoked.status(), StatusCode::SEE_OTHER);
        module_runtime.shutdown()?;
        Ok(())
    }

    #[tokio::test]
    async fn crm_seeder_is_separate_from_migrations_and_safe_to_repeat()
    -> Result<(), Box<dyn Error>> {
        let settings = DatabaseSettings::from_toml(
            "[connections.default]\nurl = \"sqlite::memory:\"\nmax_connections = 1\n[connections.analytics]\nurl = \"sqlite::memory:\"\nmax_connections = 1\n",
        )?;
        let databases = DatabasePools::connect(&settings).await?;
        MigrationRunner::run_declared(&databases, &feluqa::core::MIGRATIONS).await?;
        MigrationRunner::run_module(&databases, "analytics", &feluqa::core::MIGRATIONS).await?;
        let crm_migrations = feluqa::database::ModuleMigrations {
            connections: &["default", "analytics"],
            ..crate::generated_migrations::crm::MIGRATIONS
        };
        MigrationRunner::run_declared(&databases, &crm_migrations).await?;
        let database = databases.default_connection()?;
        let analytics = databases
            .get("analytics")
            .ok_or_else(|| IoError::other("analytics database connection missing"))?;
        assert_eq!(
            crate::modules::crm::model::Entity::find()
                .all(database)
                .await?
                .len(),
            0
        );
        assert_eq!(
            crate::modules::crm::model::Entity::find()
                .all(analytics)
                .await?
                .len(),
            0
        );
        crate::modules::crm::seeders::run(&databases, "crm.demo-customers").await?;
        crate::modules::crm::seeders::run(&databases, "crm.demo-customers").await?;
        assert_eq!(
            crate::modules::crm::model::Entity::find()
                .all(database)
                .await?
                .len(),
            3
        );
        assert_eq!(
            crate::modules::crm::model::Entity::find()
                .all(analytics)
                .await?
                .len(),
            0
        );
        crate::modules::crm::seeders::run_on_connections(
            &databases,
            "crm.demo-customers",
            &["default", "analytics"],
        )
        .await?;
        crate::modules::crm::seeders::run_on_connections(
            &databases,
            "crm.demo-customers",
            &["default", "analytics"],
        )
        .await?;
        assert_eq!(
            crate::modules::crm::model::Entity::find()
                .all(database)
                .await?
                .len(),
            3
        );
        assert_eq!(
            crate::modules::crm::model::Entity::find()
                .all(analytics)
                .await?
                .len(),
            3
        );
        Ok(())
    }

    async fn send(
        app: &crate::axum::Router,
        method: Method,
        path: &str,
        cookies: Option<&str>,
        body: &str,
    ) -> Result<crate::axum::response::Response, Box<dyn Error>> {
        send_with_origin(app, method, path, cookies, body, "http://127.0.0.1:38127").await
    }

    async fn send_live_action(
        app: &crate::axum::Router,
        cookies: Option<&str>,
        csrf: Option<&str>,
        body: &str,
    ) -> Result<crate::axum::response::Response, Box<dyn Error>> {
        let mut headers = HeaderMap::new();
        headers.insert(HOST, HeaderValue::from_static("127.0.0.1:38127"));
        headers.insert(ORIGIN, HeaderValue::from_static("http://127.0.0.1:38127"));
        headers.insert(
            crate::axum::http::header::CONTENT_TYPE,
            HeaderValue::from_static("application/json"),
        );
        if let Some(cookies) = cookies {
            headers.insert(COOKIE, HeaderValue::from_str(cookies)?);
        }
        if let Some(csrf) = csrf {
            headers.insert("x-csrf-token", HeaderValue::from_str(csrf)?);
        }
        let request = Request::builder()
            .method(Method::POST)
            .uri("/live/actions")
            .body(Body::from(body.to_string()))?;
        let (mut parts, body) = request.into_parts();
        parts.headers = headers;
        Ok(app
            .clone()
            .oneshot(Request::from_parts(parts, body))
            .await?)
    }

    async fn send_with_origin(
        app: &crate::axum::Router,
        method: Method,
        path: &str,
        cookies: Option<&str>,
        body: &str,
        origin: &str,
    ) -> Result<crate::axum::response::Response, Box<dyn Error>> {
        let mut headers = HeaderMap::new();
        headers.insert(HOST, HeaderValue::from_static("127.0.0.1:38127"));
        headers.insert(ORIGIN, HeaderValue::from_str(origin)?);
        headers.insert(
            crate::axum::http::header::CONTENT_TYPE,
            HeaderValue::from_static("application/x-www-form-urlencoded"),
        );
        if let Some(cookies) = cookies {
            headers.insert(COOKIE, HeaderValue::from_str(cookies)?);
        }
        let request = Request::builder()
            .method(method)
            .uri(path)
            .body(Body::from(body.to_string()))?;
        let (mut parts, body) = request.into_parts();
        parts.headers = headers;
        Ok(app
            .clone()
            .oneshot(Request::from_parts(parts, body))
            .await?)
    }

    fn cookie_pair(response: &crate::axum::response::Response, name: &str) -> String {
        cookie_header(response, name)
            .split(';')
            .next()
            .unwrap_or("")
            .to_string()
    }

    fn cookie_header(response: &crate::axum::response::Response, name: &str) -> String {
        response
            .headers()
            .get_all(SET_COOKIE)
            .iter()
            .filter_map(|value| value.to_str().ok())
            .find(|value| value.starts_with(&format!("{name}=")))
            .unwrap_or("")
            .to_string()
    }

    fn hidden_csrf(html: &str) -> String {
        html.split("name=\"csrf_token\" value=\"")
            .nth(1)
            .and_then(|value| value.split('"').next())
            .unwrap_or("")
            .to_string()
    }

    async fn body_text(
        response: crate::axum::response::Response,
    ) -> Result<String, Box<dyn Error>> {
        let bytes = to_bytes(response.into_body(), 64 * 1024).await?;
        Ok(crate::std::string::String::from_utf8(bytes.to_vec())?)
    }
}

#[cfg(test)]
mod postgresql_migration_tests {
    use crate::feluqa;
    use crate::std::assert;
    use crate::std::boxed::Box;
    use crate::std::error::Error;
    use crate::std::iter::Iterator;
    use crate::std::matches;
    use crate::std::result::Result;
    use crate::std::result::Result::Ok;
    use crate::tokio;
    use feluqa::database::{DatabasePools, DatabaseSettings, Dialect, MigrationRunner};

    #[tokio::test]
    #[ignore = "requires a disposable PostgreSQL database in FELUQA_TEST_POSTGRES_URL"]
    async fn core_and_crm_owner_migrations_apply_on_postgresql() -> Result<(), Box<dyn Error>> {
        let settings = DatabaseSettings::from_toml(
            "[connections.default]\nurl_env = \"FELUQA_TEST_POSTGRES_URL\"\nmax_connections = 2\n",
        )?;
        let databases = DatabasePools::connect(&settings).await?;
        MigrationRunner::run_module(&databases, "default", &feluqa::core::MIGRATIONS).await?;
        MigrationRunner::run_module(
            &databases,
            "default",
            &crate::generated_migrations::crm::MIGRATIONS,
        )
        .await?;
        let dialect = databases.dialect("default").ok_or("missing dialect")?;
        assert!(matches!(dialect, Dialect::Postgresql));
        let crm = crate::generated_migrations::crm::MIGRATIONS
            .for_dialect(dialect)
            .ok_or("CRM module has no migration variant for the PostgreSQL connection")?;
        let statuses = MigrationRunner::status(&databases, "default", crm).await?;
        assert!(
            statuses.iter().all(|(_, status)| {
                matches!(status, feluqa::database::MigrationStatus::Applied)
            })
        );
        Ok(())
    }
}
