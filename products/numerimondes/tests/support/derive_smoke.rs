#![no_implicit_prelude]

extern crate feluqa;
extern crate std;

use crate::tokio;
use feluqa::database::eloquent::Model;
use feluqa::database::orm::{ConnectionTrait, TransactionTrait};
use feluqa::prelude::*;

#[allow(dead_code)]
#[derive(Model, Debug, Clone, Serialize)]
#[table_name = "feluqa_model_derive_smoke"]
struct ModelDeriveSmoke {
    #[primary_key]
    id: i64,
    #[serde(skip)]
    #[tenant_key]
    tenant_id: i64,
    #[serde(skip)]
    #[owner_key]
    owner_user_id: i64,
    name: String,
}

#[test]
fn derive_exposes_table_metadata() {
    use std::assert_eq;
    assert_eq!(ModelDeriveSmoke::TABLE_NAME, "feluqa_model_derive_smoke");
}

#[tokio::test]
async fn derived_model_provides_bounded_create_read_update_delete() {
    use feluqa::database::{DatabasePools, DatabaseSettings};
    use std::assert;
    use std::assert_eq;
    use std::convert::From;
    use std::string::String;

    let settings = DatabaseSettings::from_toml(
        "[connections.default]\nurl = \"sqlite::memory:\"\nmax_connections = 1\n",
    )
    .expect("SQLite settings");
    let pools = DatabasePools::connect(&settings)
        .await
        .expect("connect SQLite");
    let database = pools.default_connection().expect("default connection");
    database
        .execute_unprepared(
            "CREATE TABLE feluqa_model_derive_smoke (id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id INTEGER NOT NULL, owner_user_id INTEGER NOT NULL, name TEXT NOT NULL)",
        )
        .await
        .expect("create test model table");

    let created = ModelDeriveSmoke::create_from_in_tenant(
        database,
        &ModelDeriveSmokeAttributes {
            name: String::from("first"),
        },
        1,
        7,
    )
    .await
    .expect("insert model");
    let transaction = database.begin().await.expect("begin model transaction");
    ModelDeriveSmoke::create_from_in_tenant(
        &transaction,
        &ModelDeriveSmokeAttributes {
            name: String::from("rolled back"),
        },
        1,
        7,
    )
    .await
    .expect("create model in transaction");
    transaction
        .rollback()
        .await
        .expect("roll back model insert");
    assert!(created.id > 0);
    assert!(ModelDeriveSmoke::find(database, created.id).await.is_err());
    assert!(ModelDeriveSmoke::page(database, 1).await.is_err());
    assert!(
        ModelDeriveSmoke::create_from(
            database,
            &ModelDeriveSmokeAttributes {
                name: String::from("missing trusted tenant"),
            },
        )
        .await
        .is_err()
    );
    assert!(
        ModelDeriveSmoke::update_from(
            database,
            created.id,
            &ModelDeriveSmokeAttributes {
                name: String::from("unscoped update"),
            },
        )
        .await
        .is_err()
    );
    assert!(
        ModelDeriveSmoke::delete(database, created.id)
            .await
            .is_err()
    );
    let mut index = 0;
    while index < 20 {
        ModelDeriveSmoke::create_from_in_tenant(
            database,
            &ModelDeriveSmokeAttributes {
                name: String::from("additional"),
            },
            1,
            7,
        )
        .await
        .expect("insert additional model");
        index += 1;
    }

    ModelDeriveSmoke::create_from_in_tenant(
        database,
        &ModelDeriveSmokeAttributes {
            name: String::from("other owner"),
        },
        1,
        8,
    )
    .await
    .expect("insert row in other tenant");
    let other_tenant = ModelDeriveSmoke::create_from_in_tenant(
        database,
        &ModelDeriveSmokeAttributes {
            name: String::from("other tenant"),
        },
        2,
        7,
    )
    .await
    .expect("insert row in other tenant with same owner ID");

    let first_page = ModelDeriveSmoke::page_in_tenant(database, 1, 7, 0)
        .await
        .expect("first bounded page");
    assert_eq!(first_page.items.len(), 20);
    assert_eq!(first_page.page, 1);
    assert_eq!(first_page.page_count, 2);
    let last_page = ModelDeriveSmoke::page_in_tenant(database, 1, 7, u64::MAX)
        .await
        .expect("clamped final page");
    assert_eq!(last_page.items.len(), 1);
    assert_eq!(last_page.items[0].id, 21);
    assert!(
        ModelDeriveSmoke::find_or_fail_in_tenant(database, other_tenant.id, 1, 7)
            .await
            .is_err()
    );

    assert!(
        ModelDeriveSmoke::find_or_fail_in_tenant(database, created.id, 1, 8)
            .await
            .is_err()
    );
    assert!(
        ModelDeriveSmoke::update_from_in_tenant(
            database,
            created.id,
            1,
            8,
            &ModelDeriveSmokeAttributes {
                name: String::from("cross tenant"),
            },
        )
        .await
        .expect("cross-tenant update")
        .is_none()
    );
    assert!(
        !ModelDeriveSmoke::delete_in_tenant(database, created.id, 1, 8)
            .await
            .expect("cross-tenant delete")
    );

    let updated = ModelDeriveSmoke::update_from_in_tenant(
        database,
        created.id,
        1,
        7,
        &ModelDeriveSmokeAttributes {
            name: String::from("updated"),
        },
    )
    .await
    .expect("update model in tenant")
    .expect("record belongs to tenant");
    assert_eq!(updated.name, "updated");
    assert_eq!(
        ModelDeriveSmoke::find_or_fail_in_tenant(database, created.id, 1, 7)
            .await
            .expect("read updated model")
            .name,
        "updated"
    );
    assert!(
        ModelDeriveSmoke::delete_in_tenant(database, created.id, 1, 7)
            .await
            .expect("delete model")
    );
    assert!(
        !ModelDeriveSmoke::delete_in_tenant(database, created.id, 1, 7)
            .await
            .expect("repeat delete is absent")
    );
    let serialized = crate::serde_json::to_string(&updated).expect("serialize model");
    assert!(!serialized.contains("tenant_id"));
    assert!(!serialized.contains("owner_user_id"));
}
