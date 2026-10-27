#![no_implicit_prelude]

pub mod controllers;
pub mod model;
pub mod policies;
pub mod providers;
pub mod resource;
pub mod services;
mod validation;

pub use providers::{CrmPanelProvider, CrmServiceProvider};
pub mod view;

pub mod seeders;
