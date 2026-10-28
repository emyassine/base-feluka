#![no_implicit_prelude]
#![no_std]
#![forbid(unsafe_code)]
#![deny(unused_must_use)]
#![deny(missing_docs)]

//! Authentication and exact-permission authorization contracts for Feluqa.

extern crate alloc;
extern crate core;
#[cfg(test)]
extern crate std;

use alloc::collections::BTreeSet;
use alloc::string::String;
use core::fmt;
use core::iter::Iterator;
use core::option::Option;
use core::result::Result;
use core::result::Result::{Err, Ok};

/// Stable permission identifier, for example `system.users.read`.
#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Permission(String);

impl Permission {
    /// Construct a permission from lowercase dot-separated segments.
    pub fn new(value: impl core::convert::Into<String>) -> Result<Self, PermissionError> {
        let value = value.into();
        let valid = !value.is_empty()
            && value.split('.').all(|segment| {
                !segment.is_empty()
                    && segment.bytes().all(|byte| {
                        byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_'
                    })
            });
        if valid {
            Ok(Self(value))
        } else {
            Err(PermissionError)
        }
    }

    /// Return the permission's stable string representation.
    pub fn as_str(&self) -> &str {
        &self.0
    }

    /// Return its first namespace segment, such as `system` or `content`.
    pub fn namespace(&self) -> &str {
        self.0.split('.').next().unwrap_or("")
    }
}

impl fmt::Display for Permission {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(&self.0)
    }
}

/// A trusted authentication boundary may build this principal after session validation.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Principal {
    subject: String,
    tenant: Option<String>,
    permissions: BTreeSet<Permission>,
}

impl Principal {
    /// Create an authenticated principal with no grants.
    pub fn new(
        subject: impl core::convert::Into<String>,
        tenant: Option<String>,
    ) -> Result<Self, PrincipalError> {
        let subject = subject.into();
        if subject.trim().is_empty() {
            return Err(PrincipalError::EmptySubject);
        }
        if tenant.as_ref().is_some_and(|value| value.trim().is_empty()) {
            return Err(PrincipalError::EmptyTenant);
        }
        Ok(Self {
            subject,
            tenant,
            permissions: BTreeSet::new(),
        })
    }

    /// Grant one permission resolved by trusted server-side policy code.
    pub fn grant(&mut self, permission: Permission) {
        self.permissions.insert(permission);
    }

    /// Return the stable authenticated subject identifier.
    pub fn subject(&self) -> &str {
        &self.subject
    }

    /// Return the tenant identifier, when this principal is tenant-scoped.
    pub fn tenant(&self) -> Option<&str> {
        self.tenant.as_deref()
    }

    /// Check an exact permission grant. Wildcards are deliberately unsupported.
    pub fn has_permission(&self, permission: &Permission) -> bool {
        self.permissions.contains(permission)
    }
}

/// Server-side authorization boundary. Implementations may query policies and record audits.
pub trait Authorizer {
    /// Authorize one action; absence of a grant must return a denial.
    fn authorize(&self, principal: &Principal, permission: &Permission) -> Result<(), Denial>;
}

/// Exact permission-set authorization suitable for tests and small applications.
pub struct PermissionSetAuthorizer;

impl Authorizer for PermissionSetAuthorizer {
    fn authorize(&self, principal: &Principal, permission: &Permission) -> Result<(), Denial> {
        if principal.has_permission(permission) {
            Ok(())
        } else {
            Err(Denial)
        }
    }
}

/// Error for malformed permission identifiers.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
/// Invalid permission identifier.
pub struct PermissionError;
impl fmt::Display for PermissionError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str("permission must be lowercase dot-separated segments")
    }
}
impl core::error::Error for PermissionError {}

/// Error for incomplete authenticated identity.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum PrincipalError {
    /// The authenticated subject identifier was empty.
    EmptySubject,
    /// A supplied tenant identifier was empty.
    EmptyTenant,
}
impl fmt::Display for PrincipalError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(match self {
            Self::EmptySubject => "principal subject cannot be empty",
            Self::EmptyTenant => "principal tenant cannot be empty",
        })
    }
}
impl core::error::Error for PrincipalError {}

/// Authorization denial. It intentionally carries no user or resource details.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Denial;
impl fmt::Display for Denial {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str("access denied")
    }
}
impl core::error::Error for Denial {}

#[cfg(test)]
mod tests {
    use super::{Authorizer, Permission, PermissionSetAuthorizer, Principal};
    use crate::core::clone::Clone;
    use crate::core::convert::From;
    use crate::core::option::Option::None;
    use crate::core::result::Result::Err;
    use crate::std::assert;
    use crate::std::assert_eq;
    use crate::std::string::String;

    #[test]
    fn permission_checks_are_exact_and_namespaced() {
        let read = Permission::new("system.users.read").expect("valid permission");
        let write = Permission::new("system.users.write").expect("valid permission");
        let mut principal = Principal::new("operator-1", None).expect("valid principal");
        principal.grant(read.clone());
        let authorizer = PermissionSetAuthorizer;
        assert_eq!(read.namespace(), "system");
        assert!(authorizer.authorize(&principal, &read).is_ok());
        assert_eq!(authorizer.authorize(&principal, &write), Err(super::Denial));
        assert_eq!(String::from(principal.subject()), "operator-1");
    }

    #[test]
    fn malformed_permissions_are_rejected() {
        assert!(Permission::new("system.*").is_err());
        assert!(Permission::new("System.users.read").is_err());
        assert!(Permission::new("system..read").is_err());
    }
}
