use feluka_pocketbase_rules_spike::{
    Action, Record, Request, Rule, SqlParameter, allows, compile_filter_sql, list_count, status_for,
};
use sqlx::{Connection, Row, SqliteConnection};

const LIST_RULE: &str = r#"@request.auth.id != "" && owner_id = @request.auth.id"#;
const VIEW_RULE: &str =
    r#"@request.auth.id != "" && owner_id = @request.auth.id && status = "active""#;
const CREATE_RULE: &str = r#"@request.auth.id != "" && @request.body.owner_id = @request.auth.id"#;

fn alice() -> Request<'static> {
    Request {
        auth_id: Some("alice"),
        body_owner_id: None,
        superuser: false,
    }
}
fn guest() -> Request<'static> {
    Request {
        auth_id: None,
        body_owner_id: None,
        superuser: false,
    }
}
fn record(owner_id: &'static str, status: &'static str) -> Record<'static> {
    Record { owner_id, status }
}

#[test]
fn pocketbase_v0406_black_box_vectors() {
    let records = [
        record("alice", "active"),
        record("alice", "draft"),
        record("bob", "active"),
    ];
    let alice = alice();
    assert_eq!(
        list_count(Rule::Filter(LIST_RULE), alice, &records),
        2,
        "list_owner_filtered"
    );
    assert_eq!(
        list_count(Rule::Filter(LIST_RULE), guest(), &records),
        0,
        "list_guest_empty"
    );
    assert_eq!(
        status_for(Rule::Filter(LIST_RULE), Action::List, false),
        200,
        "list_guest_empty status"
    );
    assert!(
        allows(
            Rule::Filter(VIEW_RULE),
            Action::View,
            alice,
            Some(records[0])
        ),
        "view_owner_active"
    );
    assert_eq!(
        status_for(Rule::Filter(VIEW_RULE), Action::View, true),
        200,
        "view_owner_active status"
    );
    assert_eq!(
        status_for(Rule::Filter(VIEW_RULE), Action::View, false),
        404,
        "view_owner_draft_hidden status"
    );
    assert!(
        !allows(
            Rule::Filter(VIEW_RULE),
            Action::View,
            alice,
            Some(records[1])
        ),
        "view_owner_draft_hidden"
    );
    assert!(
        !allows(
            Rule::Filter(VIEW_RULE),
            Action::View,
            alice,
            Some(records[2])
        ),
        "view_other_owner_hidden"
    );

    let create_allowed = Request {
        body_owner_id: Some("alice"),
        ..alice
    };
    let create_denied = Request {
        body_owner_id: Some("bob"),
        ..alice
    };
    assert!(
        allows(
            Rule::Filter(CREATE_RULE),
            Action::Create,
            create_allowed,
            None
        ),
        "create_matching_owner"
    );
    assert_eq!(
        status_for(Rule::Filter(CREATE_RULE), Action::Create, true),
        200,
        "create_matching_owner status"
    );
    assert_eq!(
        status_for(Rule::Filter(CREATE_RULE), Action::Create, false),
        400,
        "create_mismatched_owner status"
    );
    assert!(
        !allows(
            Rule::Filter(CREATE_RULE),
            Action::Create,
            create_denied,
            None
        ),
        "create_mismatched_owner"
    );

    assert!(
        !allows(Rule::Locked, Action::Delete, alice, Some(records[0])),
        "delete_locked"
    );
    assert_eq!(
        status_for(Rule::Locked, Action::Delete, false),
        403,
        "delete_locked status"
    );
    assert_eq!(
        status_for(Rule::Filter(VIEW_RULE), Action::Delete, false),
        404,
        "filtered delete status"
    );
    let superuser = Request {
        superuser: true,
        ..guest()
    };
    let all_records = [
        records[0],
        records[1],
        records[2],
        record("alice", "active"),
    ];
    assert_eq!(
        list_count(Rule::Locked, superuser, &all_records),
        4,
        "superuser list bypass"
    );
    assert_eq!(
        status_for(Rule::Locked, Action::List, true),
        200,
        "superuser list status"
    );
    assert_eq!(
        status_for(
            Rule::Locked,
            Action::Delete,
            allows(Rule::Locked, Action::Delete, superuser, Some(records[0]))
        ),
        204,
        "superuser delete bypass"
    );
}

