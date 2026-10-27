#![no_implicit_prelude]
#![deny(unsafe_code)]

use crate::feluqa;

use feluqa::auth::Permission;
use feluqa::live::{ActionRegistry, LiveError, LiveRuntime};
use feluqa::prelude::{Default, From, Ok, Result, String};
use crate::std::vec::Vec;

/// Create the starter's typed, permission-protected Live action registry.
pub fn runtime(signing_key: Vec<u8>) -> Result<LiveRuntime, LiveError> {
    let mut actions = ActionRegistry::default();
    actions.register::<(), String, _>(
        "system::health::ping",
        Permission::new("system.dashboard.read").map_err(|_| LiveError::InvalidPermission)?,
        |_, ()| Ok(String::from("pong")),
    )?;
    LiveRuntime::new(signing_key, 4_096, actions)
}
