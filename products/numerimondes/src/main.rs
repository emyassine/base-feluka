#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(unused_must_use)]

extern crate axum;
extern crate feluqa;
extern crate sea_orm;
extern crate serde;
extern crate serde_json;
extern crate std;
extern crate subtle;
extern crate tokio;
#[cfg(test)]
extern crate tower;
extern crate tower_http;

mod panels {
    #[path = "business/panel_business.rs"]
    pub mod business;
    #[path = "system/panel_system.rs"]
    pub mod system;
    #[path = "site/panel_site.rs"]
    pub mod site;
    #[path = "runtime.rs"]
    pub mod runtime;
    #[path = "web.rs"]
    pub mod web;
}

use std::boxed::Box;
use std::error::Error;
use std::result::Result;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let business = panels::business::declaration()?;
    let catalogue = feluqa::system_panel::catalogue_with(business)?;
    panels::runtime::run(catalogue).await
}

#[cfg(test)]
#[path = "../tests/support/app.rs"]
mod app_tests;
