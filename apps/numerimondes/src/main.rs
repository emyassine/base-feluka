#![no_implicit_prelude]
#![deny(unsafe_code)]
#![deny(unused_must_use)]

extern crate axum;
extern crate feluqa;
extern crate serde;
extern crate std;
extern crate tokio;
extern crate toml;
extern crate tower_http;

mod config;
mod handlers;
mod routes;

use std::boxed::Box;
use std::error::Error;
use std::format;
use std::net::SocketAddr;
use std::println;
use std::result::Result::{self, Ok};
use std::str::FromStr;

use tokio::net::TcpListener;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    if !routes::console::run()? {
        return Ok(());
    }
    let config = config::AppConfig::load_default()?;
    let address = SocketAddr::from_str(&format!("{}:{}", config.app.host, config.app.port))?;
    let listener = TcpListener::bind(address).await?;
    let router = routes::web::routes();

    println!(
        "{} ({}) listening on http://{}",
        config.app.name, config.app.profile, address
    );
    axum::serve(listener, router).await?;
    Ok(())
}
