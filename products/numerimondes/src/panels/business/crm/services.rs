#![no_implicit_prelude]
#![deny(unsafe_code)]

use crate::feluqa;
use crate::modules::crm::model;
use crate::modules::crm::policies::CustomerScope;
use crate::std::convert::From;
use crate::std::default::Default;
use crate::std::format;
use crate::std::option::Option;
use crate::std::option::Option::{None, Some};
use crate::std::result::Result;
use crate::std::result::Result::Ok;
use crate::std::string::{String, ToString};
use crate::std::time::{SystemTime, UNIX_EPOCH};
use crate::std::vec::Vec;
use feluqa::core::entities::audit_event;
use feluqa::database::orm::{
    ActiveModelTrait, ActiveValue::Set, ColumnTrait, DatabaseConnection, DbErr, EntityTrait,
    PaginatorTrait, QueryFilter, TransactionTrait,
};

/// Maximum number of customer records returned by one panel request.
pub const CUSTOMER_PAGE_SIZE: u64 = 20;

/// Bounded customer page after applying the actor's record scope.
pub struct CustomerPage {
    /// Records visible on this page.
    pub customers: Vec<model::Model>,
    /// One-based current page, clamped to the available range.
    pub page: u64,
    /// Number of pages, at least one so empty lists have a stable page URL.
    pub page_count: u64,
}

/// List a bounded page without widening the caller's server-resolved record scope.
pub async fn list_customers_page(
    database: &DatabaseConnection,
    scope: CustomerScope,
    requested_page: u64,
) -> Result<CustomerPage, DbErr> {
    use feluqa::database::orm::QueryOrder;
    let query = model::Entity::find();
    let query = match scope {
        CustomerScope::AllInTenant(tenant_id) => {
            query.filter(model::Column::TenantId.eq(tenant_id))
        }
        CustomerScope::OwnedBy { tenant_id, user_id } => query
            .filter(model::Column::TenantId.eq(tenant_id))
            .filter(model::Column::OwnerUserId.eq(Some(user_id))),
    };
    let paginator = query
        .order_by_asc(model::Column::Id)
        .paginate(database, CUSTOMER_PAGE_SIZE);
    let raw_page_count = paginator.num_pages().await?;
    let page_count = if raw_page_count == 0 {
        1
    } else {
        raw_page_count
    };
    let page = if requested_page == 0 {
        1
    } else if requested_page > page_count {
        page_count
    } else {
        requested_page
    };
    let customers = paginator.fetch_page(page - 1).await?;
    Ok(CustomerPage {
        customers,
        page,
        page_count,
    })
}

/// Create a customer and append its audit event in the same transaction.
pub async fn create_customer(
    database: &DatabaseConnection,
    actor_user_id: i64,
    tenant_id: i64,
    name: &str,
    email: &str,
) -> Result<model::Model, DbErr> {
    let transaction = database.begin().await?;
    let customer = model::ActiveModel {
        tenant_id: Set(tenant_id),
        name: Set(name.trim().to_string()),
        email: Set(email.trim().to_ascii_lowercase()),
        owner_user_id: Set(Some(actor_user_id)),
        ..Default::default()
    }
    .insert(&transaction)
    .await?;
    append_audit(
        &transaction,
        actor_user_id,
        tenant_id,
        "business.crm.customers.create",
        customer.id,
    )
    .await?;
    transaction.commit().await?;
    Ok(customer)
}

/// Update a customer and append its audit event atomically; return `None` if absent.
pub async fn update_customer(
    database: &DatabaseConnection,
    actor_user_id: i64,
    id: i64,
    name: Option<&str>,
    email: Option<&str>,
    scope: CustomerScope,
) -> Result<Option<model::Model>, DbErr> {
    let tenant_id = scope.tenant_id();
    let transaction = database.begin().await?;
    let query = model::Entity::find_by_id(id);
    let query = match scope {
        CustomerScope::AllInTenant(tenant_id) => {
            query.filter(model::Column::TenantId.eq(tenant_id))
        }
        CustomerScope::OwnedBy { tenant_id, user_id } => query
            .filter(model::Column::TenantId.eq(tenant_id))
            .filter(model::Column::OwnerUserId.eq(Some(user_id))),
    };
    let Some(customer) = query.one(&transaction).await? else {
        transaction.rollback().await?;
        return Ok(None);
    };
    let mut active = model::ActiveModel::from(customer);
    if let Some(name) = name {
        active.name = Set(name.trim().to_string());
    }
    if let Some(email) = email {
        active.email = Set(email.trim().to_ascii_lowercase());
    }
    let customer = active.update(&transaction).await?;
    append_audit(
        &transaction,
        actor_user_id,
        tenant_id,
        "business.crm.customers.update",
        id,
    )
    .await?;
    transaction.commit().await?;
    Ok(Some(customer))
}

/// Delete a customer and append its audit event atomically; return `false` if absent.
pub async fn delete_customer(
    database: &DatabaseConnection,
    actor_user_id: i64,
    id: i64,
    scope: CustomerScope,
) -> Result<bool, DbErr> {
    let tenant_id = scope.tenant_id();
    let transaction = database.begin().await?;
    let query = model::Entity::find_by_id(id);
    let query = match scope {
        CustomerScope::AllInTenant(tenant_id) => {
            query.filter(model::Column::TenantId.eq(tenant_id))
        }
        CustomerScope::OwnedBy { tenant_id, user_id } => query
            .filter(model::Column::TenantId.eq(tenant_id))
            .filter(model::Column::OwnerUserId.eq(Some(user_id))),
    };
    if query.one(&transaction).await?.is_none() {
        transaction.rollback().await?;
        return Ok(false);
    }
    model::Entity::delete_by_id(id).exec(&transaction).await?;
    append_audit(
        &transaction,
        actor_user_id,
        tenant_id,
        "business.crm.customers.delete",
        id,
    )
    .await?;
    transaction.commit().await?;
    Ok(true)
}

