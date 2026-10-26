#![no_implicit_prelude]

extern crate std;

use std::collections::BTreeMap;
use std::convert::From;
use std::format;
use std::option::Option::Some;
use std::string::String;
use std::time::Instant;

use crate::axum::response::Html;

mod generated_views {
    include!(concat!(env!("OUT_DIR"), "/views.rs"));
}

pub async fn home() -> Html<String> {
    let started_at = Instant::now();
    let values = page_values("Get started");
    let html = generated_views::home(|name| match name {
        "request_time" => Some(format!(
            "{:.3}",
            started_at.elapsed().as_secs_f64() * 1_000.0
        )),
        _ => values.get(name).map(|value| String::from(*value)),
    })
    .unwrap_or_else(|error| format!("View error: {error}"));
    Html(html)
}

pub async fn about() -> Html<String> {
    let started_at = Instant::now();
    let values = page_values("About");
    let html = generated_views::about(|name| match name {
        "request_time" => Some(format!(
            "{:.3}",
            started_at.elapsed().as_secs_f64() * 1_000.0
        )),
        _ => values.get(name).map(|value| String::from(*value)),
    })
    .unwrap_or_else(|error| format!("View error: {error}"));
    Html(html)
}

fn page_values(title: &'static str) -> BTreeMap<&'static str, &'static str> {
    BTreeMap::from([
        ("title", title),
        ("company", "NUMERIMONDES"),
        ("legal_form", "SARL à associé unique"),
        ("capital", "100,000 MAD"),
        (
            "address",
            "10 Rue de la Liberté, 3rd floor, apartment 5, Belvédère, Casablanca",
        ),
        (
            "registration",
            "RC 152844 · ICE 003396233000077 · IF 60132844",
        ),
        ("manager", "Yassine EL MOUMEN, Founder and Manager"),
    ])
}
