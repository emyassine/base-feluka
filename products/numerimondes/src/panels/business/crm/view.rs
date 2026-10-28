#![no_implicit_prelude]
#![deny(unsafe_code)]

use crate::feluqa;
use crate::panels::business::crm::model;
use crate::panels::business::crm::resource;
use crate::std::clone::Clone;
use crate::std::collections::BTreeMap;
use crate::std::convert::From;
use crate::std::option::Option;
use crate::std::option::Option::Some;
use crate::std::result::Result;
use crate::std::result::Result::Ok;
use crate::std::string::String;
use crate::std::string::ToString;
use crate::std::vec::Vec;
use feluqa::panel::{ResourceAccess, ResourceFormError, ResourceTableError, ResourceTableRow};
use feluqa::view::TrustedHtml;

/// Customer data prepared for a panel response after field policy filtering.
pub struct CustomerRow {
    /// Database identity used by policy-filtered forms.
    pub id: i64,
    /// Safe generated update form; empty when the principal cannot update.
    pub edit_form: TrustedHtml,
}

/// Complete CRM page model passed to the compiled panel view.
pub struct CustomerPanel {
    /// Safe component HTML built from the registered CRM resource and its access decision.
    pub table: TrustedHtml,
    /// Safe generated create form; empty when the principal cannot create.
    pub create_form: TrustedHtml,
    /// Policy-filtered records displayed on the active page.
    pub customers: Vec<CustomerRow>,
    /// Whether the create resource form is available.
    pub can_create: bool,
    /// Whether the current principal may delete customers.
    pub can_delete: bool,
    /// One-based active page.
    pub page: u64,
    /// Total page count, at least one.
    pub page_count: u64,
}

/// Generate one resource form from the CRM descriptor and resolved field grants.
pub fn customer_form(
    access: &ResourceAccess,
    csrf_token: &str,
    record: Option<&model::Model>,
    submit: &str,
) -> Result<TrustedHtml, ResourceFormError> {
    let mut values = BTreeMap::new();
    if let Some(record) = record {
        values.insert(String::from("name"), record.name.clone());
        values.insert(String::from("email"), record.email.clone());
    }
    let record_id = record.map(|record| record.id);
    let rendered =
        resource::CUSTOMERS.render_form(access, csrf_token, record_id, submit, &values)?;
    Ok(feluqa::web::trusted_panel_html(rendered))
}

/// Construct an empty trusted slot for a principal without that operation's grant.
pub fn empty_panel_html() -> TrustedHtml {
    TrustedHtml::from_trusted(String::new())
}

/// Render readable customer fields through the registered resource's SDUI table component.
pub fn customer_table(
    customers: &[model::Model],
    access: &ResourceAccess,
) -> Result<TrustedHtml, ResourceTableError> {
    let mut rows = Vec::with_capacity(customers.len());
    for customer in customers {
        let mut values = BTreeMap::new();
        if access.fields.can_read("record_id") {
            values.insert(String::from("record_id"), customer.id.to_string());
        }
        if access.fields.can_read("name") {
            values.insert(String::from("name"), customer.name.clone());
        }
        if access.fields.can_read("email") {
            values.insert(String::from("email"), customer.email.clone());
        }
        rows.push(ResourceTableRow { values });
    }
    let rendered = resource::CUSTOMERS.render_table(access, "Customers", &rows)?;
    Ok(feluqa::web::trusted_panel_html(rendered))
}

impl CustomerRow {
    /// Attach a prebuilt policy-filtered form to a record identity.
    pub fn with_form(id: i64, edit_form: TrustedHtml) -> Self {
        Self { id, edit_form }
    }
}
