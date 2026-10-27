#![no_implicit_prelude]

use crate::std::iter::Iterator;

pub(crate) fn valid_customer(name: &str, email: &str) -> bool {
    valid_customer_name(name) && valid_customer_email(email)
}

pub(crate) fn valid_customer_name(name: &str) -> bool {
    let name = name.trim();
    !name.is_empty() && name.len() <= 160 && !name.chars().any(char::is_control)
}

pub(crate) fn valid_customer_email(email: &str) -> bool {
    let email = email.trim();
    email.len() <= 254
        && email.matches('@').count() == 1
        && email.split_once('@').is_some_and(|(local, domain)| {
            !local.is_empty()
                && domain.contains('.')
                && !domain.starts_with('.')
                && !domain.ends_with('.')
        })
        && !email.chars().any(char::is_control)
}
