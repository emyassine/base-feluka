#![no_implicit_prelude]
#![deny(unsafe_code)]

use crate::feluqa;
use crate::std::convert::From;
use crate::std::default::Default;
use crate::std::result::Result;
use crate::std::result::Result::Ok;
use crate::std::string::String;
use crate::std::vec::Vec;
use feluqa::auth::Permission;
use feluqa::live::{ActionRegistry, LiveError, LiveRuntime};

/// Construct Numerimondes' registered Live actions around an application secret.
pub fn runtime(signing_key: Vec<u8>) -> Result<LiveRuntime, LiveError> {
    let mut actions = ActionRegistry::default();
    actions.register::<(), String, _>(
        "system::health::ping",
        Permission::new("system.dashboard.read").map_err(|_| LiveError::InvalidPermission)?,
        |_, ()| Ok(String::from("pong")),
    )?;
    LiveRuntime::new(signing_key, 4_096, actions)
}
