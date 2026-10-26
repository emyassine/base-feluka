use feluka_m0_rules_effort_rust::{Action, Record, Request, Rule, allows, list_count, status_for};
use serde::Deserialize;

#[derive(Deserialize)]
struct Suite {
    records: Vec<RecordOwned>,
    cases: Vec<Case>,
}

#[derive(Deserialize)]
struct CapturedReference {
    cases: Vec<CapturedCase>,
}

#[derive(Deserialize)]
struct CapturedCase {
    name: String,
    status: u16,
    items: Option<usize>,
}

#[derive(Clone, Deserialize)]
struct RecordOwned {
    owner_id: String,
    status: String,
}

impl RecordOwned {
    fn as_record(&self) -> Record<'_> {
        Record {
            owner_id: &self.owner_id,
            status: &self.status,
        }
    }
}

#[derive(Deserialize)]
struct Case {
    name: String,
    rule: String,
    filter: Option<String>,
    action: String,
    auth_id: Option<String>,
    body_owner_id: Option<String>,
    superuser: Option<bool>,
    record: Option<RecordOwned>,
    allowed: Option<bool>,
    status: u16,
    list_count: Option<usize>,
}

#[test]
fn pocketbase_rest_cases() {
    let suite: Suite = serde_json::from_str(include_str!("../../vectors.json")).unwrap();
    let reference: CapturedReference =
        serde_json::from_str(&std::env::var("M0_POCKETBASE_REFERENCE")
            .map(|path| std::fs::read_to_string(path).expect("read fresh PocketBase capture"))
            .unwrap_or_else(|_| include_str!("../../../../results/2026-10-24-23_11_32/pocketbase-reference.json").to_owned()))
            .unwrap();
    assert_eq!(suite.cases.len(), reference.cases.len());
    for case in suite.cases {
        let captured = reference
            .cases
            .iter()
            .find(|value| value.name == case.name)
            .unwrap();
        assert_eq!(
            case.status, captured.status,
            "reference status for {}",
            case.name
        );
        assert_eq!(
            case.list_count, captured.items,
            "reference list count for {}",
            case.name
        );
        let rule = match case.rule.as_str() {
            "locked" => Rule::Locked,
            "public" => Rule::Public,
            "filter" => Rule::Filter(case.filter.as_deref().unwrap()),
            _ => panic!("unknown rule kind in {}", case.name),
        };
        let action = match case.action.as_str() {
            "list" => Action::List,
            "view" => Action::View,
            "create" => Action::Create,
            "update" => Action::Update,
            "delete" => Action::Delete,
            _ => panic!("unknown action in {}", case.name),
        };
        let request = Request {
            auth_id: case.auth_id.as_deref(),
            body_owner_id: case.body_owner_id.as_deref(),
            superuser: case.superuser.unwrap_or(false),
        };
        let record = case.record.as_ref().map(RecordOwned::as_record);
        if let Some(expected) = case.allowed {
            assert_eq!(
                allows(rule, action, request, record),
                expected,
                "{}",
                case.name
            );
        }
        assert_eq!(
            status_for(rule, action, case.allowed.unwrap_or(false)),
            case.status,
            "{}",
            case.name
        );
        if let Some(expected) = case.list_count {
            let records = suite
                .records
                .iter()
                .map(RecordOwned::as_record)
                .collect::<Vec<_>>();
            let records = if case.name == "superuser_list_bypasses_rule" {
                let mut records = records;
                records.push(Record {
                    owner_id: "alice",
                    status: "active",
                });
                records
            } else {
                records
            };
            assert_eq!(
                list_count(rule, request, &records),
                expected,
                "{}",
                case.name
            );
        }
    }
}

#[test]
fn precedence_parentheses_and_malformed_filters_fail_closed() {
    let request = Request {
        auth_id: Some("alice"),
        body_owner_id: None,
        superuser: false,
    };
    let active = Record {
        owner_id: "bob",
        status: "active",
    };
    let precedence = Rule::Filter(
        r#"status = "active" || owner_id = @request.auth.id && @request.auth.id != """#,
    );
    assert!(allows(precedence, Action::View, request, Some(active)));
    assert!(!allows(
        Rule::Filter(
            r#"(status = "draft" || owner_id = @request.auth.id) && @request.auth.id != """#
        ),
        Action::View,
        request,
        Some(active),
    ));
    for malformed in [
        "unknown = \"x\"",
        "status = \"active\" &&",
        "status = \"active",
    ] {
        assert!(!allows(
            Rule::Filter(malformed),
            Action::View,
            request,
            Some(active)
        ));
    }
}