async fn append_audit(
    transaction: &feluqa::database::orm::DatabaseTransaction,
    actor_user_id: i64,
    tenant_id: i64,
    action: &str,
    record_id: i64,
) -> Result<(), DbErr> {
    let occurred_at_epoch = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|error| DbErr::Custom(format!("system clock is invalid: {error}")))?
        .as_secs() as i64;
    audit_event::ActiveModel {
        tenant_id: Set(tenant_id),
        actor_user_id: Set(Some(actor_user_id)),
        action: Set(action.to_string()),
        resource: Set(String::from("business.crm.customers")),
        record_key: Set(Some(record_id.to_string())),
        outcome: Set(String::from("allowed")),
        request_id: Set(None),
        occurred_at_epoch: Set(occurred_at_epoch),
        ..Default::default()
    }
    .insert(transaction)
    .await?;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::{CUSTOMER_PAGE_SIZE, list_customers_page};
    use crate::feluqa;
    use crate::modules::crm::policies::CustomerScope;
    use crate::std::assert_eq;
    use crate::std::boxed::Box;
    use crate::std::convert::From;
    use crate::std::default::Default;
    use crate::std::error::Error;
    use crate::std::format;
    use crate::std::iter::Iterator;
    use crate::std::option::Option::Some;
    use crate::std::result::Result;
    use crate::std::result::Result::Ok;
    use crate::std::string::String;
    use crate::tokio;
    use feluqa::core::MIGRATIONS as CORE_MIGRATIONS;
    use feluqa::core::entities::tenant;
    use feluqa::core::entities::user;
    use feluqa::database::orm::{ActiveModelTrait, ActiveValue::Set};
    use feluqa::database::{DatabasePools, DatabaseSettings, MigrationRunner};

    #[tokio::test]
    async fn pagination_is_bounded_clamped_and_keeps_owner_scope() -> Result<(), Box<dyn Error>> {
        let settings = DatabaseSettings::from_toml(
            "[connections.default]\nurl = \"sqlite::memory:\"\nmax_connections = 1\n",
        )?;
        let databases = DatabasePools::connect(&settings).await?;
        MigrationRunner::run_module(&databases, "default", &CORE_MIGRATIONS).await?;
        MigrationRunner::run_module(
            &databases,
            "default",
            &crate::generated_migrations::crm::MIGRATIONS,
        )
        .await?;
        let database = databases.default_connection()?;
        let second_tenant = tenant::ActiveModel {
            slug: Set(String::from("second")),
            display_name: Set(String::from("Second tenant")),
            created_at_epoch: Set(1),
            ..Default::default()
        }
        .insert(database)
        .await?;
        let owner_a = user::ActiveModel {
            tenant_id: Set(1),
            email: Set(String::from("owner-a@example.test")),
            display_name: Set(String::from("Owner A")),
            password_hash: Set(String::from("test-only-hash")),
            is_active: Set(1),
            auth_version: Set(0),
            created_at_epoch: Set(1),
            updated_at_epoch: Set(1),
            ..Default::default()
        }
        .insert(database)
        .await?
        .id;
        let owner_b = user::ActiveModel {
            tenant_id: Set(second_tenant.id),
            email: Set(String::from("owner-b@example.test")),
            display_name: Set(String::from("Owner B")),
            password_hash: Set(String::from("test-only-hash")),
            is_active: Set(1),
            auth_version: Set(0),
            created_at_epoch: Set(1),
            updated_at_epoch: Set(1),
            ..Default::default()
        }
        .insert(database)
        .await?
        .id;
        for index in 0..=CUSTOMER_PAGE_SIZE + 1 {
            super::create_customer(
                database,
                if index > CUSTOMER_PAGE_SIZE {
                    owner_b
                } else {
                    owner_a
                },
                if index > CUSTOMER_PAGE_SIZE {
                    second_tenant.id
                } else {
                    1
                },
                "Customer",
                &format!("customer-{index}@example.test"),
            )
            .await?;
        }

        let first = list_customers_page(
            database,
            CustomerScope::OwnedBy {
                tenant_id: 1,
                user_id: owner_a,
            },
            1,
        )
        .await?;
        assert_eq!(first.customers.len() as u64, CUSTOMER_PAGE_SIZE);
        assert_eq!(first.page, 1);
        assert_eq!(first.page_count, 2);
        assert!(
            first
                .customers
                .iter()
                .all(|customer| customer.owner_user_id == Some(owner_a))
        );

        let clamped =
            list_customers_page(database, CustomerScope::AllInTenant(1), u64::MAX).await?;
        assert_eq!(clamped.customers.len(), 1);
        assert_eq!(clamped.page, 2);
        assert_eq!(clamped.page_count, 2);
        let second_tenant_page =
            list_customers_page(database, CustomerScope::AllInTenant(second_tenant.id), 1).await?;
        assert_eq!(second_tenant_page.customers.len(), 1);
        assert!(
            second_tenant_page
                .customers
                .iter()
                .all(|customer| customer.tenant_id == second_tenant.id)
        );
        Ok(())
    }
}
