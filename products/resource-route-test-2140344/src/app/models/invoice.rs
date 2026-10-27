#![no_implicit_prelude]

use crate::feluqa;
use crate::std;

use feluqa::prelude::*;
use feluqa::database::eloquent::Model;

#[derive(Model, Debug, Clone, Deserialize, Serialize)]
#[table_name = "invoice"]
#[allow(dead_code)] // Remove this allowance when application code starts using the model.
pub struct Invoice {
    #[primary_key]
    pub id: i64,
    #[serde(skip)]
    #[tenant_key]
    pub tenant_id: i64,
    #[serde(skip)]
    #[owner_key]
    pub owner_user_id: i64,
    pub name: String,
}
