#![no_implicit_prelude]
#![deny(unsafe_code)]

use crate::panels::runtime::state::PanelState;
use crate::axum::Router;
use crate::feluqa;
use crate::panels::system::controllers as panels;
use crate::std::clone::Clone;
use crate::std::convert::From;
use crate::std::default::Default;
use crate::std::result::Result;
use crate::std::result::Result::Ok;
use crate::std::string::String;
use crate::std::vec::Vec;
use feluqa::auth::Permission;
use feluqa::live::{ActionRegistry, LiveError, LiveRuntime};
use feluqa::web::Route;

/// Routes shared by Live-enabled application panels.
pub fn routes(state: &PanelState) -> Router<PanelState> {
    Route::<PanelState>::new()
        .get("/live/snapshots/{action}", panels::live_snapshot)
        .post("/live/actions", panels::live_action)
        .authenticated(state.core.clone())
        .finish()
}

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