#[test]
fn parser_handles_precedence_and_parentheses() {
    let rule = r#"@request.auth.id != "" && (status = "active" || owner_id = @request.auth.id)"#;
    assert!(allows(
        Rule::Filter(rule),
        Action::View,
        alice(),
        Some(record("bob", "active"))
    ));
    assert!(!allows(
        Rule::Filter(rule),
        Action::View,
        guest(),
        Some(record("bob", "draft"))
    ));
}

#[test]
fn supported_filters_lower_to_parameterized_sql() {
    let predicate = compile_filter_sql(VIEW_RULE, alice()).unwrap();
    assert_eq!(
        predicate.expression,
        "((? IS NOT ? AND \"owner_id\" IS ?) AND \"status\" IS ?)"
    );
    assert_eq!(
        predicate.parameters,
        vec![
            SqlParameter::Text("alice".into()),
            SqlParameter::Text("".into()),
            SqlParameter::Text("alice".into()),
            SqlParameter::Text("active".into()),
        ]
    );

    let injection = compile_filter_sql(r#"status = "active' OR 1=1 --""#, alice()).unwrap();
    assert_eq!(injection.expression, "\"status\" IS ?");
    assert_eq!(
        injection.parameters,
        vec![SqlParameter::Text("active' OR 1=1 --".into())]
    );
}

#[test]
fn sql_lowering_preserves_missing_request_value_comparisons() {
    let predicate = compile_filter_sql(CREATE_RULE, alice()).unwrap();
    assert_eq!(predicate.expression, "(? IS NOT ? AND ? IS ?)");
    assert_eq!(
        predicate.parameters,
        vec![
            SqlParameter::Text("alice".into()),
            SqlParameter::Text("".into()),
            SqlParameter::Null,
            SqlParameter::Text("alice".into()),
        ]
    );
}

#[test]
fn lowered_list_rules_match_the_in_memory_evaluator_on_sqlite() {
    let runtime = tokio::runtime::Builder::new_current_thread()
        .build()
        .unwrap();
    runtime.block_on(async {
        let mut connection = SqliteConnection::connect("sqlite::memory:").await.unwrap();
        sqlx::query("CREATE TABLE notes (owner_id TEXT NOT NULL, status TEXT NOT NULL)")
            .execute(&mut connection)
            .await
            .unwrap();
        let records = [
            record("alice", "active"),
            record("alice", "draft"),
            record("bob", "active"),
        ];
        for record in records {
            sqlx::query("INSERT INTO notes (owner_id, status) VALUES (?, ?)")
                .bind(record.owner_id)
                .bind(record.status)
                .execute(&mut connection)
                .await
                .unwrap();
        }

        for (rule, request) in [
            (LIST_RULE, alice()),
            (LIST_RULE, guest()),
            (VIEW_RULE, alice()),
            (
                r#"(status = "active" || owner_id = @request.auth.id) && @request.auth.id != """#,
                alice(),
            ),
        ] {
            let predicate = compile_filter_sql(rule, request).unwrap();
            let sql = format!(
                "SELECT COUNT(*) AS count FROM notes WHERE {}",
                predicate.expression
            );
            let mut query = sqlx::query(&sql);
            for parameter in predicate.parameters {
                query = match parameter {
                    SqlParameter::Text(value) => query.bind(value),
                    SqlParameter::Null => query.bind(None::<String>),
                };
            }
            let row = query.fetch_one(&mut connection).await.unwrap();
            let sql_count: i64 = row.try_get("count").unwrap();
            assert_eq!(
                sql_count as usize,
                list_count(Rule::Filter(rule), request, &records),
                "SQL lowerer mismatch for {rule}"
            );
        }
    });
}

#[test]
fn sql_lowering_rejects_unknown_identifiers_and_trailing_tokens() {
    assert!(compile_filter_sql("secret = 1", alice()).is_none());
    assert!(compile_filter_sql(r#"status = "active" garbage"#, alice()).is_none());
}

#[test]
fn differential_against_captured_pocketbase_rest_responses() {
    let reference: serde_json::Value =
        serde_json::from_str(&std::env::var("M0_POCKETBASE_REFERENCE")
            .map(|path| std::fs::read_to_string(path).expect("read fresh PocketBase capture"))
            .unwrap_or_else(|_| include_str!("../../../../results/2026-10-24-23_11_32/pocketbase-reference.json").to_owned()))
            .unwrap();
    let alice = alice();
    let guest = guest();
    let superuser = Request {
        superuser: true,
        ..guest
    };
    let initial = [
        record("alice", "active"),
        record("alice", "draft"),
        record("bob", "active"),
    ];
    let after_create = [
        initial[0],
        initial[1],
        initial[2],
        record("alice", "active"),
    ];

    let actual = [
        (
            "list_owner_filtered",
            200,
            Some(list_count(Rule::Filter(LIST_RULE), alice, &initial)),
        ),
        (
            "list_guest_empty",
            200,
            Some(list_count(Rule::Filter(LIST_RULE), guest, &initial)),
        ),
        (
            "view_owner_active",
            status_for(
                Rule::Filter(VIEW_RULE),
                Action::View,
                allows(
                    Rule::Filter(VIEW_RULE),
                    Action::View,
                    alice,
                    Some(initial[0]),
                ),
            ),
            None,
        ),
        (
            "view_owner_draft_hidden",
            status_for(
                Rule::Filter(VIEW_RULE),
                Action::View,
                allows(
                    Rule::Filter(VIEW_RULE),
                    Action::View,
                    alice,
                    Some(initial[1]),
                ),
            ),
            None,
        ),
        (
            "view_other_owner_hidden",
            status_for(
                Rule::Filter(VIEW_RULE),
                Action::View,
                allows(
                    Rule::Filter(VIEW_RULE),
                    Action::View,
                    alice,
                    Some(initial[2]),
                ),
            ),
            None,
        ),
        (
            "create_matching_owner",
            status_for(
                Rule::Filter(CREATE_RULE),
                Action::Create,
                allows(
                    Rule::Filter(CREATE_RULE),
                    Action::Create,
                    Request {
                        body_owner_id: Some("alice"),
                        ..alice
                    },
                    None,
                ),
            ),
            None,
        ),
        (
            "create_mismatched_owner",
            status_for(
                Rule::Filter(CREATE_RULE),
                Action::Create,
                allows(
                    Rule::Filter(CREATE_RULE),
                    Action::Create,
                    Request {
                        body_owner_id: Some("bob"),
                        ..alice
                    },
                    None,
                ),
            ),
            None,
        ),
        (
            "delete_locked",
            status_for(
                Rule::Locked,
                Action::Delete,
                allows(Rule::Locked, Action::Delete, alice, Some(initial[0])),
            ),
            None,
        ),
        (
            "superuser_list_bypasses_rule",
            200,
            Some(list_count(Rule::Locked, superuser, &after_create)),
        ),
        (
            "superuser_delete_bypasses_lock",
            status_for(
                Rule::Locked,
                Action::Delete,
                allows(Rule::Locked, Action::Delete, superuser, Some(initial[0])),
            ),
            None,
        ),
    ];

    let expected_cases = reference["cases"].as_array().unwrap();
    assert_eq!(actual.len(), expected_cases.len());
    for (name, status, items) in actual {
        let expected = expected_cases
            .iter()
            .find(|case| case["name"] == name)
            .unwrap();
        assert_eq!(
            status as u64,
            expected["status"].as_u64().unwrap(),
            "{name} status"
        );
        if let Some(items) = items {
            assert_eq!(
                items as u64,
                expected["items"].as_u64().unwrap(),
                "{name} item count"
            );
        }
    }
}
