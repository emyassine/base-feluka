#![no_implicit_prelude]
#![deny(unsafe_code)]

use crate::feluqa;
use crate::modules::crm::model::Entity;
use crate::std::boxed::Box;
use crate::std::convert::From;
use crate::std::default::Default;
use crate::std::error::Error;
use crate::std::result::Result;
use crate::std::result::Result::Ok;
use crate::std::string::String;
use feluqa::database::orm::{
    ActiveModelTrait, ActiveValue::Set, ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter,
    TransactionTrait,
};

/// Stable ID used only when an operator explicitly runs `feluqa seed crm.demo-customers`.
pub const ID: &str = "crm.demo-customers";

/// Insert the three demonstration CRM records, skipping matching emails on repeat runs.
pub async fn run(database: &DatabaseConnection) -> Result<(), Box<dyn Error>> {
    let transaction = database.begin().await?;
    for (name, email) in [
        ("Atlas Atelier", "atlas@example.test"),
        ("Cedar Studio", "cedar@example.test"),
        ("Mistral Services", "mistral@example.test"),
    ] {
        let existing = Entity::find()
            .filter(crate::modules::crm::model::Column::Email.eq(email))
            .one(&transaction)
            .await?;
        if existing.is_some() {
            continue;
        }
        crate::modules::crm::model::ActiveModel {
            name: Set(String::from(name)),
            email: Set(String::from(email)),
            ..Default::default()
        }
        .insert(&transaction)
        .await?;
    }
    transaction.commit().await?;
    Ok(())
}
