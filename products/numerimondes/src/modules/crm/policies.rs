#![no_implicit_prelude]
#![deny(unsafe_code)]

use crate::feluqa;
use crate::std::clone::Clone;
use crate::std::default::Default;
use feluqa::panel::{ResourceFieldAccess, ResourceOperation};

/// Record boundary applied after an operation grant has been checked.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum CustomerScope {
    /// The actor may access any customer record inside this tenant.
    AllInTenant(i64),
    /// The actor may access owned records inside this tenant.
    OwnedBy { tenant_id: i64, user_id: i64 },
}

impl CustomerScope {
    /// Tenant enforced by this record scope.
    pub const fn tenant_id(self) -> i64 {
        match self {
            Self::AllInTenant(tenant_id) | Self::OwnedBy { tenant_id, .. } => tenant_id,
        }
    }
}

/// A server-side capability required for one CRM customer operation.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum CustomerAction {
    /// View customer records.
    Read,
    /// Add a customer record.
    Create,
    /// Change a customer record.
    Update,
    /// Remove a customer record.
    Delete,
}

/// Field-level permissions resolved for one authenticated CRM request.
#[derive(Clone, Copy, Debug, Default, Eq, PartialEq)]
pub struct CustomerFields {
    /// The actor may receive customer names in a response.
    pub read_name: bool,
    /// The actor may receive customer email addresses in a response.
    pub read_email: bool,
    /// The actor may create or change customer names.
    pub write_name: bool,
    /// The actor may create or change customer email addresses.
    pub write_email: bool,
}

impl CustomerFields {
    /// Convert the shared resource field decision into this product's display contract.
    pub fn from_access(fields: &ResourceFieldAccess) -> Self {
        Self {
            read_name: fields.can_read("name"),
            read_email: fields.can_read("email"),
            write_name: fields.can_write("name"),
            write_email: fields.can_write("email"),
        }
    }
}

impl CustomerAction {
    /// Map the product action to its shared resource operation.
    pub fn resource_operation(self) -> ResourceOperation {
        match self {
            Self::Read => ResourceOperation::List,
            Self::Create => ResourceOperation::Create,
            Self::Update => ResourceOperation::Update,
            Self::Delete => ResourceOperation::Delete,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{CustomerAction, CustomerFields};
    use crate::feluqa;
    use crate::std::assert_eq;
    use crate::std::default::Default;
    use crate::std::vec;
    use feluqa::panel::ResourceFieldAccess;

    #[test]
    fn crm_resource_descriptor_is_valid() {
        crate::modules::crm::resource::CUSTOMERS
            .validate()
            .expect("valid shared customer resource contract");
    }

    #[test]
    fn crm_actions_map_to_distinct_shared_operations() {
        assert_eq!(
            CustomerAction::Read.resource_operation(),
            feluqa::panel::ResourceOperation::List
        );
        assert_eq!(
            CustomerAction::Create.resource_operation(),
            feluqa::panel::ResourceOperation::Create
        );
        assert_eq!(
            CustomerAction::Update.resource_operation(),
            feluqa::panel::ResourceOperation::Update
        );
        assert_eq!(
            CustomerAction::Delete.resource_operation(),
            feluqa::panel::ResourceOperation::Delete
        );
    }

    #[test]
    fn field_grants_are_independent_and_default_to_denied() {
        assert_eq!(
            CustomerFields::from_access(&ResourceFieldAccess {
                readable: vec!["name"],
                writable: vec!["name"],
            }),
            CustomerFields {
                read_name: true,
                read_email: false,
                write_name: true,
                write_email: false,
            }
        );
        assert_eq!(
            CustomerFields::from_access(&ResourceFieldAccess::default()),
            CustomerFields {
                read_name: false,
                read_email: false,
                write_name: false,
                write_email: false,
            }
        );
    }
}
